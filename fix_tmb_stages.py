#!/usr/bin/env python3
"""Fix TMB stages draft/publish pattern to match Strapi v5."""

import psycopg2

print("="*60)
print("FIX TMB STAGES DRAFT/PUBLISH PATTERN")
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
    FROM tmb_stages;
""")
stats = cur.fetchone()
print(f"  Total rows: {stats[0]}")
print(f"  Unique document_ids: {stats[1]}")
print(f"  Rows with NULL locale: {stats[2]}")
print(f"  Rows with NULL published_at: {stats[3]}")

# First, check all stages and their current state
print("\nExamining all stages:")
cur.execute("""
    SELECT id, document_id, locale, published_at IS NOT NULL as is_published, stage_number, name
    FROM tmb_stages
    ORDER BY stage_number, id;
""")
stages = cur.fetchall()

draft_stages = []
published_stages = []

for stage in stages:
    stage_id, doc_id, locale, is_published, stage_num, name = stage
    if is_published:
        published_stages.append((stage_id, doc_id, stage_num, name))
    else:
        draft_stages.append((stage_id, doc_id, stage_num, name))

print(f"  Published stages: {len(published_stages)}")
print(f"  Draft stages: {len(draft_stages)}")

# Generate document_ids for stages that don't have them
print("\nFixing document_ids and locale...")

# Step 1: Group stages by stage_number to pair drafts with published
cur.execute("""
    SELECT stage_number, array_agg(id ORDER BY id) as ids, array_agg(published_at IS NOT NULL ORDER BY id) as pub_status
    FROM tmb_stages
    GROUP BY stage_number
    ORDER BY stage_number;
""")

stage_groups = cur.fetchall()
fixed_count = 0

for stage_num, ids, pub_status in stage_groups:
    if len(ids) == 1:
        # Only one version exists - need to determine if it's draft or published
        stage_id = ids[0]
        is_published = pub_status[0]

        # Generate or get document_id
        cur.execute("SELECT document_id FROM tmb_stages WHERE id = %s;", (stage_id,))
        doc_id = cur.fetchone()[0]

        if not doc_id:
            # Generate a new document_id
            import hashlib
            doc_id = hashlib.md5(f"tmb_stage_{stage_num}".encode()).hexdigest()[:24]
            cur.execute("UPDATE tmb_stages SET document_id = %s WHERE id = %s;", (doc_id, stage_id))

        # Set locale to NULL
        cur.execute("UPDATE tmb_stages SET locale = NULL WHERE id = %s;", (stage_id,))
        fixed_count += 1

    elif len(ids) == 2:
        # Two versions exist - assign same document_id to both
        draft_id = ids[0] if not pub_status[0] else ids[1]
        published_id = ids[1] if pub_status[1] else ids[0]

        # Get or generate document_id from published version
        cur.execute("SELECT document_id FROM tmb_stages WHERE id = %s;", (published_id,))
        doc_id = cur.fetchone()[0]

        if not doc_id:
            import hashlib
            doc_id = hashlib.md5(f"tmb_stage_{stage_num}".encode()).hexdigest()[:24]

        # Set same document_id for both versions
        cur.execute("UPDATE tmb_stages SET document_id = %s, locale = NULL WHERE id IN (%s, %s);",
                   (doc_id, draft_id, published_id))
        fixed_count += 2

print(f"  Fixed {fixed_count} stages")

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
    FROM tmb_stages;
""")
stats = cur.fetchone()
print(f"Total rows: {stats[0]}")
print(f"Unique document_ids: {stats[1]}")
print(f"Rows with NULL locale: {stats[2]}")
print(f"Rows with NULL published_at: {stats[3]}")

# Check if any stages are missing document_id
cur.execute("SELECT COUNT(*) FROM tmb_stages WHERE document_id IS NULL;")
null_docs = cur.fetchone()[0]
if null_docs > 0:
    print(f"\nWARNING: {null_docs} stages still have NULL document_id")

# Compare with hikes pattern
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

if stats[2] == stats[0]:
    print("\nSUCCESS! All stages now have locale=NULL")
    print("Pattern should now match Strapi v5 draft/publish system")
else:
    print("\nWARNING: Some stages still have locale set")

cur.close()
conn.close()

print("\n" + "="*60)
print("DONE")
print("="*60)
