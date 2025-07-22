module.exports = {
  apps: [
    {
      name: "next-dev",
      script: "node_modules/next/dist/bin/next",
      args: "dev",
      env: {
        PORT: 3001,
        HOST: "0.0.0.0",
        NODE_ENV: "development"
      },
      watch: true,
      autorestart: true
    }
  ]
};