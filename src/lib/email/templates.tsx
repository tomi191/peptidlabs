import type { Order, OrderItem } from "@/lib/types";

type OrderConfirmationProps = {
  order: Order;
  items: OrderItem[];
  locale: string;
};

type ShippingUpdateProps = {
  order: Order;
  locale: string;
};

type MagicLinkProps = {
  email: string;
  link: string;
  locale: string;
};

type WaitlistConfirmationProps = {
  email: string;
  locale: string;
  interestedPeptides?: string[];
};

const BRAND = {
  name: "PeptidLabs",
  url: "https://peptidlabs.eu",
  navy: "#0f172a",
  teal: "#0d9488",
  surface: "#f5f5f4",
  border: "#e7e5e4",
  muted: "#78716c",
};

function formatCurrency(amount: number, currency = "EUR"): string {
  return `€${amount.toFixed(2)}`;
}

function formatOrderId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

function getCopy(locale: string) {
  const bg = locale === "bg";
  return {
    orderConfirmedSubject: bg
      ? "Поръчката ви е приета"
      : "Your order is confirmed",
    orderConfirmedHeading: bg ? "Благодарим за поръчката" : "Thank you for your order",
    orderNumber: bg ? "Поръчка" : "Order",
    itemsHeading: bg ? "Продукти" : "Items",
    subtotal: bg ? "Междинна сума" : "Subtotal",
    shipping: bg ? "Доставка" : "Shipping",
    total: bg ? "Общо" : "Total",
    paymentMethod: bg ? "Начин на плащане" : "Payment method",
    cod: bg ? "Наложен платеж" : "Cash on delivery",
    card: bg ? "Карта" : "Card",
    shippingAddress: bg ? "Адрес за доставка" : "Shipping address",
    nextSteps: bg ? "Следващи стъпки" : "What happens next",
    nextStepsText: bg
      ? "Поръчката ви е регистрирана. Ще я обработим в рамките на 24 часа и ще получите известие с номер за проследяване."
      : "Your order is registered. We'll process it within 24 hours and send you a tracking number.",
    questions: bg ? "Въпроси?" : "Questions?",
    contactUs: bg
      ? "Отговорете на този имейл или пишете на"
      : "Reply to this email or contact",
    researchNote: bg
      ? "Напомняне: продуктите са за научни изследвания и не са предназначени за хуманна употреба."
      : "Reminder: products are for research use only and not for human consumption.",
    viewOrder: bg ? "Виж поръчката" : "View order",
    shippedSubject: bg ? "Поръчката ви е изпратена" : "Your order has shipped",
    shippedHeading: bg ? "Поръчката е на път" : "Your order is on the way",
    shippedText: bg
      ? "Предадохме пратката на куриера. Можете да я проследите със следния номер:"
      : "Your package is with the courier. You can track it with the following number:",
    trackShipment: bg ? "Проследи пратка" : "Track shipment",
    trackingNumber: bg ? "Номер за проследяване" : "Tracking number",
    footer: bg
      ? "PeptidLabs · research-grade peptides · EU delivery"
      : "PeptidLabs · research-grade peptides · EU delivery",
    magicLinkSubject: bg
      ? "Вашият линк за вход — PeptidLabs"
      : "Your sign-in link — PeptidLabs",
    magicLinkHeading: bg
      ? "Достъп до Вашия акаунт"
      : "Access your account",
    magicLinkIntro: bg
      ? "Натиснете бутона по-долу, за да влезете в своя акаунт и да видите поръчките и точките за лоялност."
      : "Click the button below to access your account, view past orders and loyalty points.",
    magicLinkButton: bg ? "Отвори акаунта" : "Open my account",
    magicLinkExpires: bg
      ? "Линкът е валиден 30 минути и може да бъде използван еднократно."
      : "This link is valid for 30 minutes and can be used once.",
    magicLinkFallback: bg
      ? "Ако бутонът не работи, копирайте следния адрес в браузъра си:"
      : "If the button doesn't work, copy this address into your browser:",
    magicLinkDidntRequest: bg
      ? "Ако не сте поискали този имейл, просто го игнорирайте — без този линк никой не може да влезе в акаунта Ви."
      : "If you didn't request this email, simply ignore it — no one can access your account without the link.",

    // Waitlist confirmation
    waitlistSubject: bg
      ? "Записан си в списъка на PeptidLabs"
      : "You are on the PeptidLabs waitlist",
    waitlistHeading: bg
      ? "Добре дошъл в списъка"
      : "Welcome to the list",
    waitlistIntro: bg
      ? "Записването ти е успешно. Ще те уведомим по имейл в момента, в който каталогът отвори за поръчки. Без спам, без излишни писма."
      : "You are signed up. We will notify you by email the moment the catalog opens for orders. No spam, no unnecessary emails.",
    waitlistInterested: bg
      ? "Заявени продукти"
      : "Products you're interested in",
    waitlistWhatNext: bg ? "Какво следва" : "What happens next",
    waitlistWhatNextItems: bg
      ? [
          "Подготвяме логистиката и митническата документация за официалното пускане.",
          "Записаните в списъка получават имейл с 48-часов ранен достъп преди публичното отваряне.",
          "Първите 100 души от списъка получават специална стартова отстъпка.",
        ]
      : [
          "We are finalizing logistics and customs paperwork for official launch.",
          "Waitlist members get an email with 48-hour early access before public opening.",
          "The first 100 people on the list receive a special launch discount.",
        ],
    waitlistBrowse: bg ? "Разгледай каталога" : "Browse the catalog",
    waitlistBrowseDesc: bg
      ? "Каталогът от 66+ пептида с пълна научна документация и Сертификат за анализ е публично достъпен."
      : "The catalog of 66+ peptides with full scientific documentation and Certificate of Analysis is publicly available.",
    waitlistEducation: bg ? "Какво са пептидите?" : "What are peptides?",
    waitlistEducationDesc: bg
      ? "Подробно ръководство на човешки език: какво представляват, как работят, история и видове."
      : "Detailed guide in plain language: what they are, how they work, history and types.",
    waitlistUnsubscribe: bg
      ? "Не искаш да получиш този имейл? Просто отговори с \"unsubscribe\" и веднага те премахваме."
      : "Don't want to receive this email? Just reply with \"unsubscribe\" and we'll remove you immediately.",
  };
}

