import { nanoid } from 'nanoid'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { user } from '@/db/schema/user'
import { agents } from '@/db/schema/agents'

const meetingStatus = pgEnum('meeting_status', ['upcoming', 'active', 'completed', 'processing', 'cancelled'])

export const meetings = pgTable('meetings', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	agentId: text('agent_id')
		.notNull()
		.references(() => agents.id, { onDelete: 'cascade' }),
	status: meetingStatus('status').notNull().default('upcoming'),
	startedAt: timestamp('started_at'),
	endedAt: timestamp('ended_at'),
	transcriptUrl: text('transcript_url'),
	recordingUrl: text('recording_url'),
	summary: text('summary'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
