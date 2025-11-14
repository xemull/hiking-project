import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("SELECT id, title, hike_id FROM hikes WHERE title ILIKE '%Camino%' OR title ILIKE '%Faros%'")
for row in cur.fetchall():
    print(row)
cur.close()
conn.close()
