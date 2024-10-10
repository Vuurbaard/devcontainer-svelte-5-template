import type { PrismaClient } from "@prisma/client";

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: Session | null;
		}
	}
	var prisma: PrismaClient;
}

export { };
