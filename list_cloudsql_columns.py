import psycopg2
conn = psycopg2.connect(host="35.230.146.79", port=5432, user="hike_admin", password="foaA99&I5Und!k", dbname="hikes_db")
cur = conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='hikes' AND table_schema='public' ORDER BY ordinal_position")
print([col[0] for col in cur.fetchall()])
cur.close()
conn.close()
