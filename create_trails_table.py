import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("""
CREATE TABLE IF NOT EXISTS trails (
    id integer PRIMARY KEY,
    name text,
    simplified_profile jsonb,
    track geometry(LineString, 4326),
    created_at timestamp without time zone
);
""")
conn.commit()
cur.close()
conn.close()
print('Ensured trails table exists in Supabase.')
