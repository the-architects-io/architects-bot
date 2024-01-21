module.exports = {
  apps: [{
    name: 'architects-bot',
    script: 'dist/src/index.js',
    args: 'src/index.ts',
    interpreter: 'none',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    }
  }]
};
