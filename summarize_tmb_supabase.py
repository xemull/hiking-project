import psycopg2

conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    port=6543,
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    dbname="postgres",
    sslmode="require"
)
cur = conn.cursor()

print("Row counts:")
for table in ("tmb_stages", "tmbaccommodations", "tmbaccommodations_cmps", "tmbaccommodations_stage_lnk"):
    cur.execute(f"SELECT COUNT(*) FROM {table}")
    print(f"  {table}: {cur.fetchone()[0]}")

print("\nStage summary:")
cur.execute("""
    SELECT s.id, s.stage_number, s.name, s.published_at IS NOT NULL AS published,
           COUNT(l.tmbaccommodation_id) AS accom_count
    FROM tmb_stages s
    LEFT JOIN tmbaccommodations_stage_lnk l ON s.id = l.tmb_stage_id
    GROUP BY s.id, s.stage_number, s.name, s.published_at
    ORDER BY s.stage_number, s.id;
""")
for row in cur.fetchall():
    print(f"  Stage {row[1]} (ID {row[0]}): {row[2]} | published={'yes' if row[3] else 'no'} | accommodations={row[4]}")

cur.close()
conn.close()
