import requests, re
resp = requests.get('https://cms-service-4qmlfzul5q-nw.a.run.app/api/hikes?pagination[pageSize]=100')
data = resp.json()['data']
def slugify(title):
    import re
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug).strip('-')
    return slug
for item in data:
    slug = slugify(item['title'])
    if slug in ('camino-de-santiago-camino-francs','camio-dos-faros-the-lighthouse-way'):
        print(slug, item['id'], item.get('hike_id'))
