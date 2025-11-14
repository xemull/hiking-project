import subprocess
import sys

# List of all databases to check
databases = [
    {
        "name": "strapi-db / postgres",
        "instance": "strapi-db",
        "connection": "trailhead-mvp:europe-west2-a:strapi-db",
        "db": "postgres"
    },
    {
        "name": "strapi-db / hikes_db",
        "instance": "strapi-db",
        "connection": "trailhead-mvp:europe-west2-a:strapi-db",
        "db": "hikes_db"
    },
    {
        "name": "trailhead-new-db / postgres",
        "instance": "trailhead-new-db",
        "connection": "trailhead-mvp:europe-west2-c:trailhead-new-db",
        "db": "postgres"
    },
    {
        "name": "trailhead-new-db / hikes_db",
        "instance": "trailhead-new-db",
        "connection": "trailhead-mvp:europe-west2-c:trailhead-new-db",
        "db": "hikes_db"
    },
    {
        "name": "trailhead-new-db / strapi_test",
        "instance": "trailhead-new-db",
        "connection": "trailhead-mvp:europe-west2-c:trailhead-new-db",
        "db": "strapi_test"
    },
    {
        "name": "hiking-project-db / postgres",
        "instance": "hiking-project-db-233ae46e",
        "connection": "trailhead-mvp:europe-west2-c:hiking-project-db-233ae46e",
        "db": "postgres"
    },
    {
        "name": "hiking-project-db / hikes_db",
        "instance": "hiking-project-db-233ae46e",
        "connection": "trailhead-mvp:europe-west2-c:hiking-project-db-233ae46e",
        "db": "hikes_db"
    },
    {
        "name": "hiking-project-db / strapi_content",
        "instance": "hiking-project-db-233ae46e",
        "connection": "trailhead-mvp:europe-west2-c:hiking-project-db-233ae46e",
        "db": "strapi_content"
    }
]

print("Checking all Cloud SQL databases for TMB tables...")
print("="*80)

for db_info in databases:
    print(f"\nChecking: {db_info['name']}")
    print(f"  Connection: {db_info['connection']}")

    # Use gcloud sql connect to check for tables
    sql_query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND (table_name = 'tmbaccommodations' OR table_name = 'tmb_stages') ORDER BY table_name;"

    try:
        result = subprocess.run(
            [
                "gcloud", "sql", "connect", db_info['instance'],
                "--database", db_info['db'],
                "--project=trailhead-mvp",
                "--quiet"
            ],
            input=sql_query.encode(),
            capture_output=True,
            timeout=30
        )

        output = result.stdout.decode() + result.stderr.decode()

        if "tmbaccommodations" in output or "tmb_stages" in output:
            print(f"  *** FOUND TMB TABLES! ***")
            print(f"  Output: {output[:200]}")
        else:
            print(f"  No TMB tables found")

    except Exception as e:
        print(f"  Error checking: {e}")

print("\n" + "="*80)
print("Check complete!")
