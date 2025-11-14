# Comprehensive Plan to Fix Strapi TMB Stage Relationships

## Current Situation Analysis

### What We Know:
1. **Database State**: Stage relationships ARE in the database
   - 160 link records exist in `tmbaccommodations_stage_lnk`
   - Both draft (ID 87) and published (ID 199) versions of "Auberge de Maya-Joie" have stage_id 11
   - All 81 accommodations have relationships on both draft and published versions

2. **Admin Panel State**: Strapi admin shows empty stage field
   - Screenshot shows "Add or create a relation" despite database having the link
   - This suggests Strapi is not reading the database correctly

3. **Infrastructure**:
   - Using Supabase PostgreSQL database
   - Using `tmb-cms-clean` directory (Strapi v5.24.1)
   - Deployed on Cloud Run at cms-service-623946599151.europe-west2.run.app
   - Legacy `cms/` directory has been removed; canonical CMS is `tmb-cms-clean`

### Why The Database Fix Didn't Work:
**Likely Reasons:**
1. **Strapi Cache**: The running instance hasn't invalidated its cache
2. **Strapi Restart Needed**: Changes to link tables may require Strapi restart
3. **Strapi v5 Document Service**: May use internal metadata tables we haven't found
4. **Schema Mismatch**: The relationship configuration might be incorrect

---

## OPTION 1: Restart Current Strapi Instance (QUICKEST)

**Likelihood of Success**: 60%
**Time**: 5-10 minutes
**Risk**: Low

### Steps:
1. Restart the CMS Cloud Run service to clear any caches
2. Verify the admin panel loads the stage relationships
3. If successful, document the solution

### Commands:
```bash
# Restart the CMS service
gcloud run services update cms-service --region=europe-west2 --project=trailhead-mvp --revision-suffix=$(date +%s)
```

### Pros:
- Fastest option
- Data already correct in database
- Non-destructive

### Cons:
- May not work if issue is deeper than caching
- Doesn't address root cause of why relationships weren't synced initially

---

## OPTION 2: Fix Relationships via Strapi API (RECOMMENDED)

**Likelihood of Success**: 85%
**Time**: 30-60 minutes
**Risk**: Low

### Rationale:
Direct database inserts bypass Strapi's document service. Using Strapi's API ensures all internal metadata is updated correctly.

### Steps:
1. Create a script that uses Strapi's REST API to update each accommodation
2. For each of the 79 accommodations, call the API to set the stage relationship
3. This will trigger Strapi's internal document service to update all necessary tables

### Implementation:
```python
import requests

CMS_URL = "https://cms-service-623946599151.europe-west2.run.app"
API_TOKEN = "YOUR_STRAPI_API_TOKEN"  # Need to create this in Strapi

# Get all accommodations
accommodations = requests.get(
    f"{CMS_URL}/api/tmbaccommodations",
    headers={"Authorization": f"Bearer {API_TOKEN}"}
).json()

# Get stage from published version, update draft version
for accom in accommodations:
    # Update via API to trigger Strapi's internal updates
    requests.put(
        f"{CMS_URL}/api/tmbaccommodations/{accom['id']}",
        json={"data": {"stage": accom['attributes']['stage']['data']['id']}},
        headers={"Authorization": f"Bearer {API_TOKEN}"}
    )
```

### Pros:
- Works with Strapi's internals properly
- Will update all necessary metadata
- Non-destructive

### Cons:
- Requires API token generation
- Slightly more complex

---

## OPTION 3: Fresh Strapi Installation with Proper Import (MOST RELIABLE)

**Likelihood of Success**: 95%
**Time**: 2-3 hours
**Risk**: Medium (requires backup and migration)

### Rationale:
The current database has duplicate records and relationship issues from improper migration. Starting fresh ensures clean state.

### Steps:

#### Phase 1: Backup Everything
1. Export all current TMB data using Strapi's export
2. Backup the Supabase database
3. Document current Cloud Run configuration

