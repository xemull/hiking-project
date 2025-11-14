import json
import os
from psycopg2 import connect
from psycopg2.extras import Json
backup_path = os.path.join('backups', 'strapi_hikes_export', 'hikes_snapshot.json')
with open(backup_path, 'r', encoding='utf-8') as fh:
    snapshot = json.load(fh)
rows = snapshot.get('hikes', [])
conn = connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, dbname="postgres", user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", sslmode="require")
cur = conn.cursor()
updated = 0
for row in rows:
    acc = row.get('accommodation')
    cur.execute("UPDATE hikes SET accommodation=%s WHERE id=%s", (Json(acc) if acc is not None else None, row['id']))
    if cur.rowcount:
        updated += 1
conn.commit()
cur.close()
conn.close()
print('Updated accommodation for', updated, 'rows')
