globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, createError, createApp, createRouter, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ohmyfetch';
import { createRouter as createRouter$1 } from 'radix3';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage } from 'unstorage';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';
import express, { Router } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import _ from 'lodash';
import * as dfns from 'date-fns';
import multer from 'multer';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{"apiBase":"Im_Avaliable_On_Server_And_Client"},"apiSecret":"Im_Avaliable_Only_On_Server"};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
function timingMiddleware(_req, res, next) {
  const start = globalTiming.start();
  const _end = res.end;
  res.end = (data, encoding, callback) => {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!res.headersSent) {
      res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(res, data, encoding, callback);
  };
  next();
}

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage$1 = createStorage({});

const useStorage = () => storage$1;

storage$1.mount('/assets', assets$1);

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl;
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      return decodeURI(parseURL(event.req.originalUrl || event.req.url).pathname).replace(/\/$/, "/index");
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event);
    const headers = event.res.getHeaders();
    headers.Etag = `W/"${hash(body)}"`;
    headers["Last-Modified"] = new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["Cache-Control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["Last-Modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(req, header, includes) {
  const value = req.headers[header];
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event.req, "accept", "application/json") || hasReqHeader(event.req, "user-agent", "curl/") || hasReqHeader(event.req, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Route Not Found" : "Internal Server Error");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(_error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(_error);
  const errorObject = {
    url: event.req.url,
    statusCode,
    statusMessage,
    message,
    description: "",
    data: _error.data
  };
  event.res.statusCode = errorObject.statusCode;
  event.res.statusMessage = errorObject.statusMessage;
  if (errorObject.statusCode !== 404) {
    console.error("[nuxt] [request error]", errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.res.setHeader("Content-Type", "application/json");
    event.res.end(JSON.stringify(errorObject));
    return;
  }
  const url = withQuery("/__nuxt_error", errorObject);
  const html = await $fetch(url).catch((error) => {
    console.error("[nitro] Error while generating error response", error);
    return errorObject.statusMessage;
  });
  event.res.setHeader("Content-Type", "text/html;charset=UTF-8");
  event.res.end(html);
});

const assets = {
  "/_nuxt/2022-06-15T04-32-14.482Z.png": {
    "type": "image/png",
    "etag": "\"31cbb-bXse7l4zGInUTK8yPL+Yl4vjuq0\"",
    "mtime": "2022-06-16T11:43:51.586Z",
    "path": "../public/_nuxt/2022-06-15T04-32-14.482Z.png"
  },
  "/_nuxt/2022-06-15T04-32-14.488Z.png": {
    "type": "image/png",
    "etag": "\"31cbb-bXse7l4zGInUTK8yPL+Yl4vjuq0\"",
    "mtime": "2022-06-16T11:43:51.589Z",
    "path": "../public/_nuxt/2022-06-15T04-32-14.488Z.png"
  },
  "/_nuxt/2022-06-15T04-33-08.504Z.png": {
    "type": "image/png",
    "etag": "\"2ec89-8EsuolaVn3lqt4+2qizjksDGn64\"",
    "mtime": "2022-06-16T11:43:51.591Z",
    "path": "../public/_nuxt/2022-06-15T04-33-08.504Z.png"
  },
  "/_nuxt/2022-06-15T04-33-08.509Z.png": {
    "type": "image/png",
    "etag": "\"31cbb-bXse7l4zGInUTK8yPL+Yl4vjuq0\"",
    "mtime": "2022-06-16T11:43:51.594Z",
    "path": "../public/_nuxt/2022-06-15T04-33-08.509Z.png"
  },
  "/_nuxt/clouds.127a114e.webm": {
    "type": "video/webm",
    "etag": "\"b25ab-WcdGwvy93HXzN9x1dzEetVlxefM\"",
    "mtime": "2022-06-16T11:46:13.363Z",
    "path": "../public/_nuxt/clouds.127a114e.webm"
  },
  "/_nuxt/default-b14e40fd.mjs": {
    "type": "application/javascript",
    "etag": "\"f976-/wsq53XAnIfi/JLUfIKIcHwl7lw\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/default-b14e40fd.mjs"
  },
  "/_nuxt/default.e522f9ea.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"16e3-ft3wfRt0PqLdeo1M/aoZYjGBjtc\"",
    "mtime": "2022-06-16T11:46:13.363Z",
    "path": "../public/_nuxt/default.e522f9ea.css"
  },
  "/_nuxt/entry-092ad450.mjs": {
    "type": "application/javascript",
    "etag": "\"8c732-Xc8/n4waJH4IBOUXuNVJz4fUW0k\"",
    "mtime": "2022-06-16T11:46:13.363Z",
    "path": "../public/_nuxt/entry-092ad450.mjs"
  },
  "/_nuxt/entry.0820eb03.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ec5a-Q743eBDB5AfOR4ooyC1UQqJbPgA\"",
    "mtime": "2022-06-16T11:46:13.363Z",
    "path": "../public/_nuxt/entry.0820eb03.css"
  },
  "/_nuxt/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-wGBe/tk27iYAKE5kgFIdBvpk+HI\"",
    "mtime": "2022-06-16T11:43:51.594Z",
    "path": "../public/_nuxt/favicon.ico"
  },
  "/_nuxt/helpers-3d15a799.mjs": {
    "type": "application/javascript",
    "etag": "\"53b-1tMR3I05+/pMSHip+XCsx/Weebo\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/helpers-3d15a799.mjs"
  },
  "/_nuxt/index-1cedc307.mjs": {
    "type": "application/javascript",
    "etag": "\"2be-85QF+ClvV+Jgjp2tHpce96k4XNc\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/index-1cedc307.mjs"
  },
  "/_nuxt/index-65e82cce.mjs": {
    "type": "application/javascript",
    "etag": "\"cfe-jTwTXVCBKTowtydBxiBCAuWcS3g\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/index-65e82cce.mjs"
  },
  "/_nuxt/index-e5fa8488.mjs": {
    "type": "application/javascript",
    "etag": "\"24af-ZHdWDR9WmrTtG5gGvcDFoKSmTzs\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/index-e5fa8488.mjs"
  },
  "/_nuxt/index-ee398ee2.mjs": {
    "type": "application/javascript",
    "etag": "\"2c1-1JMQMcZCjfMOUFBCRJ5j8msZ1ZM\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/index-ee398ee2.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"bc1-5ufENkuL5xHBccHZ0ke+qnWjJz0\"",
    "mtime": "2022-06-16T11:46:13.363Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/ProximaNova-Black.61641d9c.woff": {
    "type": "font/woff",
    "etag": "\"c470-GAFWjqHBrkw4oGV+VBbXXxF61M0\"",
    "mtime": "2022-06-16T11:46:13.361Z",
    "path": "../public/_nuxt/ProximaNova-Black.61641d9c.woff"
  },
  "/_nuxt/ProximaNova-Black.75b625cd.ttf": {
    "type": "font/ttf",
    "etag": "\"1f1e0-xCvPdqAU1YTYwmqom3sT3hgzF0Y\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/ProximaNova-Black.75b625cd.ttf"
  },
  "/_nuxt/ProximaNova-Black.77edfbc7.woff2": {
    "type": "font/woff2",
    "etag": "\"803c-MzQ3R4R634mBoyxK6j/cQyEoJcw\"",
    "mtime": "2022-06-16T11:46:13.361Z",
    "path": "../public/_nuxt/ProximaNova-Black.77edfbc7.woff2"
  },
  "/_nuxt/ProximaNova-Bold.8ae1efe2.ttf": {
    "type": "font/ttf",
    "etag": "\"1fa14-AXTagucR5iFA5eDcnMkiK4Al3pk\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/ProximaNova-Bold.8ae1efe2.ttf"
  },
  "/_nuxt/ProximaNova-Bold.b7123efb.woff2": {
    "type": "font/woff2",
    "etag": "\"856c-tqqDTLlf+S5l3RbW+Kw15SI0gWw\"",
    "mtime": "2022-06-16T11:46:13.361Z",
    "path": "../public/_nuxt/ProximaNova-Bold.b7123efb.woff2"
  },
  "/_nuxt/ProximaNova-Bold.e9f28e38.woff": {
    "type": "font/woff",
    "etag": "\"cae8-1dp10rgm2donN4qcD34LYgAxwzk\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/ProximaNova-Bold.e9f28e38.woff"
  },
  "/_nuxt/ProximaNova-Regular.239567a8.ttf": {
    "type": "font/ttf",
    "etag": "\"1fe4c-NGygON/mfNOu9gj9jcyqCrBLjuo\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/ProximaNova-Regular.239567a8.ttf"
  },
  "/_nuxt/ProximaNova-Regular.5aae7183.woff2": {
    "type": "font/woff2",
    "etag": "\"85e8-vZkdQ7BugbzUSdbj24bz8yZTKUc\"",
    "mtime": "2022-06-16T11:46:13.361Z",
    "path": "../public/_nuxt/ProximaNova-Regular.5aae7183.woff2"
  },
  "/_nuxt/ProximaNova-Regular.756e5a50.woff": {
    "type": "font/woff",
    "etag": "\"cc38-LQTBCsnrSHJP/wQaGVGfY1enG0E\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/ProximaNova-Regular.756e5a50.woff"
  },
  "/_nuxt/ProximaNova-RegularIt.a58ac4df.woff": {
    "type": "font/woff",
    "etag": "\"d5f0-pDTvjAxzEybqBIL0cYhHHGhKhOY\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/ProximaNova-RegularIt.a58ac4df.woff"
  },
  "/_nuxt/ProximaNova-RegularIt.cc7c08a2.ttf": {
    "type": "font/ttf",
    "etag": "\"21c40-R6mniWSQPi1BaRw3e3a4KqMqW74\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/ProximaNova-RegularIt.cc7c08a2.ttf"
  },
  "/_nuxt/ProximaNova-RegularIt.fddc279d.woff2": {
    "type": "font/woff2",
    "etag": "\"8af0-rKUZez955PSqVXLKROg4ekY3GKY\"",
    "mtime": "2022-06-16T11:46:13.361Z",
    "path": "../public/_nuxt/ProximaNova-RegularIt.fddc279d.woff2"
  },
  "/_nuxt/ProximaNova-Semibold.b0cfaf55.woff": {
    "type": "font/woff",
    "etag": "\"ca30-GZg//KLXxzhvB6BV+So1i5Uvguk\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/ProximaNova-Semibold.b0cfaf55.woff"
  },
  "/_nuxt/ProximaNova-Semibold.db7b64fb.woff2": {
    "type": "font/woff2",
    "etag": "\"83d0-s7P1dhvtQaZSa8siuQneSHX0MbI\"",
    "mtime": "2022-06-16T11:46:13.361Z",
    "path": "../public/_nuxt/ProximaNova-Semibold.db7b64fb.woff2"
  },
  "/_nuxt/ProximaNova-Semibold.de23a789.ttf": {
    "type": "font/ttf",
    "etag": "\"1fec8-EGCI04XjKjsDebeOyfVvxoRHLXQ\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/ProximaNova-Semibold.de23a789.ttf"
  },
  "/_nuxt/TourCard-512dcf9e.mjs": {
    "type": "application/javascript",
    "etag": "\"f08-xBtbI3i+I2llRnrok1xqhsmukdE\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/TourCard-512dcf9e.mjs"
  },
  "/_nuxt/User-9013d412.mjs": {
    "type": "application/javascript",
    "etag": "\"e55-+s+uBtoOU52h3+b4rwunkO64sNo\"",
    "mtime": "2022-06-16T11:46:13.362Z",
    "path": "../public/_nuxt/User-9013d412.mjs"
  },
  "/_nuxt/images/attractions/1.png": {
    "type": "image/png",
    "etag": "\"21267-UvRTpKlSW3Y4GfjcEUNTXJnPP/g\"",
    "mtime": "2022-06-16T11:43:51.598Z",
    "path": "../public/_nuxt/images/attractions/1.png"
  },
  "/_nuxt/images/attractions/10.png": {
    "type": "image/png",
    "etag": "\"b544-N498kQAbvvD+Kaq72yhk9RLlwYE\"",
    "mtime": "2022-06-16T11:43:51.599Z",
    "path": "../public/_nuxt/images/attractions/10.png"
  },
  "/_nuxt/images/attractions/11.png": {
    "type": "image/png",
    "etag": "\"6a08-NYpnMqbc2oc3DPEVU3wczyF5ewQ\"",
    "mtime": "2022-06-16T11:43:51.599Z",
    "path": "../public/_nuxt/images/attractions/11.png"
  },
  "/_nuxt/images/attractions/2.png": {
    "type": "image/png",
    "etag": "\"15dd1-daTtso5Ejkx+PT43KilZGrqU54I\"",
    "mtime": "2022-06-16T11:43:51.602Z",
    "path": "../public/_nuxt/images/attractions/2.png"
  },
  "/_nuxt/images/attractions/3.png": {
    "type": "image/png",
    "etag": "\"3a47d-h5PQs4h8ygrEHGKiAc9wi3bq3uI\"",
    "mtime": "2022-06-16T11:43:51.606Z",
    "path": "../public/_nuxt/images/attractions/3.png"
  },
  "/_nuxt/images/attractions/4.png": {
    "type": "image/png",
    "etag": "\"1b443-toF1Z1kPNA5AUsgK5iAok7lhFdI\"",
    "mtime": "2022-06-16T11:43:51.609Z",
    "path": "../public/_nuxt/images/attractions/4.png"
  },
  "/_nuxt/images/attractions/5.png": {
    "type": "image/png",
    "etag": "\"16751-maJn/Orla43vlpLCTRitj6SgW8A\"",
    "mtime": "2022-06-16T11:43:51.611Z",
    "path": "../public/_nuxt/images/attractions/5.png"
  },
  "/_nuxt/images/attractions/6.png": {
    "type": "image/png",
    "etag": "\"10505-01KNEx3ccZcAh7Dd+UllZNKlM0w\"",
    "mtime": "2022-06-16T11:43:51.612Z",
    "path": "../public/_nuxt/images/attractions/6.png"
  },
  "/_nuxt/images/attractions/7.png": {
    "type": "image/png",
    "etag": "\"192da-eSC9cnyQH+1+7SmTjsx55bBnVwo\"",
    "mtime": "2022-06-16T11:43:51.614Z",
    "path": "../public/_nuxt/images/attractions/7.png"
  },
  "/_nuxt/images/attractions/8.png": {
    "type": "image/png",
    "etag": "\"190d6-ovRhFsDu3zFBHFaT26knAzcH7Zw\"",
    "mtime": "2022-06-16T11:43:51.617Z",
    "path": "../public/_nuxt/images/attractions/8.png"
  },
  "/_nuxt/images/attractions/9.png": {
    "type": "image/png",
    "etag": "\"21f62-NRwfgtw1SRgqAv2KrV5Afyuk9OY\"",
    "mtime": "2022-06-16T11:43:51.619Z",
    "path": "../public/_nuxt/images/attractions/9.png"
  },
  "/_nuxt/images/tours/1.png": {
    "type": "image/png",
    "etag": "\"21267-UvRTpKlSW3Y4GfjcEUNTXJnPP/g\"",
    "mtime": "2022-06-16T11:43:51.620Z",
    "path": "../public/_nuxt/images/tours/1.png"
  },
  "/_nuxt/images/tours/addPhotos-1655262688355-472320250.png": {
    "type": "image/png",
    "etag": "\"31cbb-bXse7l4zGInUTK8yPL+Yl4vjuq0\"",
    "mtime": "2022-06-16T11:43:51.622Z",
    "path": "../public/_nuxt/images/tours/addPhotos-1655262688355-472320250.png"
  },
  "/_nuxt/images/tours/mainPhoto-1655262688352-180442975.png": {
    "type": "image/png",
    "etag": "\"15ce-b4743+pPu+W0KSvPG4X52jS6qKU\"",
    "mtime": "2022-06-16T11:43:51.623Z",
    "path": "../public/_nuxt/images/tours/mainPhoto-1655262688352-180442975.png"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = ["/_nuxt"];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const _152570 = eventHandler(async (event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  for (const _id of [id, id + "/index.html"]) {
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
      break;
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end("Not Modified (etag)");
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end("Not Modified (mtime)");
      return;
    }
  }
  if (asset.type) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  const contents = await readAsset(id);
  event.res.end(contents);
});

async function connectDB() {
  await mongoose.connect("mongodb+srv://Sgadmer:PTuLbNg03gscizhE@udm-attr-cluster.jew94.mongodb.net/udmAttr?retryWrites=true&w=majority");
}
connectDB().catch((err) => console.log(err));

const touristSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  patronymic: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    required: false,
    default: () => true
  }
});
touristSchema.pre("save", function(next) {
  next();
});
const Tourist$2 = mongoose.model("Tourist", touristSchema);

