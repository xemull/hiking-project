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
cur.execute("SELECT DISTINCT pg_typeof(track)::text FROM trails")
print(cur.fetchall())
cur.close()
conn.close()
connector.close()
