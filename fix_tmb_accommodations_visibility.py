#!/usr/bin/env python3
"""
Fix TMB accommodations visibility in Strapi Content Manager.
The issue is that Content Manager shows "0 entries found" even though data exists.
"""

import psycopg2
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

print("Checking tmbaccommodations table structure...")

# Check current state
cur.execute("""
    SELECT
        COUNT(*) as total,
        COUNT(document_id) as has_document_id,
        COUNT(published_at) as has_published_at,
        COUNT(locale) as has_locale
    FROM tmbaccommodations;
""")

result = cur.fetchone()
print(f"Total rows: {result[0]}")
print(f"Rows with document_id: {result[1]}")
print(f"Rows with published_at: {result[2]}")
print(f"Rows with locale: {result[3]}")

# Check for any NULL values that might cause issues
cur.execute("""
    SELECT id, name, document_id, locale, published_at
    FROM tmbaccommodations
    WHERE document_id IS NULL OR locale IS NULL
    LIMIT 10;
""")

null_rows = cur.fetchall()
if null_rows:
    print(f"\nFound {len(null_rows)} rows with NULL document_id or locale:")
    for row in null_rows:
        print(f"  ID {row[0]}: {row[1]} - document_id={row[2]}, locale={row[3]}, published_at={row[4]}")
else:
    print("\nAll rows have document_id and locale set.")

# Check if there are draft versions blocking the view
cur.execute("""
    SELECT
        COUNT(*) FILTER (WHERE published_at IS NOT NULL) as published,
        COUNT(*) FILTER (WHERE published_at IS NULL) as draft
    FROM tmbaccommodations;
""")

pub_draft = cur.fetchone()
print(f"\nPublished entries: {pub_draft[0]}")
print(f"Draft entries: {pub_draft[1]}")

# Look for duplicate document_ids which could confuse Content Manager
cur.execute("""
    SELECT document_id, locale, COUNT(*) as count
    FROM tmbaccommodations
    WHERE document_id IS NOT NULL
    GROUP BY document_id, locale
    HAVING COUNT(*) > 1
    LIMIT 10;
""")

duplicates = cur.fetchall()
if duplicates:
    print(f"\nFound duplicate document_id + locale combinations:")
    for dup in duplicates:
        print(f"  document_id={dup[0]}, locale={dup[1]}, count={dup[2]}")
else:
    print("\nNo duplicate document_id + locale combinations found.")

# Check the schema to see if there's a "version" column
cur.execute("""
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'tmbaccommodations'
    AND column_name IN ('document_id', 'locale', 'published_at', 'created_at', 'updated_at', 'created_by_id', 'updated_by_id')
    ORDER BY column_name;
""")

schema = cur.fetchall()
print("\nRelevant schema columns:")
for col in schema:
    print(f"  {col[0]}: {col[1]} (nullable: {col[2]})")

print("\nAttempting to verify Strapi can query this data...")

# Simulate a Strapi v5 Document Service query
cur.execute("""
    SELECT
        id,
        document_id,
        name,
        type,
        locale,
        published_at,
        created_at,
        updated_at
    FROM tmbaccommodations
    WHERE locale = 'en'
    AND published_at IS NOT NULL
    ORDER BY id
    LIMIT 5;
""")

sample_rows = cur.fetchall()
if sample_rows:
    print(f"\nSample published entries (limit 5):")
    for row in sample_rows:
        print(f"  ID {row[0]}: {row[2]} ({row[3]}) - locale={row[4]}, published={row[5] is not None}")
else:
    print("\nNo published entries found matching Strapi query criteria!")

cur.close()
conn.close()

print("\nDiagnostic complete.")