#### Phase 2: Create Clean Database
1. Create new Supabase database schema
2. Fresh Strapi installation
3. Configure schema (TMB stages, accommodations)

#### Phase 3: Import Properly
1. Import TMB stages first
2. Import accommodations WITH relationships via Strapi API
3. Verify each step

#### Phase 4: Deploy
1. Update Cloud Run to use new database
2. Test admin panel
3. Test public API

### Pros:
- Clean slate, no legacy issues
- Guaranteed to work correctly
- Follows best practices

### Cons:
- Time consuming
- Requires careful execution
- Brief downtime

---

## OPTION 4: Deprecated — Old CMS Setup (Removed)

The legacy `cms/` directory has been removed from the repository and is no longer supported.

- Canonical Strapi app: `tmb-cms-clean`
- Action: Ignore any guidance referring to the old `cms/` directory
- Rationale: Prevent confusion and ensure a single, clean source of truth for Strapi v5

---

## OPTION 5: Check Strapi Relationship Configuration

**Likelihood of Success**: 70%
**Time**: 1 hour
**Risk**: Low

### Investigation:
The relationship configuration in the schema might be incorrect for Strapi v5's document system.

### Check:
1. Review `tmb-cms-clean/src/api/tmbaccommodation/content-types/tmbaccommodation/schema.json`
2. Review `tmb-cms-clean/src/api/tmb-stage/content-types/tmb-stage/schema.json`
3. Compare with Strapi v5 documentation for oneToOne relationships

### Potential Fix:
The relationship might need to be `manyToOne` instead of `oneToOne`, or might need additional configuration like:
```json
{
  "stage": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "api::tmb-stage.tmb-stage",
    "inversedBy": "accommodations"
  }
}
```

### Pros:
- Addresses potential root cause
- Permanent fix

### Cons:
- Requires schema change and rebuild
- May need data remapping

---

## OPTION 6: Investigate Strapi v5 Internal Tables

**Likelihood of Success**: 50%
**Time**: 2-3 hours
**Risk**: Medium

### Investigation:
Strapi v5 might use additional internal tables for the document system that we haven't discovered.

### Steps:
1. List ALL tables in Supabase
2. Look for any document metadata or relationship tracking tables
3. Check if relationships are tracked separately from link tables
4. Manually update those tables if found

### Pros:
- Could reveal the actual issue
- Deep understanding of problem

### Cons:
- Very time consuming
- May not find anything
- Risk of making things worse

---

## RECOMMENDED APPROACH

### Phase 1: Quick Wins (30 minutes)
1. **Try Option 1**: Restart Strapi service - might just be a cache issue
2. If that doesn't work, **Try Option 5**: Review and fix relationship schema configuration

### Phase 2: API-Based Fix (1 hour)
3. If neither works, **implement Option 2**: Fix relationships via Strapi API
   - This respects Strapi's internal document service
   - Most likely to work without major changes

### Phase 3: Nuclear Option (Only if all else fails)
4. If nothing works, **implement Option 3**: Fresh installation
   - Most reliable but most time consuming
   - Guaranteed to work if done correctly

---

## Required Information Before Proceeding

1. **Do you have a Strapi API token?** (Needed for Option 2)
2. The old `cms/` directory has been removed; canonical CMS is `tmb-cms-clean`.
3. **How much downtime is acceptable?** (Affects Option 3 feasibility)
4. **Do you want me to investigate first or proceed with a fix?**

---

## Success Criteria

A successful fix means:
1. Opening any TMB accommodation in admin panel shows the correct stage
2. Changing a stage relationship and saving works correctly
3. Public API returns accommodations with their stages
4. No duplicate records or orphaned relationships
5. All 81 TMB accommodations are editable

---

## What NOT To Do (Lessons Learned)

1. ❌ Don't claim success without user verification
2. ❌ Don't directly insert into database link tables - use Strapi API
3. ❌ Don't make multiple changes without testing each
4. ❌ Don't assume database changes auto-reflect in Strapi admin
5. ❌ Don't ignore Strapi's document service architecture
