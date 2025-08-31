document.addEventListener('DOMContentLoaded', () => {
  const yearInput = document.getElementById('year');
  const seriesInput = document.getElementById('series');
  const raceInput = document.getElementById('race');
  const content = document.getElementById('content');
  const tabsContainer = document.getElementById('tabs');

  const endpoints = [
    { name: 'Lap Times', build: (y, s, r) => `https://cf.nascar.com/cacher/${y}/${s}/${r}/lap-times.json` },
    { name: 'Lap Notes', build: (y, s, r) => `https://cf.nascar.com/cacher/${y}/${s}/${r}/lap-notes.json` },
    { name: 'Live Feed', build: () => 'https://cf.nascar.com/live/feeds/live-feed.json' },
    { name: 'Live Flag Data', build: () => 'https://cf.nascar.com/live/feeds/live-flag-data.json' },
    { name: 'Live Pit Data', build: (y, s, r) => `https://cf.nascar.com/cacher/live/series_${s}/${r}/live-pit-data.json` },
    { name: 'Live Points Data', build: (y, s, r) => `https://cf.nascar.com/live/feeds/series_${s}/${r}/live_points.json` },
    { name: 'Loop Stats', build: (y, s, r) => `https://cf.nascar.com/loopstats/prod/${y}/${s}/${r}.json` },
    { name: 'Race List Basic', build: (y) => `https://cf.nascar.com/cacher/${y}/race_list_basic.json` },
    { name: 'Series ID', static: { 1: 'Cup Series', 2: 'Xfinity', 3: 'Truck Series' } },
    { name: 'Weekend Feed', build: (y, s, r) => `https://cf.nascar.com/cacher/${y}/${s}/${r}/weekend-feed.json` },
    { name: 'Flag State', static: { 0: 'None', 1: 'Green', 2: 'Yellow', 3: 'Red', 4: 'White', 5: 'Checkered', 6: 'Who Knows 1', 7: 'Who Knows 2', 8: 'Hot Track' } },
  ];

  endpoints.forEach((ep, index) => {
    const btn = document.createElement('button');
    btn.textContent = ep.name;
    btn.className = 'tab';
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      load(ep);
    });
    tabsContainer.appendChild(btn);
    if (index === 0) {
      btn.classList.add('active');
      load(ep);
    }
  });

  function load(ep) {
    if (ep.static) {
      content.textContent = JSON.stringify(ep.static, null, 2);
      return;
    }
    const y = yearInput.value;
    const s = seriesInput.value;
    const r = raceInput.value;
    const url = ep.build(y, s, r);
    const proxied = `/proxy?url=${encodeURIComponent(url)}`;
    content.textContent = 'Loading...';
    fetch(proxied)
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(data => {
        content.textContent = JSON.stringify(data, null, 2);
      })
      .catch(err => {
        content.textContent = `Error fetching ${url}: ${err}`;
      });
  }
});
