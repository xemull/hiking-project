import psycopg2
conn = psycopg2.connect(host="35.230.146.79", port=5432, user="hike_admin", password="foaA99&I5Und!k", dbname="hikes_db")
cur = conn.cursor()
cur.execute("""
SELECT column_name
FROM information_schema.columns
WHERE table_schema='public' AND table_name='accommodations'
ORDER BY ordinal_position;
""")
for (col,) in cur.fetchall():
    print(col)
cur.close()
conn.close()
