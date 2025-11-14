import requests, re
resp = requests.get('https://cms-service-4qmlfzul5q-nw.a.run.app/api/hikes?pagination[pageSize]=100')
data = resp.json()['data']
def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')
for item in data:
    print(slugify(item['title']), item['id'], item.get('hike_id'))
