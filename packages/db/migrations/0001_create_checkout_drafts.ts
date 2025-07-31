import { sql } from "drizzle-orm";

export const up = async (db: any) => {
  await db.execute(sql`
    CREATE TABLE checkout_drafts (
      id TEXT PRIMARY KEY,
      customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
      session_id TEXT,
      draft_data JSONB NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  
  await db.execute(sql`
    CREATE INDEX checkout_drafts_customer_idx ON checkout_drafts(customer_id);
  `);
  
  await db.execute(sql`
    CREATE INDEX checkout_drafts_session_idx ON checkout_drafts(session_id);
  `);
  
  await db.execute(sql`
    CREATE INDEX checkout_drafts_updated_idx ON checkout_drafts(updated_at);
  `);
};

export const down = async (db: any) => {
  await db.execute(sql`
    DROP TABLE IF EXISTS checkout_drafts;
  `);
};
