module.exports = {
    apps: [
        {
            name: "scanpro",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 3001,
            },
        },
    ],
};
