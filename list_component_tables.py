import psycopg2
conn = psycopg2.connect(host="35.230.146.79", port=5432, user="hike_admin", password="foaA99&I5Und!k", dbname="hikes_db")
cur = conn.cursor()
cur.execute("""
SELECT c.relname
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname='public'
  AND c.relkind='r'
  AND c.relname LIKE 'components%'
ORDER BY c.relname;
""")
for (table,) in cur.fetchall():
    cur.execute(f"SELECT COUNT(*) FROM {table}")
    count = cur.fetchone()[0]
    if count:
        print(f"{table}: {count}")
print('\nMedia tables:')
for table in ('files','files_folder_lnk','files_related_mph','upload_folders','upload_folders_parent_lnk'):
    try:
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        print(f"  {table}: {cur.fetchone()[0]}")
    except psycopg2.Error as exc:
        print(f"  {table}: {exc}")
cur.close()
conn.close()
