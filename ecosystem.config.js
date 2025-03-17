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
    ],
};
