import { EmergencyAlert } from '../types';

/**
 * Hardcoded emergency alerts for demonstration purposes
 * Requirements: 7.1, 7.2
 */
const EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: 'alert-1',
    title: 'Severe Weather Warning',
    description: 'Heavy thunderstorms expected in the area. Seek shelter and avoid travel if possible.',
    severity: 'high',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'alert-2',
    title: 'Traffic Advisory',
    description: 'Major road construction on Highway 101. Expect delays and consider alternate routes.',
    severity: 'medium',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 'alert-3',
    title: 'Air Quality Alert',
    description: 'Air quality index is elevated. Sensitive groups should limit outdoor activities.',
    severity: 'low',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: 'alert-4',
    title: 'Emergency Evacuation Notice',
    description: 'Mandatory evacuation order for Zone A due to wildfire. Leave immediately via designated routes.',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
  },
];

/**
 * Retrieves all emergency alerts
 * Requirements: 7.1, 7.2
 * 
 * @returns Array of EmergencyAlert objects with different severity levels
 */
export function getAlerts(): EmergencyAlert[] {
  // Return alerts sorted by severity (critical first) then by timestamp (newest first)
  return [...EMERGENCY_ALERTS].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) {
      return severityDiff;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

export const AlertService = {
  getAlerts,
};
