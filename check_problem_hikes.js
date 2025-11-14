const data = require('./backend_response.json');
const problemHikes = ['kungsleden', 'huayhuash', 'walker', 'haute route', 'camino dos faros'];

console.log('Checking problem hikes for mainImage data:\n');

data.forEach(hike => {
  const title = hike.title.toLowerCase();
  if (problemHikes.some(ph => title.includes(ph))) {
    console.log(hike.title + ':');
    console.log('  Has mainImage:', !!hike.mainImage);
    if (hike.mainImage) {
      console.log('  mainImage.url:', hike.mainImage.url);
      console.log('  Has formats:', !!hike.mainImage.formats);
      if (hike.mainImage.formats) {
        console.log('  Format sizes:', Object.keys(hike.mainImage.formats));
        console.log('  Medium URL:', hike.mainImage.formats.medium?.url || 'N/A');
      }
    }
    console.log('');
  }
});
