import psycopg2, json
conn = psycopg2.connect(host="35.230.146.79", port=5432, user="hike_admin", password="foaA99&I5Und!k", dbname="hikes_db")
cur = conn.cursor()
cur.execute("SELECT * FROM hikes_cmps WHERE field='accommodation' LIMIT 5")
cols = [desc[0] for desc in cur.description]
rows = cur.fetchall()
for row in rows:
    record = dict(zip(cols, row))
    print(json.dumps(record, default=str, indent=2))
cur.close()
conn.close()
