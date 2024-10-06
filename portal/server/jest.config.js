// portal/server/jest.config.js
module.exports = {
    testEnvironment: 'node',  // Set the environment for testing (node or jsdom)
    testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore specific paths
    transform: {
      '^.+\\.js$': 'babel-jest', // Use Babel for transforming JavaScript files
    },
    // Add other Jest configurations as needed
  };
  