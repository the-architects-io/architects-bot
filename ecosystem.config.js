module.exports = {
  apps: [{
    name: 'my-ts-app',
    script: 'node_modules/ts-node/dist/bin.js',
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
