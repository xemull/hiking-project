import requests
url = 'https://cms-service-623946599151.europe-west2.run.app/api/hikes/1'
resp = requests.get(url, headers={'accept': 'application/json'})
print(resp.status_code)
if resp.ok:
    data = resp.json()['data']['attributes']
    print('keys:', data.keys())
    print('accommodation:', data.get('accommodation'))
else:
    print(resp.text)
