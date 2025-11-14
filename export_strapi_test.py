import subprocess
import sys
from datetime import datetime

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

log("Exporting strapi_test database from trailhead-new-db...")

# Use pg_dump via gcloud sql connect
# We'll pipe the database to a local file
try:
    log("Starting export...")

    # Get the Cloud SQL instance IP
    result = subprocess.run(
        ["gcloud", "sql", "instances", "describe", "trailhead-new-db",
         "--project=trailhead-mvp", "--format=get(ipAddresses[0].ipAddress)"],
        capture_output=True,
        text=True,
        timeout=30
    )

    ip = result.stdout.strip()
    log(f"Instance IP: {ip}")

    # Now we need to use pg_dump with the connection details
    # We'll need the postgres user password
    log("You'll need to provide the postgres user password for trailhead-new-db")
    log("If you don't know it, you can reset it in Cloud Console")

    # Export using pg_dump
    dump_file = f"strapi_test_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"

    log(f"Run this command manually (you'll need the postgres password):")
    print()
    print(f'pg_dump -h {ip} -U postgres -d strapi_test -f {dump_file}')
    print()
    log("Or use gcloud sql export (but it requires Cloud Storage bucket):")
    print()
    print(f'gcloud sql export sql trailhead-new-db gs://YOUR_BUCKET/{dump_file} --database=strapi_test --project=trailhead-mvp')

except Exception as e:
    log(f"Error: {e}")
    import traceback
    traceback.print_exc()
