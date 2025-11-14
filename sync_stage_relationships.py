import psycopg2
from datetime import datetime

# Database connection
conn = psycopg2.connect(
    host="aws-1-eu-west-1.pooler.supabase.com",
    database="postgres",
    user="postgres.lpkaumowfuovlgjgilrt",
    password="ZZH4NxTL@W^D^h",
    port="6543"
)

try:
    cur = conn.cursor()

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Finding accommodations with draft/published mismatch...")

    # Find all accommodations where published version has stage but draft doesn't
    cur.execute("""
        WITH duplicates AS (
            SELECT document_id,
                   array_agg(id ORDER BY id) as ids
            FROM tmbaccommodations
            GROUP BY document_id
            HAVING COUNT(*) = 2
        ),
        draft_published AS (
            SELECT document_id,
                   ids[1] as draft_id,
                   ids[2] as published_id
            FROM duplicates
        )
        SELECT
            dp.draft_id,
            dp.published_id,
            t.name,
            lp.tmb_stage_id
        FROM draft_published dp
        JOIN tmbaccommodations t ON t.id = dp.published_id
        JOIN tmbaccommodations_stage_lnk lp ON lp.tmbaccommodation_id = dp.published_id
        WHERE NOT EXISTS (
            SELECT 1 FROM tmbaccommodations_stage_lnk
            WHERE tmbaccommodation_id = dp.draft_id
        )
        ORDER BY dp.draft_id;
    """)

    mismatches = cur.fetchall()
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Found {len(mismatches)} accommodations to sync")

    if len(mismatches) == 0:
        print("No mismatches found. All draft versions already have stage relationships.")
    else:
        # For each mismatch, create a link record for the draft version
        synced_count = 0
        for draft_id, published_id, name, stage_id in mismatches:
            try:
                # Insert link for draft version
                cur.execute("""
                    INSERT INTO tmbaccommodations_stage_lnk (tmbaccommodation_id, tmb_stage_id)
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING;
                """, (draft_id, stage_id))

                synced_count += 1
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Synced: {name} (draft ID {draft_id} -> stage {stage_id})")

            except Exception as e:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] ERROR syncing {name}: {e}")
                conn.rollback()
                continue

        # Commit all changes
        conn.commit()
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] ✓ Successfully synced {synced_count} stage relationships to draft versions")

        # Verify the sync
        cur.execute("""
            WITH duplicates AS (
                SELECT document_id,
                       array_agg(id ORDER BY id) as ids
                FROM tmbaccommodations
                GROUP BY document_id
                HAVING COUNT(*) = 2
            ),
            draft_published AS (
                SELECT document_id,
                       ids[1] as draft_id,
                       ids[2] as published_id
                FROM duplicates
            )
            SELECT COUNT(*) as remaining_mismatches
            FROM draft_published dp
            WHERE EXISTS (
                SELECT 1 FROM tmbaccommodations_stage_lnk
                WHERE tmbaccommodation_id = dp.published_id
            )
            AND NOT EXISTS (
                SELECT 1 FROM tmbaccommodations_stage_lnk
                WHERE tmbaccommodation_id = dp.draft_id
            );
        """)

        remaining = cur.fetchone()[0]
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Remaining mismatches: {remaining}")

        if remaining == 0:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] ✓ All stage relationships are now synced!")

except Exception as e:
    print(f"[{datetime.now().strftime('%H:%M:%S')}] ERROR: {e}")
    conn.rollback()
finally:
    cur.close()
    conn.close()
