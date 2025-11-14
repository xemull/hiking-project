import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("SELECT data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='hikes' AND column_name='accommodation'")
print(cur.fetchone())
cur.execute("SELECT id, title, accommodation FROM hikes ORDER BY id LIMIT 5")
for row in cur.fetchall():
    print(row[0], row[1], type(row[2]), str(row[2])[:80])
cur.close()
conn.close()
