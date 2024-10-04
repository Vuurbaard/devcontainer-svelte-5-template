import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { verify } from "@node-rs/argon2";

import type { Actions } from "./$types";

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


		// Username validation
		if (
			typeof username !== "string" ||
			username.length < 3 ||
			username.length > 31
		) {
			console.log("Invalid username:", username);
			return fail(400, {
				message: "Invalid username"
			});
		}


		// Password validation
		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			console.log("Invalid password:", password);

			return fail(400, {
				message: "Invalid password"
			});
		}

		// Fetch user from the database by username
		const existingUser = await prisma.user.findUnique({
			where: {
				username: username
			}
		});

		// If the user doesn't exist or invalid username, return error
		if (!existingUser) {
			console.log("User not found:", username);

			return fail(400, {
				message: "Incorrect username or password"
			});
		}

		// Verify password
		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// If the password is incorrect, return error
		if (!validPassword) {
			console.log("Incorrect password for user:", username);
			return fail(400, {
				message: "Incorrect username or password"
			});
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
