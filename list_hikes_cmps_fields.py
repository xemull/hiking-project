import psycopg2
conn = psycopg2.connect(host="35.230.146.79", port=5432, user="hike_admin", password="foaA99&I5Und!k", dbname="hikes_db")
cur = conn.cursor()
cur.execute("SELECT DISTINCT field FROM hikes_cmps ORDER BY field")
for (field,) in cur.fetchall():
    print(field)
cur.close()
conn.close()
