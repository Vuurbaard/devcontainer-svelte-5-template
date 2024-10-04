import { OAuth2RequestError } from 'arctic';
import { google, lucia } from '$lib/server/auth';
import type { RequestEvent } from '@sveltejs/kit';

interface GoogleUser {
	sub: string; // Unique identifier for the user
	name: string; // Full name of the user
	email: string; // Email address of the user
}


export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const codeVerifier = event.cookies.get('google_oauth_code_verifier');
	const storedState = event.cookies.get('google_oauth_state') ?? null;

	if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);
		const googleUserResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const googleUser: GoogleUser = await googleUserResponse.json();

		console.log(googleUser);

		// Check if the user exists by email
		const existingUser = await prisma.user.findUnique({
			where: {
				email: googleUser.email
			}
		});

		if (existingUser) {
			// If user exists but does not have a Google ID, update their record
			if (!existingUser.googleId) {
				await prisma.user.update({
					where: {
						email: googleUser.email
					},
					data: {
						googleId: googleUser.sub
					}
				});
			}

			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			// Create a new user if not found
			const newUser = await prisma.user.create({
				data: {
					name: googleUser.name,
					email: googleUser.email,
					googleId: googleUser.sub,
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
