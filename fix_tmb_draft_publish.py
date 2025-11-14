#!/usr/bin/env python3
"""Fix TMB accommodations draft/publish pattern to match Strapi v5."""

import psycopg2

print("="*60)
print("FIX TMB ACCOMMODATIONS DRAFT/PUBLISH PATTERN")
print("="*60)

# Database connection
conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    database="postgres",
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    port=6543
)

cur = conn.cursor()

print("\nCurrent state:")
cur.execute("""
    SELECT
        COUNT(*) as total,
        COUNT(DISTINCT document_id) as unique_docs,
        COUNT(CASE WHEN locale IS NULL THEN 1 END) as null_locale,
        COUNT(CASE WHEN published_at IS NULL THEN 1 END) as null_published
    FROM tmbaccommodations;
""")
stats = cur.fetchone()
print(f"  Total rows: {stats[0]}")
print(f"  Unique document_ids: {stats[1]}")
print(f"  Rows with NULL locale: {stats[2]}")
print(f"  Rows with NULL published_at: {stats[3]}")

print("\nFinding duplicates to fix...")
cur.execute("""
    SELECT document_id, array_agg(id ORDER BY id) as ids
    FROM tmbaccommodations
    GROUP BY document_id
    HAVING COUNT(*) > 1;
""")

duplicates = cur.fetchall()
print(f"  Found {len(duplicates)} document_ids with duplicates")

print("\nFixing draft versions...")
print("  (Setting locale=NULL and published_at=NULL for lower ID of each pair)")

fixed_count = 0
for doc_id, ids in duplicates:
    # The lower ID will be the draft (locale=NULL, published_at=NULL)
    # The higher ID will remain published (locale='en', published_at=timestamp)
    draft_id = ids[0]

    cur.execute("""
        UPDATE tmbaccommodations
        SET locale = NULL, published_at = NULL
        WHERE id = %s;
    """, (draft_id,))

    fixed_count += 1
    if fixed_count % 10 == 0:
        print(f"    Fixed {fixed_count}/{len(duplicates)}...")

print(f"\nFixed {fixed_count} draft versions")

# Commit changes
conn.commit()
print("Changes committed to database")

# Verify
print("\n" + "="*60)
print("VERIFICATION")
print("="*60)

cur.execute("""
    SELECT
        COUNT(*) as total,
        COUNT(DISTINCT document_id) as unique_docs,
        COUNT(CASE WHEN locale IS NULL THEN 1 END) as null_locale,
        COUNT(CASE WHEN published_at IS NULL THEN 1 END) as null_published
    FROM tmbaccommodations;
""")
stats = cur.fetchone()
print(f"Total rows: {stats[0]}")
print(f"Unique document_ids: {stats[1]}")
print(f"Rows with NULL locale: {stats[2]}")
print(f"Rows with NULL published_at: {stats[3]}")

# Check pattern matches hikes
print("\nComparing with hikes pattern:")
cur.execute("""
    SELECT
        COUNT(*) as total,
        COUNT(DISTINCT document_id) as unique_docs,
        COUNT(CASE WHEN locale IS NULL THEN 1 END) as null_locale,
        COUNT(CASE WHEN published_at IS NULL THEN 1 END) as null_published
    FROM hikes;
""")
hikes_stats = cur.fetchone()
print(f"Hikes - Total: {hikes_stats[0]}, Unique docs: {hikes_stats[1]}")
print(f"Hikes - NULL locale: {hikes_stats[2]}, NULL published: {hikes_stats[3]}")

if stats[2] == stats[1] and stats[3] == stats[1]:
    print("\nSUCCESS! Pattern now matches Strapi v5 draft/publish system")
    print("Each document has one draft (locale=NULL, published_at=NULL)")
    print("and one published version (locale='en', published_at=timestamp)")
else:
    print("\nWARNING: Pattern doesn't match expected structure")

cur.close()
conn.close()

print("\n" + "="*60)
print("DONE - Please restart CMS service to see changes")
print("="*60)
