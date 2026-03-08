CREATE SCHEMA IF NOT EXISTS "memoryiq";
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "memoryiq"."ai_interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thought_id" uuid,
	"model" text NOT NULL,
	"input_tokens" integer,
	"output_tokens" integer,
	"cost_estimate" real,
	"operation" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "memoryiq"."brain_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brain_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"invited_by" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "memoryiq"."brains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"owner_id" text NOT NULL,
	"mcp_key" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "brains_mcp_key_unique" UNIQUE("mcp_key")
);
--> statement-breakpoint
CREATE TABLE "memoryiq"."integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brain_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"config" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "memoryiq"."thought_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thought_id" uuid NOT NULL,
	"linked_thought_id" uuid NOT NULL,
	"link_type" text NOT NULL,
	"similarity_score" real,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "memoryiq"."thoughts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brain_id" uuid NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536),
	"metadata" jsonb,
	"source_type" text DEFAULT 'web' NOT NULL,
	"captured_by" text NOT NULL,
	"supersedes_id" uuid,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"conflict_flag" boolean DEFAULT false NOT NULL,
	"staleness_score" real DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "memoryiq"."ai_interactions" ADD CONSTRAINT "ai_interactions_thought_id_thoughts_id_fk" FOREIGN KEY ("thought_id") REFERENCES "memoryiq"."thoughts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memoryiq"."brain_members" ADD CONSTRAINT "brain_members_brain_id_brains_id_fk" FOREIGN KEY ("brain_id") REFERENCES "memoryiq"."brains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memoryiq"."integrations" ADD CONSTRAINT "integrations_brain_id_brains_id_fk" FOREIGN KEY ("brain_id") REFERENCES "memoryiq"."brains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memoryiq"."thought_links" ADD CONSTRAINT "thought_links_thought_id_thoughts_id_fk" FOREIGN KEY ("thought_id") REFERENCES "memoryiq"."thoughts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memoryiq"."thought_links" ADD CONSTRAINT "thought_links_linked_thought_id_thoughts_id_fk" FOREIGN KEY ("linked_thought_id") REFERENCES "memoryiq"."thoughts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memoryiq"."thoughts" ADD CONSTRAINT "thoughts_brain_id_brains_id_fk" FOREIGN KEY ("brain_id") REFERENCES "memoryiq"."brains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE OR REPLACE FUNCTION memoryiq.match_thoughts(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count     int   DEFAULT 10,
  brain_ids       uuid[] DEFAULT NULL
)
RETURNS TABLE (
  id            uuid,
  brain_id      uuid,
  content       text,
  metadata      jsonb,
  source_type   text,
  captured_by   text,
  is_pinned     boolean,
  conflict_flag boolean,
  similarity    float,
  created_at    timestamptz
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.brain_id, t.content, t.metadata,
         t.source_type, t.captured_by, t.is_pinned,
         t.conflict_flag,
         1 - (t.embedding <=> query_embedding) AS similarity,
         t.created_at
  FROM memoryiq.thoughts t
  WHERE t.is_archived = false
    AND (brain_ids IS NULL OR t.brain_id = ANY(brain_ids))
    AND 1 - (t.embedding <=> query_embedding) > match_threshold
  ORDER BY t.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;