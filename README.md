# Nuxt 2 render function example

This repo is a minimal reproduction of Nuxt 2's `nuxt.render(req, res, next)`
function, which was extremely helpful for integrating Nuxt's serving behavior
into a server we controlled instead of the other way around. This programmatic
option seems to be missing from Nuxt 3 or is at least undocumented.

There are several developers looking to do something identical in Nuxt 3.

Full context: https://github.com/nuxt/nuxt/discussions/17845

Github user **Schetnan**'s original question:
> In Nuxt 2, we had the ability to initialize Nuxt programmatically so that we could wrap it up into a corporate express Instance. I am wondering how to do the same with Nuxt 3? The code looked something like the following:
> 
> ```js
> async function configureNuxt(app) {
>   const config = require('../nuxt.config.js')
>   const isDev = config.env.delivery == 'development'
>   const nuxt = await loadNuxt(isDev ? 'dev' : 'start')
>   app.use(nuxt.render)
>   
>   if (isDev) {
>     build(nuxt)
>   }
> 
>   return nuxt
> }
> ```

The key idea is expressed in [server/index.js](./server/index.js):

```js
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
server.use(require("./security"));
server.use(require("./logging"));
server.use(require("./parsing"));
server.use(require("./auth"));
server.use(require("./sessions"));

// Finally, apply Nuxt handlers:
server.use(nuxtServer);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
```

Of course there are other ways to accomplish this, but what's important to
realize is there are many reasons why developers either can't or don't want to
integrate their middleware into Nuxt's server and instead need to integrate
Nuxt's serving logic as middleware into their own server that they control.
