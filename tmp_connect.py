import psycopg2
from psycopg2 import OperationalError

def try_connect(host, db):
    print(f"\nConnecting to {host} / {db}...")
    try:
        conn = psycopg2.connect(
            host=host,
            port=5432,
            user="hike_admin",
            password="foaA99&I5Und!k",
            database=db,
            connect_timeout=10,
            sslmode="require"
        )
        cur = conn.cursor()
        cur.execute("SELECT NOW();")
        print("  Connected. Server time:", cur.fetchone()[0])
        cur.close()
        conn.close()
    except OperationalError as exc:
        print("  Connection failed:", exc)

for host in ("34.39.30.216", "35.230.146.79", "34.39.12.47"):
    for db in ("postgres", "hikes_db", "strapi_test", "strapi_content"):
        try_connect(host, db)
