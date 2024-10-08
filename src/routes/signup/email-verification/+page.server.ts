import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { isWithinExpirationDate } from "oslo";
import { z } from 'zod';

import type { Actions } from "./$types";
let codeExpired = false;
let email: string | undefined;

const codeSchema = z.object({
	code: z.string().min(8, { message: 'Code must be at least 8 characters long' }).max(8, { message: 'Code must be at most 8 characters long' }),
});

export const actions: Actions = {
	default: async (event) => {

		const formData = await event.request.formData();
		const code = formData.get("code");

		console.log("Form Data:", { code });

		const parseResult = codeSchema.safeParse({ code });

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
		const { code: validatedCode } = parseResult.data;


		// Fetch the user associated with this verification code
		const verificationCode = await prisma.emailVerificationCode.findFirst({
			where: { code: validatedCode }
		});

		// If no verification code found, or it's expired, fail
		if (!verificationCode || !isWithinExpirationDate(verificationCode.expiresAt)) {
			codeExpired = true;
			email = verificationCode?.email;
			return fail(400, { message: 'Invalid or expired verification code' });
		}

		// Fetch the user associated with the code
		const user = await prisma.user.findUnique({
			where: { id: verificationCode.userId }
		});

		if (!user) {
			return fail(400, { message: 'User not found' });
		}

		// If the emailadres on the verificationcode record does not match the user's email, fail
		if (verificationCode.email !== user.email) {
			return fail(400, { message: 'Email address associated with this code not valid, please request a new verification code.' });
		}

		// Update the user's emailVerified status
		await prisma.user.update({
			where: { id: user.id },
			data: { emailVerified: true }
		});

		// Invalidate all existing sessions for the user
		await lucia.invalidateUserSessions(user.id);

		// Delete the verification code after successful verification
		await prisma.emailVerificationCode.delete({
			where: { id: verificationCode.id }
		});

		// Optionally, instead of creating a session here, redirect to the login page
		throw redirect(302, "/login?emailVerified=true");
	}
}
