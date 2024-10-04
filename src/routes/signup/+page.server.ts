import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { hash } from "@node-rs/argon2";
import { z } from 'zod';

import type { Actions } from "./$types";

// Define the validation schema with Zod
const userSchema = z.object({
	username: z.string().min(3, { message: 'Username must be at least 3 characters long' }).max(31, { message: 'Username must be at most 31 characters long' }),
	name: z.string().min(3, { message: 'Name must be at least 3 characters long' }).max(255, { message: 'Name must be at most 255 characters long' }),
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).max(255, { message: 'Password must be at most 255 characters long' }),
});

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get("username");
		const name = formData.get("name");
		const email = formData.get("email");
		const password = formData.get("password");

		// Logging form data for debugging
		console.log("Form Data:", { username, name, email, password });

		// Parse the input data using the validation schema
		const parseResult = userSchema.safeParse({ username, name, email, password });

		// Handle validation errors
		if (!parseResult.success) {
			console.log("Validation failed:", parseResult.error.errors);
			const errors = parseResult.error.errors.reduce((acc, err) => {
				acc[err.path[0]] = err.message;
				return acc;
			}, {} as Record<string, string>);

			// Fail with the specific validation error messages
			console.log("Validation errors:", errors);

			return fail(400, { errors });
		}

		// Extract validated data
		const { username: validatedUsername, name: validatedName, email: validatedEmail, password: validatedPassword } = parseResult.data;

		// Check if the email already exists
		const existingUserByEmail = await prisma.user.findUnique({
			where: { email: validatedEmail }
		});
		console.log("Existing user by email:", existingUserByEmail);

		// Check if the username is already taken by another user
		const existingUserByUsername = await prisma.user.findUnique({
			where: { username: validatedUsername }
		});
		console.log("Existing user by username:", existingUserByUsername);

		// If email exists, merge account
		if (existingUserByEmail) {
			console.log("Email already in use:", validatedEmail);

			// Check if the user owns the same username
			if (existingUserByUsername && existingUserByUsername.id !== existingUserByEmail.id) {
				console.log("Username already taken by another user:", validatedUsername);
				return fail(400, { message: "Username is already taken by another user. Please choose a different one." });
			}

			// Hash the password for the existing user
			const passwordHash = await hash(validatedPassword, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			console.log("Password hashed for account merge");

			// Merge by updating the existing OAuth user with the password
			await prisma.user.update({
				where: { email: validatedEmail },
				data: {
					username: existingUserByEmail.username || validatedUsername,
					name: existingUserByEmail.name || validatedName,
					passwordHash: passwordHash
				}
			});
			console.log("User account merged with email:", validatedEmail);

			// Create session for the existing user
			const session = await lucia.createSession(existingUserByEmail.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
			console.log("Session created and cookie set for existing user");

			// Redirect to the homepage
			throw redirect(302, "/");
		}

		// If no user exists with the email, check if the username is taken by someone else
		if (existingUserByUsername) {
			console.log("Username already taken:", validatedUsername);
			return fail(400, { message: "Username is already taken. Please choose a different one." });
		}

		// Hash the password for the new user
		const passwordHash = await hash(validatedPassword, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		console.log("Password hashed for new user");

		// Create a new user in the database
		const newUser = await prisma.user.create({
			data: {
				username: validatedUsername,
				name: validatedName,
				email: validatedEmail,
				passwordHash: passwordHash,
			}
		});
		console.log("New user created:", newUser);

		// Create session for the new user
		const session = await lucia.createSession(newUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		console.log("Session created and cookie set for new user");

		// Redirect to the homepage after successful signup
		throw redirect(302, "/");
	}
};
