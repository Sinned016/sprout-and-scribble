ALTER TABLE "products" ALTER COLUMN "created" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "created" DROP NOT NULL;