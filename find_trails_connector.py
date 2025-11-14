from google.cloud.sql.connector import Connector
import psycopg2

instances = [
    ("trailhead-mvp:europe-west2:hiking-project-db-233ae46e", "postgres"),
    ("trailhead-mvp:europe-west2:hiking-project-db-233ae46e", "hikes_db"),
    ("trailhead-mvp:europe-west2:hiking-project-db-233ae46e", "strapi_content")
]

connector = Connector()

for conn_name, db in instances:
    try:
        conn = connector.connect(
            conn_name,
            "pg8000",
            user="hike_admin",
            password="foaA99&I5Und!k",
            db=db
        )
        cur = conn.cursor()
        cur.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema='public'
              AND table_name IN ('trails','trail_segments','trails_gpx')
        """)
        tables = [row[0] for row in cur.fetchall()]
        if tables:
            print(f"{conn_name} / {db}: {tables}")
            for table in tables:
                cur.execute(f"SELECT COUNT(*) FROM {table}")
                print(f"  {table}: {cur.fetchone()[0]}")
        else:
            print(f"{conn_name} / {db}: no trail tables")
        cur.close()
        conn.close()
    except Exception as exc:
        print(f"{conn_name} / {db}: {exc}")

connector.close()
