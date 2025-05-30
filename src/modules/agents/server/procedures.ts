import z from 'zod'
import { eq, getTableColumns, sql } from 'drizzle-orm'

import { db } from '@/db'
import { agents } from '@/db/schema/agents'
import { agentsInsertSchema } from '@/modules/agents/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const agentsRouter = createTRPCRouter({
	create: protectedProcedure.input(agentsInsertSchema).mutation(async ({ ctx, input }) => {
		const [createdAgent] = await db
			.insert(agents)
			.values({
				...input,
				userId: ctx.auth.user.id,
			})
			.returning()

		return createdAgent
	}),

	getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
		const [existingAgent] = await db
			.select({
				//TODO: Change to actual meeting count
				meetingCount: sql`array_agg(meetings.id)`,
				...getTableColumns(agents),
			})
			.from(agents)
			.where(eq(agents.id, input.id))

		return existingAgent
	}),

	getMany: protectedProcedure.query(async () => {
		const data = await db.select().from(agents)

		return data
	}),
})
