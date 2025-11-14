import psycopg2, json
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("SELECT id, name, ST_AsGeoJSON(track) AS geojson FROM trails ORDER BY id LIMIT 1")
row = cur.fetchone()
print('Trail sample:', row[0], row[1], len(json.loads(row[2])['coordinates']))
cur.close()
conn.close()
