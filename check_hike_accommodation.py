import psycopg2, json
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("SELECT id, title, accommodation FROM hikes WHERE id=92")
row = cur.fetchone()
print(row[0], row[1])
print(row[2])
cur.close()
conn.close()
