import { buildName } from './system-name-generator';

describe('system-name-generator.ts', () => {
  describe('buildName()', () => {
    it('returns a string', () => {
      const name = buildName();
      expect(typeof name).toBe('string');
    });
  });
});
