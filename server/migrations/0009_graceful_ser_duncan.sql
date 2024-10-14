ALTER TABLE "two-factor-tokens" ADD COLUMN "userID" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two-factor-tokens" ADD CONSTRAINT "two-factor-tokens_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
