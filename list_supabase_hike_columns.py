import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("""
SELECT column_name
FROM information_schema.columns
WHERE table_schema='public' AND table_name='hikes'
ORDER BY ordinal_position;
""")
print('Supabase hikes columns:')
for (col,) in cur.fetchall():
    print('-', col)
cur.close()
conn.close()
