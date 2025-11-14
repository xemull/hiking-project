#!/usr/bin/env python3
"""Execute the deletion plan for TMB accommodations duplicates."""

import psycopg2
import json

deletion_plan_file = "deletion_plan_20251106_222431.json"

print("="*60)
print("EXECUTE TMB DUPLICATES DELETION")
print("="*60)

# Load deletion plan
with open(deletion_plan_file, 'r') as f:
    plan = json.load(f)

print(f"\nDeletion plan: {deletion_plan_file}")
print(f"Backup file: {plan['backup_file']}")
print(f"Total IDs to delete: {plan['total_to_delete']}")

response = input("\nType 'yes' to proceed with deletion: ")

if response.lower() != 'yes':
    print("\nCancelled. No changes made.")
    exit(0)

# Database connection
conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    database="postgres",
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    port=6543
)

cur = conn.cursor()

print("\nDeleting duplicates...")
deleted_count = 0

for del_id in plan['ids_to_delete']:
    # Delete from link tables first
    cur.execute("DELETE FROM tmbaccommodations_stage_lnk WHERE tmbaccommodation_id = %s;", (del_id,))
    cur.execute("DELETE FROM files_related_mph WHERE related_id = %s AND related_type = 'api::tmbaccommodation.tmbaccommodation';", (del_id,))

    # Delete the accommodation
    cur.execute("DELETE FROM tmbaccommodations WHERE id = %s;", (del_id,))
    deleted_count += 1

    if deleted_count % 10 == 0:
        print(f"  Deleted {deleted_count}/{plan['total_to_delete']}...")

print(f"\n[OK] Deleted {deleted_count} duplicate entries")

# Commit changes
conn.commit()
print("[OK] Changes committed to database")

# Verify
print("\n" + "="*60)
print("VERIFICATION")
print("="*60)

cur.execute("""
    SELECT document_id, locale, COUNT(*) as count
    FROM tmbaccommodations
    WHERE document_id IS NOT NULL
    GROUP BY document_id, locale
    HAVING COUNT(*) > 1;
""")

remaining_dupes = cur.fetchall()

if remaining_dupes:
    print(f"\n[WARNING] Still have {len(remaining_dupes)} duplicates remaining!")
else:
    print("\n[OK] All duplicates resolved!")

cur.execute("SELECT COUNT(*) FROM tmbaccommodations;")
final_count = cur.fetchone()[0]

print(f"\nFinal accommodation count: {final_count}")
print(f"Expected count: 82")

if final_count == 82:
    print("[OK] Count matches expected!")
else:
    print(f"[WARNING] Count mismatch!")

print("\n" + "="*60)
print("ROLLBACK INSTRUCTIONS:")
print("="*60)
print(f"If you need to rollback, run:")
print(f"  python restore_tmb_backup.py {plan['backup_file']}")
print("="*60)

cur.close()
conn.close()

print("\n[OK] Process complete!")
