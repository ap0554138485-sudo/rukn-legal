const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {EventEmitter}=require('node:events');
const { createNotifications, formatEvent, requestAction } = require('./admin-notifications.cjs');
test('persistent retry survives restart; payload excludes secrets and arbitrary fields', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'admin-alert-test-'));
  let time = Date.now(), calls = [];
  const env = { ADMIN_EVENTS_DIR: dir, ADMIN_TELEGRAM_ENABLED: 'true', ADMIN_TELEGRAM_BOT_TOKEN: 'test', ADMIN_TELEGRAM_CHAT_ID: '123' };
  try {
    const first = createNotifications('سند', { env, clock: () => time, autoStart: false, transport: async () => { throw Error('offline'); } });
    assert.equal(first.record('scanner.import', { id: 'u1', name: 'محمد', password: 'SECRET', body: 'PRIVATE' }), true);
    await first.tick();
    assert.equal(fs.readdirSync(dir).length, 1);
    const saved = fs.readFileSync(path.join(dir, fs.readdirSync(dir)[0]), 'utf8');
    assert.doesNotMatch(saved, /SECRET|PRIVATE/);
    time += 20000;
    const second = createNotifications('سند', { env, clock: () => time, autoStart: false, transport: async (_url, options) => { calls.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ ok: true }) }; } });
    await second.tick(); await second.tick();
    assert.equal(calls.length, 1); assert.equal(fs.readdirSync(dir).length, 0);
    assert.match(calls[0].text, /سند/); assert.match(calls[0].text, /محمد/); assert.match(calls[0].text, /مزامنة ناجز/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('disabled alerts do not create storage or send; request classifier never returns URL tokens', () => {
  const alerts = createNotifications('معيار', { env: {}, autoStart: false });
  assert.equal(alerts.record('auth.login', { id: '1' }), false);
  assert.equal(requestAction('GET', '/api/me'), null);
  assert.equal(requestAction('POST', '/api/ops/browser-result'), null);
  assert.equal(requestAction('POST', '/api/ads'), 'ad.created');
  assert.equal(requestAction('POST', '/api/password/reset/SECRET'), 'account.password');
  assert.doesNotMatch(formatEvent('ركن', { id: '1', at: Date.now(), action: 'whatsapp.click' }), /أرسل رسالة/);
});
test('request observation reports only successful actions or server problems and avoids audit duplicates',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'admin-observer-test-'));
  try{
    const env={ADMIN_EVENTS_DIR:dir,ADMIN_TELEGRAM_ENABLED:'true',ADMIN_TELEGRAM_BOT_TOKEN:'test',ADMIN_TELEGRAM_CHAT_ID:'123'};
    const alerts=createNotifications('فائض',{env,autoStart:false});
    for(const status of [200,401,500]){
      const res=new EventEmitter();res.statusCode=status;
      await alerts.observe({method:'POST',url:'/api/ads'},res,()=>({id:'u1',name:'عميل'}),async()=>{});
      res.emit('finish');
    }
    assert.equal(fs.readdirSync(dir).length,2);
    const res=new EventEmitter();res.statusCode=200;
    await alerts.observe({method:'POST',url:'/api/scanner/import'},res,()=>({id:'u1'}),async()=>{alerts.record('scanner.import',{id:'u1'});});
    res.emit('finish');assert.equal(fs.readdirSync(dir).length,3);
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('public collector rejects cross-origin and unsupported events',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'admin-public-test-'));
  try{
    const alerts=createNotifications('ركن',{env:{ADMIN_EVENTS_DIR:dir,ADMIN_TELEGRAM_ENABLED:'true',ADMIN_TELEGRAM_BOT_TOKEN:'test',ADMIN_TELEGRAM_CHAT_ID:'123'},autoStart:false});
    const res=()=>({setHeader(){},writeHead(status){this.status=status;},end(){}});
    let response=res();await alerts.handlePublicEvent({headers:{host:'example.com',origin:'https://evil.example'},body:{kind:'page.view'}},response);assert.equal(response.status,403);
    response=res();await alerts.handlePublicEvent({headers:{host:'example.com',origin:'https://example.com'},body:{kind:'password',password:'SECRET'}},response);assert.equal(response.status,400);
    response=res();await alerts.handlePublicEvent({headers:{host:'example.com',origin:'https://example.com'},body:{kind:'whatsapp.click',password:'SECRET'}},response);assert.equal(response.status,204);
    const files=fs.readdirSync(dir);assert.equal(files.length,1);assert.doesNotMatch(fs.readFileSync(path.join(dir,files[0]),'utf8'),/SECRET/);
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
