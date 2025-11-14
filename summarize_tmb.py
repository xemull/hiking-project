from google.cloud.sql.connector import Connector

connector = Connector()
conn = connector.connect(
    "trailhead-mvp:europe-west2:trailhead-new-db",
    "pg8000",
    user="hike_admin",
    password="foaA99&I5Und!k",
    db="hikes_db"
)
cur = conn.cursor()

print("Total rows:")
for table in ("tmb_stages", "tmbaccommodations", "tmbaccommodations_stage_lnk", "tmbaccommodations_cmps"):
    cur.execute(f"SELECT COUNT(*) FROM {table};")
    print(f"  {table}: {cur.fetchone()[0]}")

print("\nStages detail:")
cur.execute("""
    SELECT s.id, s.stage_number, s.name, COALESCE(s.locale, 'en') AS locale,
           s.published_at IS NOT NULL AS published,
           s.distance_km, s.elevation_gain, s.elevation_loss,
           COUNT(l.tmbaccommodation_id) AS accom_count
    FROM tmb_stages s
    LEFT JOIN tmbaccommodations_stage_lnk l ON s.id = l.tmb_stage_id
    GROUP BY s.id, s.stage_number, s.name, s.locale, s.published_at,
             s.distance_km, s.elevation_gain, s.elevation_loss
    ORDER BY s.stage_number;
""")
for row in cur.fetchall():
    print(f"  Stage {row[1]} (ID {row[0]}): {row[2]} | locale={row[3]} | published={'yes' if row[4] else 'no'} | distance={row[5]}km | gain={row[6]} | loss={row[7]} | accommodations={row[8]}")

print("\nSample accommodations (10 published entries):")
cur.execute("""
    SELECT a.id, a.name, a.type, a.location_type, a.price_range,
           a.latitude, a.longitude, a.booking_difficulty,
           a.published_at IS NOT NULL AS published,
           ARRAY_AGG(DISTINCT s.stage_number ORDER BY s.stage_number) AS stages
    FROM tmbaccommodations a
    LEFT JOIN tmbaccommodations_stage_lnk l ON a.id = l.tmbaccommodation_id
    LEFT JOIN tmb_stages s ON s.id = l.tmb_stage_id
    WHERE a.published_at IS NOT NULL
    GROUP BY a.id
    ORDER BY a.name
    LIMIT 10;
""")
for row in cur.fetchall():
    stages = ', '.join(str(num) for num in row[9] if num is not None) or 'None'
    print(f"  {row[1]} (ID {row[0]}): {row[2]} / {row[3]} / price {row[4]} / coords=({row[5]}, {row[6]}) / booking diff={row[7]} / stages={stages}")

cur.close()
conn.close()
connector.close()
