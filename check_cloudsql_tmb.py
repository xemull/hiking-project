from google.cloud.sql.connector import Connector

connector = Connector()

instances = [
    ("trailhead-mvp:europe-west2:trailhead-new-db", "trailhead-new-db", ["postgres", "hikes_db", "strapi_test"]),
    ("trailhead-mvp:europe-west2:hiking-project-db-233ae46e", "hiking-project-db-233ae46e", ["postgres", "hikes_db", "strapi_content"])
]

for conn_name, label, databases in instances:
    print(f"\n=== Instance: {label} ({conn_name}) ===")
    for db in databases:
        print(f"\nDatabase: {db}")
        try:
            conn = connector.connect(
                conn_name,
                "pg8000",
                user="hike_admin",
                password="foaA99&I5Und!k",
                db=db
            )
        except Exception as exc:
            print(f"  Connection error: {exc}")
            continue

        cur = conn.cursor()
        try:
            cur.execute("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                  AND (table_name ILIKE '%tmb%' OR table_name ILIKE '%stage%')
                ORDER BY table_name;
            """)
            tables = [row[0] for row in cur.fetchall()]
            if not tables:
                print("  No TMB/stage tables found")
            else:
                for table in tables:
                    cur.execute(f"SELECT COUNT(*) FROM {table};")
                    count = cur.fetchone()[0]
                    print(f"  {table}: {count} rows")
        finally:
            cur.close()
            conn.close()

connector.close()
