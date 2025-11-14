import psycopg2, json
conn = psycopg2.connect(host="aws-1-eu-west-1.pooler.supabase.com", port=6543, user="postgres.lpkaumowfuovlgjgilrt", password="ZZH4NxTL@W^D^h", dbname="postgres", sslmode="require")
cur = conn.cursor()
key = 'plugin_content_manager_configuration_content_types::api::hike.hike'
cur.execute("SELECT value FROM strapi_core_store_settings WHERE key = %s", (key,))
(value,) = cur.fetchone()
data = json.loads(value)
changed = False
if 'Accomodation' in data['metadatas']:
    data['metadatas']['accommodation'] = data['metadatas'].pop('Accomodation')
    changed = True
    data['metadatas']['accommodation']['edit']['label'] = 'Accommodation'
    data['metadatas']['accommodation']['list']['label'] = 'Accommodation'

layouts = data.get('layouts', {})
for layout_key in ('edit', 'list'): 
    layout = layouts.get(layout_key)
    if not layout:
        continue
    def replace_field(item):
        if isinstance(item, str) and item == 'Accomodation':
            return 'accommodation'
        if isinstance(item, list):
            return [replace_field(sub) for sub in item]
        if isinstance(item, dict):
            return {k: replace_field(v) for k, v in item.items()}
        return item
    new_layout = replace_field(layout)
    layouts[layout_key] = new_layout
    data['layouts'][layout_key] = new_layout

if changed:
    new_value = json.dumps(data)
    cur.execute("UPDATE strapi_core_store_settings SET value=%s WHERE key=%s", (new_value, key))
    conn.commit()
    print('Updated core_store layout for accommodation field')
else:
    print('No changes needed')
cur.close()
conn.close()
