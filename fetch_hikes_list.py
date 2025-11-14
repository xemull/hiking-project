import requests
url = "https://cms-service-4qmlfzul5q-nw.a.run.app/api/hikes?pagination[limit]=1"
resp = requests.get(url)
print(resp.status_code)
data = resp.json()
print(data['data'][0]['attributes'].keys())
print(data['data'][0]['attributes'].get('accommodation'))
print(data['data'][0]['attributes'].get('Accomodation'))
