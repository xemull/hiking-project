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

try:
    cur = conn.cursor()

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Dropping TMB tables...")

    # Drop tables in correct order (links first, then main tables)
    tables_to_drop = [
        'tmbaccommodations_stage_lnk',
        'tmbaccommodations',
        'tmb_stages'
    ]

    for table in tables_to_drop:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Dropping table: {table}")
        cur.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")
        conn.commit()
        print(f"[{datetime.now().strftime('%H:%M:%S')}]   Dropped")

    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] All TMB tables dropped successfully")
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Database is ready for fresh Strapi deployment")

except Exception as e:
    print(f"[{datetime.now().strftime('%H:%M:%S')}] ERROR: {e}")
    conn.rollback()
    import traceback
    traceback.print_exc()
finally:
    cur.close()
    conn.close()
