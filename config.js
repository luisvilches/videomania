module.exports = {
    port: process.env.PORT || 3000,
    db: {
        connection: "mongodb://admin:admin@ds013941.mlab.com:13941/desarrollo"
    },
    TOKEN_SECRET: process.env.TOKEN_SECRET || "79d27Mh1swkXnqGp2GdB0Xl4zmTKox2T"
}