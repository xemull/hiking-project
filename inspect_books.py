import json
with open('tmp_hike.json','r') as fh:
    data = json.load(fh)
books = data['content']['Books']
print(len(books))
import itertools
print(json.dumps(list(itertools.islice(books,2)), indent=2))
