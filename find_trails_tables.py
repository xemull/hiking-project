import psycopg2
hosts = ["35.230.146.79", "34.39.30.216", "34.39.12.47"]
dbs = ["postgres", "hikes_db", "strapi_test", "strapi_content"]
for host in hosts:
    for db in dbs:
        try:
            conn = psycopg2.connect(host=host, port=5432, user="hike_admin", password="foaA99&I5Und!k", dbname=db, connect_timeout=5)
            cur = conn.cursor()
            cur.execute("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema='public' AND table_name IN ('trails','trail_segments','trailpoints')
            """)
            tables = [t[0] for t in cur.fetchall()]
            if tables:
                print(f"{host} / {db}: {tables}")
                for table in tables:
                    cur.execute(f"SELECT COUNT(*) FROM {table}")
                    print(f"  {table}: {cur.fetchone()[0]}")
            cur.close()
            conn.close()
        except Exception as exc:
            print(f"{host} / {db}: {exc}")