const findAll$5 = async () => Tourist$2.find({});
const findById$5 = async (id) => Tourist$2.findById(id);
const findByParams$6 = async (params) => Tourist$2.find(params);
const getTouristService = {
  findAll: findAll$5,
  findById: findById$5,
  findByParams: findByParams$6
};

const create$5 = (tourist) => Tourist$2.create(tourist);
const postTouristService = {
  create: create$5
};

const update$5 = (id, tourist) => Tourist$2.findByIdAndUpdate(id, tourist, { new: true });
const putTouristService = {
  update: update$5
};

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  patronymic: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    required: false,
    default: () => true
  }
});
adminSchema.pre("save", function(next) {
  next();
});
const Admin = mongoose.model("Admin", adminSchema);

const agentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  corpName: {
    type: String,
    required: true
  },
  inn: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return v.length === 10 || v.length === 12;
      },
      message: (props) => `\u0418\u043D\u043D \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C 10 \u0438\u043B\u0438 12 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432`
    }
  },
  director: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  corpAddress: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    required: false,
    default: () => true
  }
});
agentSchema.pre("save", function(next) {
  next();
});
const Agent$2 = mongoose.model("Agent", agentSchema);

const findByParams$5 = async (params, useAllParams) => {
  params = _.omitBy(params, _.isNil);
  const preparedParams = [];
  Object.entries(params).forEach(([key, value]) => {
    preparedParams.push({
      [key]: value
    });
  });
  const filter = useAllParams ? "$and" : "$or";
  const admins = await Admin.find({ [filter]: preparedParams });
  const agents = await Agent$2.find({ [filter]: preparedParams });
  const tourists = await Tourist$2.find({ [filter]: preparedParams });
  let returnVal = {
    isExist: false,
    existType: null
  };
  if (admins.length) {
    returnVal.existType = "admin";
    returnVal.info = admins[0];
  }
  if (agents.length) {
    returnVal.existType = "agent";
    returnVal.info = agents[0];
  }
  if (tourists.length) {
    returnVal.existType = "tourist";
    returnVal.info = tourists[0];
  }
  returnVal.isExist = Boolean(returnVal.existType);
  return returnVal;
};
const getUserService = {
  findByParams: findByParams$5
};

