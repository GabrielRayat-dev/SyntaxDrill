import type { Snippet } from "@/types";

export const DATABASE_SNIPPETS: Snippet[] = [
  {
    id: "db-node-pg-connect",
    language: "javascript",
    concepts: ["database"],
    difficulty: "beginner",
    title: "Connect to Postgres (Node)",
    explanation:
      "A pg client connects to a database URL; `connect` opens the pool, `query` runs SQL, `end` closes it.",
    code: `const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  const result = await client.query("SELECT NOW() AS now");
  console.log(result.rows[0]);
  await client.end();
}

main().catch((err) => console.error(err));`,
  },
  {
    id: "db-sql-join",
    language: "sql",
    concepts: ["database"],
    difficulty: "beginner",
    title: "A JOIN query",
    explanation:
      "`JOIN` combines two tables on a matching column; `WHERE` filters, `ORDER BY` sorts the result.",
    code: `SELECT users.name, orders.total
FROM users
JOIN orders ON orders.user_id = users.id
WHERE orders.status = 'paid'
ORDER BY orders.total DESC;`,
  },
  {
    id: "db-python-orm",
    language: "python",
    concepts: ["database"],
    difficulty: "intermediate",
    title: "Query with SQLAlchemy",
    explanation:
      "SQLAlchemy builds SQL from Python expressions; a `with` block manages the connection lifecycle.",
    code: `from sqlalchemy import create_engine, select
from models import User

engine = create_engine("postgresql://localhost/app")
with engine.connect() as conn:
    names = conn.execute(
        select(User.name).where(User.active.is_(True))
    ).scalars().all()
print(names)`,
  },
  {
    id: "db-sql-transaction",
    language: "sql",
    concepts: ["database"],
    difficulty: "intermediate",
    title: "A transaction",
    explanation:
      "`BEGIN` ... `COMMIT` groups statements into one atomic unit — all succeed or none do.",
    code: `BEGIN;

INSERT INTO users (name, email)
VALUES ('Ada', 'ada@example.com');

UPDATE users
SET status = 'verified'
WHERE email = 'ada@example.com';

COMMIT;`,
  },
];
