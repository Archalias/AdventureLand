module.exports = {
  verbose: true,
  "transform": {
    "^.+\\.js$": "babel-jest",
    "^.+\\.html$": "html-loader-jest"
  },
  "setupFiles": [
    "./utils/setupJest.js"
  ],
};