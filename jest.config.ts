export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@enums/(.*)$': '<rootDir>/common/enums/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@users/(.*)$': '<rootDir>/users/$1',
    '^@products/(.*)$': '<rootDir>/products/$1',
    '^@stock/(.*)$': '<rootDir>/stock/$1',
  },
};
