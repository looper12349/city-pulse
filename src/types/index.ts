// Type definitions for City Pulse app

/**
 * Represents a news article from the news API
 * Requirements: 9.1
 */
export interface NewsArticle {
  title: string;
  description: string;
  image: string;      // URL to article image
  url: string;        // URL to full article
  date: string;       // ISO date string
}

/**
 * Represents an emergency alert with severity level
 */
export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

/**
 * Represents a city option for selection
 */
export interface City {
  name: string;
  displayName: string;
}
