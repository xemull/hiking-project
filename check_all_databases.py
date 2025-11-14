import subprocess
import json

# Get Cloud SQL proxy if not already running
# For now, let's just document what we need to check

databases_to_check = [
    {
        "instance": "strapi-db",
        "host": "35.230.146.79",
        "databases": ["postgres", "hikes_db"],
        "user": "postgres"
    },
    {
        "instance": "trailhead-new-db",
        "host": "34.39.30.216",
        "databases": [],  # Will be filled
        "user": "postgres"
    },
    {
        "instance": "hiking-project-db-233ae46e",
        "host": "34.39.12.47",
        "databases": [],  # Will be filled
        "user": "postgres"
    }
]

print("Database instances found:")
for db in databases_to_check:
    print(f"\n{db['instance']} ({db['host']})")
    print(f"  Databases: {', '.join(db['databases']) if db['databases'] else 'To be determined'}")
