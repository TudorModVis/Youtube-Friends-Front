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

const overrideInjectRule = (config) => {
  console.log('Customizing inject rule...');
  // Find the style-loader rule
  const styleLoaderRule = config.module.rules
    .find((rule) => rule.oneOf)
    .oneOf.find((oneOfRule) => oneOfRule.use && oneOfRule.use.find((loader) => loader.loader && loader.loader.includes('style-loader')));

  if (styleLoaderRule && styleLoaderRule.use) {
    // Update the inject property based on the filename
    styleLoaderRule.use.forEach((loader) => {
      if (loader.loader && loader.loader.includes('style-loader') && loader.options) {
        console.log('Updating style-loader options...');
        loader.options = {
          ...loader.options,
          injectType: 'styleTag',
          inject: (resource) => {
            const isMainJs = resource.endsWith('main.js');
            console.log(`Injecting styles for ${resource}: ${isMainJs ? 'true' : 'false'}`);
            return isMainJs;
          },
        };
      }
    });
  }

  return config;
};


module.exports = {
  webpack: (config) => override(overrideEntry, overrideOutput, overrideInjectRule)(config),
}