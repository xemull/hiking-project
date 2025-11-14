import subprocess
import os
from datetime import datetime

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

# Cloud SQL connection info
CLOUD_SQL_HOST = "34.39.30.216"
CLOUD_SQL_DB = "strapi_test"
CLOUD_SQL_USER = "postgres"
CLOUD_SQL_PASSWORD = "foaA99&I5Und!k"

# Supabase connection info
SUPABASE_HOST = "aws-1-eu-west-1.pooler.supabase.com"
SUPABASE_DB = "postgres"
SUPABASE_USER = "postgres.lpkaumowfuovlgjgilrt"
SUPABASE_PASSWORD = "ZZH4NxTL@W^D^h"
SUPABASE_PORT = "6543"

dump_file = f"strapi_test_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"

log("Step 1: Exporting strapi_test database from Cloud SQL...")
log(f"Connecting to {CLOUD_SQL_HOST}...")

# Set environment variable for password
os.environ['PGPASSWORD'] = CLOUD_SQL_PASSWORD

try:
    # Export from Cloud SQL
    result = subprocess.run([
        r"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe",
        "-h", CLOUD_SQL_HOST,
        "-U", CLOUD_SQL_USER,
        "-d", CLOUD_SQL_DB,
        "-f", dump_file,
        "--no-owner",
        "--no-acl"
    ], capture_output=True, text=True, timeout=300)

    if result.returncode != 0:
        log(f"ERROR during export: {result.stderr}")
        exit(1)

    log(f"✓ Successfully exported to {dump_file}")

    # Check file size
    size_mb = os.path.getsize(dump_file) / (1024 * 1024)
    log(f"Dump file size: {size_mb:.2f} MB")

    log("\nStep 2: Dropping all tables in Supabase public schema...")

    # Change password for Supabase
    os.environ['PGPASSWORD'] = SUPABASE_PASSWORD

    # Get all tables
    result = subprocess.run([
        r"C:\Program Files\PostgreSQL\17\bin\psql.exe",
        "-h", SUPABASE_HOST,
        "-U", SUPABASE_USER,
        "-d", SUPABASE_DB,
        "-p", SUPABASE_PORT,
        "-t",
        "-c", "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';"
    ], capture_output=True, text=True, timeout=30)

    tables = [t.strip() for t in result.stdout.split('\n') if t.strip()]
    log(f"Found {len(tables)} tables to drop")

    for table in tables:
        log(f"  Dropping {table}...")
        subprocess.run([
            r"C:\Program Files\PostgreSQL\17\bin\psql.exe",
            "-h", SUPABASE_HOST,
            "-U", SUPABASE_USER,
            "-d", SUPABASE_DB,
            "-p", SUPABASE_PORT,
            "-c", f'DROP TABLE IF EXISTS "{table}" CASCADE;'
        ], capture_output=True, timeout=30)

    log("✓ All tables dropped")

    log("\nStep 3: Importing to Supabase...")

    result = subprocess.run([
        r"C:\Program Files\PostgreSQL\17\bin\psql.exe",
        "-h", SUPABASE_HOST,
        "-U", SUPABASE_USER,
        "-d", SUPABASE_DB,
        "-p", SUPABASE_PORT,
        "-f", dump_file
    ], capture_output=True, text=True, timeout=600)

    if result.returncode != 0:
        log(f"ERROR during import: {result.stderr}")
        log("Check the dump file for issues")
        exit(1)

    log("✓ Successfully imported to Supabase!")

    log("\nStep 4: Verifying import...")

    result = subprocess.run([
        r"C:\Program Files\PostgreSQL\17\bin\psql.exe",
        "-h", SUPABASE_HOST,
        "-U", SUPABASE_USER,
        "-d", SUPABASE_DB,
        "-p", SUPABASE_PORT,
        "-t",
        "-c", "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';"
    ], capture_output=True, text=True, timeout=30)

    table_count = result.stdout.strip()
    log(f"Total tables in Supabase: {table_count}")

    # Check for TMB tables
    result = subprocess.run([
        r"C:\Program Files\PostgreSQL\17\bin\psql.exe",
        "-h", SUPABASE_HOST,
        "-U", SUPABASE_USER,
        "-d", SUPABASE_DB,
        "-p", SUPABASE_PORT,
        "-t",
        "-c", "SELECT COUNT(*) FROM tmbaccommodations;"
    ], capture_output=True, text=True, timeout=30)

    if result.returncode == 0:
        count = result.stdout.strip()
        log(f"TMB Accommodations count: {count}")

    result = subprocess.run([
        r"C:\Program Files\PostgreSQL\17\bin\psql.exe",
        "-h", SUPABASE_HOST,
        "-U", SUPABASE_USER,
        "-d", SUPABASE_DB,
        "-p", SUPABASE_PORT,
        "-t",
        "-c", "SELECT COUNT(*) FROM tmb_stages;"
    ], capture_output=True, text=True, timeout=30)

    if result.returncode == 0:
        count = result.stdout.strip()
        log(f"TMB Stages count: {count}")

    log("\n" + "="*60)
    log("DATABASE RESTORE COMPLETE!")
    log("="*60)
    log("\nNext steps:")
    log("1. Restart the CMS service (it will automatically reconnect)")
    log("2. Check the admin panel")
    log("3. Verify TMB data is visible")

except Exception as e:
    log(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
finally:
    # Clean up password from environment
    if 'PGPASSWORD' in os.environ:
        del os.environ['PGPASSWORD']
