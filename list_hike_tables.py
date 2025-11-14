import os
import psycopg2

conn = psycopg2.connect(host="35.230.146.79", port=5432, user="hike_admin", password="foaA99&I5Und!k", dbname="hikes_db")
cur = conn.cursor()
cur.execute("""
SELECT table_name
FROM information_schema.tables
WHERE table_schema='public'
ORDER BY table_name;
""")
for (table,) in cur.fetchall():
    if table.startswith('hikes') or table in ('countries','months','sceneries'):
        print(table)
cur.close()
conn.close()
