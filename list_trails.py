import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute('SELECT id, name FROM trails ORDER BY id')
rows = cur.fetchall()
for row in rows:
    print(row)
cur.close()
conn.close()
