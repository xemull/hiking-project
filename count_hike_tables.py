import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
for table in ("countries","months","sceneries","hikes","hikes_cmps","hikes_months_lnk","hikes_sceneries_lnk"):
    cur.execute(f"SELECT COUNT(*) FROM {table}")
    print(f"{table}: {cur.fetchone()[0]}")
cur.close()
conn.close()
