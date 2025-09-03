const { getDefaultConfig } = require("@react-native/metro-config");
const path = require("path");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// Add explicit resolver for @babel/runtime helpers
config.resolver = {
  ...config.resolver,
  alias: {
    ...config.resolver.alias,
    "@babel/runtime/helpers/interopRequireDefault": path.resolve(
      __dirname,
      "src/utils/interopRequireDefault.js"
    ),
  },
  nodeModulesPaths: [path.resolve(__dirname, "node_modules")],
  platforms: ["ios", "android", "native", "web"],
};

module.exports = config;
