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
    cur.execute(f"SELECT COUNT(*) FROM {table}")
    count = cur.fetchone()[0]
    if count > 0:
        print(f"{table}: {count}")
cur.close()
conn.close()
