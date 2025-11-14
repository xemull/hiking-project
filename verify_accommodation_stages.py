#!/usr/bin/env python3
"""Verify accommodation-stage relationships that frontend will see."""

import requests
import json

print("="*70)
print("VERIFY ACCOMMODATION-STAGE RELATIONSHIPS (FRONTEND VIEW)")
print("="*70)

# Fetch from backend API (what frontend sees)
url = "https://backend-service-623946599151.europe-west2.run.app/api/tmb-accommodations"
print(f"\nFetching from: {url}")

try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    data = response.json()

    total = len(data)
    with_stage = sum(1 for item in data if item.get('stage'))
    without_stage = total - with_stage

    print(f"\nTotal accommodations: {total}")
    print(f"With stage assignment: {with_stage}")
    print(f"Without stage assignment: {without_stage}")

    # Group by stage
    by_stage = {}
    no_stage = []

    for item in data:
        if item.get('stage'):
            stage_num = item['stage'].get('stage_number', '?')
            if stage_num not in by_stage:
                by_stage[stage_num] = []
            by_stage[stage_num].append(item['name'])
        else:
            no_stage.append(item['name'])

    print(f"\nAccommodations by stage:")
    for stage_num in sorted(by_stage.keys()):
        print(f"  Stage {stage_num}: {len(by_stage[stage_num])} accommodations")

    if no_stage:
        print(f"\nAccommodations without stage: {len(no_stage)}")
        print("  First 5:")
        for name in no_stage[:5]:
            print(f"    - {name}")

    # Show sample with stages
    print(f"\nSample accommodations with stages:")
    count = 0
    for stage_num in sorted(by_stage.keys()):
        if count >= 10:
            break
        for name in by_stage[stage_num][:2]:
            print(f"  Stage {stage_num}: {name}")
            count += 1
            if count >= 10:
                break

    print(f"\nSUCCESS! Backend is returning {with_stage} accommodations with stage info")

except requests.exceptions.RequestException as e:
    print(f"\nERROR fetching data: {e}")
except Exception as e:
    print(f"\nERROR processing data: {e}")

print("\n" + "="*70)
