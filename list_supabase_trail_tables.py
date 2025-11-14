import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("""
SELECT table_name
FROM information_schema.tables
WHERE table_schema='public'
  AND table_name LIKE 'trail%'
ORDER BY table_name;
""")
for (table,) in cur.fetchall():
    cur.execute(f"SELECT COUNT(*) FROM {table}")
    print(f"{table}: {cur.fetchone()[0]}")
cur.close()
conn.close()
