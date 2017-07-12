var getContext = require('express-httpcontext').getContext;
var middleware = require('express-httpcontext').middleware;
var cookie = require('cookie');
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function _rawCookie() {
  if (canUseDOM) {
    return cookie.parse(document.cookie);
  }

  const req = getContext().req;
  if (req.cookie) {
    return req.cookie;
  }
  if (req.cookies) {
    return req.cookies;
  }
  if (req.headers && req.headers.cookie) {
    return cookie.parse(req.headers.cookie);
  }
  return {};
}

function _res() {
  if (canUseDOM) return null;
  return getContext().res;
}

function load(name, doNotParse) {
  var cookies = (typeof document === 'undefined') ? _rawCookie() : cookie.parse(document.cookie);
  var cookieVal = cookies && cookies[name];

  if (!doNotParse) {
    try {
      cookieVal = JSON.parse(cookieVal);
    } catch (e) {
      // console.error(e);
    }
  }
  return cookieVal;
}

function save(name, val, opt) {
  var myRawCookie = _rawCookie();
  // console.log('save', myRawCookie);
  var myRes = _res();

  myRawCookie[name] = val;
  // allow you to work with cookies as objects.
  if (typeof val === 'object') {
    myRawCookie[name] = JSON.stringify(val);
  }

  // Cookies only work in the browser
  if (typeof document !== 'undefined') {
    document.cookie = cookie.serialize(name, myRawCookie[name], opt);
  }

  if (myRes && myRes.cookie) {
    myRes.cookie(name, val, opt);
  }
}

function remove(name, opt) {
  var myRes = _res();
  // console.log('remove', myRes);

  delete _rawCookie()[name];

  if (typeof opt === 'undefined') {
    opt = {};
  } else if (typeof opt === 'string') {
    // Will be deprecated in future versions
    opt = { path: opt };
  }

  if (typeof document !== 'undefined') {
    opt.expires = new Date(1970, 1, 1, 0, 0, 1);
    document.cookie = cookie.serialize(name, '', opt);
  }

  if (myRes && myRes.clearCookie) {
    myRes.clearCookie(name, opt);
  }
}

const isomorphicCookie = {
  load,
  save,
  remove,
};

if (typeof window !== 'undefined') {
  window.isomorphicCookie = isomorphicCookie;
}

module.exports.cookie = isomorphicCookie;
module.exports.middleware = middleware;