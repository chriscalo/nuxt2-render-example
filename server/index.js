const express = require("express");
const nuxtServer = require("./nuxt");
const server = express();

server.enable("trust proxy");
server.set("json spaces", 2);

// This pattern of integrating Nuxt's serving logic into our server gives us
// full control over the serving logic in all the ways we want, instead of us
// having to integrate our middleware into some server that we don't control.

// It's not hard to imagine all kinds of middleware we need to run before and
// after Nuxt:
// server.use(require("./security"));
// server.use(require("./logging"));
// server.use(require("./parsing"));
// server.use(require("./auth"));
// server.use(require("./sessions"));

// Finally, apply Nuxt handlers:
server.use(nuxtServer);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
