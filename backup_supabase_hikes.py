import os
import json
from psycopg2 import connect

BACKUP_DIR = os.path.join('backups', 'supabase_hikes_backup')
os.makedirs(BACKUP_DIR, exist_ok=True)

conn = connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("SELECT * FROM hikes ORDER BY id")
cols = [desc[0] for desc in cur.description]
rows = [dict(zip(cols, row)) for row in cur.fetchall()]
path = os.path.join(BACKUP_DIR, 'hikes.json')
with open(path, 'w', encoding='utf-8') as fh:
    json.dump(rows, fh, default=str, ensure_ascii=False, indent=2)
print(f"Backed up {len(rows)} hikes to {path}")
cur.close()
conn.close()
