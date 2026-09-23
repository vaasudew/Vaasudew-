import { LocationPoint, VehicleOption, TourPackage, Destination, DriverInfo, RideBooking } from '../types/travel';

export const NONE_LOCATION: LocationPoint = {
  name: 'None (Select a location)',
  category: 'none',
  lat: 0,
  lng: 0,
  address: 'No location selected',
  notes: 'Please select a location or use live GPS'
};

export const POPULAR_LOCATIONS: LocationPoint[] = [
  {
    name: 'Tirupati Railway Station (TPTY)',
    category: 'station',
    lat: 13.6288,
    lng: 79.4192,
    address: 'Station Road, Tirupati, Andhra Pradesh 517501',
    popular: true,
    notes: 'Platform 1 & Platform 4 dedicated Hari Travels pickup bays'
  },
  {
    name: 'Tirupati International Airport (Renigunta - TIR)',
    category: 'airport',
    lat: 13.6325,
    lng: 79.5436,
    address: 'Tirupati Airport Road, Renigunta, AP 517520',
    popular: true,
    notes: 'Arrival gate greeting with name-board service available'
  },
  {
    name: 'Alipiri Toll Gate (Foot of Hills)',
    category: 'hub',
    lat: 13.6558,
    lng: 79.3888,
    address: 'Alipiri Road, Tirupati, AP 517507',
    popular: true,
    notes: 'TTD Security Checkpost & Ghat Road Entrance (Opens 3:00 AM)'
  },
  {
    name: 'Sri Venkateswara Temple, Tirumala',
    category: 'temple',
    lat: 13.6833,
    lng: 79.3472,
    address: 'S Mada St, Tirumala, Tirupati, AP 517504',
    popular: true,
    notes: 'Drop near CRO Office / Rambagicha Guest House'
  },
  {
    name: 'Tirupati Central RTC Bus Station',
    category: 'station',
    lat: 13.6294,
    lng: 79.4265,
    address: 'Near Old Bus Stand, Tirupati, AP 517501',
    popular: true,
    notes: 'Near Srinivasa Complex exit gate'
  },
  {
    name: 'Sri Padmavathi Ammavari Temple, Tiruchanur',
    category: 'temple',
    lat: 13.6139,
    lng: 79.4528,
    address: 'Tiruchanur, Tirupati, AP 517503',
    popular: true,
    notes: 'Traditional pilgrimage begins or concludes with Goddess Padmavathi blessing'
  },
  {
    name: 'Kapila Theertham (Sri Kapileswara Temple)',
    category: 'temple',
    lat: 13.6508,
    lng: 79.4278,
    address: 'KT Road, Foot of Tirumala Hills, Tirupati, AP 517501',
    popular: true,
    notes: 'Sacred waterfall & only Shiva temple at Tirumala foothills'
  },
  {
    name: 'Silathoranam (Natural Rock Arch)',
    category: 'nature',
    lat: 13.6930,
    lng: 79.3520,
    address: 'Chakra Theertham Road, Tirumala, AP 517504',
    popular: false,
    notes: 'Pre-Cambrian natural geological arch near Chakra Theertham'
  },
  {
    name: 'Papavinasanam & Akasa Ganga',
    category: 'nature',
    lat: 13.7220,
    lng: 79.3620,
    address: 'Papavinasanam Road, Tirumala Hills, AP 517504',
    popular: true,
    notes: 'Sacred holy theertham reservoir and perennial mountain spring'
  },
  {
    name: 'Srikalahasteeswara Temple (Srikalahasti)',
    category: 'temple',
    lat: 13.7498,
    lng: 79.6984,
    address: 'Srikalahasti, Tirupati District, AP 517644',
    popular: true,
    notes: 'Dakshina Kailasam, famous for Rahu Ketu Sarpa Dosha puja (36 km)'
  },
  {
    name: 'Chandragiri Fort & Raja Mahal',
    category: 'heritage',
    lat: 13.5833,
    lng: 79.3167,
    address: 'Chandragiri, AP 517101',
    popular: false,
    notes: '11th century Vijayanagara historical fort & evening sound/light show'
  },
  {
    name: 'Kanipakam Sri Varasiddhi Vinayaka Temple',
    category: 'temple',
    lat: 13.2975,
    lng: 79.0353,
    address: 'Kanipakam, Chittoor District, AP 517131',
    popular: true,
    notes: 'Historic swayambhu Ganesha growing within sacred water well (70 km)'
  }
];

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'toyota-etios',
    name: 'Toyota Etios',
    category: 'Prime Sedan',
    models: 'Toyota Etios Sedan (AC)',
    passengers: 4,
    luggage: 3,
    baseFare: 850,
    perKmRate: 15,
    ghatSurcharge: 300,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Toyota_Etios_saloon%2C_Jakarta.jpg/960px-Toyota_Etios_saloon%2C_Jakarta.jpg',
    features: ['High Comfort AC', 'Hill-Certified Chauffeur', 'Full Boot Space (3 Bags)', 'Bottled Water & Tissues'],
    popular: true,
    recommendedFor: 'Small families, airport & railway transfers, Tirumala ghat ride'
  },
  {
    id: 'ertiga',
    name: 'Ertiga',
    category: 'Comfort 7-Seater',
    models: 'Maruti Suzuki Ertiga (AC)',
    passengers: 6,
    luggage: 4,
    baseFare: 1350,
    perKmRate: 19,
    ghatSurcharge: 400,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Suzuki_Ertiga_%28Side%29_%282%29%2C_Jakarta%2C_Indonesia.jpg/960px-Suzuki_Ertiga_%28Side%29_%282%29%2C_Jakarta%2C_Indonesia.jpg',
    features: ['Dual AC Vents', 'Flexible 3rd Row', 'Smooth Mountain Suspension', 'Extra Luggage Space'],
    popular: true,
    recommendedFor: 'Families of 4–6 with elder pilgrims'
  },
  {
    id: 'toyota-innova',
    name: 'Toyota Innova',
    category: 'Premium Luxury MPV',
    models: 'Toyota Innova / Crysta (VIP AC)',
    passengers: 7,
    luggage: 5,
    baseFare: 1750,
    perKmRate: 23,
    ghatSurcharge: 450,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Toyota_Zenix_2.0_V_Silver_Metallic.jpg/960px-Toyota_Zenix_2.0_V_Silver_Metallic.jpg',
    features: ['Plush Reclining Captain Seats', 'Superior Shock Absorbers on Curves', 'VIP Pickup Service', 'Senior Citizen Assistance'],
    popular: true,
    recommendedFor: 'VIP Darshan trips, elderly pilgrims, executive comfort'
  },
  {
    id: 'tempo-traveller',
    name: 'Tempo Traveller',
    category: 'Group Pilgrimage',
    models: 'Force Tempo Traveller (12 - 17 Seater AC)',
    passengers: 14,
    luggage: 12,
    baseFare: 2850,
    perKmRate: 30,
    ghatSurcharge: 700,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Force_Traveller%2C_Leh-Manali_Highway.jpg/960px-Force_Traveller%2C_Leh-Manali_Highway.jpg',
    features: ['Pushback Reclining Seats', 'Top Roof Luggage Carrier', 'Individual AC Louvers', 'Dedicated Experienced Group Chauffeur'],
    recommendedFor: 'Joint families, bhajan mandalis, extended pilgrim groups'
  }
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'tirumala-darshan',
    title: 'Tirumala Hill Pilgrimage Experience',
    tagline: 'Private dedicated cab for sacred Balaji Darshan, uphill & downhill Ghat road journey with flexible wait-time.',
    duration: '1 Day (8 - 10 Hours)',
    category: 'temple',
    startingPrice: 1850,
    vehicle: 'Private AC Sedan / Crysta',
    rating: 4.9,
    reviewsCount: 1240,
    badge: 'Top Choice for Darshan',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/1280px-Tirumala_090615.jpg',
    destinations: [
      'Alipiri Checkpost Verification',
      'Scenic Ghat Road Uphill (17 km)',
      'Sri Venkateswara Temple Drop (CRO Area)',
      'Pilgrim waiting at designated parking',
      'Return journey via scenic Downhill Ghat'
    ],
    included: [
      'Doorstep hotel/station pickup in Tirupati',
      'All Ghat road tolls & TTD parking charges',
      'Professional certified hill driver with ghat experience',
      'Flexible 6-8 hours wait time for your Darshan slot',
      'Complimentary chilled bottled water'
    ],
    excluded: [
      'TTD Official Darshan tickets (must be reserved via official portal)',
      'Personal prasadam or special seva expenses',
      'Tonsure / accommodation tokens'
    ],
    itinerary: [
      { time: 'As per slot', activity: 'Pickup from Tirupati', description: 'Driver arrives 20 mins prior at your hotel or railway station' },
      { time: '+45 mins', activity: 'Alipiri Ghat Road Entry', description: 'Mandatory security check & pleasant uphill drive with mountain views' },
      { time: '+1.5 hrs', activity: 'Tirumala Arrival & Drop', description: 'Assistance finding cloakrooms, footwear counters, and reporting queue' },
      { time: 'Flexible', activity: 'Darshan & Laddu Prasadam', description: 'Driver stays on-call at Tirumala designated cab stand' },
      { time: 'Return', activity: 'Downhill Ghat Road', description: 'Safe controlled mountain descent back to your Tirupati destination' }
    ],
    ttdNotice: 'Darshan tickets must be pre-booked via TTD official site (tirupatibalaji.ap.gov.in). Hari Travels provides private transport and local guidance only.'
  },
  {
    id: 'tirupati-temple-trail',
    title: 'Tirupati TTD Heritage Temple Trail',
    tagline: 'Explore the holy shrines consecrated by ancient dynasties at the foothills of Seshachalam.',
    duration: 'Half Day (5 - 6 Hours)',
    category: 'temple',
    startingPrice: 1550,
    vehicle: 'Private AC Cab',
    rating: 4.8,
    reviewsCount: 890,
    badge: 'Pilgrimage Circuit',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Padmavathi_Ammavari_Temple.JPG/1280px-Padmavathi_Ammavari_Temple.JPG',
    destinations: [
      'Sri Padmavathi Ammavari Temple (Tiruchanur)',
      'Sri Govindaraja Swamy Temple',
      'Sri Kapileswara Swamy Temple (Kapila Theertham)',
      'Sri Kodandarama Swamy Temple'
    ],
    included: [
      'Door-to-door AC cab transfer',
      'Knowledgeable local driver guiding temple order & timings',
      'All parking charges and driver allowance',
      'Assistance with senior citizen drops near entrance'
    ],
    excluded: [
      'Special entry darshan tickets at individual temples (₹20 - ₹100 each)',
      'Personal archana offerings'
    ],
    itinerary: [
      { time: '08:00 AM', activity: 'Padmavathi Ammavari Temple', description: 'Seek blessings of Goddess Padmavathi at Tiruchanur' },
      { time: '10:00 AM', activity: 'Govindaraja Swamy Temple', description: 'Marvel at the 54-meter Raja Gopuram and reclining deity' },
      { time: '11:30 AM', activity: 'Kapila Theertham Waterfall', description: 'Witness sacred Shiva kshetram at foot of hills' },
      { time: '01:00 PM', activity: 'Kodandarama Swamy & Drop', description: 'Ancient temple visited by Sri Ramanujacharya, return drop' }
    ],
    ttdNotice: 'Official dress code strictly enforced: Dhoti/Kurta for gents, Saree/Chudidar with dupatta for ladies.'
  },
  {
    id: 'tirumala-nature-theerthams',
    title: 'Tirumala Nature & Sacred Waterfalls',
    tagline: 'Discover the ancient geological arches and holy theerthams nestled in the high reserve forests.',
    duration: 'Full Day (7 Hours)',
    category: 'nature',
    startingPrice: 2200,
    vehicle: 'Private AC SUV / Sedan',
    rating: 4.9,
    reviewsCount: 650,
    badge: 'Nature & Heritage',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Silathoranam%2C_Tirumala_hills.jpg/1280px-Silathoranam%2C_Tirumala_hills.jpg',
    destinations: [
      'Silathoranam (2.5 Billion-yr-old Natural Rock Arch)',
      'Chakra Theertham',
      'Papavinasanam Reservoir & Theertham',
      'Akasa Ganga Holy Spring',
      'Srivari Padaalu (Highest Peak of Tirumala)',
      'Venugopala Swamy Temple'
    ],
    included: [
      'Tirupati to Tirumala hill transit + full Tirumala sightseeing',
      'Ghat road permits and forest area parking fees',
      'Dedicated AC vehicle throughout the nature circuit',
      'Driver assistance at trekking viewpoints'
    ],
    excluded: [
      'Forest department tokens if required',
      'Personal snacks and offerings'
    ],
    itinerary: [
      { time: '07:30 AM', activity: 'Ascent to Tirumala Hills', description: 'Scenic drive with mountain mist and forest viewpoints' },
      { time: '09:00 AM', activity: 'Silathoranam & Chakra Theertham', description: 'Rare pre-Cambrian geological wonder documented by Geological Survey of India' },
      { time: '11:00 AM', activity: 'Srivari Padaalu Viewpoint', description: 'Sacred footprints at the highest peak with 360-degree valley view' },
      { time: '12:30 PM', activity: 'Akasa Ganga & Papavinasanam', description: 'Perennial waterfalls whose holy waters bathe Lord Venkateswara' },
      { time: '03:00 PM', activity: 'Descent & Return Drop', description: 'Comfortable downhill drive back to Tirupati' }
    ],
    ttdNotice: 'Natural rock arch and theertham timings are monitored by TTD forest security. Best visited in morning hours.'
  },
  {
    id: 'srikalahasti-kanipakam',
    title: 'Divya Kshetram: Srikalahasti & Kanipakam',
    tagline: 'Comprehensive pilgrimage to Rahu Ketu Kshetram and the Swayambhu Vinayaka well temple.',
    duration: 'Full Day (9 - 10 Hours)',
    category: 'temple',
    startingPrice: 3100,
    vehicle: 'Private Sedan / Ertiga',
    rating: 4.9,
    reviewsCount: 780,
    badge: 'Spiritual Triangle',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/View_of_Srikalahasthi_Temple_Gopuram.jpg/1280px-View_of_Srikalahasthi_Temple_Gopuram.jpg',
    destinations: [
      'Srikalahasteeswara Temple (Vayu Lingam, 36 km)',
      'Rahu-Ketu Sarpa Dosha Nivarana Mandapam',
      'Kanipakam Sri Varasiddhi Vinayaka Temple (70 km)',
      'Tirupati evening return'
    ],
    included: [
      'Highway tolls, interstate/district taxes & parking fees',
      'Chauffeur experienced in puja timings and temple queue protocols',
      'Flexible halt for Rahu-Ketu Puja (1.5 - 2 hours)',
      'AC on throughout the journey'
    ],
    excluded: [
      'Temple puja tickets (Rahu-Ketu puja tokens ₹500 to ₹2500 paid at temple counter)',
      'Prasadam and meals'
    ],
    itinerary: [
      { time: '06:30 AM', activity: 'Depart Tirupati for Srikalahasti', description: '45-minute smooth highway drive along Swarnamukhi river' },
      { time: '07:30 AM', activity: 'Srikalahasti Puja & Darshan', description: 'Vayu Linga darshan and Rahu Ketu Sarpa Dosha puja' },
      { time: '11:30 AM', activity: 'Drive towards Kanipakam', description: 'Scenic country drive with lunch break at hygienic restaurant' },
      { time: '02:00 PM', activity: 'Kanipakam Swayambhu Ganesha', description: 'Darshan of self-manifesting Ganesha idol inside the active water well' },
      { time: '05:30 PM', activity: 'Return to Tirupati', description: 'Drop at your hotel, bus stand or railway station' }
    ],
    ttdNotice: 'Independent temple trusts (Srikalahasti Devasthanam & Kanipakam Devasthanam). Hari Travels manages private cab transit.'
  },
  {
    id: 'chandragiri-heritage',
    title: 'Tirupati & Chandragiri Heritage Escape',
    tagline: 'Combine the historic 11th-century Vijayanagara imperial palace with sacred foothills.',
    duration: 'Half Day (5 Hours)',
    category: 'heritage',
    startingPrice: 1650,
    vehicle: 'Private AC Cab',
    rating: 4.7,
    reviewsCount: 410,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Raaja_mahal_1.JPG/1280px-Raaja_mahal_1.JPG',
    destinations: [
      'Chandragiri Fort & Raja Mahal Museum',
      'Rani Mahal & Fort Ramparts',
      'Regional Science Centre Tirupati',
      'Kalyani Dam Scenic Reservoir'
    ],
    included: [
      'Doorstep AC cab pickup and drop',
      'Driver waiting for fort museum tour & photography',
      'Parking charges included'
    ],
    excluded: [
      'ASI entry fee (₹25 per person)',
      'Sound & Light show ticket (evening show ₹50)'
    ],
    itinerary: [
      { time: '02:30 PM', activity: 'Pickup & Drive to Chandragiri', description: '14 km pleasant countryside drive' },
      { time: '03:15 PM', activity: 'Chandragiri Raja Mahal', description: 'Indo-Sarcenic architecture of the Vijayanagara Emperors' },
      { time: '05:00 PM', activity: 'Kalyani Dam Reservoir', description: 'Lush greenery and reservoir supplying water to Tirupati' },
      { time: '07:00 PM', activity: 'Return Drop', description: 'Evening drop back at your preferred location' }
    ],
    ttdNotice: 'Chandragiri is maintained by Archaeological Survey of India (ASI).'
  }
];

