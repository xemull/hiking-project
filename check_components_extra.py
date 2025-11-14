import psycopg2
conn = psycopg2.connect(host="35.230.146.79", port=5432, user="hike_admin", password="foaA99&I5Und!k", dbname="hikes_db")
cur = conn.cursor()
for table in ('components_accommodation_services',):
    cur.execute(f"SELECT COUNT(*) FROM {table}")
    print(f"{table}: {cur.fetchone()[0]}")
cur.close()
conn.close()
