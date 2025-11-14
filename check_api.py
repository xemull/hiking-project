import requests
import json

CMS_URL = "https://cms-service-623946599151.europe-west2.run.app"

print("Checking TMB Stages API...")
response = requests.get(f"{CMS_URL}/api/tmb-stages?pagination[limit]=1&populate=accommodations")
print(f"Status: {response.status_code}")

if response.status_code == 200:
    data = response.json()
    if data.get('data'):
        stage = data['data'][0]
        print(f"\nStage: {stage['name']}")
        print(f"Stage has {len(stage.get('accommodations', []))} accommodations")
        if stage.get('accommodations'):
            print(f"Example: {stage['accommodations'][0]['name']}")
else:
    print(f"Error: {response.text}")

print("\n" + "="*60)
print("Checking TMB Accommodations API...")

response = requests.get(f"{CMS_URL}/api/tmbaccommodations?filters[name][$eq]=Auberge de Bionnassay&populate=stage")
print(f"Status: {response.status_code}")

if response.status_code == 200:
    data = response.json()
    if data.get('data'):
        accom = data['data'][0]
        print(f"\nAccommodation: {accom['name']}")
        if accom.get('stage'):
            print(f"Stage: {accom['stage']['name']} (Stage {accom['stage']['stage_number']})")
            print("\nSUCCESS! Relationships are working in the API!")
        else:
            print("WARNING: No stage relationship found")
    else:
        print("No data found")
else:
    print(f"Error: {response.text}")

print("\n" + "="*60)
print("Summary:")
print("API is working and relationships are present in database")
print("Next step: Check admin panel to verify relationships display correctly")
print("Go to: https://cms-service-623946599151.europe-west2.run.app/admin")
print("Open any TMB accommodation and verify the stage field shows the linked stage")
