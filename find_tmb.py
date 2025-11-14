import psycopg2

def find_tables(db):
    print(f"\n=== Database: {db} ===")
    conn = psycopg2.connect(
        host="35.230.146.79",
        port=5432,
        user="hike_admin",
        password="foaA99&I5Und!k",
        database=db,
        connect_timeout=10,
        sslmode="require"
    )
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND (table_name ILIKE '%tmb%' OR table_name ILIKE '%stage%')
        ORDER BY table_name;
    """)
    tables = [row[0] for row in cur.fetchall()]
    if not tables:
        print("No TMB/stage tables found.")
    else:
        print("Tables:")
        for name in tables:
            cur.execute(f"SELECT COUNT(*) FROM {name};")
            count = cur.fetchone()[0]
            print(f"  {name}: {count} rows")
            if count and name in ('tmbaccommodations', 'tmb_stages', 'tmbstages', 'tmb_stages_localizations'):
                cur.execute(f"SELECT * FROM {name} LIMIT 3;")
                rows = cur.fetchall()
                colnames = [desc[0] for desc in cur.description]
                print("    Sample rows:")
                for row in rows:
                    print("    ", dict(zip(colnames, row)))
    cur.close()
    conn.close()

for database in ("postgres", "hikes_db"):
    try:
        find_tables(database)
    except Exception as exc:
        print(f"Error checking {database}: {exc}")
