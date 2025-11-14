import psycopg2
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute('SELECT id, name FROM trails')
trail_map = {slugify(name): id for id, name in cur.fetchall()}
cur.execute('SELECT id, title FROM hikes')
hikes = cur.fetchall()
updates = 0
for hike_id, title in hikes:
    slug = slugify(title)
    trail_id = trail_map.get(slug)
    if trail_id:
        cur.execute('UPDATE hikes SET hike_id=%s WHERE id=%s', (trail_id, hike_id))
        updates += cur.rowcount
conn.commit()
print('Updated hike_id for', updates, 'rows')
cur.close()
conn.close()
