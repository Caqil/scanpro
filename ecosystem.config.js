module.exports = {
    apps: [
        {
            name: "scanpro",
            script: "npm",
            args: "start",
            env: {
                PORT: 3001,
                NODE_ENV: 'production'
            },
            exec_mode: "fork",
            instances: 1,
            max_memory_restart: "500M",
            watch: false,
            merge_logs: true,
            autorestart: true
        },
        {
            name: 'scanpro-cleanup',
            script: './dist/scripts/cleanup-job.js', // Using relative path
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