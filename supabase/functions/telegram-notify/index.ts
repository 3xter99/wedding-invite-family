/// <reference path="../types/deno-shim.d.ts" />

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

type WebhookPayload = {
  type?: string;
  table?: string;
  record?: {
    full_name?: string;
    attendance?: string;
    drinks?: string[];
    source_site?: string;
    submitted_at?: string;
  };
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const payload = (await req.json()) as WebhookPayload;
    const record = payload.record;

    if (!record?.full_name) {
      return new Response(JSON.stringify({ error: 'No record in payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
      return new Response(JSON.stringify({ error: 'Telegram not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const drinks = Array.isArray(record.drinks) ? record.drinks : [];
    const submittedAt = record.submitted_at
      ? new Date(record.submitted_at).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
      : '—';

    const text = [
      '🎉 Новый ответ на приглашение',
      '',
      `📍 ${record.source_site ?? 'unknown'}`,
      `👤 ${record.full_name}`,
      `✅ ${record.attendance ?? '—'}`,
      `🥂 ${drinks.length ? drinks.join(', ') : '—'}`,
      `🕐 ${submittedAt}`,
    ].join('\n');

    const tgResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
      }),
    });

    const tgResult = await tgResponse.json();

    if (!tgResponse.ok) {
      console.error('Telegram API error:', tgResult);
      return new Response(JSON.stringify({ error: 'Telegram send failed', details: tgResult }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
