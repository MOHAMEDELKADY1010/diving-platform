module.exports = (api) => {
  // Check the environment
  const isDevelopment = api.env('development');

  return {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      // Apply react-refresh only in development
      isDevelopment && 'react-refresh/babel',
    ].filter(Boolean), // Remove any false values
  };
};
