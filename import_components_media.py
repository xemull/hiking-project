import json
import os
from psycopg2 import connect, sql
from psycopg2.extras import execute_values, Json

backup_path = os.path.join('backups', 'strapi_components_media_export', 'components_media_snapshot.json')
with open(backup_path, 'r', encoding='utf-8') as fh:
    snapshot = json.load(fh)

TABLE_ORDER = [
    "components_hike_blogs",
    "components_hike_books",
    "components_hike_landmarks",
    "components_hike_videos",
    "accommodations",
    "accommodations_hikes_lnk",
    "upload_folders",
    "upload_folders_parent_lnk",
    "files",
    "files_folder_lnk",
    "files_related_mph"
]

TRUNCATE_ORDER = [
    "files_related_mph",
    "files_folder_lnk",
    "files",
    "upload_folders_parent_lnk",
    "upload_folders",
    "accommodations_hikes_lnk",
    "accommodations",
    "components_hike_videos",
    "components_hike_landmarks",
    "components_hike_books",
    "components_hike_blogs"
]

conn = connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    port=6543,
    dbname="postgres",
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    sslmode="require"
)
cur = conn.cursor()

print("Truncating component/media tables...")
cur.execute("TRUNCATE " + ', '.join(TRUNCATE_ORDER) + " RESTART IDENTITY CASCADE")

for table in TABLE_ORDER:
    rows = snapshot.get(table, [])
    if not rows:
        print(f"Skipping {table}: no rows")
        continue
    columns = list(rows[0].keys())
    prepared_rows = []
    for row in rows:
        prepared = []
        for col in columns:
            value = row.get(col)
            if isinstance(value, (dict, list)):
                prepared.append(Json(value))
            else:
                prepared.append(value)
        prepared_rows.append(tuple(prepared))
    insert_sql = sql.SQL("INSERT INTO {table} ({cols}) VALUES %s").format(
        table=sql.Identifier(table),
        cols=sql.SQL(', ').join(sql.Identifier(col) for col in columns)
    )
    execute_values(cur, insert_sql.as_string(cur), prepared_rows, page_size=100)
    print(f"Inserted {len(rows)} rows into {table}")

for table in TABLE_ORDER:
    cur.execute(sql.SQL("SELECT COALESCE(MAX(id), 0) FROM {}" ).format(sql.Identifier(table)))
    max_id = cur.fetchone()[0]
    next_val = max_id if max_id else 1
    cur.execute("SELECT setval(pg_get_serial_sequence(%s, 'id'), %s, %s)", (table, next_val, bool(max_id)))

conn.commit()
cur.close()
conn.close()
print("Component/media import complete.")
