/* POST /api/form — receives the catering landing page's appointment requests and
 * questions (catering-appointment, catering-question; from the chat helper or the
 * form) and the two older ballots (menu-idea, coming-soon-vote).
 *
 * The site runs on Vercel, which does not have Netlify Forms, so this function
 * is the form backend. It delivers each submission to whichever of these is
 * configured (Vercel → Project → Settings → Environment Variables); set at least one:
 *
 *   RESEND_API_KEY + FORM_TO_EMAIL   email every submission with Resend (https://resend.com).
 *                                    If FORM_TO_EMAIL is not set, CONTACT_EMAIL is used.
 *   FORM_FROM_EMAIL                  optional sender for Resend; must be on a domain you
 *                                    verified there. Default: Sweet Snow <onboarding@resend.dev>
 *                                    (Resend's test sender — fine for low volume).
 *   FORM_WEBHOOK_URL                 optional. Also POST the submission as JSON to this URL
 *                                    (Zapier / Make / Google Apps Script → spreadsheet, etc.).
 *
 * Every submission is also written to the function log as one JSON line.
 * If nothing is configured the visitor sees a plain "not connected yet" page
 * instead of a false success, so a misconfiguration is visible immediately.
 *
 * On success the browser is redirected to /thanks, or to the form's own thank-you
 * page (or gets { ok: true } for fetch() callers that send Accept: application/json).
 * An email for a catering request has the guest's email as its reply-to address,
 * so answering it writes straight back to them.
 */

const MAX_FIELD = 2000;
const KNOWN_FORMS = {
  "menu-idea": { required: ["idea"], label: "New flavor idea" },
  "coming-soon-vote": { required: ["first"], label: "Coming-soon vote" },
  // `oneOf`: at least one field of each group is needed. `back`, `thanks` and `offline` send guests to the catering pages.
  "catering-appointment": {
    required: ["name", "date", "guests"], oneOf: [["phone", "email"]], label: "Catering appointment request",
    thanks: "/catering/thanks", back: { href: "/catering#book", text: "Back to catering" },
    offline: { title: "Your request was not sent", text: "The catering form is not connected yet, so your request did not reach us. Please message the same details to us on Instagram <a href=\"https://www.instagram.com/sweetsnow_oc/\" rel=\"noopener\">@sweetsnow_oc</a> and we will set up your appointment there." },
    calendar: true,
  },
  "catering-question": {
    required: ["question"], oneOf: [["phone", "email"]], label: "Catering question",
    thanks: "/catering/thanks", back: { href: "/catering#book", text: "Back to catering" },
    offline: { title: "Your question was not sent", text: "The catering chat is not connected yet. Please message us on Instagram <a href=\"https://www.instagram.com/sweetsnow_oc/\" rel=\"noopener\">@sweetsnow_oc</a>." },
  },
};
// How each field is named in the email, in this order. Anything else follows under its own name.
const FIELD_LABELS = {
  name: "Name", phone: "Phone", email: "Email", event: "Event", date: "Event date", guests: "Guests", tier: "Tier",
  taiyaki: "Taiyaki add-on", appointment_day: "Appointment day", appointment_time: "Appointment time",
  question: "Question", notes: "Notes", source: "Sent from", design: "Page design", ad: "Ad",
};
/* A link that opens Google Calendar with the appointment filled in, so the owner can keep it with one tap. */
function calendarLink(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.appointment_day || "")) return "";
  const day = new Date(data.appointment_day + "T00:00:00Z");
  if (Number.isNaN(day.getTime())) return "";
  const stamp = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
  const next = new Date(day.getTime() + 86400000);
  const details = Object.keys(FIELD_LABELS).filter((k) => data[k]).map((k) => `${FIELD_LABELS[k]}: ${data[k]}`).join("\n");
  const query = new URLSearchParams({ action: "TEMPLATE", text: `Catering appointment: ${data.name || "guest"}`, dates: `${stamp(day)}/${stamp(next)}`, details });
  return "https://calendar.google.com/calendar/render?" + query;
}
const DEFAULT_BACK = { href: "/community#vote", text: "Back to the idea box" };
const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const recipients = () => (process.env.FORM_TO_EMAIL || process.env.CONTACT_EMAIL || "").split(",").map((s) => s.trim()).filter(Boolean);

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body !== undefined) return resolve(req.body);
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 64 * 1024) req.destroy(); });
    req.on("end", () => resolve(raw));
    req.on("error", () => resolve(""));
  });
}

function toFields(body, contentType) {
  let entries;
  if (body && typeof body === "object") entries = Object.entries(body);
  else if (/json/.test(contentType)) {
    try { entries = Object.entries(JSON.parse(body || "{}")); } catch { entries = []; }
  } else entries = [...new URLSearchParams(String(body || ""))];
  const fields = {};
  for (const [k, v] of entries) {
    const key = String(k).slice(0, 64);
    const val = Array.isArray(v) ? v.join(", ") : String(v ?? "");
    fields[key] = fields[key] ? `${fields[key]}, ${val}` : val.slice(0, MAX_FIELD).trim();
  }
  return fields;
}

function wantsJson(req) {
  return /application\/json/.test(req.headers.accept || "") && !/text\/html/.test(req.headers.accept || "");
}

