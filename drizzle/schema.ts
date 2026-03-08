import {
  pgSchema, uuid, text, timestamp, boolean,
  real, integer, jsonb
} from 'drizzle-orm/pg-core'
import { vector } from 'drizzle-orm/pg-core'

export const memoryiq = pgSchema('memoryiq')

export const brains = memoryiq.table('brains', {
  id:          uuid('id').primaryKey().defaultRandom(),
  name:        text('name').notNull(),
  type:        text('type').notNull(),
  description: text('description'),
  owner_id:    text('owner_id').notNull(),
  mcp_key:     text('mcp_key').notNull().unique(),
  created_at:  timestamp('created_at').defaultNow(),
  updated_at:  timestamp('updated_at').defaultNow(),
})

export const brain_members = memoryiq.table('brain_members', {
  id:         uuid('id').primaryKey().defaultRandom(),
  brain_id:   uuid('brain_id').notNull()
               .references(() => brains.id, { onDelete: 'cascade' }),
  user_id:    text('user_id').notNull(),
  role:       text('role').notNull(),
  invited_by: text('invited_by'),
  created_at: timestamp('created_at').defaultNow(),
})

export const thoughts = memoryiq.table('thoughts', {
  id:              uuid('id').primaryKey().defaultRandom(),
  brain_id:        uuid('brain_id').notNull()
                    .references(() => brains.id, { onDelete: 'cascade' }),
  content:         text('content').notNull(),
  embedding:       vector('embedding', { dimensions: 1536 }),
  metadata:        jsonb('metadata'),
  source_type:     text('source_type').notNull().default('web'),
  captured_by:     text('captured_by').notNull(),
  supersedes_id:   uuid('supersedes_id'),
  is_pinned:       boolean('is_pinned').notNull().default(false),
  is_archived:     boolean('is_archived').notNull().default(false),
  conflict_flag:   boolean('conflict_flag').notNull().default(false),
  staleness_score: real('staleness_score').notNull().default(0),
  created_at:      timestamp('created_at').defaultNow(),
  updated_at:      timestamp('updated_at').defaultNow(),
})

export const thought_links = memoryiq.table('thought_links', {
  id:                uuid('id').primaryKey().defaultRandom(),
  thought_id:        uuid('thought_id').notNull()
                      .references(() => thoughts.id, { onDelete: 'cascade' }),
  linked_thought_id: uuid('linked_thought_id').notNull()
                      .references(() => thoughts.id, { onDelete: 'cascade' }),
  link_type:         text('link_type').notNull(),
  similarity_score:  real('similarity_score'),
  created_at:        timestamp('created_at').defaultNow(),
})

export const ai_interactions = memoryiq.table('ai_interactions', {
  id:            uuid('id').primaryKey().defaultRandom(),
  thought_id:    uuid('thought_id')
                  .references(() => thoughts.id, { onDelete: 'set null' }),
  model:         text('model').notNull(),
  input_tokens:  integer('input_tokens'),
  output_tokens: integer('output_tokens'),
  cost_estimate: real('cost_estimate'),
  operation:     text('operation').notNull(),
  created_at:    timestamp('created_at').defaultNow(),
})

export const integrations = memoryiq.table('integrations', {
  id:         uuid('id').primaryKey().defaultRandom(),
  brain_id:   uuid('brain_id').notNull()
               .references(() => brains.id, { onDelete: 'cascade' }),
  user_id:    text('user_id').notNull(),
  type:       text('type').notNull(),
  config:     jsonb('config'),
  is_active:  boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
})
