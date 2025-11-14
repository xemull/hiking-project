import psycopg2, json
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
cur.execute("SELECT value FROM strapi_core_store_settings WHERE key = 'plugin_content_manager_configuration_content_types::api::hike.hike'")
(value,) = cur.fetchone()
data = json.loads(value)
print('layout sections containing Accomodation:')
for section in data.get('layouts', {}).get('edit', []):
    for row in section:
        for field in row:
            if isinstance(field, str) and 'Accomodation' in field:
                print('edit field row:', field)
                
for column in data.get('layouts', {}).get('list', []):
    if 'Accomodation' in column:
        print('list field:', column)
cur.close()
conn.close()
