import os
import json
from google.cloud.sql.connector import Connector

connector = Connector()
conn = connector.connect(
    "trailhead-mvp:europe-west2:hiking-project-db-233ae46e",
    "pg8000",
    user="hike_admin",
    password="foaA99&I5Und!k",
    db="hikes_db"
)
cur = conn.cursor()
cur.execute("""
    SELECT id, name, simplified_profile, ST_AsEWKT(track) as track_wkt, created_at
    FROM trails
    ORDER BY id;
""")
rows = []
for row in cur.fetchall():
    rows.append({
        "id": row[0],
        "name": row[1],
        "simplified_profile": row[2],
        "track_wkt": row[3],
        "created_at": row[4].isoformat() if row[4] else None
    })
cur.close()
conn.close()
connector.close()

backup_dir = os.path.join('backups', 'trails_export')
os.makedirs(backup_dir, exist_ok=True)
path = os.path.join(backup_dir, 'trails.json')
with open(path, 'w', encoding='utf-8') as fh:
    json.dump(rows, fh, ensure_ascii=False, indent=2)
print(f"Exported {len(rows)} trails to {path}")
