#!/usr/bin/env python3
"""Fix stage relationships for published accommodations."""

import psycopg2

conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    database="postgres",
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    port=6543
)

cur = conn.cursor()

print("="*70)
print("FIX TMB ACCOMMODATION-STAGE RELATIONSHIPS")
print("="*70)

# Step 1: Fix stage_id in accommodations to point to published stages
print("\nStep 1: Update stage_id to point to PUBLISHED stages")
print("-" * 70)

# Build a mapping of draft stage ID -> published stage ID
cur.execute("""
    SELECT
        d.id as draft_id,
        p.id as published_id,
        p.stage_number
    FROM tmb_stages d
    JOIN tmb_stages p ON d.stage_number = p.stage_number
    WHERE d.published_at IS NULL
    AND p.published_at IS NOT NULL;
""")

stage_mapping = {}
for draft_id, pub_id, stage_num in cur.fetchall():
    stage_mapping[draft_id] = (pub_id, stage_num)

print(f"Found {len(stage_mapping)} draft->published stage mappings")

# Update accommodations pointing to draft stages
updated_count = 0
for draft_id, (pub_id, stage_num) in stage_mapping.items():
    cur.execute("""
        UPDATE tmbaccommodations
        SET stage_id = %s
        WHERE stage_id = %s;
    """, (pub_id, draft_id))

    if cur.rowcount > 0:
        print(f"  Updated {cur.rowcount} accommodations: Stage {stage_num} draft ID {draft_id} -> published ID {pub_id}")
        updated_count += cur.rowcount

print(f"\nTotal accommodations updated: {updated_count}")

# Step 2: Rebuild link table to link PUBLISHED accommodations to PUBLISHED stages
print("\nStep 2: Rebuild link table for PUBLISHED accommodations")
print("-" * 70)

# Clear existing links
cur.execute("DELETE FROM tmbaccommodations_stage_lnk;")
print(f"Deleted {cur.rowcount} old links")

# Create new links for published accommodations
cur.execute("""
    INSERT INTO tmbaccommodations_stage_lnk (tmbaccommodation_id, tmb_stage_id)
    SELECT
        a.id as tmbaccommodation_id,
        a.stage_id as tmb_stage_id
    FROM tmbaccommodations a
    JOIN tmb_stages s ON a.stage_id = s.id
    WHERE a.published_at IS NOT NULL
    AND a.stage_id IS NOT NULL
    AND s.published_at IS NOT NULL
    ON CONFLICT DO NOTHING;
""")

print(f"Created {cur.rowcount} new links for published accommodations")

# Commit changes
conn.commit()
print("\nChanges committed!")

# Verification
print("\n" + "="*70)
print("VERIFICATION")
print("="*70)

# Check published accommodations with draft stages
cur.execute("""
    SELECT COUNT(*)
    FROM tmbaccommodations a
    JOIN tmb_stages s ON a.stage_id = s.id
    WHERE a.published_at IS NOT NULL
    AND s.published_at IS NULL;
""")
draft_stage_count = cur.fetchone()[0]
print(f"\nPublished accommodations pointing to draft stages: {draft_stage_count}")
if draft_stage_count == 0:
    print("  SUCCESS! All published accommodations point to published stages")

# Check link table
cur.execute("""
    SELECT
        COUNT(*) as total_links,
        COUNT(DISTINCT l.tmbaccommodation_id) as unique_accommodations,
        COUNT(DISTINCT l.tmb_stage_id) as unique_stages
    FROM tmbaccommodations_stage_lnk l
    JOIN tmbaccommodations a ON l.tmbaccommodation_id = a.id
    JOIN tmb_stages s ON l.tmb_stage_id = s.id
    WHERE a.published_at IS NOT NULL
    AND s.published_at IS NOT NULL;
""")
link_stats = cur.fetchone()
print(f"\nLink table (published to published):")
print(f"  Total links: {link_stats[0]}")
print(f"  Unique accommodations: {link_stats[1]}")
print(f"  Unique stages: {link_stats[2]}")

# Sample accommodations with stages
print("\nSample published accommodations with stages:")
cur.execute("""
    SELECT
        a.id,
        a.name,
        s.stage_number,
        s.name as stage_name
    FROM tmbaccommodations a
    JOIN tmb_stages s ON a.stage_id = s.id
    WHERE a.published_at IS NOT NULL
    AND s.published_at IS NOT NULL
    ORDER BY s.stage_number, a.name
    LIMIT 10;
""")

for accom_id, accom_name, stage_num, stage_name in cur.fetchall():
    print(f"  Stage {stage_num}: {accom_name}")

cur.close()
conn.close()

print("\n" + "="*70)
print("DONE - Restart backend service to clear cache")
print("="*70)
