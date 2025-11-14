import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("ALTER TABLE IF EXISTS hikes RENAME COLUMN accomodation TO accommodation")
conn.commit()
cur.close()
conn.close()
print("Renamed column accomodation -> accommodation")
