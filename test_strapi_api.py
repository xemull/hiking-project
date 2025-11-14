import requests
params = {
    'populate[accommodation]': '*',
    'populate[countries]': '*'
}
url = 'https://cms-service-623946599151.europe-west2.run.app/api/hikes/1'
resp = requests.get(url, params=params, headers={'accept': 'application/json'})
print(resp.status_code)
print(resp.text[:500])
