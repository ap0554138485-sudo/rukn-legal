// Server-only administration alerts. Never import this file into browser code.
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { AsyncLocalStorage } = require('node:async_hooks');
const allowedActions = new Set([
  'auth.login', 'account.login', 'client_login', 'login',
  'registration.submitted', 'registration.requester', 'account.registered',
  'scanner.import', 'amlak.login', 'amlak.register', 'amlak.invite_registered',
  'amlak.scanner_import'
]);
const isAllowedAction = action => allowedActions.has(action);

const labels = {
  'amlak.login': 'تسجيل دخول',
  'amlak.register': 'تسجيل حساب جديد',
  'amlak.invite_registered': 'تسجيل حساب جديد',
  'amlak.scanner_import': 'إتمام مزامنة إيجار',
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
  if (event.action.startsWith('amlak.')) platform = 'سند لإدارة الأملاك';
  return `الإدارة | ${platform}\nالعميل: ${clean(event.customer) || 'زائر غير مسجل'}\nمعرف الحساب: ${clean(event.customerId, 80) || 'غير متاح'}\nالحركة: ${eventLabel(event.action)}\nالوقت: ${new Date(event.at).toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh', calendar: 'gregory', hour12: false })}\nمرجع الحدث: ${event.id}`;
}
function requestAction(method, pathname) {
  if (method !== 'POST') return null;
  if (pathname === '/api/login' || pathname === '/api/auth/login') return 'account.login';
  if (pathname === '/api/register' || pathname === '/api/auth/register') return 'account.registered';
  return null;
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
    if (!configured || !isAllowedAction(action)) return false;
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
        if (!isAllowedAction(event.action)) {
          fs.unlinkSync(file);
          continue;
        }
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
      if(res.statusCode < 200 || res.statusCode >= 300)return;
      let action;try{action=requestAction(req.method, new URL(req.originalUrl || req.url, 'http://localhost').pathname);}catch{return;}
      if (!action) return;
      // Anonymous API noise is not treated as a known customer's activity.
      if (customer?.id) record(action, customer);
    });
    return context.run(scope, next);
  }
  function handlePublicEvent(_req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.writeHead(204);
    res.end();
  }
  if (configured && autoStart) { timer = setInterval(tick, 1500); timer.unref(); }
  return { record, observe, tick, configured, handlePublicEvent, stop: () => clearInterval(timer) };
}
module.exports = { createNotifications, formatEvent, requestAction, eventLabel, isAllowedAction };
