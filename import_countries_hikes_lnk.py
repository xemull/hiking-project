import json
import os
import psycopg2
path = os.path.join('backups', 'strapi_hikes_export', 'countries_hikes_lnk.json')
with open(path, 'r', encoding='utf-8') as fh:
    rows = json.load(fh)
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("TRUNCATE countries_hikes_lnk RESTART IDENTITY CASCADE")
for row in rows:
    cur.execute("INSERT INTO countries_hikes_lnk (id, hike_id, country_id) VALUES (%s, %s, %s)", (row['id'], row['hike_id'], row['country_id']))
conn.commit()
cur.close()
conn.close()
print(f"Imported {len(rows)} rows into countries_hikes_lnk.")
