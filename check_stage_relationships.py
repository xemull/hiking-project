#!/usr/bin/env python3
"""Check TMB accommodation and stage relationships."""

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
print("CHECKING TMB ACCOMMODATION-STAGE RELATIONSHIPS")
print("="*70)

# Check which accommodations are published (API will return these)
print("\n1. PUBLISHED ACCOMMODATIONS (what API returns):")
cur.execute("""
    SELECT
        a.id,
        a.document_id,
        a.name,
        a.stage_id,
        s.stage_number,
        s.name as stage_name,
        s.published_at IS NOT NULL as stage_is_published
    FROM tmbaccommodations a
    LEFT JOIN tmb_stages s ON a.stage_id = s.id
    WHERE a.published_at IS NOT NULL
    ORDER BY a.name
    LIMIT 10;
""")

published_accoms = cur.fetchall()
print(f"\nFirst 10 published accommodations:")
for row in published_accoms:
    accom_id, doc_id, name, stage_id, stage_num, stage_name, stage_pub = row
    stage_info = f"Stage {stage_num} ({stage_name}) [{'PUBLISHED' if stage_pub else 'DRAFT'}]" if stage_id else "NO STAGE"
    print(f"  ID {accom_id}: {name}")
    print(f"    -> stage_id={stage_id}, {stage_info}")

# Check the link table
print("\n2. LINK TABLE (tmbaccommodations_stage_lnk):")
cur.execute("""
    SELECT
        COUNT(*) as total_links,
        COUNT(DISTINCT tmbaccommodation_id) as unique_accommodations,
        COUNT(DISTINCT tmb_stage_id) as unique_stages
    FROM tmbaccommodations_stage_lnk;
""")
stats = cur.fetchone()
print(f"  Total links: {stats[0]}")
print(f"  Unique accommodations: {stats[1]}")
print(f"  Unique stages: {stats[2]}")

# Check if link table is being used correctly
print("\n3. SAMPLE LINK TABLE DATA:")
cur.execute("""
    SELECT
        l.tmbaccommodation_id,
        a.name as accom_name,
        a.published_at IS NOT NULL as accom_published,
        l.tmb_stage_id,
        s.stage_number,
        s.published_at IS NOT NULL as stage_published
    FROM tmbaccommodations_stage_lnk l
    JOIN tmbaccommodations a ON l.tmbaccommodation_id = a.id
    JOIN tmb_stages s ON l.tmb_stage_id = s.id
    LIMIT 10;
""")

links = cur.fetchall()
print("\nFirst 10 links:")
for row in links:
    accom_id, accom_name, accom_pub, stage_id, stage_num, stage_pub = row
    print(f"  Accom ID {accom_id} ({'PUB' if accom_pub else 'DRAFT'}): {accom_name}")
    print(f"    -> Stage ID {stage_id} ({'PUB' if stage_pub else 'DRAFT'}): Stage {stage_num}")

# Check for mismatches - published accommodations with draft stages
print("\n4. POTENTIAL ISSUES:")
print("\na) Published accommodations linked to DRAFT stages (via stage_id):")
cur.execute("""
    SELECT
        a.id,
        a.name,
        s.id as stage_id,
        s.stage_number,
        s.published_at IS NULL as is_draft_stage
    FROM tmbaccommodations a
    JOIN tmb_stages s ON a.stage_id = s.id
    WHERE a.published_at IS NOT NULL
    AND s.published_at IS NULL
    LIMIT 5;
""")

mismatches = cur.fetchall()
if mismatches:
    print(f"  Found {len(mismatches)} mismatches:")
    for row in mismatches:
        print(f"    {row[1]} (ID {row[0]}) -> DRAFT Stage {row[3]} (ID {row[2]})")
else:
    print("  No mismatches found")

print("\nb) Published accommodations with stage_id pointing to DRAFT stages:")
cur.execute("""
    SELECT COUNT(*)
    FROM tmbaccommodations a
    JOIN tmb_stages s ON a.stage_id = s.id
    WHERE a.published_at IS NOT NULL
    AND s.published_at IS NULL;
""")
count = cur.fetchone()[0]
print(f"  Total: {count} published accommodations pointing to draft stages")

print("\nc) Published stages and their IDs:")
cur.execute("""
    SELECT id, stage_number, name, published_at IS NOT NULL as is_published
    FROM tmb_stages
    ORDER BY stage_number, id;
""")
stages = cur.fetchall()
print("\n  All stages:")
for stage_id, stage_num, name, is_pub in stages:
    print(f"    Stage {stage_num} (ID {stage_id}): {name} [{'PUBLISHED' if is_pub else 'DRAFT'}]")

# Key insight: Check if stage_id should point to published version
print("\n5. SOLUTION NEEDED:")
print("If published accommodations are pointing to draft stage IDs,")
print("we need to update stage_id to point to the published stage ID instead.")

cur.close()
conn.close()
