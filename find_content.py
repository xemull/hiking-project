import psycopg2

def inspect(host, db):
    print(f"\n== {host} / {db} ==")
    conn = psycopg2.connect(host=host, port=5432, user="hike_admin", password="foaA99&I5Und!k", dbname=db, connect_timeout=5)
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema='public'
          AND table_name IN ('hikes','hikes_cmps','countries','sceneries','months','tmb_stages','tmbaccommodations')
        ORDER BY table_name;
    """)
    tables = [row[0] for row in cur.fetchall()]
    for table in tables:
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        print(f"  {table}: {cur.fetchone()[0]}")
    cur.close()
    conn.close()

for host in ("34.39.30.216", "35.230.146.79", "34.39.12.47"):
    for db in ("postgres", "hikes_db", "strapi_test", "strapi_content"):
        try:
            inspect(host, db)
        except Exception as exc:
            print(f"\n== {host} / {db} ==\n  ERROR: {exc}")
