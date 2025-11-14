import json
import os
from psycopg2 import connect, sql
from psycopg2.extras import execute_values, Json

backup_path = os.path.join('backups', 'cloudsql_tmb_export', 'tmb_snapshot.json')
with open(backup_path, 'r', encoding='utf-8') as fh:
    snapshot = json.load(fh)

TABLE_ORDER = [
    "tmb_stages",
    "tmbaccommodations",
    "tmbaccommodations_cmps",
    "tmbaccommodations_stage_lnk"
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

print("Truncating target tables...")
cur.execute("TRUNCATE tmbaccommodations_stage_lnk, tmbaccommodations_cmps, tmbaccommodations, tmb_stages RESTART IDENTITY CASCADE")

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
    execute_values(cur, insert_sql.as_string(cur), prepared_rows)
    print(f"Inserted {len(rows)} rows into {table}")

for table in TABLE_ORDER:
    cur.execute(sql.SQL("SELECT COALESCE(MAX(id), 0) FROM {}" ).format(sql.Identifier(table)))
    max_id = cur.fetchone()[0]
    next_val = max_id if max_id else 1
    cur.execute("SELECT setval(pg_get_serial_sequence(%s, 'id'), %s, %s)", (table, next_val, bool(max_id)))

conn.commit()
cur.close()
conn.close()
print("Supabase import complete.")
