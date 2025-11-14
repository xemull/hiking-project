import psycopg2
conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    port=6543,
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    database="postgres",
    sslmode="require"
)
cur = conn.cursor()
cur.execute("""
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public'
    ORDER BY table_name;
""")
tables = cur.fetchall()
print("tables:")
for (t,) in tables:
    cur.execute(f"SELECT COUNT(*) FROM {t};")
    count = cur.fetchone()[0]
    print(f"  {t}: {count}")
cur.close()
conn.close()
