import psycopg2, json
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("SELECT * FROM accommodations LIMIT 5")
cols = [desc[0] for desc in cur.description]
rows = cur.fetchall()
for row in rows:
    record = dict(zip(cols, row))
    print(json.dumps(record, default=str, indent=2))
cur.close()
conn.close()
