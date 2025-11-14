import subprocess
import sys

# Databases to check in trailhead-new-db
databases = ["postgres", "hikes_db", "strapi_test"]

print("=" * 80)
print("Checking trailhead-new-db for TMB tables")
print("=" * 80)

for db in databases:
    print(f"\nChecking database: {db}")
    print("-" * 40)

    # Query to check for TMB tables
    sql_query = """
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND (table_name LIKE '%tmb%' OR table_name LIKE '%stage%')
    ORDER BY table_name;
    """

    try:
        # Use gcloud sql execute-sql
        result = subprocess.run(
            [
                "gcloud", "sql", "execute-sql", "trailhead-new-db",
                "--database", db,
                "--project=trailhead-mvp",
                f"--sql={sql_query}"
            ],
            capture_output=True,
            text=True,
            timeout=30
        )

        output = result.stdout + result.stderr

        if "tmbaccommodations" in output.lower() or "tmb_stages" in output.lower():
            print(f"  ✓ FOUND TMB TABLES in {db}!")
            print(f"\n{output}")
        elif result.returncode == 0:
            print(f"  No TMB tables found")
            if "table_name" in output:
                print(f"  Tables found: {output[:200]}")
        else:
            print(f"  Error: {output[:200]}")

    except Exception as e:
        print(f"  Error checking {db}: {e}")

print("\n" + "=" * 80)
print("Check complete!")
