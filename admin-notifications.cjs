// Server-only administration alerts. Never import this file into browser code.
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { AsyncLocalStorage } = require('node:async_hooks');

const labels = {
  'auth.login': 'تسجيل دخول', 'registration.submitted': 'تسجيل حساب جديد',
  'registration.requester': 'تسجيل حساب جديد', 'scanner.import': 'إتمام مزامنة ناجز',
  'password_reset.requested': 'طلب إعادة تعيين كلمة المرور',
  'password_reset.emailed': 'طلب إعادة تعيين كلمة المرور',
  'password_reset.completed': 'إعادة تعيين كلمة المرور',
  'task.created': 'نشر مهمة جديدة', 'case_market.created': 'نشر إعلان فرصة قضية',
  'client_login': 'دخول بوابة العميل', 'login': 'دخول بوابة العميل',
  'message_sent': 'إرسال رسالة في بوابة العميل', 'support.message': 'رسالة دعم جديدة',
  'client.problem': 'مشكلة تحتاج متابعة', 'order.created': 'إنشاء طلب جديد',
  'inquiry.created': 'إرسال استفسار جديد', 'feedback.created': 'إرسال تقييم',
  'whatsapp.click': 'الضغط على التواصل عبر واتساب (لا يؤكد إرسال رسالة)',
  'phone.click': 'الضغط على الاتصال', 'page.view': 'فتح صفحة',
  'ad.created': 'نشر إعلان جديد', 'ad.updated': 'تعديل إعلان',
  'ad.deleted': 'حذف إعلان', 'ad.contact': 'طلب التواصل بشأن إعلان',
  'account.registered': 'تسجيل حساب جديد', 'account.password': 'تغيير كلمة المرور',
  'account.recovery': 'طلب استعادة كلمة المرور', 'account.login': 'تسجيل دخول',
  'account.logout': 'تسجيل خروج',
  'site.activity':'إجراء على موقع العميل','integration.activity':'إجراء على ربط الخدمات',
  'team.activity':'إجراء على الفريق','task.activity':'إجراء على مهمة',
  'scanner.activity':'إجراء متعلق بمزامنة ناجز','platform.activity':'إجراء جديد داخل المنصة'
};
const clean = (value, max = 100) => String(value || '').replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, ' ').slice(0, max);
function eventLabel(action) {
  if (labels[action]) return labels[action];
  if (/^[\u0600-\u06ff ]{2,100}$/.test(action)) return action;
  const group = { scanner: 'مزامنة ناجز', account: 'الحساب', password_reset: 'استعادة كلمة المرور', task: 'المهام', case_market: 'فرص القضايا', profile: 'الملف الشخصي', message: 'الرسائل', office: 'المكتب', contract: 'العقود', court: 'القضايا', sandi: 'مساعد سند', registration: 'التسجيل', support: 'الدعم', client: 'بوابة العميل' }[String(action).split(/[._]/)[0]];
  return group ? `نشاط في ${group}` : 'نشاط جديد في المنصة';
}
function formatEvent(platform, event) {
  return `الإدارة | ${platform}\nالعميل: ${clean(event.customer) || 'زائر غير مسجل'}\nمعرف الحساب: ${clean(event.customerId, 80) || 'غير متاح'}\nالحركة: ${eventLabel(event.action)}\nالوقت: ${new Date(event.at).toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh', hour12: false })}\nمرجع الحدث: ${event.id}`;
}
function requestAction(method, pathname) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) || !pathname.startsWith('/api/')) return null;
  if (/\/(ops|admin|activity|customer-events|events\/collect|uploads|img)(\/|$)/.test(pathname)) return null;
  if (/recover/.test(pathname)) return 'account.recovery';
  if (/password|reset/.test(pathname)) return 'account.password';
  if (/logout/.test(pathname)) return 'account.logout';
  if (/login/.test(pathname)) return 'account.login';
  if (/register|signup/.test(pathname)) return 'account.registered';
  if (/scanner|najiz|sync/.test(pathname)) return 'scanner.activity';
  if (/support|ticket/.test(pathname)) return 'support.message';
  if (/contact/.test(pathname)) return 'ad.contact';
  if (/problems|errors/.test(pathname)) return 'client.problem';
  if (/\/sites(?:\/|$)/.test(pathname)) return 'site.activity';
  if (/\/google(?:\/|$)/.test(pathname)) return 'integration.activity';
  if (/\/team(?:\/|$)/.test(pathname)) return 'team.activity';
  if (/\/ads(?:\/|$)/.test(pathname)) return method === 'DELETE' ? 'ad.deleted' : method === 'POST' && pathname === '/api/ads' ? 'ad.created' : 'ad.updated';
  if (/\/tasks(?:\/|$)/.test(pathname)) return 'task.activity';
  return 'platform.activity';
}
function createNotifications(platform, { env = process.env, transport = fetch, clock = Date.now, autoStart = true } = {}) {
  const context = new AsyncLocalStorage();
  const dir = env.ADMIN_EVENTS_DIR;
  const enabled = env.ADMIN_TELEGRAM_ENABLED === 'true';
  let configured = enabled && Boolean(dir && env.ADMIN_TELEGRAM_BOT_TOKEN && /^-?\d+$/.test(env.ADMIN_TELEGRAM_CHAT_ID || ''));
  let busy = false, timer;
  if (configured) {try{fs.mkdirSync(dir, { recursive: true, mode: 0o700 });}catch{configured=false;console.error('Administration queue directory is unavailable.');}}
  if (enabled && !configured) console.error('Administration alerts need bot, chat and persistent queue settings.');
  function record(action, actor = {}) {
    if (!configured) return false;
    try {
      // Only these fields are allowed; bodies, URLs, passwords and metadata are never serialized.
      const event = { id: randomUUID(), at: clock(), action: clean(action), customer: clean(actor.full_name || actor.name || actor.fullName), customerId: clean(actor.id, 80), attempts: 0, nextAttempt: 0 };
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
      if (files.length >= 50000) throw Error('queue_full');
      const target = path.join(dir, `${event.at}-${event.id}.json`);
      const temporary = target + '.tmp';
      fs.writeFileSync(temporary, JSON.stringify(event), { mode: 0o600 });
      fs.renameSync(temporary, target);
      const scope = context.getStore(); if (scope) scope.recorded = true;
      return true;
    } catch { console.error('Administration event could not be queued.'); return false; }
  }
  async function tick() {
    if (!configured || busy) return;
    busy = true;
    try {
      for (const name of fs.readdirSync(dir).filter(f => /^\d+-[a-f0-9-]+\.json$/.test(f)).sort()) {
        const file = path.join(dir, name);
        const event = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (event.nextAttempt > clock()) continue;
        let ok = false, retryAfter = 0;
        try {
          const response = await transport(`https://api.telegram.org/bot${env.ADMIN_TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000),
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: env.ADMIN_TELEGRAM_CHAT_ID, text: formatEvent(platform, event), protect_content: true, link_preview_options: { is_disabled: true } })
          });
          const result = await response.json();
          ok = response.ok && result.ok === true;
          retryAfter = Math.min(86400, Math.max(0, Number(result.parameters?.retry_after) || 0)) * 1000;
        } catch { /* Keep event for retry without logging the token or personal details. */ }
        if (ok) fs.unlinkSync(file);
        else {
          event.attempts++;
          event.nextAttempt = clock() + Math.max(retryAfter, Math.min(3600000, 5000 * 2 ** Math.min(event.attempts, 10)));
          fs.writeFileSync(file + '.tmp', JSON.stringify(event), { mode: 0o600 });
          fs.renameSync(file + '.tmp', file);
          console.error('Administration delivery failed; retry scheduled.');
        }
        break; // At most one message per tick per application.
      }
    } catch { console.error('Administration queue needs attention.'); }
    finally { busy = false; }
  }
  function observe(req, res, actor, next) {
    const scope = { recorded: false };
    res.once('finish', () => {
      if (scope.recorded) return;
      let customer; try { customer=actor(); } catch { return; }
      if(res.statusCode>=500){record('client.problem',customer||{});return;}
      if(res.statusCode < 200 || res.statusCode >= 300)return;
      let action;try{action=requestAction(req.method, new URL(req.originalUrl || req.url, 'http://localhost').pathname);}catch{return;}
      if (!action) return;
      // Anonymous API noise is not treated as a known customer's activity.
      if (customer?.id) record(action, customer);
    });
    return context.run(scope, next);
  }
  const publicLimits=new Map();
  async function handlePublicEvent(req,res,actor={}) {
    res.setHeader('Cache-Control','no-store');
    const finish=(status)=>{res.writeHead(status);res.end();};
    if (!configured) {finish(204);return;}
    try {
      const origin=new URL(req.headers.origin||'');
      const expected=env.PUBLIC_ORIGIN?new URL(env.PUBLIC_ORIGIN).host:req.headers.host;
      if (origin.host!==expected || !['http:','https:'].includes(origin.protocol)) {finish(403);return;}
      const ip=(env.NODE_ENV==='production'&&req.headers['x-forwarded-for']?.split(',').at(-1)?.trim())||req.socket?.remoteAddress||'unknown';
      for(const [key,value] of publicLimits)if(value.until<clock())publicLimits.delete(key);
      const entry=publicLimits.get(ip)||{count:0,until:clock()+300000};
      publicLimits.set(ip,entry);if(++entry.count>30){finish(429);return;}
      let body=req.body;
      if (!body) {
        let raw='',size=0;
        for await(const chunk of req){size+=chunk.length;if(size>256){finish(413);return;}raw+=chunk.toString('utf8');}
        body=JSON.parse(raw);
      }
      if(!['page.view','whatsapp.click','phone.click'].includes(body?.kind)){finish(400);return;}
      record(body.kind,actor);finish(204);
    }catch{if(!res.headersSent)finish(400);}
  }
  if (configured && autoStart) { timer = setInterval(tick, 1500); timer.unref(); }
  return { record, observe, tick, configured, handlePublicEvent, stop: () => clearInterval(timer) };
}
module.exports = { createNotifications, formatEvent, requestAction, eventLabel };
