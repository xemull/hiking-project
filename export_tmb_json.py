import os
import json
from decimal import Decimal
from datetime import datetime
from google.cloud.sql.connector import Connector

TABLES = [
    "tmb_stages",
    "tmbaccommodations",
    "tmbaccommodations_cmps",
    "tmbaccommodations_stage_lnk"
]
backup_dir = os.path.join('backups', 'cloudsql_tmb_export')
os.makedirs(backup_dir, exist_ok=True)

connector = Connector()
conn = connector.connect(
    "trailhead-mvp:europe-west2:trailhead-new-db",
    "pg8000",
    user="hike_admin",
    password="foaA99&I5Und!k",
    db="hikes_db"
)
cur = conn.cursor()

class EnhancedEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

snapshot = {}
for table in TABLES:
    cur.execute(f"SELECT * FROM {table} ORDER BY id")
    columns = [desc[0] for desc in cur.description]
    rows = [dict(zip(columns, row)) for row in cur.fetchall()]
    snapshot[table] = rows
    print(f"Fetched {table}: {len(rows)} rows")

path = os.path.join(backup_dir, 'tmb_snapshot.json')
with open(path, 'w', encoding='utf-8') as fh:
    json.dump(snapshot, fh, cls=EnhancedEncoder, ensure_ascii=False, indent=2)
print(f"Wrote JSON snapshot -> {path}")

cur.close()
conn.close()
connector.close()
