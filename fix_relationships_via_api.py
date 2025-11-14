import requests
import psycopg2
from datetime import datetime
import time

CMS_URL = "https://cms-service-623946599151.europe-west2.run.app"

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

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Getting stage relationships from database...")

    # Get all accommodations with their stage relationships (from published version)
    cur.execute("""
        WITH duplicates AS (
            SELECT document_id,
                   array_agg(id ORDER BY id) as ids
            FROM tmbaccommodations
            GROUP BY document_id
            HAVING COUNT(*) = 2
        ),
        draft_published AS (
            SELECT document_id,
                   ids[1] as draft_id,
                   ids[2] as published_id
            FROM duplicates
        )
        SELECT
            dp.document_id,
            t.name,
            lp.tmb_stage_id
        FROM draft_published dp
        JOIN tmbaccommodations t ON t.id = dp.published_id
        LEFT JOIN tmbaccommodations_stage_lnk lp ON lp.tmbaccommodation_id = dp.published_id
        WHERE t.published_at IS NOT NULL
        ORDER BY t.name;
    """)

    db_relationships = cur.fetchall()
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Found {len(db_relationships)} accommodations in database")

    # Print admin login instructions
    print("\n" + "="*80)
    print("MANUAL STEP REQUIRED:")
    print("="*80)
    print("We need to update relationships through Strapi's API.")
    print("However, this requires admin authentication.")
    print("\nTwo options:")
    print("\n1. USING STRAPI ADMIN UI (RECOMMENDED):")
    print("   - Go to: https://cms-service-623946599151.europe-west2.run.app/admin")
    print("   - Login with your admin credentials")
    print("   - Go to Settings > API Tokens > Create new API Token")
    print("   - Name: 'Relationship Fix'")
    print("   - Token type: 'Full access'")
    print("   - Copy the token and run this script with the token as argument:")
    print("     python fix_relationships_via_api.py YOUR_TOKEN_HERE")
    print("\n2. USING STRAPI ADMIN CREDENTIALS (ALTERNATIVE):")
    print("   - I can use admin credentials to get a JWT token")
    print("   - This requires your admin email and password")
    print("="*80)

    # Check if token was provided as command line argument
    import sys
    if len(sys.argv) > 1:
        api_token = sys.argv[1]
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Using provided API token...")

        # Test the token
        test_response = requests.get(
            f"{CMS_URL}/api/tmbaccommodations?pagination[limit]=1",
            headers={"Authorization": f"Bearer {api_token}"}
        )

        if test_response.status_code != 200:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] ERROR: Token is invalid or expired")
            print(f"Response: {test_response.status_code} - {test_response.text}")
            sys.exit(1)

        print(f"[{datetime.now().strftime('%H:%M:%S')}] Token is valid!")

        # Now update each accommodation
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Starting to update accommodations via API...")

        success_count = 0
        error_count = 0

        for document_id, name, stage_id in db_relationships:
            if stage_id is None:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Skipping {name} (no stage assigned)")
                continue

            # First, get the accommodation by document_id
            # We need to find the accommodation ID from Strapi's perspective
            search_response = requests.get(
                f"{CMS_URL}/api/tmbaccommodations",
                params={
                    "filters[documentId][$eq]": document_id,
                    "publicationState": "preview"  # Get both draft and published
                },
                headers={"Authorization": f"Bearer {api_token}"}
            )

            if search_response.status_code != 200:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] ERROR: Could not find {name}")
                error_count += 1
                continue

            accommodations = search_response.json().get('data', [])
            if not accommodations:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] ERROR: No accommodation found for {name}")
                error_count += 1
                continue

            # Update each version (draft and published if exists)
            for accom in accommodations:
                accom_id = accom['id']

                # Update via API
                update_response = requests.put(
                    f"{CMS_URL}/api/tmbaccommodations/{accom_id}",
                    json={
                        "data": {
                            "stage": stage_id
                        }
                    },
                    headers={
                        "Authorization": f"Bearer {api_token}",
                        "Content-Type": "application/json"
                    }
                )

                if update_response.status_code in [200, 201]:
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] ✓ Updated {name} (ID: {accom_id}) -> Stage {stage_id}")
                    success_count += 1
                else:
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] ✗ Failed to update {name}: {update_response.status_code} - {update_response.text[:100]}")
                    error_count += 1

                # Small delay to avoid rate limiting
                time.sleep(0.1)

        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Update complete!")
        print(f"Success: {success_count}")
        print(f"Errors: {error_count}")

    else:
        print("\nNo API token provided. Please create one and run the script with:")
        print("python fix_relationships_via_api.py YOUR_TOKEN_HERE")

        # Show the relationships that need to be updated
        print(f"\nRelationships that need updating ({len([r for r in db_relationships if r[2] is not None])} total):")
        count = 0
        for document_id, name, stage_id in db_relationships:
            if stage_id is not None:
                print(f"  - {name} -> Stage {stage_id}")
                count += 1
                if count >= 10:
                    print(f"  ... and {len([r for r in db_relationships if r[2] is not None]) - 10} more")
                    break

except Exception as e:
    print(f"[{datetime.now().strftime('%H:%M:%S')}] ERROR: {e}")
    import traceback
    traceback.print_exc()
finally:
    cur.close()
    conn.close()