export const DESTINATIONS: Destination[] = [
  {
    id: 'sv-temple',
    name: 'Sri Venkateswara Swamy Temple',
    teluguName: 'శ్రీ వేంకటేశ్వర స్వామి వారి ఆలయం',
    category: 'tirumala',
    tag: 'Lord of the Seven Hills',
    distanceFromTirupati: '22 km (via Ghat Road)',
    travelTime: '55 minutes',
    recommendedDuration: '4 - 8 Hours (depending on Darshan queue)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/1280px-Tirumala_090615.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/1280px-Tirumala_090615.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tirumala_Anand_nilayam42.jpg/1280px-Tirumala_Anand_nilayam42.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_Anand_nilayam4653.jpg/1280px-Tirumala_Anand_nilayam4653.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/0/00/Tirumala_Tirupati.jpg'
    ],
    description: 'The world-renowned Hindu pilgrimage shrine perched atop the sacred Seshachalam hills at 3,200 ft elevation. Consecrated to Lord Venkateswara (an incarnation of Vishnu), known as Kaliyuga Vaikuntam.',
    significance: 'One of the wealthiest and most visited religious sites in the world with daily footfall crossing 60,000 to 1,00,000 pilgrims.',
    visitingHours: 'Daily 03:00 AM – 11:30 PM (Per TTD Suprabhatam to Ekantha Seva schedule)',
    attire: 'Strict TTD traditional dress code: Dhoti/Kurta for men; Saree/Chudidar with dupatta for women. Western wear strictly disallowed.',
    thingsToKnow: [
      'Pilgrim mobile phones and electronic devices must be deposited at TTD security counters before entering Vaikuntam complex.',
      'Special Entry Darshan (SED ₹300) and Angapradakshinam must be booked months in advance via official TTD portal.',
      'Ghat Road safety rule: Vehicles must take at least 28 minutes for uphill and 40 minutes for downhill travel to prevent accidents.',
      'Hari Travels cabs have registered TTD toll FASTag and certified hill drivers.'
    ],
    ttdOfficial: true
  },
  {
    id: 'silathoranam',
    name: 'Silathoranam (Natural Rock Arch)',
    teluguName: 'శిలాతోరణం',
    category: 'tirumala',
    tag: 'Rare Geological Wonder',
    distanceFromTirupati: '24 km',
    travelTime: '1 hour',
    recommendedDuration: '45 minutes',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Silathoranam%2C_Tirumala_hills.jpg/1280px-Silathoranam%2C_Tirumala_hills.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Silathoranam%2C_Tirumala_hills.jpg/1280px-Silathoranam%2C_Tirumala_hills.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Natural_stone_arch_in_tirumala.JPG/1280px-Natural_stone_arch_in_tirumala.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Sahaja_Shila_Thoranam_%40_Tirumala%2C_AP.jpg/1280px-Sahaja_Shila_Thoranam_%40_Tirumala%2C_AP.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Shila_Thornanam_-_The_Natural_Arch.jpg/1280px-Shila_Thornanam_-_The_Natural_Arch.jpg'
    ],
    description: 'A pre-Cambrian geological arch formed approximately 2.5 billion years ago by natural weathering. It is one of only three such documented natural rock formations on Earth.',
    significance: 'Linked mythologically to the divine height of the Lord Venkateswara idol. Documented as a National Geological Monument by the Geological Survey of India.',
    visitingHours: '06:00 AM – 06:00 PM',
    attire: 'Comfortable modest walking wear',
    thingsToKnow: [
      'Surrounded by lush manicured garden and peaceful walking path in Tirumala hills.',
      'Protected National Geological Monument carved naturally out of quartzite rock.',
      'Close to Chakra Theertham and Japali Hanuman temple.',
      'Ideal for nature lovers, elderly pilgrims, and photography enthusiasts.'
    ],
    ttdOfficial: true
  },
  {
    id: 'papavinasanam-akasa-ganga',
    name: 'Papavinasanam & Akasa Ganga',
    teluguName: 'పాపవినాశనం & ఆకాశగంగ',
    category: 'tirumala',
    tag: 'Holy Theertham & Spring',
    distanceFromTirupati: '27 km',
    travelTime: '1 hr 15 mins',
    recommendedDuration: '1.5 Hours',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Papavinasam_Theertham_-_Tirupati.jpg/1280px-Papavinasam_Theertham_-_Tirupati.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Papavinasam_Theertham_-_Tirupati.jpg/1280px-Papavinasam_Theertham_-_Tirupati.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Papavinasam_Theertham.jpg/1280px-Papavinasam_Theertham.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b2/AkasaGanga.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Idols_of_Lord_venkateswara_with_sridevi_and_bhudevi_at_akasa_ganga%2C_Tirumala.jpg/1280px-Idols_of_Lord_venkateswara_with_sridevi_and_bhudevi_at_akasa_ganga%2C_Tirumala.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Ganga_temple%2C_Papavinasanam.jpg/1280px-Ganga_temple%2C_Papavinasanam.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Papavinasanam_dam_gate.jpg/1280px-Papavinasanam_dam_gate.jpg'
    ],
    description: 'Perennial sacred waterfalls in the deep forested hills of Tirumala. The pure mountain waters of Akasa Ganga are transported daily in sanctified golden vessels for Lord Venkateswara’s holy Thirumanjanam (Abhishekam).',
    significance: 'Legend states taking a holy bath at Papavinasanam washes away all accumulated karmic sins. Akasa Ganga is praised in the Skanda Purana as a celestial stream cascading from Vaikuntam.',
    visitingHours: '06:00 AM – 05:30 PM',
    attire: 'Modest pilgrimage attire (dress change rooms available for bathers)',
    thingsToKnow: [
      'Well-paved stairs lead down to the falls and bathing points with safety railings.',
      'Akasa Ganga waterfall provides the sacred water for the daily Abhishekam of Lord Venkateswara.',
      'Dam and reservoir provide drinking water to the entire Tirumala township.',
      'Hari Travels driver waits right at the dedicated tourist parking bay.'
    ],
    ttdOfficial: true
  },
  {
    id: 'padmavathi-temple',
    name: 'Sri Padmavathi Ammavari Temple',
    teluguName: 'శ్రీ పద్మావతి అమ్మావారి ఆలయం',
    category: 'tirupati',
    tag: 'Goddess of Prosperity',
    distanceFromTirupati: '5 km (Tiruchanur)',
    travelTime: '15 minutes',
    recommendedDuration: '1.5 Hours',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Padmavathi_Ammavari_Temple.JPG/1280px-Padmavathi_Ammavari_Temple.JPG',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Padmavathi_Ammavari_Temple.JPG/1280px-Padmavathi_Ammavari_Temple.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Tiruchanur_19.JPG/1280px-Tiruchanur_19.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Tiruchanur_08.JPG/1280px-Tiruchanur_08.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Tiruchanur_09.JPG/1280px-Tiruchanur_09.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tiruchanur_10.JPG/1280px-Tiruchanur_10.JPG'
    ],
    description: 'The revered temple of Goddess Padmavathi (Alarmelmanga), consort of Lord Venkateswara. Tradition dictates that a pilgrimage to Tirupati is complete only after visiting Tiruchanur.',
    significance: 'The sacred golden lotus tank (Padma Sarovaram) is where Goddess Lakshmi is believed to have manifested on a golden lotus. Panchami Theertham celebrated here attracts lakhs of devotees.',
    visitingHours: '05:00 AM – 09:00 PM',
    attire: 'Traditional South Indian attire',
    thingsToKnow: [
      'Quick ₹100 / ₹200 special entry darshan lines usually take 30 to 45 mins.',
      'Magnificent Dravidian gopuram, stone pillared mandapams, and sacred Padma Sarovaram tank.',
      'Delicious laddu and pulihora prasadam available at TTD counters.',
      'Conveniently located near Tirupati railway station and airport highway.'
    ],
    ttdOfficial: true
  },
  {
    id: 'kapila-theertham',
    name: 'Kapila Theertham (Sri Kapileswara Swamy)',
    teluguName: 'కపిల తీర్థం',
    category: 'tirupati',
    tag: 'Sacred Waterfall at Foothills',
    distanceFromTirupati: '3 km',
    travelTime: '10 minutes',
    recommendedDuration: '1 Hour',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Kapilatheertam.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/0/00/Kapilatheertam.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Kapila_theertham.jpg/1280px-Kapila_theertham.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kapila_Tirtham_temple_at_Tirupati_main_entrance.jpg/1280px-Kapila_Tirtham_temple_at_Tirupati_main_entrance.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kapila_Theertham_waterfalls_Tirupati_2015_3.jpg/1280px-Kapila_Theertham_waterfalls_Tirupati_2015_3.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Kapila_tirtham_at_tirupati.JPG/1280px-Kapila_tirtham_at_tirupati.JPG'
    ],
    description: 'The only Shiva temple situated right at the base of the Tirumala sacred hills, where Kapila Muni is believed to have meditated for centuries before Lord Shiva appeared.',
    significance: 'Natural mountain stream cascades down the sheer cliff face into the temple pushkarini. Praised as one of the 108 sacred theerthams in the Seshachalam range.',
    visitingHours: '05:30 AM – 08:30 PM',
    attire: 'Traditional attire',
    thingsToKnow: [
      'Quiet and serene atmosphere away from main city traffic.',
      'Magnificent waterfall, ancient rock carving mandapams, and sacred Pushkarini tank.',
      'Ideal early morning visit before ascending to Tirumala.',
      'Spectacular water cascade during July to December.'
    ],
    ttdOfficial: true
  },
  {
    id: 'srikalahasti',
    name: 'Srikalahasteeswara Temple',
    teluguName: 'శ్రీకాళహస్తీశ్వర ఆలయం',
    category: 'surrounding',
    tag: 'Dakshina Kailasam & Vayu Lingam',
    distanceFromTirupati: '36 km',
    travelTime: '45 minutes',
    recommendedDuration: '2.5 Hours',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/View_of_Srikalahasthi_Temple_Gopuram.jpg/1280px-View_of_Srikalahasthi_Temple_Gopuram.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/View_of_Srikalahasthi_Temple_Gopuram.jpg/1280px-View_of_Srikalahasthi_Temple_Gopuram.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Sri_Kala_Hasti.jpg/1280px-Sri_Kala_Hasti.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/View_of_Srikalahasti_gopuram_and_kannappa_hill.jpg/1280px-View_of_Srikalahasti_gopuram_and_kannappa_hill.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/View_of_Srikalahasti_rajagopuram.jpg/1280px-View_of_Srikalahasti_rajagopuram.jpg'
    ],
    description: 'One of the Pancha Bhoota Sthalas representing the Air (Vayu) element. Famous globally for Rahu-Ketu Sarpa Dosha Nivarana pujas performed in the holy presence of Lord Shiva and Gnana Prasunambika.',
    significance: 'Lamp flame in the inner sanctum flickers constantly even when all doors are closed, witnessing the perpetual breeze of the Vayu Lingam.',
    visitingHours: '06:00 AM – 09:00 PM',
    attire: 'Traditional Indian attire',
    thingsToKnow: [
      'Rahu Ketu puja performed continuously throughout the day in specialized mandapams.',
      'Magnificent Dravidian architecture and towering Rajagopuram on the banks of Swarnamukhi River.',
      'Hari Travels provides round-trip wait-and-return cab service with zero parking hassle.'
    ],
    ttdOfficial: false
  },
  {
    id: 'kanipakam',
    name: 'Kanipakam Sri Varasiddhi Vinayaka',
    teluguName: 'కాణిపాకం శ్రీ వరసిద్ధి వినాయక ఆలయం',
    category: 'surrounding',
    tag: 'Swayambhu Water-Well Deity',
    distanceFromTirupati: '70 km',
    travelTime: '1 hr 30 mins',
    recommendedDuration: '2 Hours',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kanipakam_Temple.jpg/1280px-Kanipakam_Temple.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kanipakam_Temple.jpg/1280px-Kanipakam_Temple.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Galipgopuram_of_Kanipakam_temple_%28May_2019%29_4.jpg/1280px-Galipgopuram_of_Kanipakam_temple_%28May_2019%29_4.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Pond_infront_of_Kanipakam_temple_%28May_2019%29_2.jpg/1280px-Pond_infront_of_Kanipakam_temple_%28May_2019%29_2.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Galipgopuram_of_Kanipakam_temple_%28May_2019%29_8.jpg/1280px-Galipgopuram_of_Kanipakam_temple_%28May_2019%29_8.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Galipgopuram_of_Kanipakam_temple_%28May_2019%29_5.jpg/1280px-Galipgopuram_of_Kanipakam_temple_%28May_2019%29_5.jpg'
    ],
    description: 'Historic 11th-century temple where Lord Ganesha manifested self-formed (swayambhu) inside an agricultural water well. The deity resides in the sanctum well with eternal water springs, and the idol is believed to be gradually increasing in size over epochs.',
    significance: 'Renowned for the sacred Bahuda river and inviolable truth-settlement oaths ("Pramanam") taken in the presence of Sri Varasiddhi Vinayaka.',
    visitingHours: '04:30 AM – 09:30 PM',
    attire: 'Traditional South Indian attire',
    thingsToKnow: [
      'Towering white Rajagopuram and beautiful sacred Pushkarini pond with holy waters.',
      'Special Abhishekams (Ksheerabhishekam) performed daily in early mornings.',
      'Smooth 4-lane highway from Tirupati through Chittoor mango orchards and scenic rural Andhra.',
      'Hari Travels provides wait-and-return roundtrip cabs with dedicated luggage custody.'
    ],
    ttdOfficial: false
  },
  {
    id: 'chandragiri-fort',
    name: 'Chandragiri Fort & Raja Mahal',
    teluguName: 'చంద్రగిరి కోట & రాజమహల్',
    category: 'surrounding',
    tag: '11th Century Vijayanagara Capital',
    distanceFromTirupati: '14 km',
    travelTime: '25 minutes',
    recommendedDuration: '2.5 Hours',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Raaja_mahal_1.JPG/1280px-Raaja_mahal_1.JPG',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Raaja_mahal_1.JPG/1280px-Raaja_mahal_1.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Raja_Mahal%2C_Chandragiri.jpg/1280px-Raja_Mahal%2C_Chandragiri.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Chandragiri_fort_complex.jpg/1280px-Chandragiri_fort_complex.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Chandragiri_Lower_fort.JPG/1280px-Chandragiri_Lower_fort.JPG'
    ],
    description: 'The monumental 11th-century fort built during the Yadava Naidus and subsequently the 4th capital of the Vijayanagara Empire. Features the imposing three-storey Indo-Sarcenic Raja Mahal Palace constructed purely of stone, brick, and lime without timber.',
    significance: 'Historic site where the British East India Company was granted permission by Vijayanagara king Peda Venkata Raya in 1639 to build Fort St. George in Madras.',
    visitingHours: '09:00 AM – 06:00 PM (Museum) • Sound & Light Show: 06:30 PM & 07:30 PM',
    attire: 'Comfortable walking attire and shoes',
    thingsToKnow: [
      'Maintained by Archaeological Survey of India (ASI) with royal museum inside Raja Mahal.',
      'Spectacular evening Sound & Light laser narration across the fort ramparts.',
      'Peaceful manicured lawns, deer park, and historic stepwells.',
      'Hari Travels provides waiting cab service for both museum tour and evening show.'
    ],
    ttdOfficial: false
  }
];

