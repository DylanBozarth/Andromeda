import { buildName, systemNameGenerator } from './system-name-generator';

describe('system-name-generator.ts', () => {
  describe('buildName()', () => {
    it('returns a string', () => {
      const name = buildName();
      expect(typeof name).toBe('string');
    });
  });
  describe('systemNameGenerator()', () => {
    it('returns an array', () => {
      const arrOfNames = systemNameGenerator(3);
      expect(Array.isArray(arrOfNames)).toBe(true);
    });
    it('returns an array of strings', () => {
      const arrOfNames = systemNameGenerator(3);
      expect(arrOfNames.every((name) => typeof name === 'string')).toBe(true);
    });
    it('returns an array of x strings based on x as input', () => {
      const arrOfNames = systemNameGenerator(3);
      expect(arrOfNames.length).toBe(3);
    });
  });
});
