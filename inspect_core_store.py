import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("SELECT key, value FROM strapi_core_store_settings WHERE key LIKE '%hike%'")
rows = cur.fetchall()
for key, value in rows:
    print('KEY:', key)
    print(value[:200])
    print()
cur.close()
conn.close()
