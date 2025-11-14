import requests, re
resp = requests.get('https://cms-service-4qmlfzul5q-nw.a.run.app/api/hikes?pagination[pageSize]=100')
data = resp.json()['data']
for item in data:
    title = item['title']
    slug = re.sub(r'\s+', '-', re.sub(r'[^a-z0-9\s-]', '', title.lower())).strip('-')
    if 'camino' in slug:
        print(slug, item['id'], item.get('hike_id'))
