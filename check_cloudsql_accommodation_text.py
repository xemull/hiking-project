import psycopg2
conn = psycopg2.connect(host="35.230.146.79", port=5432, user="hike_admin", password="foaA99&I5Und!k", dbname="hikes_db")
cur = conn.cursor()
cur.execute("SELECT id, title, accommodation FROM hikes ORDER BY id LIMIT 5")
for row in cur.fetchall():
    print(row)
cur.close()
conn.close()
