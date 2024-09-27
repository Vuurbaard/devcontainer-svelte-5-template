import { OAuth2RequestError } from 'arctic';
import { github, lucia } from '$lib/server/auth'; // Assuming you have a GitHub auth module
import type { RequestEvent } from '@sveltejs/kit';

interface GitHubUser {
	id: string;  // Unique identifier for the user
	login: string;  // GitHub username
	email: string;  // Email address of the user
	name: string;  // Full name of the user (optional)
}

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;

	console.log("code:", code);
	console.log("state:", state);
	console.log("storedState:", storedState);

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);

		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await githubUserResponse.json();

		console.log(githubUser);

		const emailsResponse = await fetch('https://api.github.com/user/emails', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const emails = await emailsResponse.json();
		console.log(emails);

		// Find primary email (if exists)
		const primaryEmail = emails.find((email: { email: string; primary: boolean }) => email.primary)?.email;
		console.log(primaryEmail); // Now you can use this email for account linking

		githubUser.email = primaryEmail ?? githubUser.email;

		const existingGitHubUser = await prisma.user.findUnique({
			where: {
				githubId: githubUser.id.toString()
			}
		});

		console.log("existingGitHubUser:", existingGitHubUser);

		if (existingGitHubUser) {
			const session = await lucia.createSession(existingGitHubUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		else {
			const newUser = await prisma.user.create({
				data: {
					name: githubUser.name || githubUser.login, // Use login if name is missing
					email: githubUser.email ?? '', // GitHub might not always provide email
					githubId: githubUser.id.toString(),
					googleId: '' // Optional: leave empty if no GoogleId
				}
			});

			const session = await lucia.createSession(newUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}
	catch (e) {
		console.error(e);

		if (e instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}
