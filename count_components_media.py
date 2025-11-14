import psycopg2
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
for table in (
    "components_hike_blogs",
    "components_hike_books",
    "components_hike_landmarks",
    "components_hike_videos",
    "accommodations",
    "accommodations_hikes_lnk",
    "files",
    "files_folder_lnk",
    "files_related_mph",
    "upload_folders"):
    cur.execute(f"SELECT COUNT(*) FROM {table}")
    print(f"{table}: {cur.fetchone()[0]}")
cur.close()
conn.close()
