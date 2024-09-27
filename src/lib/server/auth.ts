import { Lucia } from "lucia";
// import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { dev } from "$app/environment";
import { db } from "./db";
import { GitHub, Google } from "arctic";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";

// import type { DatabaseUser } from "./db";

// const adapter = new BetterSqlite3Adapter(db, {
// 	user: "user",
// 	session: "session"
// });

import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";

// const client = new PrismaClient();

const adapter = new PrismaAdapter(prisma.session, prisma.user);


export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes: any) => {
		return {
			username: attributes.username,
			googleId: attributes.googleId,
			githubId: attributes.github_id,
			name: attributes.name
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		// DatabaseUserAttributes: Omit<DatabaseUser, "id">;
	}
}

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "http://localhost:5173/login/google/callback");