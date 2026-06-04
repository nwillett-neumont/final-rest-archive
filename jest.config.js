/** @type {import('jest').Config} */
export default {
  // ts-jest preset that transpiles TypeScript as native ES modules.
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  // Compile tests with a dedicated tsconfig that relaxes the production
  // build's rootDir/exclude and pulls in the Jest global type definitions.
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  // Allow ESM ".js" import specifiers to resolve to their ".ts" source.
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // Jest owns the *.test.ts files; Playwright owns *.spec.ts.
  testMatch: ["**/tests/**/*.test.ts"],
  // The flat-file store is shared state, so run tests serially.
  maxWorkers: 1,
};
