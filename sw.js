const CACHE='merces-connect-v0.9.9.1';
const APP=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?.text()||'Você recebeu uma nova mensagem.'}};e.waitUntil(self.registration.showNotification(d.title||'Mercês Connect',{body:d.body||'Você recebeu uma nova mensagem.',icon:d.icon||'./icon-192.png',badge:d.badge||'./icon-192.png',data:{url:d.url||'./#chat'},tag:d.tag||'merces-message',renotify:true}));});
self.addEventListener('notificationclick',e=>{e.notification.close();const target=new URL(e.notification.data?.url||'./#chat',self.location.origin).href;e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{for(const w of ws){if('focus'in w){w.navigate(target);return w.focus();}}return clients.openWindow?clients.openWindow(target):null;}));});
