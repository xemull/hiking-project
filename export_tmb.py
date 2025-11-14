import os
import csv
from decimal import Decimal
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

for table in TABLES:
    cur.execute(f"SELECT * FROM {table} ORDER BY id")
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    path = os.path.join(backup_dir, f"{table}.csv")
    with open(path, 'w', encoding='utf-8', newline='') as fh:
        writer = csv.writer(fh)
        writer.writerow(columns)
        for row in rows:
            normalized = []
            for value in row:
                if isinstance(value, Decimal):
                    normalized.append(str(value))
                else:
                    normalized.append(value)
            writer.writerow(normalized)
    print(f"Exported {table} ({len(rows)} rows) -> {path}")

cur.close()
conn.close()
connector.close()
