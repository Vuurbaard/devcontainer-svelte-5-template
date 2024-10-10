import { fail, redirect } from "@sveltejs/kit";
import { invalidateSession } from "$lib/server/sessions";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	if (!event.locals.session) {
		redirect(302, "/login");
	}

	await invalidateSession(event.locals.session.id);
	event.cookies.set("session", "", {	path: "/", maxAge: 0 });

	return redirect(302, "/");
}