import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { verify } from "@node-rs/argon2";
import { z } from 'zod';

import type { Actions } from "./$types";

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

		console.log("Form Data:", { username, password });

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
			console.log("User not found:", validatedUsername);
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
			console.log("Incorrect password for user:", validatedUsername);
			return fail(400, { message: "Incorrect username or password" });
		}

		// Create session for the authenticated user
		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		// Set the session cookie
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		// Redirect to the homepage after successful sign-in
		throw redirect(302, "/");
	}
};
