import { fail, redirect } from "@sveltejs/kit";
import { lucia } from "$lib/server/oauth";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	if (!event.locals.session) {
		redirect(302, "/login");
	}
	await lucia.invalidateSession(event.locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: ".",
		...sessionCookie.attributes
	});
	return redirect(302, "/");
}