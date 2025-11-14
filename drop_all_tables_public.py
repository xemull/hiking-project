import psycopg2
from datetime import datetime

# Database connection
conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    database="postgres",
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    port="6543"
)

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

try:
    cur = conn.cursor()

    log("Getting all tables in public schema...")

    # Get all tables in public schema
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
    """)

    tables = [row[0] for row in cur.fetchall()]

    log(f"Found {len(tables)} tables to drop")

    if len(tables) == 0:
        log("No tables to drop")
    else:
        log("Dropping all tables...")

        # Drop all tables
        for table in tables:
            try:
                log(f"  Dropping {table}...")
                cur.execute(f"DROP TABLE IF EXISTS \"{table}\" CASCADE;")
                conn.commit()
            except Exception as e:
                log(f"  ERROR dropping {table}: {e}")
                conn.rollback()

    log("Done! Public schema is now empty")
    log("Next: Restart Strapi to auto-create fresh tables")

except Exception as e:
    log(f"ERROR: {e}")
    conn.rollback()
    import traceback
    traceback.print_exc()
finally:
    cur.close()
    conn.close()
