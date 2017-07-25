module.exports = {
    port: process.env.PORT || 4000,
    db: {
        connection: "mongodb://videomanias:videomanias@ds111123.mlab.com:11123/videomanias"
    },
    TOKEN_SECRET: process.env.TOKEN_SECRET || "79d27Mh1swkXnqGp2GdB0Xl4zmTKox2T"
}
