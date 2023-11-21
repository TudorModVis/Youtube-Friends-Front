const { override } = require('customize-cra');
const path = require('path');

const overrideEntry = (config) => {
  config.entry = {
    main: path.join(__dirname, 'src', 'popup', 'index.tsx'), // the extension UI
    background: path.join(__dirname, 'src', 'background', 'index.ts'),
    content: path.join(__dirname, 'src', 'content', 'index.ts'),
  }

  return config
}

const overrideOutput = (config) => {
  config.output = {
    ...config.output,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
  }

  return config
}

module.exports = {
  webpack: (config) => override(overrideEntry, overrideOutput)(config),
}