function layout(content: string, copy: ReturnType<typeof getCopy>): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${BRAND.navy};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:24px 32px;border-bottom:1px solid ${BRAND.border};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family:ui-monospace,'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:${BRAND.navy};letter-spacing:-0.02em;">
                      ${BRAND.name}
                    </td>
                    <td align="right" style="font-family:ui-monospace,monospace;font-size:10px;color:${BRAND.muted};letter-spacing:0.1em;text-transform:uppercase;">
                      RESEARCH USE ONLY
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">${content}</td>
            </tr>
            <tr>
              <td style="padding:24px 32px;background:${BRAND.surface};border-top:1px solid ${BRAND.border};font-size:11px;color:${BRAND.muted};text-align:center;">
                <p style="margin:0 0 6px 0;font-style:italic;">${copy.researchNote}</p>
                <p style="margin:0;">${copy.footer}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;padding:12px 24px;background:${BRAND.navy};color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">${label}</a>`;
}

export function renderOrderConfirmation({
  order,
  items,
  locale,
}: OrderConfirmationProps): { subject: string; html: string; text: string } {
  const copy = getCopy(locale);
  const orderLink = `${process.env.NEXT_PUBLIC_SITE_URL || "https://peptidlabs.eu"}/${locale}/orders/${order.id}`;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:14px;color:${BRAND.navy};font-weight:600;">${item.product_name}</p>
          <p style="margin:4px 0 0 0;font-family:ui-monospace,monospace;font-size:12px;color:${BRAND.muted};">${item.quantity} × ${formatCurrency(item.unit_price, order.currency)}</p>
        </td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid ${BRAND.border};font-family:ui-monospace,monospace;font-size:14px;color:${BRAND.navy};font-weight:600;">
          ${formatCurrency(item.unit_price * item.quantity, order.currency)}
        </td>
      </tr>`
    )
    .join("");

  const shippingAddressHtml = [
    order.shipping_name,
    order.shipping_address,
    order.shipping_address_line2,
    `${order.shipping_postal_code} ${order.shipping_city}`,
    order.shipping_country,
  ]
    .filter(Boolean)
    .join("<br />");

  const content = `
    <h1 style="margin:0 0 8px 0;font-size:22px;color:${BRAND.navy};font-weight:700;">${copy.orderConfirmedHeading}</h1>
    <p style="margin:0 0 24px 0;font-family:ui-monospace,monospace;font-size:13px;color:${BRAND.muted};">
      ${copy.orderNumber} ${formatOrderId(order.id)}
    </p>

    <h2 style="margin:24px 0 12px 0;font-size:13px;color:${BRAND.navy};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">${copy.itemsHeading}</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${itemsHtml}
      <tr>
        <td style="padding:12px 0;font-size:13px;color:${BRAND.muted};">${copy.subtotal}</td>
        <td align="right" style="padding:12px 0;font-family:ui-monospace,monospace;font-size:13px;color:${BRAND.navy};">${formatCurrency(order.subtotal, order.currency)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0 12px 0;font-size:13px;color:${BRAND.muted};">${copy.shipping}</td>
        <td align="right" style="padding:4px 0 12px 0;font-family:ui-monospace,monospace;font-size:13px;color:${BRAND.navy};">${formatCurrency(order.shipping_cost, order.currency)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-top:2px solid ${BRAND.navy};font-size:15px;font-weight:700;color:${BRAND.navy};">${copy.total}</td>
        <td align="right" style="padding:12px 0;border-top:2px solid ${BRAND.navy};font-family:ui-monospace,monospace;font-size:15px;font-weight:700;color:${BRAND.navy};">${formatCurrency(order.total, order.currency)}</td>
      </tr>
    </table>

    <h2 style="margin:32px 0 8px 0;font-size:13px;color:${BRAND.navy};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">${copy.paymentMethod}</h2>
    <p style="margin:0;font-size:14px;color:${BRAND.navy};">${order.payment_method === "cod" ? copy.cod : copy.card}</p>

    <h2 style="margin:24px 0 8px 0;font-size:13px;color:${BRAND.navy};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">${copy.shippingAddress}</h2>
    <p style="margin:0;font-size:14px;line-height:1.6;color:${BRAND.navy};">${shippingAddressHtml}</p>

    <div style="margin:32px 0;padding:16px;background:${BRAND.surface};border-radius:8px;border-left:3px solid ${BRAND.teal};">
      <p style="margin:0 0 6px 0;font-size:13px;font-weight:700;color:${BRAND.navy};">${copy.nextSteps}</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:${BRAND.muted};">${copy.nextStepsText}</p>
    </div>

    <div style="text-align:center;margin:32px 0 8px 0;">
      ${button(orderLink, copy.viewOrder)}
    </div>

    <p style="margin:24px 0 0 0;font-size:12px;color:${BRAND.muted};text-align:center;">
      ${copy.questions} ${copy.contactUs} <a href="mailto:support@peptidlabs.eu" style="color:${BRAND.teal};">support@peptidlabs.eu</a>
    </p>
  `;

  const text = [
    `${copy.orderConfirmedHeading} — ${formatOrderId(order.id)}`,
    "",
    ...items.map(
      (i) =>
        `${i.quantity} × ${i.product_name} — ${formatCurrency(i.unit_price * i.quantity, order.currency)}`
    ),
    "",
    `${copy.subtotal}: ${formatCurrency(order.subtotal, order.currency)}`,
    `${copy.shipping}: ${formatCurrency(order.shipping_cost, order.currency)}`,
    `${copy.total}: ${formatCurrency(order.total, order.currency)}`,
    "",
    `${copy.viewOrder}: ${orderLink}`,
  ].join("\n");

  return {
    subject: `${copy.orderConfirmedSubject} — ${formatOrderId(order.id)}`,
    html: layout(content, copy),
    text,
  };
}

export function renderShippingUpdate({
  order,
  locale,
}: ShippingUpdateProps): { subject: string; html: string; text: string } {
  const copy = getCopy(locale);
  const orderLink = `${process.env.NEXT_PUBLIC_SITE_URL || "https://peptidlabs.eu"}/${locale}/orders/${order.id}`;
  const trackingHref = order.tracking_url || orderLink;

  const content = `
    <h1 style="margin:0 0 8px 0;font-size:22px;color:${BRAND.navy};font-weight:700;">${copy.shippedHeading}</h1>
    <p style="margin:0 0 24px 0;font-family:ui-monospace,monospace;font-size:13px;color:${BRAND.muted};">
      ${copy.orderNumber} ${formatOrderId(order.id)}
    </p>

    <p style="margin:0 0 24px 0;font-size:14px;line-height:1.6;color:${BRAND.navy};">
      ${copy.shippedText}
    </p>

    ${
      order.tracking_number
        ? `<div style="padding:16px;background:${BRAND.surface};border-radius:8px;margin-bottom:24px;">
            <p style="margin:0 0 4px 0;font-size:11px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.1em;">${copy.trackingNumber}</p>
            <p style="margin:0;font-family:ui-monospace,monospace;font-size:16px;font-weight:700;color:${BRAND.navy};">${order.tracking_number}</p>
          </div>`
        : ""
    }

    <div style="text-align:center;margin:32px 0 8px 0;">
      ${button(trackingHref, copy.trackShipment)}
    </div>

    <p style="margin:24px 0 0 0;font-size:12px;color:${BRAND.muted};text-align:center;">
      ${copy.questions} ${copy.contactUs} <a href="mailto:support@peptidlabs.eu" style="color:${BRAND.teal};">support@peptidlabs.eu</a>
    </p>
  `;

  const text = [
    `${copy.shippedHeading} — ${formatOrderId(order.id)}`,
    "",
    copy.shippedText,
    order.tracking_number ? `${copy.trackingNumber}: ${order.tracking_number}` : "",
    trackingHref,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `${copy.shippedSubject} — ${formatOrderId(order.id)}`,
    html: layout(content, copy),
    text,
  };
}

export function renderMagicLink({
  email,
  link,
  locale,
}: MagicLinkProps): { subject: string; html: string; text: string } {
  const copy = getCopy(locale);

  const content = `
    <h1 style="margin:0 0 8px 0;font-size:22px;color:${BRAND.navy};font-weight:700;">${copy.magicLinkHeading}</h1>
    <p style="margin:0 0 8px 0;font-family:ui-monospace,monospace;font-size:13px;color:${BRAND.muted};">${email}</p>

    <p style="margin:20px 0 24px 0;font-size:14px;line-height:1.6;color:${BRAND.navy};">
      ${copy.magicLinkIntro}
    </p>

    <div style="text-align:center;margin:32px 0;">
      ${button(link, copy.magicLinkButton)}
    </div>

    <div style="padding:14px 16px;background:${BRAND.surface};border-radius:8px;border-left:3px solid ${BRAND.teal};margin:24px 0;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:${BRAND.muted};">
        ${copy.magicLinkExpires}
      </p>
    </div>

    <p style="margin:24px 0 6px 0;font-size:12px;color:${BRAND.muted};">
      ${copy.magicLinkFallback}
    </p>
    <p style="margin:0;font-family:ui-monospace,monospace;font-size:11px;color:${BRAND.navy};word-break:break-all;">
      ${link}
    </p>

    <p style="margin:32px 0 0 0;font-size:12px;line-height:1.6;color:${BRAND.muted};font-style:italic;">
      ${copy.magicLinkDidntRequest}
    </p>
  `;

  const text = [
    copy.magicLinkHeading,
    email,
    "",
    copy.magicLinkIntro,
    "",
    `${copy.magicLinkButton}: ${link}`,
    "",
    copy.magicLinkExpires,
    "",
    copy.magicLinkDidntRequest,
  ].join("\n");

  return {
    subject: copy.magicLinkSubject,
    html: layout(content, copy),
    text,
  };
}

export function renderWaitlistConfirmation({
  email,
  locale,
  interestedPeptides = [],
}: WaitlistConfirmationProps): { subject: string; html: string; text: string } {
  const copy = getCopy(locale);
  const baseUrl = "https://peptidlabs.eu";

  const interestedBlock =
    interestedPeptides.length > 0
      ? `
    <div style="margin:24px 0;padding:14px 16px;background:${BRAND.surface};border-radius:8px;border-left:3px solid ${BRAND.teal};">
      <p style="margin:0 0 8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-weight:600;">
        ${copy.waitlistInterested}
      </p>
      <p style="margin:0;font-family:ui-monospace,monospace;font-size:13px;color:${BRAND.navy};">
        ${interestedPeptides.join(", ")}
      </p>
    </div>`
      : "";

  const content = `
    <h1 style="margin:0 0 8px 0;font-size:22px;color:${BRAND.navy};font-weight:700;">${copy.waitlistHeading}</h1>
    <p style="margin:0 0 16px 0;font-family:ui-monospace,monospace;font-size:13px;color:${BRAND.muted};">${email}</p>

    <p style="margin:20px 0;font-size:14px;line-height:1.6;color:${BRAND.navy};">
      ${copy.waitlistIntro}
    </p>

    ${interestedBlock}

    <h2 style="margin:32px 0 12px 0;font-size:15px;color:${BRAND.navy};font-weight:700;">${copy.waitlistWhatNext}</h2>
    <ol style="margin:0;padding-left:20px;font-size:13px;line-height:1.7;color:${BRAND.navy};">
      ${copy.waitlistWhatNextItems.map((item) => `<li style="margin-bottom:6px;">${item}</li>`).join("")}
    </ol>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 0 0;border-top:1px solid ${BRAND.border};">
      <tr>
        <td style="padding:20px 0 0 0;">
          <p style="margin:0 0 4px 0;font-size:14px;font-weight:600;color:${BRAND.navy};">
            ${copy.waitlistBrowse}
          </p>
          <p style="margin:0 0 8px 0;font-size:13px;line-height:1.5;color:${BRAND.muted};">
            ${copy.waitlistBrowseDesc}
          </p>
          <a href="${baseUrl}/${locale}/shop" style="font-size:13px;color:${BRAND.teal};text-decoration:none;font-weight:600;">
            ${baseUrl}/${locale}/shop →
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 0 0 0;">
          <p style="margin:0 0 4px 0;font-size:14px;font-weight:600;color:${BRAND.navy};">
            ${copy.waitlistEducation}
          </p>
          <p style="margin:0 0 8px 0;font-size:13px;line-height:1.5;color:${BRAND.muted};">
            ${copy.waitlistEducationDesc}
          </p>
          <a href="${baseUrl}/${locale}/what-are-peptides" style="font-size:13px;color:${BRAND.teal};text-decoration:none;font-weight:600;">
            ${baseUrl}/${locale}/what-are-peptides →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:32px 0 0 0;font-size:12px;line-height:1.6;color:${BRAND.muted};font-style:italic;">
      ${copy.waitlistUnsubscribe}
    </p>
  `;

  const text = [
    copy.waitlistHeading,
    email,
    "",
    copy.waitlistIntro,
    "",
    interestedPeptides.length > 0
      ? `${copy.waitlistInterested}: ${interestedPeptides.join(", ")}`
      : "",
    copy.waitlistWhatNext + ":",
    ...copy.waitlistWhatNextItems.map((item, i) => `  ${i + 1}. ${item}`),
    "",
    `${copy.waitlistBrowse}: ${baseUrl}/${locale}/shop`,
    `${copy.waitlistEducation}: ${baseUrl}/${locale}/what-are-peptides`,
    "",
    copy.waitlistUnsubscribe,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: copy.waitlistSubject,
    html: layout(content, copy),
    text,
  };
}
