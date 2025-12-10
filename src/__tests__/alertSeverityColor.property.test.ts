import * as fc from 'fast-check';
import { EmergencyAlert } from '../types';
import { getSeverityColor, SEVERITY_COLORS } from '../components/AlertCard';

/**
 * **Feature: city-pulse-app, Property 9: Alert Severity Color Mapping**
 * **Validates: Requirements 7.2**
 * 
 * Property: For any emergency alert with a severity level (low, medium, high, critical),
 * the alert card SHALL be rendered with the corresponding color code.
 */

// All valid severity levels
const severityLevels: EmergencyAlert['severity'][] = ['low', 'medium', 'high', 'critical'];

// Arbitrary generator for severity levels
const severityArbitrary = fc.constantFrom(...severityLevels);

// Arbitrary generator for valid EmergencyAlert objects
const emergencyAlertArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 200 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  severity: severityArbitrary,
  timestamp: fc.integer({ 
    min: new Date('2000-01-01').getTime(), 
    max: new Date('2030-12-31').getTime() 
  }).map(timestamp => new Date(timestamp).toISOString()),
});

// Expected color mappings
const expectedColors: Record<EmergencyAlert['severity'], string> = {
  low: '#4CAF50',      // Green
  medium: '#FF9800',   // Orange
  high: '#F44336',     // Red
  critical: '#9C27B0', // Purple
};

describe('Property 9: Alert Severity Color Mapping', () => {
  /**
   * **Feature: city-pulse-app, Property 9: Alert Severity Color Mapping**
   * **Validates: Requirements 7.2**
   */
  it('should return the correct color for any severity level', () => {
    fc.assert(
      fc.property(severityArbitrary, (severity) => {
        const color = getSeverityColor(severity);
        
        // Verify color is returned
        expect(color).toBeDefined();
        expect(typeof color).toBe('string');
        
        // Verify color matches expected mapping
        expect(color).toBe(expectedColors[severity]);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 9: Alert Severity Color Mapping**
   * **Validates: Requirements 7.2**
   */
  it('should map any emergency alert to its corresponding severity color', () => {
    fc.assert(
      fc.property(emergencyAlertArbitrary, (alert: EmergencyAlert) => {
        const color = getSeverityColor(alert.severity);
        
        // Verify the color matches the expected color for this severity
        expect(color).toBe(expectedColors[alert.severity]);
        
        // Verify the color is a valid hex color
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: city-pulse-app, Property 9: Alert Severity Color Mapping**
   * **Validates: Requirements 7.2**
   * 
   * Verifies that all severity levels have distinct colors
   */
  it('should have distinct colors for each severity level', () => {
    const colors = severityLevels.map(severity => getSeverityColor(severity));
    const uniqueColors = new Set(colors);
    
    // All severity levels should have unique colors
    expect(uniqueColors.size).toBe(severityLevels.length);
  });

  /**
   * **Feature: city-pulse-app, Property 9: Alert Severity Color Mapping**
   * **Validates: Requirements 7.2**
   * 
   * Verifies SEVERITY_COLORS constant matches getSeverityColor function
   */
  it('should have consistent color mapping between constant and function', () => {
    fc.assert(
      fc.property(severityArbitrary, (severity) => {
        const colorFromFunction = getSeverityColor(severity);
        const colorFromConstant = SEVERITY_COLORS[severity];
        
        expect(colorFromFunction).toBe(colorFromConstant);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
