import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { hash } from "@node-rs/argon2";

import type { Actions } from "./$types";

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get("username");
		const name = formData.get("name");
		const email = formData.get("email");
		const password = formData.get("password");

		// Logging form data for debugging
		console.log("Form Data:", { username, name, email, password });

		// Validate username
		if (typeof username !== "string" || username.length < 3 || username.length > 31) {
			console.log("Invalid username:", username);
			return fail(400, { message: "Invalid username" });
		}

		// Validate name
		if (typeof name !== "string" || name.length < 3 || name.length > 255) {
			console.log("Invalid name:", name);
			return fail(400, { message: "Invalid name" });
		}

		// Validate email
		if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
			console.log("Invalid email:", email);
			return fail(400, { message: "Invalid email address" });
		}

		// Validate password
		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			console.log("Invalid password length:", password.length);
			return fail(400, { message: "Invalid password" });
		}

		// Check if the email already exists
		const existingUserByEmail = await prisma.user.findUnique({
			where: { email: email }
		});
		console.log("Existing user by email:", existingUserByEmail);

		// Check if the username is already taken by another user
		const existingUserByUsername = await prisma.user.findUnique({
			where: { username: username }
		});
		console.log("Existing user by username:", existingUserByUsername);

		// If email exists, merge account
		if (existingUserByEmail) {
			console.log("Email already in use:", email);

			// Check if the user owns the same username
			if (existingUserByUsername && existingUserByUsername.id !== existingUserByEmail.id) {
				console.log("Username already taken by another user:", username);
				return fail(400, { message: "Username is already taken by another user. Please choose a different one." });
			}

			// Hash the password for the existing user
			const passwordHash = await hash(password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			console.log("Password hashed for account merge");

			// Merge by updating the existing OAuth user with the password
			await prisma.user.update({
				where: { email: email },
				data: {
					username: existingUserByEmail.username || username,
					name: existingUserByEmail.name || name,
					passwordHash: passwordHash
				}
			});
			console.log("User account merged with email:", email);

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
			console.log("Username already taken:", username);
			return fail(400, { message: "Username is already taken. Please choose a different one." });
		}

		// Hash the password for the new user
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		console.log("Password hashed for new user");

		// Create a new user in the database
		const newUser = await prisma.user.create({
			data: {
				username: username,
				name: name,
				email: email,
				passwordHash: passwordHash,
				googleId: "",  // Placeholder for future Google OAuth
				discordId: ""  // Placeholder for future Discord OAuth
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
