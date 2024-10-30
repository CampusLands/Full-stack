const express = require("express")
const noteRouters = require("./routers/noteRouters")
const userRouters = require("./routers/userRouters")
const error = require("./middleware/errorHandler")
const session = require("./middleware/sessionConfig")
const {auth} = require("./middleware/decodedJWT")

// const https = require("https")
// const fs = require("fs")

// const privateKey = fs.readFileSync('./private.key');
// const certificate = fs.readFileSync('./certificate.crt');
const app = express();

app.use(express.json());
app.use(session);
app.use(error.jsonParseErrorHandler);


app.use("/user", userRouters);
app.use("/notes", auth, noteRouters);


// const httpsServer = https.createServer({
//     key: privateKey,
//     cert: certificate,
// }, app);
const config = {
    host: process.env.EXPRESS_HOST,
    port: process.env.EXPRESS_PORT
}
// httpsServer.listen(config, ()=>{
//     console.log(`https://${config.host}:${config.port}`);
// })
app.listen(config, ()=>{
    console.log(`http://${config.host}:${config.port}`);
})