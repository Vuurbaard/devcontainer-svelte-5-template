import { OAuth2RequestError } from 'arctic';
import { discord } from '$lib/server/oauth';
import type { RequestEvent } from '@sveltejs/kit';
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/sessions';

interface DiscordUser {
	id: string;
	username: string;
	discriminator: string;
	global_name: string | null;
	avatar: string | null;
	bot?: boolean;
	system?: boolean;
	mfa_enabled?: boolean;
	verified?: boolean;
	email?: string | null;
	flags?: number;
	banner?: string | null;
	accent_color?: number | null;
	premium_type?: number;
	public_flags?: number;
	locale?: string;
	avatar_decoration?: string | null;
}

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('discord_oauth_state') ?? null;

	console.log("code:", code);
	console.log("state:", state);
	console.log("storedState:", storedState);

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await discord.validateAuthorizationCode(code);

		// Fetch the Discord user information
		const discordUserResponse = await fetch('https://discord.com/api/users/@me', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const discordUser = await discordUserResponse.json();

		console.log(discordUser);

		// If email is not available (you must have requested the `email` scope to get this)
		if (!discordUser.email) {
			return new Response('Email not available from Discord', {
				status: 400
			});
		}

		// Check if the user exists by email
		const existingUser = await prisma.user.findUnique({
			where: {
				email: discordUser.email
			}
		});

		if (existingUser) {
			// If user exists but does not have a Discord ID, update their record
			if (!existingUser.discordId) {
				await prisma.user.update({
					where: {
						email: discordUser.email
					},
					data: {
						discordId: discordUser.id
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
					name: `${discordUser.username}`, // Use Discord username as the display name
					email: discordUser.email,
					emailVerified: true,
					discordId: discordUser.id,
				}
			});

			const token = generateSessionToken();
			const session = await createSession(token, newUser.id);
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
