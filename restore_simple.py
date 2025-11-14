#!/usr/bin/env python3
"""
Restore TMB accommodations from backup.
Usage: python restore_tmb_backup.py <backup_file.json>
"""

import psycopg2
import json
import sys
from datetime import datetime

if len(sys.argv) != 2:
    print("Usage: python restore_tmb_backup.py <backup_file.json>")
    sys.exit(1)

backup_file = sys.argv[1]

print("="*60)
print("TMB ACCOMMODATIONS RESTORE")
print("="*60)

# Load backup
print(f"\nLoading backup from: {backup_file}")

try:
    with open(backup_file, 'r', encoding='utf-8') as f:
        backup_data = json.load(f)
except FileNotFoundError:
    print(f" Error: Backup file '{backup_file}' not found!")
    sys.exit(1)
except json.JSONDecodeError:
    print(f" Error: Invalid JSON in backup file!")
    sys.exit(1)

print(f" Backup loaded successfully")
print(f"   Backup date: {backup_data['backup_date']}")
print(f"   Total rows in backup: {backup_data['total_rows']}")
print(f"   Stage links in backup: {len(backup_data.get('stage_links', []))}")
print(f"   File links in backup: {len(backup_data.get('file_links', []))}")

# Database connection
conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    database="postgres",
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    port=6543
)

cur = conn.cursor()

# Check current state
cur.execute("SELECT COUNT(*) FROM tmbaccommodations;")
current_count = cur.fetchone()[0]

print(f"\n  Current database has {current_count} accommodations")
print(f"  Backup has {backup_data['total_rows']} accommodations")
print(f"  This will DELETE all current data and restore from backup!")

response = input("\nProceed with restore? (yes/no): ")

if response.lower() != 'yes':
    print("\n Restore cancelled. No changes made.")
    cur.close()
    conn.close()
    sys.exit(0)

# Step 1: Delete all current data
print("\n" + "="*60)
print("STEP 1: Clearing current data")
print("="*60)

print("Deleting file links...")
cur.execute("DELETE FROM files_related_mph WHERE related_type = 'api::tmbaccommodation.tmbaccommodation';")
deleted_files = cur.rowcount
print(f"  Deleted {deleted_files} file links")

print("Deleting stage links...")
cur.execute("DELETE FROM tmbaccommodations_stage_lnk;")
deleted_stages = cur.rowcount
print(f"  Deleted {deleted_stages} stage links")

print("Deleting accommodations...")
cur.execute("DELETE FROM tmbaccommodations;")
deleted_accom = cur.rowcount
print(f"  Deleted {deleted_accom} accommodations")

# Step 2: Restore data
print("\n" + "="*60)
print("STEP 2: Restoring from backup")
print("="*60)

print("Restoring accommodations...")
restored_count = 0

for row_data in backup_data['data']:
    cur.execute("""
        INSERT INTO tmbaccommodations (
            id, document_id, name, type, location_type, booking_difficulty,
            altitude, capacity, price_range, phone, email, website,
            latitude, longitude, stage_id, locale, published_at,
            created_at, updated_at, created_by_id, updated_by_id
        ) VALUES (
            %(id)s, %(document_id)s, %(name)s, %(type)s, %(location_type)s, %(booking_difficulty)s,
            %(altitude)s, %(capacity)s, %(price_range)s, %(phone)s, %(email)s, %(website)s,
            %(latitude)s, %(longitude)s, %(stage_id)s, %(locale)s, %(published_at)s,
            %(created_at)s, %(updated_at)s, %(created_by_id)s, %(updated_by_id)s
        );
    """, row_data)
    restored_count += 1

    if restored_count % 50 == 0:
        print(f"  Restored {restored_count}/{backup_data['total_rows']}...")

print(f" Restored {restored_count} accommodations")

print("\nRestoring stage links...")
for link in backup_data.get('stage_links', []):
    cur.execute("""
        INSERT INTO tmbaccommodations_stage_lnk (tmbaccommodation_id, tmb_stage_id)
        VALUES (%(tmbaccommodation_id)s, %(tmb_stage_id)s)
        ON CONFLICT DO NOTHING;
    """, link)

print(f" Restored {len(backup_data.get('stage_links', []))} stage links")

print("\nRestoring file links...")
for link in backup_data.get('file_links', []):
    cur.execute("""
        INSERT INTO files_related_mph (file_id, related_id, related_type, field, \"order\")
        VALUES (%(file_id)s, %(related_id)s, 'api::tmbaccommodation.tmbaccommodation', %(field)s, %(order)s)
        ON CONFLICT DO NOTHING;
    """, link)

print(f" Restored {len(backup_data.get('file_links', []))} file links")

# Fix sequence
print("\nResetting ID sequence...")
cur.execute("""
    SELECT setval('tmbaccommodations_id_seq', (SELECT MAX(id) FROM tmbaccommodations));
""")

# Commit
conn.commit()
print("\n Changes committed to database")

# Step 3: Verify
print("\n" + "="*60)
print("STEP 3: Verification")
print("="*60)

cur.execute("SELECT COUNT(*) FROM tmbaccommodations;")
final_count = cur.fetchone()[0]

cur.execute("SELECT COUNT(*) FROM tmbaccommodations_stage_lnk;")
final_stage_links = cur.fetchone()[0]

cur.execute("SELECT COUNT(*) FROM files_related_mph WHERE related_type = 'api::tmbaccommodation.tmbaccommodation';")
final_file_links = cur.fetchone()[0]

print(f"Accommodations: {final_count} (expected: {backup_data['total_rows']})")
print(f"Stage links: {final_stage_links} (expected: {len(backup_data.get('stage_links', []))})")
print(f"File links: {final_file_links} (expected: {len(backup_data.get('file_links', []))})")

if final_count == backup_data['total_rows']:
    print("\n Restore completed successfully!")
else:
    print(f"\n  Warning: Count mismatch!")

cur.close()
conn.close()