export const DEMO_DRIVERS: DriverInfo[] = [
  {
    id: 'DRV-101',
    name: 'Ravi Kumar',
    phone: '+91 99593 12174',
    rating: 4.9,
    totalTrips: 1840,
    experienceYears: 9,
    vehicleModel: 'Toyota Etios (Sedan AC)',
    vehicleNumber: 'AP 03 TX 4821',
    vehicleColor: 'Pearl White',
    languages: ['Telugu', 'English', 'Tamil', 'Hindi'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    currentLat: 13.6360,
    currentLng: 79.4230,
    status: 'on_trip'
  },
  {
    id: 'DRV-102',
    name: 'M. Sridhar Naidu',
    phone: '+91 94401 88412',
    rating: 4.95,
    totalTrips: 2450,
    experienceYears: 12,
    vehicleModel: 'Toyota Innova Crysta (VIP)',
    vehicleNumber: 'AP 03 TX 9901',
    vehicleColor: 'Silver Metallic',
    languages: ['Telugu', 'English', 'Hindi', 'Kannada'],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    currentLat: 13.6420,
    currentLng: 79.4120,
    status: 'available'
  },
  {
    id: 'DRV-103',
    name: 'K. Venkatesh',
    phone: '+91 98852 44321',
    rating: 4.85,
    totalTrips: 1120,
    experienceYears: 7,
    vehicleModel: 'Maruti Suzuki Ertiga',
    vehicleNumber: 'AP 03 TX 3154',
    vehicleColor: 'Magma Grey',
    languages: ['Telugu', 'Tamil', 'Hindi'],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    currentLat: 13.6290,
    currentLng: 79.4180,
    status: 'available'
  },
  {
    id: 'DRV-104',
    name: 'P. Anand Reddy',
    phone: '+91 97034 55192',
    rating: 4.92,
    totalTrips: 3100,
    experienceYears: 14,
    vehicleModel: 'Force Urbania (14S Luxury)',
    vehicleNumber: 'AP 03 TX 7788',
    vehicleColor: 'Alpine White',
    languages: ['Telugu', 'English', 'Hindi', 'Tamil'],
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
    currentLat: 13.6540,
    currentLng: 79.3900,
    status: 'available'
  }
];

// Realistic Ghat Road Waypoints between Tirupati Station and Tirumala Temple
export const TIRUPATI_TO_TIRUMALA_ROUTE = [
  { lat: 13.6288, lng: 79.4192, name: 'Tirupati Railway Station' },
  { lat: 13.6350, lng: 79.4120, name: 'Bhavani Nagar Junction' },
  { lat: 13.6440, lng: 79.4010, name: 'Kapila Theertham bypass' },
  { lat: 13.6558, lng: 79.3888, name: 'Alipiri Toll Gate & Checkpost' },
  { lat: 13.6590, lng: 79.3780, name: 'Alipiri Footpath Gate' },
  { lat: 13.6640, lng: 79.3690, name: 'Ghat Road 1st Curve (Deer Park)' },
  { lat: 13.6680, lng: 79.3610, name: 'Gali Gopuram Viewpoint' },
  { lat: 13.6710, lng: 79.3550, name: 'Mokkalla Mitta Bend' },
  { lat: 13.6760, lng: 79.3500, name: 'Avachari Kona Forest Bridge' },
  { lat: 13.6800, lng: 79.3470, name: 'Tirumala Ring Road Entry' },
  { lat: 13.6833, lng: 79.3472, name: 'Sri Venkateswara Temple Area' }
];

export const INITIAL_DEMO_BOOKING: RideBooking = {
  id: 'HT-28491',
  bookingCode: 'HT28491',
  customerName: 'Ananth Narayanan',
  customerPhone: '+91 98840 91234',
  pickup: POPULAR_LOCATIONS[0], // Tirupati Railway Station
  destination: POPULAR_LOCATIONS[3], // Sri Venkateswara Temple, Tirumala
  date: '2026-09-21',
  time: '10:30 AM',
  passengers: 3,
  vehicle: VEHICLE_OPTIONS[1], // Sedan
  tripType: 'hillclimb',
  distanceKm: 22.4,
  durationMinutes: 48,
  fareBreakdown: {
    baseFare: 900,
    distanceFare: 358,
    ghatTollAndTax: 300,
    driverAllowance: 150,
    taxes: 85,
    totalFare: 1793
  },
  status: 'driver_coming',
  driver: DEMO_DRIVERS[0],
  createdAt: new Date().toISOString(),
  paymentMethod: 'upi',
  paymentStatus: 'paid',
  specialNotes: 'Waiting near Platform 1 exit. 2 medium trolley bags.'
};

export const REVIEWS = [
  {
    id: 1,
    name: 'Srinivas & Radhika Murthy',
    location: 'Bangalore, Karnataka',
    rating: 5,
    date: '3 days ago',
    text: 'Hari Travels made our Tirumala darshan trip extraordinarily smooth. The live GPS tracking was very accurate — driver Ravi was already waiting at Tirupati station when the train pulled in. Innova was spotless, and the ghat road driving was very gentle for my elderly parents.',
    vehicle: 'Innova Crysta'
  },
  {
    id: 2,
    name: 'Karthik Ramanathan',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    date: '1 week ago',
    text: 'Booked the Srikalahasti + Kanipakam 1-day package. The transparent upfront pricing without any hidden ghat toll surprises is refreshing. Chauffeur knew all the Rahu-Ketu puja timing rules and saved us hours of standing in wrong lines.',
    vehicle: 'Prime Sedan'
  },
  {
    id: 3,
    name: 'Pooja & Sameer Deshmukh',
    location: 'Pune, Maharashtra',
    rating: 5,
    date: '2 weeks ago',
    text: 'First time visiting Tirupati. Loved that Hari Travels separates cab booking from official TTD darshan information and gave us clear guidelines on dress code and Alipiri security timings. Clean car, pleasant AC, top-tier service!',
    vehicle: 'Family SUV'
  }
];
