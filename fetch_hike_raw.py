import requests
url = "https://cms-service-623946599151.europe-west2.run.app/api/hikes/1"
resp = requests.get(url)
print(resp.status_code)
print(resp.headers.get('content-type'))
print(resp.text[:500])
