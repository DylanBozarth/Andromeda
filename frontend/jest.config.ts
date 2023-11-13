module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
};
