const CACHE="keluargaku-v9";
const ASSETS=["/","/index.html","/manifest.json","/icon-192.svg","/icon-512.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  const url=new URL(e.request.url);
  if(url.hostname.includes("script.google.com")||url.hostname.includes("googleusercontent.com")){
    e.respondWith(fetch(e.request).catch(()=>new Response(JSON.stringify({ok:false,error:"Offline"}),{headers:{"Content-Type":"application/json"}})));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>{
    if(cached)return cached;
    return fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));}return r;}).catch(()=>caches.match("/index.html"));
  }));
});
self.addEventListener("message",e=>{
  if(e.data&&e.data.type==="SHOW_NOTIFICATION"){
    self.registration.showNotification(e.data.title,{body:e.data.body,tag:e.data.tag||"kq",icon:"/icon-192.svg",vibrate:[200,100,200]});
  }
});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window"}).then(c=>{if(c.length>0)return c[0].focus();return self.clients.openWindow("/");}));});
