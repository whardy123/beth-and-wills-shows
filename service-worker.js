const CACHE="bw-shows-v24";
const CORE=["./manifest.webmanifest","./config.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 if(e.request.mode==="navigate"){e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{let copy=r.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy));return r}).catch(()=>caches.match("./index.html")));return}
 e.respondWith(fetch(e.request).then(r=>{let copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)))
});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(ws=>{for(const w of ws){if("focus" in w)return w.focus()}if(clients.openWindow)return clients.openWindow("./")}))});

self.addEventListener("push",e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?e.data.text():""}}e.waitUntil(self.registration.showNotification(d.title||"Beth and Will's Shows",{body:d.body||"There is an update to one of your shows.",icon:"icon-192-q.png",badge:"icon-192-q.png",tag:d.tag||"bw-background-update",data:d.data||{}}))});
