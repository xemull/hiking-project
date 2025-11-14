import os
import json
from google.cloud.sql.connector import Connector

connector = Connector()
conn = connector.connect(
    "trailhead-mvp:europe-west2:strapi-db",
    "pg8000",
    user="hike_admin",
    password="foaA99&I5Und!k",
    db="hikes_db"
)
cur = conn.cursor()
cur.execute("SELECT * FROM countries_hikes_lnk ORDER BY id")
cols = [desc[0] for desc in cur.description]
rows = [dict(zip(cols, row)) for row in cur.fetchall()]
cur.close()
conn.close()
connector.close()

path = os.path.join('backups', 'strapi_hikes_export', 'countries_hikes_lnk.json')
with open(path, 'w', encoding='utf-8') as fh:
    json.dump(rows, fh, ensure_ascii=False, indent=2)
print(f"Exported countries_hikes_lnk: {len(rows)} rows")
