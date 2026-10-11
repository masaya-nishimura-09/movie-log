import { randomBytes } from "node:crypto";
import type { Locale } from "@/i18n/locales";
import type { ContactInput } from "@/schemas/contact/contact";

export type ContactContext = {
  lang: Locale;
  userId: string | undefined;
  receivedAt: Date;
};

type ContactMail = { subject: string; html: string; text: string };

const timeZone = "Asia/Tokyo";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function receiptId(receivedAt: Date): string {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone })
    .format(receivedAt)
    .replaceAll("-", "");
  return `CL-${date}-${randomBytes(2).toString("hex").toUpperCase()}`;
}

function receivedAtLabel(receivedAt: Date): string {
  const formatted = new Intl.DateTimeFormat("ja-JP", {
    timeZone,
    dateStyle: "long",
    timeStyle: "short",
  }).format(receivedAt);
  return `${formatted}（日本時間）`;
}

function rowsHtml(rows: [string, string][]): string {
  return rows
    .map(
      ([label, value], index) =>
        `<tr><td style="padding:8px 0;color:#3d5268;width:120px;${index < rows.length - 1 ? "border-bottom:1px solid #e3dccb;" : ""}">${escapeHtml(label)}</td><td style="padding:8px 0;${index < rows.length - 1 ? "border-bottom:1px solid #e3dccb;" : ""}">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
}

export function buildContactMail(
  { email, message }: ContactInput,
  { lang, userId, receivedAt }: ContactContext,
): ContactMail {
  const id = receiptId(receivedAt);
  const rows: [string, string][] = [
    ["受付番号", id],
    ["受付日時", receivedAtLabel(receivedAt)],
    ["メールアドレス", email],
    ["表示言語", lang === "ja" ? "日本語" : "English"],
    [
      "ログイン状態",
      userId ? `ログイン中（ユーザー ID ${userId}）` : "未ログイン",
    ],
  ];

  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#efe7d6;font-family:-apple-system,'Hiragino Sans','Noto Sans JP',sans-serif;color:#0a2947">
<div style="max-width:600px;margin:0 auto;background:#fbf6ec;border-radius:12px;overflow:hidden">
<div style="background:#0a2947;color:#f3e4c9;padding:20px 28px">
<div style="font-size:12px;letter-spacing:.08em;opacity:.8">CINELOG</div>
<div style="font-size:20px;font-weight:700;margin-top:4px">新しいお問い合わせ</div>
<div style="font-size:13px;margin-top:6px;opacity:.85">受付番号 ${id}</div>
</div>
<div style="padding:24px 28px">
<div style="font-size:12px;font-weight:700;letter-spacing:.06em;color:#3d5268;margin:0 0 8px">お問い合わせの情報</div>
<table style="width:100%;border-collapse:collapse;font-size:14px">${rowsHtml(rows)}</table>
<div style="font-size:12px;font-weight:700;letter-spacing:.06em;color:#3d5268;margin:24px 0 8px">お問い合わせ内容</div>
<div style="border-left:3px solid #8b5e3c;background:#ffffff;padding:14px 16px;font-size:14px;line-height:1.8;white-space:pre-wrap">${escapeHtml(message)}</div>
</div>
<div style="padding:14px 28px 22px;font-size:11px;color:#5a6b7c;line-height:1.6">このメールは、Cinelog のお問い合わせフォームから自動で送信されました。</div>
</div>
</body></html>`;

  const text = [
    "Cinelog 新しいお問い合わせ",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "お問い合わせ内容",
    "----------------",
    message,
    "",
    "このメールは、Cinelog のお問い合わせフォームから自動で送信されました。",
  ].join("\n");

  return {
    subject: `[Cinelog お問い合わせ] #${id} ${email}`,
    html,
    text,
  };
}
