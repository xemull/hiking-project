import psycopg2, re
slug_to_trail = {
    'alta-via-1': 7,
    'alta-via-2': 8,
    'camio-dos-faros-the-lighthouse-way': 11,
    'fishermans-trail-rota-vicentina': 14,
    'haute-randonne-pyrnenne-hrp': 17,
    'kungsleden': 21,
    'peaks-of-the-balkans': 24,
    'south-west-coast-path': 25,
    'tour-du-mont-blanc': 28,
    'tour-of-monte-rosa': 23,
    'walkers-haute-route': 16,
    'camino-de-santiago-camino-francs': 9,
    'everest-base-camp-trek': 13,
    'gr20': 15,
    'huayhuash-circuit': 19,
    'malerweg': 22,
    'salkantay-trek': 6,
    'west-highland-way': 32
}

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute('SELECT id, title FROM hikes')
updated = 0
for hike_id, title in cur.fetchall():
    slug = slugify(title)
    new_id = slug_to_trail.get(slug)
    if new_id:
        cur.execute('UPDATE hikes SET hike_id=%s WHERE id=%s', (new_id, hike_id))
        if cur.rowcount:
            updated += 1
conn.commit()
cur.close()
conn.close()
print('Updated', updated, 'hike_id values')
