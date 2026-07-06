/* ============================================================
   KENI RIDES — Fleet data
   Images live in /public/bikes/<slug>.jpg — drop the real photos
   in and they are picked up automatically (a styled placeholder
   shows until then).
   ============================================================ */
window.KENI_BIKES = [
  {
    slug: 'bmw-gs1200-adventure',
    name: 'BMW GS 1200 Adventure',
    short: 'BMW GS 1200',
    price: 150,
    category: 'Adventure Flagship',
    tagline: 'The legend of world travel. Cross the Atlas without breaking a sweat.',
    engine: '1170 cc boxer twin',
    power: '125 hp',
    seat: '890 mm',
    weight: '260 kg',
    tank: '30 L',
    terrain: 'Long distance · Desert pistes · Mountain passes',
    description:
      'The GS 1200 Adventure is the benchmark of adventure touring. With its huge 30-litre tank, electronic suspension and effortless boxer torque, it devours Moroccan highways and desert pistes alike. The perfect machine for riders who want to cross the country in comfort and style.',
    features: ['30 L long-range tank', 'Aluminium panniers available', 'Cruise control', 'Heated grips', 'Riding modes & ABS Pro', 'Crash bars fitted']
  },
  {
    slug: 'yamaha-tenere-700-world-raid',
    name: 'Yamaha Ténéré 700 World Raid',
    short: 'Ténéré 700 World Raid',
    price: 140,
    category: 'Rally Raid',
    tagline: 'Rally DNA with twin tanks — born for the Sahara.',
    engine: '689 cc CP2 twin',
    power: '73 hp',
    seat: '890 mm',
    weight: '220 kg',
    tank: '23 L (twin tanks)',
    terrain: 'Sahara crossings · Rally pistes · Technical off-road',
    description:
      'The World Raid takes the beloved Ténéré 700 and adds twin 23-litre tanks, longer-travel suspension and a rally cockpit. It is the closest you can get to a Dakar machine with a licence plate — ideal for deep desert expeditions.',
    features: ['Twin-tank 500 km range', 'KYB long-travel suspension', 'Rally-style cockpit', '3-mode ABS', 'Rugged skid plate', 'Off-road tyres']
  },
  {
    slug: 'yamaha-tenere-700',
    name: 'Yamaha Ténéré 700',
    short: 'Ténéré 700',
    price: 120,
    category: 'Adventure',
    tagline: 'The modern icon of African adventure riding.',
    engine: '689 cc CP2 twin',
    power: '73 hp',
    seat: '875 mm',
    weight: '204 kg',
    tank: '16 L',
    terrain: 'Mixed touring · Gravel · Mountain trails',
    description:
      'Light, torquey and nearly indestructible, the Ténéré 700 is the go-to adventure bike for Morocco. Agile enough for Atlas switchbacks, stable enough for long desert stretches — a true do-it-all machine.',
    features: ['Class-leading agility', 'Rally-inspired fairing', 'Switchable ABS', 'LED rally lights', 'Luggage rack fitted', 'Crash protection']
  },
  {
    slug: 'bmw-f800gs-adventure',
    name: 'BMW F800GS Adventure',
    short: 'BMW F800GS',
    price: 120,
    category: 'Adventure',
    tagline: 'Long-range comfort with genuine off-road ability.',
    engine: '798 cc parallel twin',
    power: '85 hp',
    seat: '890 mm',
    weight: '229 kg',
    tank: '24 L',
    terrain: 'Long distance · Gravel roads · Dunes edges',
    description:
      'The F800GS Adventure blends BMW touring comfort with a chassis that genuinely loves dirt. Its 24-litre tank and relaxed ergonomics make it a favourite for week-long loops through the South of Morocco.',
    features: ['24 L adventure tank', 'Comfort touring seat', 'Heated grips', 'Pannier mounts', 'Switchable ABS', 'Tall windscreen']
  },
  {
    slug: 'honda-transalp-700',
    name: 'Honda Transalp 700',
    short: 'Transalp 700',
    price: 85,
    category: 'Adventure Touring',
    tagline: 'Smooth, reliable, ready for every road in Morocco.',
    engine: '680 cc V-twin',
    power: '60 hp',
    seat: '841 mm',
    weight: '214 kg',
    tank: '17.5 L',
    terrain: 'Road touring · Coastal routes · Light gravel',
    description:
      'A legend of dependable travel, the Transalp is silky-smooth on tarmac and confident on gravel. Its lower seat and friendly power delivery make it a superb choice for relaxed touring along the coasts and through the valleys.',
    features: ['Accessible seat height', 'Smooth V-twin power', 'Excellent wind protection', 'Luggage rack', 'ABS brakes', 'All-day comfort']
  },
  {
    slug: 'yamaha-xtz660-tenere',
    name: 'Yamaha XTZ660 Ténéré',
    short: 'XTZ660 Ténéré',
    price: 75,
    category: 'Classic Adventure',
    tagline: 'The original desert racer spirit, built like a tank.',
    engine: '660 cc single',
    power: '48 hp',
    seat: '895 mm',
    weight: '206 kg',
    tank: '23 L',
    terrain: 'Desert pistes · Long range · Mixed terrain',
    description:
      'Direct descendant of the Dakar-winning Ténérés, the XTZ660 carries a huge 23-litre tank and a bulletproof single-cylinder engine. Simple, honest and enormously capable — pure adventure without electronics.',
    features: ['23 L range tank', 'Bulletproof single', 'Tall rally screen', 'Steel luggage rack', 'Simple & reliable', 'Great on pistes']
  },
  {
    slug: 'yamaha-xt660r',
    name: 'Yamaha XT660R',
    short: 'XT660R',
    price: 75,
    category: 'Dual-Sport',
    tagline: 'Torquey single-cylinder fun on and off the road.',
    engine: '660 cc single',
    power: '48 hp',
    seat: '865 mm',
    weight: '181 kg',
    tank: '15 L',
    terrain: 'Trails · Mountain roads · Village pistes',
    description:
      'The XT660R is a big trail bike with a playful heart. Light, torquey and easy to handle, it thrives on Atlas mountain trails and narrow village roads where bigger machines feel heavy.',
    features: ['Light & flickable', 'Strong low-end torque', 'Long-travel suspension', 'Proven reliability', 'Easy maintenance', 'Great first big trail']
  },
  {
    slug: 'suzuki-dr650',
    name: 'Suzuki DR650',
    short: 'DR650',
    price: 75,
    category: 'Dual-Sport',
    tagline: 'The world traveller’s favourite workhorse.',
    engine: '644 cc single',
    power: '46 hp',
    seat: '885 mm',
    weight: '166 kg',
    tank: '13 L',
    terrain: 'Everything · Desert · Mountains · City',
    description:
      'Simple, light and famously unbreakable, the DR650 has carried travellers around the planet. It handles sand, rocks and tarmac with equal ease — the definitive go-anywhere Morocco bike.',
    features: ['Legendary reliability', 'Low running weight', 'Easy seat height option', 'Field-repairable', 'Confident in sand', 'Ideal for long trips']
  },
  {
    slug: 'suzuki-dr400',
    name: 'Suzuki DR400',
    short: 'DR400',
    price: 70,
    category: 'Dual-Sport',
    tagline: 'Light enough to play, strong enough to travel.',
    engine: '398 cc single',
    power: '40 hp',
    seat: '935 mm',
    weight: '145 kg',
    tank: '10 L',
    terrain: 'Technical trails · Dunes · Single track',
    description:
      'The DR-Z400 is the sweet spot between a trail toy and a travel bike. Superb in technical terrain and dunes, it rewards riders who want to explore the wilder corners of Morocco.',
    features: ['145 kg feather weight', 'Excellent suspension', 'Nimble in dunes', 'Strong 400 single', 'Tough as nails', 'Pure off-road fun']
  },
  {
    slug: 'honda-crf250',
    name: 'Honda CRF250',
    short: 'CRF250',
    price: 65,
    category: 'Lightweight Trail',
    tagline: 'Effortless off-road confidence for every rider.',
    engine: '250 cc single',
    power: '25 hp',
    seat: '830 mm',
    weight: '144 kg',
    tank: '7.8 L',
    terrain: 'Trails · Beginners off-road · Day trips',
    description:
      'Light, friendly and impossible to dislike, the CRF250 makes off-road riding accessible to everyone. Perfect for day trips into the hills and for riders taking their first steps off the tarmac.',
    features: ['Beginner friendly', 'Very light handling', 'Low seat height', 'Fuel-injected', 'Honda reliability', 'Ideal day-trip bike']
  },
  {
    slug: 'suzuki-dr200',
    name: 'Suzuki DR200',
    short: 'DR200',
    price: 60,
    category: 'Lightweight Trail',
    tagline: 'The easiest way to start your Moroccan adventure.',
    engine: '199 cc single',
    power: '20 hp',
    seat: '810 mm',
    weight: '126 kg',
    tank: '13 L',
    terrain: 'City · Villages · Easy trails',
    description:
      'Small, simple and confidence-inspiring, the DR200 is the gentlest introduction to adventure riding. Low seat, light weight, and a surprisingly long range — explore at your own pace.',
    features: ['Lowest seat height', 'Only 126 kg', '13 L long-range tank', 'Super economical', 'Effortless to ride', 'Great for two-up towns']
  }
];

window.KENI_BIKE_IMG = function (slug) {
  return 'public/bikes/' + slug + '.jpg';
};

window.KENI_GET_BIKE = function (slug) {
  return window.KENI_BIKES.find(function (b) { return b.slug === slug; }) || null;
};
