import psycopg2
import json
from datetime import datetime

# Database connection
conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    database="postgres",
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    port="6543"
)

backup_data = {
    "export_date": datetime.now().isoformat(),
    "tmb_stages": [],
    "tmb_accommodations": []
}

try:
    cur = conn.cursor()

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Exporting TMB Stages...")

    # Export TMB Stages (only published versions)
    cur.execute("""
        SELECT
            id, document_id, name, stage_number, start_location, end_location,
            distance_km, elevation_gain, elevation_loss, difficulty, description,
            estimated_time, created_at, updated_at, published_at
        FROM tmb_stages
        WHERE published_at IS NOT NULL
        ORDER BY stage_number;
    """)

    columns = [desc[0] for desc in cur.description]
    stages = cur.fetchall()

    from decimal import Decimal
    for stage in stages:
        stage_dict = dict(zip(columns, stage))
        # Convert datetime objects to strings
        for key in ['created_at', 'updated_at', 'published_at']:
            if stage_dict.get(key):
                stage_dict[key] = stage_dict[key].isoformat()
        # Convert all numeric types to proper JSON types
        for key, value in stage_dict.items():
            if isinstance(value, Decimal):
                stage_dict[key] = float(value)
        backup_data["tmb_stages"].append(stage_dict)

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Exported {len(stages)} TMB stages")

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Exporting TMB Accommodations...")

    # Export TMB Accommodations (only published versions with their stage relationships)
    cur.execute("""
        SELECT
            t.id, t.document_id, t.name, t.type, t.location_type, t.latitude,
            t.longitude, t.website, t.phone, t.email, t.price_range, t.capacity,
            t.altitude, t.notes, t.booking_method, t.description, t.booking_difficulty,
            t.created_at, t.updated_at, t.published_at,
            l.tmb_stage_id as stage_id
        FROM tmbaccommodations t
        LEFT JOIN tmbaccommodations_stage_lnk l ON l.tmbaccommodation_id = t.id
        WHERE t.published_at IS NOT NULL
        ORDER BY t.name;
    """)

    columns = [desc[0] for desc in cur.description]
    accommodations = cur.fetchall()

    for accom in accommodations:
        accom_dict = dict(zip(columns, accom))
        # Convert datetime objects to strings
        for key in ['created_at', 'updated_at', 'published_at']:
            if accom_dict.get(key):
                accom_dict[key] = accom_dict[key].isoformat()
        # Convert all numeric types to proper JSON types
        from decimal import Decimal
        for key, value in accom_dict.items():
            if isinstance(value, Decimal):
                accom_dict[key] = float(value)
        backup_data["tmb_accommodations"].append(accom_dict)

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Exported {len(accommodations)} TMB accommodations")

    # Save to file
    filename = f"tmb_complete_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(backup_data, f, indent=2, ensure_ascii=False)

    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] ✓ Backup saved to {filename}")
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Summary:")
    print(f"  - TMB Stages: {len(backup_data['tmb_stages'])}")
    print(f"  - TMB Accommodations: {len(backup_data['tmb_accommodations'])}")
    print(f"  - Accommodations with stage: {len([a for a in backup_data['tmb_accommodations'] if a['stage_id']])}")

except Exception as e:
    print(f"[{datetime.now().strftime('%H:%M:%S')}] ERROR: {e}")
    import traceback
    traceback.print_exc()
finally:
    cur.close()
    conn.close()
