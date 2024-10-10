import { fail, redirect } from "@sveltejs/kit";
import { verify } from "@node-rs/argon2";
import { z } from 'zod';

import type { Actions } from "./$types";
import { alphabet, generateRandomString } from "oslo/crypto";
import { createDate, TimeSpan } from "oslo";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/sessions";

// Define a schema for login validation
const loginSchema = z.object({
	username: z.string().min(3, { message: 'Username must be at least 3 characters long' }).max(31, { message: 'Username must be at most 31 characters long' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).max(255, { message: 'Password must be at most 255 characters long' })
});

// Load function to redirect logged-in users
export const load = async (event) => {
	if (event.locals.user) {
		throw redirect(302, "/");
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get("username");
		const password = formData.get("password");

		// Validate the form data using the login schema
		const parseResult = loginSchema.safeParse({ username, password });

		// Handle validation errors
		if (!parseResult.success) {
			const errors = parseResult.error.errors.reduce((acc, err) => {
				acc[err.path[0]] = err.message;
				return acc;
			}, {} as Record<string, string>);

			return fail(400, { errors });
		}

		// Extract validated data
		const { username: validatedUsername, password: validatedPassword } = parseResult.data;

		// Fetch user from the database by username
		const existingUser = await prisma.user.findUnique({
			where: {
				username: validatedUsername
			}
		});

		// If the user doesn't exist or invalid username, return error
		if (!existingUser) {
			return fail(400, { message: "Incorrect username or password" });
		}

		// Verify password
		const validPassword = await verify(existingUser.passwordHash, validatedPassword, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// If the password is incorrect, return error
		if (!validPassword) {
			return fail(400, { message: "Incorrect username or password" });
		}

		// If the user's email is not verified, redirect to email verification page
		if (!existingUser.emailVerified) {

			const newCode = await generateEmailVerificationCode(existingUser.id, existingUser.email);
			await sendVerificationCodeEmail(existingUser.email, newCode);

			redirect(302, "/signup/email-verification?email=" + encodeURIComponent(existingUser.email));
		}

		// Create session for the authenticated user
		const token = generateSessionToken();
		const session = await createSession(token, existingUser.id);
		setSessionTokenCookie(event, token, session.expiresAt);

		// Redirect to the homepage after successful sign-in
		throw redirect(302, "/");
	}
};


async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
	// Delete any existing email verification code for the user
	await prisma.emailVerificationCode.deleteMany({
		where: {
			userId: userId
		}
	});

	// Generate a random verification code
	const code = generateRandomString(8, alphabet("0-9"));

	// Insert the new verification code with a 15-minute expiration time
	await prisma.emailVerificationCode.create({
		data: {
			userId: userId,
			email: email,
			code: code,
			expiresAt: createDate(new TimeSpan(1, "h"))
		}
	});

	return code;
}

async function sendVerificationCodeEmail(email: string, code: string) {
	// Send the verification email
	console.log("Sending verification email to:", email, "with code:", code);
}