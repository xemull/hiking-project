#!/usr/bin/env python3
"""
Fix duplicate document_id + locale combinations in tmbaccommodations.
Keep only the most recent published version of each.
"""

import psycopg2

# Database connection
conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    database="postgres",
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    port=6543
)

cur = conn.cursor()

print("Finding all duplicate document_id + locale combinations...")

# Find all duplicates
cur.execute("""
    SELECT document_id, locale, COUNT(*) as count
    FROM tmbaccommodations
    WHERE document_id IS NOT NULL
    GROUP BY document_id, locale
    HAVING COUNT(*) > 1
    ORDER BY count DESC;
""")

duplicates = cur.fetchall()
print(f"Found {len(duplicates)} duplicate combinations")

if not duplicates:
    print("No duplicates to fix!")
    cur.close()
    conn.close()
    exit(0)

total_to_delete = 0

for doc_id, locale, count in duplicates:
    print(f"\nProcessing document_id={doc_id}, locale={locale} ({count} entries)")

    # Get all versions of this document
    cur.execute("""
        SELECT id, name, published_at, updated_at, created_at
        FROM tmbaccommodations
        WHERE document_id = %s AND locale = %s
        ORDER BY
            published_at DESC NULLS LAST,
            updated_at DESC NULLS LAST,
            created_at DESC NULLS LAST,
            id DESC;
    """, (doc_id, locale))

    versions = cur.fetchall()

    # Keep the first one (most recent published, or most recently updated)
    keep_id = versions[0][0]
    keep_name = versions[0][1]

    print(f"  Keeping ID {keep_id}: {keep_name}")

    # Delete the rest
    for version in versions[1:]:
        delete_id = version[0]
        delete_name = version[1]
        print(f"  Deleting ID {delete_id}: {delete_name}")

        # Delete from link tables first
        cur.execute("DELETE FROM tmbaccommodations_stage_lnk WHERE tmbaccommodation_id = %s;", (delete_id,))
        cur.execute("DELETE FROM files_related_mph WHERE related_id = %s AND related_type = 'api::tmbaccommodation.tmbaccommodation';", (delete_id,))

        # Delete the accommodation
        cur.execute("DELETE FROM tmbaccommodations WHERE id = %s;", (delete_id,))
        total_to_delete += 1

print(f"\n{'='*60}")
print(f"Total duplicates to delete: {total_to_delete}")
print(f"This will leave {162 - total_to_delete} unique accommodations")
print(f"{'='*60}")

# Ask for confirmation
response = input("\nProceed with deletion? (yes/no): ")

if response.lower() == 'yes':
    conn.commit()
    print("\n✅ Duplicates deleted successfully!")

    # Verify
    cur.execute("""
        SELECT document_id, locale, COUNT(*) as count
        FROM tmbaccommodations
        WHERE document_id IS NOT NULL
        GROUP BY document_id, locale
        HAVING COUNT(*) > 1;
    """)

    remaining_dupes = cur.fetchall()
    if remaining_dupes:
        print(f"\n⚠️  Still have {len(remaining_dupes)} duplicates remaining!")
    else:
        print("\n✅ All duplicates resolved!")

    # Final count
    cur.execute("SELECT COUNT(*) FROM tmbaccommodations;")
    final_count = cur.fetchone()[0]
    print(f"\nFinal accommodation count: {final_count}")
else:
    conn.rollback()
    print("\n❌ Deletion cancelled. No changes made.")

cur.close()
conn.close()
