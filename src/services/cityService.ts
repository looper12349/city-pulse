import { City } from '../types';
import { CITIES, searchCities as localSearch } from '../constants/cities';

/**
 * City Service
 * Fetches cities from API with fallback to local list
 */

// GeoDB Cities API (free tier)
const GEODB_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
const GEODB_API_KEY = 'demo'; 
interface GeoDBCity {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  population: number;
}

interface GeoDBResponse {
  data: GeoDBCity[];
}

/**
 * Search cities using GeoDB API with fallback to local list
 */
export async function searchCitiesAPI(query: string): Promise<City[]> {
  if (!query.trim()) {
    return CITIES;
  }

  // For demo purposes, use local search
  // In production, uncomment the API call below
  return localSearch(query);

  /*
  try {
    const response = await fetch(
      `${GEODB_API_URL}?namePrefix=${encodeURIComponent(query)}&limit=20&sort=-population`,
      {
        headers: {
          'X-RapidAPI-Key': GEODB_API_KEY,
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data: GeoDBResponse = await response.json();
    
    return data.data.map((city) => ({
      name: city.name.toLowerCase(),
      displayName: `${city.name}, ${city.countryCode}`,
    }));
  } catch (error) {
    console.warn('City API failed, using local fallback:', error);
    return localSearch(query);
  }
  */
}

/**
 * Get popular cities (for initial display)
 */
export function getPopularCities(): City[] {
  const popularNames = [
    'bangalore',
    'mumbai',
    'delhi',
    'new york',
    'london',
    'tokyo',
    'singapore',
    'dubai',
    'san francisco',
    'sydney',
  ];

  return CITIES.filter((city) =>
    popularNames.includes(city.name.toLowerCase())
  );
}

export const CityService = {
  searchCities: searchCitiesAPI,
  getPopularCities,
};
