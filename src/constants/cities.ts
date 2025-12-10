import { City } from '../types';

/**
 * Expanded list of popular cities worldwide
 * Includes major cities from India and around the world
 * Sorted alphabetically by display name
 * Requirements: 1.4
 */

export const CITIES: City[] = [
  // India - Major Cities
  { name: 'ahmedabad', displayName: 'Ahmedabad' },
  { name: 'bangalore', displayName: 'Bengaluru' },
  { name: 'chennai', displayName: 'Chennai' },
  { name: 'delhi', displayName: 'Delhi' },
  { name: 'hyderabad', displayName: 'Hyderabad' },
  { name: 'jaipur', displayName: 'Jaipur' },
  { name: 'kolkata', displayName: 'Kolkata' },
  { name: 'lucknow', displayName: 'Lucknow' },
  { name: 'mumbai', displayName: 'Mumbai' },
  { name: 'pune', displayName: 'Pune' },
  { name: 'surat', displayName: 'Surat' },
  { name: 'kochi', displayName: 'Kochi' },
  { name: 'chandigarh', displayName: 'Chandigarh' },
  { name: 'indore', displayName: 'Indore' },
  { name: 'nagpur', displayName: 'Nagpur' },
  
  // North America
  { name: 'new york', displayName: 'New York' },
  { name: 'los angeles', displayName: 'Los Angeles' },
  { name: 'chicago', displayName: 'Chicago' },
  { name: 'houston', displayName: 'Houston' },
  { name: 'san francisco', displayName: 'San Francisco' },
  { name: 'seattle', displayName: 'Seattle' },
  { name: 'boston', displayName: 'Boston' },
  { name: 'miami', displayName: 'Miami' },
  { name: 'toronto', displayName: 'Toronto' },
  { name: 'vancouver', displayName: 'Vancouver' },
  { name: 'mexico city', displayName: 'Mexico City' },
  
  // Europe
  { name: 'london', displayName: 'London' },
  { name: 'paris', displayName: 'Paris' },
  { name: 'berlin', displayName: 'Berlin' },
  { name: 'amsterdam', displayName: 'Amsterdam' },
  { name: 'barcelona', displayName: 'Barcelona' },
  { name: 'madrid', displayName: 'Madrid' },
  { name: 'rome', displayName: 'Rome' },
  { name: 'milan', displayName: 'Milan' },
  { name: 'vienna', displayName: 'Vienna' },
  { name: 'zurich', displayName: 'Zurich' },
  { name: 'stockholm', displayName: 'Stockholm' },
  { name: 'dublin', displayName: 'Dublin' },
  { name: 'moscow', displayName: 'Moscow' },
  
  // Asia Pacific
  { name: 'tokyo', displayName: 'Tokyo' },
  { name: 'singapore', displayName: 'Singapore' },
  { name: 'hong kong', displayName: 'Hong Kong' },
  { name: 'shanghai', displayName: 'Shanghai' },
  { name: 'beijing', displayName: 'Beijing' },
  { name: 'seoul', displayName: 'Seoul' },
  { name: 'bangkok', displayName: 'Bangkok' },
  { name: 'kuala lumpur', displayName: 'Kuala Lumpur' },
  { name: 'jakarta', displayName: 'Jakarta' },
  { name: 'sydney', displayName: 'Sydney' },
  { name: 'melbourne', displayName: 'Melbourne' },
  { name: 'auckland', displayName: 'Auckland' },
  
  // Middle East & Africa
  { name: 'dubai', displayName: 'Dubai' },
  { name: 'abu dhabi', displayName: 'Abu Dhabi' },
  { name: 'tel aviv', displayName: 'Tel Aviv' },
  { name: 'cairo', displayName: 'Cairo' },
  { name: 'cape town', displayName: 'Cape Town' },
  { name: 'johannesburg', displayName: 'Johannesburg' },
  { name: 'lagos', displayName: 'Lagos' },
  { name: 'nairobi', displayName: 'Nairobi' },
  
  // South America
  { name: 'sao paulo', displayName: 'São Paulo' },
  { name: 'rio de janeiro', displayName: 'Rio de Janeiro' },
  { name: 'buenos aires', displayName: 'Buenos Aires' },
  { name: 'bogota', displayName: 'Bogotá' },
  { name: 'lima', displayName: 'Lima' },
  { name: 'santiago', displayName: 'Santiago' },
].sort((a, b) => a.displayName.localeCompare(b.displayName));

/**
 * Search cities by name (case-insensitive)
 */
export function searchCities(query: string): City[] {
  if (!query.trim()) return CITIES;
  
  const normalizedQuery = query.toLowerCase().trim();
  return CITIES.filter(
    (city) =>
      city.displayName.toLowerCase().includes(normalizedQuery) ||
      city.name.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Get city by name
 */
export function getCityByName(name: string): City | undefined {
  return CITIES.find(
    (city) => city.name.toLowerCase() === name.toLowerCase()
  );
}
