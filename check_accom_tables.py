import psycopg2
conn = psycopg2.connect(host="35.230.146.79", port=5432, user="hike_admin", password="foaA99&I5Und!k", dbname="hikes_db")
cur = conn.cursor()
for table in ('accommodations','accommodations_hikes_lnk','tmbaccommodations','tmbaccommodations_stage_lnk'):
    try:
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        print(f"{table}: {cur.fetchone()[0]}")
    except psycopg2.Error as exc:
        print(f"{table}: {exc}")
cur.close()
conn.close()
