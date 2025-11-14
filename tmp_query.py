import psycopg2

conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    port=6543,
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    database="postgres"
)
cur = conn.cursor()

print("Summary counts:\n")
for table in ("tmb_stages", "tmbaccommodations", "tmbaccommodations_stage_lnk"):
    cur.execute(f"SELECT COUNT(*) FROM {table};")
    count = cur.fetchone()[0]
    print(f"  {table}: {count} rows")

print("\nStages overview (with accommodation counts):")
cur.execute("""
    SELECT s.id, s.stage_number, s.name, COALESCE(s.locale, 'en'),
           (s.published_at IS NOT NULL) AS is_published,
           COUNT(l.tmbaccommodation_id) AS accom_count
    FROM tmb_stages s
    LEFT JOIN tmbaccommodations_stage_lnk l ON s.id = l.tmb_stage_id
    GROUP BY s.id, s.stage_number, s.name, s.locale, s.published_at
    ORDER BY s.stage_number;
""")
stages = cur.fetchall()
for row in stages:
    print(f"  Stage {row[1]} (ID {row[0]}): {row[2]} | locale={row[3]} | published={'yes' if row[4] else 'no'} | accommodations={row[5]}")

print("\nSample accommodations (first 10 alphabetically):")
cur.execute("""
    SELECT a.id, a.name, a.type, a.location_type, a.price_range, a.latitude, a.longitude,
           a.published_at IS NOT NULL AS published,
           ARRAY_AGG(s.stage_number ORDER BY s.stage_number)
    FROM tmbaccommodations a
    LEFT JOIN tmbaccommodations_stage_lnk l ON a.id = l.tmbaccommodation_id
    LEFT JOIN tmb_stages s ON l.tmb_stage_id = s.id
    GROUP BY a.id
    ORDER BY a.name
    LIMIT 10;
""")
accoms = cur.fetchall()
for row in accoms:
    stage_list = row[8]
    stage_str = ', '.join(str(num) for num in stage_list if num is not None) or 'None'
    print(f"  ID {row[0]} | {row[1]} ({row[2]}, {row[3]}) price {row[4]} | coords=({row[5]}, {row[6]}) | published={'yes' if row[7] else 'no'} | stages: {stage_str}")

cur.close()
conn.close()
