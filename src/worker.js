const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" }
});
const corsHeaders = { "access-control-allow-methods": "GET,POST,DELETE,OPTIONS", "access-control-allow-headers": "content-type,x-huella-device" };
const response = (data, status=200) => { const r=json(data,status); const h=new Headers(r.headers); for (const [k,v] of Object.entries(corsHeaders)) h.set(k,v); return new Response(r.body,{status,headers:h}); };
const validDevice = (v) => typeof v === 'string' && /^[a-f0-9-]{36}$/i.test(v);
export default {
 async fetch(request, env) {
  const url=new URL(request.url);
  if (request.method==='OPTIONS' && url.pathname.startsWith('/api/')) return new Response(null,{status:204,headers:corsHeaders});
  if (url.pathname==='/api/health') return response({ok:true,app:'HUELLA',databaseConfigured:Boolean(env.DB),databaseReady:Boolean(env.DB)});
  if (url.pathname.startsWith('/api/')) {
   if (!env.DB) return response({error:'database_not_configured',message:'Crea la base D1 y aplica schema.sql siguiendo README.md.'},503);
   if (url.pathname==='/api/actions' && request.method==='GET') {
    const device=request.headers.get('x-huella-device'); if(!validDevice(device)) return response({error:'invalid_device'},400);
    const {results=[]}=await env.DB.prepare('SELECT id, body, action_at, created_at, updated_at FROM actions WHERE device_id=? ORDER BY action_at DESC LIMIT 200').bind(device).all();
    return response({actions:results});
   }
   if (url.pathname==='/api/actions' && request.method==='POST') {
    const device=request.headers.get('x-huella-device'); if(!validDevice(device)) return response({error:'invalid_device'},400);
    let body; try{body=await request.json()}catch{return response({error:'invalid_json'},400)}
    const text=typeof body.body==='string'?body.body.trim():''; const id=typeof body.id==='string'?body.id:''; const at=typeof body.action_at==='string'?body.action_at:new Date().toISOString();
    if(!/^[a-f0-9-]{36}$/i.test(id)||!text||text.length>250||!Number.isFinite(Date.parse(at))) return response({error:'invalid_action'},400);
    await env.DB.prepare('INSERT INTO actions (id, device_id, body, action_at, sync_status) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET body=excluded.body, action_at=excluded.action_at, updated_at=strftime(\'%Y-%m-%dT%H:%M:%fZ\',\'now\') WHERE actions.device_id=excluded.device_id').bind(id,device,text,new Date(at).toISOString(),'confirmed').run();
    return response({ok:true,action:{id,body:text,action_at:new Date(at).toISOString() }},201);
   }
   const del=url.pathname.match(/^\/api\/actions\/([a-f0-9-]{36})$/i);
   if(del && request.method==='DELETE') { const device=request.headers.get('x-huella-device'); if(!validDevice(device)) return response({error:'invalid_device'},400); await env.DB.prepare('DELETE FROM actions WHERE id=? AND device_id=?').bind(del[1],device).run(); return response({ok:true}); }
   if(url.pathname==='/api/community' && request.method==='GET') { const day=new Date().toISOString().slice(0,10); const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10); const today=await env.DB.prepare('SELECT COUNT(*) AS actions, COUNT(DISTINCT device_id) AS people FROM actions WHERE substr(created_at,1,10)=? AND sync_status=\'confirmed\'').bind(day).first(); const prev=await env.DB.prepare('SELECT COUNT(*) AS actions, COUNT(DISTINCT device_id) AS people FROM actions WHERE substr(created_at,1,10)=? AND sync_status=\'confirmed\'').bind(yesterday).first(); return response({today:today||{actions:0,people:0},yesterday:prev||{actions:0,people:0},note:'Conteo por acciones registradas; dispositivo no equivale a persona verificada.'}); }
   return response({error:'not_found'},404);
  }
  return env.ASSETS.fetch(request);
 }
};
