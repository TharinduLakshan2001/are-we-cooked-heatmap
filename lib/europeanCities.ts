export type EuropeanCapital = {
  country: string;
  iso: string;
  capital: string;
  flag: string;
  lat: number;
  lng: number;
};

export const europeanCapitals: EuropeanCapital[] = [
  { country: "Albania", iso: "AL", capital: "Tirana", flag: "🇦🇱", lat: 41.3275, lng: 19.8187 },
  { country: "Andorra", iso: "AD", capital: "Andorra la Vella", flag: "🇦🇩", lat: 42.5063, lng: 1.5218 },
  { country: "Austria", iso: "AT", capital: "Vienna", flag: "🇦🇹", lat: 48.2082, lng: 16.3738 },
  { country: "Belarus", iso: "BY", capital: "Minsk", flag: "🇧🇾", lat: 53.9045, lng: 27.5590 },
  { country: "Belgium", iso: "BE", capital: "Brussels", flag: "🇧🇪", lat: 50.8503, lng: 4.3517 },
  { country: "Bosnia and Herzegovina", iso: "BA", capital: "Sarajevo", flag: "🇧🇦", lat: 43.8563, lng: 18.4131 },
  { country: "Bulgaria", iso: "BG", capital: "Sofia", flag: "🇧🇬", lat: 42.6977, lng: 23.3219 },
  { country: "Croatia", iso: "HR", capital: "Zagreb", flag: "🇭🇷", lat: 45.8150, lng: 15.9819 },
  { country: "Cyprus", iso: "CY", capital: "Nicosia", flag: "🇨🇾", lat: 35.1856, lng: 33.3823 },
  { country: "Czech Republic", iso: "CZ", capital: "Prague", flag: "🇨🇿", lat: 50.0755, lng: 14.4378 },
  { country: "Denmark", iso: "DK", capital: "Copenhagen", flag: "🇩🇰", lat: 55.6761, lng: 12.5683 },
  { country: "Estonia", iso: "EE", capital: "Tallinn", flag: "🇪🇪", lat: 59.4370, lng: 24.7536 },
  { country: "Finland", iso: "FI", capital: "Helsinki", flag: "🇫🇮", lat: 60.1699, lng: 24.9384 },
  { country: "France", iso: "FR", capital: "Paris", flag: "🇫🇷", lat: 48.8566, lng: 2.3522 },
  { country: "Germany", iso: "DE", capital: "Berlin", flag: "🇩🇪", lat: 52.5200, lng: 13.4050 },
  { country: "Greece", iso: "GR", capital: "Athens", flag: "🇬🇷", lat: 37.9838, lng: 23.7275 },
  { country: "Hungary", iso: "HU", capital: "Budapest", flag: "🇭🇺", lat: 47.4979, lng: 19.0402 },
  { country: "Iceland", iso: "IS", capital: "Reykjavik", flag: "🇮🇸", lat: 64.1466, lng: -21.9426 },
  { country: "Ireland", iso: "IE", capital: "Dublin", flag: "🇮🇪", lat: 53.3498, lng: -6.2603 },
  { country: "Italy", iso: "IT", capital: "Rome", flag: "🇮🇹", lat: 41.9028, lng: 12.4964 },
  { country: "Kosovo", iso: "XK", capital: "Pristina", flag: "🇽🇰", lat: 42.6629, lng: 21.1655 },
  { country: "Latvia", iso: "LV", capital: "Riga", flag: "🇱🇻", lat: 56.9496, lng: 24.1052 },
  { country: "Liechtenstein", iso: "LI", capital: "Vaduz", flag: "🇱🇮", lat: 47.1410, lng: 9.5215 },
  { country: "Lithuania", iso: "LT", capital: "Vilnius", flag: "🇱🇹", lat: 54.6872, lng: 25.2797 },
  { country: "Luxembourg", iso: "LU", capital: "Luxembourg", flag: "🇱🇺", lat: 49.6117, lng: 6.1300 },
  { country: "Malta", iso: "MT", capital: "Valletta", flag: "🇲🇹", lat: 35.8997, lng: 14.5147 },
  { country: "Moldova", iso: "MD", capital: "Chișinău", flag: "🇲🇩", lat: 47.0105, lng: 28.8638 },
  { country: "Monaco", iso: "MC", capital: "Monaco", flag: "🇲🇨", lat: 43.7384, lng: 7.4246 },
  { country: "Montenegro", iso: "ME", capital: "Podgorica", flag: "🇲🇪", lat: 42.4304, lng: 19.2594 },
  { country: "Netherlands", iso: "NL", capital: "Amsterdam", flag: "🇳🇱", lat: 52.3676, lng: 4.9041 },
  { country: "North Macedonia", iso: "MK", capital: "Skopje", flag: "🇲🇰", lat: 41.9973, lng: 21.4280 },
  { country: "Norway", iso: "NO", capital: "Oslo", flag: "🇳🇴", lat: 59.9139, lng: 10.7522 },
  { country: "Poland", iso: "PL", capital: "Warsaw", flag: "🇵🇱", lat: 52.2297, lng: 21.0122 },
  { country: "Portugal", iso: "PT", capital: "Lisbon", flag: "🇵🇹", lat: 38.7223, lng: -9.1393 },
  { country: "Romania", iso: "RO", capital: "Bucharest", flag: "🇷🇴", lat: 44.4268, lng: 26.1025 },
  { country: "Russia", iso: "RU", capital: "Moscow", flag: "🇷🇺", lat: 55.7558, lng: 37.6173 },
  { country: "San Marino", iso: "SM", capital: "San Marino", flag: "🇸🇲", lat: 43.9424, lng: 12.4578 },
  { country: "Serbia", iso: "RS", capital: "Belgrade", flag: "🇷🇸", lat: 44.7866, lng: 20.4489 },
  { country: "Slovakia", iso: "SK", capital: "Bratislava", flag: "🇸🇰", lat: 48.1486, lng: 17.1077 },
  { country: "Slovenia", iso: "SI", capital: "Ljubljana", flag: "🇸🇮", lat: 46.0569, lng: 14.5058 },
  { country: "Spain", iso: "ES", capital: "Madrid", flag: "🇪🇸", lat: 40.4168, lng: -3.7038 },
  { country: "Sweden", iso: "SE", capital: "Stockholm", flag: "🇸🇪", lat: 59.3293, lng: 18.0686 },
  { country: "Switzerland", iso: "CH", capital: "Bern", flag: "🇨🇭", lat: 46.9480, lng: 7.4474 },
  { country: "Turkey", iso: "TR", capital: "Ankara", flag: "🇹🇷", lat: 39.9334, lng: 32.8597 },
  { country: "Ukraine", iso: "UA", capital: "Kyiv", flag: "🇺🇦", lat: 50.4501, lng: 30.5234 },
  { country: "United Kingdom", iso: "GB", capital: "London", flag: "🇬🇧", lat: 51.5074, lng: -0.1278 },
  { country: "Vatican City", iso: "VA", capital: "Vatican City", flag: "🇻🇦", lat: 41.9029, lng: 12.4534 },
];
