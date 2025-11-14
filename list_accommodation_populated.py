import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("SELECT id, title, accommodation IS NOT NULL FROM hikes ORDER BY id")
for row in cur.fetchall():
    if row[2]:
        print(row[0], row[1], 'HAS DATA')
cur.close()
conn.close()
