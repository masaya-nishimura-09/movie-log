import { describe, expect, it } from "vitest";
import { buildContactMail } from "@/lib/contact/contact-mail";

const receivedAt = new Date("2026-10-10T15:30:00Z");

describe("buildContactMail", () => {
  it("puts the receipt ID with the Japan date and the sender in the subject", () => {
    const mail = buildContactMail(
      { email: "user@example.com", message: "Hello" },
      { lang: "ja", userId: undefined, receivedAt },
    );
    expect(mail.subject).toMatch(
      /^\[Cinestamp お問い合わせ\] #CS-20261011-[0-9A-F]{4} user@example\.com$/,
    );
  });

  it("uses the same receipt ID in the subject and the body", () => {
    const mail = buildContactMail(
      { email: "user@example.com", message: "Hello" },
      { lang: "ja", userId: undefined, receivedAt },
    );
    const id = mail.subject.match(/#(CS-\d{8}-[0-9A-F]{4})/)?.[1];
    expect(mail.text).toContain(`受付番号: ${id}`);
    expect(mail.html).toContain(`受付番号 ${id}`);
  });

  it("lists the request details in the text body", () => {
    const mail = buildContactMail(
      { email: "user@example.com", message: "1行目\n2行目" },
      { lang: "en", userId: "42", receivedAt },
    );
    expect(mail.text).toContain("受付日時: 2026年10月11日 0:30（日本時間）");
    expect(mail.text).toContain("メールアドレス: user@example.com");
    expect(mail.text).toContain("表示言語: English");
    expect(mail.text).toContain("ログイン状態: ログイン中（ユーザー ID 42）");
    expect(mail.text).toContain("1行目\n2行目");
  });

  it("shows a guest as not logged in", () => {
    const mail = buildContactMail(
      { email: "user@example.com", message: "Hello" },
      { lang: "ja", userId: undefined, receivedAt },
    );
    expect(mail.text).toContain("表示言語: 日本語");
    expect(mail.text).toContain("ログイン状態: 未ログイン");
  });

  it("escapes HTML in the user's input", () => {
    const mail = buildContactMail(
      {
        email: "user@example.com",
        message: `<script>alert("x")</script> & 'y'`,
      },
      { lang: "ja", userId: undefined, receivedAt },
    );
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).toContain(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;",
    );
  });
});
