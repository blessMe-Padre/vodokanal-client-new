module.exports = {
  apps: [
    {
      name: "vodokanal-front",
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