function page(res, status, title, text, back = DEFAULT_BACK) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} — Sweet Snow</title><link rel="icon" href="/assets/icon-32.png"><link rel="stylesheet" href="/designs/base.css"><link rel="stylesheet" href="/designs/showcase.css"></head><body class="theme-showcase"><main class="shell" style="padding-block:80px 60px;max-width:620px"><p class="eyebrow">Sweet Snow</p><h1 style="font-size:clamp(34px,5vw,52px);letter-spacing:-2px;line-height:1.05">${title}</h1><p style="font-size:16px;line-height:1.7;color:#656565">${text}</p><p style="margin-top:28px"><a class="button" href="${back.href}">${back.text}</a></p></main></body></html>`);
}

async function sendResend(subject, text, replyTo) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.FORM_FROM_EMAIL || "Sweet Snow <onboarding@resend.dev>",
      to: recipients(),
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

async function sendWebhook(payload) {
  const res = await fetch(process.env.FORM_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    return page(res, 405, "Nothing to see here", "This address only accepts form submissions from the Sweet Snow website.");
  }

  const fields = toFields(await readBody(req), req.headers["content-type"] || "");
  const formName = fields["form-name"] || "menu-idea";
  const spec = KNOWN_FORMS[formName];
  const json = wantsJson(req);

  // Honeypot: bots fill the hidden field. Pretend it worked and drop it.
  if (fields["bot-field"]) {
    if (json) { res.setHeader("Content-Type", "application/json"); return res.end('{"ok":true}'); }
    res.statusCode = 303; res.setHeader("Location", "/thanks"); return res.end();
  }
  if (!spec) return page(res, 400, "Unknown form", "That form is not one we know. Please go back and try again.");
  const missing = [
    ...spec.required.filter((k) => !fields[k]),
    ...(spec.oneOf || []).filter((group) => !group.some((k) => fields[k])).map((group) => group.join(" or ")),
  ];
  if (missing.length) {
    if (json) { res.statusCode = 400; res.setHeader("Content-Type", "application/json"); return res.end(JSON.stringify({ ok: false, missing })); }
    return page(res, 400, "Something's missing", `Please go back and fill in: ${escapeHtml(missing.join(", "))}.`, spec.back);
  }

  const submittedAt = new Date().toISOString();
  const data = Object.fromEntries(Object.entries(fields).filter(([k]) => k !== "form-name" && k !== "bot-field"));
  const payload = { form: formName, label: spec.label, submittedAt, fields: data, userAgent: req.headers["user-agent"] || "" };
  console.log(JSON.stringify({ type: "form-submission", ...payload }));

  const hasResend = Boolean(process.env.RESEND_API_KEY && recipients().length);
  const hasWebhook = Boolean(process.env.FORM_WEBHOOK_URL);
  if (!hasResend && !hasWebhook) {
    console.error("form: no delivery configured (set RESEND_API_KEY + FORM_TO_EMAIL and/or FORM_WEBHOOK_URL)");
    if (json) { res.statusCode = 503; res.setHeader("Content-Type", "application/json"); return res.end('{"ok":false,"error":"not-configured"}'); }
    if (spec.offline) return page(res, 503, spec.offline.title, spec.offline.text, spec.back);
    return page(res, 503, "Our idea box isn't connected yet", "Sorry — we couldn't save your message. Please send it to us on Instagram <a href=\"https://www.instagram.com/sweetsnow_oc/\" rel=\"noopener\">@sweetsnow_oc</a> or tell us in store.");
  }

  const known = Object.keys(FIELD_LABELS).filter((k) => data[k]).map((k) => `${FIELD_LABELS[k]}: ${data[k]}`);
  const other = Object.entries(data).filter(([k, v]) => !(k in FIELD_LABELS) && v).map(([k, v]) => `${k}: ${v}`);
  const calendar = spec.calendar ? calendarLink(data) : "";
  const text = [
    `${spec.label} from sweetsnow.org`,
    `When: ${submittedAt}`,
    "",
    ...known,
    ...other,
    ...(calendar ? ["", "Add this appointment to your Google Calendar:", calendar] : []),
  ].join("\n");
  const who = String(data.name || "").replace(/[\r\n]+/g, " ").slice(0, 60);

  // Only a plain, single email address is ever used as the reply-to.
  const replyTo = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(data.email || "") ? data.email : undefined;
  const sends = [
    ...(hasResend ? [sendResend(`[sweetsnow.org] ${spec.label}${who ? " from " + who : ""}`, text, replyTo)] : []),
    ...(hasWebhook ? [sendWebhook(payload)] : []),
  ];
  const results = await Promise.allSettled(sends);
  const failures = results.filter((r) => r.status === "rejected");
  failures.forEach((f) => console.error("form delivery:", f.reason?.message || f.reason));
  if (failures.length === results.length) {
    if (json) { res.statusCode = 502; res.setHeader("Content-Type", "application/json"); return res.end('{"ok":false,"error":"delivery-failed"}'); }
    return page(res, 502, "That didn't go through", "Sorry — something went wrong on our side. Please try again in a minute, or message us on Instagram <a href=\"https://www.instagram.com/sweetsnow_oc/\" rel=\"noopener\">@sweetsnow_oc</a>.", spec.back);
  }

  if (json) { res.setHeader("Content-Type", "application/json"); return res.end('{"ok":true}'); }
  res.statusCode = 303;
  res.setHeader("Location", spec.thanks || "/thanks");
  res.end();
};
