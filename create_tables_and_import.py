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

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

try:
    cur = conn.cursor()

    # ============================================================
    # STEP 1: Create tmb_stages table
    # ============================================================
    log("Creating tmb_stages table...")

    cur.execute("""
        CREATE TABLE IF NOT EXISTS tmb_stages (
            id SERIAL PRIMARY KEY,
            document_id VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            stage_number INTEGER,
            start_location VARCHAR(255),
            end_location VARCHAR(255),
            distance_km DECIMAL(10, 2),
            elevation_gain DECIMAL(10, 2),
            elevation_loss DECIMAL(10, 2),
            difficulty VARCHAR(50),
            description JSONB,
            estimated_time VARCHAR(255),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            published_at TIMESTAMP,
            created_by_id INTEGER,
            updated_by_id INTEGER,
            locale VARCHAR(10)
        );
    """)
    conn.commit()
    log("OK tmb_stages table created")

    # ============================================================
    # STEP 2: Create tmbaccommodations table
    # ============================================================
    log("Creating tmbaccommodations table...")

    cur.execute("""
        CREATE TABLE IF NOT EXISTS tmbaccommodations (
            id SERIAL PRIMARY KEY,
            document_id VARCHAR(255) NOT NULL,
            name VARCHAR(255),
            type VARCHAR(50),
            location_type VARCHAR(50),
            latitude DOUBLE PRECISION,
            longitude DOUBLE PRECISION,
            website VARCHAR(500),
            phone VARCHAR(50),
            email VARCHAR(255),
            price_range VARCHAR(100),
            capacity INTEGER,
            altitude INTEGER,
            notes TEXT,
            booking_method VARCHAR(100),
            description TEXT,
            booking_difficulty VARCHAR(50),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            published_at TIMESTAMP,
            created_by_id INTEGER,
            updated_by_id INTEGER,
            locale VARCHAR(10)
        );
    """)
    conn.commit()
    log("OK tmbaccommodations table created")

    # ============================================================
    # STEP 3: Create junction table for stage relationships
    # ============================================================
    log("Creating tmbaccommodations_stage_lnk table...")

    cur.execute("""
        CREATE TABLE IF NOT EXISTS tmbaccommodations_stage_lnk (
            id SERIAL PRIMARY KEY,
            tmbaccommodation_id INTEGER REFERENCES tmbaccommodations(id) ON DELETE CASCADE,
            tmb_stage_id INTEGER REFERENCES tmb_stages(id) ON DELETE CASCADE,
            tmbaccommodation_ord DOUBLE PRECISION,
            UNIQUE(tmbaccommodation_id, tmb_stage_id)
        );
    """)
    conn.commit()
    log("OK tmbaccommodations_stage_lnk table created")

    # ============================================================
    # STEP 4: Load backup data
    # ============================================================
    log("Loading backup data...")

    with open('tmb_complete_backup_20251113_205216.json', 'r', encoding='utf-8') as f:
        backup_data = json.load(f)

    log(f"Backup contains {len(backup_data['tmb_stages'])} stages and {len(backup_data['tmb_accommodations'])} accommodations")

    # ============================================================
    # STEP 5: Import TMB Stages
    # ============================================================
    log("Importing TMB stages...")

    stage_id_mapping = {}  # old_id -> new_id

    for stage in backup_data['tmb_stages']:
        # Convert description string to proper JSON if it exists
        description_json = None
        if stage.get('description'):
            try:
                # Try to parse as JSON first
                import ast
                description_json = json.dumps(ast.literal_eval(stage['description']))
            except:
                # If that fails, just store the string as-is wrapped in JSON
                description_json = json.dumps(stage['description'])

        cur.execute("""
            INSERT INTO tmb_stages (
                document_id, name, stage_number, start_location, end_location,
                distance_km, elevation_gain, elevation_loss, difficulty, description,
                estimated_time, created_at, updated_at, published_at
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            ) RETURNING id;
        """, (
            stage['document_id'],
            stage['name'],
            stage['stage_number'],
            stage['start_location'],
            stage['end_location'],
            stage['distance_km'],
            stage['elevation_gain'],
            stage['elevation_loss'],
            stage['difficulty'],
            description_json,
            stage['estimated_time'],
            stage['created_at'],
            stage['updated_at'],
            stage['published_at']
        ))

        new_id = cur.fetchone()[0]
        stage_id_mapping[stage['id']] = new_id
        log(f"  OK Imported stage {stage['stage_number']}: {stage['name']} (ID: {new_id})")

    conn.commit()
    log(f"OK Imported {len(backup_data['tmb_stages'])} stages")

    # ============================================================
    # STEP 6: Import TMB Accommodations
    # ============================================================
    log("Importing TMB accommodations...")

    accom_id_mapping = {}  # old_id -> new_id
    relationships_to_create = []  # (accom_new_id, stage_new_id)

    for accom in backup_data['tmb_accommodations']:
        cur.execute("""
            INSERT INTO tmbaccommodations (
                document_id, name, type, location_type, latitude, longitude,
                website, phone, email, price_range, capacity, altitude,
                notes, booking_method, description, booking_difficulty,
                created_at, updated_at, published_at
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            ) RETURNING id;
        """, (
            accom['document_id'],
            accom['name'],
            accom.get('type'),
            accom.get('location_type'),
            accom.get('latitude'),
            accom.get('longitude'),
            accom.get('website'),
            accom.get('phone'),
            accom.get('email'),
            accom.get('price_range'),
            accom.get('capacity'),
            accom.get('altitude'),
            accom.get('notes'),
            accom.get('booking_method'),
            accom.get('description'),
            accom.get('booking_difficulty'),
            accom['created_at'],
            accom['updated_at'],
            accom['published_at']
        ))

        new_id = cur.fetchone()[0]
        accom_id_mapping[accom['id']] = new_id

        # Track relationships to create later
        if accom.get('stage_id'):
            old_stage_id = accom['stage_id']
            if old_stage_id in stage_id_mapping:
                relationships_to_create.append((new_id, stage_id_mapping[old_stage_id]))

        log(f"  OK Imported: {accom['name']} (ID: {new_id})")

    conn.commit()
    log(f"OK Imported {len(backup_data['tmb_accommodations'])} accommodations")

    # ============================================================
    # STEP 7: Create stage relationships
    # ============================================================
    log("Creating stage relationships...")

    for accom_id, stage_id in relationships_to_create:
        cur.execute("""
            INSERT INTO tmbaccommodations_stage_lnk (tmbaccommodation_id, tmb_stage_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING;
        """, (accom_id, stage_id))

    conn.commit()
    log(f"OK Created {len(relationships_to_create)} stage relationships")

    # ============================================================
    # STEP 8: Verify import
    # ============================================================
    log("\nVerifying import...")

    cur.execute("SELECT COUNT(*) FROM tmb_stages;")
    stage_count = cur.fetchone()[0]
    log(f"  TMB Stages in database: {stage_count}")

    cur.execute("SELECT COUNT(*) FROM tmbaccommodations;")
    accom_count = cur.fetchone()[0]
    log(f"  TMB Accommodations in database: {accom_count}")

    cur.execute("SELECT COUNT(*) FROM tmbaccommodations_stage_lnk;")
    link_count = cur.fetchone()[0]
    log(f"  Stage relationships: {link_count}")

    log("\n" + "="*60)
    log("SUCCESS! All tables created and data imported")
    log("="*60)
    log("\nNext step: Restart Strapi service to recognize new tables")
    log("Command: gcloud run services update cms-service --region=europe-west2 --project=trailhead-mvp")

except Exception as e:
    log(f"ERROR: {e}")
    conn.rollback()
    import traceback
    traceback.print_exc()
finally:
    cur.close()
    conn.close()
