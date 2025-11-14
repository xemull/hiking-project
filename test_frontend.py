#!/usr/bin/env python3
"""Test if the frontend accommodations page loads successfully."""

import requests
import time

print("="*70)
print("TESTING FRONTEND ACCOMMODATIONS PAGE")
print("="*70)

# Wait a bit for frontend to warm up
print("\nWaiting 5 seconds for frontend to warm up...")
time.sleep(5)

# Test the accommodations page
url = "https://frontend-service-623946599151.europe-west2.run.app/guides/tmb-for-beginners/accommodations"
print(f"\nFetching: {url}")

try:
    response = requests.get(url, timeout=30)
    print(f"Status code: {response.status_code}")

    if response.status_code == 200:
        html = response.text

        # Check for error messages
        if "Error loading accommodations" in html or "Failed to load accommodations" in html:
            print("\n❌ ERROR FOUND IN PAGE:")
            print("The page contains error messages about loading accommodations")

            # Extract error context
            error_start = html.find("Error loading")
            if error_start > 0:
                error_context = html[error_start:error_start+200]
                print(f"Error context: {error_context}")
        elif "Loading accommodations..." in html:
            print("\n⏳ PAGE IS STUCK IN LOADING STATE")
            print("The page is showing the loading spinner but not loading data")
        else:
            print("\n✅ PAGE LOADED SUCCESSFULLY")
            print("No error messages detected in the HTML")

            # Check if there's actual content
            if "TMB Accommodations" in html or "accommodation" in html.lower():
                print("Page appears to contain accommodation content")
    else:
        print(f"\n❌ HTTP ERROR: Status code {response.status_code}")

except Exception as e:
    print(f"\n❌ REQUEST FAILED: {e}")

print("\n" + "="*70)
