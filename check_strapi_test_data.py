import subprocess
import os

# Cloud SQL connection info
CLOUD_SQL_HOST = "34.39.30.216"
CLOUD_SQL_DB = "strapi_test"
CLOUD_SQL_USER = "postgres"
CLOUD_SQL_PASSWORD = "foaA99&I5Und!k"

os.environ['PGPASSWORD'] = CLOUD_SQL_PASSWORD

queries = [
    ("TMB Accommodations count", "SELECT COUNT(*) FROM tmbaccommodations;"),
    ("TMB Stages count", "SELECT COUNT(*) FROM tmb_stages;"),
    ("Sample TMB Accommodation", "SELECT id, name, published_at FROM tmbaccommodations LIMIT 3;"),
    ("Sample TMB Stage", "SELECT id, name, stage_number, published_at FROM tmb_stages LIMIT 3;"),
    ("All tables", "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"),
]

for label, query in queries:
    print(f"\n{'='*60}")
    print(f"{label}")
    print('='*60)

    result = subprocess.run([
        r"C:\Program Files\PostgreSQL\17\bin\psql.exe",
        "-h", CLOUD_SQL_HOST,
        "-U", CLOUD_SQL_USER,
        "-d", CLOUD_SQL_DB,
        "-c", query
    ], capture_output=True, text=True, timeout=30)

    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr)

del os.environ['PGPASSWORD']
