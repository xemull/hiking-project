import os
import json
from decimal import Decimal
from datetime import datetime
from google.cloud.sql.connector import Connector

TABLES = [
    "countries",
    "months",
    "sceneries",
    "hikes",
    "hikes_cmps",
    "hikes_months_lnk",
    "hikes_sceneries_lnk"
]
backup_dir = os.path.join('backups', 'strapi_hikes_export')
os.makedirs(backup_dir, exist_ok=True)

connector = Connector()
conn = connector.connect(
    "trailhead-mvp:europe-west2:strapi-db",
    "pg8000",
    user="hike_admin",
    password="foaA99&I5Und!k",
    db="hikes_db"
)
cur = conn.cursor()

class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

snapshot = {}
for table in TABLES:
    cur.execute(f"SELECT * FROM {table} ORDER BY id")
    cols = [desc[0] for desc in cur.description]
    rows = [dict(zip(cols, row)) for row in cur.fetchall()]
    snapshot[table] = rows
    print(f"Exported {table}: {len(rows)} rows")

json_path = os.path.join(backup_dir, 'hikes_snapshot.json')
with open(json_path, 'w', encoding='utf-8') as fh:
    json.dump(snapshot, fh, cls=Encoder, ensure_ascii=False, indent=2)
print(f"Snapshot written to {json_path}")

cur.close()
conn.close()
connector.close()
