#!/usr/bin/env python3
"""
Safely backup and deduplicate TMB accommodations table.
Creates full backup before any changes and provides easy rollback.
"""

import psycopg2
import json
from datetime import datetime

# Database connection
conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    database="postgres",
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    port=6543
)

cur = conn.cursor()

# Step 1: Create full backup
print("="*60)
print("STEP 1: Creating full backup of tmbaccommodations table")
print("="*60)

backup_file = f"tmbaccommodations_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

# Get all data
cur.execute("""
    SELECT id, document_id, name, type, location_type, booking_difficulty,
           altitude, capacity, price_range, phone, email, website,
           latitude, longitude, stage_id, locale, published_at,
           created_at, updated_at, created_by_id, updated_by_id
    FROM tmbaccommodations
    ORDER BY id;
""")

columns = [desc[0] for desc in cur.description]
rows = cur.fetchall()

backup_data = {
    'backup_date': datetime.now().isoformat(),
    'total_rows': len(rows),
    'table': 'tmbaccommodations',
    'data': []
}

for row in rows:
    row_dict = {}
    for i, col in enumerate(columns):
        value = row[i]
        # Convert datetime to string for JSON serialization
        if isinstance(value, datetime):
            value = value.isoformat()
        row_dict[col] = value
    backup_data['data'].append(row_dict)

# Also backup link tables
print("\nBacking up relationship data...")

cur.execute("""
    SELECT tmbaccommodation_id, tmb_stage_id
    FROM tmbaccommodations_stage_lnk
    ORDER BY tmbaccommodation_id;
""")

stage_links = cur.fetchall()
backup_data['stage_links'] = [
    {'tmbaccommodation_id': link[0], 'tmb_stage_id': link[1]}
    for link in stage_links
]

cur.execute("""
    SELECT file_id, related_id, field, \"order\"
    FROM files_related_mph
    WHERE related_type = 'api::tmbaccommodation.tmbaccommodation'
    ORDER BY related_id, \"order\";
""")

file_links = cur.fetchall()
backup_data['file_links'] = [
    {'file_id': link[0], 'related_id': link[1], 'field': link[2], 'order': link[3]}
    for link in file_links
]

# Save backup
with open(backup_file, 'w', encoding='utf-8') as f:
    json.dump(backup_data, f, indent=2, ensure_ascii=False)

print(f"\n[OK] Backup saved to: {backup_file}")
print(f"   Total rows backed up: {len(rows)}")
print(f"   Stage links backed up: {len(stage_links)}")
print(f"   File links backed up: {len(file_links)}")

# Step 2: Analyze duplicates
print("\n" + "="*60)
print("STEP 2: Analyzing duplicates")
print("="*60)

cur.execute("""
    SELECT document_id, locale, COUNT(*) as count,
           array_agg(id ORDER BY published_at DESC NULLS LAST, updated_at DESC NULLS LAST, id DESC) as ids,
           array_agg(name ORDER BY published_at DESC NULLS LAST, updated_at DESC NULLS LAST, id DESC) as names
    FROM tmbaccommodations
    WHERE document_id IS NOT NULL
    GROUP BY document_id, locale
    HAVING COUNT(*) > 1
    ORDER BY count DESC;
""")

duplicates = cur.fetchall()

if not duplicates:
    print("\n✅ No duplicates found! Nothing to fix.")
    cur.close()
    conn.close()
    exit(0)

print(f"\nFound {len(duplicates)} duplicate document_id+locale combinations:")

deletion_plan = []
total_to_delete = 0

for doc_id, locale, count, ids, names in duplicates:
    print(f"\n[DUPLICATE] document_id={doc_id}, locale={locale} ({count} entries)")
    print(f"   KEEP: ID {ids[0]}: {names[0]}")

    for i in range(1, len(ids)):
        print(f"   DELETE: ID {ids[i]}: {names[i]}")
        deletion_plan.append(ids[i])
        total_to_delete += 1

print("\n" + "="*60)
print(f"SUMMARY:")
print(f"  Current total: {len(rows)} accommodations")
print(f"  Duplicates to delete: {total_to_delete}")
print(f"  Final total: {len(rows) - total_to_delete} accommodations")
print("="*60)

# Save deletion plan
deletion_plan_file = f"deletion_plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
with open(deletion_plan_file, 'w') as f:
    json.dump({
        'deletion_date': datetime.now().isoformat(),
        'ids_to_delete': deletion_plan,
        'total_to_delete': total_to_delete,
        'backup_file': backup_file
    }, f, indent=2)

print(f"\n📄 Deletion plan saved to: {deletion_plan_file}")

# Step 3: Confirm and execute
print("\n" + "="*60)
print("STEP 3: Execute deletion")
print("="*60)

response = input(f"\n⚠️  Proceed with deleting {total_to_delete} duplicate entries? (yes/no): ")

if response.lower() != 'yes':
    print("\n❌ Deletion cancelled. No changes made.")
    print(f"✅ Backup preserved at: {backup_file}")
    cur.close()
    conn.close()
    exit(0)

# Execute deletions
print("\nDeleting duplicates...")
deleted_count = 0

for del_id in deletion_plan:
    # Delete from link tables first
    cur.execute("DELETE FROM tmbaccommodations_stage_lnk WHERE tmbaccommodation_id = %s;", (del_id,))
    cur.execute("DELETE FROM files_related_mph WHERE related_id = %s AND related_type = 'api::tmbaccommodation.tmbaccommodation';", (del_id,))

    # Delete the accommodation
    cur.execute("DELETE FROM tmbaccommodations WHERE id = %s;", (del_id,))
    deleted_count += 1

    if deleted_count % 10 == 0:
        print(f"  Deleted {deleted_count}/{total_to_delete}...")

print(f"\n✅ Deleted {deleted_count} duplicate entries")

# Commit changes
conn.commit()
print("✅ Changes committed to database")

# Step 4: Verify
print("\n" + "="*60)
print("STEP 4: Verification")
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
    print(f"\n⚠️  WARNING: Still have {len(remaining_dupes)} duplicates remaining!")
    for dup in remaining_dupes[:5]:
        print(f"   {dup[0]}, {dup[1]}: {dup[2]} entries")
else:
    print("\n✅ All duplicates resolved!")

cur.execute("SELECT COUNT(*) FROM tmbaccommodations;")
final_count = cur.fetchone()[0]

print(f"\nFinal accommodation count: {final_count}")
print(f"Expected count: {len(rows) - total_to_delete}")

if final_count == len(rows) - total_to_delete:
    print("✅ Count matches expected!")
else:
    print(f"⚠️  Count mismatch! Expected {len(rows) - total_to_delete}, got {final_count}")

print("\n" + "="*60)
print("ROLLBACK INSTRUCTIONS:")
print("="*60)
print(f"If you need to rollback, run:")
print(f"  python restore_tmb_backup.py {backup_file}")
print("="*60)

cur.close()
conn.close()

print(f"\n✅ Process complete!")
print(f"📄 Backup: {backup_file}")
print(f"📄 Deletion plan: {deletion_plan_file}")
