import { v as vue_cjs_prod, s as serverRenderer, r as require$$0 } from './renderer.mjs';
import { hasProtocol, joinURL, isEqual, withBase, withQuery } from 'ufo';
import { defineStore, PiniaVuePlugin, createPinia, setActivePinia } from 'pinia/dist/pinia.mjs';
import { createNuxtPersistedState } from 'pinia-plugin-persistedstate';
import CryptoJS from 'crypto-js';
import { between, and, required, email, minLength, maxLength } from '@vuelidate/validators';
import Scrollbar from 'smooth-scrollbar';
import * as dfns from 'date-fns';
import Datepicker$1 from '@vuepic/vue-datepicker';
import { u as useRuntimeConfig$1 } from './node-server.mjs';
import 'h3';
import 'unenv/runtime/mock/proxy';
import 'stream';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'destr';
import 'ohmyfetch';
import 'radix3';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'ohash';
import 'unstorage';
import 'fs';
import 'pathe';
import 'url';
import 'express';
import 'cors';
import 'mongoose';
import 'lodash';
import 'multer';

const install = () => {
};

const Vue2 = void 0;
const isVue2 = false;

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^["{[]|^-?[0-9][0-9.]{0,14}$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor") {
    return;
  }
  return value;
}
function destr(val) {
  if (typeof val !== "string") {
    return val;
  }
  const _lval = val.toLowerCase();
  if (_lval === "true") {
    return true;
  }
  if (_lval === "false") {
    return false;
  }
  if (_lval === "null") {
    return null;
  }
  if (_lval === "nan") {
    return NaN;
  }
  if (_lval === "infinity") {
    return Infinity;
  }
  if (_lval === "undefined") {
    return void 0;
  }
  if (!JsonSigRx.test(val)) {
    return val;
  }
  try {
    if (suspectProtoRx.test(val) || suspectConstructorRx.test(val)) {
      return JSON.parse(val, jsonParseTransform);
    }
    return JSON.parse(val);
  } catch (_e) {
    return val;
  }
}
class FetchError extends Error {
  constructor() {
    super(...arguments);
    this.name = "FetchError";
  }
}
function createFetchError(request, error, response) {
  let message = "";
  if (request && response) {
    message = `${response.status} ${response.statusText} (${request.toString()})`;
  }
  if (error) {
    message = `${error.message} (${message})`;
  }
  const fetchError = new FetchError(message);
  Object.defineProperty(fetchError, "request", { get() {
    return request;
  } });
  Object.defineProperty(fetchError, "response", { get() {
    return response;
  } });
  Object.defineProperty(fetchError, "data", { get() {
    return response && response._data;
  } });
  return fetchError;
}
const payloadMethods = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(val) {
  if (val === void 0) {
    return false;
  }
  const t = typeof val;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(val)) {
    return true;
  }
  return val.constructor && val.constructor.name === "Object" || typeof val.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*`\-.^~]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift();
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  409,
  425,
  429,
  500,
  502,
  503,
  504
]);
function createFetch(globalOptions) {
  const { fetch: fetch2, Headers: Headers2 } = globalOptions;
  function onError(ctx) {
    if (ctx.options.retry !== false) {
      const retries = typeof ctx.options.retry === "number" ? ctx.options.retry : isPayloadMethod(ctx.options.method) ? 0 : 1;
      const responseCode = ctx.response && ctx.response.status || 500;
      if (retries > 0 && retryStatusCodes.has(responseCode)) {
        return $fetchRaw(ctx.request, __spreadProps(__spreadValues({}, ctx.options), {
          retry: retries - 1
        }));
      }
    }
    const err = createFetchError(ctx.request, ctx.error, ctx.response);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, $fetchRaw);
    }
    throw err;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _opts = {}) {
    const ctx = {
      request: _request,
      options: __spreadValues(__spreadValues({}, globalOptions.defaults), _opts),
      response: void 0,
      error: void 0
    };
    if (ctx.options.onRequest) {
      await ctx.options.onRequest(ctx);
    }
    if (typeof ctx.request === "string") {
      if (ctx.options.baseURL) {
        ctx.request = withBase(ctx.request, ctx.options.baseURL);
      }
      if (ctx.options.params) {
        ctx.request = withQuery(ctx.request, ctx.options.params);
      }
      if (ctx.options.body && isPayloadMethod(ctx.options.method)) {
        if (isJSONSerializable(ctx.options.body)) {
          ctx.options.body = typeof ctx.options.body === "string" ? ctx.options.body : JSON.stringify(ctx.options.body);
          ctx.options.headers = new Headers2(ctx.options.headers);
          if (!ctx.options.headers.has("content-type")) {
            ctx.options.headers.set("content-type", "application/json");
          }
          if (!ctx.options.headers.has("accept")) {
            ctx.options.headers.set("accept", "application/json");
          }
        }
      }
    }
    ctx.response = await fetch2(ctx.request, ctx.options).catch(async (error) => {
      ctx.error = error;
      if (ctx.options.onRequestError) {
        await ctx.options.onRequestError(ctx);
      }
      return onError(ctx);
    });
    const responseType = (ctx.options.parseResponse ? "json" : ctx.options.responseType) || detectResponseType(ctx.response.headers.get("content-type") || "");
    if (responseType === "json") {
      const data = await ctx.response.text();
      const parseFn = ctx.options.parseResponse || destr;
      ctx.response._data = parseFn(data);
    } else {
      ctx.response._data = await ctx.response[responseType]();
    }
    if (ctx.options.onResponse) {
      await ctx.options.onResponse(ctx);
    }
    if (!ctx.response.ok) {
      if (ctx.options.onResponseError) {
        await ctx.options.onResponseError(ctx);
      }
    }
    return ctx.response.ok ? ctx.response : onError(ctx);
  };
  const $fetch2 = function $fetch22(request, opts) {
    return $fetchRaw(request, opts).then((r) => r._data);
  };
  $fetch2.raw = $fetchRaw;
  $fetch2.create = (defaultOptions = {}) => createFetch(__spreadProps(__spreadValues({}, globalOptions), {
    defaults: __spreadValues(__spreadValues({}, globalOptions.defaults), defaultOptions)
  }));
  return $fetch2;
}
const _globalThis$2 = function() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
}();
const fetch = _globalThis$2.fetch || (() => Promise.reject(new Error("[ohmyfetch] global.fetch is not supported!")));
const Headers = _globalThis$2.Headers;
const $fetch$1 = createFetch({ fetch, Headers });
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const buildAssetsDir = () => appConfig.buildAssetsDir;
const buildAssetsURL = (...path) => joinURL(publicAssetsURL(), buildAssetsDir(), ...path);
const publicAssetsURL = (...path) => {
  const publicBase = appConfig.cdnURL || appConfig.baseURL;
  return path.length ? joinURL(publicBase, ...path) : publicBase;
};
function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
function serialCaller(hooks, args) {
  return hooks.reduce((promise, hookFn) => promise.then(() => hookFn.apply(void 0, args)), Promise.resolve(null));
}
function parallelCaller(hooks, args) {
  return Promise.all(hooks.map((hook) => hook.apply(void 0, args)));
}
class Hookable {
  constructor() {
    this._hooks = {};
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, fn) {
    if (!name || typeof fn !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let deprecatedHookObj;
    while (this._deprecatedHooks[name]) {
      const deprecatedHook = this._deprecatedHooks[name];
      if (typeof deprecatedHook === "string") {
        deprecatedHookObj = { to: deprecatedHook };
      } else {
        deprecatedHookObj = deprecatedHook;
      }
      name = deprecatedHookObj.to;
    }
    if (deprecatedHookObj) {
      if (!deprecatedHookObj.message) {
        console.warn(`${originalName} hook has been deprecated` + (deprecatedHookObj.to ? `, please use ${deprecatedHookObj.to}` : ""));
      } else {
        console.warn(deprecatedHookObj.message);
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(fn);
    return () => {
      if (fn) {
        this.removeHook(name, fn);
        fn = null;
      }
    };
  }
  hookOnce(name, fn) {
    let _unreg;
    let _fn = (...args) => {
      _unreg();
      _unreg = null;
      _fn = null;
      return fn(...args);
    };
    _unreg = this.hook(name, _fn);
    return _unreg;
  }
  removeHook(name, fn) {
    if (this._hooks[name]) {
      const idx = this._hooks[name].indexOf(fn);
      if (idx !== -1) {
        this._hooks[name].splice(idx, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = deprecated;
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
    return () => {
      removeFns.splice(0, removeFns.length).forEach((unreg) => unreg());
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  callHook(name, ...args) {
    return serialCaller(this._hooks[name] || [], args);
  }
  callHookParallel(name, ...args) {
    return parallelCaller(this._hooks[name] || [], args);
  }
  callHookWith(caller, name, ...args) {
    return caller(this._hooks[name] || [], args);
  }
}
function createHooks() {
  return new Hookable();
}
function createContext() {
  let currentInstance = null;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  return {
    use: () => currentInstance,
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = null;
      isSingleton = false;
    },
    call: (instance, cb) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return cb();
      } finally {
        if (!isSingleton) {
          currentInstance = null;
        }
      }
    },
    async callAsync(instance, cb) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = cb();
        if (!isSingleton) {
          currentInstance = null;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace() {
  const contexts = {};
  return {
    get(key) {
      if (!contexts[key]) {
        contexts[key] = createContext();
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis$1[globalKey] || (_globalThis$1[globalKey] = createNamespace());
const getContext = (key) => defaultNamespace.get(key);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis$1[asyncHandlersKey] || (_globalThis$1[asyncHandlersKey] = /* @__PURE__ */ new Set());
function createMock(name, overrides = {}) {
  const fn = function() {
  };
  fn.prototype.name = name;
  const props = {};
  return new Proxy(fn, {
    get(_target, prop) {
      if (prop === "caller") {
        return null;
      }
      if (prop === "__createMock__") {
        return createMock;
      }
      if (prop in overrides) {
        return overrides[prop];
      }
      return props[prop] = props[prop] || createMock(`${name}.${prop.toString()}`);
    },
    apply(_target, _this, _args) {
      return createMock(`${name}()`);
    },
    construct(_target, _args, _newT) {
      return createMock(`[${name}]`);
    },
    enumerate(_target) {
      return [];
    }
  });
}
const mockContext = createMock("mock");
function mock(warning) {
  console.warn(warning);
  return mockContext;
}
const unsupported = /* @__PURE__ */ new Set([
  "store",
  "spa",
  "fetchCounters"
]);
const todo = /* @__PURE__ */ new Set([
  "isHMR",
  "base",
  "payload",
  "from",
  "next",
  "error",
  "redirect",
  "redirected",
  "enablePreview",
  "$preview",
  "beforeNuxtRender",
  "beforeSerialize"
]);
const routerKeys = ["route", "params", "query"];
const staticFlags = {
  isClient: false,
  isServer: true,
  isDev: false,
  isStatic: void 0,
  target: "server",
  modern: false
};
const legacyPlugin = (nuxtApp) => {
  nuxtApp._legacyContext = new Proxy(nuxtApp, {
    get(nuxt, p) {
      if (unsupported.has(p)) {
        return mock(`Accessing ${p} is not supported in Nuxt 3.`);
      }
      if (todo.has(p)) {
        return mock(`Accessing ${p} is not yet supported in Nuxt 3.`);
      }
      if (routerKeys.includes(p)) {
        if (!("$router" in nuxtApp)) {
          return mock("vue-router is not being used in this project.");
        }
        switch (p) {
          case "route":
            return nuxt.$router.currentRoute.value;
          case "params":
          case "query":
            return nuxt.$router.currentRoute.value[p];
        }
      }
      if (p === "$config" || p === "env") {
        return useRuntimeConfig();
      }
      if (p in staticFlags) {
        return staticFlags[p];
      }
      if (p === "ssrContext") {
        return nuxt._legacyContext;
      }
      if (nuxt.ssrContext && p in nuxt.ssrContext) {
        return nuxt.ssrContext[p];
      }
      if (p === "nuxt") {
        return nuxt.payload;
      }
      if (p === "nuxtState") {
        return nuxt.payload.data;
      }
      if (p in nuxtApp.vueApp) {
        return nuxtApp.vueApp[p];
      }
      if (p in nuxtApp) {
        return nuxtApp[p];
      }
      return mock(`Accessing ${p} is not supported in Nuxt3.`);
    }
  });
};
const nuxtAppCtx = getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  const nuxtApp = __spreadValues({
    provide: void 0,
    globalName: "nuxt",
    payload: vue_cjs_prod.reactive(__spreadValues({
      data: {},
      state: {},
      _errors: {}
    }, { serverRendered: true })),
    isHydrating: false,
    _asyncDataPromises: {}
  }, options);
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  if (nuxtApp.ssrContext) {
    nuxtApp.ssrContext.nuxt = nuxtApp;
  }
  {
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    nuxtApp.ssrContext.payload = nuxtApp.payload;
  }
  {
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      var _a;
      if (prop === "public") {
        return target.public;
      }
      return (_a = target[prop]) != null ? _a : target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  let needsLegacyContext = false;
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return () => {
      };
    }
    if (isLegacyPlugin(plugin)) {
      needsLegacyContext = true;
      return (nuxtApp) => plugin(nuxtApp._legacyContext, nuxtApp.provide);
    }
    return plugin;
  });
  if (needsLegacyContext) {
    plugins2.unshift(legacyPlugin);
  }
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function isLegacyPlugin(plugin) {
  return !plugin[NuxtPluginIndicator];
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const vm = vue_cjs_prod.getCurrentInstance();
  if (!vm) {
    const nuxtAppInstance = nuxtAppCtx.use();
    if (!nuxtAppInstance) {
      throw new Error("nuxt instance unavailable");
    }
    return nuxtAppInstance;
  }
  return vm.appContext.app.$nuxt;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var vueRouter_cjs_prod = {};
/*!
  * vue-router v4.0.16
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var vue = require$$0;
  const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
  const PolySymbol = (name) => hasSymbol ? Symbol(name) : "_vr_" + name;
  const matchedRouteKey = /* @__PURE__ */ PolySymbol("rvlm");
  const viewDepthKey = /* @__PURE__ */ PolySymbol("rvd");
  const routerKey = /* @__PURE__ */ PolySymbol("r");
  const routeLocationKey = /* @__PURE__ */ PolySymbol("rl");
  const routerViewLocationKey = /* @__PURE__ */ PolySymbol("rvl");
  function isESModule(obj) {
    return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === "Module";
  }
  const assign = Object.assign;
  function applyToParams(fn, params) {
    const newParams = {};
    for (const key in params) {
      const value = params[key];
      newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
    }
    return newParams;
  }
  const noop = () => {
  };
  const TRAILING_SLASH_RE = /\/$/;
  const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
  function parseURL(parseQuery2, location2, currentLocation = "/") {
    let path, query = {}, searchString = "", hash2 = "";
    const searchPos = location2.indexOf("?");
    const hashPos = location2.indexOf("#", searchPos > -1 ? searchPos : 0);
    if (searchPos > -1) {
      path = location2.slice(0, searchPos);
      searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
      query = parseQuery2(searchString);
    }
    if (hashPos > -1) {
      path = path || location2.slice(0, hashPos);
      hash2 = location2.slice(hashPos, location2.length);
    }
    path = resolveRelativePath(path != null ? path : location2, currentLocation);
    return {
      fullPath: path + (searchString && "?") + searchString + hash2,
      path,
      query,
      hash: hash2
    };
  }
  function stringifyURL(stringifyQuery2, location2) {
    const query = location2.query ? stringifyQuery2(location2.query) : "";
    return location2.path + (query && "?") + query + (location2.hash || "");
  }
  function stripBase(pathname, base) {
    if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
      return pathname;
    return pathname.slice(base.length) || "/";
  }
  function isSameRouteLocation(stringifyQuery2, a, b) {
    const aLastIndex = a.matched.length - 1;
    const bLastIndex = b.matched.length - 1;
    return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
  }
  function isSameRouteRecord(a, b) {
    return (a.aliasOf || a) === (b.aliasOf || b);
  }
  function isSameRouteLocationParams(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length)
      return false;
    for (const key in a) {
      if (!isSameRouteLocationParamsValue(a[key], b[key]))
        return false;
    }
    return true;
  }
  function isSameRouteLocationParamsValue(a, b) {
    return Array.isArray(a) ? isEquivalentArray(a, b) : Array.isArray(b) ? isEquivalentArray(b, a) : a === b;
  }
  function isEquivalentArray(a, b) {
    return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
  }
  function resolveRelativePath(to, from) {
    if (to.startsWith("/"))
      return to;
    if (!to)
      return from;
    const fromSegments = from.split("/");
    const toSegments = to.split("/");
    let position = fromSegments.length - 1;
    let toPosition;
    let segment;
    for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
      segment = toSegments[toPosition];
      if (position === 1 || segment === ".")
        continue;
      if (segment === "..")
        position--;
      else
        break;
    }
    return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
  }
  var NavigationType;
  (function(NavigationType2) {
    NavigationType2["pop"] = "pop";
    NavigationType2["push"] = "push";
  })(NavigationType || (NavigationType = {}));
  var NavigationDirection;
  (function(NavigationDirection2) {
    NavigationDirection2["back"] = "back";
    NavigationDirection2["forward"] = "forward";
    NavigationDirection2["unknown"] = "";
  })(NavigationDirection || (NavigationDirection = {}));
  const START = "";
  function normalizeBase(base) {
    if (!base) {
      {
        base = "/";
      }
    }
    if (base[0] !== "/" && base[0] !== "#")
      base = "/" + base;
    return removeTrailingSlash(base);
  }
  const BEFORE_HASH_RE = /^[^#]+#/;
  function createHref(base, location2) {
    return base.replace(BEFORE_HASH_RE, "#") + location2;
  }
  const computeScrollPosition = () => ({
    left: window.pageXOffset,
    top: window.pageYOffset
  });
  let createBaseLocation = () => location.protocol + "//" + location.host;
  function createCurrentLocation(base, location2) {
    const { pathname, search, hash: hash2 } = location2;
    const hashPos = base.indexOf("#");
    if (hashPos > -1) {
      let slicePos = hash2.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
      let pathFromHash = hash2.slice(slicePos);
      if (pathFromHash[0] !== "/")
        pathFromHash = "/" + pathFromHash;
      return stripBase(pathFromHash, "");
    }
    const path = stripBase(pathname, base);
    return path + search + hash2;
  }
  function useHistoryListeners(base, historyState, currentLocation, replace) {
    let listeners = [];
    let teardowns = [];
    let pauseState = null;
    const popStateHandler = ({ state }) => {
      const to = createCurrentLocation(base, location);
      const from = currentLocation.value;
      const fromState = historyState.value;
      let delta = 0;
      if (state) {
        currentLocation.value = to;
        historyState.value = state;
        if (pauseState && pauseState === from) {
          pauseState = null;
          return;
        }
        delta = fromState ? state.position - fromState.position : 0;
      } else {
        replace(to);
      }
      listeners.forEach((listener) => {
        listener(currentLocation.value, from, {
          delta,
          type: NavigationType.pop,
          direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
        });
      });
    };
    function pauseListeners() {
      pauseState = currentLocation.value;
    }
    function listen(callback) {
      listeners.push(callback);
      const teardown = () => {
        const index2 = listeners.indexOf(callback);
        if (index2 > -1)
          listeners.splice(index2, 1);
      };
      teardowns.push(teardown);
      return teardown;
    }
    function beforeUnloadListener() {
      const { history: history2 } = window;
      if (!history2.state)
        return;
      history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
    }
    function destroy() {
      for (const teardown of teardowns)
        teardown();
      teardowns = [];
      window.removeEventListener("popstate", popStateHandler);
      window.removeEventListener("beforeunload", beforeUnloadListener);
    }
    window.addEventListener("popstate", popStateHandler);
    window.addEventListener("beforeunload", beforeUnloadListener);
    return {
      pauseListeners,
      listen,
      destroy
    };
  }
  function buildState(back, current, forward, replaced = false, computeScroll = false) {
    return {
      back,
      current,
      forward,
      replaced,
      position: window.history.length,
      scroll: computeScroll ? computeScrollPosition() : null
    };
  }
  function useHistoryStateNavigation(base) {
    const { history: history2, location: location2 } = window;
    const currentLocation = {
      value: createCurrentLocation(base, location2)
    };
    const historyState = { value: history2.state };
    if (!historyState.value) {
      changeLocation(currentLocation.value, {
        back: null,
        current: currentLocation.value,
        forward: null,
        position: history2.length - 1,
        replaced: true,
        scroll: null
      }, true);
    }
    function changeLocation(to, state, replace2) {
      const hashIndex = base.indexOf("#");
      const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
      try {
        history2[replace2 ? "replaceState" : "pushState"](state, "", url);
        historyState.value = state;
      } catch (err) {
        {
          console.error(err);
        }
        location2[replace2 ? "replace" : "assign"](url);
      }
    }
    function replace(to, data) {
      const state = assign({}, history2.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, { position: historyState.value.position });
      changeLocation(to, state, true);
      currentLocation.value = to;
    }
    function push(to, data) {
      const currentState = assign({}, historyState.value, history2.state, {
        forward: to,
        scroll: computeScrollPosition()
      });
      changeLocation(currentState.current, currentState, true);
      const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
      changeLocation(to, state, false);
      currentLocation.value = to;
    }
    return {
      location: currentLocation,
      state: historyState,
      push,
      replace
    };
  }
  function createWebHistory(base) {
    base = normalizeBase(base);
    const historyNavigation = useHistoryStateNavigation(base);
    const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
    function go(delta, triggerListeners = true) {
      if (!triggerListeners)
        historyListeners.pauseListeners();
      history.go(delta);
    }
    const routerHistory = assign({
      location: "",
      base,
      go,
      createHref: createHref.bind(null, base)
    }, historyNavigation, historyListeners);
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => historyNavigation.location.value
    });
    Object.defineProperty(routerHistory, "state", {
      enumerable: true,
      get: () => historyNavigation.state.value
    });
    return routerHistory;
  }
  function createMemoryHistory(base = "") {
    let listeners = [];
    let queue = [START];
    let position = 0;
    base = normalizeBase(base);
    function setLocation(location2) {
      position++;
      if (position === queue.length) {
        queue.push(location2);
      } else {
        queue.splice(position);
        queue.push(location2);
      }
    }
    function triggerListeners(to, from, { direction, delta }) {
      const info = {
        direction,
        delta,
        type: NavigationType.pop
      };
      for (const callback of listeners) {
        callback(to, from, info);
      }
    }
    const routerHistory = {
      location: START,
      state: {},
      base,
      createHref: createHref.bind(null, base),
      replace(to) {
        queue.splice(position--, 1);
        setLocation(to);
      },
      push(to, data) {
        setLocation(to);
      },
      listen(callback) {
        listeners.push(callback);
        return () => {
          const index2 = listeners.indexOf(callback);
          if (index2 > -1)
            listeners.splice(index2, 1);
        };
      },
      destroy() {
        listeners = [];
        queue = [START];
        position = 0;
      },
      go(delta, shouldTrigger = true) {
        const from = this.location;
        const direction = delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
        position = Math.max(0, Math.min(position + delta, queue.length - 1));
        if (shouldTrigger) {
          triggerListeners(this.location, from, {
            direction,
            delta
          });
        }
      }
    };
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => queue[position]
    });
    return routerHistory;
  }
  function createWebHashHistory(base) {
    base = location.host ? base || location.pathname + location.search : "";
    if (!base.includes("#"))
      base += "#";
    return createWebHistory(base);
  }
  function isRouteLocation(route) {
    return typeof route === "string" || route && typeof route === "object";
  }
  function isRouteName(name) {
    return typeof name === "string" || typeof name === "symbol";
  }
  const START_LOCATION_NORMALIZED = {
    path: "/",
    name: void 0,
    params: {},
    query: {},
    hash: "",
    fullPath: "/",
    matched: [],
    meta: {},
    redirectedFrom: void 0
  };
  const NavigationFailureSymbol = /* @__PURE__ */ PolySymbol("nf");
  exports.NavigationFailureType = void 0;
  (function(NavigationFailureType) {
    NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
    NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
    NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
  })(exports.NavigationFailureType || (exports.NavigationFailureType = {}));
  const ErrorTypeMessages = {
    [1]({ location: location2, currentLocation }) {
      return `No match for
 ${JSON.stringify(location2)}${currentLocation ? "\nwhile being at\n" + JSON.stringify(currentLocation) : ""}`;
    },
    [2]({ from, to }) {
      return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
    },
    [4]({ from, to }) {
      return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
    },
    [8]({ from, to }) {
      return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
    },
    [16]({ from, to }) {
      return `Avoided redundant navigation to current location: "${from.fullPath}".`;
    }
  };
  function createRouterError(type, params) {
    {
      return assign(new Error(ErrorTypeMessages[type](params)), {
        type,
        [NavigationFailureSymbol]: true
      }, params);
    }
  }
  function isNavigationFailure(error, type) {
    return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
  }
  const propertiesToLog = ["params", "query", "hash"];
  function stringifyRoute(to) {
    if (typeof to === "string")
      return to;
    if ("path" in to)
      return to.path;
    const location2 = {};
    for (const key of propertiesToLog) {
      if (key in to)
        location2[key] = to[key];
    }
    return JSON.stringify(location2, null, 2);
  }
  const BASE_PARAM_PATTERN = "[^/]+?";
  const BASE_PATH_PARSER_OPTIONS = {
    sensitive: false,
    strict: false,
    start: true,
    end: true
  };
  const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
  function tokensToParser(segments, extraOptions) {
    const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
    const score = [];
    let pattern = options.start ? "^" : "";
    const keys = [];
    for (const segment of segments) {
      const segmentScores = segment.length ? [] : [90];
      if (options.strict && !segment.length)
        pattern += "/";
      for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
        const token = segment[tokenIndex];
        let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
        if (token.type === 0) {
          if (!tokenIndex)
            pattern += "/";
          pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
          subSegmentScore += 40;
        } else if (token.type === 1) {
          const { value, repeatable, optional, regexp } = token;
          keys.push({
            name: value,
            repeatable,
            optional
          });
          const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
          if (re2 !== BASE_PARAM_PATTERN) {
            subSegmentScore += 10;
            try {
              new RegExp(`(${re2})`);
            } catch (err) {
              throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
            }
          }
          let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
          if (!tokenIndex)
            subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
          if (optional)
            subPattern += "?";
          pattern += subPattern;
          subSegmentScore += 20;
          if (optional)
            subSegmentScore += -8;
          if (repeatable)
            subSegmentScore += -20;
          if (re2 === ".*")
            subSegmentScore += -50;
        }
        segmentScores.push(subSegmentScore);
      }
      score.push(segmentScores);
    }
    if (options.strict && options.end) {
      const i = score.length - 1;
      score[i][score[i].length - 1] += 0.7000000000000001;
    }
    if (!options.strict)
      pattern += "/?";
    if (options.end)
      pattern += "$";
    else if (options.strict)
      pattern += "(?:/|$)";
    const re = new RegExp(pattern, options.sensitive ? "" : "i");
    function parse2(path) {
      const match = path.match(re);
      const params = {};
      if (!match)
        return null;
      for (let i = 1; i < match.length; i++) {
        const value = match[i] || "";
        const key = keys[i - 1];
        params[key.name] = value && key.repeatable ? value.split("/") : value;
      }
      return params;
    }
    function stringify(params) {
      let path = "";
      let avoidDuplicatedSlash = false;
      for (const segment of segments) {
        if (!avoidDuplicatedSlash || !path.endsWith("/"))
          path += "/";
        avoidDuplicatedSlash = false;
        for (const token of segment) {
          if (token.type === 0) {
            path += token.value;
          } else if (token.type === 1) {
            const { value, repeatable, optional } = token;
            const param = value in params ? params[value] : "";
            if (Array.isArray(param) && !repeatable)
              throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
            const text2 = Array.isArray(param) ? param.join("/") : param;
            if (!text2) {
              if (optional) {
                if (segment.length < 2 && segments.length > 1) {
                  if (path.endsWith("/"))
                    path = path.slice(0, -1);
                  else
                    avoidDuplicatedSlash = true;
                }
              } else
                throw new Error(`Missing required param "${value}"`);
            }
            path += text2;
          }
        }
      }
      return path;
    }
    return {
      re,
      score,
      keys,
      parse: parse2,
      stringify
    };
  }
  function compareScoreArray(a, b) {
    let i = 0;
    while (i < a.length && i < b.length) {
      const diff = b[i] - a[i];
      if (diff)
        return diff;
      i++;
    }
    if (a.length < b.length) {
      return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
    } else if (a.length > b.length) {
      return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
    }
    return 0;
  }
  function comparePathParserScore(a, b) {
    let i = 0;
    const aScore = a.score;
    const bScore = b.score;
    while (i < aScore.length && i < bScore.length) {
      const comp = compareScoreArray(aScore[i], bScore[i]);
      if (comp)
        return comp;
      i++;
    }
    if (Math.abs(bScore.length - aScore.length) === 1) {
      if (isLastScoreNegative(aScore))
        return 1;
      if (isLastScoreNegative(bScore))
        return -1;
    }
    return bScore.length - aScore.length;
  }
  function isLastScoreNegative(score) {
    const last = score[score.length - 1];
    return score.length > 0 && last[last.length - 1] < 0;
  }
  const ROOT_TOKEN = {
    type: 0,
    value: ""
  };
  const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
  function tokenizePath(path) {
    if (!path)
      return [[]];
    if (path === "/")
      return [[ROOT_TOKEN]];
    if (!path.startsWith("/")) {
      throw new Error(`Invalid path "${path}"`);
    }
    function crash(message) {
      throw new Error(`ERR (${state})/"${buffer}": ${message}`);
    }
    let state = 0;
    let previousState = state;
    const tokens = [];
    let segment;
    function finalizeSegment() {
      if (segment)
        tokens.push(segment);
      segment = [];
    }
    let i = 0;
    let char;
    let buffer = "";
    let customRe = "";
    function consumeBuffer() {
      if (!buffer)
        return;
      if (state === 0) {
        segment.push({
          type: 0,
          value: buffer
        });
      } else if (state === 1 || state === 2 || state === 3) {
        if (segment.length > 1 && (char === "*" || char === "+"))
          crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
        segment.push({
          type: 1,
          value: buffer,
          regexp: customRe,
          repeatable: char === "*" || char === "+",
          optional: char === "*" || char === "?"
        });
      } else {
        crash("Invalid state to consume buffer");
      }
      buffer = "";
    }
    function addCharToBuffer() {
      buffer += char;
    }
    while (i < path.length) {
      char = path[i++];
      if (char === "\\" && state !== 2) {
        previousState = state;
        state = 4;
        continue;
      }
      switch (state) {
        case 0:
          if (char === "/") {
            if (buffer) {
              consumeBuffer();
            }
            finalizeSegment();
          } else if (char === ":") {
            consumeBuffer();
            state = 1;
          } else {
            addCharToBuffer();
          }
          break;
        case 4:
          addCharToBuffer();
          state = previousState;
          break;
        case 1:
          if (char === "(") {
            state = 2;
          } else if (VALID_PARAM_RE.test(char)) {
            addCharToBuffer();
          } else {
            consumeBuffer();
            state = 0;
            if (char !== "*" && char !== "?" && char !== "+")
              i--;
          }
          break;
        case 2:
          if (char === ")") {
            if (customRe[customRe.length - 1] == "\\")
              customRe = customRe.slice(0, -1) + char;
            else
              state = 3;
          } else {
            customRe += char;
          }
          break;
        case 3:
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
          customRe = "";
          break;
        default:
          crash("Unknown state");
          break;
      }
    }
    if (state === 2)
      crash(`Unfinished custom RegExp for param "${buffer}"`);
    consumeBuffer();
    finalizeSegment();
    return tokens;
  }
  function createRouteRecordMatcher(record, parent2, options) {
    const parser = tokensToParser(tokenizePath(record.path), options);
    const matcher = assign(parser, {
      record,
      parent: parent2,
      children: [],
      alias: []
    });
    if (parent2) {
      if (!matcher.record.aliasOf === !parent2.record.aliasOf)
        parent2.children.push(matcher);
    }
    return matcher;
  }
  function createRouterMatcher(routes2, globalOptions) {
    const matchers = [];
    const matcherMap = /* @__PURE__ */ new Map();
    globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
    function getRecordMatcher(name) {
      return matcherMap.get(name);
    }
    function addRoute(record, parent2, originalRecord) {
      const isRootAdd = !originalRecord;
      const mainNormalizedRecord = normalizeRouteRecord(record);
      mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
      const options = mergeOptions(globalOptions, record);
      const normalizedRecords = [
        mainNormalizedRecord
      ];
      if ("alias" in record) {
        const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
        for (const alias of aliases) {
          normalizedRecords.push(assign({}, mainNormalizedRecord, {
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
          }));
        }
      }
      let matcher;
      let originalMatcher;
      for (const normalizedRecord of normalizedRecords) {
        const { path } = normalizedRecord;
        if (parent2 && path[0] !== "/") {
          const parentPath = parent2.record.path;
          const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
          normalizedRecord.path = parent2.record.path + (path && connectingSlash + path);
        }
        matcher = createRouteRecordMatcher(normalizedRecord, parent2, options);
        if (originalRecord) {
          originalRecord.alias.push(matcher);
        } else {
          originalMatcher = originalMatcher || matcher;
          if (originalMatcher !== matcher)
            originalMatcher.alias.push(matcher);
          if (isRootAdd && record.name && !isAliasRecord(matcher))
            removeRoute(record.name);
        }
        if ("children" in mainNormalizedRecord) {
          const children2 = mainNormalizedRecord.children;
          for (let i = 0; i < children2.length; i++) {
            addRoute(children2[i], matcher, originalRecord && originalRecord.children[i]);
          }
        }
        originalRecord = originalRecord || matcher;
        insertMatcher(matcher);
      }
      return originalMatcher ? () => {
        removeRoute(originalMatcher);
      } : noop;
    }
    function removeRoute(matcherRef) {
      if (isRouteName(matcherRef)) {
        const matcher = matcherMap.get(matcherRef);
        if (matcher) {
          matcherMap.delete(matcherRef);
          matchers.splice(matchers.indexOf(matcher), 1);
          matcher.children.forEach(removeRoute);
          matcher.alias.forEach(removeRoute);
        }
      } else {
        const index2 = matchers.indexOf(matcherRef);
        if (index2 > -1) {
          matchers.splice(index2, 1);
          if (matcherRef.record.name)
            matcherMap.delete(matcherRef.record.name);
          matcherRef.children.forEach(removeRoute);
          matcherRef.alias.forEach(removeRoute);
        }
      }
    }
    function getRoutes() {
      return matchers;
    }
    function insertMatcher(matcher) {
      let i = 0;
      while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && (matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i])))
        i++;
      matchers.splice(i, 0, matcher);
      if (matcher.record.name && !isAliasRecord(matcher))
        matcherMap.set(matcher.record.name, matcher);
    }
    function resolve(location2, currentLocation) {
      let matcher;
      let params = {};
      let path;
      let name;
      if ("name" in location2 && location2.name) {
        matcher = matcherMap.get(location2.name);
        if (!matcher)
          throw createRouterError(1, {
            location: location2
          });
        name = matcher.record.name;
        params = assign(paramsFromLocation(currentLocation.params, matcher.keys.filter((k) => !k.optional).map((k) => k.name)), location2.params);
        path = matcher.stringify(params);
      } else if ("path" in location2) {
        path = location2.path;
        matcher = matchers.find((m) => m.re.test(path));
        if (matcher) {
          params = matcher.parse(path);
          name = matcher.record.name;
        }
      } else {
        matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
        if (!matcher)
          throw createRouterError(1, {
            location: location2,
            currentLocation
          });
        name = matcher.record.name;
        params = assign({}, currentLocation.params, location2.params);
        path = matcher.stringify(params);
      }
      const matched = [];
      let parentMatcher = matcher;
      while (parentMatcher) {
        matched.unshift(parentMatcher.record);
        parentMatcher = parentMatcher.parent;
      }
      return {
        name,
        path,
        params,
        matched,
        meta: mergeMetaFields(matched)
      };
    }
    routes2.forEach((route) => addRoute(route));
    return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
  }
  function paramsFromLocation(params, keys) {
    const newParams = {};
    for (const key of keys) {
      if (key in params)
        newParams[key] = params[key];
    }
    return newParams;
  }
  function normalizeRouteRecord(record) {
    return {
      path: record.path,
      redirect: record.redirect,
      name: record.name,
      meta: record.meta || {},
      aliasOf: void 0,
      beforeEnter: record.beforeEnter,
      props: normalizeRecordProps(record),
      children: record.children || [],
      instances: {},
      leaveGuards: /* @__PURE__ */ new Set(),
      updateGuards: /* @__PURE__ */ new Set(),
      enterCallbacks: {},
      components: "components" in record ? record.components || {} : { default: record.component }
    };
  }
  function normalizeRecordProps(record) {
    const propsObject = {};
    const props = record.props || false;
    if ("component" in record) {
      propsObject.default = props;
    } else {
      for (const name in record.components)
        propsObject[name] = typeof props === "boolean" ? props : props[name];
    }
    return propsObject;
  }
  function isAliasRecord(record) {
    while (record) {
      if (record.record.aliasOf)
        return true;
      record = record.parent;
    }
    return false;
  }
  function mergeMetaFields(matched) {
    return matched.reduce((meta2, record) => assign(meta2, record.meta), {});
  }
  function mergeOptions(defaults2, partialOptions) {
    const options = {};
    for (const key in defaults2) {
      options[key] = key in partialOptions ? partialOptions[key] : defaults2[key];
    }
    return options;
  }
  function isRecordChildOf(record, parent2) {
    return parent2.children.some((child) => child === record || isRecordChildOf(record, child));
  }
  const HASH_RE = /#/g;
  const AMPERSAND_RE = /&/g;
  const SLASH_RE = /\//g;
  const EQUAL_RE = /=/g;
  const IM_RE = /\?/g;
  const PLUS_RE = /\+/g;
  const ENC_BRACKET_OPEN_RE = /%5B/g;
  const ENC_BRACKET_CLOSE_RE = /%5D/g;
  const ENC_CARET_RE = /%5E/g;
  const ENC_BACKTICK_RE = /%60/g;
  const ENC_CURLY_OPEN_RE = /%7B/g;
  const ENC_PIPE_RE = /%7C/g;
  const ENC_CURLY_CLOSE_RE = /%7D/g;
  const ENC_SPACE_RE = /%20/g;
  function commonEncode(text2) {
    return encodeURI("" + text2).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
  }
  function encodeHash(text2) {
    return commonEncode(text2).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
  }
  function encodeQueryValue(text2) {
    return commonEncode(text2).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
  }
  function encodeQueryKey(text2) {
    return encodeQueryValue(text2).replace(EQUAL_RE, "%3D");
  }
  function encodePath(text2) {
    return commonEncode(text2).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
  }
  function encodeParam(text2) {
    return text2 == null ? "" : encodePath(text2).replace(SLASH_RE, "%2F");
  }
  function decode2(text2) {
    try {
      return decodeURIComponent("" + text2);
    } catch (err) {
    }
    return "" + text2;
  }
  function parseQuery(search) {
    const query = {};
    if (search === "" || search === "?")
      return query;
    const hasLeadingIM = search[0] === "?";
    const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
    for (let i = 0; i < searchParams.length; ++i) {
      const searchParam = searchParams[i].replace(PLUS_RE, " ");
      const eqPos = searchParam.indexOf("=");
      const key = decode2(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
      const value = eqPos < 0 ? null : decode2(searchParam.slice(eqPos + 1));
      if (key in query) {
        let currentValue = query[key];
        if (!Array.isArray(currentValue)) {
          currentValue = query[key] = [currentValue];
        }
        currentValue.push(value);
      } else {
        query[key] = value;
      }
    }
    return query;
  }
  function stringifyQuery(query) {
    let search = "";
    for (let key in query) {
      const value = query[key];
      key = encodeQueryKey(key);
      if (value == null) {
        if (value !== void 0) {
          search += (search.length ? "&" : "") + key;
        }
        continue;
      }
      const values = Array.isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
      values.forEach((value2) => {
        if (value2 !== void 0) {
          search += (search.length ? "&" : "") + key;
          if (value2 != null)
            search += "=" + value2;
        }
      });
    }
    return search;
  }
  function normalizeQuery(query) {
    const normalizedQuery = {};
    for (const key in query) {
      const value = query[key];
      if (value !== void 0) {
        normalizedQuery[key] = Array.isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
      }
    }
    return normalizedQuery;
  }
  function useCallbacks() {
    let handlers = [];
    function add(handler) {
      handlers.push(handler);
      return () => {
        const i = handlers.indexOf(handler);
        if (i > -1)
          handlers.splice(i, 1);
      };
    }
    function reset() {
      handlers = [];
    }
    return {
      add,
      list: () => handlers,
      reset
    };
  }
  function registerGuard(record, name, guard) {
    const removeFromList = () => {
      record[name].delete(guard);
    };
    vue.onUnmounted(removeFromList);
    vue.onDeactivated(removeFromList);
    vue.onActivated(() => {
      record[name].add(guard);
    });
    record[name].add(guard);
  }
  function onBeforeRouteLeave(leaveGuard) {
    const activeRecord = vue.inject(matchedRouteKey, {}).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "leaveGuards", leaveGuard);
  }
  function onBeforeRouteUpdate(updateGuard) {
    const activeRecord = vue.inject(matchedRouteKey, {}).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "updateGuards", updateGuard);
  }
  function guardToPromiseFn(guard, to, from, record, name) {
    const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
    return () => new Promise((resolve, reject) => {
      const next2 = (valid) => {
        if (valid === false)
          reject(createRouterError(4, {
            from,
            to
          }));
        else if (valid instanceof Error) {
          reject(valid);
        } else if (isRouteLocation(valid)) {
          reject(createRouterError(2, {
            from: to,
            to: valid
          }));
        } else {
          if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function")
            enterCallbackArray.push(valid);
          resolve();
        }
      };
      const guardReturn = guard.call(record && record.instances[name], to, from, next2);
      let guardCall = Promise.resolve(guardReturn);
      if (guard.length < 3)
        guardCall = guardCall.then(next2);
      guardCall.catch((err) => reject(err));
    });
  }
  function extractComponentsGuards(matched, guardType, to, from) {
    const guards = [];
    for (const record of matched) {
      for (const name in record.components) {
        let rawComponent = record.components[name];
        if (guardType !== "beforeRouteEnter" && !record.instances[name])
          continue;
        if (isRouteComponent(rawComponent)) {
          const options = rawComponent.__vccOpts || rawComponent;
          const guard = options[guardType];
          guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
        } else {
          let componentPromise = rawComponent();
          guards.push(() => componentPromise.then((resolved) => {
            if (!resolved)
              return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
            const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
            record.components[name] = resolvedComponent;
            const options = resolvedComponent.__vccOpts || resolvedComponent;
            const guard = options[guardType];
            return guard && guardToPromiseFn(guard, to, from, record, name)();
          }));
        }
      }
    }
    return guards;
  }
  function isRouteComponent(component) {
    return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
  }
  function useLink(props) {
    const router = vue.inject(routerKey);
    const currentRoute = vue.inject(routeLocationKey);
    const route = vue.computed(() => router.resolve(vue.unref(props.to)));
    const activeRecordIndex = vue.computed(() => {
      const { matched } = route.value;
      const { length } = matched;
      const routeMatched = matched[length - 1];
      const currentMatched = currentRoute.matched;
      if (!routeMatched || !currentMatched.length)
        return -1;
      const index2 = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
      if (index2 > -1)
        return index2;
      const parentRecordPath = getOriginalPath(matched[length - 2]);
      return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index2;
    });
    const isActive = vue.computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
    const isExactActive = vue.computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
    function navigate(e = {}) {
      if (guardEvent(e)) {
        return router[vue.unref(props.replace) ? "replace" : "push"](vue.unref(props.to)).catch(noop);
      }
      return Promise.resolve();
    }
    return {
      route,
      href: vue.computed(() => route.value.href),
      isActive,
      isExactActive,
      navigate
    };
  }
  const RouterLinkImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterLink",
    compatConfig: { MODE: 3 },
    props: {
      to: {
        type: [String, Object],
        required: true
      },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: {
        type: String,
        default: "page"
      }
    },
    useLink,
    setup(props, { slots }) {
      const link = vue.reactive(useLink(props));
      const { options } = vue.inject(routerKey);
      const elClass = vue.computed(() => ({
        [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
        [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
      }));
      return () => {
        const children2 = slots.default && slots.default(link);
        return props.custom ? children2 : vue.h("a", {
          "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
          href: link.href,
          onClick: link.navigate,
          class: elClass.value
        }, children2);
      };
    }
  });
  const RouterLink = RouterLinkImpl;
  function guardEvent(e) {
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
      return;
    if (e.defaultPrevented)
      return;
    if (e.button !== void 0 && e.button !== 0)
      return;
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const target = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(target))
        return;
    }
    if (e.preventDefault)
      e.preventDefault();
    return true;
  }
  function includesParams(outer, inner) {
    for (const key in inner) {
      const innerValue = inner[key];
      const outerValue = outer[key];
      if (typeof innerValue === "string") {
        if (innerValue !== outerValue)
          return false;
      } else {
        if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
          return false;
      }
    }
    return true;
  }
  function getOriginalPath(record) {
    return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
  }
  const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
  const RouterViewImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterView",
    inheritAttrs: false,
    props: {
      name: {
        type: String,
        default: "default"
      },
      route: Object
    },
    compatConfig: { MODE: 3 },
    setup(props, { attrs, slots }) {
      const injectedRoute = vue.inject(routerViewLocationKey);
      const routeToDisplay = vue.computed(() => props.route || injectedRoute.value);
      const depth = vue.inject(viewDepthKey, 0);
      const matchedRouteRef = vue.computed(() => routeToDisplay.value.matched[depth]);
      vue.provide(viewDepthKey, depth + 1);
      vue.provide(matchedRouteKey, matchedRouteRef);
      vue.provide(routerViewLocationKey, routeToDisplay);
      const viewRef = vue.ref();
      vue.watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
        if (to) {
          to.instances[name] = instance;
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards;
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards;
            }
          }
        }
        if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
          (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
        }
      }, { flush: "post" });
      return () => {
        const route = routeToDisplay.value;
        const matchedRoute = matchedRouteRef.value;
        const ViewComponent = matchedRoute && matchedRoute.components[props.name];
        const currentName = props.name;
        if (!ViewComponent) {
          return normalizeSlot(slots.default, { Component: ViewComponent, route });
        }
        const routePropsOption = matchedRoute.props[props.name];
        const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
        const onVnodeUnmounted = (vnode) => {
          if (vnode.component.isUnmounted) {
            matchedRoute.instances[currentName] = null;
          }
        };
        const component = vue.h(ViewComponent, assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef
        }));
        return normalizeSlot(slots.default, { Component: component, route }) || component;
      };
    }
  });
  function normalizeSlot(slot, data) {
    if (!slot)
      return null;
    const slotContent = slot(data);
    return slotContent.length === 1 ? slotContent[0] : slotContent;
  }
  const RouterView = RouterViewImpl;
  function createRouter(options) {
    const matcher = createRouterMatcher(options.routes, options);
    const parseQuery$1 = options.parseQuery || parseQuery;
    const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
    const routerHistory = options.history;
    const beforeGuards = useCallbacks();
    const beforeResolveGuards = useCallbacks();
    const afterGuards = useCallbacks();
    const currentRoute = vue.shallowRef(START_LOCATION_NORMALIZED);
    let pendingLocation = START_LOCATION_NORMALIZED;
    const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
    const encodeParams = applyToParams.bind(null, encodeParam);
    const decodeParams = applyToParams.bind(null, decode2);
    function addRoute(parentOrRoute, route) {
      let parent2;
      let record;
      if (isRouteName(parentOrRoute)) {
        parent2 = matcher.getRecordMatcher(parentOrRoute);
        record = route;
      } else {
        record = parentOrRoute;
      }
      return matcher.addRoute(record, parent2);
    }
    function removeRoute(name) {
      const recordMatcher = matcher.getRecordMatcher(name);
      if (recordMatcher) {
        matcher.removeRoute(recordMatcher);
      }
    }
    function getRoutes() {
      return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
    }
    function hasRoute(name) {
      return !!matcher.getRecordMatcher(name);
    }
    function resolve(rawLocation, currentLocation) {
      currentLocation = assign({}, currentLocation || currentRoute.value);
      if (typeof rawLocation === "string") {
        const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
        const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
        const href2 = routerHistory.createHref(locationNormalized.fullPath);
        return assign(locationNormalized, matchedRoute2, {
          params: decodeParams(matchedRoute2.params),
          hash: decode2(locationNormalized.hash),
          redirectedFrom: void 0,
          href: href2
        });
      }
      let matcherLocation;
      if ("path" in rawLocation) {
        matcherLocation = assign({}, rawLocation, {
          path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
        });
      } else {
        const targetParams = assign({}, rawLocation.params);
        for (const key in targetParams) {
          if (targetParams[key] == null) {
            delete targetParams[key];
          }
        }
        matcherLocation = assign({}, rawLocation, {
          params: encodeParams(rawLocation.params)
        });
        currentLocation.params = encodeParams(currentLocation.params);
      }
      const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
      const hash2 = rawLocation.hash || "";
      matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
      const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
        hash: encodeHash(hash2),
        path: matchedRoute.path
      }));
      const href = routerHistory.createHref(fullPath);
      return assign({
        fullPath,
        hash: hash2,
        query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      }, matchedRoute, {
        redirectedFrom: void 0,
        href
      });
    }
    function locationAsObject(to) {
      return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
    }
    function checkCanceledNavigation(to, from) {
      if (pendingLocation !== to) {
        return createRouterError(8, {
          from,
          to
        });
      }
    }
    function push(to) {
      return pushWithRedirect(to);
    }
    function replace(to) {
      return push(assign(locationAsObject(to), { replace: true }));
    }
    function handleRedirectRecord(to) {
      const lastMatched = to.matched[to.matched.length - 1];
      if (lastMatched && lastMatched.redirect) {
        const { redirect } = lastMatched;
        let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
        if (typeof newTargetLocation === "string") {
          newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
          newTargetLocation.params = {};
        }
        return assign({
          query: to.query,
          hash: to.hash,
          params: to.params
        }, newTargetLocation);
      }
    }
    function pushWithRedirect(to, redirectedFrom) {
      const targetLocation = pendingLocation = resolve(to);
      const from = currentRoute.value;
      const data = to.state;
      const force = to.force;
      const replace2 = to.replace === true;
      const shouldRedirect = handleRedirectRecord(targetLocation);
      if (shouldRedirect)
        return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
          state: data,
          force,
          replace: replace2
        }), redirectedFrom || targetLocation);
      const toLocation = targetLocation;
      toLocation.redirectedFrom = redirectedFrom;
      let failure;
      if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
        failure = createRouterError(16, { to: toLocation, from });
        handleScroll();
      }
      return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, 2) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure2) => {
        if (failure2) {
          if (isNavigationFailure(failure2, 2)) {
            return pushWithRedirect(assign(locationAsObject(failure2.to), {
              state: data,
              force,
              replace: replace2
            }), redirectedFrom || toLocation);
          }
        } else {
          failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
        }
        triggerAfterEach(toLocation, from, failure2);
        return failure2;
      });
    }
    function checkCanceledNavigationAndReject(to, from) {
      const error = checkCanceledNavigation(to, from);
      return error ? Promise.reject(error) : Promise.resolve();
    }
    function navigate(to, from) {
      let guards;
      const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
      guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
      for (const record of leavingRecords) {
        record.leaveGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards).then(() => {
        guards = [];
        for (const guard of beforeGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
        for (const record of updatingRecords) {
          record.updateGuards.forEach((guard) => {
            guards.push(guardToPromiseFn(guard, to, from));
          });
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const record of to.matched) {
          if (record.beforeEnter && !from.matched.includes(record)) {
            if (Array.isArray(record.beforeEnter)) {
              for (const beforeEnter of record.beforeEnter)
                guards.push(guardToPromiseFn(beforeEnter, to, from));
            } else {
              guards.push(guardToPromiseFn(record.beforeEnter, to, from));
            }
          }
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        to.matched.forEach((record) => record.enterCallbacks = {});
        guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const guard of beforeResolveGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
    }
    function triggerAfterEach(to, from, failure) {
      for (const guard of afterGuards.list())
        guard(to, from, failure);
    }
    function finalizeNavigation(toLocation, from, isPush, replace2, data) {
      const error = checkCanceledNavigation(toLocation, from);
      if (error)
        return error;
      const isFirstNavigation = from === START_LOCATION_NORMALIZED;
      const state = {};
      if (isPush) {
        if (replace2 || isFirstNavigation)
          routerHistory.replace(toLocation.fullPath, assign({
            scroll: isFirstNavigation && state && state.scroll
          }, data));
        else
          routerHistory.push(toLocation.fullPath, data);
      }
      currentRoute.value = toLocation;
      handleScroll();
      markAsReady();
    }
    let removeHistoryListener;
    function setupListeners() {
      if (removeHistoryListener)
        return;
      removeHistoryListener = routerHistory.listen((to, _from, info) => {
        const toLocation = resolve(to);
        const shouldRedirect = handleRedirectRecord(toLocation);
        if (shouldRedirect) {
          pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
          return;
        }
        pendingLocation = toLocation;
        const from = currentRoute.value;
        navigate(toLocation, from).catch((error) => {
          if (isNavigationFailure(error, 4 | 8)) {
            return error;
          }
          if (isNavigationFailure(error, 2)) {
            pushWithRedirect(error.to, toLocation).then((failure) => {
              if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
                routerHistory.go(-1, false);
              }
            }).catch(noop);
            return Promise.reject();
          }
          if (info.delta)
            routerHistory.go(-info.delta, false);
          return triggerError(error, toLocation, from);
        }).then((failure) => {
          failure = failure || finalizeNavigation(toLocation, from, false);
          if (failure) {
            if (info.delta) {
              routerHistory.go(-info.delta, false);
            } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
              routerHistory.go(-1, false);
            }
          }
          triggerAfterEach(toLocation, from, failure);
        }).catch(noop);
      });
    }
    let readyHandlers = useCallbacks();
    let errorHandlers = useCallbacks();
    let ready;
    function triggerError(error, to, from) {
      markAsReady(error);
      const list = errorHandlers.list();
      if (list.length) {
        list.forEach((handler) => handler(error, to, from));
      } else {
        console.error(error);
      }
      return Promise.reject(error);
    }
    function isReady() {
      if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
        return Promise.resolve();
      return new Promise((resolve2, reject) => {
        readyHandlers.add([resolve2, reject]);
      });
    }
    function markAsReady(err) {
      if (!ready) {
        ready = !err;
        setupListeners();
        readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
        readyHandlers.reset();
      }
      return err;
    }
    function handleScroll(to, from, isPush, isFirstNavigation) {
      return Promise.resolve();
    }
    const go = (delta) => routerHistory.go(delta);
    const installedApps = /* @__PURE__ */ new Set();
    const router = {
      currentRoute,
      addRoute,
      removeRoute,
      hasRoute,
      getRoutes,
      resolve,
      options,
      push,
      replace,
      go,
      back: () => go(-1),
      forward: () => go(1),
      beforeEach: beforeGuards.add,
      beforeResolve: beforeResolveGuards.add,
      afterEach: afterGuards.add,
      onError: errorHandlers.add,
      isReady,
      install(app) {
        const router2 = this;
        app.component("RouterLink", RouterLink);
        app.component("RouterView", RouterView);
        app.config.globalProperties.$router = router2;
        Object.defineProperty(app.config.globalProperties, "$route", {
          enumerable: true,
          get: () => vue.unref(currentRoute)
        });
        const reactiveRoute = {};
        for (const key in START_LOCATION_NORMALIZED) {
          reactiveRoute[key] = vue.computed(() => currentRoute.value[key]);
        }
        app.provide(routerKey, router2);
        app.provide(routeLocationKey, vue.reactive(reactiveRoute));
        app.provide(routerViewLocationKey, currentRoute);
        const unmountApp = app.unmount;
        installedApps.add(app);
        app.unmount = function() {
          installedApps.delete(app);
          if (installedApps.size < 1) {
            pendingLocation = START_LOCATION_NORMALIZED;
            removeHistoryListener && removeHistoryListener();
            removeHistoryListener = null;
            currentRoute.value = START_LOCATION_NORMALIZED;
            ready = false;
          }
          unmountApp();
        };
      }
    };
    return router;
  }
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
  }
  function extractChangingRecords(to, from) {
    const leavingRecords = [];
    const updatingRecords = [];
    const enteringRecords = [];
    const len = Math.max(from.matched.length, to.matched.length);
    for (let i = 0; i < len; i++) {
      const recordFrom = from.matched[i];
      if (recordFrom) {
        if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
          updatingRecords.push(recordFrom);
        else
          leavingRecords.push(recordFrom);
      }
      const recordTo = to.matched[i];
      if (recordTo) {
        if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
          enteringRecords.push(recordTo);
        }
      }
    }
    return [leavingRecords, updatingRecords, enteringRecords];
  }
  function useRouter2() {
    return vue.inject(routerKey);
  }
  function useRoute2() {
    return vue.inject(routeLocationKey);
  }
  exports.RouterLink = RouterLink;
  exports.RouterView = RouterView;
  exports.START_LOCATION = START_LOCATION_NORMALIZED;
  exports.createMemoryHistory = createMemoryHistory;
  exports.createRouter = createRouter;
  exports.createRouterMatcher = createRouterMatcher;
  exports.createWebHashHistory = createWebHashHistory;
  exports.createWebHistory = createWebHistory;
  exports.isNavigationFailure = isNavigationFailure;
  exports.matchedRouteKey = matchedRouteKey;
  exports.onBeforeRouteLeave = onBeforeRouteLeave;
  exports.onBeforeRouteUpdate = onBeforeRouteUpdate;
  exports.parseQuery = parseQuery;
  exports.routeLocationKey = routeLocationKey;
  exports.routerKey = routerKey;
  exports.routerViewLocationKey = routerViewLocationKey;
  exports.stringifyQuery = stringifyQuery;
  exports.useLink = useLink;
  exports.useRoute = useRoute2;
  exports.useRouter = useRouter2;
  exports.viewDepthKey = viewDepthKey;
})(vueRouter_cjs_prod);
const wrapInRef = (value) => vue_cjs_prod.isRef(value) ? value : vue_cjs_prod.ref(value);
const getDefault = () => null;
function useAsyncData(key, handler, options = {}) {
  var _a, _b, _c, _d, _e;
  if (typeof key !== "string") {
    throw new TypeError("asyncData key must be a string");
  }
  if (typeof handler !== "function") {
    throw new TypeError("asyncData handler must be a function");
  }
  options = __spreadValues({ server: true, default: getDefault }, options);
  if (options.defer) {
    console.warn("[useAsyncData] `defer` has been renamed to `lazy`. Support for `defer` will be removed in RC.");
  }
  options.lazy = (_b = (_a = options.lazy) != null ? _a : options.defer) != null ? _b : false;
  options.initialCache = (_c = options.initialCache) != null ? _c : true;
  const nuxt = useNuxtApp();
  const instance = vue_cjs_prod.getCurrentInstance();
  if (instance && !instance._nuxtOnBeforeMountCbs) {
    const cbs = instance._nuxtOnBeforeMountCbs = [];
    if (instance && false) {
      vue_cjs_prod.onBeforeMount(() => {
        cbs.forEach((cb) => {
          cb();
        });
        cbs.splice(0, cbs.length);
      });
      vue_cjs_prod.onUnmounted(() => cbs.splice(0, cbs.length));
    }
  }
  const useInitialCache = () => options.initialCache && nuxt.payload.data[key] !== void 0;
  const asyncData = {
    data: wrapInRef((_d = nuxt.payload.data[key]) != null ? _d : options.default()),
    pending: vue_cjs_prod.ref(!useInitialCache()),
    error: vue_cjs_prod.ref((_e = nuxt.payload._errors[key]) != null ? _e : null)
  };
  asyncData.refresh = (opts = {}) => {
    if (nuxt._asyncDataPromises[key]) {
      return nuxt._asyncDataPromises[key];
    }
    if (opts._initial && useInitialCache()) {
      return nuxt.payload.data[key];
    }
    asyncData.pending.value = true;
    nuxt._asyncDataPromises[key] = Promise.resolve(handler(nuxt)).then((result) => {
      if (options.transform) {
        result = options.transform(result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      asyncData.data.value = result;
      asyncData.error.value = null;
    }).catch((error) => {
      asyncData.error.value = error;
      asyncData.data.value = vue_cjs_prod.unref(options.default());
    }).finally(() => {
      asyncData.pending.value = false;
      nuxt.payload.data[key] = asyncData.data.value;
      if (asyncData.error.value) {
        nuxt.payload._errors[key] = true;
      }
      delete nuxt._asyncDataPromises[key];
    });
    return nuxt._asyncDataPromises[key];
  };
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer) {
    const promise = initialFetch();
    vue_cjs_prod.onServerPrefetch(() => promise);
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
const useState = (key, init) => {
  const nuxt = useNuxtApp();
  const state = vue_cjs_prod.toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (vue_cjs_prod.isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
};
const useError = () => {
  const nuxtApp = useNuxtApp();
  return useState("error", () => nuxtApp.ssrContext.error);
};
const throwError = (_err) => {
  const nuxtApp = useNuxtApp();
  useError();
  const err = typeof _err === "string" ? new Error(_err) : _err;
  nuxtApp.callHook("app:error", err);
  {
    nuxtApp.ssrContext.error = nuxtApp.ssrContext.error || err;
  }
  return err;
};
function murmurHash(key, seed = 0) {
  if (typeof key === "string") {
    key = createBuffer(key);
  }
  let i = 0;
  let h1 = seed;
  let k1;
  let h1b;
  const remainder = key.length & 3;
  const bytes = key.length - remainder;
  const c1 = 3432918353;
  const c2 = 461845907;
  while (i < bytes) {
    k1 = key[i] & 255 | (key[++i] & 255) << 8 | (key[++i] & 255) << 16 | (key[++i] & 255) << 24;
    ++i;
    k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
    k1 = k1 << 15 | k1 >>> 17;
    k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
    h1 ^= k1;
    h1 = h1 << 13 | h1 >>> 19;
    h1b = (h1 & 65535) * 5 + (((h1 >>> 16) * 5 & 65535) << 16) & 4294967295;
    h1 = (h1b & 65535) + 27492 + (((h1b >>> 16) + 58964 & 65535) << 16);
  }
  k1 = 0;
  switch (remainder) {
    case 3:
      k1 ^= (key[i + 2] & 255) << 16;
      break;
    case 2:
      k1 ^= (key[i + 1] & 255) << 8;
      break;
    case 1:
      k1 ^= key[i] & 255;
      k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
      h1 ^= k1;
  }
  h1 ^= key.length;
  h1 ^= h1 >>> 16;
  h1 = (h1 & 65535) * 2246822507 + (((h1 >>> 16) * 2246822507 & 65535) << 16) & 4294967295;
  h1 ^= h1 >>> 13;
  h1 = (h1 & 65535) * 3266489909 + (((h1 >>> 16) * 3266489909 & 65535) << 16) & 4294967295;
  h1 ^= h1 >>> 16;
  return h1 >>> 0;
}
function createBuffer(val) {
  return new TextEncoder().encode(val);
}
const defaults$1 = {
  ignoreUnknown: false,
  respectType: false,
  respectFunctionNames: false,
  respectFunctionProperties: false,
  unorderedObjects: true,
  unorderedArrays: false,
  unorderedSets: false
};
function objectHash(object, options = {}) {
  options = __spreadValues(__spreadValues({}, defaults$1), options);
  const hasher = createHasher(options);
  hasher.dispatch(object);
  return hasher.toString();
}
function createHasher(options) {
  const buff = [];
  let context = [];
  const write = (str) => {
    buff.push(str);
  };
  return {
    toString() {
      return buff.join("");
    },
    getContext() {
      return context;
    },
    dispatch(value) {
      if (options.replacer) {
        value = options.replacer(value);
      }
      const type = value === null ? "null" : typeof value;
      return this["_" + type](value);
    },
    _object(object) {
      const pattern = /\[object (.*)\]/i;
      const objString = Object.prototype.toString.call(object);
      const _objType = pattern.exec(objString);
      const objType = _objType ? _objType[1].toLowerCase() : "unknown:[" + objString.toLowerCase() + "]";
      let objectNumber = null;
      if ((objectNumber = context.indexOf(object)) >= 0) {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      } else {
        context.push(object);
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        write("buffer:");
        return write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this["_" + objType]) {
          this["_" + objType](object);
        } else if (options.ignoreUnknown) {
          return write("[" + objType + "]");
        } else {
          throw new Error('Unknown object type "' + objType + '"');
        }
      } else {
        let keys = Object.keys(object);
        if (options.unorderedObjects) {
          keys = keys.sort();
        }
        if (options.respectType !== false && !isNativeFunction(object)) {
          keys.splice(0, 0, "prototype", "__proto__", "letructor");
        }
        if (options.excludeKeys) {
          keys = keys.filter(function(key) {
            return !options.excludeKeys(key);
          });
        }
        write("object:" + keys.length + ":");
        return keys.forEach((key) => {
          this.dispatch(key);
          write(":");
          if (!options.excludeValues) {
            this.dispatch(object[key]);
          }
          write(",");
        });
      }
    },
    _array(arr, unordered) {
      unordered = typeof unordered !== "undefined" ? unordered : options.unorderedArrays !== false;
      write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        return arr.forEach((entry2) => {
          return this.dispatch(entry2);
        });
      }
      const contextAdditions = [];
      const entries = arr.map((entry2) => {
        const hasher = createHasher(options);
        hasher.dispatch(entry2);
        contextAdditions.push(hasher.getContext());
        return hasher.toString();
      });
      context = context.concat(contextAdditions);
      entries.sort();
      return this._array(entries, false);
    },
    _date(date) {
      return write("date:" + date.toJSON());
    },
    _symbol(sym) {
      return write("symbol:" + sym.toString());
    },
    _error(err) {
      return write("error:" + err.toString());
    },
    _boolean(bool) {
      return write("bool:" + bool.toString());
    },
    _string(string) {
      write("string:" + string.length + ":");
      write(string.toString());
    },
    _function(fn) {
      write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
      if (options.respectFunctionNames !== false) {
        this.dispatch("function-name:" + String(fn.name));
      }
      if (options.respectFunctionProperties) {
        this._object(fn);
      }
    },
    _number(number) {
      return write("number:" + number.toString());
    },
    _xml(xml) {
      return write("xml:" + xml.toString());
    },
    _null() {
      return write("Null");
    },
    _undefined() {
      return write("Undefined");
    },
    _regexp(regex) {
      return write("regex:" + regex.toString());
    },
    _uint8array(arr) {
      write("uint8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _uint8clampedarray(arr) {
      write("uint8clampedarray:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _int8array(arr) {
      write("int8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _uint16array(arr) {
      write("uint16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _int16array(arr) {
      write("int16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _uint32array(arr) {
      write("uint32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _int32array(arr) {
      write("int32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _float32array(arr) {
      write("float32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _float64array(arr) {
      write("float64array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _arraybuffer(arr) {
      write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    },
    _url(url) {
      return write("url:" + url.toString());
    },
    _map(map) {
      write("map:");
      const arr = Array.from(map);
      return this._array(arr, options.unorderedSets !== false);
    },
    _set(set) {
      write("set:");
      const arr = Array.from(set);
      return this._array(arr, options.unorderedSets !== false);
    },
    _file(file) {
      write("file:");
      return this.dispatch([file.name, file.size, file.type, file.lastModfied]);
    },
    _blob() {
      if (options.ignoreUnknown) {
        return write("[blob]");
      }
      throw new Error('Hashing Blob objects is currently not supported\nUse "options.replacer" or "options.ignoreUnknown"\n');
    },
    _domwindow() {
      return write("domwindow");
    },
    _bigint(number) {
      return write("bigint:" + number.toString());
    },
    _process() {
      return write("process");
    },
    _timer() {
      return write("timer");
    },
    _pipe() {
      return write("pipe");
    },
    _tcp() {
      return write("tcp");
    },
    _udp() {
      return write("udp");
    },
    _tty() {
      return write("tty");
    },
    _statwatcher() {
      return write("statwatcher");
    },
    _securecontext() {
      return write("securecontext");
    },
    _connection() {
      return write("connection");
    },
    _zlib() {
      return write("zlib");
    },
    _context() {
      return write("context");
    },
    _nodescript() {
      return write("nodescript");
    },
    _httpparser() {
      return write("httpparser");
    },
    _dataview() {
      return write("dataview");
    },
    _signal() {
      return write("signal");
    },
    _fsevent() {
      return write("fsevent");
    },
    _tlswrap() {
      return write("tlswrap");
    }
  };
}
function isNativeFunction(f) {
  if (typeof f !== "function") {
    return false;
  }
  const exp = /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i;
  return exp.exec(Function.prototype.toString.call(f)) != null;
}
function hash(object, options = {}) {
  const hashed = typeof object === "string" ? object : objectHash(object, options);
  return String(murmurHash(hashed));
}
function useFetch(request, opts = {}) {
  const key = "$f_" + (opts.key || hash([request, __spreadProps(__spreadValues({}, opts), { transform: null })]));
  const _request = vue_cjs_prod.computed(() => {
    let r = request;
    if (typeof r === "function") {
      r = r();
    }
    return vue_cjs_prod.isRef(r) ? r.value : r;
  });
  const _fetchOptions = __spreadProps(__spreadValues({}, opts), {
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = __spreadProps(__spreadValues({}, opts), {
    watch: [
      _request,
      ...opts.watch || []
    ]
  });
  const asyncData = useAsyncData(key, () => {
    return $fetch(_request.value, _fetchOptions);
  }, _asyncDataOptions);
  return asyncData;
}
const decode = decodeURIComponent;
const encode = encodeURIComponent;
const pairSplitRegExp = /; */;
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  let obj = {};
  let opt = options || {};
  let pairs = str.split(pairSplitRegExp);
  let dec = opt.decode || decode;
  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i];
    let eq_idx = pair.indexOf("=");
    if (eq_idx < 0) {
      continue;
    }
    let key = pair.substr(0, eq_idx).trim();
    let val = pair.substr(++eq_idx, pair.length).trim();
    if (val[0] == '"') {
      val = val.slice(1, -1);
    }
    if (obj[key] == void 0) {
      obj[key] = tryDecode(val, dec);
    }
  }
  return obj;
}
function serialize(name, value, options) {
  let opt = options || {};
  let enc = opt.encode || encode;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  let encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (opt.maxAge != null) {
    let maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== "function") {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.sameSite) {
    let sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch (e) {
    return str;
  }
}
const MIMES = {
  html: "text/html",
  json: "application/json"
};
const defer = typeof setImmediate !== "undefined" ? setImmediate : (fn) => fn();
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      event.res.end(data);
      resolve(void 0);
    });
  });
}
function defaultContentType(event, type) {
  if (type && !event.res.getHeader("Content-Type")) {
    event.res.setHeader("Content-Type", type);
  }
}
function sendRedirect(event, location2, code = 302) {
  event.res.statusCode = code;
  event.res.setHeader("Location", location2);
  return send(event, "Redirecting to " + location2, MIMES.html);
}
function appendHeader(event, name, value) {
  let current = event.res.getHeader(name);
  if (!current) {
    event.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.res.setHeader(name, current.concat(value));
}
class H3Error extends Error {
  constructor() {
    super(...arguments);
    this.statusCode = 500;
    this.statusMessage = "H3Error";
  }
}
function createError(input) {
  var _a;
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (input instanceof H3Error) {
    return input;
  }
  const err = new H3Error((_a = input.message) != null ? _a : input.statusMessage, input.cause ? { cause: input.cause } : void 0);
  if (input.statusCode) {
    err.statusCode = input.statusCode;
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  }
  if (input.data) {
    err.data = input.data;
  }
  return err;
}
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
const CookieDefaults = {
  path: "/",
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a, _b;
  const opts = __spreadValues(__spreadValues({}, CookieDefaults), _opts);
  const cookies = readRawCookies(opts);
  const cookie = wrapInRef((_b = cookies[name]) != null ? _b : (_a = opts.default) == null ? void 0 : _a.call(opts));
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (cookie.value !== cookies[name]) {
        writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
      }
    };
    nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:redirected", writeFinalCookieValue);
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  var _a;
  {
    return parse(((_a = useRequestEvent()) == null ? void 0 : _a.req.headers.cookie) || "", opts);
  }
}
function serializeCookie(name, value, opts = {}) {
  if (value === null || value === void 0) {
    return serialize(name, value, __spreadProps(__spreadValues({}, opts), { maxAge: -1 }));
  }
  return serialize(name, value, opts);
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    appendHeader(event, "Set-Cookie", serializeCookie(name, value, opts));
  }
}
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  return useNuxtApp()._route;
};
const defineNuxtRouteMiddleware = (middleware) => middleware;
const navigateTo = (to, options = {}) => {
  if (!to) {
    to = "/";
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      const redirectLocation = joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, options.redirectCode || 302));
    }
  }
  return options.replace ? router.replace(to) : router.push(to);
};
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  const checkPropConflicts = (props, main2, sub) => {
  };
  return vue_cjs_prod.defineComponent({
    name: componentName,
    props: {
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = vue_cjs_prod.computed(() => {
        checkPropConflicts();
        return props.to || props.href || "";
      });
      const isExternal = vue_cjs_prod.computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, true);
      });
      return () => {
        var _a, _b, _c;
        if (!isExternal.value) {
          return vue_cjs_prod.h(vue_cjs_prod.resolveComponent("RouterLink"), {
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue
          }, slots.default);
        }
        const href = typeof to.value === "object" ? (_b = (_a = router.resolve(to.value)) == null ? void 0 : _a.href) != null ? _b : null : to.value || null;
        const target = props.target || null;
        checkPropConflicts();
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        return vue_cjs_prod.h("a", { href, rel, target }, (_c = slots.default) == null ? void 0 : _c.call(slots));
      };
    }
  });
}
const __nuxt_component_0$2 = defineNuxtLink({ componentName: "NuxtLink" });
var shared_cjs_prod = {};
Object.defineProperty(shared_cjs_prod, "__esModule", { value: true });
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const PatchFlagNames = {
  [1]: `TEXT`,
  [2]: `CLASS`,
  [4]: `STYLE`,
  [8]: `PROPS`,
  [16]: `FULL_PROPS`,
  [32]: `HYDRATE_EVENTS`,
  [64]: `STABLE_FRAGMENT`,
  [128]: `KEYED_FRAGMENT`,
  [256]: `UNKEYED_FRAGMENT`,
  [512]: `NEED_PATCH`,
  [1024]: `DYNAMIC_SLOTS`,
  [2048]: `DEV_ROOT_FRAGMENT`,
  [-1]: `HOISTED`,
  [-2]: `BAIL`
};
const slotFlagsText = {
  [1]: "STABLE",
  [2]: "DYNAMIC",
  [3]: "FORWARDED"
};
const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
  let lines = source.split(/(\r?\n)/);
  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
  lines = lines.filter((_, idx) => idx % 2 === 0);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length)
          continue;
        const line = j + 1;
        res.push(`${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
        const lineLength = lines[j].length;
        const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
        if (j === i) {
          const pad = start - (count - (lineLength + newLineSeqLength));
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + newLineSeqLength;
        }
      }
      break;
    }
  }
  return res.join("\n");
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
const isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
  if (attrValidationCache.hasOwnProperty(name)) {
    return attrValidationCache[name];
  }
  const isUnsafe = unsafeAttrCharRE.test(name);
  if (isUnsafe) {
    console.error(`unsafe attribute name: ${name}`);
  }
  return attrValidationCache[name] = !isUnsafe;
}
const propsToAttrMap = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
const isNoUnitNumericStyleProp = /* @__PURE__ */ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,stroke-miterlimit,stroke-opacity,stroke-width`);
const isKnownHtmlAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
const isKnownSvgAttr = /* @__PURE__ */ makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject$4(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function stringifyStyle(styles2) {
  let ret = "";
  if (!styles2 || isString(styles2)) {
    return ret;
  }
  for (const key in styles2) {
    const value = styles2[key];
    const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
    if (isString(value) || typeof value === "number" && isNoUnitNumericStyleProp(normalizedKey)) {
      ret += `${normalizedKey}:${value};`;
    }
  }
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$4(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
const escapeRE = /["'&<>]/;
function escapeHtml(string) {
  const str = "" + string;
  const match = escapeRE.exec(str);
  if (!match) {
    return str;
  }
  let html2 = "";
  let escaped;
  let index2;
  let lastIndex = 0;
  for (index2 = match.index; index2 < str.length; index2++) {
    switch (str.charCodeAt(index2)) {
      case 34:
        escaped = "&quot;";
        break;
      case 38:
        escaped = "&amp;";
        break;
      case 39:
        escaped = "&#39;";
        break;
      case 60:
        escaped = "&lt;";
        break;
      case 62:
        escaped = "&gt;";
        break;
      default:
        continue;
    }
    if (lastIndex !== index2) {
      html2 += str.slice(lastIndex, index2);
    }
    lastIndex = index2 + 1;
    html2 += escaped;
  }
  return lastIndex !== index2 ? html2 + str.slice(lastIndex, index2) : html2;
}
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
  return src.replace(commentStripRE, "");
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject$4(a);
  bValidType = isObject$4(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject$4(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$4(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend$3 = Object.assign;
const remove$1 = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction$1 = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$4 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$4(val) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const isBuiltInDirective = /* @__PURE__ */ makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo");
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : {});
};
const identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
function genPropsAccessExp(name) {
  return identRE.test(name) ? `__props.${name}` : `__props[${JSON.stringify(name)}]`;
}
shared_cjs_prod.EMPTY_ARR = EMPTY_ARR;
shared_cjs_prod.EMPTY_OBJ = EMPTY_OBJ;
shared_cjs_prod.NO = NO;
shared_cjs_prod.NOOP = NOOP;
shared_cjs_prod.PatchFlagNames = PatchFlagNames;
shared_cjs_prod.camelize = camelize;
shared_cjs_prod.capitalize = capitalize;
shared_cjs_prod.def = def;
shared_cjs_prod.escapeHtml = escapeHtml;
shared_cjs_prod.escapeHtmlComment = escapeHtmlComment;
shared_cjs_prod.extend = extend$3;
shared_cjs_prod.genPropsAccessExp = genPropsAccessExp;
shared_cjs_prod.generateCodeFrame = generateCodeFrame;
shared_cjs_prod.getGlobalThis = getGlobalThis;
shared_cjs_prod.hasChanged = hasChanged;
shared_cjs_prod.hasOwn = hasOwn;
shared_cjs_prod.hyphenate = hyphenate;
shared_cjs_prod.includeBooleanAttr = includeBooleanAttr;
shared_cjs_prod.invokeArrayFns = invokeArrayFns;
shared_cjs_prod.isArray = isArray;
shared_cjs_prod.isBooleanAttr = isBooleanAttr;
shared_cjs_prod.isBuiltInDirective = isBuiltInDirective;
shared_cjs_prod.isDate = isDate;
var isFunction_1 = shared_cjs_prod.isFunction = isFunction$1;
shared_cjs_prod.isGloballyWhitelisted = isGloballyWhitelisted;
shared_cjs_prod.isHTMLTag = isHTMLTag;
shared_cjs_prod.isIntegerKey = isIntegerKey;
shared_cjs_prod.isKnownHtmlAttr = isKnownHtmlAttr;
shared_cjs_prod.isKnownSvgAttr = isKnownSvgAttr;
shared_cjs_prod.isMap = isMap;
shared_cjs_prod.isModelListener = isModelListener;
shared_cjs_prod.isNoUnitNumericStyleProp = isNoUnitNumericStyleProp;
shared_cjs_prod.isObject = isObject$4;
shared_cjs_prod.isOn = isOn;
shared_cjs_prod.isPlainObject = isPlainObject;
shared_cjs_prod.isPromise = isPromise;
shared_cjs_prod.isReservedProp = isReservedProp;
shared_cjs_prod.isSSRSafeAttrName = isSSRSafeAttrName;
shared_cjs_prod.isSVGTag = isSVGTag;
shared_cjs_prod.isSet = isSet;
shared_cjs_prod.isSpecialBooleanAttr = isSpecialBooleanAttr;
shared_cjs_prod.isString = isString;
shared_cjs_prod.isSymbol = isSymbol;
shared_cjs_prod.isVoidTag = isVoidTag;
shared_cjs_prod.looseEqual = looseEqual;
shared_cjs_prod.looseIndexOf = looseIndexOf;
shared_cjs_prod.makeMap = makeMap;
shared_cjs_prod.normalizeClass = normalizeClass;
shared_cjs_prod.normalizeProps = normalizeProps;
shared_cjs_prod.normalizeStyle = normalizeStyle;
shared_cjs_prod.objectToString = objectToString;
shared_cjs_prod.parseStringStyle = parseStringStyle;
shared_cjs_prod.propsToAttrMap = propsToAttrMap;
shared_cjs_prod.remove = remove$1;
shared_cjs_prod.slotFlagsText = slotFlagsText;
shared_cjs_prod.stringifyStyle = stringifyStyle;
shared_cjs_prod.toDisplayString = toDisplayString;
shared_cjs_prod.toHandlerKey = toHandlerKey;
shared_cjs_prod.toNumber = toNumber;
shared_cjs_prod.toRawType = toRawType;
shared_cjs_prod.toTypeString = toTypeString;
function useHead(meta2) {
  const resolvedMeta = isFunction_1(meta2) ? vue_cjs_prod.computed(meta2) : meta2;
  useNuxtApp()._useHead(resolvedMeta);
}
const preload = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin({
    beforeCreate() {
      const { _registeredComponents } = this.$nuxt.ssrContext;
      const { __moduleIdentifier } = this.$options;
      _registeredComponents.add(__moduleIdentifier);
    }
  });
});
const components = {};
function C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47_46nuxt_47components_46plugin_46mjs(nuxtApp) {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
}
var __defProp2 = Object.defineProperty;
var __defProps2 = Object.defineProperties;
var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
var PROVIDE_KEY = `usehead`;
var HEAD_COUNT_KEY = `head:count`;
var HEAD_ATTRS_KEY = `data-head-attrs`;
var SELF_CLOSING_TAGS = ["meta", "link", "base"];
var createElement = (tag, attrs, document2) => {
  const el = document2.createElement(tag);
  for (const key of Object.keys(attrs)) {
    let value = attrs[key];
    if (key === "key" || value === false) {
      continue;
    }
    if (key === "children") {
      el.textContent = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  return el;
};
var htmlEscape = (str) => str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var stringifyAttrs = (attributes) => {
  const handledAttributes = [];
  for (let [key, value] of Object.entries(attributes)) {
    if (key === "children" || key === "key") {
      continue;
    }
    if (value === false || value == null) {
      continue;
    }
    let attribute = htmlEscape(key);
    if (value !== true) {
      attribute += `="${htmlEscape(String(value))}"`;
    }
    handledAttributes.push(attribute);
  }
  return handledAttributes.length > 0 ? " " + handledAttributes.join(" ") : "";
};
function isEqualNode(oldTag, newTag) {
  if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
    const nonce = newTag.getAttribute("nonce");
    if (nonce && !oldTag.getAttribute("nonce")) {
      const cloneTag = newTag.cloneNode(true);
      cloneTag.setAttribute("nonce", "");
      cloneTag.nonce = nonce;
      return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
    }
  }
  return oldTag.isEqualNode(newTag);
}
var getTagKey = (props) => {
  const names = ["key", "id", "name", "property"];
  for (const n of names) {
    const value = typeof props.getAttribute === "function" ? props.hasAttribute(n) ? props.getAttribute(n) : void 0 : props[n];
    if (value !== void 0) {
      return { name: n, value };
    }
  }
};
var acceptFields = [
  "title",
  "meta",
  "link",
  "base",
  "style",
  "script",
  "htmlAttrs",
  "bodyAttrs"
];
var headObjToTags = (obj) => {
  const tags = [];
  for (const key of Object.keys(obj)) {
    if (obj[key] == null)
      continue;
    if (key === "title") {
      tags.push({ tag: key, props: { children: obj[key] } });
    } else if (key === "base") {
      tags.push({ tag: key, props: __spreadValues2({ key: "default" }, obj[key]) });
    } else if (acceptFields.includes(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          tags.push({ tag: key, props: item });
        });
      } else if (value) {
        tags.push({ tag: key, props: value });
      }
    }
  }
  return tags;
};
var setAttrs = (el, attrs) => {
  const existingAttrs = el.getAttribute(HEAD_ATTRS_KEY);
  if (existingAttrs) {
    for (const key of existingAttrs.split(",")) {
      if (!(key in attrs)) {
        el.removeAttribute(key);
      }
    }
  }
  const keys = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null)
      continue;
    if (value === false) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
    keys.push(key);
  }
  if (keys.length) {
    el.setAttribute(HEAD_ATTRS_KEY, keys.join(","));
  } else {
    el.removeAttribute(HEAD_ATTRS_KEY);
  }
};
var updateElements = (document2 = window.document, type, tags) => {
  var _a;
  const head = document2.head;
  let headCountEl = head.querySelector(`meta[name="${HEAD_COUNT_KEY}"]`);
  const headCount = headCountEl ? Number(headCountEl.getAttribute("content")) : 0;
  const oldElements = [];
  if (headCountEl) {
    for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null) {
      if (((_a = j == null ? void 0 : j.tagName) == null ? void 0 : _a.toLowerCase()) === type) {
        oldElements.push(j);
      }
    }
  } else {
    headCountEl = document2.createElement("meta");
    headCountEl.setAttribute("name", HEAD_COUNT_KEY);
    headCountEl.setAttribute("content", "0");
    head.append(headCountEl);
  }
  let newElements = tags.map((tag) => createElement(tag.tag, tag.props, document2));
  newElements = newElements.filter((newEl) => {
    for (let i = 0; i < oldElements.length; i++) {
      const oldEl = oldElements[i];
      if (isEqualNode(oldEl, newEl)) {
        oldElements.splice(i, 1);
        return false;
      }
    }
    return true;
  });
  oldElements.forEach((t) => {
    var _a2;
    return (_a2 = t.parentNode) == null ? void 0 : _a2.removeChild(t);
  });
  newElements.forEach((t) => {
    head.insertBefore(t, headCountEl);
  });
  headCountEl.setAttribute("content", "" + (headCount - oldElements.length + newElements.length));
};
var createHead = () => {
  let allHeadObjs = [];
  let previousTags = /* @__PURE__ */ new Set();
  const head = {
    install(app) {
      app.config.globalProperties.$head = head;
      app.provide(PROVIDE_KEY, head);
    },
    get headTags() {
      const deduped = [];
      allHeadObjs.forEach((objs) => {
        const tags = headObjToTags(objs.value);
        tags.forEach((tag) => {
          if (tag.tag === "meta" || tag.tag === "base" || tag.tag === "script") {
            const key = getTagKey(tag.props);
            if (key) {
              let index2 = -1;
              for (let i = 0; i < deduped.length; i++) {
                const prev2 = deduped[i];
                const prevValue = prev2.props[key.name];
                const nextValue = tag.props[key.name];
                if (prev2.tag === tag.tag && prevValue === nextValue) {
                  index2 = i;
                  break;
                }
              }
              if (index2 !== -1) {
                deduped.splice(index2, 1);
              }
            }
          }
          deduped.push(tag);
        });
      });
      return deduped;
    },
    addHeadObjs(objs) {
      allHeadObjs.push(objs);
    },
    removeHeadObjs(objs) {
      allHeadObjs = allHeadObjs.filter((_objs) => _objs !== objs);
    },
    updateDOM(document2 = window.document) {
      let title;
      let htmlAttrs = {};
      let bodyAttrs = {};
      const actualTags = {};
      for (const tag of head.headTags) {
        if (tag.tag === "title") {
          title = tag.props.children;
          continue;
        }
        if (tag.tag === "htmlAttrs") {
          Object.assign(htmlAttrs, tag.props);
          continue;
        }
        if (tag.tag === "bodyAttrs") {
          Object.assign(bodyAttrs, tag.props);
          continue;
        }
        actualTags[tag.tag] = actualTags[tag.tag] || [];
        actualTags[tag.tag].push(tag);
      }
      if (title !== void 0) {
        document2.title = title;
      }
      setAttrs(document2.documentElement, htmlAttrs);
      setAttrs(document2.body, bodyAttrs);
      const tags = /* @__PURE__ */ new Set([...Object.keys(actualTags), ...previousTags]);
      for (const tag of tags) {
        updateElements(document2, tag, actualTags[tag] || []);
      }
      previousTags.clear();
      Object.keys(actualTags).forEach((i) => previousTags.add(i));
    }
  };
  return head;
};
var tagToString = (tag) => {
  let attrs = stringifyAttrs(tag.props);
  if (SELF_CLOSING_TAGS.includes(tag.tag)) {
    return `<${tag.tag}${attrs}>`;
  }
  return `<${tag.tag}${attrs}>${tag.props.children || ""}</${tag.tag}>`;
};
var renderHeadToString = (head) => {
  const tags = [];
  let titleTag = "";
  let htmlAttrs = {};
  let bodyAttrs = {};
  for (const tag of head.headTags) {
    if (tag.tag === "title") {
      titleTag = tagToString(tag);
    } else if (tag.tag === "htmlAttrs") {
      Object.assign(htmlAttrs, tag.props);
    } else if (tag.tag === "bodyAttrs") {
      Object.assign(bodyAttrs, tag.props);
    } else {
      tags.push(tagToString(tag));
    }
  }
  tags.push(`<meta name="${HEAD_COUNT_KEY}" content="${tags.length}">`);
  return {
    get headTags() {
      return titleTag + tags.join("");
    },
    get htmlAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, htmlAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(htmlAttrs).join(",")
      }));
    },
    get bodyAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, bodyAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(bodyAttrs).join(",")
      }));
    }
  };
};
function isObject$3(val) {
  return val !== null && typeof val === "object";
}
function _defu(baseObj, defaults2, namespace = ".", merger) {
  if (!isObject$3(defaults2)) {
    return _defu(baseObj, {}, namespace, merger);
  }
  const obj = Object.assign({}, defaults2);
  for (const key in baseObj) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const val = baseObj[key];
    if (val === null || val === void 0) {
      continue;
    }
    if (merger && merger(obj, key, val, namespace)) {
      continue;
    }
    if (Array.isArray(val) && Array.isArray(obj[key])) {
      obj[key] = val.concat(obj[key]);
    } else if (isObject$3(val) && isObject$3(obj[key])) {
      obj[key] = _defu(val, obj[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
    } else {
      obj[key] = val;
    }
  }
  return obj;
}
function createDefu(merger) {
  return (...args) => args.reduce((p, c) => _defu(p, c, "", merger), {});
}
const defu = createDefu();
const C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47node_modules_47nuxt_47dist_47head_47runtime_47lib_47vueuse_45head_46plugin = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  nuxtApp.vueApp.use(head);
  nuxtApp.hooks.hookOnce("app:mounted", () => {
    vue_cjs_prod.watchEffect(() => {
      head.updateDOM();
    });
  });
  const titleTemplate = vue_cjs_prod.ref();
  nuxtApp._useHead = (_meta) => {
    const meta2 = vue_cjs_prod.ref(_meta);
    if ("titleTemplate" in meta2.value) {
      titleTemplate.value = meta2.value.titleTemplate;
    }
    const headObj = vue_cjs_prod.computed(() => {
      const overrides = { meta: [] };
      if (titleTemplate.value && "title" in meta2.value) {
        overrides.title = typeof titleTemplate.value === "function" ? titleTemplate.value(meta2.value.title) : titleTemplate.value.replace(/%s/g, meta2.value.title);
      }
      if (meta2.value.charset) {
        overrides.meta.push({ key: "charset", charset: meta2.value.charset });
      }
      if (meta2.value.viewport) {
        overrides.meta.push({ name: "viewport", content: meta2.value.viewport });
      }
      return defu(overrides, meta2.value);
    });
    head.addHeadObjs(headObj);
    {
      return;
    }
  };
  {
    nuxtApp.ssrContext.renderMeta = () => renderHeadToString(head);
  }
});
const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory(__spreadValues(__spreadValues({}, removeUndefinedProps(props)), ctx.attrs), ctx));
  return () => {
    var _a, _b;
    return renderChild ? (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: String,
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
const Script = vue_cjs_prod.defineComponent({
  name: "Script",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    async: Boolean,
    crossorigin: {
      type: [Boolean, String],
      default: void 0
    },
    defer: Boolean,
    integrity: String,
    nomodule: Boolean,
    nonce: String,
    referrerpolicy: String,
    src: String,
    type: String,
    charset: String,
    language: String
  }),
  setup: setupForUseMeta((script) => ({
    script: [script]
  }))
});
const Link = vue_cjs_prod.defineComponent({
  name: "Link",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    as: String,
    crossorigin: String,
    disabled: Boolean,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    methods: String,
    target: String
  }),
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
const Base = vue_cjs_prod.defineComponent({
  name: "Base",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    href: String,
    target: String
  }),
  setup: setupForUseMeta((base) => ({
    base
  }))
});
const Title = vue_cjs_prod.defineComponent({
  name: "Title",
  inheritAttrs: false,
  setup: setupForUseMeta((_, { slots }) => {
    var _a, _b, _c;
    const title = ((_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children) || null;
    return {
      title
    };
  })
});
const Meta = vue_cjs_prod.defineComponent({
  name: "Meta",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    charset: String,
    content: String,
    httpEquiv: String,
    name: String
  }),
  setup: setupForUseMeta((meta2) => ({
    meta: [meta2]
  }))
});
const Style = vue_cjs_prod.defineComponent({
  name: "Style",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    type: String,
    media: String,
    nonce: String,
    title: String,
    scoped: {
      type: Boolean,
      default: void 0
    }
  }),
  setup: setupForUseMeta((props, { slots }) => {
    var _a, _b, _c;
    const style = __spreadValues({}, props);
    const textContent = (_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = vue_cjs_prod.defineComponent({
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a, _b;
    return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
  }
});
const Html = vue_cjs_prod.defineComponent({
  name: "Html",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    manifest: String,
    version: String,
    xmlns: String
  }),
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
const Body = vue_cjs_prod.defineComponent({
  name: "Body",
  inheritAttrs: false,
  props: globalProps,
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const Components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Script,
  Link,
  Base,
  Title,
  Meta,
  Style,
  Head,
  Html,
  Body
}, Symbol.toStringTag, { value: "Module" }));
const metaConfig = { "globalMeta": { "charset": "utf-8", "viewport": "width=device-width, initial-scale=1", "meta": [{ "charset": "utf-8" }, { "name": "viewport", "content": "width=device-width, initial-scale=1" }], "link": [], "style": [], "script": [], "title": "UDM-ATTRACTION", "htmlAttrs": { "lang": "ru" } } };
const metaMixin = {
  created() {
    const instance = vue_cjs_prod.getCurrentInstance();
    if (!instance) {
      return;
    }
    const options = instance.type;
    if (!options || !("head" in options)) {
      return;
    }
    const nuxtApp = useNuxtApp();
    const source = typeof options.head === "function" ? vue_cjs_prod.computed(() => options.head(nuxtApp)) : options.head;
    useHead(source);
  }
};
const C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47node_modules_47nuxt_47dist_47head_47runtime_47plugin = defineNuxtPlugin((nuxtApp) => {
  useHead(vue_cjs_prod.markRaw(__spreadValues({ title: "" }, metaConfig.globalMeta)));
  nuxtApp.vueApp.mixin(metaMixin);
  for (const name in Components) {
    nuxtApp.vueApp.component(name, Components[name]);
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (override, routeProps) => {
  var _a;
  const matchedRoute = routeProps.route.matched.find((m) => m.components.default === routeProps.Component.type);
  const source = (_a = override != null ? override : matchedRoute == null ? void 0 : matchedRoute.meta.key) != null ? _a : interpolatePath(routeProps.route, matchedRoute);
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children2) => {
  return { default: () => children2 };
};
const Fragment = {
  setup(_props, { slots }) {
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots);
    };
  }
};
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? vue_cjs_prod.h(component, props === true ? {} : props, slots) : vue_cjs_prod.h(Fragment, {}, slots) };
};
const isNestedKey = Symbol("isNested");
const NuxtPage = vue_cjs_prod.defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs }) {
    const nuxtApp = useNuxtApp();
    const isNested = vue_cjs_prod.inject(isNestedKey, false);
    vue_cjs_prod.provide(isNestedKey, true);
    return () => {
      return vue_cjs_prod.h(vueRouter_cjs_prod.RouterView, __spreadValues({ name: props.name, route: props.route }, attrs), {
        default: (routeProps) => {
          var _a;
          return routeProps.Component && _wrapIf(vue_cjs_prod.Transition, (_a = routeProps.route.meta.pageTransition) != null ? _a : defaultPageTransition, wrapInKeepAlive(routeProps.route.meta.keepalive, isNested && nuxtApp.isHydrating ? vue_cjs_prod.h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) : vue_cjs_prod.h(vue_cjs_prod.Suspense, {
            onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
            onResolve: () => nuxtApp.callHook("page:finish", routeProps.Component)
          }, { default: () => vue_cjs_prod.h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) }))).default();
        }
      });
    };
  }
});
const defaultPageTransition = { name: "page", mode: "out-in" };
const Button = "_Button_1v4gw_1";
const Button_KindMain = "_Button_KindMain_1v4gw_16";
const Button_KindSecondary = "_Button_KindSecondary_1v4gw_20";
const Button_KindTransparent = "_Button_KindTransparent_1v4gw_24";
const Button_CornersNone = "_Button_CornersNone_1v4gw_28";
const Button_CornersSm = "_Button_CornersSm_1v4gw_31";
const Button_CornersMd = "_Button_CornersMd_1v4gw_34";
const Button_CornersCircle = "_Button_CornersCircle_1v4gw_37";
const $s$p = {
  Button,
  Button_KindMain,
  Button_KindSecondary,
  Button_KindTransparent,
  Button_CornersNone,
  Button_CornersSm,
  Button_CornersMd,
  Button_CornersCircle
};
const _sfc_main$V = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    kind: { default: "Main" },
    corners: { default: "None" },
    type: { default: "button" }
  },
  emits: ["click"],
  setup(__props, { emit: $e }) {
    const $p = __props;
    const buttonClasses = vue_cjs_prod.computed(() => {
      return {
        [$s$p.Button]: true,
        [$s$p[`Button_Kind${$p.kind}`]]: true,
        [$s$p[`Button_Corners${$p.corners}`]]: true
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref(buttonClasses),
        type: $p.type
      }, _attrs))}>`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
});
const _sfc_setup$V = _sfc_main$V.setup;
_sfc_main$V.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Button/Button.vue");
  return _sfc_setup$V ? _sfc_setup$V(props, ctx) : void 0;
};
const Tabs__List = "_Tabs__List_1rb0x_1";
const Tabs__Slider = "_Tabs__Slider_1rb0x_6";
const Tabs__Slide = "_Tabs__Slide_1rb0x_6";
const Tabs__Tab = "_Tabs__Tab_1rb0x_12";
const Tabs__Tab_Selected = "_Tabs__Tab_Selected_1rb0x_27";
const Tabs__Tab_Big = "_Tabs__Tab_Big_1rb0x_32";
const $s$o = {
  Tabs__List,
  Tabs__Slider,
  Tabs__Slide,
  Tabs__Tab,
  Tabs__Tab_Selected,
  Tabs__Tab_Big
};
function isObject$2(obj) {
  return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
}
function extend$2(target = {}, src = {}) {
  Object.keys(src).forEach((key) => {
    if (typeof target[key] === "undefined")
      target[key] = src[key];
    else if (isObject$2(src[key]) && isObject$2(target[key]) && Object.keys(src[key]).length > 0) {
      extend$2(target[key], src[key]);
    }
  });
}
const ssrDocument = {
  body: {},
  addEventListener() {
  },
  removeEventListener() {
  },
  activeElement: {
    blur() {
    },
    nodeName: ""
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {
      }
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {
      },
      getElementsByTagName() {
        return [];
      }
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  }
};
function getDocument() {
  const doc = {};
  extend$2(doc, ssrDocument);
  return doc;
}
const ssrWindow = {
  document: ssrDocument,
  navigator: {
    userAgent: ""
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  },
  history: {
    replaceState() {
    },
    pushState() {
    },
    go() {
    },
    back() {
    }
  },
  CustomEvent: function CustomEvent() {
    return this;
  },
  addEventListener() {
  },
  removeEventListener() {
  },
  getComputedStyle() {
    return {
      getPropertyValue() {
        return "";
      }
    };
  },
  Image() {
  },
  Date() {
  },
  screen: {},
  setTimeout() {
  },
  clearTimeout() {
  },
  matchMedia() {
    return {};
  },
  requestAnimationFrame(callback) {
    if (typeof setTimeout === "undefined") {
      callback();
      return null;
    }
    return setTimeout(callback, 0);
  },
  cancelAnimationFrame(id) {
    if (typeof setTimeout === "undefined") {
      return;
    }
    clearTimeout(id);
  }
};
function getWindow() {
  const win = {};
  extend$2(win, ssrWindow);
  return win;
}
function makeReactive(obj) {
  const proto = obj.__proto__;
  Object.defineProperty(obj, "__proto__", {
    get() {
      return proto;
    },
    set(value) {
      proto.__proto__ = value;
    }
  });
}
class Dom7 extends Array {
  constructor(items) {
    if (typeof items === "number") {
      super(items);
    } else {
      super(...items || []);
      makeReactive(this);
    }
  }
}
function arrayFlat(arr = []) {
  const res = [];
  arr.forEach((el) => {
    if (Array.isArray(el)) {
      res.push(...arrayFlat(el));
    } else {
      res.push(el);
    }
  });
  return res;
}
function arrayFilter(arr, callback) {
  return Array.prototype.filter.call(arr, callback);
}
function arrayUnique(arr) {
  const uniqueArray = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (uniqueArray.indexOf(arr[i]) === -1)
      uniqueArray.push(arr[i]);
  }
  return uniqueArray;
}
function qsa(selector, context) {
  if (typeof selector !== "string") {
    return [selector];
  }
  const a = [];
  const res = context.querySelectorAll(selector);
  for (let i = 0; i < res.length; i += 1) {
    a.push(res[i]);
  }
  return a;
}
function $(selector, context) {
  const window2 = getWindow();
  const document2 = getDocument();
  let arr = [];
  if (!context && selector instanceof Dom7) {
    return selector;
  }
  if (!selector) {
    return new Dom7(arr);
  }
  if (typeof selector === "string") {
    const html2 = selector.trim();
    if (html2.indexOf("<") >= 0 && html2.indexOf(">") >= 0) {
      let toCreate = "div";
      if (html2.indexOf("<li") === 0)
        toCreate = "ul";
      if (html2.indexOf("<tr") === 0)
        toCreate = "tbody";
      if (html2.indexOf("<td") === 0 || html2.indexOf("<th") === 0)
        toCreate = "tr";
      if (html2.indexOf("<tbody") === 0)
        toCreate = "table";
      if (html2.indexOf("<option") === 0)
        toCreate = "select";
      const tempParent = document2.createElement(toCreate);
      tempParent.innerHTML = html2;
      for (let i = 0; i < tempParent.childNodes.length; i += 1) {
        arr.push(tempParent.childNodes[i]);
      }
    } else {
      arr = qsa(selector.trim(), context || document2);
    }
  } else if (selector.nodeType || selector === window2 || selector === document2) {
    arr.push(selector);
  } else if (Array.isArray(selector)) {
    if (selector instanceof Dom7)
      return selector;
    arr = selector;
  }
  return new Dom7(arrayUnique(arr));
}
$.fn = Dom7.prototype;
function addClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  this.forEach((el) => {
    el.classList.add(...classNames);
  });
  return this;
}
function removeClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  this.forEach((el) => {
    el.classList.remove(...classNames);
  });
  return this;
}
function toggleClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  this.forEach((el) => {
    classNames.forEach((className) => {
      el.classList.toggle(className);
    });
  });
}
function hasClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  return arrayFilter(this, (el) => {
    return classNames.filter((className) => el.classList.contains(className)).length > 0;
  }).length > 0;
}
function attr(attrs, value) {
  if (arguments.length === 1 && typeof attrs === "string") {
    if (this[0])
      return this[0].getAttribute(attrs);
    return void 0;
  }
  for (let i = 0; i < this.length; i += 1) {
    if (arguments.length === 2) {
      this[i].setAttribute(attrs, value);
    } else {
      for (const attrName in attrs) {
        this[i][attrName] = attrs[attrName];
        this[i].setAttribute(attrName, attrs[attrName]);
      }
    }
  }
  return this;
}
function removeAttr(attr2) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].removeAttribute(attr2);
  }
  return this;
}
function transform(transform2) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transform = transform2;
  }
  return this;
}
function transition$1(duration) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transitionDuration = typeof duration !== "string" ? `${duration}ms` : duration;
  }
  return this;
}
function on(...args) {
  let [eventType, targetSelector, listener, capture] = args;
  if (typeof args[1] === "function") {
    [eventType, listener, capture] = args;
    targetSelector = void 0;
  }
  if (!capture)
    capture = false;
  function handleLiveEvent(e) {
    const target = e.target;
    if (!target)
      return;
    const eventData = e.target.dom7EventData || [];
    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }
    if ($(target).is(targetSelector))
      listener.apply(target, eventData);
    else {
      const parents2 = $(target).parents();
      for (let k = 0; k < parents2.length; k += 1) {
        if ($(parents2[k]).is(targetSelector))
          listener.apply(parents2[k], eventData);
      }
    }
  }
  function handleEvent(e) {
    const eventData = e && e.target ? e.target.dom7EventData || [] : [];
    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }
    listener.apply(this, eventData);
  }
  const events2 = eventType.split(" ");
  let j;
  for (let i = 0; i < this.length; i += 1) {
    const el = this[i];
    if (!targetSelector) {
      for (j = 0; j < events2.length; j += 1) {
        const event = events2[j];
        if (!el.dom7Listeners)
          el.dom7Listeners = {};
        if (!el.dom7Listeners[event])
          el.dom7Listeners[event] = [];
        el.dom7Listeners[event].push({
          listener,
          proxyListener: handleEvent
        });
        el.addEventListener(event, handleEvent, capture);
      }
    } else {
      for (j = 0; j < events2.length; j += 1) {
        const event = events2[j];
        if (!el.dom7LiveListeners)
          el.dom7LiveListeners = {};
        if (!el.dom7LiveListeners[event])
          el.dom7LiveListeners[event] = [];
        el.dom7LiveListeners[event].push({
          listener,
          proxyListener: handleLiveEvent
        });
        el.addEventListener(event, handleLiveEvent, capture);
      }
    }
  }
  return this;
}
function off(...args) {
  let [eventType, targetSelector, listener, capture] = args;
  if (typeof args[1] === "function") {
    [eventType, listener, capture] = args;
    targetSelector = void 0;
  }
  if (!capture)
    capture = false;
  const events2 = eventType.split(" ");
  for (let i = 0; i < events2.length; i += 1) {
    const event = events2[i];
    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];
      let handlers;
      if (!targetSelector && el.dom7Listeners) {
        handlers = el.dom7Listeners[event];
      } else if (targetSelector && el.dom7LiveListeners) {
        handlers = el.dom7LiveListeners[event];
      }
      if (handlers && handlers.length) {
        for (let k = handlers.length - 1; k >= 0; k -= 1) {
          const handler = handlers[k];
          if (listener && handler.listener === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (!listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          }
        }
      }
    }
  }
  return this;
}
function trigger(...args) {
  const window2 = getWindow();
  const events2 = args[0].split(" ");
  const eventData = args[1];
  for (let i = 0; i < events2.length; i += 1) {
    const event = events2[i];
    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];
      if (window2.CustomEvent) {
        const evt = new window2.CustomEvent(event, {
          detail: eventData,
          bubbles: true,
          cancelable: true
        });
        el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
        el.dispatchEvent(evt);
        el.dom7EventData = [];
        delete el.dom7EventData;
      }
    }
  }
  return this;
}
function transitionEnd$1(callback) {
  const dom = this;
  function fireCallBack(e) {
    if (e.target !== this)
      return;
    callback.call(this, e);
    dom.off("transitionend", fireCallBack);
  }
  if (callback) {
    dom.on("transitionend", fireCallBack);
  }
  return this;
}
function outerWidth(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles2 = this.styles();
      return this[0].offsetWidth + parseFloat(styles2.getPropertyValue("margin-right")) + parseFloat(styles2.getPropertyValue("margin-left"));
    }
    return this[0].offsetWidth;
  }
  return null;
}
function outerHeight(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles2 = this.styles();
      return this[0].offsetHeight + parseFloat(styles2.getPropertyValue("margin-top")) + parseFloat(styles2.getPropertyValue("margin-bottom"));
    }
    return this[0].offsetHeight;
  }
  return null;
}
function offset() {
  if (this.length > 0) {
    const window2 = getWindow();
    const document2 = getDocument();
    const el = this[0];
    const box = el.getBoundingClientRect();
    const body = document2.body;
    const clientTop = el.clientTop || body.clientTop || 0;
    const clientLeft = el.clientLeft || body.clientLeft || 0;
    const scrollTop = el === window2 ? window2.scrollY : el.scrollTop;
    const scrollLeft = el === window2 ? window2.scrollX : el.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }
  return null;
}
function styles() {
  const window2 = getWindow();
  if (this[0])
    return window2.getComputedStyle(this[0], null);
  return {};
}
function css(props, value) {
  const window2 = getWindow();
  let i;
  if (arguments.length === 1) {
    if (typeof props === "string") {
      if (this[0])
        return window2.getComputedStyle(this[0], null).getPropertyValue(props);
    } else {
      for (i = 0; i < this.length; i += 1) {
        for (const prop in props) {
          this[i].style[prop] = props[prop];
        }
      }
      return this;
    }
  }
  if (arguments.length === 2 && typeof props === "string") {
    for (i = 0; i < this.length; i += 1) {
      this[i].style[props] = value;
    }
    return this;
  }
  return this;
}
function each(callback) {
  if (!callback)
    return this;
  this.forEach((el, index2) => {
    callback.apply(el, [el, index2]);
  });
  return this;
}
function filter(callback) {
  const result = arrayFilter(this, callback);
  return $(result);
}
function html(html2) {
  if (typeof html2 === "undefined") {
    return this[0] ? this[0].innerHTML : null;
  }
  for (let i = 0; i < this.length; i += 1) {
    this[i].innerHTML = html2;
  }
  return this;
}
function text(text2) {
  if (typeof text2 === "undefined") {
    return this[0] ? this[0].textContent.trim() : null;
  }
  for (let i = 0; i < this.length; i += 1) {
    this[i].textContent = text2;
  }
  return this;
}
function is(selector) {
  const window2 = getWindow();
  const document2 = getDocument();
  const el = this[0];
  let compareWith;
  let i;
  if (!el || typeof selector === "undefined")
    return false;
  if (typeof selector === "string") {
    if (el.matches)
      return el.matches(selector);
    if (el.webkitMatchesSelector)
      return el.webkitMatchesSelector(selector);
    if (el.msMatchesSelector)
      return el.msMatchesSelector(selector);
    compareWith = $(selector);
    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el)
        return true;
    }
    return false;
  }
  if (selector === document2) {
    return el === document2;
  }
  if (selector === window2) {
    return el === window2;
  }
  if (selector.nodeType || selector instanceof Dom7) {
    compareWith = selector.nodeType ? [selector] : selector;
    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el)
        return true;
    }
    return false;
  }
  return false;
}
function index$4() {
  let child = this[0];
  let i;
  if (child) {
    i = 0;
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1)
        i += 1;
    }
    return i;
  }
  return void 0;
}
function eq(index2) {
  if (typeof index2 === "undefined")
    return this;
  const length = this.length;
  if (index2 > length - 1) {
    return $([]);
  }
  if (index2 < 0) {
    const returnIndex = length + index2;
    if (returnIndex < 0)
      return $([]);
    return $([this[returnIndex]]);
  }
  return $([this[index2]]);
}
function append(...els) {
  let newChild;
  const document2 = getDocument();
  for (let k = 0; k < els.length; k += 1) {
    newChild = els[k];
    for (let i = 0; i < this.length; i += 1) {
      if (typeof newChild === "string") {
        const tempDiv = document2.createElement("div");
        tempDiv.innerHTML = newChild;
        while (tempDiv.firstChild) {
          this[i].appendChild(tempDiv.firstChild);
        }
      } else if (newChild instanceof Dom7) {
        for (let j = 0; j < newChild.length; j += 1) {
          this[i].appendChild(newChild[j]);
        }
      } else {
        this[i].appendChild(newChild);
      }
    }
  }
  return this;
}
function prepend(newChild) {
  const document2 = getDocument();
  let i;
  let j;
  for (i = 0; i < this.length; i += 1) {
    if (typeof newChild === "string") {
      const tempDiv = document2.createElement("div");
      tempDiv.innerHTML = newChild;
      for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
        this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
      }
    } else if (newChild instanceof Dom7) {
      for (j = 0; j < newChild.length; j += 1) {
        this[i].insertBefore(newChild[j], this[i].childNodes[0]);
      }
    } else {
      this[i].insertBefore(newChild, this[i].childNodes[0]);
    }
  }
  return this;
}
function next(selector) {
  if (this.length > 0) {
    if (selector) {
      if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
        return $([this[0].nextElementSibling]);
      }
      return $([]);
    }
    if (this[0].nextElementSibling)
      return $([this[0].nextElementSibling]);
    return $([]);
  }
  return $([]);
}
function nextAll(selector) {
  const nextEls = [];
  let el = this[0];
  if (!el)
    return $([]);
  while (el.nextElementSibling) {
    const next2 = el.nextElementSibling;
    if (selector) {
      if ($(next2).is(selector))
        nextEls.push(next2);
    } else
      nextEls.push(next2);
    el = next2;
  }
  return $(nextEls);
}
function prev(selector) {
  if (this.length > 0) {
    const el = this[0];
    if (selector) {
      if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
        return $([el.previousElementSibling]);
      }
      return $([]);
    }
    if (el.previousElementSibling)
      return $([el.previousElementSibling]);
    return $([]);
  }
  return $([]);
}
function prevAll(selector) {
  const prevEls = [];
  let el = this[0];
  if (!el)
    return $([]);
  while (el.previousElementSibling) {
    const prev2 = el.previousElementSibling;
    if (selector) {
      if ($(prev2).is(selector))
        prevEls.push(prev2);
    } else
      prevEls.push(prev2);
    el = prev2;
  }
  return $(prevEls);
}
function parent(selector) {
  const parents2 = [];
  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode !== null) {
      if (selector) {
        if ($(this[i].parentNode).is(selector))
          parents2.push(this[i].parentNode);
      } else {
        parents2.push(this[i].parentNode);
      }
    }
  }
  return $(parents2);
}
function parents(selector) {
  const parents2 = [];
  for (let i = 0; i < this.length; i += 1) {
    let parent2 = this[i].parentNode;
    while (parent2) {
      if (selector) {
        if ($(parent2).is(selector))
          parents2.push(parent2);
      } else {
        parents2.push(parent2);
      }
      parent2 = parent2.parentNode;
    }
  }
  return $(parents2);
}
function closest(selector) {
  let closest2 = this;
  if (typeof selector === "undefined") {
    return $([]);
  }
  if (!closest2.is(selector)) {
    closest2 = closest2.parents(selector).eq(0);
  }
  return closest2;
}
function find(selector) {
  const foundElements = [];
  for (let i = 0; i < this.length; i += 1) {
    const found = this[i].querySelectorAll(selector);
    for (let j = 0; j < found.length; j += 1) {
      foundElements.push(found[j]);
    }
  }
  return $(foundElements);
}
function children(selector) {
  const children2 = [];
  for (let i = 0; i < this.length; i += 1) {
    const childNodes = this[i].children;
    for (let j = 0; j < childNodes.length; j += 1) {
      if (!selector || $(childNodes[j]).is(selector)) {
        children2.push(childNodes[j]);
      }
    }
  }
  return $(children2);
}
function remove() {
  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode)
      this[i].parentNode.removeChild(this[i]);
  }
  return this;
}
const Methods = {
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  attr,
  removeAttr,
  transform,
  transition: transition$1,
  on,
  off,
  trigger,
  transitionEnd: transitionEnd$1,
  outerWidth,
  outerHeight,
  styles,
  offset,
  css,
  each,
  html,
  text,
  is,
  index: index$4,
  eq,
  append,
  prepend,
  next,
  nextAll,
  prev,
  prevAll,
  parent,
  parents,
  closest,
  find,
  children,
  filter,
  remove
};
Object.keys(Methods).forEach((methodName) => {
  Object.defineProperty($.fn, methodName, {
    value: Methods[methodName],
    writable: true
  });
});
function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach((key) => {
    try {
      object[key] = null;
    } catch (e) {
    }
    try {
      delete object[key];
    } catch (e) {
    }
  });
}
function nextTick(callback, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return setTimeout(callback, delay);
}
function now() {
  return Date.now();
}
function getComputedStyle$1(el) {
  const window2 = getWindow();
  let style;
  if (window2.getComputedStyle) {
    style = window2.getComputedStyle(el, null);
  }
  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }
  if (!style) {
    style = el.style;
  }
  return style;
}
function getTranslate(el, axis) {
  if (axis === void 0) {
    axis = "x";
  }
  const window2 = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle$1(el);
  if (window2.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(",").length > 6) {
      curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
    }
    transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
    matrix = transformMatrix.toString().split(",");
  }
  if (axis === "x") {
    if (window2.WebKitCSSMatrix)
      curTransform = transformMatrix.m41;
    else if (matrix.length === 16)
      curTransform = parseFloat(matrix[12]);
    else
      curTransform = parseFloat(matrix[4]);
  }
  if (axis === "y") {
    if (window2.WebKitCSSMatrix)
      curTransform = transformMatrix.m42;
    else if (matrix.length === 16)
      curTransform = parseFloat(matrix[13]);
    else
      curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
function isObject$1(o) {
  return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
}
function isNode(node) {
  return node && (node.nodeType === 1 || node.nodeType === 11);
}
function extend$1() {
  const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
  const noExtend = ["__proto__", "constructor", "prototype"];
  for (let i = 1; i < arguments.length; i += 1) {
    const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
    if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter((key) => noExtend.indexOf(key) < 0);
      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== void 0 && desc.enumerable) {
          if (isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend$1(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
            to[nextKey] = {};
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend$1(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
}
function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll(_ref) {
  let {
    swiper,
    targetPosition,
    side
  } = _ref;
  const window2 = getWindow();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = "none";
  window2.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? "next" : "prev";
  const isOutOfBound = (current, target) => {
    return dir === "next" && current >= target || dir === "prev" && current <= target;
  };
  const animate = () => {
    time = new Date().getTime();
    if (startTime === null) {
      startTime = time;
    }
    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }
    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });
    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = "hidden";
      swiper.wrapperEl.style.scrollSnapType = "";
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = "";
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window2.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }
    swiper.cssModeFrameID = window2.requestAnimationFrame(animate);
  };
  animate();
}
let support;
function calcSupport() {
  const window2 = getWindow();
  const document2 = getDocument();
  return {
    smoothScroll: document2.documentElement && "scrollBehavior" in document2.documentElement.style,
    touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch),
    passiveListener: function checkPassiveListener() {
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, "passive", {
          get() {
            supportsPassive = true;
          }
        });
        window2.addEventListener("testPassiveListener", null, opts);
      } catch (e) {
      }
      return supportsPassive;
    }(),
    gestures: function checkGestures() {
      return "ongesturestart" in window2;
    }()
  };
}
function getSupport() {
  if (!support) {
    support = calcSupport();
  }
  return support;
}
let deviceCached;
function calcDevice(_temp) {
  let {
    userAgent
  } = _temp === void 0 ? {} : _temp;
  const support2 = getSupport();
  const window2 = getWindow();
  const platform = window2.navigator.platform;
  const ua = userAgent || window2.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window2.screen.width;
  const screenHeight = window2.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === "Win32";
  let macos = platform === "MacIntel";
  const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
  if (!ipad && macos && support2.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad)
      ipad = [0, 1, "13_0_0"];
    macos = false;
  }
  if (android && !windows) {
    device.os = "android";
    device.android = true;
  }
  if (ipad || iphone || ipod) {
    device.os = "ios";
    device.ios = true;
  }
  return device;
}
function getDevice(overrides) {
  if (overrides === void 0) {
    overrides = {};
  }
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }
  return deviceCached;
}
let browser;
function calcBrowser() {
  const window2 = getWindow();
  function isSafari() {
    const ua = window2.navigator.userAgent.toLowerCase();
    return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
  }
  return {
    isSafari: isSafari(),
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent)
  };
}
function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }
  return browser;
}
function Resize(_ref) {
  let {
    swiper,
    on: on2,
    emit
  } = _ref;
  const window2 = getWindow();
  let observer = null;
  let animationFrame = null;
  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    emit("beforeResize");
    emit("resize");
  };
  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    observer = new ResizeObserver((entries) => {
      animationFrame = window2.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach((_ref2) => {
          let {
            contentBoxSize,
            contentRect,
            target
          } = _ref2;
          if (target && target !== swiper.el)
            return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };
  const removeObserver = () => {
    if (animationFrame) {
      window2.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };
  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    emit("orientationchange");
  };
  on2("init", () => {
    if (swiper.params.resizeObserver && "undefined".ResizeObserver !== "undefined") {
      createObserver();
      return;
    }
    window2.addEventListener("resize", resizeHandler);
    window2.addEventListener("orientationchange", orientationChangeHandler);
  });
  on2("destroy", () => {
    removeObserver();
    window2.removeEventListener("resize", resizeHandler);
    window2.removeEventListener("orientationchange", orientationChangeHandler);
  });
}
function Observer(_ref) {
  let {
    swiper,
    extendParams,
    on: on2,
    emit
  } = _ref;
  const observers = [];
  const window2 = getWindow();
  const attach = function(target, options) {
    if (options === void 0) {
      options = {};
    }
    const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
    const observer = new ObserverFunc((mutations) => {
      if (mutations.length === 1) {
        emit("observerUpdate", mutations[0]);
        return;
      }
      const observerUpdate = function observerUpdate2() {
        emit("observerUpdate", mutations[0]);
      };
      if (window2.requestAnimationFrame) {
        window2.requestAnimationFrame(observerUpdate);
      } else {
        window2.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === "undefined" ? true : options.attributes,
      childList: typeof options.childList === "undefined" ? true : options.childList,
      characterData: typeof options.characterData === "undefined" ? true : options.characterData
    });
    observers.push(observer);
  };
  const init = () => {
    if (!swiper.params.observer)
      return;
    if (swiper.params.observeParents) {
      const containerParents = swiper.$el.parents();
      for (let i = 0; i < containerParents.length; i += 1) {
        attach(containerParents[i]);
      }
    }
    attach(swiper.$el[0], {
      childList: swiper.params.observeSlideChildren
    });
    attach(swiper.$wrapperEl[0], {
      attributes: false
    });
  };
  const destroy = () => {
    observers.forEach((observer) => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };
  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on2("init", init);
  on2("destroy", destroy);
}
const eventsEmitter = {
  on(events2, handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler !== "function")
      return self2;
    const method = priority ? "unshift" : "push";
    events2.split(" ").forEach((event) => {
      if (!self2.eventsListeners[event])
        self2.eventsListeners[event] = [];
      self2.eventsListeners[event][method](handler);
    });
    return self2;
  },
  once(events2, handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler !== "function")
      return self2;
    function onceHandler() {
      self2.off(events2, onceHandler);
      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      handler.apply(self2, args);
    }
    onceHandler.__emitterProxy = handler;
    return self2.on(events2, onceHandler, priority);
  },
  onAny(handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler !== "function")
      return self2;
    const method = priority ? "unshift" : "push";
    if (self2.eventsAnyListeners.indexOf(handler) < 0) {
      self2.eventsAnyListeners[method](handler);
    }
    return self2;
  },
  offAny(handler) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsAnyListeners)
      return self2;
    const index2 = self2.eventsAnyListeners.indexOf(handler);
    if (index2 >= 0) {
      self2.eventsAnyListeners.splice(index2, 1);
    }
    return self2;
  },
  off(events2, handler) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsListeners)
      return self2;
    events2.split(" ").forEach((event) => {
      if (typeof handler === "undefined") {
        self2.eventsListeners[event] = [];
      } else if (self2.eventsListeners[event]) {
        self2.eventsListeners[event].forEach((eventHandler, index2) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self2.eventsListeners[event].splice(index2, 1);
          }
        });
      }
    });
    return self2;
  },
  emit() {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsListeners)
      return self2;
    let events2;
    let data;
    let context;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      events2 = args[0];
      data = args.slice(1, args.length);
      context = self2;
    } else {
      events2 = args[0].events;
      data = args[0].data;
      context = args[0].context || self2;
    }
    data.unshift(context);
    const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
    eventsArray.forEach((event) => {
      if (self2.eventsAnyListeners && self2.eventsAnyListeners.length) {
        self2.eventsAnyListeners.forEach((eventHandler) => {
          eventHandler.apply(context, [event, ...data]);
        });
      }
      if (self2.eventsListeners && self2.eventsListeners[event]) {
        self2.eventsListeners[event].forEach((eventHandler) => {
          eventHandler.apply(context, data);
        });
      }
    });
    return self2;
  }
};
function updateSize() {
  const swiper = this;
  let width;
  let height;
  const $el = swiper.$el;
  if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = $el[0].clientWidth;
  }
  if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = $el[0].clientHeight;
  }
  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  }
  width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
  height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
  if (Number.isNaN(width))
    width = 0;
  if (Number.isNaN(height))
    height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}
function updateSlides() {
  const swiper = this;
  function getDirectionLabel(property) {
    if (swiper.isHorizontal()) {
      return property;
    }
    return {
      "width": "height",
      "margin-top": "margin-left",
      "margin-bottom ": "margin-right",
      "margin-left": "margin-top",
      "margin-right": "margin-bottom",
      "padding-left": "padding-top",
      "padding-right": "padding-bottom",
      "marginRight": "marginBottom"
    }[property];
  }
  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
  }
  const params = swiper.params;
  const {
    $wrapperEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === "function") {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }
  let offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === "function") {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }
  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index2 = 0;
  if (typeof swiperSize === "undefined") {
    return;
  }
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
  }
  swiper.virtualSize = -spaceBetween;
  if (rtl)
    slides.css({
      marginLeft: "",
      marginBottom: "",
      marginTop: ""
    });
  else
    slides.css({
      marginRight: "",
      marginBottom: "",
      marginTop: ""
    });
  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
  }
  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
  if (gridEnabled) {
    swiper.grid.initSlides(slidesLength);
  }
  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
    return typeof params.breakpoints[key].slidesPerView !== "undefined";
  }).length > 0;
  for (let i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    const slide2 = slides.eq(i);
    if (gridEnabled) {
      swiper.grid.updateSlide(i, slide2, slidesLength, getDirectionLabel);
    }
    if (slide2.css("display") === "none")
      continue;
    if (params.slidesPerView === "auto") {
      if (shouldResetSlideSize) {
        slides[i].style[getDirectionLabel("width")] = ``;
      }
      const slideStyles = getComputedStyle(slide2[0]);
      const currentTransform = slide2[0].style.transform;
      const currentWebKitTransform = slide2[0].style.webkitTransform;
      if (currentTransform) {
        slide2[0].style.transform = "none";
      }
      if (currentWebKitTransform) {
        slide2[0].style.webkitTransform = "none";
      }
      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? slide2.outerWidth(true) : slide2.outerHeight(true);
      } else {
        const width = getDirectionPropertyValue(slideStyles, "width");
        const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
        const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
        const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
        const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
        const boxSizing = slideStyles.getPropertyValue("box-sizing");
        if (boxSizing && boxSizing === "border-box") {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide2[0];
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }
      if (currentTransform) {
        slide2[0].style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        slide2[0].style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths)
        slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths)
        slideSize = Math.floor(slideSize);
      if (slides[i]) {
        slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
      }
    }
    if (slides[i]) {
      slides[i].swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);
    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1e3)
        slidePosition = 0;
      if (params.roundLengths)
        slidePosition = Math.floor(slidePosition);
      if (index2 % params.slidesPerGroup === 0)
        snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths)
        slidePosition = Math.floor(slidePosition);
      if ((index2 - Math.min(swiper.params.slidesPerGroupSkip, index2)) % swiper.params.slidesPerGroup === 0)
        snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }
    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index2 += 1;
  }
  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
    $wrapperEl.css({
      width: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }
  if (params.setWrapperSize) {
    $wrapperEl.css({
      [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }
  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
  }
  if (!params.centeredSlides) {
    const newSlidesGrid = [];
    for (let i = 0; i < snapGrid.length; i += 1) {
      let slidesGridItem = snapGrid[i];
      if (params.roundLengths)
        slidesGridItem = Math.floor(slidesGridItem);
      if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }
  if (snapGrid.length === 0)
    snapGrid = [0];
  if (params.spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
    slides.filter((_, slideIndex) => {
      if (!params.cssMode)
        return true;
      if (slideIndex === slides.length - 1) {
        return false;
      }
      return true;
    }).css({
      [key]: `${spaceBetween}px`
    });
  }
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    const maxSnap = allSlidesSize - swiperSize;
    snapGrid = snapGrid.map((snap) => {
      if (snap < 0)
        return -offsetBefore;
      if (snap > maxSnap)
        return maxSnap + offsetAfter;
      return snap;
    });
  }
  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    if (allSlidesSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }
  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });
  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
  }
  if (slidesLength !== previousSlidesLength) {
    swiper.emit("slidesLengthChange");
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow)
      swiper.checkOverflow();
    swiper.emit("snapGridLengthChange");
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit("slidesGridLengthChange");
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded)
        swiper.$el.addClass(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.$el.removeClass(backFaceHiddenClass);
    }
  }
}
function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i;
  if (typeof speed === "number") {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }
  const getSlideByIndex = (index2) => {
    if (isVirtual) {
      return swiper.slides.filter((el) => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index2)[0];
    }
    return swiper.slides.eq(index2)[0];
  };
  if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || $([])).each((slide2) => {
        activeSlides.push(slide2);
      });
    } else {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        const index2 = swiper.activeIndex + i;
        if (index2 > swiper.slides.length && !isVirtual)
          break;
        activeSlides.push(getSlideByIndex(index2));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  }
  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== "undefined") {
      const height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }
  if (newHeight || newHeight === 0)
    swiper.$wrapperEl.css("height", `${newHeight}px`);
}
function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;
  for (let i = 0; i < slides.length; i += 1) {
    slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
  }
}
function updateSlidesProgress(translate2) {
  if (translate2 === void 0) {
    translate2 = this && this.translate || 0;
  }
  const swiper = this;
  const params = swiper.params;
  const {
    slides,
    rtlTranslate: rtl,
    snapGrid
  } = swiper;
  if (slides.length === 0)
    return;
  if (typeof slides[0].swiperSlideOffset === "undefined")
    swiper.updateSlidesOffset();
  let offsetCenter = -translate2;
  if (rtl)
    offsetCenter = translate2;
  slides.removeClass(params.slideVisibleClass);
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];
  for (let i = 0; i < slides.length; i += 1) {
    const slide2 = slides[i];
    let slideOffset = slide2.swiperSlideOffset;
    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }
    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + params.spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + params.spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
    if (isVisible) {
      swiper.visibleSlides.push(slide2);
      swiper.visibleSlidesIndexes.push(i);
      slides.eq(i).addClass(params.slideVisibleClass);
    }
    slide2.progress = rtl ? -slideProgress : slideProgress;
    slide2.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }
  swiper.visibleSlides = $(swiper.visibleSlides);
}
function updateProgress(translate2) {
  const swiper = this;
  if (typeof translate2 === "undefined") {
    const multiplier = swiper.rtlTranslate ? -1 : 1;
    translate2 = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }
  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate2 - swiper.minTranslate()) / translatesDiff;
    isBeginning = progress <= 0;
    isEnd = progress >= 1;
  }
  Object.assign(swiper, {
    progress,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight)
    swiper.updateSlidesProgress(translate2);
  if (isBeginning && !wasBeginning) {
    swiper.emit("reachBeginning toEdge");
  }
  if (isEnd && !wasEnd) {
    swiper.emit("reachEnd toEdge");
  }
  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit("fromEdge");
  }
  swiper.emit("progress", progress);
}
function updateSlidesClasses() {
  const swiper = this;
  const {
    slides,
    params,
    $wrapperEl,
    activeIndex,
    realIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
  let activeSlide;
  if (isVirtual) {
    activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
  } else {
    activeSlide = slides.eq(activeIndex);
  }
  activeSlide.addClass(params.slideActiveClass);
  if (params.loop) {
    if (activeSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    }
  }
  let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
  if (params.loop && nextSlide.length === 0) {
    nextSlide = slides.eq(0);
    nextSlide.addClass(params.slideNextClass);
  }
  let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
  if (params.loop && prevSlide.length === 0) {
    prevSlide = slides.eq(-1);
    prevSlide.addClass(params.slidePrevClass);
  }
  if (params.loop) {
    if (nextSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
    }
    if (prevSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
    }
  }
  swiper.emitSlidesClasses();
}
function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    slidesGrid,
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;
  if (typeof activeIndex === "undefined") {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate2 >= slidesGrid[i]) {
        activeIndex = i;
      }
    }
    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === "undefined")
        activeIndex = 0;
    }
  }
  if (snapGrid.indexOf(translate2) >= 0) {
    snapIndex = snapGrid.indexOf(translate2);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length)
    snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit("snapIndexChange");
    }
    return;
  }
  const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
  Object.assign(swiper, {
    snapIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  swiper.emit("activeIndexChange");
  swiper.emit("snapIndexChange");
  if (previousRealIndex !== realIndex) {
    swiper.emit("realIndexChange");
  }
  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    swiper.emit("slideChange");
  }
}
function updateClickedSlide(e) {
  const swiper = this;
  const params = swiper.params;
  const slide2 = $(e).closest(`.${params.slideClass}`)[0];
  let slideFound = false;
  let slideIndex;
  if (slide2) {
    for (let i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide2) {
        slideFound = true;
        slideIndex = i;
        break;
      }
    }
  }
  if (slide2 && slideFound) {
    swiper.clickedSlide = slide2;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt($(slide2).attr("data-swiper-slide-index"), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = void 0;
    swiper.clickedIndex = void 0;
    return;
  }
  if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}
const update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};
function getSwiperTranslate(axis) {
  if (axis === void 0) {
    axis = this.isHorizontal() ? "x" : "y";
  }
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate: translate2,
    $wrapperEl
  } = swiper;
  if (params.virtualTranslate) {
    return rtl ? -translate2 : translate2;
  }
  if (params.cssMode) {
    return translate2;
  }
  let currentTranslate = getTranslate($wrapperEl[0], axis);
  if (rtl)
    currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}
function setTranslate(translate2, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl,
    params,
    $wrapperEl,
    wrapperEl,
    progress
  } = swiper;
  let x = 0;
  let y = 0;
  const z = 0;
  if (swiper.isHorizontal()) {
    x = rtl ? -translate2 : translate2;
  } else {
    y = translate2;
  }
  if (params.roundLengths) {
    x = Math.floor(x);
    y = Math.floor(y);
  }
  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y;
  } else if (!params.virtualTranslate) {
    $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
  }
  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x : y;
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate2 - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper.updateProgress(translate2);
  }
  swiper.emit("setTranslate", swiper.translate, byController);
}
function minTranslate() {
  return -this.snapGrid[0];
}
function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
function translateTo(translate2, speed, runCallbacks, translateBounds, internal) {
  if (translate2 === void 0) {
    translate2 = 0;
  }
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (translateBounds === void 0) {
    translateBounds = true;
  }
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  const minTranslate2 = swiper.minTranslate();
  const maxTranslate2 = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate2 > minTranslate2)
    newTranslate = minTranslate2;
  else if (translateBounds && translate2 < maxTranslate2)
    newTranslate = maxTranslate2;
  else
    newTranslate = translate2;
  swiper.updateProgress(newTranslate);
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    if (speed === 0) {
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: -newTranslate,
        behavior: "smooth"
      });
    }
    return true;
  }
  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionEnd");
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionStart");
    }
    if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd2(e) {
          if (!swiper || swiper.destroyed)
            return;
          if (e.target !== this)
            return;
          swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;
          if (runCallbacks) {
            swiper.emit("transitionEnd");
          }
        };
      }
      swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
      swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
    }
  }
  return true;
}
const translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};
function setTransition(duration, byController) {
  const swiper = this;
  if (!swiper.params.cssMode) {
    swiper.$wrapperEl.transition(duration);
  }
  swiper.emit("setTransition", duration, byController);
}
function transitionEmit(_ref) {
  let {
    swiper,
    runCallbacks,
    direction,
    step
  } = _ref;
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex)
      dir = "next";
    else if (activeIndex < previousIndex)
      dir = "prev";
    else
      dir = "reset";
  }
  swiper.emit(`transition${step}`);
  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === "reset") {
      swiper.emit(`slideResetTransition${step}`);
      return;
    }
    swiper.emit(`slideChangeTransition${step}`);
    if (dir === "next") {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}
function transitionStart(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode)
    return;
  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "Start"
  });
}
function transitionEnd(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode)
    return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "End"
  });
}
const transition = {
  setTransition,
  transitionStart,
  transitionEnd
};
function slideTo(index2, speed, runCallbacks, internal, initial) {
  if (index2 === void 0) {
    index2 = 0;
  }
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (typeof index2 !== "number" && typeof index2 !== "string") {
    throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index2}] given.`);
  }
  if (typeof index2 === "string") {
    const indexAsNumber = parseInt(index2, 10);
    const isValidNumber = isFinite(indexAsNumber);
    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index2}] given.`);
    }
    index2 = indexAsNumber;
  }
  const swiper = this;
  let slideIndex = index2;
  if (slideIndex < 0)
    slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
    return false;
  }
  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length)
    snapIndex = snapGrid.length - 1;
  if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
    swiper.emit("beforeSlideChangeStart");
  }
  const translate2 = -snapGrid[snapIndex];
  swiper.updateProgress(translate2);
  if (params.normalizeSlideIndex) {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      const normalizedTranslate = -Math.floor(translate2 * 100);
      const normalizedGrid = Math.floor(slidesGrid[i] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i;
      }
    }
  }
  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && translate2 < swiper.translate && translate2 < swiper.minTranslate()) {
      return false;
    }
    if (!swiper.allowSlidePrev && translate2 > swiper.translate && translate2 > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex)
        return false;
    }
  }
  let direction;
  if (slideIndex > activeIndex)
    direction = "next";
  else if (slideIndex < activeIndex)
    direction = "prev";
  else
    direction = "reset";
  if (rtl && -translate2 === swiper.translate || !rtl && translate2 === swiper.translate) {
    swiper.updateActiveIndex(slideIndex);
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    swiper.updateSlidesClasses();
    if (params.effect !== "slide") {
      swiper.setTranslate(translate2);
    }
    if (direction !== "reset") {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }
    return false;
  }
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t = rtl ? translate2 : -translate2;
    if (speed === 0) {
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = "none";
        swiper._immediateVirtual = true;
      }
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = "";
          swiper._swiperImmediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: t,
        behavior: "smooth"
      });
    }
    return true;
  }
  swiper.setTransition(speed);
  swiper.setTranslate(translate2);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit("beforeTransitionStart", speed, internal);
  swiper.transitionStart(runCallbacks, direction);
  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;
    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd2(e) {
        if (!swiper || swiper.destroyed)
          return;
        if (e.target !== this)
          return;
        swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
        swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }
    swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
    swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
  }
  return true;
}
function slideToLoop(index2, speed, runCallbacks, internal) {
  if (index2 === void 0) {
    index2 = 0;
  }
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (typeof index2 === "string") {
    const indexAsNumber = parseInt(index2, 10);
    const isValidNumber = isFinite(indexAsNumber);
    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index2}] given.`);
    }
    index2 = indexAsNumber;
  }
  const swiper = this;
  let newIndex = index2;
  if (swiper.params.loop) {
    newIndex += swiper.loopedSlides;
  }
  return swiper.slideTo(newIndex, speed, runCallbacks, internal);
}
function slideNext(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    animating,
    enabled,
    params
  } = swiper;
  if (!enabled)
    return swiper;
  let perGroup = params.slidesPerGroup;
  if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
  }
  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
  if (params.loop) {
    if (animating && params.loopPreventsSlide)
      return false;
    swiper.loopFix();
    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }
  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }
  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}
function slidePrev(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params,
    animating,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled)
    return swiper;
  if (params.loop) {
    if (animating && params.loopPreventsSlide)
      return false;
    swiper.loopFix();
    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }
  const translate2 = rtlTranslate ? swiper.translate : -swiper.translate;
  function normalize(val) {
    if (val < 0)
      return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }
  const normalizedTranslate = normalize(translate2);
  const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  if (typeof prevSnap === "undefined" && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        prevSnapIndex = snapIndex;
      }
    });
    if (typeof prevSnapIndex !== "undefined") {
      prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }
  let prevIndex = 0;
  if (typeof prevSnap !== "undefined") {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0)
      prevIndex = swiper.activeIndex - 1;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }
  if (params.rewind && swiper.isBeginning) {
    const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  }
  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}
function slideReset(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}
function slideToClosest(speed, runCallbacks, internal, threshold) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (threshold === void 0) {
    threshold = 0.5;
  }
  const swiper = this;
  let index2 = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index2);
  const snapIndex = skip + Math.floor((index2 - skip) / swiper.params.slidesPerGroup);
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  if (translate2 >= swiper.snapGrid[snapIndex]) {
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];
    if (translate2 - currentSnap > (nextSnap - currentSnap) * threshold) {
      index2 += swiper.params.slidesPerGroup;
    }
  } else {
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];
    if (translate2 - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index2 -= swiper.params.slidesPerGroup;
    }
  }
  index2 = Math.max(index2, 0);
  index2 = Math.min(index2, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index2, speed, runCallbacks, internal);
}
function slideToClickedSlide() {
  const swiper = this;
  const {
    params,
    $wrapperEl
  } = swiper;
  const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.clickedIndex;
  let realIndex;
  if (params.loop) {
    if (swiper.animating)
      return;
    realIndex = parseInt($(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}
const slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};
function loopCreate() {
  const swiper = this;
  const document2 = getDocument();
  const {
    params,
    $wrapperEl
  } = swiper;
  const $selector = $wrapperEl.children().length > 0 ? $($wrapperEl.children()[0].parentNode) : $wrapperEl;
  $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
  let slides = $selector.children(`.${params.slideClass}`);
  if (params.loopFillGroupWithBlank) {
    const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
    if (blankSlidesNum !== params.slidesPerGroup) {
      for (let i = 0; i < blankSlidesNum; i += 1) {
        const blankNode = $(document2.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
        $selector.append(blankNode);
      }
      slides = $selector.children(`.${params.slideClass}`);
    }
  }
  if (params.slidesPerView === "auto" && !params.loopedSlides)
    params.loopedSlides = slides.length;
  swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
  swiper.loopedSlides += params.loopAdditionalSlides;
  if (swiper.loopedSlides > slides.length) {
    swiper.loopedSlides = slides.length;
  }
  const prependSlides = [];
  const appendSlides = [];
  slides.each((el, index2) => {
    const slide2 = $(el);
    if (index2 < swiper.loopedSlides) {
      appendSlides.push(el);
    }
    if (index2 < slides.length && index2 >= slides.length - swiper.loopedSlides) {
      prependSlides.push(el);
    }
    slide2.attr("data-swiper-slide-index", index2);
  });
  for (let i = 0; i < appendSlides.length; i += 1) {
    $selector.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
  for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
    $selector.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
}
function loopFix() {
  const swiper = this;
  swiper.emit("beforeLoopFix");
  const {
    activeIndex,
    slides,
    loopedSlides,
    allowSlidePrev,
    allowSlideNext,
    snapGrid,
    rtlTranslate: rtl
  } = swiper;
  let newIndex;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  const snapTranslate = -snapGrid[activeIndex];
  const diff = snapTranslate - swiper.getTranslate();
  if (activeIndex < loopedSlides) {
    newIndex = slides.length - loopedSlides * 3 + activeIndex;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);
    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  } else if (activeIndex >= slides.length - loopedSlides) {
    newIndex = -slides.length + activeIndex + loopedSlides;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);
    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  swiper.emit("loopFix");
}
function loopDestroy() {
  const swiper = this;
  const {
    $wrapperEl,
    params,
    slides
  } = swiper;
  $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
  slides.removeAttr("data-swiper-slide-index");
}
const loop = {
  loopCreate,
  loopFix,
  loopDestroy
};
function setGrabCursor(moving) {
  const swiper = this;
  if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode)
    return;
  const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
  el.style.cursor = "move";
  el.style.cursor = moving ? "grabbing" : "grab";
}
function unsetGrabCursor() {
  const swiper = this;
  if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }
  swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
}
const grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};
function closestElement(selector, base) {
  if (base === void 0) {
    base = this;
  }
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow())
      return null;
    if (el.assignedSlot)
      el = el.assignedSlot;
    const found = el.closest(selector);
    if (!found && !el.getRootNode) {
      return null;
    }
    return found || __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base);
}
function onTouchStart(event) {
  const swiper = this;
  const document2 = getDocument();
  const window2 = getWindow();
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled)
    return;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }
  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  let $targetEl = $(e.target);
  if (params.touchEventsTarget === "wrapper") {
    if (!$targetEl.closest(swiper.wrapperEl).length)
      return;
  }
  data.isTouchEvent = e.type === "touchstart";
  if (!data.isTouchEvent && "which" in e && e.which === 3)
    return;
  if (!data.isTouchEvent && "button" in e && e.button > 0)
    return;
  if (data.isTouched && data.isMoved)
    return;
  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
  if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) {
    $targetEl = $(event.path[0]);
  }
  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e.target && e.target.shadowRoot);
  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
    swiper.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!$targetEl.closest(params.swipeHandler)[0])
      return;
  }
  touches.currentX = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
  touches.currentY = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY;
  const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === "prevent") {
      event.preventDefault();
    } else {
      return;
    }
  }
  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: void 0,
    startMoving: void 0
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = void 0;
  if (params.threshold > 0)
    data.allowThresholdMove = false;
  if (e.type !== "touchstart") {
    let preventDefault = true;
    if ($targetEl.is(data.focusableElements)) {
      preventDefault = false;
      if ($targetEl[0].nodeName === "SELECT") {
        data.isTouched = false;
      }
    }
    if (document2.activeElement && $(document2.activeElement).is(data.focusableElements) && document2.activeElement !== $targetEl[0]) {
      document2.activeElement.blur();
    }
    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
      e.preventDefault();
    }
  }
  if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
    swiper.freeMode.onTouchStart();
  }
  swiper.emit("touchStart", e);
}
function onTouchMove(event) {
  const document2 = getDocument();
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper;
  if (!enabled)
    return;
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit("touchMoveOpposite", e);
    }
    return;
  }
  if (data.isTouchEvent && e.type !== "touchmove")
    return;
  const targetTouch = e.type === "touchmove" && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
  const pageX = e.type === "touchmove" ? targetTouch.pageX : e.pageX;
  const pageY = e.type === "touchmove" ? targetTouch.pageY : e.pageY;
  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper.allowTouchMove) {
    if (!$(e.target).is(data.focusableElements)) {
      swiper.allowClick = false;
    }
    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = now();
    }
    return;
  }
  if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }
  if (data.isTouchEvent && document2.activeElement) {
    if (e.target === document2.activeElement && $(e.target).is(data.focusableElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }
  if (data.allowTouchCallbacks) {
    swiper.emit("touchMove", e);
  }
  if (e.targetTouches && e.targetTouches.length > 1)
    return;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold)
    return;
  if (typeof data.isScrolling === "undefined") {
    let touchAngle;
    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data.isScrolling) {
    swiper.emit("touchMoveOpposite", e);
  }
  if (typeof data.startMoving === "undefined") {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }
  if (data.isScrolling) {
    data.isTouched = false;
    return;
  }
  if (!data.startMoving) {
    return;
  }
  swiper.allowClick = false;
  if (!params.cssMode && e.cancelable) {
    e.preventDefault();
  }
  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }
  if (!data.isMoved) {
    if (params.loop && !params.cssMode) {
      swiper.loopFix();
    }
    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);
    if (swiper.animating) {
      swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
    }
    data.allowMomentumBounce = false;
    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }
    swiper.emit("sliderFirstMove", e);
  }
  swiper.emit("sliderMove", e);
  data.isMoved = true;
  let diff = swiper.isHorizontal() ? diffX : diffY;
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl)
    diff = -diff;
  swiper.swipeDirection = diff > 0 ? "prev" : "next";
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
    disableParentSwiper = false;
    if (params.resistance)
      data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
  } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
    disableParentSwiper = false;
    if (params.resistance)
      data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
  }
  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  }
  if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  }
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }
  if (!params.followFinger || params.cssMode)
    return;
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  }
  swiper.updateProgress(data.currentTranslate);
  swiper.setTranslate(data.currentTranslate);
}
function onTouchEnd(event) {
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled)
    return;
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  if (data.allowTouchCallbacks) {
    swiper.emit("touchEnd", e);
  }
  data.allowTouchCallbacks = false;
  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  }
  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime;
  if (swiper.allowClick) {
    const pathTree = e.path || e.composedPath && e.composedPath();
    swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
    swiper.emit("tap click", e);
    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit("doubleTap doubleClick", e);
    }
  }
  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed)
      swiper.allowClick = true;
  });
  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;
  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }
  if (params.cssMode) {
    return;
  }
  if (swiper.params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  }
  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];
  for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment2 = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (typeof slidesGrid[i + increment2] !== "undefined") {
      if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment2]) {
        stopIndex = i;
        groupSize = slidesGrid[i + increment2] - slidesGrid[i];
      }
    } else if (currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }
  let rewindFirstIndex = null;
  let rewindLastIndex = null;
  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  }
  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
  if (timeDiff > params.longSwipesMs) {
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === "next") {
      if (ratio >= params.longSwipesRatio)
        swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
      else
        swiper.slideTo(stopIndex);
    }
    if (swiper.swipeDirection === "prev") {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === "next") {
        swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }
      if (swiper.swipeDirection === "prev") {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}
function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0)
    return;
  if (params.breakpoints) {
    swiper.setBreakpoint();
  }
  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper;
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();
  if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    swiper.slideTo(swiper.activeIndex, 0, false, true);
  }
  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    swiper.autoplay.run();
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}
function onClick(e) {
  const swiper = this;
  if (!swiper.enabled)
    return;
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks)
      e.preventDefault();
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}
function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled)
    return;
  swiper.previousTranslate = swiper.translate;
  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  }
  if (swiper.translate === 0)
    swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }
  swiper.emit("setTranslate", swiper.translate, false);
}
let dummyEventAttached = false;
function dummyEventListener() {
}
const events = (swiper, method) => {
  const document2 = getDocument();
  const {
    params,
    touchEvents,
    el,
    wrapperEl,
    device,
    support: support2
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
  const swiperMethod = method;
  if (!support2.touch) {
    el[domMethod](touchEvents.start, swiper.onTouchStart, false);
    document2[domMethod](touchEvents.move, swiper.onTouchMove, capture);
    document2[domMethod](touchEvents.end, swiper.onTouchEnd, false);
  } else {
    const passiveListener = touchEvents.start === "touchstart" && support2.passiveListener && params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
    el[domMethod](touchEvents.move, swiper.onTouchMove, support2.passiveListener ? {
      passive: false,
      capture
    } : capture);
    el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
    if (touchEvents.cancel) {
      el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
    }
  }
  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]("click", swiper.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]("scroll", swiper.onScroll);
  }
  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
  } else {
    swiper[swiperMethod]("observerUpdate", onResize, true);
  }
};
function attachEvents() {
  const swiper = this;
  const document2 = getDocument();
  const {
    params,
    support: support2
  } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);
  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }
  swiper.onClick = onClick.bind(swiper);
  if (support2.touch && !dummyEventAttached) {
    document2.addEventListener("touchstart", dummyEventListener);
    dummyEventAttached = true;
  }
  events(swiper, "on");
}
function detachEvents() {
  const swiper = this;
  events(swiper, "off");
}
const events$1 = {
  attachEvents,
  detachEvents
};
const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
  const swiper = this;
  const {
    activeIndex,
    initialized,
    loopedSlides = 0,
    params,
    $el
  } = swiper;
  const breakpoints2 = params.breakpoints;
  if (!breakpoints2 || breakpoints2 && Object.keys(breakpoints2).length === 0)
    return;
  const breakpoint = swiper.getBreakpoint(breakpoints2, swiper.params.breakpointsBase, swiper.el);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint)
    return;
  const breakpointOnlyParams = breakpoint in breakpoints2 ? breakpoints2[breakpoint] : void 0;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasEnabled = params.enabled;
  if (wasMultiRow && !isMultiRow) {
    $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    $el.addClass(`${params.containerModifierClass}grid`);
    if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
      $el.addClass(`${params.containerModifierClass}grid-column`);
    }
    swiper.emitContainerClasses();
  }
  ["navigation", "pagination", "scrollbar"].forEach((prop) => {
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }
    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
  if (directionChanged && initialized) {
    swiper.changeDirection();
  }
  extend$1(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });
  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }
  swiper.currentBreakpoint = breakpoint;
  swiper.emit("_beforeBreakpoint", breakpointParams);
  if (needsReLoop && initialized) {
    swiper.loopDestroy();
    swiper.loopCreate();
    swiper.updateSlides();
    swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
  }
  swiper.emit("breakpoint", breakpointParams);
}
function getBreakpoint(breakpoints2, base, containerEl) {
  if (base === void 0) {
    base = "window";
  }
  if (!breakpoints2 || base === "container" && !containerEl)
    return void 0;
  let breakpoint = false;
  const window2 = getWindow();
  const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints2).map((point) => {
    if (typeof point === "string" && point.indexOf("@") === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }
    return {
      value: point,
      point
    };
  });
  points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
  for (let i = 0; i < points.length; i += 1) {
    const {
      point,
      value
    } = points[i];
    if (base === "window") {
      if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }
  return breakpoint || "max";
}
const breakpoints = {
  setBreakpoint,
  getBreakpoint
};
function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach((item) => {
    if (typeof item === "object") {
      Object.keys(item).forEach((classNames) => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === "string") {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}
function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl,
    $el,
    device,
    support: support2
  } = swiper;
  const suffixes = prepareClasses(["initialized", params.direction, {
    "pointer-events": !support2.touch
  }, {
    "free-mode": swiper.params.freeMode && params.freeMode.enabled
  }, {
    "autoheight": params.autoHeight
  }, {
    "rtl": rtl
  }, {
    "grid": params.grid && params.grid.rows > 1
  }, {
    "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
  }, {
    "android": device.android
  }, {
    "ios": device.ios
  }, {
    "css-mode": params.cssMode
  }, {
    "centered": params.cssMode && params.centeredSlides
  }, {
    "watch-progress": params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  $el.addClass([...classNames].join(" "));
  swiper.emitContainerClasses();
}
function removeClasses() {
  const swiper = this;
  const {
    $el,
    classNames
  } = swiper;
  $el.removeClass(classNames.join(" "));
  swiper.emitContainerClasses();
}
const classes = {
  addClasses,
  removeClasses
};
function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
  const window2 = getWindow();
  let image;
  function onReady() {
    if (callback)
      callback();
  }
  const isPicture = $(imageEl).parent("picture")[0];
  if (!isPicture && (!imageEl.complete || !checkForComplete)) {
    if (src) {
      image = new window2.Image();
      image.onload = onReady;
      image.onerror = onReady;
      if (sizes) {
        image.sizes = sizes;
      }
      if (srcset) {
        image.srcset = srcset;
      }
      if (src) {
        image.src = src;
      }
    } else {
      onReady();
    }
  } else {
    onReady();
  }
}
function preloadImages() {
  const swiper = this;
  swiper.imagesToLoad = swiper.$el.find("img");
  function onReady() {
    if (typeof swiper === "undefined" || swiper === null || !swiper || swiper.destroyed)
      return;
    if (swiper.imagesLoaded !== void 0)
      swiper.imagesLoaded += 1;
    if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
      if (swiper.params.updateOnImagesReady)
        swiper.update();
      swiper.emit("imagesReady");
    }
  }
  for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
    const imageEl = swiper.imagesToLoad[i];
    swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
  }
}
const images = {
  loadImage,
  preloadImages
};
function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;
  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }
  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }
  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }
  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? "lock" : "unlock");
  }
}
const checkOverflow$1 = {
  checkOverflow
};
const defaults = {
  init: true,
  direction: "horizontal",
  touchEventsTarget: "wrapper",
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  enabled: true,
  focusableElements: "input, select, option, textarea, button, video, label",
  width: null,
  height: null,
  preventInteractionOnTransition: false,
  userAgent: null,
  url: null,
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  autoHeight: false,
  setWrapperSize: false,
  virtualTranslate: false,
  effect: "slide",
  breakpoints: void 0,
  breakpointsBase: "window",
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  slidesOffsetAfter: 0,
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  watchOverflow: true,
  roundLengths: false,
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 0,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  uniqueNavElements: true,
  resistance: true,
  resistanceRatio: 0.85,
  watchSlidesProgress: false,
  grabCursor: false,
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  preloadImages: true,
  updateOnImagesReady: true,
  loop: false,
  loopAdditionalSlides: 0,
  loopedSlides: null,
  loopFillGroupWithBlank: false,
  loopPreventsSlide: true,
  rewind: false,
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  noSwiping: true,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  containerModifierClass: "swiper-",
  slideClass: "swiper-slide",
  slideBlankClass: "swiper-slide-invisible-blank",
  slideActiveClass: "swiper-slide-active",
  slideDuplicateActiveClass: "swiper-slide-duplicate-active",
  slideVisibleClass: "swiper-slide-visible",
  slideDuplicateClass: "swiper-slide-duplicate",
  slideNextClass: "swiper-slide-next",
  slideDuplicateNextClass: "swiper-slide-duplicate-next",
  slidePrevClass: "swiper-slide-prev",
  slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
  wrapperClass: "swiper-wrapper",
  runCallbacksOnInit: true,
  _emitClasses: false
};
function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj) {
    if (obj === void 0) {
      obj = {};
    }
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];
    if (typeof moduleParams !== "object" || moduleParams === null) {
      extend$1(allModulesParams, obj);
      return;
    }
    if (["navigation", "pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
      params[moduleParamName] = {
        auto: true
      };
    }
    if (!(moduleParamName in params && "enabled" in moduleParams)) {
      extend$1(allModulesParams, obj);
      return;
    }
    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }
    if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }
    if (!params[moduleParamName])
      params[moduleParamName] = {
        enabled: false
      };
    extend$1(allModulesParams, obj);
  };
}
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes,
  images
};
const extendedDefaults = {};
class Swiper$1 {
  constructor() {
    let el;
    let params;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params)
      params = {};
    params = extend$1({}, params);
    if (el && !params.el)
      params.el = el;
    if (params.el && $(params.el).length > 1) {
      const swipers = [];
      $(params.el).each((containerEl) => {
        const newParams = extend$1({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper$1(newParams));
      });
      return swipers;
    }
    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }
    const allModulesParams = {};
    swiper.modules.forEach((mod) => {
      mod({
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    });
    const swiperParams = extend$1({}, defaults, allModulesParams);
    swiper.params = extend$1({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = extend$1({}, swiper.params);
    swiper.passedParams = extend$1({}, params);
    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach((eventName) => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }
    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    }
    swiper.$ = $;
    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      classNames: [],
      slides: $(),
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      isHorizontal() {
        return swiper.params.direction === "horizontal";
      },
      isVertical() {
        return swiper.params.direction === "vertical";
      },
      activeIndex: 0,
      realIndex: 0,
      isBeginning: true,
      isEnd: false,
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      touchEvents: function touchEvents() {
        const touch = ["touchstart", "touchmove", "touchend", "touchcancel"];
        const desktop = ["pointerdown", "pointermove", "pointerup"];
        swiper.touchEventsTouch = {
          start: touch[0],
          move: touch[1],
          end: touch[2],
          cancel: touch[3]
        };
        swiper.touchEventsDesktop = {
          start: desktop[0],
          move: desktop[1],
          end: desktop[2]
        };
        return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
      }(),
      touchEventsData: {
        isTouched: void 0,
        isMoved: void 0,
        allowTouchCallbacks: void 0,
        touchStartTime: void 0,
        isScrolling: void 0,
        currentTranslate: void 0,
        startTranslate: void 0,
        allowThresholdMove: void 0,
        focusableElements: swiper.params.focusableElements,
        lastClickTime: now(),
        clickTimeout: void 0,
        velocities: [],
        allowMomentumBounce: void 0,
        isTouchEvent: void 0,
        startMoving: void 0
      },
      allowClick: true,
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit("_swiper");
    if (swiper.params.init) {
      swiper.init();
    }
    return swiper;
  }
  enable() {
    const swiper = this;
    if (swiper.enabled)
      return;
    swiper.enabled = true;
    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }
    swiper.emit("enable");
  }
  disable() {
    const swiper = this;
    if (!swiper.enabled)
      return;
    swiper.enabled = false;
    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }
    swiper.emit("disable");
  }
  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el)
      return;
    const cls = swiper.el.className.split(" ").filter((className) => {
      return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit("_containerClasses", cls.join(" "));
  }
  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed)
      return "";
    return slideEl.className.split(" ").filter((className) => {
      return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(" ");
  }
  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el)
      return;
    const updates = [];
    swiper.slides.each((slideEl) => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit("_slideClass", slideEl, classNames);
    });
    swiper.emit("_slideClasses", updates);
  }
  slidesPerViewDynamic(view, exact) {
    if (view === void 0) {
      view = "current";
    }
    if (exact === void 0) {
      exact = false;
    }
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;
    if (params.centeredSlides) {
      let slideSize = slides[activeIndex].swiperSlideSize;
      let breakLoop;
      for (let i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize)
            breakLoop = true;
        }
      }
      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize)
            breakLoop = true;
        }
      }
    } else {
      if (view === "current") {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }
  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed)
      return;
    const {
      snapGrid,
      params
    } = swiper;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();
    function setTranslate2() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    let translated;
    if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
      setTranslate2();
      if (swiper.params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((swiper.params.slidesPerView === "auto" || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
        translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate2();
      }
    }
    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
    swiper.emit("update");
  }
  changeDirection(newDirection, needUpdate) {
    if (needUpdate === void 0) {
      needUpdate = true;
    }
    const swiper = this;
    const currentDirection = swiper.params.direction;
    if (!newDirection) {
      newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
    }
    if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
      return swiper;
    }
    swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.each((slideEl) => {
      if (newDirection === "vertical") {
        slideEl.style.width = "";
      } else {
        slideEl.style.height = "";
      }
    });
    swiper.emit("changeDirection");
    if (needUpdate)
      swiper.update();
    return swiper;
  }
  mount(el) {
    const swiper = this;
    if (swiper.mounted)
      return true;
    const $el = $(el || swiper.params.el);
    el = $el[0];
    if (!el) {
      return false;
    }
    el.swiper = swiper;
    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
    };
    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = $(el.shadowRoot.querySelector(getWrapperSelector()));
        res.children = (options) => $el.children(options);
        return res;
      }
      if (!$el.children) {
        return $($el).children(getWrapperSelector());
      }
      return $el.children(getWrapperSelector());
    };
    let $wrapperEl = getWrapper();
    if ($wrapperEl.length === 0 && swiper.params.createElements) {
      const document2 = getDocument();
      const wrapper = document2.createElement("div");
      $wrapperEl = $(wrapper);
      wrapper.className = swiper.params.wrapperClass;
      $el.append(wrapper);
      $el.children(`.${swiper.params.slideClass}`).each((slideEl) => {
        $wrapperEl.append(slideEl);
      });
    }
    Object.assign(swiper, {
      $el,
      el,
      $wrapperEl,
      wrapperEl: $wrapperEl[0],
      mounted: true,
      rtl: el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl",
      rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl"),
      wrongRTL: $wrapperEl.css("display") === "-webkit-box"
    });
    return true;
  }
  init(el) {
    const swiper = this;
    if (swiper.initialized)
      return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false)
      return swiper;
    swiper.emit("beforeInit");
    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    }
    swiper.addClasses();
    if (swiper.params.loop) {
      swiper.loopCreate();
    }
    swiper.updateSize();
    swiper.updateSlides();
    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    }
    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }
    if (swiper.params.preloadImages) {
      swiper.preloadImages();
    }
    if (swiper.params.loop) {
      swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    }
    swiper.attachEvents();
    swiper.initialized = true;
    swiper.emit("init");
    swiper.emit("afterInit");
    return swiper;
  }
  destroy(deleteInstance, cleanStyles) {
    if (deleteInstance === void 0) {
      deleteInstance = true;
    }
    if (cleanStyles === void 0) {
      cleanStyles = true;
    }
    const swiper = this;
    const {
      params,
      $el,
      $wrapperEl,
      slides
    } = swiper;
    if (typeof swiper.params === "undefined" || swiper.destroyed) {
      return null;
    }
    swiper.emit("beforeDestroy");
    swiper.initialized = false;
    swiper.detachEvents();
    if (params.loop) {
      swiper.loopDestroy();
    }
    if (cleanStyles) {
      swiper.removeClasses();
      $el.removeAttr("style");
      $wrapperEl.removeAttr("style");
      if (slides && slides.length) {
        slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
      }
    }
    swiper.emit("destroy");
    Object.keys(swiper.eventsListeners).forEach((eventName) => {
      swiper.off(eventName);
    });
    if (deleteInstance !== false) {
      swiper.$el[0].swiper = null;
      deleteProps(swiper);
    }
    swiper.destroyed = true;
    return null;
  }
  static extendDefaults(newDefaults) {
    extend$1(extendedDefaults, newDefaults);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults;
  }
  static installModule(mod) {
    if (!Swiper$1.prototype.__modules__)
      Swiper$1.prototype.__modules__ = [];
    const modules = Swiper$1.prototype.__modules__;
    if (typeof mod === "function" && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach((m) => Swiper$1.installModule(m));
      return Swiper$1;
    }
    Swiper$1.installModule(module);
    return Swiper$1;
  }
}
Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    Swiper$1.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper$1.use([Resize, Observer]);
function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  const document2 = getDocument();
  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach((key) => {
      if (!params[key] && params.auto === true) {
        let element = swiper.$el.children(`.${checkProps[key]}`)[0];
        if (!element) {
          element = document2.createElement("div");
          element.className = checkProps[key];
          swiper.$el.append(element);
        }
        params[key] = element;
        originalParams[key] = element;
      }
    });
  }
  return params;
}
function Navigation(_ref) {
  let {
    swiper,
    extendParams,
    on: on2,
    emit
  } = _ref;
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: "swiper-button-disabled",
      hiddenClass: "swiper-button-hidden",
      lockClass: "swiper-button-lock",
      navigationDisabledClass: "swiper-navigation-disabled"
    }
  });
  swiper.navigation = {
    nextEl: null,
    $nextEl: null,
    prevEl: null,
    $prevEl: null
  };
  function getEl(el) {
    let $el;
    if (el) {
      $el = $(el);
      if (swiper.params.uniqueNavElements && typeof el === "string" && $el.length > 1 && swiper.$el.find(el).length === 1) {
        $el = swiper.$el.find(el);
      }
    }
    return $el;
  }
  function toggleEl($el, disabled) {
    const params = swiper.params.navigation;
    if ($el && $el.length > 0) {
      $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
      if ($el[0] && $el[0].tagName === "BUTTON")
        $el[0].disabled = disabled;
      if (swiper.params.watchOverflow && swiper.enabled) {
        $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
      }
    }
  }
  function update2() {
    if (swiper.params.loop)
      return;
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
  }
  function onPrevClick(e) {
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind)
      return;
    swiper.slidePrev();
  }
  function onNextClick(e) {
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind)
      return;
    swiper.slideNext();
  }
  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: "swiper-button-next",
      prevEl: "swiper-button-prev"
    });
    if (!(params.nextEl || params.prevEl))
      return;
    const $nextEl = getEl(params.nextEl);
    const $prevEl = getEl(params.prevEl);
    if ($nextEl && $nextEl.length > 0) {
      $nextEl.on("click", onNextClick);
    }
    if ($prevEl && $prevEl.length > 0) {
      $prevEl.on("click", onPrevClick);
    }
    Object.assign(swiper.navigation, {
      $nextEl,
      nextEl: $nextEl && $nextEl[0],
      $prevEl,
      prevEl: $prevEl && $prevEl[0]
    });
    if (!swiper.enabled) {
      if ($nextEl)
        $nextEl.addClass(params.lockClass);
      if ($prevEl)
        $prevEl.addClass(params.lockClass);
    }
  }
  function destroy() {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    if ($nextEl && $nextEl.length) {
      $nextEl.off("click", onNextClick);
      $nextEl.removeClass(swiper.params.navigation.disabledClass);
    }
    if ($prevEl && $prevEl.length) {
      $prevEl.off("click", onPrevClick);
      $prevEl.removeClass(swiper.params.navigation.disabledClass);
    }
  }
  on2("init", () => {
    if (swiper.params.navigation.enabled === false) {
      disable();
    } else {
      init();
      update2();
    }
  });
  on2("toEdge fromEdge lock unlock", () => {
    update2();
  });
  on2("destroy", () => {
    destroy();
  });
  on2("enable disable", () => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    if ($nextEl) {
      $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
    }
    if ($prevEl) {
      $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
    }
  });
  on2("click", (_s, e) => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    const targetEl = e.target;
    if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl)))
        return;
      let isHidden;
      if ($nextEl) {
        isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
      } else if ($prevEl) {
        isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
      }
      if (isHidden === true) {
        emit("navigationShow");
      } else {
        emit("navigationHide");
      }
      if ($nextEl) {
        $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
      }
      if ($prevEl) {
        $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
      }
    }
  });
  const enable = () => {
    swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
    init();
    update2();
  };
  const disable = () => {
    swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
    destroy();
  };
  Object.assign(swiper.navigation, {
    enable,
    disable,
    update: update2,
    init,
    destroy
  });
}
function Controller(_ref) {
  let {
    swiper,
    extendParams,
    on: on2
  } = _ref;
  extendParams({
    controller: {
      control: void 0,
      inverse: false,
      by: "slide"
    }
  });
  swiper.controller = {
    control: void 0
  };
  function LinearSpline(x, y) {
    const binarySearch = function search() {
      let maxIndex;
      let minIndex;
      let guess;
      return (array, val) => {
        minIndex = -1;
        maxIndex = array.length;
        while (maxIndex - minIndex > 1) {
          guess = maxIndex + minIndex >> 1;
          if (array[guess] <= val) {
            minIndex = guess;
          } else {
            maxIndex = guess;
          }
        }
        return maxIndex;
      };
    }();
    this.x = x;
    this.y = y;
    this.lastIndex = x.length - 1;
    let i1;
    let i3;
    this.interpolate = function interpolate(x2) {
      if (!x2)
        return 0;
      i3 = binarySearch(this.x, x2);
      i1 = i3 - 1;
      return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
    };
    return this;
  }
  function getInterpolateFunction(c) {
    if (!swiper.controller.spline) {
      swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.slidesGrid, c.slidesGrid) : new LinearSpline(swiper.snapGrid, c.snapGrid);
    }
  }
  function setTranslate2(_t, byController) {
    const controlled = swiper.controller.control;
    let multiplier;
    let controlledTranslate;
    const Swiper2 = swiper.constructor;
    function setControlledTranslate(c) {
      const translate2 = swiper.rtlTranslate ? -swiper.translate : swiper.translate;
      if (swiper.params.controller.by === "slide") {
        getInterpolateFunction(c);
        controlledTranslate = -swiper.controller.spline.interpolate(-translate2);
      }
      if (!controlledTranslate || swiper.params.controller.by === "container") {
        multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
        controlledTranslate = (translate2 - swiper.minTranslate()) * multiplier + c.minTranslate();
      }
      if (swiper.params.controller.inverse) {
        controlledTranslate = c.maxTranslate() - controlledTranslate;
      }
      c.updateProgress(controlledTranslate);
      c.setTranslate(controlledTranslate, swiper);
      c.updateActiveIndex();
      c.updateSlidesClasses();
    }
    if (Array.isArray(controlled)) {
      for (let i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper2) {
          setControlledTranslate(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper2 && byController !== controlled) {
      setControlledTranslate(controlled);
    }
  }
  function setTransition2(duration, byController) {
    const Swiper2 = swiper.constructor;
    const controlled = swiper.controller.control;
    let i;
    function setControlledTransition(c) {
      c.setTransition(duration, swiper);
      if (duration !== 0) {
        c.transitionStart();
        if (c.params.autoHeight) {
          nextTick(() => {
            c.updateAutoHeight();
          });
        }
        c.$wrapperEl.transitionEnd(() => {
          if (!controlled)
            return;
          if (c.params.loop && swiper.params.controller.by === "slide") {
            c.loopFix();
          }
          c.transitionEnd();
        });
      }
    }
    if (Array.isArray(controlled)) {
      for (i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper2) {
          setControlledTransition(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper2 && byController !== controlled) {
      setControlledTransition(controlled);
    }
  }
  function removeSpline() {
    if (!swiper.controller.control)
      return;
    if (swiper.controller.spline) {
      swiper.controller.spline = void 0;
      delete swiper.controller.spline;
    }
  }
  on2("beforeInit", () => {
    swiper.controller.control = swiper.params.controller.control;
  });
  on2("update", () => {
    removeSpline();
  });
  on2("resize", () => {
    removeSpline();
  });
  on2("observerUpdate", () => {
    removeSpline();
  });
  on2("setTranslate", (_s, translate2, byController) => {
    if (!swiper.controller.control)
      return;
    swiper.controller.setTranslate(translate2, byController);
  });
  on2("setTransition", (_s, duration, byController) => {
    if (!swiper.controller.control)
      return;
    swiper.controller.setTransition(duration, byController);
  });
  Object.assign(swiper.controller, {
    setTranslate: setTranslate2,
    setTransition: setTransition2
  });
}
function isObject(o) {
  return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
}
function extend(target, src) {
  const noExtend = ["__proto__", "constructor", "prototype"];
  Object.keys(src).filter((key) => noExtend.indexOf(key) < 0).forEach((key) => {
    if (typeof target[key] === "undefined")
      target[key] = src[key];
    else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) {
      if (src[key].__swiper__)
        target[key] = src[key];
      else
        extend(target[key], src[key]);
    } else {
      target[key] = src[key];
    }
  });
}
function needsNavigation(props) {
  if (props === void 0) {
    props = {};
  }
  return props.navigation && typeof props.navigation.nextEl === "undefined" && typeof props.navigation.prevEl === "undefined";
}
function needsPagination(props) {
  if (props === void 0) {
    props = {};
  }
  return props.pagination && typeof props.pagination.el === "undefined";
}
function needsScrollbar(props) {
  if (props === void 0) {
    props = {};
  }
  return props.scrollbar && typeof props.scrollbar.el === "undefined";
}
function uniqueClasses(classNames) {
  if (classNames === void 0) {
    classNames = "";
  }
  const classes2 = classNames.split(" ").map((c) => c.trim()).filter((c) => !!c);
  const unique = [];
  classes2.forEach((c) => {
    if (unique.indexOf(c) < 0)
      unique.push(c);
  });
  return unique.join(" ");
}
const paramsList = [
  "modules",
  "init",
  "_direction",
  "touchEventsTarget",
  "initialSlide",
  "_speed",
  "cssMode",
  "updateOnWindowResize",
  "resizeObserver",
  "nested",
  "focusableElements",
  "_enabled",
  "_width",
  "_height",
  "preventInteractionOnTransition",
  "userAgent",
  "url",
  "_edgeSwipeDetection",
  "_edgeSwipeThreshold",
  "_freeMode",
  "_autoHeight",
  "setWrapperSize",
  "virtualTranslate",
  "_effect",
  "breakpoints",
  "_spaceBetween",
  "_slidesPerView",
  "maxBackfaceHiddenSlides",
  "_grid",
  "_slidesPerGroup",
  "_slidesPerGroupSkip",
  "_slidesPerGroupAuto",
  "_centeredSlides",
  "_centeredSlidesBounds",
  "_slidesOffsetBefore",
  "_slidesOffsetAfter",
  "normalizeSlideIndex",
  "_centerInsufficientSlides",
  "_watchOverflow",
  "roundLengths",
  "touchRatio",
  "touchAngle",
  "simulateTouch",
  "_shortSwipes",
  "_longSwipes",
  "longSwipesRatio",
  "longSwipesMs",
  "_followFinger",
  "allowTouchMove",
  "_threshold",
  "touchMoveStopPropagation",
  "touchStartPreventDefault",
  "touchStartForcePreventDefault",
  "touchReleaseOnEdges",
  "uniqueNavElements",
  "_resistance",
  "_resistanceRatio",
  "_watchSlidesProgress",
  "_grabCursor",
  "preventClicks",
  "preventClicksPropagation",
  "_slideToClickedSlide",
  "_preloadImages",
  "updateOnImagesReady",
  "_loop",
  "_loopAdditionalSlides",
  "_loopedSlides",
  "_loopFillGroupWithBlank",
  "loopPreventsSlide",
  "_rewind",
  "_allowSlidePrev",
  "_allowSlideNext",
  "_swipeHandler",
  "_noSwiping",
  "noSwipingClass",
  "noSwipingSelector",
  "passiveListeners",
  "containerModifierClass",
  "slideClass",
  "slideBlankClass",
  "slideActiveClass",
  "slideDuplicateActiveClass",
  "slideVisibleClass",
  "slideDuplicateClass",
  "slideNextClass",
  "slideDuplicateNextClass",
  "slidePrevClass",
  "slideDuplicatePrevClass",
  "wrapperClass",
  "runCallbacksOnInit",
  "observer",
  "observeParents",
  "observeSlideChildren",
  "a11y",
  "_autoplay",
  "_controller",
  "coverflowEffect",
  "cubeEffect",
  "fadeEffect",
  "flipEffect",
  "creativeEffect",
  "cardsEffect",
  "hashNavigation",
  "history",
  "keyboard",
  "lazy",
  "mousewheel",
  "_navigation",
  "_pagination",
  "parallax",
  "_scrollbar",
  "_thumbs",
  "virtual",
  "zoom"
];
function getParams(obj) {
  if (obj === void 0) {
    obj = {};
  }
  const params = {
    on: {}
  };
  const passedParams = {};
  extend(params, Swiper$1.defaults);
  extend(params, Swiper$1.extendedDefaults);
  params._emitClasses = true;
  params.init = false;
  const rest = {};
  const allowedParams = paramsList.map((key) => key.replace(/_/, ""));
  const plainObj = Object.assign({}, obj);
  Object.keys(plainObj).forEach((key) => {
    if (typeof obj[key] === "undefined")
      return;
    if (allowedParams.indexOf(key) >= 0) {
      if (isObject(obj[key])) {
        params[key] = {};
        passedParams[key] = {};
        extend(params[key], obj[key]);
        extend(passedParams[key], obj[key]);
      } else {
        params[key] = obj[key];
        passedParams[key] = obj[key];
      }
    } else if (key.search(/on[A-Z]/) === 0 && typeof obj[key] === "function") {
      params.on[`${key[2].toLowerCase()}${key.substr(3)}`] = obj[key];
    } else {
      rest[key] = obj[key];
    }
  });
  ["navigation", "pagination", "scrollbar"].forEach((key) => {
    if (params[key] === true)
      params[key] = {};
    if (params[key] === false)
      delete params[key];
  });
  return {
    params,
    passedParams,
    rest
  };
}
function initSwiper(swiperParams) {
  return new Swiper$1(swiperParams);
}
function mountSwiper(_ref, swiperParams) {
  let {
    el,
    nextEl,
    prevEl,
    paginationEl,
    scrollbarEl,
    swiper
  } = _ref;
  if (needsNavigation(swiperParams) && nextEl && prevEl) {
    swiper.params.navigation.nextEl = nextEl;
    swiper.originalParams.navigation.nextEl = nextEl;
    swiper.params.navigation.prevEl = prevEl;
    swiper.originalParams.navigation.prevEl = prevEl;
  }
  if (needsPagination(swiperParams) && paginationEl) {
    swiper.params.pagination.el = paginationEl;
    swiper.originalParams.pagination.el = paginationEl;
  }
  if (needsScrollbar(swiperParams) && scrollbarEl) {
    swiper.params.scrollbar.el = scrollbarEl;
    swiper.originalParams.scrollbar.el = scrollbarEl;
  }
  swiper.init(el);
}
function calcLoopedSlides(slides, swiperParams) {
  let slidesPerViewParams = swiperParams.slidesPerView;
  if (swiperParams.breakpoints) {
    const breakpoint = Swiper$1.prototype.getBreakpoint(swiperParams.breakpoints);
    const breakpointOnlyParams = breakpoint in swiperParams.breakpoints ? swiperParams.breakpoints[breakpoint] : void 0;
    if (breakpointOnlyParams && breakpointOnlyParams.slidesPerView) {
      slidesPerViewParams = breakpointOnlyParams.slidesPerView;
    }
  }
  let loopedSlides = Math.ceil(parseFloat(swiperParams.loopedSlides || slidesPerViewParams, 10));
  loopedSlides += swiperParams.loopAdditionalSlides;
  if (loopedSlides > slides.length) {
    loopedSlides = slides.length;
  }
  return loopedSlides;
}
function renderLoop(swiperRef, slides, swiperParams) {
  const modifiedSlides = slides.map((child, index2) => {
    if (!child.props)
      child.props = {};
    child.props.swiperRef = swiperRef;
    child.props["data-swiper-slide-index"] = index2;
    return child;
  });
  function duplicateSlide(child, index2, position) {
    if (!child.props)
      child.props = {};
    return vue_cjs_prod.h(child.type, __spreadProps(__spreadValues({}, child.props), {
      key: `${child.key}-duplicate-${index2}-${position}`,
      class: `${child.props.className || ""} ${swiperParams.slideDuplicateClass} ${child.props.class || ""}`
    }), child.children);
  }
  if (swiperParams.loopFillGroupWithBlank) {
    const blankSlidesNum = swiperParams.slidesPerGroup - modifiedSlides.length % swiperParams.slidesPerGroup;
    if (blankSlidesNum !== swiperParams.slidesPerGroup) {
      for (let i = 0; i < blankSlidesNum; i += 1) {
        const blankSlide = vue_cjs_prod.h("div", {
          class: `${swiperParams.slideClass} ${swiperParams.slideBlankClass}`
        });
        modifiedSlides.push(blankSlide);
      }
    }
  }
  if (swiperParams.slidesPerView === "auto" && !swiperParams.loopedSlides) {
    swiperParams.loopedSlides = modifiedSlides.length;
  }
  const loopedSlides = calcLoopedSlides(modifiedSlides, swiperParams);
  const prependSlides = [];
  const appendSlides = [];
  modifiedSlides.forEach((child, index2) => {
    if (index2 < loopedSlides) {
      appendSlides.push(duplicateSlide(child, index2, "prepend"));
    }
    if (index2 < modifiedSlides.length && index2 >= modifiedSlides.length - loopedSlides) {
      prependSlides.push(duplicateSlide(child, index2, "append"));
    }
  });
  if (swiperRef.value) {
    swiperRef.value.loopedSlides = loopedSlides;
  }
  return [...prependSlides, ...modifiedSlides, ...appendSlides];
}
function getChangedParams(swiperParams, oldParams, children2, oldChildren) {
  const keys = [];
  if (!oldParams)
    return keys;
  const addKey = (key) => {
    if (keys.indexOf(key) < 0)
      keys.push(key);
  };
  const oldChildrenKeys = oldChildren.map((child) => child.props && child.props.key);
  const childrenKeys = children2.map((child) => child.props && child.props.key);
  if (oldChildrenKeys.join("") !== childrenKeys.join(""))
    keys.push("children");
  if (oldChildren.length !== children2.length)
    keys.push("children");
  const watchParams = paramsList.filter((key) => key[0] === "_").map((key) => key.replace(/_/, ""));
  watchParams.forEach((key) => {
    if (key in swiperParams && key in oldParams) {
      if (isObject(swiperParams[key]) && isObject(oldParams[key])) {
        const newKeys = Object.keys(swiperParams[key]);
        const oldKeys = Object.keys(oldParams[key]);
        if (newKeys.length !== oldKeys.length) {
          addKey(key);
        } else {
          newKeys.forEach((newKey) => {
            if (swiperParams[key][newKey] !== oldParams[key][newKey]) {
              addKey(key);
            }
          });
          oldKeys.forEach((oldKey) => {
            if (swiperParams[key][oldKey] !== oldParams[key][oldKey])
              addKey(key);
          });
        }
      } else if (swiperParams[key] !== oldParams[key]) {
        addKey(key);
      }
    }
  });
  return keys;
}
function getChildren(originalSlots, slidesRef, oldSlidesRef) {
  if (originalSlots === void 0) {
    originalSlots = {};
  }
  const slides = [];
  const slots = {
    "container-start": [],
    "container-end": [],
    "wrapper-start": [],
    "wrapper-end": []
  };
  const getSlidesFromElements = (els, slotName) => {
    if (!Array.isArray(els)) {
      return;
    }
    els.forEach((vnode) => {
      const isFragment = typeof vnode.type === "symbol";
      if (slotName === "default")
        slotName = "container-end";
      if (isFragment && vnode.children) {
        getSlidesFromElements(vnode.children, "default");
      } else if (vnode.type && (vnode.type.name === "SwiperSlide" || vnode.type.name === "AsyncComponentWrapper")) {
        slides.push(vnode);
      } else if (slots[slotName]) {
        slots[slotName].push(vnode);
      }
    });
  };
  Object.keys(originalSlots).forEach((slotName) => {
    if (typeof originalSlots[slotName] !== "function")
      return;
    const els = originalSlots[slotName]();
    getSlidesFromElements(els, slotName);
  });
  oldSlidesRef.value = slidesRef.value;
  slidesRef.value = slides;
  return {
    slides,
    slots
  };
}
function updateSwiper(_ref) {
  let {
    swiper,
    slides,
    passedParams,
    changedParams,
    nextEl,
    prevEl,
    paginationEl,
    scrollbarEl
  } = _ref;
  const updateParams = changedParams.filter((key) => key !== "children" && key !== "direction");
  const {
    params: currentParams,
    pagination,
    navigation,
    scrollbar,
    virtual,
    thumbs
  } = swiper;
  let needThumbsInit;
  let needControllerInit;
  let needPaginationInit;
  let needScrollbarInit;
  let needNavigationInit;
  if (changedParams.includes("thumbs") && passedParams.thumbs && passedParams.thumbs.swiper && currentParams.thumbs && !currentParams.thumbs.swiper) {
    needThumbsInit = true;
  }
  if (changedParams.includes("controller") && passedParams.controller && passedParams.controller.control && currentParams.controller && !currentParams.controller.control) {
    needControllerInit = true;
  }
  if (changedParams.includes("pagination") && passedParams.pagination && (passedParams.pagination.el || paginationEl) && (currentParams.pagination || currentParams.pagination === false) && pagination && !pagination.el) {
    needPaginationInit = true;
  }
  if (changedParams.includes("scrollbar") && passedParams.scrollbar && (passedParams.scrollbar.el || scrollbarEl) && (currentParams.scrollbar || currentParams.scrollbar === false) && scrollbar && !scrollbar.el) {
    needScrollbarInit = true;
  }
  if (changedParams.includes("navigation") && passedParams.navigation && (passedParams.navigation.prevEl || prevEl) && (passedParams.navigation.nextEl || nextEl) && (currentParams.navigation || currentParams.navigation === false) && navigation && !navigation.prevEl && !navigation.nextEl) {
    needNavigationInit = true;
  }
  const destroyModule = (mod) => {
    if (!swiper[mod])
      return;
    swiper[mod].destroy();
    if (mod === "navigation") {
      currentParams[mod].prevEl = void 0;
      currentParams[mod].nextEl = void 0;
      swiper[mod].prevEl = void 0;
      swiper[mod].nextEl = void 0;
    } else {
      currentParams[mod].el = void 0;
      swiper[mod].el = void 0;
    }
  };
  updateParams.forEach((key) => {
    if (isObject(currentParams[key]) && isObject(passedParams[key])) {
      extend(currentParams[key], passedParams[key]);
    } else {
      const newValue = passedParams[key];
      if ((newValue === true || newValue === false) && (key === "navigation" || key === "pagination" || key === "scrollbar")) {
        if (newValue === false) {
          destroyModule(key);
        }
      } else {
        currentParams[key] = passedParams[key];
      }
    }
  });
  if (changedParams.includes("children") && virtual && currentParams.virtual.enabled) {
    virtual.slides = slides;
    virtual.update(true);
  } else if (changedParams.includes("children") && swiper.lazy && swiper.params.lazy.enabled) {
    swiper.lazy.load();
  }
  if (needThumbsInit) {
    const initialized = thumbs.init();
    if (initialized)
      thumbs.update(true);
  }
  if (needControllerInit) {
    swiper.controller.control = currentParams.controller.control;
  }
  if (needPaginationInit) {
    if (paginationEl)
      currentParams.pagination.el = paginationEl;
    pagination.init();
    pagination.render();
    pagination.update();
  }
  if (needScrollbarInit) {
    if (scrollbarEl)
      currentParams.scrollbar.el = scrollbarEl;
    scrollbar.init();
    scrollbar.updateSize();
    scrollbar.setTranslate();
  }
  if (needNavigationInit) {
    if (nextEl)
      currentParams.navigation.nextEl = nextEl;
    if (prevEl)
      currentParams.navigation.prevEl = prevEl;
    navigation.init();
    navigation.update();
  }
  if (changedParams.includes("allowSlideNext")) {
    swiper.allowSlideNext = passedParams.allowSlideNext;
  }
  if (changedParams.includes("allowSlidePrev")) {
    swiper.allowSlidePrev = passedParams.allowSlidePrev;
  }
  if (changedParams.includes("direction")) {
    swiper.changeDirection(passedParams.direction, false);
  }
  swiper.update();
}
function updateOnVirtualData(swiper) {
  if (!swiper || swiper.destroyed || !swiper.params.virtual || swiper.params.virtual && !swiper.params.virtual.enabled)
    return;
  swiper.updateSlides();
  swiper.updateProgress();
  swiper.updateSlidesClasses();
  if (swiper.lazy && swiper.params.lazy.enabled) {
    swiper.lazy.load();
  }
  if (swiper.parallax && swiper.params.parallax && swiper.params.parallax.enabled) {
    swiper.parallax.setTranslate();
  }
}
function renderVirtual(swiperRef, slides, virtualData) {
  if (!virtualData)
    return null;
  const style = swiperRef.value.isHorizontal() ? {
    [swiperRef.value.rtlTranslate ? "right" : "left"]: `${virtualData.offset}px`
  } : {
    top: `${virtualData.offset}px`
  };
  return slides.filter((slide2, index2) => index2 >= virtualData.from && index2 <= virtualData.to).map((slide2) => {
    if (!slide2.props)
      slide2.props = {};
    if (!slide2.props.style)
      slide2.props.style = {};
    slide2.props.swiperRef = swiperRef;
    slide2.props.style = style;
    return vue_cjs_prod.h(slide2.type, __spreadValues({}, slide2.props), slide2.children);
  });
}
const Swiper = {
  name: "Swiper",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    wrapperTag: {
      type: String,
      default: "div"
    },
    modules: {
      type: Array,
      default: void 0
    },
    init: {
      type: Boolean,
      default: void 0
    },
    direction: {
      type: String,
      default: void 0
    },
    touchEventsTarget: {
      type: String,
      default: void 0
    },
    initialSlide: {
      type: Number,
      default: void 0
    },
    speed: {
      type: Number,
      default: void 0
    },
    cssMode: {
      type: Boolean,
      default: void 0
    },
    updateOnWindowResize: {
      type: Boolean,
      default: void 0
    },
    resizeObserver: {
      type: Boolean,
      default: void 0
    },
    nested: {
      type: Boolean,
      default: void 0
    },
    focusableElements: {
      type: String,
      default: void 0
    },
    width: {
      type: Number,
      default: void 0
    },
    height: {
      type: Number,
      default: void 0
    },
    preventInteractionOnTransition: {
      type: Boolean,
      default: void 0
    },
    userAgent: {
      type: String,
      default: void 0
    },
    url: {
      type: String,
      default: void 0
    },
    edgeSwipeDetection: {
      type: [Boolean, String],
      default: void 0
    },
    edgeSwipeThreshold: {
      type: Number,
      default: void 0
    },
    autoHeight: {
      type: Boolean,
      default: void 0
    },
    setWrapperSize: {
      type: Boolean,
      default: void 0
    },
    virtualTranslate: {
      type: Boolean,
      default: void 0
    },
    effect: {
      type: String,
      default: void 0
    },
    breakpoints: {
      type: Object,
      default: void 0
    },
    spaceBetween: {
      type: Number,
      default: void 0
    },
    slidesPerView: {
      type: [Number, String],
      default: void 0
    },
    maxBackfaceHiddenSlides: {
      type: Number,
      default: void 0
    },
    slidesPerGroup: {
      type: Number,
      default: void 0
    },
    slidesPerGroupSkip: {
      type: Number,
      default: void 0
    },
    slidesPerGroupAuto: {
      type: Boolean,
      default: void 0
    },
    centeredSlides: {
      type: Boolean,
      default: void 0
    },
    centeredSlidesBounds: {
      type: Boolean,
      default: void 0
    },
    slidesOffsetBefore: {
      type: Number,
      default: void 0
    },
    slidesOffsetAfter: {
      type: Number,
      default: void 0
    },
    normalizeSlideIndex: {
      type: Boolean,
      default: void 0
    },
    centerInsufficientSlides: {
      type: Boolean,
      default: void 0
    },
    watchOverflow: {
      type: Boolean,
      default: void 0
    },
    roundLengths: {
      type: Boolean,
      default: void 0
    },
    touchRatio: {
      type: Number,
      default: void 0
    },
    touchAngle: {
      type: Number,
      default: void 0
    },
    simulateTouch: {
      type: Boolean,
      default: void 0
    },
    shortSwipes: {
      type: Boolean,
      default: void 0
    },
    longSwipes: {
      type: Boolean,
      default: void 0
    },
    longSwipesRatio: {
      type: Number,
      default: void 0
    },
    longSwipesMs: {
      type: Number,
      default: void 0
    },
    followFinger: {
      type: Boolean,
      default: void 0
    },
    allowTouchMove: {
      type: Boolean,
      default: void 0
    },
    threshold: {
      type: Number,
      default: void 0
    },
    touchMoveStopPropagation: {
      type: Boolean,
      default: void 0
    },
    touchStartPreventDefault: {
      type: Boolean,
      default: void 0
    },
    touchStartForcePreventDefault: {
      type: Boolean,
      default: void 0
    },
    touchReleaseOnEdges: {
      type: Boolean,
      default: void 0
    },
    uniqueNavElements: {
      type: Boolean,
      default: void 0
    },
    resistance: {
      type: Boolean,
      default: void 0
    },
    resistanceRatio: {
      type: Number,
      default: void 0
    },
    watchSlidesProgress: {
      type: Boolean,
      default: void 0
    },
    grabCursor: {
      type: Boolean,
      default: void 0
    },
    preventClicks: {
      type: Boolean,
      default: void 0
    },
    preventClicksPropagation: {
      type: Boolean,
      default: void 0
    },
    slideToClickedSlide: {
      type: Boolean,
      default: void 0
    },
    preloadImages: {
      type: Boolean,
      default: void 0
    },
    updateOnImagesReady: {
      type: Boolean,
      default: void 0
    },
    loop: {
      type: Boolean,
      default: void 0
    },
    loopAdditionalSlides: {
      type: Number,
      default: void 0
    },
    loopedSlides: {
      type: Number,
      default: void 0
    },
    loopFillGroupWithBlank: {
      type: Boolean,
      default: void 0
    },
    loopPreventsSlide: {
      type: Boolean,
      default: void 0
    },
    rewind: {
      type: Boolean,
      default: void 0
    },
    allowSlidePrev: {
      type: Boolean,
      default: void 0
    },
    allowSlideNext: {
      type: Boolean,
      default: void 0
    },
    swipeHandler: {
      type: Boolean,
      default: void 0
    },
    noSwiping: {
      type: Boolean,
      default: void 0
    },
    noSwipingClass: {
      type: String,
      default: void 0
    },
    noSwipingSelector: {
      type: String,
      default: void 0
    },
    passiveListeners: {
      type: Boolean,
      default: void 0
    },
    containerModifierClass: {
      type: String,
      default: void 0
    },
    slideClass: {
      type: String,
      default: void 0
    },
    slideBlankClass: {
      type: String,
      default: void 0
    },
    slideActiveClass: {
      type: String,
      default: void 0
    },
    slideDuplicateActiveClass: {
      type: String,
      default: void 0
    },
    slideVisibleClass: {
      type: String,
      default: void 0
    },
    slideDuplicateClass: {
      type: String,
      default: void 0
    },
    slideNextClass: {
      type: String,
      default: void 0
    },
    slideDuplicateNextClass: {
      type: String,
      default: void 0
    },
    slidePrevClass: {
      type: String,
      default: void 0
    },
    slideDuplicatePrevClass: {
      type: String,
      default: void 0
    },
    wrapperClass: {
      type: String,
      default: void 0
    },
    runCallbacksOnInit: {
      type: Boolean,
      default: void 0
    },
    observer: {
      type: Boolean,
      default: void 0
    },
    observeParents: {
      type: Boolean,
      default: void 0
    },
    observeSlideChildren: {
      type: Boolean,
      default: void 0
    },
    a11y: {
      type: [Boolean, Object],
      default: void 0
    },
    autoplay: {
      type: [Boolean, Object],
      default: void 0
    },
    controller: {
      type: Object,
      default: void 0
    },
    coverflowEffect: {
      type: Object,
      default: void 0
    },
    cubeEffect: {
      type: Object,
      default: void 0
    },
    fadeEffect: {
      type: Object,
      default: void 0
    },
    flipEffect: {
      type: Object,
      default: void 0
    },
    creativeEffect: {
      type: Object,
      default: void 0
    },
    cardsEffect: {
      type: Object,
      default: void 0
    },
    hashNavigation: {
      type: [Boolean, Object],
      default: void 0
    },
    history: {
      type: [Boolean, Object],
      default: void 0
    },
    keyboard: {
      type: [Boolean, Object],
      default: void 0
    },
    lazy: {
      type: [Boolean, Object],
      default: void 0
    },
    mousewheel: {
      type: [Boolean, Object],
      default: void 0
    },
    navigation: {
      type: [Boolean, Object],
      default: void 0
    },
    pagination: {
      type: [Boolean, Object],
      default: void 0
    },
    parallax: {
      type: [Boolean, Object],
      default: void 0
    },
    scrollbar: {
      type: [Boolean, Object],
      default: void 0
    },
    thumbs: {
      type: Object,
      default: void 0
    },
    virtual: {
      type: [Boolean, Object],
      default: void 0
    },
    zoom: {
      type: [Boolean, Object],
      default: void 0
    },
    grid: {
      type: [Object],
      default: void 0
    },
    freeMode: {
      type: [Boolean, Object],
      default: void 0
    },
    enabled: {
      type: Boolean,
      default: void 0
    }
  },
  emits: ["_beforeBreakpoint", "_containerClasses", "_slideClass", "_slideClasses", "_swiper", "_freeModeNoMomentumRelease", "activeIndexChange", "afterInit", "autoplay", "autoplayStart", "autoplayStop", "autoplayPause", "autoplayResume", "beforeDestroy", "beforeInit", "beforeLoopFix", "beforeResize", "beforeSlideChangeStart", "beforeTransitionStart", "breakpoint", "changeDirection", "click", "disable", "doubleTap", "doubleClick", "destroy", "enable", "fromEdge", "hashChange", "hashSet", "imagesReady", "init", "keyPress", "lazyImageLoad", "lazyImageReady", "lock", "loopFix", "momentumBounce", "navigationHide", "navigationShow", "observerUpdate", "orientationchange", "paginationHide", "paginationRender", "paginationShow", "paginationUpdate", "progress", "reachBeginning", "reachEnd", "realIndexChange", "resize", "scroll", "scrollbarDragEnd", "scrollbarDragMove", "scrollbarDragStart", "setTransition", "setTranslate", "slideChange", "slideChangeTransitionEnd", "slideChangeTransitionStart", "slideNextTransitionEnd", "slideNextTransitionStart", "slidePrevTransitionEnd", "slidePrevTransitionStart", "slideResetTransitionStart", "slideResetTransitionEnd", "sliderMove", "sliderFirstMove", "slidesLengthChange", "slidesGridLengthChange", "snapGridLengthChange", "snapIndexChange", "swiper", "tap", "toEdge", "touchEnd", "touchMove", "touchMoveOpposite", "touchStart", "transitionEnd", "transitionStart", "unlock", "update", "zoomChange"],
  setup(props, _ref) {
    let {
      slots: originalSlots,
      emit
    } = _ref;
    const {
      tag: Tag2,
      wrapperTag: WrapperTag
    } = props;
    const containerClasses = vue_cjs_prod.ref("swiper");
    const virtualData = vue_cjs_prod.ref(null);
    const breakpointChanged = vue_cjs_prod.ref(false);
    const initializedRef = vue_cjs_prod.ref(false);
    const swiperElRef = vue_cjs_prod.ref(null);
    const swiperRef = vue_cjs_prod.ref(null);
    const oldPassedParamsRef = vue_cjs_prod.ref(null);
    const slidesRef = {
      value: []
    };
    const oldSlidesRef = {
      value: []
    };
    const nextElRef = vue_cjs_prod.ref(null);
    const prevElRef = vue_cjs_prod.ref(null);
    const paginationElRef = vue_cjs_prod.ref(null);
    const scrollbarElRef = vue_cjs_prod.ref(null);
    const {
      params: swiperParams,
      passedParams
    } = getParams(props);
    getChildren(originalSlots, slidesRef, oldSlidesRef);
    oldPassedParamsRef.value = passedParams;
    oldSlidesRef.value = slidesRef.value;
    const onBeforeBreakpoint = () => {
      getChildren(originalSlots, slidesRef, oldSlidesRef);
      breakpointChanged.value = true;
    };
    swiperParams.onAny = function(event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      emit(event, ...args);
    };
    Object.assign(swiperParams.on, {
      _beforeBreakpoint: onBeforeBreakpoint,
      _containerClasses(swiper, classes2) {
        containerClasses.value = classes2;
      }
    });
    swiperRef.value = initSwiper(swiperParams);
    swiperRef.value.loopCreate = () => {
    };
    swiperRef.value.loopDestroy = () => {
    };
    if (swiperParams.loop) {
      swiperRef.value.loopedSlides = calcLoopedSlides(slidesRef.value, swiperParams);
    }
    if (swiperRef.value.virtual && swiperRef.value.params.virtual.enabled) {
      swiperRef.value.virtual.slides = slidesRef.value;
      const extendWith = {
        cache: false,
        slides: slidesRef.value,
        renderExternal: (data) => {
          virtualData.value = data;
        },
        renderExternalUpdate: false
      };
      extend(swiperRef.value.params.virtual, extendWith);
      extend(swiperRef.value.originalParams.virtual, extendWith);
    }
    vue_cjs_prod.onUpdated(() => {
      if (!initializedRef.value && swiperRef.value) {
        swiperRef.value.emitSlidesClasses();
        initializedRef.value = true;
      }
      const {
        passedParams: newPassedParams
      } = getParams(props);
      const changedParams = getChangedParams(newPassedParams, oldPassedParamsRef.value, slidesRef.value, oldSlidesRef.value);
      oldPassedParamsRef.value = newPassedParams;
      if ((changedParams.length || breakpointChanged.value) && swiperRef.value && !swiperRef.value.destroyed) {
        updateSwiper({
          swiper: swiperRef.value,
          slides: slidesRef.value,
          passedParams: newPassedParams,
          changedParams,
          nextEl: nextElRef.value,
          prevEl: prevElRef.value,
          scrollbarEl: scrollbarElRef.value,
          paginationEl: paginationElRef.value
        });
      }
      breakpointChanged.value = false;
    });
    vue_cjs_prod.provide("swiper", swiperRef);
    vue_cjs_prod.watch(virtualData, () => {
      vue_cjs_prod.nextTick(() => {
        updateOnVirtualData(swiperRef.value);
      });
    });
    vue_cjs_prod.onMounted(() => {
      if (!swiperElRef.value)
        return;
      mountSwiper({
        el: swiperElRef.value,
        nextEl: nextElRef.value,
        prevEl: prevElRef.value,
        paginationEl: paginationElRef.value,
        scrollbarEl: scrollbarElRef.value,
        swiper: swiperRef.value
      }, swiperParams);
      emit("swiper", swiperRef.value);
    });
    vue_cjs_prod.onBeforeUnmount(() => {
      if (swiperRef.value && !swiperRef.value.destroyed) {
        swiperRef.value.destroy(true, false);
      }
    });
    function renderSlides(slides) {
      if (swiperParams.virtual) {
        return renderVirtual(swiperRef, slides, virtualData.value);
      }
      if (!swiperParams.loop || swiperRef.value && swiperRef.value.destroyed) {
        slides.forEach((slide2) => {
          if (!slide2.props)
            slide2.props = {};
          slide2.props.swiperRef = swiperRef;
        });
        return slides;
      }
      return renderLoop(swiperRef, slides, swiperParams);
    }
    return () => {
      const {
        slides,
        slots
      } = getChildren(originalSlots, slidesRef, oldSlidesRef);
      return vue_cjs_prod.h(Tag2, {
        ref: swiperElRef,
        class: uniqueClasses(containerClasses.value)
      }, [slots["container-start"], vue_cjs_prod.h(WrapperTag, {
        class: "swiper-wrapper"
      }, [slots["wrapper-start"], renderSlides(slides), slots["wrapper-end"]]), needsNavigation(props) && [vue_cjs_prod.h("div", {
        ref: prevElRef,
        class: "swiper-button-prev"
      }), vue_cjs_prod.h("div", {
        ref: nextElRef,
        class: "swiper-button-next"
      })], needsScrollbar(props) && vue_cjs_prod.h("div", {
        ref: scrollbarElRef,
        class: "swiper-scrollbar"
      }), needsPagination(props) && vue_cjs_prod.h("div", {
        ref: paginationElRef,
        class: "swiper-pagination"
      }), slots["container-end"]]);
    };
  }
};
const SwiperSlide = {
  name: "SwiperSlide",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    swiperRef: {
      type: Object,
      required: false
    },
    zoom: {
      type: Boolean,
      default: void 0
    },
    virtualIndex: {
      type: [String, Number],
      default: void 0
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    let eventAttached = false;
    const {
      swiperRef
    } = props;
    const slideElRef = vue_cjs_prod.ref(null);
    const slideClasses = vue_cjs_prod.ref("swiper-slide");
    function updateClasses(swiper, el, classNames) {
      if (el === slideElRef.value) {
        slideClasses.value = classNames;
      }
    }
    vue_cjs_prod.onMounted(() => {
      if (!swiperRef.value)
        return;
      swiperRef.value.on("_slideClass", updateClasses);
      eventAttached = true;
    });
    vue_cjs_prod.onBeforeUpdate(() => {
      if (eventAttached || !swiperRef || !swiperRef.value)
        return;
      swiperRef.value.on("_slideClass", updateClasses);
      eventAttached = true;
    });
    vue_cjs_prod.onUpdated(() => {
      if (!slideElRef.value || !swiperRef || !swiperRef.value)
        return;
      if (swiperRef.value.destroyed) {
        if (slideClasses.value !== "swiper-slide") {
          slideClasses.value = "swiper-slide";
        }
      }
    });
    vue_cjs_prod.onBeforeUnmount(() => {
      if (!swiperRef || !swiperRef.value)
        return;
      swiperRef.value.off("_slideClass", updateClasses);
    });
    const slideData = vue_cjs_prod.computed(() => ({
      isActive: slideClasses.value.indexOf("swiper-slide-active") >= 0 || slideClasses.value.indexOf("swiper-slide-duplicate-active") >= 0,
      isVisible: slideClasses.value.indexOf("swiper-slide-visible") >= 0,
      isDuplicate: slideClasses.value.indexOf("swiper-slide-duplicate") >= 0,
      isPrev: slideClasses.value.indexOf("swiper-slide-prev") >= 0 || slideClasses.value.indexOf("swiper-slide-duplicate-prev") >= 0,
      isNext: slideClasses.value.indexOf("swiper-slide-next") >= 0 || slideClasses.value.indexOf("swiper-slide-duplicate-next") >= 0
    }));
    vue_cjs_prod.provide("swiperSlide", slideData);
    return () => {
      return vue_cjs_prod.h(props.tag, {
        class: uniqueClasses(`${slideClasses.value}`),
        ref: slideElRef,
        "data-swiper-slide-index": props.virtualIndex
      }, props.zoom ? vue_cjs_prod.h("div", {
        class: "swiper-zoom-container",
        "data-swiper-zoom": typeof props.zoom === "number" ? props.zoom : void 0
      }, slots.default && slots.default(slideData.value)) : slots.default && slots.default(slideData.value));
    };
  }
};
const _sfc_main$U = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Tabs",
  __ssrInlineRender: true,
  props: {
    tabs: { default: () => [] },
    isBig: { type: Boolean, default: false }
  },
  emits: ["onTabChange"],
  setup(__props, { emit: $e }) {
    const $p = __props;
    const handleTabChange = (index2) => {
      $p.tabs.forEach((tab, i) => {
        if (index2 === i) {
          tab.selected = true;
          $e("onTabChange", tab.value);
        } else {
          tab.selected = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$V;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref($s$o).Tabs__List
      }, _attrs))}>`);
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(Swiper), {
        slidesPerView: "auto",
        class: vue_cjs_prod.unref($s$o).Tabs__Slider
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer.exports.ssrRenderList($p.tabs, (tab, i) => {
              _push2(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(SwiperSlide), {
                key: tab.text + i,
                class: vue_cjs_prod.unref($s$o).Tabs__Slide
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                      kind: "Transparent",
                      class: {
                        [vue_cjs_prod.unref($s$o).Tabs__Tab]: true,
                        [vue_cjs_prod.unref($s$o).Tabs__Tab_Selected]: tab.selected,
                        [vue_cjs_prod.unref($s$o).Tabs__Tab_Big]: $p.isBig
                      },
                      onClick: ($event) => handleTabChange(i)
                    }, {
                      default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer.exports.ssrInterpolate(tab.text)}`);
                        } else {
                          return [
                            vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(tab.text), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      vue_cjs_prod.createVNode(_component_Button, {
                        kind: "Transparent",
                        class: {
                          [vue_cjs_prod.unref($s$o).Tabs__Tab]: true,
                          [vue_cjs_prod.unref($s$o).Tabs__Tab_Selected]: tab.selected,
                          [vue_cjs_prod.unref($s$o).Tabs__Tab_Big]: $p.isBig
                        },
                        onClick: ($event) => handleTabChange(i)
                      }, {
                        default: vue_cjs_prod.withCtx(() => [
                          vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(tab.text), 1)
                        ]),
                        _: 2
                      }, 1032, ["class", "onClick"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList($p.tabs, (tab, i) => {
                return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.unref(SwiperSlide), {
                  key: tab.text + i,
                  class: vue_cjs_prod.unref($s$o).Tabs__Slide
                }, {
                  default: vue_cjs_prod.withCtx(() => [
                    vue_cjs_prod.createVNode(_component_Button, {
                      kind: "Transparent",
                      class: {
                        [vue_cjs_prod.unref($s$o).Tabs__Tab]: true,
                        [vue_cjs_prod.unref($s$o).Tabs__Tab_Selected]: tab.selected,
                        [vue_cjs_prod.unref($s$o).Tabs__Tab_Big]: $p.isBig
                      },
                      onClick: ($event) => handleTabChange(i)
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(tab.text), 1)
                      ]),
                      _: 2
                    }, 1032, ["class", "onClick"])
                  ]),
                  _: 2
                }, 1032, ["class"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$U = _sfc_main$U.setup;
_sfc_main$U.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Tabs/Tabs.vue");
  return _sfc_setup$U ? _sfc_setup$U(props, ctx) : void 0;
};
const useAdminStore = defineStore("admin", {
  state: () => {
    return {
      selectedTab: "Tourists"
    };
  },
  getters: {
    getSelectedTab: (state) => state.selectedTab
  },
  actions: {
    setSelectedTab(tabName) {
      this.selectedTab = tabName;
    }
  }
});
const _sfc_main$T = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "CatTabs",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const tabs = vue_cjs_prod.ref([
      {
        text: "\u0422\u0443\u0440\u0438\u0441\u0442\u044B",
        value: "Tourists",
        selected: true
      },
      {
        text: "\u0422\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u044B",
        value: "Agents"
      },
      {
        text: "\u0422\u0443\u0440\u044B",
        value: "Tours"
      }
    ]);
    const $adminStore = useAdminStore();
    const handleTabChange = (selectedTabValue) => {
      $adminStore.setSelectedTab(selectedTabValue);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Tabs = _sfc_main$U;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Tabs, vue_cjs_prod.mergeProps({
        tabs: tabs.value,
        isBig: true,
        onOnTabChange: handleTabChange
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$T = _sfc_main$T.setup;
_sfc_main$T.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Admin/CatTabs/CatTabs.vue");
  return _sfc_setup$T ? _sfc_setup$T(props, ctx) : void 0;
};
const StickyContainer = "_StickyContainer_1v27w_1";
const $s$n = {
  StickyContainer
};
const _sfc_main$S = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "StickyContainer",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref($s$n).StickyContainer
      }, _attrs))}>`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/StickyContainer/StickyContainer.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
const FormContainer = "_FormContainer_71xpy_1";
const FormContainer_Row = "_FormContainer_Row_71xpy_5";
const FormContainer_Column = "_FormContainer_Column_71xpy_27";
const $s$m = {
  FormContainer,
  FormContainer_Row,
  FormContainer_Column
};
const _sfc_main$R = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "FormContainer",
  __ssrInlineRender: true,
  props: {
    orientation: { default: "Row" }
  },
  setup(__props, { emit: $e }) {
    const $p = __props;
    const compFormClasses = vue_cjs_prod.computed(() => {
      return {
        [`${$s$m.FormContainer}`]: true,
        [$s$m[`FormContainer_${$p.orientation}`]]: true
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: vue_cjs_prod.unref(compFormClasses) }, _attrs))}>`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</form>`);
    };
  }
});
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/FormContainer/FormContainer.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
const Input__Wrapper = "_Input__Wrapper_1qajz_1";
const Input__Wrapper_Textarea = "_Input__Wrapper_Textarea_1qajz_6";
const Input__Input = "_Input__Input_1qajz_9";
const Input__Input_Disabled = "_Input__Input_Disabled_1qajz_23";
const Input__Placeholder = "_Input__Placeholder_1qajz_29";
const Input__Textarea = "_Input__Textarea_1qajz_57";
const Input__FileWrapper = "_Input__FileWrapper_1qajz_61";
const Input__ImagesContainer = "_Input__ImagesContainer_1qajz_66";
const Input__LoadBtn = "_Input__LoadBtn_1qajz_72";
const Input__ImageWrapper = "_Input__ImageWrapper_1qajz_75";
const Input__LoadedImage = "_Input__LoadedImage_1qajz_85";
const Input__DeleteImageBtn = "_Input__DeleteImageBtn_1qajz_90";
const Input__ImageCounter = "_Input__ImageCounter_1qajz_110";
const Input_Error = "_Input_Error_1qajz_125";
const $s$l = {
  Input__Wrapper,
  Input__Wrapper_Textarea,
  Input__Input,
  Input__Input_Disabled,
  Input__Placeholder,
  Input__Textarea,
  Input__FileWrapper,
  Input__ImagesContainer,
  Input__LoadBtn,
  Input__ImageWrapper,
  Input__LoadedImage,
  Input__DeleteImageBtn,
  Input__ImageCounter,
  Input_Error
};
const REG_EXP = {
  commaSeparator: /\s*\,\s*/gm,
  baseList: /[a-zA-Zа-яА-Я0-9\,\s]*/gm,
  exceptBaseList: /[^a-zA-Zа-яА-Я0-9\,\s]+/gm,
  lettersDigits: /[a-zA-Zа-яА-Я0-9]*/gm,
  ecxeptLettersDigits: /[^a-zA-Zа-яА-Я0-9]+/gm,
  letters: /[a-zA-Zа-яА-Я]*/gm,
  ecxeptLetters: /[^a-zA-Zа-яА-Я]+/gm,
  digits: /[0-9]*/gm,
  ecxeptDigits: /[^0-9]+/gm
};
const _sfc_main$Q = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Input",
  __ssrInlineRender: true,
  props: {
    inputModel: { default: "" },
    inputValue: { default: "" },
    label: { default: "" },
    modelSplit: { default: null },
    modelJoin: { default: null },
    charsToDelete: { default: null },
    isNumber: { type: Boolean, default: false },
    maxNumber: { default: null },
    isDisabled: { type: Boolean, default: false },
    maxLength: { type: [Boolean, Number], default: false },
    type: { default: "text" },
    isTextarea: { type: Boolean, default: false },
    isError: { type: Boolean, default: false }
  },
  emits: ["update:inputModel"],
  setup(__props, { emit: $e }) {
    const $p = __props;
    let updateTrigger = vue_cjs_prod.ref("");
    const compInputValue = vue_cjs_prod.computed(() => {
      updateTrigger.value;
      if ($p.inputValue)
        return $p.inputValue;
      else if ($p.modelJoin)
        return $p.inputModel.join($p.modelJoin);
      else if ($p.isNumber)
        return +$p.inputModel;
      else
        return $p.inputModel;
    });
    const compInputClasses = vue_cjs_prod.computed(() => {
      return {
        [$s$l.Input__Input]: true,
        [$s$l.Input__Input_Disabled]: $p.isDisabled,
        [$s$l.Input__Textarea]: $p.isTextarea,
        [$s$l.Input_Error]: $p.isError
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: {
          [vue_cjs_prod.unref($s$l).Input__Wrapper]: true,
          [vue_cjs_prod.unref($s$l).Input__Wrapper_Textarea]: $p.isTextarea
        },
        "data-component": "Input"
      }, _attrs))}>`);
      if (!$p.isTextarea) {
        _push(`<input class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref(compInputClasses))}"${serverRenderer.exports.ssrRenderAttr("value", vue_cjs_prod.unref(compInputValue))} placeholder=" "${serverRenderer.exports.ssrRenderAttr("type", $p.type)}${serverRenderer.exports.ssrIncludeBooleanAttr($p.isDisabled) ? " disabled" : ""}>`);
      } else {
        _push(`<textarea class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref(compInputClasses))}" placeholder=" "${serverRenderer.exports.ssrIncludeBooleanAttr($p.isDisabled) ? " disabled" : ""}${serverRenderer.exports.ssrRenderAttr("maxlength", 2e3)}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(compInputValue))}</textarea>`);
      }
      _push(`<span class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$l).Input__Placeholder)}">${serverRenderer.exports.ssrInterpolate($p.label)}</span></div>`);
    };
  }
});
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Input/Input.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const Checkbox = "_Checkbox_iv391_1";
const Checkbox_Error = "_Checkbox_Error_iv391_8";
const Checkbox__Input = "_Checkbox__Input_iv391_11";
const Checkbox__Text = "_Checkbox__Text_iv391_20";
const $s$k = {
  Checkbox,
  Checkbox_Error,
  Checkbox__Input,
  Checkbox__Text
};
const _sfc_main$P = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Checkbox",
  __ssrInlineRender: true,
  props: {
    isError: { type: Boolean, default: false }
  },
  emits: ["update:checkboxModel"],
  setup(__props, { emit: $e }) {
    const $p = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<label${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: {
          [vue_cjs_prod.unref($s$k).Checkbox]: true,
          [vue_cjs_prod.unref($s$k).Checkbox_Error]: $p.isError
        },
        "data-component": "Checkbox"
      }, _attrs))}><input type="checkbox" class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$k).Checkbox__Input)}"><span class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$k).Checkbox__Text)}">`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span></label>`);
    };
  }
});
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Checkbox/Checkbox.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const FiltersForm__FormControls = "_FiltersForm__FormControls_hlbtk_1";
const FiltersForm__ControlsForm = "_FiltersForm__ControlsForm_hlbtk_14";
const FiltersForm__HiddenFilters = "_FiltersForm__HiddenFilters_hlbtk_44";
const FiltersForm__HiddenFilters_FilterBTN = "_FiltersForm__HiddenFilters_FilterBTN_hlbtk_49";
const $s$j = {
  FiltersForm__FormControls,
  FiltersForm__ControlsForm,
  FiltersForm__HiddenFilters,
  FiltersForm__HiddenFilters_FilterBTN
};
const _sfc_main$O = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Admin",
  __ssrInlineRender: true,
  props: {
    type: { default: "tourist" }
  },
  emits: ["onSubmit"],
  setup(__props, { emit: $e }) {
    const $p = __props;
    const formModel = vue_cjs_prod.ref({
      corpName: "",
      surname: "",
      name: "",
      patronymic: "",
      phone: "",
      email: "",
      isBlocked: false
    });
    let isFiltersOpen = vue_cjs_prod.ref(false);
    const handleFormSubmit = async () => {
      toggleMobileFilters();
      $e("onSubmit", formModel.value);
    };
    const toggleMobileFilters = () => {
      isFiltersOpen.value = !isFiltersOpen.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StickyContainer = _sfc_main$S;
      const _component_FormContainer = _sfc_main$R;
      const _component_Input = _sfc_main$Q;
      const _component_Checkbox = _sfc_main$P;
      const _component_Button = _sfc_main$V;
      _push(serverRenderer.exports.ssrRenderComponent(_component_StickyContainer, _attrs, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_FormContainer, { orientation: "Row" }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="${serverRenderer.exports.ssrRenderClass({
                    [vue_cjs_prod.unref($s$j).FiltersForm__FormControls]: true,
                    [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                  })}"${_scopeId2}>`);
                  if ($p.type === "agent") {
                    _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                      inputModel: formModel.value.corpName,
                      "onUpdate:inputModel": ($event) => formModel.value.corpName = $event,
                      label: "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F",
                      charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if ($p.type === "tourist") {
                    _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                      inputModel: formModel.value.surname,
                      "onUpdate:inputModel": ($event) => formModel.value.surname = $event,
                      label: "\u0424\u0430\u043C\u0438\u043B\u0438\u044F",
                      charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if ($p.type === "tourist") {
                    _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                      inputModel: formModel.value.name,
                      "onUpdate:inputModel": ($event) => formModel.value.name = $event,
                      label: "\u0418\u043C\u044F",
                      charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if ($p.type === "tourist") {
                    _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                      inputModel: formModel.value.patronymic,
                      "onUpdate:inputModel": ($event) => formModel.value.patronymic = $event,
                      label: "\u041E\u0442\u0447\u0435\u0441\u0442\u0432\u043E",
                      charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputModel: formModel.value.phone,
                    "onUpdate:inputModel": ($event) => formModel.value.phone = $event,
                    label: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputModel: formModel.value.email,
                    "onUpdate:inputModel": ($event) => formModel.value.email = $event,
                    label: "email"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Checkbox, {
                    checkboxModel: formModel.value.isBlocked,
                    "onUpdate:checkboxModel": ($event) => formModel.value.isBlocked = $event
                  }, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` \u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D `);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode(" \u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                    kind: "Main",
                    corners: "Md",
                    onClick: handleFormSubmit,
                    class: {
                      [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                    }
                  }, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` \u0418\u0441\u043A\u0430\u0442\u044C `);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode(" \u0418\u0441\u043A\u0430\u0442\u044C ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (!isFiltersOpen.value) {
                    _push3(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                      kind: "Secondary",
                      corners: "Md",
                      onClick: toggleMobileFilters,
                      class: {
                        [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters_FilterBTN]: true
                      }
                    }, {
                      default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` \u0424\u0438\u043B\u044C\u0442\u0440\u044B `);
                        } else {
                          return [
                            vue_cjs_prod.createTextVNode(" \u0424\u0438\u043B\u044C\u0442\u0440\u044B ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    vue_cjs_prod.createVNode("div", {
                      class: {
                        [vue_cjs_prod.unref($s$j).FiltersForm__FormControls]: true,
                        [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                      }
                    }, [
                      $p.type === "agent" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Input, {
                        key: 0,
                        inputModel: formModel.value.corpName,
                        "onUpdate:inputModel": ($event) => formModel.value.corpName = $event,
                        label: "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F",
                        charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                      }, null, 8, ["inputModel", "onUpdate:inputModel", "charsToDelete"])) : vue_cjs_prod.createCommentVNode("", true),
                      $p.type === "tourist" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Input, {
                        key: 1,
                        inputModel: formModel.value.surname,
                        "onUpdate:inputModel": ($event) => formModel.value.surname = $event,
                        label: "\u0424\u0430\u043C\u0438\u043B\u0438\u044F",
                        charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                      }, null, 8, ["inputModel", "onUpdate:inputModel", "charsToDelete"])) : vue_cjs_prod.createCommentVNode("", true),
                      $p.type === "tourist" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Input, {
                        key: 2,
                        inputModel: formModel.value.name,
                        "onUpdate:inputModel": ($event) => formModel.value.name = $event,
                        label: "\u0418\u043C\u044F",
                        charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                      }, null, 8, ["inputModel", "onUpdate:inputModel", "charsToDelete"])) : vue_cjs_prod.createCommentVNode("", true),
                      $p.type === "tourist" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Input, {
                        key: 3,
                        inputModel: formModel.value.patronymic,
                        "onUpdate:inputModel": ($event) => formModel.value.patronymic = $event,
                        label: "\u041E\u0442\u0447\u0435\u0441\u0442\u0432\u043E",
                        charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                      }, null, 8, ["inputModel", "onUpdate:inputModel", "charsToDelete"])) : vue_cjs_prod.createCommentVNode("", true),
                      vue_cjs_prod.createVNode(_component_Input, {
                        inputModel: formModel.value.phone,
                        "onUpdate:inputModel": ($event) => formModel.value.phone = $event,
                        label: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D"
                      }, null, 8, ["inputModel", "onUpdate:inputModel"]),
                      vue_cjs_prod.createVNode(_component_Input, {
                        inputModel: formModel.value.email,
                        "onUpdate:inputModel": ($event) => formModel.value.email = $event,
                        label: "email"
                      }, null, 8, ["inputModel", "onUpdate:inputModel"]),
                      vue_cjs_prod.createVNode(_component_Checkbox, {
                        checkboxModel: formModel.value.isBlocked,
                        "onUpdate:checkboxModel": ($event) => formModel.value.isBlocked = $event
                      }, {
                        default: vue_cjs_prod.withCtx(() => [
                          vue_cjs_prod.createTextVNode(" \u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D ")
                        ]),
                        _: 1
                      }, 8, ["checkboxModel", "onUpdate:checkboxModel"])
                    ], 2),
                    vue_cjs_prod.createVNode(_component_Button, {
                      kind: "Main",
                      corners: "Md",
                      onClick: handleFormSubmit,
                      class: {
                        [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                      }
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(" \u0418\u0441\u043A\u0430\u0442\u044C ")
                      ]),
                      _: 1
                    }, 8, ["class"]),
                    !isFiltersOpen.value ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Button, {
                      key: 0,
                      kind: "Secondary",
                      corners: "Md",
                      onClick: toggleMobileFilters,
                      class: {
                        [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters_FilterBTN]: true
                      }
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(" \u0424\u0438\u043B\u044C\u0442\u0440\u044B ")
                      ]),
                      _: 1
                    }, 8, ["class"])) : vue_cjs_prod.createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_FormContainer, { orientation: "Row" }, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createVNode("div", {
                    class: {
                      [vue_cjs_prod.unref($s$j).FiltersForm__FormControls]: true,
                      [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                    }
                  }, [
                    $p.type === "agent" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Input, {
                      key: 0,
                      inputModel: formModel.value.corpName,
                      "onUpdate:inputModel": ($event) => formModel.value.corpName = $event,
                      label: "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F",
                      charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "charsToDelete"])) : vue_cjs_prod.createCommentVNode("", true),
                    $p.type === "tourist" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Input, {
                      key: 1,
                      inputModel: formModel.value.surname,
                      "onUpdate:inputModel": ($event) => formModel.value.surname = $event,
                      label: "\u0424\u0430\u043C\u0438\u043B\u0438\u044F",
                      charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "charsToDelete"])) : vue_cjs_prod.createCommentVNode("", true),
                    $p.type === "tourist" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Input, {
                      key: 2,
                      inputModel: formModel.value.name,
                      "onUpdate:inputModel": ($event) => formModel.value.name = $event,
                      label: "\u0418\u043C\u044F",
                      charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "charsToDelete"])) : vue_cjs_prod.createCommentVNode("", true),
                    $p.type === "tourist" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Input, {
                      key: 3,
                      inputModel: formModel.value.patronymic,
                      "onUpdate:inputModel": ($event) => formModel.value.patronymic = $event,
                      label: "\u041E\u0442\u0447\u0435\u0441\u0442\u0432\u043E",
                      charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "charsToDelete"])) : vue_cjs_prod.createCommentVNode("", true),
                    vue_cjs_prod.createVNode(_component_Input, {
                      inputModel: formModel.value.phone,
                      "onUpdate:inputModel": ($event) => formModel.value.phone = $event,
                      label: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D"
                    }, null, 8, ["inputModel", "onUpdate:inputModel"]),
                    vue_cjs_prod.createVNode(_component_Input, {
                      inputModel: formModel.value.email,
                      "onUpdate:inputModel": ($event) => formModel.value.email = $event,
                      label: "email"
                    }, null, 8, ["inputModel", "onUpdate:inputModel"]),
                    vue_cjs_prod.createVNode(_component_Checkbox, {
                      checkboxModel: formModel.value.isBlocked,
                      "onUpdate:checkboxModel": ($event) => formModel.value.isBlocked = $event
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(" \u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D ")
                      ]),
                      _: 1
                    }, 8, ["checkboxModel", "onUpdate:checkboxModel"])
                  ], 2),
                  vue_cjs_prod.createVNode(_component_Button, {
                    kind: "Main",
                    corners: "Md",
                    onClick: handleFormSubmit,
                    class: {
                      [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                    }
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u0418\u0441\u043A\u0430\u0442\u044C ")
                    ]),
                    _: 1
                  }, 8, ["class"]),
                  !isFiltersOpen.value ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Button, {
                    key: 0,
                    kind: "Secondary",
                    corners: "Md",
                    onClick: toggleMobileFilters,
                    class: {
                      [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters_FilterBTN]: true
                    }
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u0424\u0438\u043B\u044C\u0442\u0440\u044B ")
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue_cjs_prod.createCommentVNode("", true)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/FiltersForm/Admin.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const ScrollContainer = "_ScrollContainer_n4fbi_1";
const ScrollContainer_Unstyled = "_ScrollContainer_Unstyled_n4fbi_39";
const ScrollContainer__ScrollbarContainer = "_ScrollContainer__ScrollbarContainer_n4fbi_43";
const ScrollContainer__ScrollbarContainer_Unstyled = "_ScrollContainer__ScrollbarContainer_Unstyled_n4fbi_49";
const $s$i = {
  ScrollContainer,
  ScrollContainer_Unstyled,
  ScrollContainer__ScrollbarContainer,
  ScrollContainer__ScrollbarContainer_Unstyled
};
const _sfc_main$N = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "ScrollContainer",
  __ssrInlineRender: true,
  props: {
    unstyled: { type: Boolean, default: false },
    noScrollbar: { type: Boolean, default: false }
  },
  setup(__props, { emit: $e }) {
    const $p = __props;
    const scrollContainer = vue_cjs_prod.ref(null);
    vue_cjs_prod.onMounted(() => {
      Scrollbar.init(scrollContainer.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: {
          [vue_cjs_prod.unref($s$i).ScrollContainer]: true,
          [vue_cjs_prod.unref($s$i).ScrollContainer_Unstyled]: $p.unstyled
        }
      }, _attrs))}><div class="${serverRenderer.exports.ssrRenderClass({
        [vue_cjs_prod.unref($s$i).ScrollContainer__ScrollbarContainer]: true,
        [vue_cjs_prod.unref($s$i).ScrollContainer__ScrollbarContainer_Unstyled]: $p.unstyled
      })}">`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/ScrollContainer/ScrollContainer.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const Tag = "_Tag_1d0d0_1";
const Tag_NEW = "_Tag_NEW_1d0d0_12";
const Tag_ACTIVE = "_Tag_ACTIVE_1d0d0_15";
const Tag_PENDING = "_Tag_PENDING_1d0d0_18";
const Tag_FINISHED = "_Tag_FINISHED_1d0d0_21";
const Tag_BLOCKED = "_Tag_BLOCKED_1d0d0_24";
const Tag_CANCELED = "_Tag_CANCELED_1d0d0_27";
const Tag_BOOK_CANCELED = "_Tag_BOOK_CANCELED_1d0d0_30";
const $s$h = {
  Tag,
  Tag_NEW,
  Tag_ACTIVE,
  Tag_PENDING,
  Tag_FINISHED,
  Tag_BLOCKED,
  Tag_CANCELED,
  Tag_BOOK_CANCELED
};
const _sfc_main$M = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Tag",
  __ssrInlineRender: true,
  props: {
    type: { default: "NEW" }
  },
  setup(__props, { emit: $e }) {
    const $p = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: {
          [vue_cjs_prod.unref($s$h).Tag]: true,
          [vue_cjs_prod.unref($s$h)[`Tag_${$p.type}`]]: true
        }
      }, _attrs))}>`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Tag/Tag.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const ListCard = "_ListCard_1gy0e_1";
const ListCard__Row = "_ListCard__Row_1gy0e_12";
const ListCard__DescItemWrapper = "_ListCard__DescItemWrapper_1gy0e_24";
const ListCard__Term = "_ListCard__Term_1gy0e_32";
const ListCard__Desc = "_ListCard__Desc_1gy0e_24";
const ListCard__Controls = "_ListCard__Controls_1gy0e_49";
const $s$g = {
  ListCard,
  ListCard__Row,
  ListCard__DescItemWrapper,
  ListCard__Term,
  ListCard__Desc,
  ListCard__Controls
};
var EStatus = /* @__PURE__ */ ((EStatus2) => {
  EStatus2["NEW"] = "\u041D\u041E\u0412\u042B\u0419";
  EStatus2["PENDING"] = "\u0422\u0415\u041A\u0423\u0429\u0418\u0419";
  EStatus2["ACTIVE"] = "\u0410\u041A\u0422\u0418\u0412\u041D\u042B\u0419";
  EStatus2["FINISHED"] = "\u041F\u0420\u041E\u0428\u0415\u0414\u0428\u0418\u0419";
  EStatus2["CANCELED"] = "\u041E\u0422\u041C\u0415\u041D\u0401\u041D";
  EStatus2["BOOK_CANCELED"] = "\u0411\u0420\u041E\u041D\u042C \u041E\u0422\u041C\u0415\u041D\u0415\u041D\u0410";
  EStatus2["BLOCKED"] = "\u0417\u0410\u0411\u041B\u041E\u041A\u0418\u0420\u041E\u0412\u0410\u041D";
  return EStatus2;
})(EStatus || {});
const _sfc_main$L = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "User",
  __ssrInlineRender: true,
  props: {
    type: { default: "agent" },
    data: { default: () => {
      return {};
    } }
  },
  emits: ["onUpdate"],
  setup(__props, { emit: $e }) {
    const $p = __props;
    const compUserTitle = vue_cjs_prod.computed(() => {
      switch ($p.type) {
        case "agent":
          return "\u0424\u0418\u041E";
        case "adminTourist":
          return "\u0424\u0418\u041E";
        case "adminAgent":
          return "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F (\u0438\u043B\u0438 \u0424\u0418\u041E)";
      }
    });
    const changeUserActiveStatus = (isActive) => {
      const userType = $p.type === "adminTourist" ? "tourist" : "agent";
      $fetch(`/api/${userType}`, {
        method: "PUT",
        body: {
          id: $p.data._id,
          isActive
        }
      }).then((res) => {
        $e("onUpdate", res);
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Tag = _sfc_main$M;
      const _component_Button = _sfc_main$V;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref($s$g).ListCard
      }, _attrs))}><dl class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__Row)}"><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__DescItemWrapper)}"><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__Term)}">${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(compUserTitle))}</dt>`);
      if ($p.type === "adminTourist" || $p.type === "agent") {
        _push(`<dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__Desc)}">${serverRenderer.exports.ssrInterpolate($p.data.surname)} ${serverRenderer.exports.ssrInterpolate($p.data.name)} ${serverRenderer.exports.ssrInterpolate($p.data.patronymic[0] || "")}</dd>`);
      } else {
        _push(`<!---->`);
      }
      if ($p.type === "adminAgent") {
        _push(`<dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__Desc)}">${serverRenderer.exports.ssrInterpolate($p.data.corpName)}</dd>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__DescItemWrapper)}"><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__Term)}">\u0422\u0435\u043B\u0435\u0444\u043E\u043D</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__Desc)}">${serverRenderer.exports.ssrInterpolate($p.data.phone)}</dd></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__DescItemWrapper)}"><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__Term)}">Email</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__Desc)}">${serverRenderer.exports.ssrInterpolate($p.data.email)}</dd></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__DescItemWrapper)}"><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__Term)}">${serverRenderer.exports.ssrInterpolate($p.type === "agent" ? "\u0421\u0442\u0430\u0442\u0443\u0441 \u0431\u0440\u043E\u043D\u0438" : "\u0421\u0442\u0430\u0442\u0443\u0441")}</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__Desc)}">`);
      if ($p.type === "agent") {
        _push(serverRenderer.exports.ssrRenderComponent(_component_Tag, {
          type: $p.data.bookStatus
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(EStatus)[$p.data.bookStatus])}`);
            } else {
              return [
                vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(EStatus)[$p.data.bookStatus]), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(serverRenderer.exports.ssrRenderComponent(_component_Tag, {
          type: $p.data.isActive ? "ACTIVE" : "CANCELED"
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer.exports.ssrInterpolate($p.data.isActive ? vue_cjs_prod.unref(EStatus).ACTIVE : vue_cjs_prod.unref(EStatus).BLOCKED)}`);
            } else {
              return [
                vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString($p.data.isActive ? vue_cjs_prod.unref(EStatus).ACTIVE : vue_cjs_prod.unref(EStatus).BLOCKED), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</dd></div>`);
      if ($p.type === "adminTourist" || $p.type === "adminAgent") {
        _push(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$g).ListCard__Controls)}">`);
        if ($p.data.isActive) {
          _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
            kind: "Main",
            corners: "Md",
            onClick: ($event) => changeUserActiveStatus(false)
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` \u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C `);
              } else {
                return [
                  vue_cjs_prod.createTextVNode(" \u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (!$p.data.isActive) {
          _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
            kind: "Secondary",
            corners: "Md",
            onClick: ($event) => changeUserActiveStatus(true)
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` \u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C `);
              } else {
                return [
                  vue_cjs_prod.createTextVNode(" \u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</dl></div>`);
    };
  }
});
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/ListCard/User.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const Common__PageTitle = "_Common__PageTitle_dz3va_1";
const Common__FiltersForm = "_Common__FiltersForm_dz3va_5";
const Common__FiltersForm_Admin = "_Common__FiltersForm_Admin_dz3va_8";
const Common__Row = "_Common__Row_dz3va_21";
const Common__Row_Center = "_Common__Row_Center_dz3va_24";
const $s$f = {
  Common__PageTitle,
  Common__FiltersForm,
  Common__FiltersForm_Admin,
  Common__Row,
  Common__Row_Center
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$K = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "TouristsList",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    vue_cjs_prod.ref("all");
    vue_cjs_prod.ref([
      {
        text: "\u0412\u0441\u0435",
        value: "all",
        selected: true
      },
      {
        text: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435",
        value: "active"
      },
      {
        text: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435",
        value: "blocked"
      }
    ]);
    let tourists = vue_cjs_prod.ref([]);
    vue_cjs_prod.onBeforeMount(() => {
      $fetch("/api/tourist").then((res) => {
        tourists.value = res;
      }).catch((e) => {
        console.error(e);
      });
    });
    const handleCardUpdate = (newData, index2) => {
      tourists.value[index2] = newData;
    };
    const handleFiltersChange = (formModel) => {
      $fetch("/api/tourist/params", {
        method: "GET",
        params: formModel
      }).then((res) => {
        tourists.value = res;
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FiltersFormAdmin = _sfc_main$O;
      const _component_ScrollContainer = _sfc_main$N;
      const _component_ListCardUser = _sfc_main$L;
      _push(`<!--[-->`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_FiltersFormAdmin, {
        class: [vue_cjs_prod.unref($s$f).Common__FiltersForm, vue_cjs_prod.unref($s$f).Common__FiltersForm_Admin],
        type: "tourist",
        onOnSubmit: handleFiltersChange
      }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_ScrollContainer, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer.exports.ssrRenderList(tourists.value, (tourist, i) => {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_ListCardUser, {
                type: "adminTourist",
                data: tourist,
                onOnUpdate: (newData) => handleCardUpdate(newData, i)
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(tourists.value, (tourist, i) => {
                return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_ListCardUser, {
                  type: "adminTourist",
                  data: tourist,
                  onOnUpdate: (newData) => handleCardUpdate(newData, i)
                }, null, 8, ["data", "onOnUpdate"]);
              }), 256))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Admin/Lists/TouristsList.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const TouristsList = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["__scopeId", "data-v-04a09dda"]]);
const _sfc_main$J = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "AgentsList",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    vue_cjs_prod.ref("all");
    vue_cjs_prod.ref([
      {
        text: "\u0412\u0441\u0435",
        value: "all",
        selected: true
      },
      {
        text: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435",
        value: "active"
      },
      {
        text: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435",
        value: "blocked"
      }
    ]);
    let agents = vue_cjs_prod.ref([]);
    vue_cjs_prod.onBeforeMount(() => {
      $fetch("/api/agent").then((res) => {
        agents.value = res;
      }).catch((e) => {
        console.error(e);
      });
    });
    const handleCardUpdate = (newData, index2) => {
      agents.value[index2] = newData;
    };
    const handleFiltersChange = (formData) => {
      $fetch("/api/agent/params", {
        method: "GET",
        params: formData
      }).then((res) => {
        agents.value = res;
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FiltersFormAdmin = _sfc_main$O;
      const _component_ScrollContainer = _sfc_main$N;
      const _component_ListCardUser = _sfc_main$L;
      _push(`<!--[-->`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_FiltersFormAdmin, {
        class: [vue_cjs_prod.unref($s$f).Common__FiltersForm, vue_cjs_prod.unref($s$f).Common__FiltersForm_Admin],
        type: "agent",
        onOnSubmit: handleFiltersChange
      }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_ScrollContainer, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer.exports.ssrRenderList(agents.value, (agent, i) => {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_ListCardUser, {
                type: "adminAgent",
                data: agent,
                onOnUpdate: (newData) => handleCardUpdate(newData, i)
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(agents.value, (agent, i) => {
                return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_ListCardUser, {
                  type: "adminAgent",
                  data: agent,
                  onOnUpdate: (newData) => handleCardUpdate(newData, i)
                }, null, 8, ["data", "onOnUpdate"]);
              }), 256))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Admin/Lists/AgentsList.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const __nuxt_component_0$1 = vue_cjs_prod.defineComponent({
  name: "ClientOnly",
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots }) {
    const mounted = vue_cjs_prod.ref(false);
    vue_cjs_prod.onMounted(() => {
      mounted.value = true;
    });
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return vue_cjs_prod.createElementBlock(fallbackTag, null, fallbackStr);
    };
  }
});
const Datepicker = "_Datepicker_1evv3_1";
const $s$e = {
  Datepicker
};
const _sfc_main$I = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Datepicker",
  __ssrInlineRender: true,
  props: {
    inputLabel: { default: "" },
    minDate: { default: null },
    maxDate: { default: null },
    noDateRange: { type: Boolean },
    datepickerModel: { default: null },
    isError: { type: Boolean, default: false }
  },
  emits: ["update:datepickerModel"],
  setup(__props, { emit: $e }) {
    const $p = __props;
    const localModel = vue_cjs_prod.ref();
    const pickerProps = vue_cjs_prod.ref({
      format: "dd.MM.yyyy",
      monthNameFormat: "long",
      locale: "ru",
      clearable: true,
      autoApply: true,
      enableTimePicker: false,
      closeOnScroll: true
    });
    const compMinDate = vue_cjs_prod.computed(() => {
      if (!$p.minDate)
        return new Date();
      else
        return $p.minDate;
    });
    const compMaxDate = vue_cjs_prod.computed(() => {
      if (!$p.maxDate)
        return dfns.add(new Date(), { months: 3 });
      else
        return $p.maxDate;
    });
    const handleDate = (modelData) => {
      $e("update:datepickerModel", modelData);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_Input = _sfc_main$Q;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ "data-component": "Datepicker" }, _attrs))}>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_ClientOnly, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(Datepicker$1), {
              modelValue: localModel.value,
              "onUpdate:modelValue": [($event) => localModel.value = $event, handleDate],
              format: pickerProps.value.format,
              locale: pickerProps.value.locale,
              monthNameFormat: pickerProps.value.monthNameFormat,
              clearable: pickerProps.value.clearable,
              autoApply: pickerProps.value.autoApply,
              minDate: $p.noDateRange ? null : vue_cjs_prod.unref(compMinDate),
              maxDate: $p.noDateRange ? null : vue_cjs_prod.unref(compMaxDate),
              closeOnScroll: pickerProps.value.closeOnScroll,
              enableTimePicker: pickerProps.value.enableTimePicker,
              class: vue_cjs_prod.unref($s$e).Datepicker
            }, {
              "dp-input": vue_cjs_prod.withCtx(({ value, onInput, onEnter, onTab, onClear }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputValue: value,
                    label: $p.inputLabel,
                    isError: $p.isError
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vue_cjs_prod.createVNode(_component_Input, {
                      inputValue: value,
                      label: $p.inputLabel,
                      isError: $p.isError
                    }, null, 8, ["inputValue", "label", "isError"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(vue_cjs_prod.unref(Datepicker$1), {
                modelValue: localModel.value,
                "onUpdate:modelValue": [($event) => localModel.value = $event, handleDate],
                format: pickerProps.value.format,
                locale: pickerProps.value.locale,
                monthNameFormat: pickerProps.value.monthNameFormat,
                clearable: pickerProps.value.clearable,
                autoApply: pickerProps.value.autoApply,
                minDate: $p.noDateRange ? null : vue_cjs_prod.unref(compMinDate),
                maxDate: $p.noDateRange ? null : vue_cjs_prod.unref(compMaxDate),
                closeOnScroll: pickerProps.value.closeOnScroll,
                enableTimePicker: pickerProps.value.enableTimePicker,
                class: vue_cjs_prod.unref($s$e).Datepicker
              }, {
                "dp-input": vue_cjs_prod.withCtx(({ value, onInput, onEnter, onTab, onClear }) => [
                  vue_cjs_prod.createVNode(_component_Input, {
                    inputValue: value,
                    label: $p.inputLabel,
                    isError: $p.isError
                  }, null, 8, ["inputValue", "label", "isError"])
                ]),
                _: 1
              }, 8, ["modelValue", "onUpdate:modelValue", "format", "locale", "monthNameFormat", "clearable", "autoApply", "minDate", "maxDate", "closeOnScroll", "enableTimePicker", "class"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Datepicker/Datepicker.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
function unwrapObj(obj) {
  let ignoreKeys = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  return Object.keys(obj).reduce((o, k) => {
    if (ignoreKeys.includes(k))
      return o;
    o[k] = vue_cjs_prod.unref(obj[k]);
    return o;
  }, {});
}
function isFunction(val) {
  return typeof val === "function";
}
function isProxy(value) {
  return vue_cjs_prod.isReactive(value) || vue_cjs_prod.isReadonly(value);
}
function callRule(rule, value, siblingState, instance) {
  return rule.call(instance, vue_cjs_prod.unref(value), vue_cjs_prod.unref(siblingState), instance);
}
function normalizeValidatorResponse(result) {
  return result.$valid !== void 0 ? !result.$valid : !result;
}
function createAsyncResult(rule, model, $pending, $dirty, _ref, $response, instance) {
  let {
    $lazy,
    $rewardEarly
  } = _ref;
  let watchTargets = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : [];
  let siblingState = arguments.length > 8 ? arguments[8] : void 0;
  let $lastInvalidState = arguments.length > 9 ? arguments[9] : void 0;
  let $lastCommittedOn = arguments.length > 10 ? arguments[10] : void 0;
  const $invalid = vue_cjs_prod.ref(!!$dirty.value);
  const $pendingCounter = vue_cjs_prod.ref(0);
  $pending.value = false;
  const $unwatch = vue_cjs_prod.watch([model, $dirty].concat(watchTargets, $lastCommittedOn), () => {
    if ($lazy && !$dirty.value || $rewardEarly && !$lastInvalidState.value && !$pending.value) {
      return;
    }
    let ruleResult;
    try {
      ruleResult = callRule(rule, model, siblingState, instance);
    } catch (err) {
      ruleResult = Promise.reject(err);
    }
    $pendingCounter.value++;
    $pending.value = !!$pendingCounter.value;
    $invalid.value = false;
    Promise.resolve(ruleResult).then((data) => {
      $pendingCounter.value--;
      $pending.value = !!$pendingCounter.value;
      $response.value = data;
      $invalid.value = normalizeValidatorResponse(data);
    }).catch((error) => {
      $pendingCounter.value--;
      $pending.value = !!$pendingCounter.value;
      $response.value = error;
      $invalid.value = true;
    });
  }, {
    immediate: true,
    deep: typeof model === "object"
  });
  return {
    $invalid,
    $unwatch
  };
}
function createSyncResult(rule, model, $dirty, _ref2, $response, instance, siblingState, $lastInvalidState) {
  let {
    $lazy,
    $rewardEarly
  } = _ref2;
  const $unwatch = () => ({});
  const $invalid = vue_cjs_prod.computed(() => {
    if ($lazy && !$dirty.value || $rewardEarly && !$lastInvalidState.value) {
      return false;
    }
    let returnValue = true;
    try {
      const result = callRule(rule, model, siblingState, instance);
      $response.value = result;
      returnValue = normalizeValidatorResponse(result);
    } catch (err) {
      $response.value = err;
    }
    return returnValue;
  });
  return {
    $unwatch,
    $invalid
  };
}
function createValidatorResult(rule, model, $dirty, config, instance, validatorName, propertyKey, propertyPath, siblingState, $lastInvalidState, $lastCommittedOn) {
  const $pending = vue_cjs_prod.ref(false);
  const $params = rule.$params || {};
  const $response = vue_cjs_prod.ref(null);
  let $invalid;
  let $unwatch;
  if (rule.$async) {
    ({
      $invalid,
      $unwatch
    } = createAsyncResult(rule.$validator, model, $pending, $dirty, config, $response, instance, rule.$watchTargets, siblingState, $lastInvalidState, $lastCommittedOn));
  } else {
    ({
      $invalid,
      $unwatch
    } = createSyncResult(rule.$validator, model, $dirty, config, $response, instance, siblingState, $lastInvalidState));
  }
  const message = rule.$message;
  const $message = isFunction(message) ? vue_cjs_prod.computed(() => message(unwrapObj({
    $pending,
    $invalid,
    $params: unwrapObj($params),
    $model: model,
    $response,
    $validator: validatorName,
    $propertyPath: propertyPath,
    $property: propertyKey
  }))) : message || "";
  return {
    $message,
    $params,
    $pending,
    $invalid,
    $response,
    $unwatch
  };
}
function sortValidations() {
  let validationsRaw = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const validations = vue_cjs_prod.unref(validationsRaw);
  const validationKeys = Object.keys(validations);
  const rules = {};
  const nestedValidators = {};
  const config = {};
  validationKeys.forEach((key) => {
    const v = validations[key];
    switch (true) {
      case isFunction(v.$validator):
        rules[key] = v;
        break;
      case isFunction(v):
        rules[key] = {
          $validator: v
        };
        break;
      case key.startsWith("$"):
        config[key] = v;
        break;
      default:
        nestedValidators[key] = v;
    }
  });
  return {
    rules,
    nestedValidators,
    config
  };
}
function _empty() {
}
const ROOT_PATH = "__root";
function _call(body, then, direct) {
  if (direct) {
    return then ? then(body()) : body();
  }
  try {
    var result = Promise.resolve(body());
    return then ? result.then(then) : result;
  } catch (e) {
    return Promise.reject(e);
  }
}
function _callIgnored(body, direct) {
  return _call(body, _empty, direct);
}
function _invoke(body, then) {
  var result = body();
  if (result && result.then) {
    return result.then(then);
  }
  return then(result);
}
function _async(f) {
  return function() {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
function createValidationResults(rules, model, key, resultsCache, path, config, instance, externalResults, siblingState) {
  const ruleKeys = Object.keys(rules);
  const cachedResult = resultsCache.get(path, rules);
  const $dirty = vue_cjs_prod.ref(false);
  const $lastInvalidState = vue_cjs_prod.ref(false);
  const $lastCommittedOn = vue_cjs_prod.ref(0);
  if (cachedResult) {
    if (!cachedResult.$partial)
      return cachedResult;
    cachedResult.$unwatch();
    $dirty.value = cachedResult.$dirty.value;
  }
  const result = {
    $dirty,
    $path: path,
    $touch: () => {
      if (!$dirty.value)
        $dirty.value = true;
    },
    $reset: () => {
      if ($dirty.value)
        $dirty.value = false;
    },
    $commit: () => {
    }
  };
  if (!ruleKeys.length) {
    cachedResult && resultsCache.set(path, rules, result);
    return result;
  }
  ruleKeys.forEach((ruleKey) => {
    result[ruleKey] = createValidatorResult(rules[ruleKey], model, result.$dirty, config, instance, ruleKey, key, path, siblingState, $lastInvalidState, $lastCommittedOn);
  });
  result.$externalResults = vue_cjs_prod.computed(() => {
    if (!externalResults.value)
      return [];
    return [].concat(externalResults.value).map((stringError, index2) => ({
      $propertyPath: path,
      $property: key,
      $validator: "$externalResults",
      $uid: `${path}-externalResult-${index2}`,
      $message: stringError,
      $params: {},
      $response: null,
      $pending: false
    }));
  });
  result.$invalid = vue_cjs_prod.computed(() => {
    const r = ruleKeys.some((ruleKey) => vue_cjs_prod.unref(result[ruleKey].$invalid));
    $lastInvalidState.value = r;
    return !!result.$externalResults.value.length || r;
  });
  result.$pending = vue_cjs_prod.computed(() => ruleKeys.some((ruleKey) => vue_cjs_prod.unref(result[ruleKey].$pending)));
  result.$error = vue_cjs_prod.computed(() => result.$dirty.value ? result.$pending.value || result.$invalid.value : false);
  result.$silentErrors = vue_cjs_prod.computed(() => ruleKeys.filter((ruleKey) => vue_cjs_prod.unref(result[ruleKey].$invalid)).map((ruleKey) => {
    const res = result[ruleKey];
    return vue_cjs_prod.reactive({
      $propertyPath: path,
      $property: key,
      $validator: ruleKey,
      $uid: `${path}-${ruleKey}`,
      $message: res.$message,
      $params: res.$params,
      $response: res.$response,
      $pending: res.$pending
    });
  }).concat(result.$externalResults.value));
  result.$errors = vue_cjs_prod.computed(() => result.$dirty.value ? result.$silentErrors.value : []);
  result.$unwatch = () => ruleKeys.forEach((ruleKey) => {
    result[ruleKey].$unwatch();
  });
  result.$commit = () => {
    $lastInvalidState.value = true;
    $lastCommittedOn.value = Date.now();
  };
  resultsCache.set(path, rules, result);
  return result;
}
function collectNestedValidationResults(validations, nestedState, path, resultsCache, config, instance, nestedExternalResults) {
  const nestedValidationKeys = Object.keys(validations);
  if (!nestedValidationKeys.length)
    return {};
  return nestedValidationKeys.reduce((results, nestedKey) => {
    results[nestedKey] = setValidations({
      validations: validations[nestedKey],
      state: nestedState,
      key: nestedKey,
      parentKey: path,
      resultsCache,
      globalConfig: config,
      instance,
      externalResults: nestedExternalResults
    });
    return results;
  }, {});
}
function createMetaFields(results, nestedResults, childResults) {
  const allResults = vue_cjs_prod.computed(() => [nestedResults, childResults].filter((res) => res).reduce((allRes, res) => {
    return allRes.concat(Object.values(vue_cjs_prod.unref(res)));
  }, []));
  const $dirty = vue_cjs_prod.computed({
    get() {
      return results.$dirty.value || (allResults.value.length ? allResults.value.every((r) => r.$dirty) : false);
    },
    set(v) {
      results.$dirty.value = v;
    }
  });
  const $silentErrors = vue_cjs_prod.computed(() => {
    const modelErrors = vue_cjs_prod.unref(results.$silentErrors) || [];
    const nestedErrors = allResults.value.filter((result) => (vue_cjs_prod.unref(result).$silentErrors || []).length).reduce((errors, result) => {
      return errors.concat(...result.$silentErrors);
    }, []);
    return modelErrors.concat(nestedErrors);
  });
  const $errors = vue_cjs_prod.computed(() => {
    const modelErrors = vue_cjs_prod.unref(results.$errors) || [];
    const nestedErrors = allResults.value.filter((result) => (vue_cjs_prod.unref(result).$errors || []).length).reduce((errors, result) => {
      return errors.concat(...result.$errors);
    }, []);
    return modelErrors.concat(nestedErrors);
  });
  const $invalid = vue_cjs_prod.computed(() => allResults.value.some((r) => r.$invalid) || vue_cjs_prod.unref(results.$invalid) || false);
  const $pending = vue_cjs_prod.computed(() => allResults.value.some((r) => vue_cjs_prod.unref(r.$pending)) || vue_cjs_prod.unref(results.$pending) || false);
  const $anyDirty = vue_cjs_prod.computed(() => allResults.value.some((r) => r.$dirty) || allResults.value.some((r) => r.$anyDirty) || $dirty.value);
  const $error = vue_cjs_prod.computed(() => $dirty.value ? $pending.value || $invalid.value : false);
  const $touch = () => {
    results.$touch();
    allResults.value.forEach((result) => {
      result.$touch();
    });
  };
  const $commit = () => {
    results.$commit();
    allResults.value.forEach((result) => {
      result.$commit();
    });
  };
  const $reset = () => {
    results.$reset();
    allResults.value.forEach((result) => {
      result.$reset();
    });
  };
  if (allResults.value.length && allResults.value.every((nr) => nr.$dirty))
    $touch();
  return {
    $dirty,
    $errors,
    $invalid,
    $anyDirty,
    $error,
    $pending,
    $touch,
    $reset,
    $silentErrors,
    $commit
  };
}
function setValidations(_ref) {
  const $validate = _async(function() {
    $touch();
    return _invoke(function() {
      if (mergedConfig.$rewardEarly) {
        $commit();
        return _callIgnored(vue_cjs_prod.nextTick);
      }
    }, function() {
      return _call(vue_cjs_prod.nextTick, function() {
        return new Promise((resolve) => {
          if (!$pending.value)
            return resolve(!$invalid.value);
          const unwatch = vue_cjs_prod.watch($pending, () => {
            resolve(!$invalid.value);
            unwatch();
          });
        });
      });
    });
  });
  let {
    validations,
    state,
    key,
    parentKey,
    childResults,
    resultsCache,
    globalConfig = {},
    instance,
    externalResults
  } = _ref;
  const path = parentKey ? `${parentKey}.${key}` : key;
  const {
    rules,
    nestedValidators,
    config
  } = sortValidations(validations);
  const mergedConfig = Object.assign({}, globalConfig, config);
  const nestedState = key ? vue_cjs_prod.computed(() => {
    const s = vue_cjs_prod.unref(state);
    return s ? vue_cjs_prod.unref(s[key]) : void 0;
  }) : state;
  const cachedExternalResults = Object.assign({}, vue_cjs_prod.unref(externalResults) || {});
  const nestedExternalResults = vue_cjs_prod.computed(() => {
    const results2 = vue_cjs_prod.unref(externalResults);
    if (!key)
      return results2;
    return results2 ? vue_cjs_prod.unref(results2[key]) : void 0;
  });
  const results = createValidationResults(rules, nestedState, key, resultsCache, path, mergedConfig, instance, nestedExternalResults, state);
  const nestedResults = collectNestedValidationResults(nestedValidators, nestedState, path, resultsCache, mergedConfig, instance, nestedExternalResults);
  const {
    $dirty,
    $errors,
    $invalid,
    $anyDirty,
    $error,
    $pending,
    $touch,
    $reset,
    $silentErrors,
    $commit
  } = createMetaFields(results, nestedResults, childResults);
  const $model = key ? vue_cjs_prod.computed({
    get: () => vue_cjs_prod.unref(nestedState),
    set: (val) => {
      $dirty.value = true;
      const s = vue_cjs_prod.unref(state);
      const external = vue_cjs_prod.unref(externalResults);
      if (external) {
        external[key] = cachedExternalResults[key];
      }
      if (vue_cjs_prod.isRef(s[key])) {
        s[key].value = val;
      } else {
        s[key] = val;
      }
    }
  }) : null;
  if (key && mergedConfig.$autoDirty) {
    vue_cjs_prod.watch(nestedState, () => {
      if (!$dirty.value)
        $touch();
      const external = vue_cjs_prod.unref(externalResults);
      if (external) {
        external[key] = cachedExternalResults[key];
      }
    }, {
      flush: "sync"
    });
  }
  function $getResultsForChild(key2) {
    return (childResults.value || {})[key2];
  }
  function $clearExternalResults() {
    if (vue_cjs_prod.isRef(externalResults)) {
      externalResults.value = cachedExternalResults;
    } else {
      if (Object.keys(cachedExternalResults).length === 0) {
        Object.keys(externalResults).forEach((k) => {
          delete externalResults[k];
        });
      } else {
        Object.assign(externalResults, cachedExternalResults);
      }
    }
  }
  return vue_cjs_prod.reactive(Object.assign({}, results, {
    $model,
    $dirty,
    $error,
    $errors,
    $invalid,
    $anyDirty,
    $pending,
    $touch,
    $reset,
    $path: path || ROOT_PATH,
    $silentErrors,
    $validate,
    $commit
  }, childResults && {
    $getResultsForChild,
    $clearExternalResults
  }, nestedResults));
}
class ResultsStorage {
  constructor() {
    this.storage = /* @__PURE__ */ new Map();
  }
  set(path, rules, result) {
    this.storage.set(path, {
      rules,
      result
    });
  }
  checkRulesValidity(path, rules, storedRules) {
    const storedRulesKeys = Object.keys(storedRules);
    const newRulesKeys = Object.keys(rules);
    if (newRulesKeys.length !== storedRulesKeys.length)
      return false;
    const hasAllValidators = newRulesKeys.every((ruleKey) => storedRulesKeys.includes(ruleKey));
    if (!hasAllValidators)
      return false;
    return newRulesKeys.every((ruleKey) => {
      if (!rules[ruleKey].$params)
        return true;
      return Object.keys(rules[ruleKey].$params).every((paramKey) => {
        return vue_cjs_prod.unref(storedRules[ruleKey].$params[paramKey]) === vue_cjs_prod.unref(rules[ruleKey].$params[paramKey]);
      });
    });
  }
  get(path, rules) {
    const storedRuleResultPair = this.storage.get(path);
    if (!storedRuleResultPair)
      return void 0;
    const {
      rules: storedRules,
      result
    } = storedRuleResultPair;
    const isValidCache = this.checkRulesValidity(path, rules, storedRules);
    const $unwatch = result.$unwatch ? result.$unwatch : () => ({});
    if (!isValidCache)
      return {
        $dirty: result.$dirty,
        $partial: true,
        $unwatch
      };
    return result;
  }
}
const CollectFlag = {
  COLLECT_ALL: true,
  COLLECT_NONE: false
};
const VuelidateInjectChildResults = Symbol("vuelidate#injectChildResults");
const VuelidateRemoveChildResults = Symbol("vuelidate#removeChildResults");
function nestedValidations(_ref) {
  let {
    $scope,
    instance
  } = _ref;
  const childResultsRaw = {};
  const childResultsKeys = vue_cjs_prod.ref([]);
  const childResults = vue_cjs_prod.computed(() => childResultsKeys.value.reduce((results, key) => {
    results[key] = vue_cjs_prod.unref(childResultsRaw[key]);
    return results;
  }, {}));
  function injectChildResultsIntoParent(results, _ref2) {
    let {
      $registerAs: key,
      $scope: childScope,
      $stopPropagation
    } = _ref2;
    if ($stopPropagation || $scope === CollectFlag.COLLECT_NONE || childScope === CollectFlag.COLLECT_NONE || $scope !== CollectFlag.COLLECT_ALL && $scope !== childScope)
      return;
    childResultsRaw[key] = results;
    childResultsKeys.value.push(key);
  }
  instance.__vuelidateInjectInstances = [].concat(instance.__vuelidateInjectInstances || [], injectChildResultsIntoParent);
  function removeChildResultsFromParent(key) {
    childResultsKeys.value = childResultsKeys.value.filter((childKey) => childKey !== key);
    delete childResultsRaw[key];
  }
  instance.__vuelidateRemoveInstances = [].concat(instance.__vuelidateRemoveInstances || [], removeChildResultsFromParent);
  const sendValidationResultsToParent = vue_cjs_prod.inject(VuelidateInjectChildResults, []);
  vue_cjs_prod.provide(VuelidateInjectChildResults, instance.__vuelidateInjectInstances);
  const removeValidationResultsFromParent = vue_cjs_prod.inject(VuelidateRemoveChildResults, []);
  vue_cjs_prod.provide(VuelidateRemoveChildResults, instance.__vuelidateRemoveInstances);
  return {
    childResults,
    sendValidationResultsToParent,
    removeValidationResultsFromParent
  };
}
function ComputedProxyFactory(target) {
  return new Proxy(target, {
    get(target2, prop) {
      return typeof target2[prop] === "object" ? ComputedProxyFactory(target2[prop]) : vue_cjs_prod.computed(() => target2[prop]);
    }
  });
}
function useVuelidate(validations, state) {
  let globalConfig = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  if (arguments.length === 1) {
    globalConfig = validations;
    validations = void 0;
    state = void 0;
  }
  let {
    $registerAs,
    $scope = CollectFlag.COLLECT_ALL,
    $stopPropagation,
    $externalResults,
    currentVueInstance
  } = globalConfig;
  const instance = currentVueInstance || vue_cjs_prod.getCurrentInstance();
  const componentOptions = instance ? instance.proxy.$options : {};
  if (!$registerAs && instance) {
    const uid = instance.uid || instance._uid;
    $registerAs = `_vuelidate_${uid}`;
  }
  const validationResults = vue_cjs_prod.ref({});
  const resultsCache = new ResultsStorage();
  const {
    childResults,
    sendValidationResultsToParent,
    removeValidationResultsFromParent
  } = instance ? nestedValidations({
    $scope,
    instance
  }) : {
    childResults: vue_cjs_prod.ref({})
  };
  if (!validations && componentOptions.validations) {
    const rules = componentOptions.validations;
    state = vue_cjs_prod.ref({});
    vue_cjs_prod.onBeforeMount(() => {
      state.value = instance.proxy;
      vue_cjs_prod.watch(() => isFunction(rules) ? rules.call(state.value, new ComputedProxyFactory(state.value)) : rules, (validations2) => {
        validationResults.value = setValidations({
          validations: validations2,
          state,
          childResults,
          resultsCache,
          globalConfig,
          instance: instance.proxy,
          externalResults: $externalResults || instance.proxy.vuelidateExternalResults
        });
      }, {
        immediate: true
      });
    });
    globalConfig = componentOptions.validationsConfig || globalConfig;
  } else {
    const validationsWatchTarget = vue_cjs_prod.isRef(validations) || isProxy(validations) ? validations : vue_cjs_prod.reactive(validations || {});
    vue_cjs_prod.watch(validationsWatchTarget, (newValidationRules) => {
      validationResults.value = setValidations({
        validations: newValidationRules,
        state,
        childResults,
        resultsCache,
        globalConfig,
        instance: instance ? instance.proxy : {},
        externalResults: $externalResults
      });
    }, {
      immediate: true
    });
  }
  if (instance) {
    sendValidationResultsToParent.forEach((f) => f(validationResults, {
      $registerAs,
      $scope,
      $stopPropagation
    }));
    vue_cjs_prod.onBeforeUnmount(() => removeValidationResultsFromParent.forEach((f) => f($registerAs)));
  }
  return vue_cjs_prod.computed(() => {
    return Object.assign({}, vue_cjs_prod.unref(validationResults.value), childResults.value);
  });
}
const _sfc_main$H = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "FiltersForm",
  __ssrInlineRender: true,
  props: {
    isAdmin: { type: Boolean, default: false }
  },
  emits: ["onSubmit"],
  setup(__props, { emit: $e }) {
    const $p = __props;
    const formModel = vue_cjs_prod.ref({
      place: "",
      priceMin: 0,
      priceMax: 1e5,
      dateStart: null,
      dateEnd: null
    });
    const validationRules = {
      priceMin: {
        between: between(0, 1e5)
      },
      priceMax: {
        between: between(0, 1e5)
      }
    };
    const $v = useVuelidate(validationRules, formModel.value);
    let isFiltersOpen = vue_cjs_prod.ref(false);
    vue_cjs_prod.watch(formModel.value, handleModelChange, { deep: true });
    function handleModelChange() {
      if (formModel.value.priceMax > 1e5)
        formModel.value.priceMax = 1e5;
      if (formModel.value.priceMin > formModel.value.priceMax) {
        formModel.value.priceMin = formModel.value.priceMax;
      }
      if (formModel.value.priceMax < formModel.value.priceMin) {
        formModel.value.priceMax = formModel.value.priceMin;
      }
    }
    const handleFormSubmit = async () => {
      const isFormCorrect = await $v.value.$validate();
      if (isFormCorrect) {
        toggleMobileFilters();
        $e("onSubmit", formModel.value);
      }
    };
    const toggleMobileFilters = () => {
      isFiltersOpen.value = !isFiltersOpen.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StickyContainer = _sfc_main$S;
      const _component_FormContainer = _sfc_main$R;
      const _component_Input = _sfc_main$Q;
      const _component_Datepicker = _sfc_main$I;
      const _component_Button = _sfc_main$V;
      _push(serverRenderer.exports.ssrRenderComponent(_component_StickyContainer, _attrs, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_FormContainer, { orientation: "Row" }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="${serverRenderer.exports.ssrRenderClass({
                    [vue_cjs_prod.unref($s$j).FiltersForm__FormControls]: true,
                    [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                  })}"${_scopeId2}>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputModel: formModel.value.place,
                    "onUpdate:inputModel": ($event) => formModel.value.place = $event,
                    label: "\u041C\u0435\u0441\u0442\u043E",
                    charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$j).FiltersForm__ControlsForm)}"${_scopeId2}>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputModel: formModel.value.priceMin,
                    "onUpdate:inputModel": ($event) => formModel.value.priceMin = $event,
                    label: "\u0426\u0435\u043D\u0430 \u043E\u0442",
                    isNumber: true,
                    maxLength: 6
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputModel: formModel.value.priceMax,
                    "onUpdate:inputModel": ($event) => formModel.value.priceMax = $event,
                    label: "\u0426\u0435\u043D\u0430 \u0434\u043E",
                    isNumber: true,
                    maxLength: 6
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$j).FiltersForm__ControlsForm)}"${_scopeId2}>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Datepicker, {
                    datepickerModel: formModel.value.dateStart,
                    "onUpdate:datepickerModel": ($event) => formModel.value.dateStart = $event,
                    inputLabel: "\u0414\u0430\u0442\u0430 \u043E\u0442",
                    maxDate: formModel.value.dateEnd,
                    noDateRange: $p.isAdmin
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Datepicker, {
                    datepickerModel: formModel.value.dateEnd,
                    "onUpdate:datepickerModel": ($event) => formModel.value.dateEnd = $event,
                    inputLabel: "\u0414\u0430\u0442\u0430 \u0434\u043E",
                    minDate: formModel.value.dateStart,
                    noDateRange: $p.isAdmin
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                    kind: "Main",
                    corners: "Md",
                    onClick: handleFormSubmit,
                    class: {
                      [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                    }
                  }, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` \u0418\u0441\u043A\u0430\u0442\u044C `);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode(" \u0418\u0441\u043A\u0430\u0442\u044C ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (!isFiltersOpen.value) {
                    _push3(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                      kind: "Secondary",
                      corners: "Md",
                      onClick: toggleMobileFilters,
                      class: {
                        [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters_FilterBTN]: true
                      }
                    }, {
                      default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` \u0424\u0438\u043B\u044C\u0442\u0440\u044B `);
                        } else {
                          return [
                            vue_cjs_prod.createTextVNode(" \u0424\u0438\u043B\u044C\u0442\u0440\u044B ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    vue_cjs_prod.createVNode("div", {
                      class: {
                        [vue_cjs_prod.unref($s$j).FiltersForm__FormControls]: true,
                        [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                      }
                    }, [
                      vue_cjs_prod.createVNode(_component_Input, {
                        inputModel: formModel.value.place,
                        "onUpdate:inputModel": ($event) => formModel.value.place = $event,
                        label: "\u041C\u0435\u0441\u0442\u043E",
                        charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                      }, null, 8, ["inputModel", "onUpdate:inputModel", "charsToDelete"]),
                      vue_cjs_prod.createVNode("div", {
                        class: vue_cjs_prod.unref($s$j).FiltersForm__ControlsForm
                      }, [
                        vue_cjs_prod.createVNode(_component_Input, {
                          inputModel: formModel.value.priceMin,
                          "onUpdate:inputModel": ($event) => formModel.value.priceMin = $event,
                          label: "\u0426\u0435\u043D\u0430 \u043E\u0442",
                          isNumber: true,
                          maxLength: 6
                        }, null, 8, ["inputModel", "onUpdate:inputModel"]),
                        vue_cjs_prod.createVNode(_component_Input, {
                          inputModel: formModel.value.priceMax,
                          "onUpdate:inputModel": ($event) => formModel.value.priceMax = $event,
                          label: "\u0426\u0435\u043D\u0430 \u0434\u043E",
                          isNumber: true,
                          maxLength: 6
                        }, null, 8, ["inputModel", "onUpdate:inputModel"])
                      ], 2),
                      vue_cjs_prod.createVNode("div", {
                        class: vue_cjs_prod.unref($s$j).FiltersForm__ControlsForm
                      }, [
                        vue_cjs_prod.createVNode(_component_Datepicker, {
                          datepickerModel: formModel.value.dateStart,
                          "onUpdate:datepickerModel": ($event) => formModel.value.dateStart = $event,
                          inputLabel: "\u0414\u0430\u0442\u0430 \u043E\u0442",
                          maxDate: formModel.value.dateEnd,
                          noDateRange: $p.isAdmin
                        }, null, 8, ["datepickerModel", "onUpdate:datepickerModel", "maxDate", "noDateRange"]),
                        vue_cjs_prod.createVNode(_component_Datepicker, {
                          datepickerModel: formModel.value.dateEnd,
                          "onUpdate:datepickerModel": ($event) => formModel.value.dateEnd = $event,
                          inputLabel: "\u0414\u0430\u0442\u0430 \u0434\u043E",
                          minDate: formModel.value.dateStart,
                          noDateRange: $p.isAdmin
                        }, null, 8, ["datepickerModel", "onUpdate:datepickerModel", "minDate", "noDateRange"])
                      ], 2)
                    ], 2),
                    vue_cjs_prod.createVNode(_component_Button, {
                      kind: "Main",
                      corners: "Md",
                      onClick: handleFormSubmit,
                      class: {
                        [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                      }
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(" \u0418\u0441\u043A\u0430\u0442\u044C ")
                      ]),
                      _: 1
                    }, 8, ["class"]),
                    !isFiltersOpen.value ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Button, {
                      key: 0,
                      kind: "Secondary",
                      corners: "Md",
                      onClick: toggleMobileFilters,
                      class: {
                        [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters_FilterBTN]: true
                      }
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(" \u0424\u0438\u043B\u044C\u0442\u0440\u044B ")
                      ]),
                      _: 1
                    }, 8, ["class"])) : vue_cjs_prod.createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_FormContainer, { orientation: "Row" }, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createVNode("div", {
                    class: {
                      [vue_cjs_prod.unref($s$j).FiltersForm__FormControls]: true,
                      [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                    }
                  }, [
                    vue_cjs_prod.createVNode(_component_Input, {
                      inputModel: formModel.value.place,
                      "onUpdate:inputModel": ($event) => formModel.value.place = $event,
                      label: "\u041C\u0435\u0441\u0442\u043E",
                      charsToDelete: vue_cjs_prod.unref(REG_EXP).ecxeptLetters
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "charsToDelete"]),
                    vue_cjs_prod.createVNode("div", {
                      class: vue_cjs_prod.unref($s$j).FiltersForm__ControlsForm
                    }, [
                      vue_cjs_prod.createVNode(_component_Input, {
                        inputModel: formModel.value.priceMin,
                        "onUpdate:inputModel": ($event) => formModel.value.priceMin = $event,
                        label: "\u0426\u0435\u043D\u0430 \u043E\u0442",
                        isNumber: true,
                        maxLength: 6
                      }, null, 8, ["inputModel", "onUpdate:inputModel"]),
                      vue_cjs_prod.createVNode(_component_Input, {
                        inputModel: formModel.value.priceMax,
                        "onUpdate:inputModel": ($event) => formModel.value.priceMax = $event,
                        label: "\u0426\u0435\u043D\u0430 \u0434\u043E",
                        isNumber: true,
                        maxLength: 6
                      }, null, 8, ["inputModel", "onUpdate:inputModel"])
                    ], 2),
                    vue_cjs_prod.createVNode("div", {
                      class: vue_cjs_prod.unref($s$j).FiltersForm__ControlsForm
                    }, [
                      vue_cjs_prod.createVNode(_component_Datepicker, {
                        datepickerModel: formModel.value.dateStart,
                        "onUpdate:datepickerModel": ($event) => formModel.value.dateStart = $event,
                        inputLabel: "\u0414\u0430\u0442\u0430 \u043E\u0442",
                        maxDate: formModel.value.dateEnd,
                        noDateRange: $p.isAdmin
                      }, null, 8, ["datepickerModel", "onUpdate:datepickerModel", "maxDate", "noDateRange"]),
                      vue_cjs_prod.createVNode(_component_Datepicker, {
                        datepickerModel: formModel.value.dateEnd,
                        "onUpdate:datepickerModel": ($event) => formModel.value.dateEnd = $event,
                        inputLabel: "\u0414\u0430\u0442\u0430 \u0434\u043E",
                        minDate: formModel.value.dateStart,
                        noDateRange: $p.isAdmin
                      }, null, 8, ["datepickerModel", "onUpdate:datepickerModel", "minDate", "noDateRange"])
                    ], 2)
                  ], 2),
                  vue_cjs_prod.createVNode(_component_Button, {
                    kind: "Main",
                    corners: "Md",
                    onClick: handleFormSubmit,
                    class: {
                      [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters]: !isFiltersOpen.value
                    }
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u0418\u0441\u043A\u0430\u0442\u044C ")
                    ]),
                    _: 1
                  }, 8, ["class"]),
                  !isFiltersOpen.value ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Button, {
                    key: 0,
                    kind: "Secondary",
                    corners: "Md",
                    onClick: toggleMobileFilters,
                    class: {
                      [vue_cjs_prod.unref($s$j).FiltersForm__HiddenFilters_FilterBTN]: true
                    }
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u0424\u0438\u043B\u044C\u0442\u0440\u044B ")
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue_cjs_prod.createCommentVNode("", true)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/FiltersForm/FiltersForm.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const TourCard$1 = "_TourCard_kz06x_1";
const TourCard__Image = "_TourCard__Image_kz06x_21";
const TourCard__Promo = "_TourCard__Promo_kz06x_38";
const TourCard__Title = "_TourCard__Title_kz06x_50";
const TourCard__Description = "_TourCard__Description_kz06x_65";
const TourCard__Info = "_TourCard__Info_kz06x_76";
const TourCard__InfoItem = "_TourCard__InfoItem_kz06x_92";
const TourCard__InfoItem_Cut = "_TourCard__InfoItem_Cut_kz06x_99";
const TourCard__InfoSmall = "_TourCard__InfoSmall_kz06x_110";
const TourCard__Controls = "_TourCard__Controls_kz06x_117";
const TourCard__Control = "_TourCard__Control_kz06x_117";
const TourCard__TagsWrapper = "_TourCard__TagsWrapper_kz06x_138";
const $s$d = {
  TourCard: TourCard$1,
  TourCard__Image,
  TourCard__Promo,
  TourCard__Title,
  TourCard__Description,
  TourCard__Info,
  TourCard__InfoItem,
  TourCard__InfoItem_Cut,
  TourCard__InfoSmall,
  TourCard__Controls,
  TourCard__Control,
  TourCard__TagsWrapper
};
const useUIStore = defineStore("ui", {
  state: () => {
    return {
      isScrollBlocked: false
    };
  },
  getters: {
    getIsScrollBlocked: (state) => state.isScrollBlocked
  },
  actions: {
    setIsScrollBlocked(isBlocked) {
      const body = document.querySelector("body");
      if (isBlocked)
        body.classList.add("global_scroll-blocked");
      else
        body.classList.remove("global_scroll-blocked");
      this.isScrollBlocked = isBlocked;
    }
  }
});
const useModalsStore = defineStore("modals", {
  state: () => {
    return {
      currentModalName: null
    };
  },
  getters: {
    getCurrentModalName: (state) => state.currentModalName
  },
  actions: {
    setCurrentModalName(name) {
      const $uiStore = useUIStore();
      if (name)
        $uiStore.setIsScrollBlocked(true);
      else
        $uiStore.setIsScrollBlocked(false);
      this.currentModalName = name;
    }
  }
});
var EModalsNames = /* @__PURE__ */ ((EModalsNames2) => {
  EModalsNames2["TourModal"] = "TourModal";
  EModalsNames2["BookingConfirmModal"] = "BookingConfirmModal";
  EModalsNames2["LoginModal"] = "LoginModal";
  EModalsNames2["SignupModal"] = "SignupModal";
  EModalsNames2["TouristCancelModal"] = "TouristCancelModal";
  EModalsNames2["AgentCancelModal"] = "AgentCancelModal";
  EModalsNames2["TouristsListModal"] = "TouristsListModal";
  EModalsNames2["CreateTourModal"] = "CreateTourModal";
  return EModalsNames2;
})(EModalsNames || {});
const formatJSONDate = (date) => {
  return dfns.format(dfns.parseJSON(date), "d.MM.yy");
};
const STORE_NAMES = {
  USER: "USER"
};
const useUserStore = defineStore("user", {
  state: () => {
    return {
      isKeepAuth: false,
      userInfo: {}
    };
  },
  getters: {
    getIsKeepAuth: (state) => state.isKeepAuth,
    getUserInfo: (state) => state.userInfo,
    getIsTourist: (state) => {
      return !state.userInfo.existType || state.userInfo.existType !== "admin" && state.userInfo.existType !== "agent";
    }
  },
  actions: {
    setIsKeepAuth(isKeep) {
      this.isKeepAuth = isKeep;
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    }
  },
  persist: {
    key: STORE_NAMES.USER
  }
});
const useToursStore = defineStore("tours", {
  state: () => {
    return {
      accountTours: [],
      selectedTourId: null
    };
  },
  getters: {
    getAccountTours: (state) => state.accountTours,
    getSelectedTourId: (state) => state.selectedTourId,
    getSelectedTour: (state) => {
      return state.accountTours.find((tour) => tour._id === state.selectedTourId);
    },
    getTouristBookStatus: (state) => {
      const $userStore = useUserStore();
      return (tourId) => {
        let status = "";
        state.accountTours.forEach((tour) => {
          if (tour._id === tourId) {
            tour.tourists.forEach((tourist) => {
              if (tourist.touristId === $userStore.getUserInfo.info._id) {
                status = tourist.bookStatus;
              }
            });
          }
        });
        return status;
      };
    },
    getTourStatus: (state) => {
      return (tourId) => {
        let status = "";
        state.accountTours.forEach((tour) => {
          if (tour._id === tourId) {
            status = tour.status;
          }
        });
        return status;
      };
    }
  },
  actions: {
    setAccountTours(accountTours) {
      this.accountTours = accountTours;
    },
    setSelectedTourId(tourId) {
      this.selectedTourId = tourId;
    },
    updateTour(id, newTour) {
      const tourIndex = this.accountTours.findIndex((tour) => tour._id === id);
      if (tourIndex >= 0)
        this.accountTours[tourIndex] = __spreadValues(__spreadValues({}, this.accountTours[tourIndex]), newTour);
    },
    removeLocalTour(removeId) {
      this.accountTours = this.accountTours.filter((tour) => tour._id !== removeId);
    },
    loadAllTours() {
      const $userStore = useUserStore();
      const params = {
        status: "ACTIVE"
      };
      if ($userStore.getUserInfo.info && $userStore.getUserInfo.existType === "tourist") {
        params.excludeTouristId = $userStore.getUserInfo.info._id;
      }
      $fetch("/api/tour/params", {
        method: "GET",
        params
      }).then((res) => {
        this.accountTours = res;
      }).catch((e) => {
        console.error(e);
      });
    }
  }
});
const _sfc_main$G = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "TourCard",
  __ssrInlineRender: true,
  props: {
    type: { default: "common" },
    data: { default: () => {
      return {};
    } }
  },
  setup(__props, { emit: $e }) {
    const $p = __props;
    const $modalsStore = useModalsStore();
    const $toursStore = useToursStore();
    const $userStore = useUserStore();
    const compCurrentTouristBookStatus = vue_cjs_prod.computed(() => {
      let isBookActive = true;
      $p.data.tourists.forEach((tourist) => {
        if (tourist.touristId._id == $userStore.getUserInfo.info._id) {
          isBookActive = tourist.bookStatus === "CANCELED";
        }
      });
      return isBookActive;
    });
    const handleModalOpen = (modalName) => {
      $toursStore.setSelectedTourId($p.data._id);
      $modalsStore.setCurrentModalName(modalName);
    };
    const handleBookModalOpen = () => {
      if (!$userStore.getUserInfo.info) {
        $modalsStore.setCurrentModalName(EModalsNames.LoginModal);
      } else {
        $toursStore.setSelectedTourId($p.data._id);
        $modalsStore.setCurrentModalName(EModalsNames.BookingConfirmModal);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$V;
      const _component_Tag = _sfc_main$M;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref($s$d).TourCard
      }, _attrs))}><img${serverRenderer.exports.ssrRenderAttr("src", $p.data.mainPhoto)} alt="tour card image" class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__Image)}"><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__Promo)}"><h3 class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__Title)}">${serverRenderer.exports.ssrInterpolate($p.data.title)}</h3><p class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__Description)}">${serverRenderer.exports.ssrInterpolate($p.data.desc)}</p></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__Info)}"><p class="${serverRenderer.exports.ssrRenderClass([vue_cjs_prod.unref($s$d).TourCard__InfoItem, vue_cjs_prod.unref($s$d).TourCard__InfoItem_Cut])}">${serverRenderer.exports.ssrInterpolate($p.data.place)}</p><p class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__InfoItem)}">${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatJSONDate)($p.data.dateStart))} - ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatJSONDate)($p.data.dateEnd))}</p><p class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__InfoItem)}">${serverRenderer.exports.ssrInterpolate($p.data.price)} \u20BD / <small class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__InfoSmall)}">\u043D\u0430 1 \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430</small></p></div>`);
      if ($p.type === "common") {
        _push(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__Controls)}">`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
          kind: "Secondary",
          corners: "Md",
          onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).TourModal),
          class: vue_cjs_prod.unref($s$d).TourCard__Control
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 `);
            } else {
              return [
                vue_cjs_prod.createTextVNode(" \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vue_cjs_prod.unref($userStore).getIsTourist) {
          _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
            kind: "Main",
            corners: "Md",
            onClick: handleBookModalOpen,
            class: vue_cjs_prod.unref($s$d).TourCard__Control
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` \u0417\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C `);
              } else {
                return [
                  vue_cjs_prod.createTextVNode(" \u0417\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if ($p.type === "tourist") {
        _push(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__Controls)}"><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__TagsWrapper)}">`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_Tag, {
          type: $p.data.status,
          class: vue_cjs_prod.unref($s$d).TourCard__Tag
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(EStatus)[$p.data.status])}`);
            } else {
              return [
                vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(EStatus)[$p.data.status]), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (compCurrentTouristBookStatus.value) {
          _push(serverRenderer.exports.ssrRenderComponent(_component_Tag, {
            type: "BOOK_CANCELED",
            class: vue_cjs_prod.unref($s$d).TourCard__Tag
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(EStatus).BOOK_CANCELED)}`);
              } else {
                return [
                  vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(EStatus).BOOK_CANCELED), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
          kind: "Main",
          corners: "Md",
          onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).TourModal),
          class: vue_cjs_prod.unref($s$d).TourCard__Control
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 `);
            } else {
              return [
                vue_cjs_prod.createTextVNode(" \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if ($p.type === "agent" || $p.type === "admin") {
        _push(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$d).TourCard__Controls)}">`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_Tag, {
          type: $p.data.status,
          class: [vue_cjs_prod.unref($s$d).TourCard__Tag, vue_cjs_prod.unref($s$d).TourCard__TagsWrapper]
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(EStatus)[$p.data.status])}`);
            } else {
              return [
                vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(EStatus)[$p.data.status]), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
          kind: "Secondary",
          corners: "Md",
          onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).TourModal),
          class: vue_cjs_prod.unref($s$d).TourCard__Control
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 `);
            } else {
              return [
                vue_cjs_prod.createTextVNode(" \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
          kind: "Main",
          corners: "Md",
          onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).TouristsListModal),
          class: vue_cjs_prod.unref($s$d).TourCard__Control
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u0422\u0443\u0440\u0438\u0441\u0442\u044B `);
            } else {
              return [
                vue_cjs_prod.createTextVNode(" \u0422\u0443\u0440\u0438\u0441\u0442\u044B ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/TourCard/TourCard.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const TourCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$G
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$F = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "ToursList",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    let selectedTab = vue_cjs_prod.ref("");
    const tabs = vue_cjs_prod.ref([
      {
        text: "\u0412\u0441\u0435",
        value: "",
        selected: true
      },
      {
        text: "\u041D\u043E\u0432\u044B\u0435",
        value: "NEW"
      },
      {
        text: "\u0422\u0435\u043A\u0443\u0449\u0438\u0435",
        value: "PENDING"
      },
      {
        text: "\u041F\u0440\u0435\u0434\u0441\u0442\u043E\u044F\u0449\u0438\u0435",
        value: "ACTIVE"
      },
      {
        text: "\u041F\u0440\u043E\u0448\u0435\u0434\u0448\u0438\u0435",
        value: "FINISHED"
      },
      {
        text: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D\u043D\u044B\u0435",
        value: "CANCELED"
      },
      {
        text: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435",
        value: "BLOCKED"
      }
    ]);
    const $toursStore = useToursStore();
    useAdminStore();
    let savedFormData = {};
    vue_cjs_prod.onBeforeMount(() => {
      $fetch("/api/tour").then((res) => {
        $toursStore.setAccountTours(res);
      }).catch((e) => {
        console.error(e);
      });
    });
    const handleTabChange = (selectedTabValue) => {
      selectedTab.value = selectedTabValue;
      handleFiltersChange({ status: selectedTabValue });
    };
    const handleFiltersChange = (formData) => {
      $toursStore.setAccountTours([]);
      savedFormData = __spreadValues(__spreadValues({}, savedFormData), formData);
      $fetch("/api/tour/params", {
        method: "GET",
        params: savedFormData
      }).then((res) => {
        $toursStore.setAccountTours(res);
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FiltersForm = _sfc_main$H;
      const _component_Tabs = _sfc_main$U;
      const _component_ScrollContainer = _sfc_main$N;
      const _component_TourCard = _sfc_main$G;
      _push(`<!--[-->`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_FiltersForm, {
        class: [vue_cjs_prod.unref($s$f).Common__FiltersForm, vue_cjs_prod.unref($s$f).Common__FiltersForm_Admin],
        isAdmin: true,
        onOnSubmit: handleFiltersChange
      }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_Tabs, {
        tabs: tabs.value,
        onOnTabChange: handleTabChange
      }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_ScrollContainer, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref($toursStore).getAccountTours, (card) => {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_TourCard, {
                key: card._id,
                type: "admin",
                data: card,
                style: selectedTab.value === "" || card.status === selectedTab.value ? null : { display: "none" }
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(vue_cjs_prod.unref($toursStore).getAccountTours, (card) => {
                return vue_cjs_prod.withDirectives((vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_TourCard, {
                  key: card._id,
                  type: "admin",
                  data: card
                }, null, 8, ["data"])), [
                  [vue_cjs_prod.vShow, selectedTab.value === "" || card.status === selectedTab.value]
                ]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Admin/Lists/ToursList.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const __default__$2 = {
  components: {
    TouristsList,
    AgentsList: _sfc_main$J,
    ToursList: _sfc_main$F
  }
};
const _sfc_main$E = /* @__PURE__ */ vue_cjs_prod.defineComponent(__spreadProps(__spreadValues({}, __default__$2), {
  __name: "Lists",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const $adminStore = useAdminStore();
    return (_ctx, _push, _parent, _attrs) => {
      serverRenderer.exports.ssrRenderVNode(_push, vue_cjs_prod.createVNode(vue_cjs_prod.resolveDynamicComponent(`${vue_cjs_prod.unref($adminStore).getSelectedTab}List`), _attrs, null), _parent);
    };
  }
}));
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Admin/Lists/Lists.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const _sfc_main$D = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Admin",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    useAdminStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminCatTabs = _sfc_main$T;
      const _component_AdminLists = _sfc_main$E;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_AdminCatTabs, null, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_AdminLists, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Admin/Admin.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const _sfc_main$C = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Admin = _sfc_main$D;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Admin, _attrs, null, _parent));
    };
  }
});
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const meta$3 = void 0;
const ToursList__AgentsTabs = "_ToursList__AgentsTabs_19yte_1";
const ToursList__CreateBtn = "_ToursList__CreateBtn_19yte_10";
const $s$c = {
  ToursList__AgentsTabs,
  ToursList__CreateBtn
};
const __nuxt_component_4_lazy = vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
  return TourCard;
}));
const _sfc_main$B = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "ToursList",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    let selectedTab = vue_cjs_prod.ref("");
    const tabs = vue_cjs_prod.ref([
      {
        text: "\u0412\u0441\u0435",
        value: "",
        selected: true
      },
      {
        text: "\u041D\u043E\u0432\u044B\u0435",
        value: "NEW"
      },
      {
        text: "\u0422\u0435\u043A\u0443\u0449\u0438\u0435",
        value: "PENDING"
      },
      {
        text: "\u041F\u0440\u0435\u0434\u0441\u0442\u043E\u044F\u0449\u0438\u0435",
        value: "ACTIVE"
      },
      {
        text: "\u041F\u0440\u043E\u0448\u0435\u0434\u0448\u0438\u0435",
        value: "FINISHED"
      },
      {
        text: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D\u043D\u044B\u0435",
        value: "CANCELED"
      },
      {
        text: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435",
        value: "BLOCKED"
      }
    ]);
    const $userStore = useUserStore();
    const $modalsStore = useModalsStore();
    const $toursStore = useToursStore();
    let savedFormData = {
      agentId: $userStore.getUserInfo.info._id
    };
    vue_cjs_prod.onBeforeMount(() => {
      $fetch("/api/tour/params", {
        method: "GET",
        params: savedFormData
      }).then((res) => {
        $toursStore.setAccountTours(res);
      }).catch((e) => {
        console.error(e);
      });
    });
    const handleCreateTourModalOpen = () => {
      $modalsStore.setCurrentModalName(EModalsNames.CreateTourModal);
    };
    const handleTabChange = (selectedTabValue) => {
      selectedTab.value = selectedTabValue;
      handleFiltersChange({ status: selectedTabValue });
    };
    const handleFiltersChange = (formData) => {
      $toursStore.setAccountTours([]);
      savedFormData = __spreadValues(__spreadValues({}, savedFormData), formData);
      $fetch("/api/tour/params", {
        method: "GET",
        params: savedFormData
      }).then((res) => {
        $toursStore.setAccountTours(res);
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FiltersForm = _sfc_main$H;
      const _component_Tabs = _sfc_main$U;
      const _component_Button = _sfc_main$V;
      const _component_ScrollContainer = _sfc_main$N;
      const _component_LazyTourCard = __nuxt_component_4_lazy;
      _push(`<!--[-->`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_FiltersForm, {
        class: vue_cjs_prod.unref($s$f).Common__FiltersForm,
        onOnSubmit: handleFiltersChange
      }, null, _parent));
      _push(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$c).ToursList__AgentsTabs)}">`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Tabs, {
        tabs: tabs.value,
        onOnTabChange: handleTabChange
      }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
        kind: "Main",
        corners: "Md",
        class: vue_cjs_prod.unref($s$c).ToursList__CreateBtn,
        onClick: handleCreateTourModalOpen
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u0421\u043E\u0437\u0434\u0430\u0442\u044C\xA0\xA0\xA0+ `);
          } else {
            return [
              vue_cjs_prod.createTextVNode(" \u0421\u043E\u0437\u0434\u0430\u0442\u044C\xA0\xA0\xA0+ ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_ScrollContainer, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref($toursStore).getAccountTours, (card) => {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_LazyTourCard, {
                key: card._id,
                type: "agent",
                data: card,
                style: selectedTab.value === "" || card.status === selectedTab.value ? null : { display: "none" }
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(vue_cjs_prod.unref($toursStore).getAccountTours, (card) => {
                return vue_cjs_prod.withDirectives((vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_LazyTourCard, {
                  key: card._id,
                  type: "agent",
                  data: card
                }, null, 8, ["data"])), [
                  [vue_cjs_prod.vShow, selectedTab.value === "" || card.status === selectedTab.value]
                ]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Agent/ToursList/ToursList.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const _sfc_main$A = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Agent",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><h2 class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$f).Common__PageTitle)}">\u041C\u043E\u0438 \u0442\u0443\u0440\u044B</h2>`);
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(_sfc_main$B), null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Agent/Agent.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const _sfc_main$z = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Agent = _sfc_main$A;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Agent, _attrs, null, _parent));
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/agent/index.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const meta$2 = void 0;
const _imports_0 = buildAssetsURL("clouds.127a114e.webm");
const _imports_1 = buildAssetsURL("clouds.127a114e.webm");
const PromoSlider = "_PromoSlider_zkv0x_1";
const PromoSlider__Wrapper = "_PromoSlider__Wrapper_zkv0x_19";
const PromoSlider__Title = "_PromoSlider__Title_zkv0x_24";
const PromoSlider__Video = "_PromoSlider__Video_zkv0x_48";
const PromoSlider__Image = "_PromoSlider__Image_zkv0x_54";
const $s$b = {
  PromoSlider,
  PromoSlider__Wrapper,
  PromoSlider__Title,
  PromoSlider__Video,
  PromoSlider__Image
};
const _sfc_main$y = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "PromoSlider",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const imagesMaxCount = 11;
    let currentImageCount = vue_cjs_prod.ref(1);
    let imageChangeTimer = vue_cjs_prod.ref(null);
    const imagePath = vue_cjs_prod.computed(() => `./_nuxt/images/attractions/${currentImageCount.value}.png`);
    vue_cjs_prod.onMounted(() => {
      imageChangeTimer.value = setInterval(() => {
        if (currentImageCount.value < imagesMaxCount)
          currentImageCount.value++;
        else
          currentImageCount.value = 1;
      }, 3e3);
    });
    vue_cjs_prod.onBeforeUnmount(() => {
      clearInterval(imageChangeTimer.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref($s$b).PromoSlider
      }, _attrs))}><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$b).PromoSlider__Wrapper)}"><video class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$b).PromoSlider__Video)}" autoplay muted loop><source${serverRenderer.exports.ssrRenderAttr("src", _imports_0)} type="video/webm"><source${serverRenderer.exports.ssrRenderAttr("src", _imports_1)} type="video/mp4"> Your browser does not support the video tag. </video><h2 class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$b).PromoSlider__Title)}">\u0422\u0443\u0440\u044B \u043F\u043E \u0423\u0434\u043C\u0443\u0440\u0442\u0438\u0438</h2><img${serverRenderer.exports.ssrRenderAttr("src", vue_cjs_prod.unref(imagePath))} alt="attraction slider" class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$b).PromoSlider__Image)}"></div></section>`);
    };
  }
});
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Main/PromoSlider/PromoSlider.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const AllTours = "_AllTours_1kk7x_1";
const AllTours__TitleWrap = "_AllTours__TitleWrap_1kk7x_10";
const AllTours__Promo = "_AllTours__Promo_1kk7x_20";
const $s$a = {
  AllTours,
  AllTours__TitleWrap,
  AllTours__Promo
};
const _sfc_main$x = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "AllTours",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const $toursStore = useToursStore();
    useUserStore();
    vue_cjs_prod.onBeforeMount(() => {
      $toursStore.loadAllTours();
    });
    const handleFiltersChange = (formData) => {
      $fetch("/api/tour/params", {
        method: "GET",
        params: __spreadProps(__spreadValues({}, formData), {
          status: "ACTIVE"
        })
      }).then((res) => {
        $toursStore.setAccountTours(res);
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FiltersForm = _sfc_main$H;
      const _component_ScrollContainer = _sfc_main$N;
      const _component_TourCard = _sfc_main$G;
      _push(`<!--[-->`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_FiltersForm, { onOnSubmit: handleFiltersChange }, null, _parent));
      _push(`<section class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$a).AllTours)}"><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$a).AllTours__TitleWrap)}"><h2>\u0422\u0443\u0440\u044B</h2><p class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$a).AllTours__Promo)}"> \u041F\u043E\u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0439 \u0423\u0434\u043C\u0443\u0440\u0442\u0438\u044E! </p></div>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_ScrollContainer, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref($toursStore).getAccountTours, (card) => {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_TourCard, {
                key: card._id,
                type: "common",
                data: card
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(vue_cjs_prod.unref($toursStore).getAccountTours, (card) => {
                return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_TourCard, {
                  key: card._id,
                  type: "common",
                  data: card
                }, null, 8, ["data"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><!--]-->`);
    };
  }
});
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Main/AllTours/AllTours.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const _sfc_main$w = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Main",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MainPromoSlider = _sfc_main$y;
      const _component_MainAllTours = _sfc_main$x;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_MainPromoSlider, null, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_MainAllTours, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Main/Main.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const _sfc_main$v = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Main = _sfc_main$w;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Main, _attrs, null, _parent));
    };
  }
});
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const meta$1 = void 0;
const __nuxt_component_3_lazy = vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
  return TourCard;
}));
const _sfc_main$u = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "ToursList",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    let selectedTab = vue_cjs_prod.ref("");
    const tabs = vue_cjs_prod.ref([
      {
        text: "\u0412\u0441\u0435",
        value: "",
        selected: true
      },
      {
        text: "\u0422\u0435\u043A\u0443\u0449\u0438\u0435",
        value: "PENDING"
      },
      {
        text: "\u041F\u0440\u0435\u0434\u0441\u0442\u043E\u044F\u0449\u0438\u0435",
        value: "ACTIVE"
      },
      {
        text: "\u041F\u0440\u043E\u0448\u0435\u0434\u0448\u0438\u0435",
        value: "FINISHED"
      },
      {
        text: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D\u043D\u044B\u0435",
        value: "CANCELED"
      }
    ]);
    const $toursStore = useToursStore();
    const $userStore = useUserStore();
    let savedFormData = {
      touristId: $userStore.getUserInfo.info._id
    };
    vue_cjs_prod.onBeforeMount(() => {
      $fetch("/api/tour/params", {
        method: "GET",
        params: savedFormData
      }).then((res) => {
        $toursStore.setAccountTours(res);
      }).catch((e) => {
        console.error(e);
      });
    });
    const handleTabChange = (selectedTabValue) => {
      selectedTab.value = selectedTabValue;
      handleFiltersChange({ status: selectedTabValue });
    };
    const handleFiltersChange = (formData) => {
      savedFormData = __spreadValues(__spreadValues({}, savedFormData), formData);
      $fetch("/api/tour/params", {
        method: "GET",
        params: savedFormData
      }).then((res) => {
        $toursStore.setAccountTours(res);
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FiltersForm = _sfc_main$H;
      const _component_Tabs = _sfc_main$U;
      const _component_ScrollContainer = _sfc_main$N;
      const _component_LazyTourCard = __nuxt_component_3_lazy;
      _push(`<!--[-->`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_FiltersForm, {
        class: vue_cjs_prod.unref($s$f).Common__FiltersForm,
        onOnSubmit: handleFiltersChange
      }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_Tabs, {
        tabs: tabs.value,
        onOnTabChange: handleTabChange
      }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_ScrollContainer, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref($toursStore).getAccountTours, (card) => {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_LazyTourCard, {
                key: card._id,
                type: "tourist",
                data: card
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(vue_cjs_prod.unref($toursStore).getAccountTours, (card) => {
                return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_LazyTourCard, {
                  key: card._id,
                  type: "tourist",
                  data: card
                }, null, 8, ["data"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Tourist/ToursList/ToursList.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const _sfc_main$t = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Tourist",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><h2 class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$f).Common__PageTitle)}">\u041C\u043E\u0438 \u0442\u0443\u0440\u044B</h2>`);
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(_sfc_main$u), null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Tourist/Tourist.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const _sfc_main$s = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Tourist = _sfc_main$t;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Tourist, _attrs, null, _parent));
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tourist/index.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const meta = void 0;
const routes = [
  {
    name: "admin",
    path: "/admin",
    file: "C:/Users/Nutnet/Desktop/Projects/udm-attr-mevn/frontend/pages/admin/index.vue",
    children: [],
    meta: meta$3,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$3;
    })
  },
  {
    name: "agent",
    path: "/agent",
    file: "C:/Users/Nutnet/Desktop/Projects/udm-attr-mevn/frontend/pages/agent/index.vue",
    children: [],
    meta: meta$2,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$2;
    })
  },
  {
    name: "index",
    path: "/",
    file: "C:/Users/Nutnet/Desktop/Projects/udm-attr-mevn/frontend/pages/index.vue",
    children: [],
    meta: meta$1,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$1;
    })
  },
  {
    name: "tourist",
    path: "/tourist",
    file: "C:/Users/Nutnet/Desktop/Projects/udm-attr-mevn/frontend/pages/tourist/index.vue",
    children: [],
    meta,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index;
    })
  }
];
const configRouterOptions = {};
const routerOptions = __spreadValues({}, configRouterOptions);
const router_45main_45global = defineNuxtRouteMiddleware((to, from) => {
  const $userStore = useUserStore();
  if (!$userStore.getUserInfo.existType && to.name !== "index") {
    return navigateTo("/");
  }
  if ($userStore.getUserInfo.existType && to.name !== "index" && to.name !== $userStore.getUserInfo.existType) {
    return navigateTo("/");
  }
});
const globalMiddleware = [
  router_45main_45global
];
const namedMiddleware = {};
const C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47node_modules_47nuxt_47dist_47pages_47runtime_47router = defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("NuxtPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtNestedPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtChild", NuxtPage);
  const baseURL2 = useRuntimeConfig().app.baseURL;
  const routerHistory = vueRouter_cjs_prod.createMemoryHistory(baseURL2);
  const initialURL = nuxtApp.ssrContext.url;
  const router = vueRouter_cjs_prod.createRouter(__spreadProps(__spreadValues({}, routerOptions), {
    history: routerHistory,
    routes
  }));
  nuxtApp.vueApp.use(router);
  const previousRoute = vue_cjs_prod.shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const route = {};
  for (const key in router.currentRoute.value) {
    route[key] = vue_cjs_prod.computed(() => router.currentRoute.value[key]);
  }
  const _activeRoute = vue_cjs_prod.shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _activeRoute.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a, _b, _c, _d;
    if (((_b = (_a = to.matched[0]) == null ? void 0 : _a.components) == null ? void 0 : _b.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
      syncCurrentRoute();
    }
  });
  const activeRoute = {};
  for (const key in _activeRoute.value) {
    activeRoute[key] = vue_cjs_prod.computed(() => _activeRoute.value[key]);
  }
  nuxtApp._route = vue_cjs_prod.reactive(route);
  nuxtApp._activeRoute = vue_cjs_prod.reactive(activeRoute);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  try {
    if (true) {
      await router.push(initialURL);
    }
    await router.isReady();
  } catch (error2) {
    callWithNuxt(nuxtApp, throwError, [error2]);
  }
  router.beforeEach(async (to, from) => {
    var _a;
    to.meta = vue_cjs_prod.reactive(to.meta);
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_a = namedMiddleware[entry2]) == null ? void 0 : _a.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      if (!middleware) {
        throw new Error(`Unknown route middleware: '${entry2}'.`);
      }
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError({
            statusMessage: `Route navigation aborted: ${initialURL}`
          });
          return callWithNuxt(nuxtApp, throwError, [error2]);
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    if (to.matched.length === 0) {
      callWithNuxt(nuxtApp, throwError, [createError({
        statusCode: 404,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else if (to.matched[0].name === "404" && nuxtApp.ssrContext) {
      nuxtApp.ssrContext.res.statusCode = 404;
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual(currentURL, initialURL)) {
        await callWithNuxt(nuxtApp, navigateTo, [currentURL]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace(__spreadProps(__spreadValues({}, router.resolve(initialURL)), {
        name: void 0,
        force: true
      }));
    } catch (error2) {
      callWithNuxt(nuxtApp, throwError, [error2]);
    }
  });
  return { provide: { router } };
});
if (isVue2) {
  install();
  const Vue = "default" in Vue2 ? Vue2.default : Vue2;
  Vue.use(PiniaVuePlugin);
}
const PiniaNuxtPlugin = (context, inject2) => {
  const pinia = createPinia();
  {
    context.vueApp.use(pinia);
  }
  inject2("pinia", pinia);
  context.pinia = pinia;
  setActivePinia(pinia);
  pinia._p.push(({ store }) => {
    Object.defineProperty(store, "$nuxt", { value: context });
  });
  {
    {
      context.nuxtState.pinia = pinia.state.value;
    }
  }
};
const C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47frontend_47plugins_47form_46ts = defineNuxtPlugin(() => {
  return {
    provide: {
      findError: (errorsList, fieldName) => {
        for (let i = 0; i < errorsList.length; i++) {
          if (errorsList[i].$property === fieldName) {
            return true;
          }
        }
        return false;
      }
    }
  };
});
const C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47frontend_47plugins_47persisted_45state_46ts = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(createNuxtPersistedState(useCookie, {
    serializer: {
      serialize: function(state) {
        {
          return CryptoJS.AES.encrypt(JSON.stringify(state), "y^:7aviu2IHF|j&?");
        }
      },
      deserialize: function(stateString) {
        {
          const bytes = CryptoJS.AES.decrypt(stateString, "y^:7aviu2IHF|j&?");
          return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
      }
    }
  }));
});
const _plugins = [
  preload,
  C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47_46nuxt_47components_46plugin_46mjs,
  C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47node_modules_47nuxt_47dist_47head_47runtime_47lib_47vueuse_45head_46plugin,
  C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47node_modules_47nuxt_47dist_47head_47runtime_47plugin,
  C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47node_modules_47nuxt_47dist_47pages_47runtime_47router,
  PiniaNuxtPlugin,
  C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47frontend_47plugins_47form_46ts,
  C_58_47Users_47Nutnet_47Desktop_47Projects_47udm_45attr_45mevn_47frontend_47plugins_47persisted_45state_46ts
];
const _sfc_main$r = {
  __name: "error-404",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    version: {
      type: String,
      default: ""
    },
    statusCode: {
      type: String,
      default: "404"
    },
    statusMessage: {
      type: String,
      default: "Not Found"
    },
    description: {
      type: String,
      default: "Sorry, the page you are looking for could not be found."
    },
    backHome: {
      type: String,
      default: "Go back home"
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [],
      style: [
        {
          children: `*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}a{color:inherit;text-decoration:inherit}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p{margin:0}h1{font-size:inherit;font-weight:inherit}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-220cce0a><div class="fixed left-0 right-0 spotlight z-10" data-v-220cce0a></div><div class="max-w-520px text-center z-20" data-v-220cce0a><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-220cce0a>${serverRenderer.exports.ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-220cce0a>${serverRenderer.exports.ssrInterpolate(__props.description)}</p><div class="w-full flex items-center justify-center" data-v-220cce0a>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "gradient-border text-md sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer.exports.ssrInterpolate(__props.backHome)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(__props.backHome), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui-templates/dist/templates/error-404.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const Error404 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-220cce0a"]]);
const _sfc_main$q = {
  __name: "error-500",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    version: {
      type: String,
      default: ""
    },
    statusCode: {
      type: String,
      default: "500"
    },
    statusMessage: {
      type: String,
      default: "Server error"
    },
    description: {
      type: String,
      default: "This page is temporarily unavailable."
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [],
      style: [
        {
          children: `*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p{margin:0}h1{font-size:inherit;font-weight:inherit}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-2b1feed0><div class="fixed -bottom-1/2 left-0 right-0 h-1/2 spotlight" data-v-2b1feed0></div><div class="max-w-520px text-center" data-v-2b1feed0><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-2b1feed0>${serverRenderer.exports.ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-2b1feed0>${serverRenderer.exports.ssrInterpolate(__props.description)}</p></div></div>`);
    };
  }
};
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui-templates/dist/templates/error-500.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const Error500 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-2b1feed0"]]);
const _sfc_main$o = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    var _a;
    const props = __props;
    const error = props.error;
    (error.stack || "").split("\n").splice(1).map((line) => {
      const text2 = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text: text2,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n");
    const statusCode = String(error.statusCode || 500);
    const is404 = statusCode === "404";
    const statusMessage = (_a = error.statusMessage) != null ? _a : is404 ? "Page Not Found" : "Internal Server Error";
    const description = error.message || error.toString();
    const stack = void 0;
    const ErrorTemplate = is404 ? Error404 : Error500;
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(ErrorTemplate), vue_cjs_prod.mergeProps({ statusCode: vue_cjs_prod.unref(statusCode), statusMessage: vue_cjs_prod.unref(statusMessage), description: vue_cjs_prod.unref(description), stack: vue_cjs_prod.unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const nuxtApp = useNuxtApp();
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    vue_cjs_prod.onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, throwError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_App = vue_cjs_prod.resolveComponent("App");
      serverRenderer.exports.ssrRenderSuspense(_push, {
        default: () => {
          if (vue_cjs_prod.unref(error)) {
            _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(_sfc_main$o), { error: vue_cjs_prod.unref(error) }, null, _parent));
          } else {
            _push(serverRenderer.exports.ssrRenderComponent(_component_App, null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const layouts = {
  default: vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return _default;
  }))
};
const defaultLayoutTransition = { name: "layout", mode: "out-in" };
const __nuxt_component_0 = vue_cjs_prod.defineComponent({
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const route = useRoute();
    return () => {
      var _a, _b, _c;
      const layout = (_b = (_a = vue_cjs_prod.isRef(props.name) ? props.name.value : props.name) != null ? _a : route.meta.layout) != null ? _b : "default";
      const hasLayout = layout && layout in layouts;
      return _wrapIf(vue_cjs_prod.Transition, hasLayout && ((_c = route.meta.layoutTransition) != null ? _c : defaultLayoutTransition), _wrapIf(layouts[layout], hasLayout, context.slots)).default();
    };
  }
});
const _sfc_main$m = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_NuxtPage = vue_cjs_prod.resolveComponent("NuxtPage");
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(serverRenderer.exports.ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          vue_cjs_prod.createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/pages/runtime/app.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["ssrRender", _sfc_ssrRender]]);
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = vue_cjs_prod.createApp(_sfc_main$n);
    vueApp.component("App", AppComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      ssrContext.error = ssrContext.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);
const _sfc_main$l = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Admin = _sfc_main$D;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Admin, _attrs, null, _parent));
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const index$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$l
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$k = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Agent = _sfc_main$A;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Agent, _attrs, null, _parent));
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/agent/index.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$k
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$j = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Main = _sfc_main$w;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Main, _attrs, null, _parent));
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$j
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$i = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Tourist = _sfc_main$t;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Tourist, _attrs, null, _parent));
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tourist/index.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$i
}, Symbol.toStringTag, { value: "Module" }));
const Logo = "_Logo_1kt06_1";
const Logo__Udm = "_Logo__Udm_1kt06_12";
const Logo_DesctopOnly = "_Logo_DesctopOnly_1kt06_16";
const Logo_MobileOnly = "_Logo_MobileOnly_1kt06_21";
const $s$9 = {
  Logo,
  Logo__Udm,
  Logo_DesctopOnly,
  Logo_MobileOnly
};
const _sfc_main$h = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Logo",
  __ssrInlineRender: true,
  props: {
    useMobile: { type: Boolean, default: false }
  },
  setup(__props, { emit: $e }) {
    const $p = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<p${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref($s$9).Logo
      }, _attrs))}><span class="${serverRenderer.exports.ssrRenderClass({
        [vue_cjs_prod.unref($s$9).Logo__Udm]: true,
        [vue_cjs_prod.unref($s$9).Logo_DesctopOnly]: $p.useMobile
      })}"> Udm</span><span class="${serverRenderer.exports.ssrRenderClass({ [vue_cjs_prod.unref($s$9).Logo_DesctopOnly]: $p.useMobile })}"> -attraction</span>`);
      if ($p.useMobile) {
        _push(`<span class="${serverRenderer.exports.ssrRenderClass({
          [vue_cjs_prod.unref($s$9).Logo__Udm]: true,
          [vue_cjs_prod.unref($s$9).Logo_MobileOnly]: true
        })}"> Udm </span>`);
      } else {
        _push(`<!---->`);
      }
      if ($p.useMobile) {
        _push(`<span class="${serverRenderer.exports.ssrRenderClass({ [vue_cjs_prod.unref($s$9).Logo_MobileOnly]: true })}"> -attr</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p>`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Logo/Logo.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const Header = "_Header_10cgw_1";
const Header__Controls = "_Header__Controls_10cgw_6";
const Header__UserWrapper = "_Header__UserWrapper_10cgw_10";
const Header__User = "_Header__User_10cgw_10";
const Header__Login = "_Header__Login_10cgw_29";
const $s$8 = {
  Header,
  Header__Controls,
  Header__UserWrapper,
  Header__User,
  Header__Login
};
const _sfc_main$g = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const $modalsStore = useModalsStore();
    const $userStore = useUserStore();
    const $toursStore = useToursStore();
    const compUserName = vue_cjs_prod.computed(() => {
      const userInfo = $userStore.getUserInfo;
      switch (userInfo.existType) {
        case "admin":
          return `\u0410\u0434\u043C\u0438\u043D: ${userInfo.info.surname} ${userInfo.info.name[0]}. ${userInfo.info.patronymic && userInfo.info.patronymic[0] + "."}`;
        case "agent":
          return userInfo.info.corpName;
        case "tourist":
          return `${userInfo.info.surname} ${userInfo.info.name[0]}. ${userInfo.info.patronymic && userInfo.info.patronymic[0] + "."}`;
      }
    });
    const compIsAuthorized = vue_cjs_prod.computed(() => {
      return Boolean($userStore.getUserInfo.existType);
    });
    const handleLogout = () => {
      $userStore.$reset();
      $toursStore.loadAllTours();
      navigateTo(`/`);
    };
    const handleModalOpen = (modalName) => {
      $modalsStore.setCurrentModalName(modalName);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Logo = _sfc_main$h;
      const _component_Button = _sfc_main$V;
      _push(`<header${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref($s$8).Header,
        key: vue_cjs_prod.unref($userStore).getIsKeepAuth
      }, _attrs))}>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Logo, { useMobile: true }, null, _parent));
      _push(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$8).Header__Controls)}">`);
      if (vue_cjs_prod.unref(compIsAuthorized)) {
        _push(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$8).Header__UserWrapper)}"><p class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$8).Header__User)}">${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(compUserName))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (vue_cjs_prod.unref(compIsAuthorized)) {
        _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
          kind: "Transparent",
          corners: "Sm",
          onClick: handleLogout
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u0412\u044B\u0439\u0442\u0438 `);
            } else {
              return [
                vue_cjs_prod.createTextVNode(" \u0412\u044B\u0439\u0442\u0438 ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!vue_cjs_prod.unref(compIsAuthorized)) {
        _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
          kind: "Transparent",
          corners: "Sm",
          class: vue_cjs_prod.unref($s$8).Header__Login,
          onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).LoginModal)
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u0412\u0445\u043E\u0434 `);
            } else {
              return [
                vue_cjs_prod.createTextVNode(" \u0412\u0445\u043E\u0434 ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!vue_cjs_prod.unref(compIsAuthorized)) {
        _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
          kind: "Main",
          corners: "Sm",
          onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).SignupModal)
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F `);
            } else {
              return [
                vue_cjs_prod.createTextVNode(" \u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header>`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/Header/Header.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const Footer = "_Footer_m84mc_1";
const Footer__Logo = "_Footer__Logo_m84mc_6";
const Footer__TextSecondary = "_Footer__TextSecondary_m84mc_9";
const Footer__Promo = "_Footer__Promo_m84mc_12";
const Footer__Info = "_Footer__Info_m84mc_18";
const $s$7 = {
  Footer,
  Footer__Logo,
  Footer__TextSecondary,
  Footer__Promo,
  Footer__Info
};
const _sfc_main$f = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Logo = _sfc_main$h;
      _push(`<footer${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref($s$7).Footer
      }, _attrs))}>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Logo, {
        class: vue_cjs_prod.unref($s$7).Footer__Logo
      }, null, _parent));
      _push(`<p class="${serverRenderer.exports.ssrRenderClass([vue_cjs_prod.unref($s$7).Footer__TextSecondary, vue_cjs_prod.unref($s$7).Footer__Promo])}"> \u041D\u0430\u0441\u043B\u0430\u0436\u0434\u0430\u0439\u0442\u0435\u0441\u044C \u043F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F\u043C\u0438 \u0441 \u043D\u0430\u043C\u0438 </p><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$7).Footer__Info)}"><p>\u0420\u0443\u0441\u043B\u0430\u043D \u0425\u0430\u0437\u0438\u0435\u0432</p><p>\u0418\u0436\u0435\u0432\u0441\u043A</p><p>2022 \u0433.</p></div></footer>`);
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/Footer/Footer.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const ModalBase = "_ModalBase_n22c7_1";
const ModalBase__Header = "_ModalBase__Header_n22c7_14";
const ModalBase__ContentWrapper = "_ModalBase__ContentWrapper_n22c7_40";
const ModalBase__Title = "_ModalBase__Title_n22c7_55";
const ModalBase__Content = "_ModalBase__Content_n22c7_40";
const $s$6 = {
  ModalBase,
  ModalBase__Header,
  ModalBase__ContentWrapper,
  ModalBase__Title,
  ModalBase__Content
};
const _sfc_main$e = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "ModalBase",
  __ssrInlineRender: true,
  props: {
    title: { default: null }
  },
  emits: ["onBeforeClose"],
  setup(__props, { emit: $e }) {
    const $p = __props;
    const $modalsStore = useModalsStore();
    const handleModalClose = () => {
      $e("onBeforeClose");
      $modalsStore.setCurrentModalName(null);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Logo = _sfc_main$h;
      const _component_Button = _sfc_main$V;
      const _component_ScrollContainer = _sfc_main$N;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref($s$6).ModalBase
      }, _attrs))}><header class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$6).ModalBase__Header)}">`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Logo, { useMobile: true }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
        kind: "Secondary",
        corners: "Circle",
        onClick: handleModalClose
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` X `);
          } else {
            return [
              vue_cjs_prod.createTextVNode(" X ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_ScrollContainer, { unstyled: true }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$6).ModalBase__ContentWrapper)}"${_scopeId}>`);
            if ($p.title) {
              _push2(`<h2 class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$6).ModalBase__Title)}"${_scopeId}>${$p.title}</h2>`);
            } else {
              _push2(`<!---->`);
            }
            serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "beforeContent", {}, null, _push2, _parent2, _scopeId);
            _push2(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$6).ModalBase__Content)}"${_scopeId}>`);
            serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div></div>`);
          } else {
            return [
              vue_cjs_prod.createVNode("div", {
                class: vue_cjs_prod.unref($s$6).ModalBase__ContentWrapper
              }, [
                $p.title ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock("h2", {
                  key: 0,
                  class: vue_cjs_prod.unref($s$6).ModalBase__Title,
                  innerHTML: $p.title
                }, null, 10, ["innerHTML"])) : vue_cjs_prod.createCommentVNode("", true),
                vue_cjs_prod.renderSlot(_ctx.$slots, "beforeContent"),
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$6).ModalBase__Content
                }, [
                  vue_cjs_prod.renderSlot(_ctx.$slots, "default")
                ], 2)
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/ModalBase/ModalBase.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const TourSlider__Wrapper = "_TourSlider__Wrapper_3di9w_1";
const TourSlider__MainSlider = "_TourSlider__MainSlider_3di9w_5";
const TourSlider__MainSlide = "_TourSlider__MainSlide_3di9w_5";
const TourSlider__MainSlideImage = "_TourSlider__MainSlideImage_3di9w_12";
const TourSlider__ThumbSlide = "_TourSlider__ThumbSlide_3di9w_20";
const TourSlider__ThumbSlideImage = "_TourSlider__ThumbSlideImage_3di9w_26";
const $s$5 = {
  TourSlider__Wrapper,
  TourSlider__MainSlider,
  TourSlider__MainSlide,
  TourSlider__MainSlideImage,
  TourSlider__ThumbSlide,
  TourSlider__ThumbSlideImage
};
const _sfc_main$d = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "TourSlider",
  __ssrInlineRender: true,
  props: {
    images: { default: () => [] }
  },
  setup(__props, { emit: $e }) {
    const $p = __props;
    const swiperModules = [
      Navigation,
      Controller
    ];
    const mainController = vue_cjs_prod.ref({
      control: null
    });
    const thumbController = vue_cjs_prod.ref({
      control: null
    });
    const setMainController = (swiper) => {
      mainController.value.control = swiper;
    };
    const setThumbController = (swiper) => {
      thumbController.value.control = swiper;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref($s$5).TourSlider__Wrapper
      }, _attrs))}>`);
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(Swiper), {
        onSwiper: setMainController,
        modules: swiperModules,
        navigation: true,
        controller: thumbController.value,
        spaceBetween: 30,
        preloadImages: false,
        class: vue_cjs_prod.unref($s$5).TourSlider__MainSlider
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer.exports.ssrRenderList($p.images, (img, i) => {
              _push2(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(SwiperSlide), {
                key: img + i,
                class: vue_cjs_prod.unref($s$5).TourSlider__MainSlide
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<img class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$5).TourSlider__MainSlideImage)}"${serverRenderer.exports.ssrRenderAttr("src", img)} alt="tour slider slide"${_scopeId2}>`);
                  } else {
                    return [
                      vue_cjs_prod.createVNode("img", {
                        class: vue_cjs_prod.unref($s$5).TourSlider__MainSlideImage,
                        src: img,
                        alt: "tour slider slide"
                      }, null, 10, ["src"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList($p.images, (img, i) => {
                return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.unref(SwiperSlide), {
                  key: img + i,
                  class: vue_cjs_prod.unref($s$5).TourSlider__MainSlide
                }, {
                  default: vue_cjs_prod.withCtx(() => [
                    vue_cjs_prod.createVNode("img", {
                      class: vue_cjs_prod.unref($s$5).TourSlider__MainSlideImage,
                      src: img,
                      alt: "tour slider slide"
                    }, null, 10, ["src"])
                  ]),
                  _: 2
                }, 1032, ["class"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(Swiper), {
        onSwiper: setThumbController,
        modules: swiperModules,
        controller: mainController.value,
        slidesPerView: "auto",
        spaceBetween: 10,
        preloadImages: false,
        slideToClickedSlide: true
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer.exports.ssrRenderList($p.images, (img, i) => {
              _push2(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(SwiperSlide), {
                key: img + i,
                class: vue_cjs_prod.unref($s$5).TourSlider__ThumbSlide
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<img class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$5).TourSlider__ThumbSlideImage)}"${serverRenderer.exports.ssrRenderAttr("src", img)} alt="tour slider slide"${_scopeId2}>`);
                  } else {
                    return [
                      vue_cjs_prod.createVNode("img", {
                        class: vue_cjs_prod.unref($s$5).TourSlider__ThumbSlideImage,
                        src: img,
                        alt: "tour slider slide"
                      }, null, 10, ["src"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList($p.images, (img, i) => {
                return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.unref(SwiperSlide), {
                  key: img + i,
                  class: vue_cjs_prod.unref($s$5).TourSlider__ThumbSlide
                }, {
                  default: vue_cjs_prod.withCtx(() => [
                    vue_cjs_prod.createVNode("img", {
                      class: vue_cjs_prod.unref($s$5).TourSlider__ThumbSlideImage,
                      src: img,
                      alt: "tour slider slide"
                    }, null, 10, ["src"])
                  ]),
                  _: 2
                }, 1032, ["class"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/TourSlider/TourSlider.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const TourModal__Row = "_TourModal__Row_s8m2h_1";
const TourModal__Column = "_TourModal__Column_s8m2h_9";
const TourModal__Left = "_TourModal__Left_s8m2h_17";
const TourModal__Right = "_TourModal__Right_s8m2h_21";
const TourModal__Status = "_TourModal__Status_s8m2h_25";
const TourModal__AcionBtn = "_TourModal__AcionBtn_s8m2h_29";
const TourModal__AcionBtn_Small = "_TourModal__AcionBtn_Small_s8m2h_35";
const TourModal__InfoTitle = "_TourModal__InfoTitle_s8m2h_38";
const TourModal__Info = "_TourModal__Info_s8m2h_38";
const TourModal__InfoItem = "_TourModal__InfoItem_s8m2h_48";
const TourModal__Description = "_TourModal__Description_s8m2h_59";
const $s$4 = {
  TourModal__Row,
  TourModal__Column,
  TourModal__Left,
  TourModal__Right,
  TourModal__Status,
  TourModal__AcionBtn,
  TourModal__AcionBtn_Small,
  TourModal__InfoTitle,
  TourModal__Info,
  TourModal__InfoItem,
  TourModal__Description
};
const _sfc_main$c = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "TourModal",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const $modalsStore = useModalsStore();
    const $toursStore = useToursStore();
    const $userStore = useUserStore();
    const compTour = vue_cjs_prod.computed(() => $toursStore.getSelectedTour);
    const handleModalOpen = (modalName) => {
      $toursStore.setSelectedTourId(compTour.value._id);
      $modalsStore.setCurrentModalName(modalName);
    };
    const handleBookModalOpen = () => {
      if (!$userStore.getUserInfo.info) {
        $modalsStore.setCurrentModalName(EModalsNames.LoginModal);
      } else {
        $toursStore.setSelectedTourId(compTour.value._id);
        $modalsStore.setCurrentModalName(EModalsNames.BookingConfirmModal);
      }
    };
    const handleNewTourStatusChange = (isApproved) => {
      const dateStart = dfns.getTime(dfns.parseJSON(compTour.value.dateStart));
      const dateEnd = dfns.getTime(dfns.parseJSON(compTour.value.dateEnd));
      const dateNow = dfns.getTime(new Date());
      let status = "";
      if (isApproved) {
        if (dateNow <= dateStart)
          status = "ACTIVE";
        else if (dateNow >= dateStart && dateNow < dateEnd)
          status = "PENDING";
        else
          status = "CANCELED";
      } else {
        status = "BLOCKED";
      }
      $fetch("/api/tour", {
        method: "PUT",
        body: {
          id: compTour.value._id,
          status
        }
      }).then((res) => {
        $toursStore.updateTour(compTour.value._id, res);
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalBase = _sfc_main$e;
      const _component_TourSlider = _sfc_main$d;
      const _component_Tag = _sfc_main$M;
      const _component_Button = _sfc_main$V;
      const _component_ScrollContainer = _sfc_main$N;
      _push(serverRenderer.exports.ssrRenderComponent(_component_ModalBase, _attrs, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$4).TourModal__Row)}"${_scopeId}><div class="${serverRenderer.exports.ssrRenderClass([vue_cjs_prod.unref($s$4).TourModal__Column, vue_cjs_prod.unref($s$4).TourModal__Left])}"${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_TourSlider, {
              images: compTour.value.addPhotos
            }, null, _parent2, _scopeId));
            if (_ctx.$route.name !== "index") {
              _push2(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$4).TourModal__Status)}"${_scopeId}><span${_scopeId}>\u0421\u0442\u0430\u0442\u0443\u0441:\xA0\xA0\xA0</span>`);
              _push2(serverRenderer.exports.ssrRenderComponent(_component_Tag, {
                type: compTour.value.status
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(EStatus)[compTour.value.status])}`);
                  } else {
                    return [
                      vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(EStatus)[compTour.value.status]), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.$route.name === "index" && vue_cjs_prod.unref($userStore).getIsTourist) {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                kind: "Secondary",
                corners: "Md",
                class: vue_cjs_prod.unref($s$4).TourModal__AcionBtn,
                onClick: handleBookModalOpen
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` \u0417\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C `);
                  } else {
                    return [
                      vue_cjs_prod.createTextVNode(" \u0417\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.$route.name === "agent" && vue_cjs_prod.unref($toursStore).getTourStatus(compTour.value._id) !== "CANCELED") {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                kind: "Secondary",
                corners: "Md",
                class: vue_cjs_prod.unref($s$4).TourModal__AcionBtn,
                onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).AgentCancelModal)
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` \u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0442\u0443\u0440 `);
                  } else {
                    return [
                      vue_cjs_prod.createTextVNode(" \u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0442\u0443\u0440 ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.$route.name === "tourist" && (vue_cjs_prod.unref($toursStore).getTouristBookStatus(compTour.value._id) !== "CANCELED" && compTour.value.status === "ACTIVE")) {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                kind: "Secondary",
                corners: "Md",
                class: vue_cjs_prod.unref($s$4).TourModal__AcionBtn,
                onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).TouristCancelModal)
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` \u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0431\u0440\u043E\u043D\u044C `);
                  } else {
                    return [
                      vue_cjs_prod.createTextVNode(" \u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0431\u0440\u043E\u043D\u044C ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.$route.name === "admin" && compTour.value.status === "NEW") {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                kind: "Main",
                corners: "Md",
                class: [vue_cjs_prod.unref($s$4).TourModal__AcionBtn, vue_cjs_prod.unref($s$4).TourModal__AcionBtn_Small],
                onClick: ($event) => handleNewTourStatusChange(true)
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` \u041E\u0434\u043E\u0431\u0440\u0438\u0442\u044C `);
                  } else {
                    return [
                      vue_cjs_prod.createTextVNode(" \u041E\u0434\u043E\u0431\u0440\u0438\u0442\u044C ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.$route.name === "admin" && compTour.value.status === "NEW") {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                kind: "Secondary",
                corners: "Md",
                class: [vue_cjs_prod.unref($s$4).TourModal__AcionBtn, vue_cjs_prod.unref($s$4).TourModal__AcionBtn_Small],
                onClick: ($event) => handleNewTourStatusChange(false)
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` \u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C `);
                  } else {
                    return [
                      vue_cjs_prod.createTextVNode(" \u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.$route.name === "admin" && (compTour.value.status === "ACTIVE" || compTour.value.status === "PENDING")) {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                kind: "Main",
                corners: "Md",
                class: [vue_cjs_prod.unref($s$4).TourModal__AcionBtn, vue_cjs_prod.unref($s$4).TourModal__AcionBtn_Small],
                onClick: ($event) => handleNewTourStatusChange(false)
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` \u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C `);
                  } else {
                    return [
                      vue_cjs_prod.createTextVNode(" \u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.$route.name === "admin" && compTour.value.status === "BLOCKED") {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                kind: "Secondary",
                corners: "Md",
                class: [vue_cjs_prod.unref($s$4).TourModal__AcionBtn, vue_cjs_prod.unref($s$4).TourModal__AcionBtn_Small],
                onClick: ($event) => handleNewTourStatusChange(true)
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` \u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C `);
                  } else {
                    return [
                      vue_cjs_prod.createTextVNode(" \u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="${serverRenderer.exports.ssrRenderClass([vue_cjs_prod.unref($s$4).TourModal__Column, vue_cjs_prod.unref($s$4).TourModal__Right])}"${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_ScrollContainer, null, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h2 class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$4).TourModal__InfoTitle)}"${_scopeId2}>${serverRenderer.exports.ssrInterpolate(compTour.value.title)}</h2><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$4).TourModal__Info)}"${_scopeId2}><p class="${serverRenderer.exports.ssrRenderClass([vue_cjs_prod.unref($s$4).TourModal__InfoItem, vue_cjs_prod.unref($s$4).TourCard__InfoItem_Cut])}"${_scopeId2}>${serverRenderer.exports.ssrInterpolate(compTour.value.place)}</p><p class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$4).TourModal__InfoItem)}"${_scopeId2}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateStart))} - ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateEnd))}</p><p class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$4).TourModal__InfoItem)}"${_scopeId2}> 3500 \u20BD / <small class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$4).TourCard__InfoSmall)}"${_scopeId2}>\u043D\u0430 1 \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430</small></p></div><p class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$4).TourModal__Description)}"${_scopeId2}>${serverRenderer.exports.ssrInterpolate(compTour.value.desc)}</p>`);
                } else {
                  return [
                    vue_cjs_prod.createVNode("h2", {
                      class: vue_cjs_prod.unref($s$4).TourModal__InfoTitle
                    }, vue_cjs_prod.toDisplayString(compTour.value.title), 3),
                    vue_cjs_prod.createVNode("div", {
                      class: vue_cjs_prod.unref($s$4).TourModal__Info
                    }, [
                      vue_cjs_prod.createVNode("p", {
                        class: [vue_cjs_prod.unref($s$4).TourModal__InfoItem, vue_cjs_prod.unref($s$4).TourCard__InfoItem_Cut]
                      }, vue_cjs_prod.toDisplayString(compTour.value.place), 3),
                      vue_cjs_prod.createVNode("p", {
                        class: vue_cjs_prod.unref($s$4).TourModal__InfoItem
                      }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateStart)) + " - " + vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateEnd)), 3),
                      vue_cjs_prod.createVNode("p", {
                        class: vue_cjs_prod.unref($s$4).TourModal__InfoItem
                      }, [
                        vue_cjs_prod.createTextVNode(" 3500 \u20BD / "),
                        vue_cjs_prod.createVNode("small", {
                          class: vue_cjs_prod.unref($s$4).TourCard__InfoSmall
                        }, "\u043D\u0430 1 \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430", 2)
                      ], 2)
                    ], 2),
                    vue_cjs_prod.createVNode("p", {
                      class: vue_cjs_prod.unref($s$4).TourModal__Description
                    }, vue_cjs_prod.toDisplayString(compTour.value.desc), 3)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              vue_cjs_prod.createVNode("div", {
                class: vue_cjs_prod.unref($s$4).TourModal__Row
              }, [
                vue_cjs_prod.createVNode("div", {
                  class: [vue_cjs_prod.unref($s$4).TourModal__Column, vue_cjs_prod.unref($s$4).TourModal__Left]
                }, [
                  vue_cjs_prod.createVNode(_component_TourSlider, {
                    images: compTour.value.addPhotos
                  }, null, 8, ["images"]),
                  _ctx.$route.name !== "index" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock("div", {
                    key: 0,
                    class: vue_cjs_prod.unref($s$4).TourModal__Status
                  }, [
                    vue_cjs_prod.createVNode("span", null, "\u0421\u0442\u0430\u0442\u0443\u0441:\xA0\xA0\xA0"),
                    vue_cjs_prod.createVNode(_component_Tag, {
                      type: compTour.value.status
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(EStatus)[compTour.value.status]), 1)
                      ]),
                      _: 1
                    }, 8, ["type"])
                  ], 2)) : vue_cjs_prod.createCommentVNode("", true),
                  _ctx.$route.name === "index" && vue_cjs_prod.unref($userStore).getIsTourist ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Button, {
                    key: 1,
                    kind: "Secondary",
                    corners: "Md",
                    class: vue_cjs_prod.unref($s$4).TourModal__AcionBtn,
                    onClick: handleBookModalOpen
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u0417\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C ")
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue_cjs_prod.createCommentVNode("", true),
                  _ctx.$route.name === "agent" && vue_cjs_prod.unref($toursStore).getTourStatus(compTour.value._id) !== "CANCELED" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Button, {
                    key: 2,
                    kind: "Secondary",
                    corners: "Md",
                    class: vue_cjs_prod.unref($s$4).TourModal__AcionBtn,
                    onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).AgentCancelModal)
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0442\u0443\u0440 ")
                    ]),
                    _: 1
                  }, 8, ["class", "onClick"])) : vue_cjs_prod.createCommentVNode("", true),
                  _ctx.$route.name === "tourist" && (vue_cjs_prod.unref($toursStore).getTouristBookStatus(compTour.value._id) !== "CANCELED" && compTour.value.status === "ACTIVE") ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Button, {
                    key: 3,
                    kind: "Secondary",
                    corners: "Md",
                    class: vue_cjs_prod.unref($s$4).TourModal__AcionBtn,
                    onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).TouristCancelModal)
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0431\u0440\u043E\u043D\u044C ")
                    ]),
                    _: 1
                  }, 8, ["class", "onClick"])) : vue_cjs_prod.createCommentVNode("", true),
                  _ctx.$route.name === "admin" && compTour.value.status === "NEW" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Button, {
                    key: 4,
                    kind: "Main",
                    corners: "Md",
                    class: [vue_cjs_prod.unref($s$4).TourModal__AcionBtn, vue_cjs_prod.unref($s$4).TourModal__AcionBtn_Small],
                    onClick: ($event) => handleNewTourStatusChange(true)
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u041E\u0434\u043E\u0431\u0440\u0438\u0442\u044C ")
                    ]),
                    _: 1
                  }, 8, ["class", "onClick"])) : vue_cjs_prod.createCommentVNode("", true),
                  _ctx.$route.name === "admin" && compTour.value.status === "NEW" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Button, {
                    key: 5,
                    kind: "Secondary",
                    corners: "Md",
                    class: [vue_cjs_prod.unref($s$4).TourModal__AcionBtn, vue_cjs_prod.unref($s$4).TourModal__AcionBtn_Small],
                    onClick: ($event) => handleNewTourStatusChange(false)
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C ")
                    ]),
                    _: 1
                  }, 8, ["class", "onClick"])) : vue_cjs_prod.createCommentVNode("", true),
                  _ctx.$route.name === "admin" && (compTour.value.status === "ACTIVE" || compTour.value.status === "PENDING") ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Button, {
                    key: 6,
                    kind: "Main",
                    corners: "Md",
                    class: [vue_cjs_prod.unref($s$4).TourModal__AcionBtn, vue_cjs_prod.unref($s$4).TourModal__AcionBtn_Small],
                    onClick: ($event) => handleNewTourStatusChange(false)
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C ")
                    ]),
                    _: 1
                  }, 8, ["class", "onClick"])) : vue_cjs_prod.createCommentVNode("", true),
                  _ctx.$route.name === "admin" && compTour.value.status === "BLOCKED" ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Button, {
                    key: 7,
                    kind: "Secondary",
                    corners: "Md",
                    class: [vue_cjs_prod.unref($s$4).TourModal__AcionBtn, vue_cjs_prod.unref($s$4).TourModal__AcionBtn_Small],
                    onClick: ($event) => handleNewTourStatusChange(true)
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C ")
                    ]),
                    _: 1
                  }, 8, ["class", "onClick"])) : vue_cjs_prod.createCommentVNode("", true)
                ], 2),
                vue_cjs_prod.createVNode("div", {
                  class: [vue_cjs_prod.unref($s$4).TourModal__Column, vue_cjs_prod.unref($s$4).TourModal__Right]
                }, [
                  vue_cjs_prod.createVNode(_component_ScrollContainer, null, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createVNode("h2", {
                        class: vue_cjs_prod.unref($s$4).TourModal__InfoTitle
                      }, vue_cjs_prod.toDisplayString(compTour.value.title), 3),
                      vue_cjs_prod.createVNode("div", {
                        class: vue_cjs_prod.unref($s$4).TourModal__Info
                      }, [
                        vue_cjs_prod.createVNode("p", {
                          class: [vue_cjs_prod.unref($s$4).TourModal__InfoItem, vue_cjs_prod.unref($s$4).TourCard__InfoItem_Cut]
                        }, vue_cjs_prod.toDisplayString(compTour.value.place), 3),
                        vue_cjs_prod.createVNode("p", {
                          class: vue_cjs_prod.unref($s$4).TourModal__InfoItem
                        }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateStart)) + " - " + vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateEnd)), 3),
                        vue_cjs_prod.createVNode("p", {
                          class: vue_cjs_prod.unref($s$4).TourModal__InfoItem
                        }, [
                          vue_cjs_prod.createTextVNode(" 3500 \u20BD / "),
                          vue_cjs_prod.createVNode("small", {
                            class: vue_cjs_prod.unref($s$4).TourCard__InfoSmall
                          }, "\u043D\u0430 1 \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430", 2)
                        ], 2)
                      ], 2),
                      vue_cjs_prod.createVNode("p", {
                        class: vue_cjs_prod.unref($s$4).TourModal__Description
                      }, vue_cjs_prod.toDisplayString(compTour.value.desc), 3)
                    ]),
                    _: 1
                  })
                ], 2)
              ], 2)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Modals/ModalsModules/TourModal/TourModal.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const Modals__Row = "_Modals__Row_13x1h_1";
const Modals__InfoRow = "_Modals__InfoRow_13x1h_4";
const Modals__InfoList = "_Modals__InfoList_13x1h_17";
const Modals__InfoTerm = "_Modals__InfoTerm_13x1h_25";
const Modals__InfoDesc = "_Modals__InfoDesc_13x1h_29";
const Modals__Controls = "_Modals__Controls_13x1h_32";
const Modals__ConfirmBtn = "_Modals__ConfirmBtn_13x1h_43";
const Modals__DatepickerFirst = "_Modals__DatepickerFirst_13x1h_48";
const Modals__ShortControls = "_Modals__ShortControls_13x1h_51";
const Modals__AgreeCheckbox = "_Modals__AgreeCheckbox_13x1h_54";
const $s$3 = {
  Modals__Row,
  Modals__InfoRow,
  Modals__InfoList,
  Modals__InfoTerm,
  Modals__InfoDesc,
  Modals__Controls,
  Modals__ConfirmBtn,
  Modals__DatepickerFirst,
  Modals__ShortControls,
  Modals__AgreeCheckbox
};
const _sfc_main$b = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "BookingConfirmModal",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const formModel = vue_cjs_prod.ref({
      isAgree: false
    });
    const validationRules = {
      isAgree: {
        valid: and(required, (v) => {
          return v === true;
        })
      }
    };
    const $v = useVuelidate(validationRules, formModel.value);
    const $toursStore = useToursStore();
    const $userStore = useUserStore();
    const $modalsStore = useModalsStore();
    const compTour = vue_cjs_prod.computed(() => $toursStore.getSelectedTour);
    const handleBookConfirm = async () => {
      const isFormCorrect = await $v.value.$validate();
      if (!isFormCorrect)
        return;
      $fetch("/api/tour/tourist", {
        method: "PUT",
        body: {
          tourId: compTour.value._id,
          touristId: $userStore.getUserInfo.info._id,
          status: "ACTIVE",
          operation: "add"
        }
      }).then((res) => {
        $modalsStore.setCurrentModalName(null);
        $toursStore.removeLocalTour(compTour.value._id);
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalBase = _sfc_main$e;
      const _component_Checkbox = _sfc_main$P;
      const _component_Button = _sfc_main$V;
      _push(serverRenderer.exports.ssrRenderComponent(_component_ModalBase, vue_cjs_prod.mergeProps({ title: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u0431\u0440\u043E\u043D\u0438" }, _attrs), {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<dl class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoList)}"${_scopeId}><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(compTour.value.title)}</dd></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u041C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(compTour.value.place)}</dd></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u0421\u0440\u043E\u043A\u0438 \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateStart))} - ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateEnd))}</dd></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(compTour.value.price)} \u0440\u0443\u0431\u043B\u0435\u0439</dd></div></dl>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Checkbox, {
              checkboxModel: formModel.value.isAgree,
              "onUpdate:checkboxModel": ($event) => formModel.value.isAgree = $event,
              isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "isAgree")
            }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` \u041F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0430 \u043E\u043F\u043B\u0430\u0442\u044B \u0442\u0443\u0440\u0430 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043C\u0435\u0436\u0434\u0443 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C \u0438 \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u043E\u043C \u0431\u0435\u0437 \u0443\u0447\u0430\u0441\u0442\u0438\u044F Udm-attraction.<br${_scopeId2}> \u0414\u0430\u043D\u043D\u044B\u0435 \u0442\u0443\u0440\u0441\u0438\u0441\u0442\u0430 \u0431\u0443\u0434\u0443\u0442 \u043F\u0435\u0440\u0435\u0434\u0430\u043D\u044B \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u0443 \u0434\u043B\u044F \u0434\u0430\u043B\u044C\u043D\u0435\u0439\u0448\u0435\u0433\u043E \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F.<br${_scopeId2}> \u042F \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D/\u043D\u0430 \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0442\u0443\u0440\u0430. `);
                } else {
                  return [
                    vue_cjs_prod.createTextVNode(" \u041F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0430 \u043E\u043F\u043B\u0430\u0442\u044B \u0442\u0443\u0440\u0430 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043C\u0435\u0436\u0434\u0443 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C \u0438 \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u043E\u043C \u0431\u0435\u0437 \u0443\u0447\u0430\u0441\u0442\u0438\u044F Udm-attraction."),
                    vue_cjs_prod.createVNode("br"),
                    vue_cjs_prod.createTextVNode(" \u0414\u0430\u043D\u043D\u044B\u0435 \u0442\u0443\u0440\u0441\u0438\u0441\u0442\u0430 \u0431\u0443\u0434\u0443\u0442 \u043F\u0435\u0440\u0435\u0434\u0430\u043D\u044B \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u0443 \u0434\u043B\u044F \u0434\u0430\u043B\u044C\u043D\u0435\u0439\u0448\u0435\u0433\u043E \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F."),
                    vue_cjs_prod.createVNode("br"),
                    vue_cjs_prod.createTextVNode(" \u042F \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D/\u043D\u0430 \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0442\u0443\u0440\u0430. ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__Controls)}"${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
              kind: "Main",
              corners: "Md",
              class: vue_cjs_prod.unref($s$3).Modals__ConfirmBtn,
              onClick: handleBookConfirm
            }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C `);
                } else {
                  return [
                    vue_cjs_prod.createTextVNode(" \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vue_cjs_prod.createVNode("dl", {
                class: vue_cjs_prod.unref($s$3).Modals__InfoList
              }, [
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(compTour.value.title), 3)
                ], 2),
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u041C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(compTour.value.place), 3)
                ], 2),
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u0421\u0440\u043E\u043A\u0438 \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateStart)) + " - " + vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateEnd)), 3)
                ], 2),
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(compTour.value.price) + " \u0440\u0443\u0431\u043B\u0435\u0439", 3)
                ], 2)
              ], 2),
              vue_cjs_prod.createVNode(_component_Checkbox, {
                checkboxModel: formModel.value.isAgree,
                "onUpdate:checkboxModel": ($event) => formModel.value.isAgree = $event,
                isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "isAgree")
              }, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createTextVNode(" \u041F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0430 \u043E\u043F\u043B\u0430\u0442\u044B \u0442\u0443\u0440\u0430 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043C\u0435\u0436\u0434\u0443 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C \u0438 \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u043E\u043C \u0431\u0435\u0437 \u0443\u0447\u0430\u0441\u0442\u0438\u044F Udm-attraction."),
                  vue_cjs_prod.createVNode("br"),
                  vue_cjs_prod.createTextVNode(" \u0414\u0430\u043D\u043D\u044B\u0435 \u0442\u0443\u0440\u0441\u0438\u0441\u0442\u0430 \u0431\u0443\u0434\u0443\u0442 \u043F\u0435\u0440\u0435\u0434\u0430\u043D\u044B \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u0443 \u0434\u043B\u044F \u0434\u0430\u043B\u044C\u043D\u0435\u0439\u0448\u0435\u0433\u043E \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F."),
                  vue_cjs_prod.createVNode("br"),
                  vue_cjs_prod.createTextVNode(" \u042F \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D/\u043D\u0430 \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0442\u0443\u0440\u0430. ")
                ]),
                _: 1
              }, 8, ["checkboxModel", "onUpdate:checkboxModel", "isError"]),
              vue_cjs_prod.createVNode("div", {
                class: vue_cjs_prod.unref($s$3).Modals__Controls
              }, [
                vue_cjs_prod.createVNode(_component_Button, {
                  kind: "Main",
                  corners: "Md",
                  class: vue_cjs_prod.unref($s$3).Modals__ConfirmBtn,
                  onClick: handleBookConfirm
                }, {
                  default: vue_cjs_prod.withCtx(() => [
                    vue_cjs_prod.createTextVNode(" \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C ")
                  ]),
                  _: 1
                }, 8, ["class"])
              ], 2)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Modals/ModalsModules/BookingConfirmModal/BookingConfirmModal.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const LoginModal__FormContainer = "_LoginModal__FormContainer_972oa_1";
const LoginModal__FormFields = "_LoginModal__FormFields_972oa_4";
const LoginModal__PasswordInput = "_LoginModal__PasswordInput_972oa_12";
const LoginModal__Controls = "_LoginModal__Controls_972oa_15";
const LoginModal__ControlsSeparator = "_LoginModal__ControlsSeparator_972oa_20";
const $s$2 = {
  LoginModal__FormContainer,
  LoginModal__FormFields,
  LoginModal__PasswordInput,
  LoginModal__Controls,
  LoginModal__ControlsSeparator
};
const _sfc_main$a = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "LoginModal",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const { $findError } = useNuxtApp();
    const formModel = vue_cjs_prod.ref({
      email: "",
      password: "",
      isKeepAuth: false
    });
    const $modalsStore = useModalsStore();
    const $userStore = useUserStore();
    const validationRules = {
      email: {
        emailValid: and(required, email)
      },
      password: {
        minLength: and(required, minLength(8))
      }
    };
    const $v = useVuelidate(validationRules, formModel.value);
    const handleSubmit = async () => {
      const isFormCorrect = await $v.value.$validate();
      if (!isFormCorrect)
        return;
      $fetch("/api/user/check", {
        method: "GET",
        params: {
          email: formModel.value.email,
          password: formModel.value.password
        }
      }).then((res) => {
        $userStore.setIsKeepAuth(formModel.value.isKeepAuth);
        $userStore.setUserInfo(res);
        navigateTo(`/${res.existType}`);
        setTimeout(() => {
          handleModalOpen(null);
        }, 500);
      }).catch((e) => {
        console.error(e);
      });
    };
    const handleModalOpen = (modalName) => {
      $modalsStore.setCurrentModalName(modalName);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalBase = _sfc_main$e;
      const _component_FormContainer = _sfc_main$R;
      const _component_Input = _sfc_main$Q;
      const _component_Checkbox = _sfc_main$P;
      const _component_Button = _sfc_main$V;
      _push(serverRenderer.exports.ssrRenderComponent(_component_ModalBase, vue_cjs_prod.mergeProps({ title: "\u0412\u0445\u043E\u0434" }, _attrs), {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_FormContainer, {
              orientation: "Column",
              class: vue_cjs_prod.unref($s$2).LoginModal__FormContainer
            }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$2).LoginModal__FormFields)}"${_scopeId2}>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputModel: formModel.value.email,
                    "onUpdate:inputModel": ($event) => formModel.value.email = $event,
                    label: "Email",
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "email")
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputModel: formModel.value.password,
                    "onUpdate:inputModel": ($event) => formModel.value.password = $event,
                    type: "password",
                    label: "\u041F\u0430\u0440\u043E\u043B\u044C",
                    class: vue_cjs_prod.unref($s$2).LoginModal__PasswordInput,
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "password")
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Checkbox, {
                    checkboxModel: formModel.value.isKeepAuth,
                    "onUpdate:checkboxModel": ($event) => formModel.value.isKeepAuth = $event
                  }, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` \u041E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435 `);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode(" \u041E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$2).LoginModal__Controls)}"${_scopeId2}>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                    kind: "Main",
                    corners: "Md",
                    onClick: handleSubmit
                  }, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` \u0412\u043E\u0439\u0442\u0438 `);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode(" \u0412\u043E\u0439\u0442\u0438 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<p class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$2).LoginModal__ControlsSeparator)}"${_scopeId2}> \u0418\u041B\u0418 </p>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                    kind: "Secondary",
                    corners: "Md",
                    onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).SignupModal)
                  }, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F `);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vue_cjs_prod.createVNode("div", {
                      class: vue_cjs_prod.unref($s$2).LoginModal__FormFields
                    }, [
                      vue_cjs_prod.createVNode(_component_Input, {
                        inputModel: formModel.value.email,
                        "onUpdate:inputModel": ($event) => formModel.value.email = $event,
                        label: "Email",
                        isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "email")
                      }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                      vue_cjs_prod.createVNode(_component_Input, {
                        inputModel: formModel.value.password,
                        "onUpdate:inputModel": ($event) => formModel.value.password = $event,
                        type: "password",
                        label: "\u041F\u0430\u0440\u043E\u043B\u044C",
                        class: vue_cjs_prod.unref($s$2).LoginModal__PasswordInput,
                        isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "password")
                      }, null, 8, ["inputModel", "onUpdate:inputModel", "class", "isError"]),
                      vue_cjs_prod.createVNode(_component_Checkbox, {
                        checkboxModel: formModel.value.isKeepAuth,
                        "onUpdate:checkboxModel": ($event) => formModel.value.isKeepAuth = $event
                      }, {
                        default: vue_cjs_prod.withCtx(() => [
                          vue_cjs_prod.createTextVNode(" \u041E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435 ")
                        ]),
                        _: 1
                      }, 8, ["checkboxModel", "onUpdate:checkboxModel"])
                    ], 2),
                    vue_cjs_prod.createVNode("div", {
                      class: vue_cjs_prod.unref($s$2).LoginModal__Controls
                    }, [
                      vue_cjs_prod.createVNode(_component_Button, {
                        kind: "Main",
                        corners: "Md",
                        onClick: handleSubmit
                      }, {
                        default: vue_cjs_prod.withCtx(() => [
                          vue_cjs_prod.createTextVNode(" \u0412\u043E\u0439\u0442\u0438 ")
                        ]),
                        _: 1
                      }),
                      vue_cjs_prod.createVNode("p", {
                        class: vue_cjs_prod.unref($s$2).LoginModal__ControlsSeparator
                      }, " \u0418\u041B\u0418 ", 2),
                      vue_cjs_prod.createVNode(_component_Button, {
                        kind: "Secondary",
                        corners: "Md",
                        onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).SignupModal)
                      }, {
                        default: vue_cjs_prod.withCtx(() => [
                          vue_cjs_prod.createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ], 2)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_FormContainer, {
                orientation: "Column",
                class: vue_cjs_prod.unref($s$2).LoginModal__FormContainer
              }, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createVNode("div", {
                    class: vue_cjs_prod.unref($s$2).LoginModal__FormFields
                  }, [
                    vue_cjs_prod.createVNode(_component_Input, {
                      inputModel: formModel.value.email,
                      "onUpdate:inputModel": ($event) => formModel.value.email = $event,
                      label: "Email",
                      isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "email")
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                    vue_cjs_prod.createVNode(_component_Input, {
                      inputModel: formModel.value.password,
                      "onUpdate:inputModel": ($event) => formModel.value.password = $event,
                      type: "password",
                      label: "\u041F\u0430\u0440\u043E\u043B\u044C",
                      class: vue_cjs_prod.unref($s$2).LoginModal__PasswordInput,
                      isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "password")
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "class", "isError"]),
                    vue_cjs_prod.createVNode(_component_Checkbox, {
                      checkboxModel: formModel.value.isKeepAuth,
                      "onUpdate:checkboxModel": ($event) => formModel.value.isKeepAuth = $event
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(" \u041E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435 ")
                      ]),
                      _: 1
                    }, 8, ["checkboxModel", "onUpdate:checkboxModel"])
                  ], 2),
                  vue_cjs_prod.createVNode("div", {
                    class: vue_cjs_prod.unref($s$2).LoginModal__Controls
                  }, [
                    vue_cjs_prod.createVNode(_component_Button, {
                      kind: "Main",
                      corners: "Md",
                      onClick: handleSubmit
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(" \u0412\u043E\u0439\u0442\u0438 ")
                      ]),
                      _: 1
                    }),
                    vue_cjs_prod.createVNode("p", {
                      class: vue_cjs_prod.unref($s$2).LoginModal__ControlsSeparator
                    }, " \u0418\u041B\u0418 ", 2),
                    vue_cjs_prod.createVNode(_component_Button, {
                      kind: "Secondary",
                      corners: "Md",
                      onClick: ($event) => handleModalOpen(vue_cjs_prod.unref(EModalsNames).SignupModal)
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ], 2)
                ]),
                _: 1
              }, 8, ["class"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Modals/ModalsModules/LoginModal/LoginModal.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const SignupModal__FormContainer = "_SignupModal__FormContainer_1y8sc_1";
const SignupModal__FormFields = "_SignupModal__FormFields_1y8sc_4";
const $s$1 = {
  SignupModal__FormContainer,
  SignupModal__FormFields
};
const _sfc_main$9 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "TouristSignupForm",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const { $findError } = useNuxtApp();
    const formModel = vue_cjs_prod.ref({
      email: "",
      password: "",
      passwordRepeat: "",
      phone: "",
      name: "",
      surname: "",
      patronymic: ""
    });
    const validationRules = {
      email: {
        emailValid: and(required, email)
      },
      password: {
        minLength: and(required, minLength(8))
      },
      passwordRepeat: {
        sameAsMain: and(required, (value) => value === formModel.value.password)
      },
      phone: {
        phoneValid: and(required, minLength(11), maxLength(11))
      },
      name: { required },
      surname: { required }
    };
    const $modalsStore = useModalsStore();
    const $v = useVuelidate(validationRules, formModel.value);
    const handleSubmit = async () => {
      const isFormCorrect = await $v.value.$validate();
      if (!isFormCorrect)
        return;
      await useFetch("/api/tourist", { method: "POST", body: formModel.value });
      $modalsStore.setCurrentModalName(null);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormContainer = _sfc_main$R;
      const _component_Input = _sfc_main$Q;
      const _component_Button = _sfc_main$V;
      _push(serverRenderer.exports.ssrRenderComponent(_component_FormContainer, vue_cjs_prod.mergeProps({
        orientation: "Column",
        class: vue_cjs_prod.unref($s$1).SignupModal__FormContainer
      }, _attrs), {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$1).SignupModal__FormFields)}"${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.email,
              "onUpdate:inputModel": ($event) => formModel.value.email = $event,
              label: "Email *",
              isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "email")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.password,
              "onUpdate:inputModel": ($event) => formModel.value.password = $event,
              type: "password",
              label: "\u041F\u0430\u0440\u043E\u043B\u044C *",
              isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "password")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.passwordRepeat,
              "onUpdate:inputModel": ($event) => formModel.value.passwordRepeat = $event,
              type: "password",
              label: "\u041F\u043E\u0432\u0442\u043E\u0440 \u043F\u0430\u0440\u043E\u043B\u044F *",
              isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "passwordRepeat")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.phone,
              "onUpdate:inputModel": ($event) => formModel.value.phone = $event,
              label: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D*",
              isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "phone")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.name,
              "onUpdate:inputModel": ($event) => formModel.value.name = $event,
              label: "\u0418\u043C\u044F *",
              isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "name")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.surname,
              "onUpdate:inputModel": ($event) => formModel.value.surname = $event,
              label: "\u0424\u0430\u043C\u0438\u043B\u0438\u044F *",
              isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "surname")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.patronymic,
              "onUpdate:inputModel": ($event) => formModel.value.patronymic = $event,
              label: "\u041E\u0442\u0447\u0435\u0441\u0442\u0432\u043E (\u043F\u0440\u0438 \u043D\u0430\u043B\u0438\u0447\u0438\u0438)"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
              kind: "Main",
              corners: "Md",
              onClick: handleSubmit
            }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F `);
                } else {
                  return [
                    vue_cjs_prod.createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode("div", {
                class: vue_cjs_prod.unref($s$1).SignupModal__FormFields
              }, [
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.email,
                  "onUpdate:inputModel": ($event) => formModel.value.email = $event,
                  label: "Email *",
                  isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "email")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.password,
                  "onUpdate:inputModel": ($event) => formModel.value.password = $event,
                  type: "password",
                  label: "\u041F\u0430\u0440\u043E\u043B\u044C *",
                  isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "password")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.passwordRepeat,
                  "onUpdate:inputModel": ($event) => formModel.value.passwordRepeat = $event,
                  type: "password",
                  label: "\u041F\u043E\u0432\u0442\u043E\u0440 \u043F\u0430\u0440\u043E\u043B\u044F *",
                  isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "passwordRepeat")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.phone,
                  "onUpdate:inputModel": ($event) => formModel.value.phone = $event,
                  label: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D*",
                  isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "phone")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.name,
                  "onUpdate:inputModel": ($event) => formModel.value.name = $event,
                  label: "\u0418\u043C\u044F *",
                  isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "name")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.surname,
                  "onUpdate:inputModel": ($event) => formModel.value.surname = $event,
                  label: "\u0424\u0430\u043C\u0438\u043B\u0438\u044F *",
                  isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "surname")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.patronymic,
                  "onUpdate:inputModel": ($event) => formModel.value.patronymic = $event,
                  label: "\u041E\u0442\u0447\u0435\u0441\u0442\u0432\u043E (\u043F\u0440\u0438 \u043D\u0430\u043B\u0438\u0447\u0438\u0438)"
                }, null, 8, ["inputModel", "onUpdate:inputModel"])
              ], 2),
              vue_cjs_prod.createVNode(_component_Button, {
                kind: "Main",
                corners: "Md",
                onClick: handleSubmit
              }, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Modals/ModalsModules/SignupModal/TouristSignupForm.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "AgentSignupForm",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const formModel = vue_cjs_prod.ref({
      email: "",
      password: "",
      passwordRepeat: "",
      corpName: "",
      inn: "",
      director: "",
      phone: "",
      corpAddress: ""
    });
    const validationRules = {
      email: {
        emailValid: and(required, email)
      },
      password: {
        minLength: and(required, minLength(8))
      },
      passwordRepeat: {
        sameAsMain: and(required, (value) => value === formModel.value.password)
      },
      corpName: { required },
      inn: {
        innValid: and(required, (value) => value.length === 10 || value.length === 12)
      },
      director: { required },
      phone: {
        phoneValid: and(required, minLength(11), maxLength(11))
      },
      corpAddress: { required }
    };
    const $modalsStore = useModalsStore();
    const $v = useVuelidate(validationRules, formModel.value);
    const handleSubmit = async () => {
      const isFormCorrect = await $v.value.$validate();
      if (!isFormCorrect)
        return;
      await useFetch("/api/agent", { method: "POST", body: formModel.value });
      $modalsStore.setCurrentModalName(null);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormContainer = _sfc_main$R;
      const _component_Input = _sfc_main$Q;
      const _component_Button = _sfc_main$V;
      _push(serverRenderer.exports.ssrRenderComponent(_component_FormContainer, vue_cjs_prod.mergeProps({
        orientation: "Column",
        class: vue_cjs_prod.unref($s$1).SignupModal__FormContainer
      }, _attrs), {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$1).SignupModal__FormFields)}"${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.email,
              "onUpdate:inputModel": ($event) => formModel.value.email = $event,
              label: "Email *",
              isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "email")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.password,
              "onUpdate:inputModel": ($event) => formModel.value.password = $event,
              type: "password",
              label: "\u041F\u0430\u0440\u043E\u043B\u044C *",
              isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "password")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.passwordRepeat,
              "onUpdate:inputModel": ($event) => formModel.value.passwordRepeat = $event,
              type: "password",
              label: "\u041F\u043E\u0432\u0442\u043E\u0440 \u043F\u0430\u0440\u043E\u043B\u044F *",
              isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "passwordRepeat")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.corpName,
              "onUpdate:inputModel": ($event) => formModel.value.corpName = $event,
              label: "\u0424\u0418\u041E \u0438\u043B\u0438 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438 *",
              isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "corpName")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.inn,
              "onUpdate:inputModel": ($event) => formModel.value.inn = $event,
              label: "\u0418\u041D\u041D *",
              isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "inn")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.director,
              "onUpdate:inputModel": ($event) => formModel.value.director = $event,
              label: "\u0420\u0443\u043A\u043E\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C *",
              isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "director")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.phone,
              "onUpdate:inputModel": ($event) => formModel.value.phone = $event,
              label: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0439 \u0442\u0435\u043B\u0435\u0444\u043E\u043D *",
              isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "phone")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Input, {
              inputModel: formModel.value.corpAddress,
              "onUpdate:inputModel": ($event) => formModel.value.corpAddress = $event,
              label: "\u0410\u0434\u0440\u0435\u0441 *",
              isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "corpAddress")
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
              kind: "Main",
              corners: "Md",
              onClick: handleSubmit
            }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F `);
                } else {
                  return [
                    vue_cjs_prod.createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode("div", {
                class: vue_cjs_prod.unref($s$1).SignupModal__FormFields
              }, [
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.email,
                  "onUpdate:inputModel": ($event) => formModel.value.email = $event,
                  label: "Email *",
                  isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "email")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.password,
                  "onUpdate:inputModel": ($event) => formModel.value.password = $event,
                  type: "password",
                  label: "\u041F\u0430\u0440\u043E\u043B\u044C *",
                  isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "password")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.passwordRepeat,
                  "onUpdate:inputModel": ($event) => formModel.value.passwordRepeat = $event,
                  type: "password",
                  label: "\u041F\u043E\u0432\u0442\u043E\u0440 \u043F\u0430\u0440\u043E\u043B\u044F *",
                  isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "passwordRepeat")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.corpName,
                  "onUpdate:inputModel": ($event) => formModel.value.corpName = $event,
                  label: "\u0424\u0418\u041E \u0438\u043B\u0438 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438 *",
                  isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "corpName")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.inn,
                  "onUpdate:inputModel": ($event) => formModel.value.inn = $event,
                  label: "\u0418\u041D\u041D *",
                  isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "inn")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.director,
                  "onUpdate:inputModel": ($event) => formModel.value.director = $event,
                  label: "\u0420\u0443\u043A\u043E\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C *",
                  isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "director")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.phone,
                  "onUpdate:inputModel": ($event) => formModel.value.phone = $event,
                  label: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0439 \u0442\u0435\u043B\u0435\u0444\u043E\u043D *",
                  isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "phone")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                vue_cjs_prod.createVNode(_component_Input, {
                  inputModel: formModel.value.corpAddress,
                  "onUpdate:inputModel": ($event) => formModel.value.corpAddress = $event,
                  label: "\u0410\u0434\u0440\u0435\u0441 *",
                  isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "corpAddress")
                }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"])
              ], 2),
              vue_cjs_prod.createVNode(_component_Button, {
                kind: "Main",
                corners: "Md",
                onClick: handleSubmit
              }, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Modals/ModalsModules/SignupModal/AgentSignupForm.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __default__$1 = {
  components: {
    TouristSignupForm: _sfc_main$9,
    AgentSignupForm: _sfc_main$8
  }
};
const _sfc_main$7 = /* @__PURE__ */ vue_cjs_prod.defineComponent(__spreadProps(__spreadValues({}, __default__$1), {
  __name: "SignupModal",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    let selectedForm = vue_cjs_prod.ref("TouristSignupForm");
    const tabs = vue_cjs_prod.ref([
      {
        text: "\u0422\u0443\u0440\u0438\u0441\u0442",
        value: "TouristSignupForm",
        selected: true
      },
      {
        text: "\u0422\u0443\u0440\u0430\u0433\u0435\u043D\u0442",
        value: "AgentSignupForm"
      }
    ]);
    const handleTabChange = (selectedTabValue) => {
      selectedForm.value = selectedTabValue;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalBase = _sfc_main$e;
      const _component_Tabs = _sfc_main$U;
      _push(serverRenderer.exports.ssrRenderComponent(_component_ModalBase, vue_cjs_prod.mergeProps({ title: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F" }, _attrs), {
        beforeContent: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Tabs, {
              tabs: tabs.value,
              onOnTabChange: handleTabChange
            }, null, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_Tabs, {
                tabs: tabs.value,
                onOnTabChange: handleTabChange
              }, null, 8, ["tabs"])
            ];
          }
        }),
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(``);
            serverRenderer.exports.ssrRenderVNode(_push2, vue_cjs_prod.createVNode(vue_cjs_prod.resolveDynamicComponent(selectedForm.value), null, null), _parent2, _scopeId);
          } else {
            return [
              vue_cjs_prod.createVNode(vue_cjs_prod.Transition, {
                name: "fadeFaster",
                mode: "out-in"
              }, {
                default: vue_cjs_prod.withCtx(() => [
                  (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.resolveDynamicComponent(selectedForm.value)))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
}));
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Modals/ModalsModules/SignupModal/SignupModal.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "TouristCancelModal",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const { $findError } = useNuxtApp();
    const formModel = vue_cjs_prod.ref({
      isAgree: false
    });
    const validationRules = {
      isAgree: {
        valid: and(required, (v) => {
          return v === true;
        })
      }
    };
    const $v = useVuelidate(validationRules, formModel.value);
    const $toursStore = useToursStore();
    const $userStore = useUserStore();
    const $modalsStore = useModalsStore();
    const compTour = vue_cjs_prod.computed(() => $toursStore.getSelectedTour);
    const handleBookCancel = async () => {
      const isFormCorrect = await $v.value.$validate();
      if (!isFormCorrect)
        return;
      $fetch("/api/tour/tourist", {
        method: "PUT",
        body: {
          tourId: compTour.value._id,
          touristId: $userStore.getUserInfo.info._id,
          status: "CANCELED",
          operation: "change"
        }
      }).then((res) => {
        $modalsStore.setCurrentModalName(null);
        $toursStore.updateTour(compTour.value._id, res);
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalBase = _sfc_main$e;
      const _component_Checkbox = _sfc_main$P;
      const _component_Button = _sfc_main$V;
      _push(serverRenderer.exports.ssrRenderComponent(_component_ModalBase, vue_cjs_prod.mergeProps({ title: "\u041E\u0442\u043A\u0430\u0437 \u043E\u0442 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0442\u0443\u0440\u0430" }, _attrs), {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<dl class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoList)}"${_scopeId}><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(compTour.value.title)}</dd></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u041C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(compTour.value.place)}</dd></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u0421\u0440\u043E\u043A\u0438 \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateStart))} - ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateEnd))}</dd></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(compTour.value.price)} \u0440\u0443\u0431\u043B\u0435\u0439</dd></div></dl>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Checkbox, {
              checkboxModel: formModel.value.isAgree,
              "onUpdate:checkboxModel": ($event) => formModel.value.isAgree = $event,
              isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "isAgree")
            }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` \u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u043E\u043F\u043B\u0430\u0442\u044B \u0442\u0443\u0440\u0430 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C, \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0430 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0430 \u0434\u0435\u043D\u0435\u0436\u043D\u044B\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043C\u0435\u0436\u0434\u0443 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C \u0438 \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u043E\u043C \u0431\u0435\u0437 \u0443\u0447\u0430\u0441\u0442\u0438\u044F Udm-attraction.<br${_scopeId2}> \u042F \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D/\u043D\u0430 \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438 \u043E\u0442\u043A\u0430\u0437\u0430 \u043E\u0442 \u0442\u0443\u0440\u0430. `);
                } else {
                  return [
                    vue_cjs_prod.createTextVNode(" \u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u043E\u043F\u043B\u0430\u0442\u044B \u0442\u0443\u0440\u0430 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C, \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0430 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0430 \u0434\u0435\u043D\u0435\u0436\u043D\u044B\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043C\u0435\u0436\u0434\u0443 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C \u0438 \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u043E\u043C \u0431\u0435\u0437 \u0443\u0447\u0430\u0441\u0442\u0438\u044F Udm-attraction."),
                    vue_cjs_prod.createVNode("br"),
                    vue_cjs_prod.createTextVNode(" \u042F \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D/\u043D\u0430 \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438 \u043E\u0442\u043A\u0430\u0437\u0430 \u043E\u0442 \u0442\u0443\u0440\u0430. ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__Controls)}"${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
              kind: "Main",
              corners: "Md",
              class: vue_cjs_prod.unref($s$3).Modals__ConfirmBtn,
              onClick: handleBookCancel
            }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C `);
                } else {
                  return [
                    vue_cjs_prod.createTextVNode(" \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vue_cjs_prod.createVNode("dl", {
                class: vue_cjs_prod.unref($s$3).Modals__InfoList
              }, [
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(compTour.value.title), 3)
                ], 2),
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u041C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(compTour.value.place), 3)
                ], 2),
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u0421\u0440\u043E\u043A\u0438 \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateStart)) + " - " + vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateEnd)), 3)
                ], 2),
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(compTour.value.price) + " \u0440\u0443\u0431\u043B\u0435\u0439", 3)
                ], 2)
              ], 2),
              vue_cjs_prod.createVNode(_component_Checkbox, {
                checkboxModel: formModel.value.isAgree,
                "onUpdate:checkboxModel": ($event) => formModel.value.isAgree = $event,
                isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "isAgree")
              }, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createTextVNode(" \u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u043E\u043F\u043B\u0430\u0442\u044B \u0442\u0443\u0440\u0430 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C, \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0430 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0430 \u0434\u0435\u043D\u0435\u0436\u043D\u044B\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043C\u0435\u0436\u0434\u0443 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C \u0438 \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u043E\u043C \u0431\u0435\u0437 \u0443\u0447\u0430\u0441\u0442\u0438\u044F Udm-attraction."),
                  vue_cjs_prod.createVNode("br"),
                  vue_cjs_prod.createTextVNode(" \u042F \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D/\u043D\u0430 \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438 \u043E\u0442\u043A\u0430\u0437\u0430 \u043E\u0442 \u0442\u0443\u0440\u0430. ")
                ]),
                _: 1
              }, 8, ["checkboxModel", "onUpdate:checkboxModel", "isError"]),
              vue_cjs_prod.createVNode("div", {
                class: vue_cjs_prod.unref($s$3).Modals__Controls
              }, [
                vue_cjs_prod.createVNode(_component_Button, {
                  kind: "Main",
                  corners: "Md",
                  class: vue_cjs_prod.unref($s$3).Modals__ConfirmBtn,
                  onClick: handleBookCancel
                }, {
                  default: vue_cjs_prod.withCtx(() => [
                    vue_cjs_prod.createTextVNode(" \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C ")
                  ]),
                  _: 1
                }, 8, ["class"])
              ], 2)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Modals/ModalsModules/TouristCancelModal/TouristCancelModal.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "AgentCancelModal",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const formModel = vue_cjs_prod.ref({
      isAgree: false
    });
    const validationRules = {
      isAgree: {
        valid: and(required, (v) => {
          return v === true;
        })
      }
    };
    const $v = useVuelidate(validationRules, formModel.value);
    const $toursStore = useToursStore();
    useUserStore();
    const $modalsStore = useModalsStore();
    const compTour = vue_cjs_prod.computed(() => $toursStore.getSelectedTour);
    const handleTourCancel = async () => {
      const isFormCorrect = await $v.value.$validate();
      if (!isFormCorrect)
        return;
      $fetch("/api/tour", {
        method: "PUT",
        body: {
          id: compTour.value._id,
          status: "CANCELED"
        }
      }).then((res) => {
        $modalsStore.setCurrentModalName(null);
        $toursStore.updateTour(compTour.value._id, res);
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalBase = _sfc_main$e;
      const _component_Checkbox = _sfc_main$P;
      const _component_Button = _sfc_main$V;
      _push(serverRenderer.exports.ssrRenderComponent(_component_ModalBase, vue_cjs_prod.mergeProps({ title: "\u041E\u0442\u043C\u0435\u043D\u0430 \u0442\u0443\u0440\u0430" }, _attrs), {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<dl class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoList)}"${_scopeId}><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(compTour.value.title)}</dd></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u041C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(compTour.value.place)}</dd></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u0421\u0440\u043E\u043A\u0438 \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateStart))} - ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateEnd))}</dd></div><div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoRow)}"${_scopeId}><dt class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoTerm)}"${_scopeId}>\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C:</dt><dd class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__InfoDesc)}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(compTour.value.price)} \u0440\u0443\u0431\u043B\u0435\u0439</dd></div></dl>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Checkbox, {
              checkboxModel: formModel.value.isAgree,
              "onUpdate:checkboxModel": ($event) => formModel.value.isAgree = $event,
              isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "isAgree")
            }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` \u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u043E\u043F\u043B\u0430\u0442\u044B \u0442\u0443\u0440\u0430 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C, \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0430 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0430 \u0434\u0435\u043D\u0435\u0436\u043D\u044B\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043C\u0435\u0436\u0434\u0443 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C \u0438 \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u043E\u043C \u0431\u0435\u0437 \u0443\u0447\u0430\u0441\u0442\u0438\u044F Udm-attraction.<br${_scopeId2}> \u042F \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D/\u043D\u0430 \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438 \u043E\u0442\u043C\u0435\u043D\u044B \u0442\u0443\u0440\u0430. `);
                } else {
                  return [
                    vue_cjs_prod.createTextVNode(" \u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u043E\u043F\u043B\u0430\u0442\u044B \u0442\u0443\u0440\u0430 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C, \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0430 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0430 \u0434\u0435\u043D\u0435\u0436\u043D\u044B\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043C\u0435\u0436\u0434\u0443 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C \u0438 \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u043E\u043C \u0431\u0435\u0437 \u0443\u0447\u0430\u0441\u0442\u0438\u044F Udm-attraction."),
                    vue_cjs_prod.createVNode("br"),
                    vue_cjs_prod.createTextVNode(" \u042F \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D/\u043D\u0430 \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438 \u043E\u0442\u043C\u0435\u043D\u044B \u0442\u0443\u0440\u0430. ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__Controls)}"${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Button, {
              kind: "Main",
              corners: "Md",
              class: vue_cjs_prod.unref($s$3).Modals__ConfirmBtn,
              onClick: handleTourCancel
            }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C `);
                } else {
                  return [
                    vue_cjs_prod.createTextVNode(" \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vue_cjs_prod.createVNode("dl", {
                class: vue_cjs_prod.unref($s$3).Modals__InfoList
              }, [
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(compTour.value.title), 3)
                ], 2),
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u041C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(compTour.value.place), 3)
                ], 2),
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u0421\u0440\u043E\u043A\u0438 \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateStart)) + " - " + vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(formatJSONDate)(compTour.value.dateEnd)), 3)
                ], 2),
                vue_cjs_prod.createVNode("div", {
                  class: vue_cjs_prod.unref($s$3).Modals__InfoRow
                }, [
                  vue_cjs_prod.createVNode("dt", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoTerm
                  }, "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C:", 2),
                  vue_cjs_prod.createVNode("dd", {
                    class: vue_cjs_prod.unref($s$3).Modals__InfoDesc
                  }, vue_cjs_prod.toDisplayString(compTour.value.price) + " \u0440\u0443\u0431\u043B\u0435\u0439", 3)
                ], 2)
              ], 2),
              vue_cjs_prod.createVNode(_component_Checkbox, {
                checkboxModel: formModel.value.isAgree,
                "onUpdate:checkboxModel": ($event) => formModel.value.isAgree = $event,
                isError: _ctx.$findError(vue_cjs_prod.unref($v).$errors, "isAgree")
              }, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createTextVNode(" \u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u043E\u043F\u043B\u0430\u0442\u044B \u0442\u0443\u0440\u0430 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C, \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0430 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0430 \u0434\u0435\u043D\u0435\u0436\u043D\u044B\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043C\u0435\u0436\u0434\u0443 \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u043C \u0438 \u0442\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u043E\u043C \u0431\u0435\u0437 \u0443\u0447\u0430\u0441\u0442\u0438\u044F Udm-attraction."),
                  vue_cjs_prod.createVNode("br"),
                  vue_cjs_prod.createTextVNode(" \u042F \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D/\u043D\u0430 \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438 \u043E\u0442\u043C\u0435\u043D\u044B \u0442\u0443\u0440\u0430. ")
                ]),
                _: 1
              }, 8, ["checkboxModel", "onUpdate:checkboxModel", "isError"]),
              vue_cjs_prod.createVNode("div", {
                class: vue_cjs_prod.unref($s$3).Modals__Controls
              }, [
                vue_cjs_prod.createVNode(_component_Button, {
                  kind: "Main",
                  corners: "Md",
                  class: vue_cjs_prod.unref($s$3).Modals__ConfirmBtn,
                  onClick: handleTourCancel
                }, {
                  default: vue_cjs_prod.withCtx(() => [
                    vue_cjs_prod.createTextVNode(" \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C ")
                  ]),
                  _: 1
                }, 8, ["class"])
              ], 2)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Modals/ModalsModules/AgentCancelModal/AgentCancelModal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "TouristsListModal",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    let selectedTab = vue_cjs_prod.ref("");
    const tabs = vue_cjs_prod.ref([
      {
        text: "\u0412\u0441\u0435",
        value: "",
        selected: true
      },
      {
        text: "\u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u0431\u0440\u043E\u043D\u044C",
        value: "ACTIVE"
      },
      {
        text: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D\u0430\u044F \u0431\u0440\u043E\u043D\u044C",
        value: "CANCELED"
      }
    ]);
    const $toursStore = useToursStore();
    const compTour = vue_cjs_prod.computed(() => $toursStore.getSelectedTour);
    const compTourist = vue_cjs_prod.computed(() => {
      if (selectedTab.value === "")
        return $toursStore.getSelectedTour.tourists;
      return $toursStore.getSelectedTour.tourists.filter((tourist) => tourist.bookStatus === selectedTab.value);
    });
    const handleTabChange = (selectedTabValue) => {
      selectedTab.value = selectedTabValue;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalBase = _sfc_main$e;
      const _component_Tabs = _sfc_main$U;
      const _component_ListCardUser = _sfc_main$L;
      _push(serverRenderer.exports.ssrRenderComponent(_component_ModalBase, vue_cjs_prod.mergeProps({
        title: `\u0421\u043F\u0438\u0441\u043E\u043A \u0442\u0443\u0440\u0438\u0441\u0442\u043E\u0432 \u0442\u0443\u0440\u0430</br>'${compTour.value.title}'`
      }, _attrs), {
        beforeContent: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Tabs, {
              tabs: tabs.value,
              onOnTabChange: handleTabChange
            }, null, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_Tabs, {
                tabs: tabs.value,
                onOnTabChange: handleTabChange
              }, null, 8, ["tabs"])
            ];
          }
        }),
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer.exports.ssrRenderList(compTourist.value, (tourist) => {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_ListCardUser, {
                data: __spreadValues({ bookStatus: tourist.bookStatus }, tourist.touristId),
                key: tourist._id,
                type: "agent"
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(compTourist.value, (tourist) => {
                return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_ListCardUser, {
                  data: __spreadValues({ bookStatus: tourist.bookStatus }, tourist.touristId),
                  key: tourist._id,
                  type: "agent"
                }, null, 8, ["data"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Modals/ModalsModules/TouristsListModal/TouristsListModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "File",
  __ssrInlineRender: true,
  props: {
    allowedExt: { default: () => [] },
    label: { default: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C" },
    maxCount: { default: 1 },
    showImages: { type: Boolean, default: false },
    isError: { type: Boolean, default: false }
  },
  emits: ["update:inputModel"],
  setup(__props, { emit: $e }) {
    const $p = __props;
    const fileInputRef = vue_cjs_prod.ref(null);
    const preparedImages = vue_cjs_prod.ref([]);
    const compAllowedExt = vue_cjs_prod.computed(() => {
      if ($p.allowedExt.length)
        return $p.allowedExt.join(", ");
      else
        return "";
    });
    const handleLoadBtnClick = () => {
      fileInputRef.value.click();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$V;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        "data-component": "InputFile",
        class: {
          [vue_cjs_prod.unref($s$l).Input__FileWrapper]: true,
          [vue_cjs_prod.unref($s$l).Input_Error]: $p.isError
        }
      }, _attrs))}>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Button, {
        onClick: handleLoadBtnClick,
        class: vue_cjs_prod.unref($s$l).Input__LoadBtn
      }, {
        default: vue_cjs_prod.withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer.exports.ssrInterpolate(__props.label)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(__props.label), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<input type="file"${serverRenderer.exports.ssrRenderAttr("accept", vue_cjs_prod.unref(compAllowedExt))}${serverRenderer.exports.ssrIncludeBooleanAttr($p.maxCount > 1) ? " multiple" : ""} hidden>`);
      if (preparedImages.value.length) {
        _push(`<small><br>\u0424\u0430\u0439\u043B\u043E\u0432 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E: ${serverRenderer.exports.ssrInterpolate(preparedImages.value.length)}</small>`);
      } else {
        _push(`<!---->`);
      }
      if ($p.showImages && preparedImages.value.length) {
        _push(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$l).Input__ImagesContainer)}"><!--[-->`);
        serverRenderer.exports.ssrRenderList(preparedImages.value, (img, i) => {
          _push(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$l).Input__ImageWrapper)}"><img${serverRenderer.exports.ssrRenderAttr("src", img)} alt="loaded image" class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$l).Input__LoadedImage)}"><button class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$l).Input__DeleteImageBtn)}"> X </button><span class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$l).Input__ImageCounter)}">${serverRenderer.exports.ssrInterpolate(i + 1)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Input/File.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "CreateTourModal",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const { $findError } = useNuxtApp();
    const formModel = vue_cjs_prod.ref({
      mainPhoto: null,
      addPhotos: null,
      title: "",
      price: 0,
      place: "",
      dateStart: null,
      dateEnd: null,
      desc: "",
      agree: false
    });
    const validationRules = {
      mainPhoto: {
        valid: required
      },
      addPhotos: {
        valid: required
      },
      title: { required },
      price: {
        valid: and(required, maxLength(2e3))
      },
      place: { required },
      dateStart: {
        valid: required
      },
      dateEnd: {
        valid: required
      },
      desc: {
        valid: and(required, maxLength(2e3))
      },
      agree: {
        valid: and(required, (v) => {
          return v === true;
        })
      }
    };
    const $v = useVuelidate(validationRules, formModel.value);
    const $userStore = useUserStore();
    const $toursStore = useToursStore();
    const $modalsStore = useModalsStore();
    const handleSubmit = async () => {
      const isFormCorrect = await $v.value.$validate();
      if (!isFormCorrect)
        return;
      let fd = new FormData();
      Object.entries(formModel.value).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, i) => {
            fd.append(key, item);
          });
        }
        fd.append(key, value);
      });
      fd.append("agentId", $userStore.getUserInfo.info._id);
      $fetch("/api/tour", {
        method: "POST",
        body: fd
      }).then((newTour) => {
        $toursStore.setAccountTours([...$toursStore.getAccountTours, newTour]);
        $modalsStore.setCurrentModalName(null);
      }).catch((e) => {
        console.error(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalBase = _sfc_main$e;
      const _component_FormContainer = _sfc_main$R;
      const _component_InputFile = _sfc_main$3;
      const _component_Input = _sfc_main$Q;
      const _component_Datepicker = _sfc_main$I;
      const _component_Checkbox = _sfc_main$P;
      const _component_Button = _sfc_main$V;
      _push(serverRenderer.exports.ssrRenderComponent(_component_ModalBase, vue_cjs_prod.mergeProps({ title: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0442\u0443\u0440\u0430" }, _attrs), {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_FormContainer, { orientation: "Column" }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_InputFile, {
                    inputModel: formModel.value.mainPhoto,
                    "onUpdate:inputModel": ($event) => formModel.value.mainPhoto = $event,
                    allowedExt: [".jpg", ".jpeg", ".png"],
                    label: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u0444\u043E\u0442\u043E",
                    showImages: true,
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "mainPhoto")
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_InputFile, {
                    inputModel: formModel.value.addPhotos,
                    "onUpdate:inputModel": ($event) => formModel.value.addPhotos = $event,
                    allowedExt: [".jpg", ".jpeg", ".png"],
                    label: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0444\u043E\u0442\u043E (\u043C\u0430\u043A\u0441. 10)",
                    maxCount: 10,
                    showImages: true,
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "addPhotos")
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__ShortControls)}"${_scopeId2}>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputModel: formModel.value.title,
                    "onUpdate:inputModel": ($event) => formModel.value.title = $event,
                    label: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "title")
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputModel: formModel.value.price,
                    "onUpdate:inputModel": ($event) => formModel.value.price = $event,
                    label: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",
                    isNumber: true,
                    maxNumber: 1e5,
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "price")
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputModel: formModel.value.place,
                    "onUpdate:inputModel": ($event) => formModel.value.place = $event,
                    label: "\u041C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F",
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "place")
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__Row)}"${_scopeId2}>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Datepicker, {
                    datepickerModel: formModel.value.dateStart,
                    "onUpdate:datepickerModel": ($event) => formModel.value.dateStart = $event,
                    inputLabel: "\u0414\u0430\u0442\u0430 \u0441",
                    maxDate: formModel.value.dateEnd,
                    class: vue_cjs_prod.unref($s$3).Modals__DatepickerFirst,
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "dateStart")
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Datepicker, {
                    datepickerModel: formModel.value.dateEnd,
                    "onUpdate:datepickerModel": ($event) => formModel.value.dateEnd = $event,
                    inputLabel: "\u0414\u0430\u0442\u0430 \u043F\u043E",
                    minDate: formModel.value.dateStart,
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "dateEnd")
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Input, {
                    inputModel: formModel.value.desc,
                    "onUpdate:inputModel": ($event) => formModel.value.desc = $event,
                    label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
                    isTextarea: true,
                    maxLength: 2e3,
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "desc")
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Checkbox, {
                    checkboxModel: formModel.value.agree,
                    "onUpdate:checkboxModel": ($event) => formModel.value.agree = $event,
                    class: vue_cjs_prod.unref($s$3).Modals__AgreeCheckbox,
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "agree")
                  }, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` \u042F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u044E, \u0447\u0442\u043E \u043C\u043E\u0439 \u0442\u0443\u0440 \u043D\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438, \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0440\u0435\u0447\u0430\u0449\u0435\u0439 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C \u0441\u0430\u0439\u0442\u0430.<br${_scopeId3}> \u042F \u0431\u0435\u0440\u0443 \u043D\u0430 \u0441\u0435\u0431\u044F \u0432\u0441\u044E \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0437\u0430 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E, \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0432 \u044D\u0442\u043E\u0439 \u0437\u0430\u044F\u0432\u043A\u0435.<br${_scopeId3}> \u042F \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0442\u0435\u043C, \u0447\u0442\u043E \u0437\u0430\u044F\u0432\u043A\u0430 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u043F\u043E \u0440\u0435\u0448\u0435\u043D\u0438\u044E \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u0432 \u043E\u0434\u043D\u043E\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0435\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u0431\u0435\u0437 \u043F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F. `);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode(" \u042F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u044E, \u0447\u0442\u043E \u043C\u043E\u0439 \u0442\u0443\u0440 \u043D\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438, \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0440\u0435\u0447\u0430\u0449\u0435\u0439 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C \u0441\u0430\u0439\u0442\u0430."),
                          vue_cjs_prod.createVNode("br"),
                          vue_cjs_prod.createTextVNode(" \u042F \u0431\u0435\u0440\u0443 \u043D\u0430 \u0441\u0435\u0431\u044F \u0432\u0441\u044E \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0437\u0430 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E, \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0432 \u044D\u0442\u043E\u0439 \u0437\u0430\u044F\u0432\u043A\u0435."),
                          vue_cjs_prod.createVNode("br"),
                          vue_cjs_prod.createTextVNode(" \u042F \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0442\u0435\u043C, \u0447\u0442\u043E \u0437\u0430\u044F\u0432\u043A\u0430 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u043F\u043E \u0440\u0435\u0448\u0435\u043D\u0438\u044E \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u0432 \u043E\u0434\u043D\u043E\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0435\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u0431\u0435\u0437 \u043F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F. ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="${serverRenderer.exports.ssrRenderClass(vue_cjs_prod.unref($s$3).Modals__Controls)}"${_scopeId2}>`);
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Button, {
                    kind: "Main",
                    corners: "Md",
                    onClick: handleSubmit
                  }, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` \u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443 `);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode(" \u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vue_cjs_prod.createVNode(_component_InputFile, {
                      inputModel: formModel.value.mainPhoto,
                      "onUpdate:inputModel": ($event) => formModel.value.mainPhoto = $event,
                      allowedExt: [".jpg", ".jpeg", ".png"],
                      label: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u0444\u043E\u0442\u043E",
                      showImages: true,
                      isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "mainPhoto")
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "allowedExt", "isError"]),
                    vue_cjs_prod.createVNode(_component_InputFile, {
                      inputModel: formModel.value.addPhotos,
                      "onUpdate:inputModel": ($event) => formModel.value.addPhotos = $event,
                      allowedExt: [".jpg", ".jpeg", ".png"],
                      label: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0444\u043E\u0442\u043E (\u043C\u0430\u043A\u0441. 10)",
                      maxCount: 10,
                      showImages: true,
                      isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "addPhotos")
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "allowedExt", "isError"]),
                    vue_cjs_prod.createVNode("div", {
                      class: vue_cjs_prod.unref($s$3).Modals__ShortControls
                    }, [
                      vue_cjs_prod.createVNode(_component_Input, {
                        inputModel: formModel.value.title,
                        "onUpdate:inputModel": ($event) => formModel.value.title = $event,
                        label: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
                        isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "title")
                      }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                      vue_cjs_prod.createVNode(_component_Input, {
                        inputModel: formModel.value.price,
                        "onUpdate:inputModel": ($event) => formModel.value.price = $event,
                        label: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",
                        isNumber: true,
                        maxNumber: 1e5,
                        isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "price")
                      }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                      vue_cjs_prod.createVNode(_component_Input, {
                        inputModel: formModel.value.place,
                        "onUpdate:inputModel": ($event) => formModel.value.place = $event,
                        label: "\u041C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F",
                        isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "place")
                      }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                      vue_cjs_prod.createVNode("div", {
                        class: vue_cjs_prod.unref($s$3).Modals__Row
                      }, [
                        vue_cjs_prod.createVNode(_component_Datepicker, {
                          datepickerModel: formModel.value.dateStart,
                          "onUpdate:datepickerModel": ($event) => formModel.value.dateStart = $event,
                          inputLabel: "\u0414\u0430\u0442\u0430 \u0441",
                          maxDate: formModel.value.dateEnd,
                          class: vue_cjs_prod.unref($s$3).Modals__DatepickerFirst,
                          isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "dateStart")
                        }, null, 8, ["datepickerModel", "onUpdate:datepickerModel", "maxDate", "class", "isError"]),
                        vue_cjs_prod.createVNode(_component_Datepicker, {
                          datepickerModel: formModel.value.dateEnd,
                          "onUpdate:datepickerModel": ($event) => formModel.value.dateEnd = $event,
                          inputLabel: "\u0414\u0430\u0442\u0430 \u043F\u043E",
                          minDate: formModel.value.dateStart,
                          isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "dateEnd")
                        }, null, 8, ["datepickerModel", "onUpdate:datepickerModel", "minDate", "isError"])
                      ], 2),
                      vue_cjs_prod.createVNode(_component_Input, {
                        inputModel: formModel.value.desc,
                        "onUpdate:inputModel": ($event) => formModel.value.desc = $event,
                        label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
                        isTextarea: true,
                        maxLength: 2e3,
                        isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "desc")
                      }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"])
                    ], 2),
                    vue_cjs_prod.createVNode(_component_Checkbox, {
                      checkboxModel: formModel.value.agree,
                      "onUpdate:checkboxModel": ($event) => formModel.value.agree = $event,
                      class: vue_cjs_prod.unref($s$3).Modals__AgreeCheckbox,
                      isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "agree")
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(" \u042F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u044E, \u0447\u0442\u043E \u043C\u043E\u0439 \u0442\u0443\u0440 \u043D\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438, \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0440\u0435\u0447\u0430\u0449\u0435\u0439 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C \u0441\u0430\u0439\u0442\u0430."),
                        vue_cjs_prod.createVNode("br"),
                        vue_cjs_prod.createTextVNode(" \u042F \u0431\u0435\u0440\u0443 \u043D\u0430 \u0441\u0435\u0431\u044F \u0432\u0441\u044E \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0437\u0430 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E, \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0432 \u044D\u0442\u043E\u0439 \u0437\u0430\u044F\u0432\u043A\u0435."),
                        vue_cjs_prod.createVNode("br"),
                        vue_cjs_prod.createTextVNode(" \u042F \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0442\u0435\u043C, \u0447\u0442\u043E \u0437\u0430\u044F\u0432\u043A\u0430 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u043F\u043E \u0440\u0435\u0448\u0435\u043D\u0438\u044E \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u0432 \u043E\u0434\u043D\u043E\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0435\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u0431\u0435\u0437 \u043F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F. ")
                      ]),
                      _: 1
                    }, 8, ["checkboxModel", "onUpdate:checkboxModel", "class", "isError"]),
                    vue_cjs_prod.createVNode("div", {
                      class: vue_cjs_prod.unref($s$3).Modals__Controls
                    }, [
                      vue_cjs_prod.createVNode(_component_Button, {
                        kind: "Main",
                        corners: "Md",
                        onClick: handleSubmit
                      }, {
                        default: vue_cjs_prod.withCtx(() => [
                          vue_cjs_prod.createTextVNode(" \u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443 ")
                        ]),
                        _: 1
                      })
                    ], 2)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_FormContainer, { orientation: "Column" }, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createVNode(_component_InputFile, {
                    inputModel: formModel.value.mainPhoto,
                    "onUpdate:inputModel": ($event) => formModel.value.mainPhoto = $event,
                    allowedExt: [".jpg", ".jpeg", ".png"],
                    label: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u0444\u043E\u0442\u043E",
                    showImages: true,
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "mainPhoto")
                  }, null, 8, ["inputModel", "onUpdate:inputModel", "allowedExt", "isError"]),
                  vue_cjs_prod.createVNode(_component_InputFile, {
                    inputModel: formModel.value.addPhotos,
                    "onUpdate:inputModel": ($event) => formModel.value.addPhotos = $event,
                    allowedExt: [".jpg", ".jpeg", ".png"],
                    label: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0444\u043E\u0442\u043E (\u043C\u0430\u043A\u0441. 10)",
                    maxCount: 10,
                    showImages: true,
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "addPhotos")
                  }, null, 8, ["inputModel", "onUpdate:inputModel", "allowedExt", "isError"]),
                  vue_cjs_prod.createVNode("div", {
                    class: vue_cjs_prod.unref($s$3).Modals__ShortControls
                  }, [
                    vue_cjs_prod.createVNode(_component_Input, {
                      inputModel: formModel.value.title,
                      "onUpdate:inputModel": ($event) => formModel.value.title = $event,
                      label: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
                      isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "title")
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                    vue_cjs_prod.createVNode(_component_Input, {
                      inputModel: formModel.value.price,
                      "onUpdate:inputModel": ($event) => formModel.value.price = $event,
                      label: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",
                      isNumber: true,
                      maxNumber: 1e5,
                      isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "price")
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                    vue_cjs_prod.createVNode(_component_Input, {
                      inputModel: formModel.value.place,
                      "onUpdate:inputModel": ($event) => formModel.value.place = $event,
                      label: "\u041C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F",
                      isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "place")
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"]),
                    vue_cjs_prod.createVNode("div", {
                      class: vue_cjs_prod.unref($s$3).Modals__Row
                    }, [
                      vue_cjs_prod.createVNode(_component_Datepicker, {
                        datepickerModel: formModel.value.dateStart,
                        "onUpdate:datepickerModel": ($event) => formModel.value.dateStart = $event,
                        inputLabel: "\u0414\u0430\u0442\u0430 \u0441",
                        maxDate: formModel.value.dateEnd,
                        class: vue_cjs_prod.unref($s$3).Modals__DatepickerFirst,
                        isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "dateStart")
                      }, null, 8, ["datepickerModel", "onUpdate:datepickerModel", "maxDate", "class", "isError"]),
                      vue_cjs_prod.createVNode(_component_Datepicker, {
                        datepickerModel: formModel.value.dateEnd,
                        "onUpdate:datepickerModel": ($event) => formModel.value.dateEnd = $event,
                        inputLabel: "\u0414\u0430\u0442\u0430 \u043F\u043E",
                        minDate: formModel.value.dateStart,
                        isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "dateEnd")
                      }, null, 8, ["datepickerModel", "onUpdate:datepickerModel", "minDate", "isError"])
                    ], 2),
                    vue_cjs_prod.createVNode(_component_Input, {
                      inputModel: formModel.value.desc,
                      "onUpdate:inputModel": ($event) => formModel.value.desc = $event,
                      label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
                      isTextarea: true,
                      maxLength: 2e3,
                      isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "desc")
                    }, null, 8, ["inputModel", "onUpdate:inputModel", "isError"])
                  ], 2),
                  vue_cjs_prod.createVNode(_component_Checkbox, {
                    checkboxModel: formModel.value.agree,
                    "onUpdate:checkboxModel": ($event) => formModel.value.agree = $event,
                    class: vue_cjs_prod.unref($s$3).Modals__AgreeCheckbox,
                    isError: vue_cjs_prod.unref($findError)(vue_cjs_prod.unref($v).$errors, "agree")
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(" \u042F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u044E, \u0447\u0442\u043E \u043C\u043E\u0439 \u0442\u0443\u0440 \u043D\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438, \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0440\u0435\u0447\u0430\u0449\u0435\u0439 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C \u0441\u0430\u0439\u0442\u0430."),
                      vue_cjs_prod.createVNode("br"),
                      vue_cjs_prod.createTextVNode(" \u042F \u0431\u0435\u0440\u0443 \u043D\u0430 \u0441\u0435\u0431\u044F \u0432\u0441\u044E \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0437\u0430 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E, \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0432 \u044D\u0442\u043E\u0439 \u0437\u0430\u044F\u0432\u043A\u0435."),
                      vue_cjs_prod.createVNode("br"),
                      vue_cjs_prod.createTextVNode(" \u042F \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D/\u043D\u0430 \u0441 \u0442\u0435\u043C, \u0447\u0442\u043E \u0437\u0430\u044F\u0432\u043A\u0430 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u043F\u043E \u0440\u0435\u0448\u0435\u043D\u0438\u044E \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u0432 \u043E\u0434\u043D\u043E\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0435\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u0431\u0435\u0437 \u043F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F. ")
                    ]),
                    _: 1
                  }, 8, ["checkboxModel", "onUpdate:checkboxModel", "class", "isError"]),
                  vue_cjs_prod.createVNode("div", {
                    class: vue_cjs_prod.unref($s$3).Modals__Controls
                  }, [
                    vue_cjs_prod.createVNode(_component_Button, {
                      kind: "Main",
                      corners: "Md",
                      onClick: handleSubmit
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(" \u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443 ")
                      ]),
                      _: 1
                    })
                  ], 2)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Modals/ModalsModules/CreateTourModal/CreateTourModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __default__ = {
  components: {
    TourModal: _sfc_main$c,
    BookingConfirmModal: _sfc_main$b,
    LoginModal: _sfc_main$a,
    SignupModal: _sfc_main$7,
    TouristCancelModal: _sfc_main$6,
    AgentCancelModal: _sfc_main$5,
    TouristsListModal: _sfc_main$4,
    CreateTourModal: _sfc_main$2
  }
};
const _sfc_main$1 = /* @__PURE__ */ vue_cjs_prod.defineComponent(__spreadProps(__spreadValues({}, __default__), {
  __name: "Modals",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    const $modalsStore = useModalsStore();
    return (_ctx, _push, _parent, _attrs) => {
      serverRenderer.exports.ssrRenderVNode(_push, vue_cjs_prod.createVNode(vue_cjs_prod.resolveDynamicComponent(vue_cjs_prod.unref($modalsStore).getCurrentModalName), _attrs, null), _parent);
    };
  }
}));
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/Modals/Modals.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Layouts__MainDefault = "_Layouts__MainDefault_1pva1_1";
const $s = {
  Layouts__MainDefault
};
const _sfc_main = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props, { emit: $e }) {
    useUserStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = _sfc_main$g;
      const _component_Footer = _sfc_main$f;
      const _component_Modals = _sfc_main$1;
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: vue_cjs_prod.unref($s).Layouts__MainDefault
      }, _attrs))}>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Header, null, null, _parent));
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Footer, null, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_Modals, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main
}, Symbol.toStringTag, { value: "Module" }));

export { entry$1 as default };
//# sourceMappingURL=server.mjs.map
