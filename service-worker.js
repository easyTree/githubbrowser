"use strict";var precacheConfig=[["/githubbrowser/index.html","3bca29856f20993bf9c9ca2e357f0b9e"],["/githubbrowser/static/css/main.240f646e.css","36b8fc57edbaa1f9be5014ae30fd2227"],["/githubbrowser/static/js/main.bb630acb.js","6a7ad189dbe7d3d25bb661714d655180"],["/githubbrowser/static/media/forks.d7e8c705.svg","d7e8c70520fbc932e7933a1704e5fe10"],["/githubbrowser/static/media/github.94955cc8.svg","94955cc81cf98ed01ac833635af7fc5a"],["/githubbrowser/static/media/issues.6a2bab53.svg","6a2bab53fdfd4ee7d941eedea437c523"],["/githubbrowser/static/media/pullRequests.a9fbb2d9.svg","a9fbb2d949d3e3665c9baf6bc2efa623"],["/githubbrowser/static/media/readme.3c4f4486.svg","3c4f44861417dc57c322299540824d5f"],["/githubbrowser/static/media/repo.a0570a68.svg","a0570a68df3cd4ae64a4dd358538d818"],["/githubbrowser/static/media/search.23b809b3.svg","23b809b36edbc9f9443a4429ca39dc33"],["/githubbrowser/static/media/stars.7655aa0c.svg","7655aa0c0de977d6e9a3ab5fea1a7942"],["/githubbrowser/static/media/watchers.6b5ad3f0.svg","6b5ad3f0e626066dea3465258905e9e7"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var r=new URL(e);return"/"===r.pathname.slice(-1)&&(r.pathname+=t),r.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,r,a){var n=new URL(e);return a&&n.pathname.match(a)||(n.search+=(n.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(r)),n.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var r=new URL(t).pathname;return e.some(function(e){return r.match(e)})},stripIgnoredUrlParameters=function(e,r){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return r.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],r=e[1],a=new URL(t,self.location),n=createCacheKey(a,hashParamName,r,/\.\w{8}\./);return[a.toString(),n]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(a){return setOfCachedUrls(a).then(function(r){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!r.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return a.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var r=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!r.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,r=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),a="index.html";(e=urlsToCacheKeys.has(r))||(r=addDirectoryIndex(r,a),e=urlsToCacheKeys.has(r));var n="/githubbrowser/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(r=new URL(n,self.location).toString(),e=urlsToCacheKeys.has(r)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(r)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});