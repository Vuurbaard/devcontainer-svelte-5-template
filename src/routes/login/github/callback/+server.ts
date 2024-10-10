import { OAuth2RequestError } from 'arctic';
import { github } from '$lib/server/auth';
import type { RequestEvent } from '@sveltejs/kit';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/sessions';

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

		const primaryEmail = emails.find((email: { email: string; primary: boolean }) => email.primary)?.email;
		githubUser.email = primaryEmail ?? githubUser.email;

		// Check if the user exists by email
		const existingUser = await prisma.user.findUnique({
			where: {
				email: githubUser.email
			}
		});

		if (existingUser) {
			// If user exists but does not have a GitHub ID, update their record
			if (!existingUser.githubId) {
				await prisma.user.update({
					where: {
						email: githubUser.email
					},
					data: {
						githubId: githubUser.id.toString()
					}
				});
			}

			const token = generateSessionToken();
			const session = await createSession(token, existingUser.id);
			setSessionTokenCookie(event, token, session.expiresAt);
		}
		else {
			// Create a new user if not found
			const newUser = await prisma.user.create({
				data: {
					name: githubUser.name || githubUser.login,
					email: githubUser.email ?? '',
					githubId: githubUser.id.toString(),
					googleId: '',  // For future Google OAuth
					discordId: ''  // For future Discord OAuth
				}
			});

			const token = generateSessionToken();
			const session = await createSession(token, existingUser.id);
			setSessionTokenCookie(event, token, session.expiresAt);
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

