from google.cloud.sql.connector import Connector
connector = Connector()
conn = connector.connect(
    "trailhead-mvp:europe-west2:hiking-project-db-233ae46e",
    "pg8000",
    user="hike_admin",
    password="foaA99&I5Und!k",
    db="hikes_db"
)
cur = conn.cursor()
cur.execute("""
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema='public' AND table_name='trails'
ORDER BY ordinal_position;
""")
for row in cur.fetchall():
    print(row)
cur.close()
conn.close()
connector.close()
