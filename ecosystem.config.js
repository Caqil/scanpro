module.exports = {
    apps: [
        {
            name: "scanpro",
            script: "npm",
            args: "start",
            env: {
                PORT: 3001,
            },
        },
        {
            name: 'scanpro-cleanup',
            script: '/home/scanpro/dist/scripts/cleanup-job.js', // Use absolute path
            instances: 1,
            exec_mode: 'fork',
            autorestart: false,
            watch: false,
            cron_restart: '0 */1 * * *', // Run every hour
            env: {
                NODE_ENV: 'production',
            },
        }
    ],
};
