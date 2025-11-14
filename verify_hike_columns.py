import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='hikes' ORDER BY ordinal_position")
print([col[0] for col in cur.fetchall()])
cur.execute("SELECT id, title, accommodation FROM hikes ORDER BY id LIMIT 1")
print(cur.fetchone())
cur.close()
conn.close()
