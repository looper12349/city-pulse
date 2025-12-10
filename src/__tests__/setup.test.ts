// Basic test to verify Jest setup
describe('Project Setup', () => {
  it('should have Jest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should have fast-check available for property-based testing', () => {
    const fc = require('fast-check');
    expect(fc).toBeDefined();
    expect(fc.property).toBeDefined();
  });
});
