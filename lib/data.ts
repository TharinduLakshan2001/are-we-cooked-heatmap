export type City = {
  id: string;
  name: string;
  flag: string;
  score: number; // out of 10
  percent: number; // cooked %
  status: string;
  lat: number;
  lng: number;
  top?: boolean;
  cold?: boolean;
  initial: string;
};

export const cities: City[] = [
  {
    id: "paris",
    name: "Paris",
    flag: "🇫🇷",
    score: 9.5,
    percent: 94,
    status: "42°C · No AC",
    lat: 48.8566,
    lng: 2.3522,
    top: true,
    initial: "P",
  },
  {
    id: "madrid",
    name: "Madrid",
    flag: "🇪🇸",
    score: 9,
    percent: 91,
    status: "Melting",
    lat: 40.4168,
    lng: -3.7038,
    initial: "M",
  },
  {
    id: "london",
    name: "London",
    flag: "🇬🇧",
    score: 8,
    percent: 88,
    status: "No AC since Mon",
    lat: 51.5074,
    lng: -0.1278,
    initial: "L",
  },
  {
    id: "rome",
    name: "Rome",
    flag: "🇮🇹",
    score: 8,
    percent: 82,
    status: "Too hot to exist",
    lat: 41.9028,
    lng: 12.4964,
    initial: "R",
  },
  {
    id: "berlin",
    name: "Berlin",
    flag: "🇩🇪",
    score: 7,
    percent: 76,
    status: "Office = Sauna",
    lat: 52.52,
    lng: 13.405,
    initial: "B",
  },
  {
    id: "athens",
    name: "Athens",
    flag: "🇬🇷",
    score: 6,
    percent: 64,
    status: "Sweating 24/7",
    lat: 37.9838,
    lng: 23.7275,
    initial: "A",
  },
  {
    id: "oslo",
    name: "Oslo",
    flag: "🇳🇴",
    score: 3,
    percent: 34,
    status: "Basically winter",
    lat: 59.9139,
    lng: 10.7522,
    cold: true,
    initial: "O",
  },
];

export const leaderboardGap = { afterRank: 5, beforeRank: 18 };

export const liveFeed = [
  {
    id: "1",
    name: "Alex",
    flag: "🇫🇷",
    city: "Paris",
    score: 10,
    message: "No AC since Monday. Send help.",
    time: "Just now",
    initial: "A",
  },
  {
    id: "2",
    name: "Maria",
    flag: "🇪🇸",
    city: "Madrid",
    score: 9,
    message: "I'm melting. Literally.",
    time: "30s ago",
    initial: "M",
  },
  {
    id: "3",
    name: "Luca",
    flag: "🇮🇹",
    city: "Rome",
    score: 8,
    message: "Too hot to think.",
    time: "1m ago",
    initial: "L",
  },
  {
    id: "4",
    name: "Sophie",
    flag: "🇬🇧",
    city: "London",
    score: 8,
    message: "Night sweats 2.0",
    time: "2m ago",
    initial: "S",
  },
  {
    id: "5",
    name: "Jonas",
    flag: "🇩🇪",
    city: "Berlin",
    score: 7,
    message: "Working in an oven.",
    time: "3m ago",
    initial: "J",
  },
];

export const sparklinePoints = [
  38, 44, 40, 52, 47, 58, 50, 62, 55, 65, 60, 68, 63, 70, 66, 73,
];

export type GhostPin = {
  id: string;
  lat: number;
  lng: number;
  createdAt: number;
  lifespan: number;
};

export type AmbientFeedSeed = {
  name: string;
  flag: string;
  city: string;
  score: number;
  message: string;
};

export const ambientFeedPool: AmbientFeedSeed[] = [
  { name: "Elena", flag: "🇪🇸", city: "Madrid", score: 9, message: "Why does Spain hate us" },
  { name: "Hugo", flag: "🇫🇷", city: "Paris", score: 10, message: "Melted croissant in my pocket" },
  { name: "Ingrid", flag: "🇳🇴", city: "Oslo", score: 3, message: "Actually sweating? Unacceptable" },
  { name: "Marco", flag: "🇮🇹", city: "Rome", score: 8, message: "Colosseum has no AC. 0 stars." },
  { name: "Freya", flag: "🇩🇪", city: "Berlin", score: 7, message: "U-bahn is a sauna now" },
  { name: "Tom", flag: "🇬🇧", city: "London", score: 8, message: "Tube is literally hell" },
  { name: "Dimitris", flag: "🇬🇷", city: "Athens", score: 9, message: "Zeus is angry again" },
  { name: "Sofia", flag: "🇵🇹", city: "Lisbon", score: 8, message: "Pavement melted my sandals" },
  { name: "Liam", flag: "🇮🇪", city: "Dublin", score: 5, message: "We're not built for this" },
  { name: "Anna", flag: "🇦🇹", city: "Vienna", score: 7, message: "Coffee is boiling in the cup" },
  { name: "Piotr", flag: "🇵🇱", city: "Warsaw", score: 6, message: "Ice cream lasted 30 seconds" },
  { name: "Camille", flag: "🇫🇷", city: "Marseille", score: 9, message: "Even the mistral gave up" },
  { name: "Lars", flag: "🇸🇪", city: "Stockholm", score: 4, message: "This is what global warming feels like" },
  { name: "Zara", flag: "🇳🇱", city: "Amsterdam", score: 7, message: "Canals smell different today" },
  { name: "Ben", flag: "🇨🇭", city: "Zurich", score: 6, message: "Broke a sweat walking to the bank" },
  { name: "Nadia", flag: "🇭🇷", city: "Zagreb", score: 8, message: "No breeze anywhere" },
  { name: "Felix", flag: "🇨🇿", city: "Prague", score: 7, message: "Charles Bridge is lava" },
  { name: "Yuki", flag: "🇯🇵", city: "Tokyo", score: 9, message: "Humidity is criminal" },
  { name: "Ahmed", flag: "🇲🇦", city: "Casablanca", score: 9, message: "Even the camels are hiding" },
  { name: "Olga", flag: "🇷🇺", city: "Moscow", score: 5, message: "Dachas are melting" },
  { name: "Mia", flag: "🇪🇸", city: "Barcelona", score: 9, message: "Beach is a frying pan" },
  { name: "Lukas", flag: "🇦🇹", city: "Salzburg", score: 6, message: "Hills are alive with the sound of sweating" },
  { name: "Emma", flag: "🇧🇪", city: "Brussels", score: 7, message: "Waffle melted before I could eat it" },
  { name: "David", flag: "🇮🇱", city: "Tel Aviv", score: 10, message: "Just walked outside. Mistake." },
  { name: "Clara", flag: "🇪🇸", city: "Seville", score: 10, message: "Sun has a personal vendetta" },
  { name: "Ravi", flag: "🇮🇳", city: "Delhi", score: 10, message: "This is fine. (It's not fine.)" },
  { name: "Aisha", flag: "🇹🇷", city: "Istanbul", score: 9, message: "Bosphorus breeze is a lie" },
  { name: "Kai", flag: "🇩🇰", city: "Copenhagen", score: 5, message: "Vikings didn't prepare for this" },
  { name: "Marie", flag: "🇫🇷", city: "Lyon", score: 8, message: "Two fans and a prayer" },
  { name: "Oleksandr", flag: "🇺🇦", city: "Kyiv", score: 7, message: "Cold borscht is the only way" },
];
