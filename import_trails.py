import json
import os
import psycopg2
from psycopg2.extras import Json

path = os.path.join('backups', 'trails_export', 'trails.json')
with open(path, 'r', encoding='utf-8') as fh:
    trails = json.load(fh)

conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("TRUNCATE trails RESTART IDENTITY CASCADE")

for trail in trails:
    cur.execute(
        "INSERT INTO trails (id, name, simplified_profile, track, created_at) VALUES (%s, %s, %s, ST_GeomFromEWKT(%s), %s)",
        (trail['id'], trail['name'], Json(trail['simplified_profile']) if trail['simplified_profile'] is not None else None, trail['track_wkt'], trail['created_at'])
    )

conn.commit()
cur.close()
conn.close()
print(f"Imported {len(trails)} trails into Supabase.")