const findAll$4 = async (req, res) => {
  try {
    res.status(200).json(await getTouristService.findAll());
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const findById$4 = async (req, res) => {
  try {
    res.status(200).json(await getTouristService.findById(req.params.id));
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const findByParams$4 = async (req, res) => {
  const {
    surname,
    name,
    patronymic,
    phone,
    email,
    isBlocked
  } = req.query;
  const params = _.omitBy({
    surname,
    name,
    patronymic,
    phone,
    email
  }, (v) => _.isUndefined(v) || _.isNull(v) || v === "");
  Object.entries(params).forEach(([key, value]) => {
    params[key] = {
      $regex: value,
      $options: "i"
    };
  });
  params.isActive = !JSON.parse(isBlocked);
  try {
    res.status(200).json(await getTouristService.findByParams(params));
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const create$4 = async (req, res) => {
  try {
    const {
      email,
      password,
      phone,
      name,
      surname,
      patronymic
    } = req.body;
    const account = await getUserService.findByParams({ email, phone });
    if (account.isExist) {
      res.status(500).json("\u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442");
    } else {
      const newTourist = await postTouristService.create({
        email,
        password,
        phone,
        name,
        surname,
        patronymic
      });
      res.status(200).json(newTourist);
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const update$4 = async (req, res) => {
  try {
    const {
      id,
      email,
      password,
      corpName,
      inn,
      director,
      phone,
      corpAddress,
      isActive
    } = req.body;
    if (!id)
      res.status(500).json("\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D id");
    const updTourist = await putTouristService.update(id, _.omitBy({
      email,
      password,
      corpName,
      inn,
      director,
      phone,
      corpAddress,
      isActive
    }, _.isNil));
    res.status(200).json(updTourist);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const touristController = {
  findAll: findAll$4,
  findById: findById$4,
  findByParams: findByParams$4,
  create: create$4,
  update: update$4
};

const Tourist = Router();
Tourist.get("/", touristController.findAll);
Tourist.get("/params", touristController.findByParams);
Tourist.get("/:id", touristController.findById);
Tourist.post("/", touristController.create);
Tourist.put("/", touristController.update);
const Tourist$1 = Tourist;

const findAll$3 = async () => Agent$2.find({});
const findById$3 = async (id) => Agent$2.findById(id);
const findByParams$3 = async (params) => Agent$2.find(params);
const getAgentService = {
  findAll: findAll$3,
  findById: findById$3,
  findByParams: findByParams$3
};

const create$3 = (agent) => Agent$2.create(agent);
const postAgentService = {
  create: create$3
};

const update$3 = (id, agent) => Agent$2.findByIdAndUpdate(id, agent, { new: true });
const putAgentService = {
  update: update$3
};

const findAll$2 = async (req, res) => {
  try {
    res.status(200).json(await getAgentService.findAll());
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const findById$2 = async (req, res) => {
  try {
    res.status(200).json(await getAgentService.findById(req.params.id));
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const findByParams$2 = async (req, res) => {
  const {
    corpName,
    phone,
    email,
    isBlocked
  } = req.query;
  const params = _.omitBy({
    corpName,
    phone,
    email
  }, (v) => _.isUndefined(v) || _.isNull(v) || v === "");
  Object.entries(params).forEach(([key, value]) => {
    params[key] = {
      $regex: value,
      $options: "i"
    };
  });
  params.isActive = !JSON.parse(isBlocked);
  try {
    res.status(200).json(await getAgentService.findByParams(params));
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const create$2 = async (req, res) => {
  try {
    const {
      email,
      password,
      corpName,
      inn,
      director,
      phone,
      corpAddress
    } = req.body;
    const account = await getUserService.findByParams({ email, phone });
    if (account.isExist) {
      res.status(500).json("\u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442");
    } else {
      const newAgent = await postAgentService.create({
        email,
        password,
        corpName,
        inn,
        director,
        phone,
        corpAddress
      });
      res.status(200).json(newAgent);
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const update$2 = async (req, res) => {
  try {
    const {
      id,
      email,
      password,
      corpName,
      inn,
      director,
      phone,
      corpAddress,
      isActive
    } = req.body;
    if (!id)
      res.status(500).json("\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D id");
    const newTour = await putAgentService.update(id, _.omitBy({
      email,
      password,
      corpName,
      inn,
      director,
      phone,
      corpAddress,
      isActive
    }, _.isNil));
    res.status(200).json(newTour);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const agentController = {
  findAll: findAll$2,
  findById: findById$2,
  findByParams: findByParams$2,
  create: create$2,
  update: update$2
};

const Agent = Router();
Agent.get("/", agentController.findAll);
Agent.get("/params", agentController.findByParams);
Agent.get("/:id", agentController.findById);
Agent.post("/", agentController.create);
Agent.put("/", agentController.update);
const Agent$1 = Agent;

const touristBookSchema = new mongoose.Schema({
  touristId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Tourist",
    required: true
  },
  bookStatus: {
    type: String,
    required: true
  }
});
const tourSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Agent",
    immutable: true,
    required: true
  },
  mainPhoto: {
    type: String,
    required: true
  },
  addPhotos: {
    type: [String],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 1e5;
      },
      message: (props) => `\u041C\u0438\u043D. \u0446\u0435\u043D\u0430 - 0, \u043C\u0430\u043A\u0441. \u0446\u0435\u043D\u0430 - 100000`
    }
  },
  place: {
    type: String,
    required: true
  },
  dateStart: {
    type: Date,
    required: true
  },
  dateEnd: {
    type: Date,
    required: true
  },
  desc: {
    type: String,
    required: true,
    maxLength: 2500
  },
  tourists: {
    type: [touristBookSchema],
    required: false
  },
  status: {
    type: String,
    required: true,
    default: () => "NEW"
  }
});
tourSchema.pre("save", function(next) {
  next();
});
const Tour$2 = mongoose.model("Tour", tourSchema);

const findAll$1 = async () => Tour$2.find({}).populate(["agentId", "tourists.touristId"]).sort({ dateStart: -1 });
const findById$1 = async (id) => Tour$2.findById(id).populate(["agentId", "tourists.touristId"]);
const findByParams$1 = async (params) => Tour$2.find(params).sort({ dateStart: -1 }).populate(["agentId", "tourists.touristId"]);
const findTouristsBooks$1 = async (touristId) => Tour$2.find({ "tourists.touristId": touristId }, {
  mainPhoto: 1,
  addPhotos: 1,
  title: 1,
  price: 1,
  place: 1,
  dateStart: 1,
  dateEnd: 1,
  desc: 1,
  status: 1
});
const getTourService = {
  findAll: findAll$1,
  findById: findById$1,
  findByParams: findByParams$1,
  findTouristsBooks: findTouristsBooks$1
};

const create$1 = (tour) => Tour$2.create(tour);
const postTourService = {
  create: create$1
};

const update$1 = (id, tour) => Tour$2.findByIdAndUpdate(id, tour, { new: true });
const updateTourist$1 = (tourId, touristId, status, operation) => Tour$2.findById(tourId).then((tour) => {
  if (operation === "change") {
    tour.tourists.forEach((tourist) => {
      if (tourist.touristId.toString() === touristId) {
        tourist.bookStatus = status;
      }
    });
  }
  if (operation === "add") {
    tour.tourists.push({
      touristId,
      bookStatus: status
    });
  }
  tour.save();
  return tour;
});
const putTourService = {
  update: update$1,
  updateTourist: updateTourist$1
};

const getRealImagePath = (req, img) => {
  return `./uploads/${img.filename}`;
};

const findAll = async (req, res) => {
  try {
    res.status(200).json(await getTourService.findAll());
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const findById = async (req, res) => {
  try {
    res.status(200).json(await getTourService.findById(req.query.id));
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const findByParams = async (req, res) => {
  try {
    const {
      touristId,
      excludeTouristId,
      agentId,
      title,
      place,
      dateStart,
      dateEnd,
      priceMin,
      priceMax,
      desc,
      status
    } = req.query;
    let priceFilter = {};
    if (priceMin)
      priceFilter.$gte = +priceMin;
    if (priceMax)
      priceFilter.$lte = +priceMax;
    if (!priceMin && !priceMax)
      priceFilter = null;
    const placeFilter = place ? {
      $regex: place,
      $options: "i"
    } : null;
    const dateStartFilter = dateStart ? { $gte: dfns.startOfDay(new Date(dateStart)) } : null;
    const dateEndFilter = dateEnd ? { $lte: dfns.endOfDay(new Date(dateEnd)) } : null;
    let touristsFilter = null;
    if (touristId)
      touristsFilter = touristId;
    else if (excludeTouristId)
      touristsFilter = { $ne: excludeTouristId };
    res.status(200).json(await getTourService.findByParams(_.omitBy({
      agentId,
      title,
      price: priceFilter,
      place: placeFilter,
      dateStart: dateStartFilter,
      dateEnd: dateEndFilter,
      desc,
      "tourists.touristId": touristsFilter,
      status
    }, (v) => _.isUndefined(v) || _.isNull(v) || v === "")));
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const create = async (req, res) => {
  try {
    const {
      agentId,
      title,
      price,
      place,
      dateStart,
      dateEnd,
      desc
    } = req.body;
    const agent = await getAgentService.findById(agentId);
    if (!agent.isActive)
      res.status(500).json("\u041D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0442\u0443\u0440, \u0442.\u043A. \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D");
    const mainPhotoSrc = getRealImagePath(req, req.files.mainPhoto[0]);
    const addPhotosSrc = req.files.addPhotos.map((photoObj) => {
      return getRealImagePath(req, photoObj);
    });
    const newTour = await postTourService.create({
      agentId,
      mainPhoto: mainPhotoSrc,
      addPhotos: addPhotosSrc,
      title,
      price,
      place,
      dateStart,
      dateEnd,
      desc
    });
    res.status(200).json(newTour);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const update = async (req, res) => {
  try {
    const {
      id,
      title,
      price,
      place,
      dateStart,
      dateEnd,
      desc,
      status
    } = req.body;
    if (!id)
      res.status(500).json("\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D id");
    const tour = await getTourService.findById(id);
    const agent = await getAgentService.findById(tour.agentId);
    if (!agent.isActive)
      res.status(500).json("\u041D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0442\u0443\u0440, \u0442.\u043A. \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D");
    let mainPhotoSrc = null;
    let addPhotosSrc = null;
    if (req.files) {
      mainPhotoSrc = getRealImagePath(req, req.files.mainPhoto[0]);
      addPhotosSrc = req.files.addPhotos.map((photoObj) => {
        return getRealImagePath(req, photoObj);
      });
    }
    const newTour = await putTourService.update(id, _.omitBy({
      mainPhoto: mainPhotoSrc,
      addPhotos: addPhotosSrc,
      title,
      price,
      place,
      dateStart,
      dateEnd,
      desc,
      status
    }, _.isNil));
    res.status(200).json(newTour);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const updateTourist = async (req, res) => {
  try {
    const {
      tourId,
      touristId,
      status,
      operation
    } = req.body;
    const tourist = await getTouristService.findById(touristId);
    if (!tourist.isActive)
      res.status(500).json("\u041D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0441 \u0442\u0443\u0440\u043E\u043C, \u0442.\u043A. \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D");
    const updTour = await putTourService.updateTourist(tourId, touristId, status, operation);
    res.status(200).json(updTour);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const updateToursStatus = async () => {
  try {
    const tours = await getTourService.findByParams({ status: { $in: ["NEW", "ACTIVE", "PENDING"] } });
    let dateStart = null;
    let dateEnd = null;
    let dateNow = null;
    tours.forEach((tour) => {
      dateStart = dfns.getTime(tour.dateStart);
      dateEnd = dfns.getTime(tour.dateEnd);
      dateNow = dfns.getTime(new Date());
      switch (tour.status) {
        case "NEW":
          if (dateNow >= dateStart)
            tour.status = "CANCELED";
          break;
        case "ACTIVE":
          if (dateNow >= dateStart)
            tour.status = "PENDING";
          break;
        case "PENDING":
          if (dateNow >= dateEnd)
            tour.status = "FINISHED";
          break;
      }
      tour.save();
    });
  } catch (e) {
    console.error(e);
  }
};
const findTouristsBooks = async (req, res) => {
  try {
    const touristBooks = await getTourService.findTouristsBooks(req.params.id);
    res.status(200).json(touristBooks);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const tourController = {
  findAll,
  findById,
  findByParams,
  create,
  update,
  updateTourist,
  findTouristsBooks,
  updateToursStatus
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + ".png");
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 0.5
  },
  fileFilter
});

const cpUpload = upload.fields([{ name: "mainPhoto", maxCount: 1 }, { name: "addPhotos", maxCount: 10 }]);
const Tour = Router();
Tour.get("/", tourController.findAll);
Tour.get("/id", tourController.findById);
Tour.get("/params", tourController.findByParams);
Tour.get("/books", tourController.findTouristsBooks);
Tour.post("/", cpUpload, tourController.create);
Tour.put("/", cpUpload, tourController.update);
Tour.put("/tourist", tourController.updateTourist);
const Tour$1 = Tour;

const isAccountExist = async (req, res) => {
  try {
    const {
      email,
      phone,
      password
    } = req.query;
    const account = await getUserService.findByParams({ email, phone, password }, true);
    if (!account.isExist) {
      res.status(500).json("\u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
    } else if (!account.info.isActive) {
      res.status(500).json("\u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D");
    } else {
      res.status(200).json(account);
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const userController = {
  isAccountExist
};

const User = Router();
User.get("/check", userController.isAccountExist);
const User$1 = User;

const AppRoutes = [
  { route: "tourist", router: Tourist$1 },
  { route: "agent", router: Agent$1 },
  { route: "tour", router: Tour$1 },
  { route: "user", router: User$1 }
];
const AppRoutes$1 = AppRoutes;

connectDB();
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.options("*", cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("public"));
AppRoutes$1.forEach(({ route, router }) => {
  app.use(`/api/${route}`, router);
});
const updateBDHandler = () => {
  const nextMidnight = new Date().setHours(24, 0, 0, 0);
  const millisecondsToNextMidnight = dfns.differenceInMilliseconds(nextMidnight, new Date());
  setTimeout(() => {
    tourController.updateToursStatus();
    updateBDHandler();
  }, millisecondsToNextMidnight);
};
updateBDHandler();
const _393626 = app;

const _lazy_412251 = () => import('./renderer.mjs').then(function (n) { return n.a; });

const handlers = [
  { route: '', handler: _152570, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_412251, lazy: true, middleware: false, method: undefined },
  { route: '/api', handler: _393626, lazy: false, middleware: false, method: undefined },
  { route: '/api/**', handler: _393626, lazy: false, middleware: false, method: undefined },
  { route: '/uploads/**', handler: _393626, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_412251, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter();
  const routerOptions = createRouter$1({ routes: config.nitro.routes });
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    const referenceRoute = h.route.replace(/:\w+|\*\*/g, "_");
    const routeOptions = routerOptions.lookup(referenceRoute) || {};
    if (routeOptions.swr) {
      handler = cachedEventHandler(handler, {
        group: "nitro/routes"
      });
    }
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(h3App.nodeHandler);
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, nitroApp.h3App.nodeHandler) : new Server$1(nitroApp.h3App.nodeHandler);
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const hostname = process.env.NITRO_HOST || process.env.HOST || "0.0.0.0";
server.listen(port, hostname, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  console.log(`Listening on ${protocol}://${hostname}:${port}${useRuntimeConfig().app.baseURL}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { nodeServer as n, useRuntimeConfig as u };
//# sourceMappingURL=node-server.mjs.map
