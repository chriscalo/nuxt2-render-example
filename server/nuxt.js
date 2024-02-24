const express = require("express");
const config = require("~/nuxt.config.js");

const production = process.env.NODE_ENV === "production";

const server = module.exports = express();

// Exposes when the Nuxt server is ready
const ready = (async function() {
  await start();
  return true;
})();

// Wait until Nuxt is ready before handling requests.
server.use(async (req, res, next) => {
  await ready;
  next();
});

async function start() {
  const createNuxt = production ? createNuxtProd : createNuxtDev;
  const nuxt = await createNuxt(config);
  
  // This `nuxt.render(req, res, next)` function is what gives us full control
  // over our server. We can add any middleware we need before or after it to
  // meet our needs. This is a lot more flexible than giving Nuxt full control
  // over serving and passing our middleware to it.
  server.use(nuxt.render);
}

async function createNuxtProd(config) {
  const { loadNuxt } = require("nuxt-start");
  const nuxt = await loadNuxt({ for: "start" });
  return nuxt;
}

async function createNuxtDev(config) {
  const { loadNuxt, build } = require("nuxt");
  const nuxt = await loadNuxt("dev");
  build(nuxt);
  return nuxt;
}
