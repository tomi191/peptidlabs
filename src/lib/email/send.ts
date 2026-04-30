import { getResendClient, EMAIL_FROM, EMAIL_REPLY_TO } from "./client";
import {
  renderOrderConfirmation,
  renderShippingUpdate,
  renderMagicLink,
  renderWaitlistConfirmation,
} from "./templates";
import type { Order, OrderItem } from "@/lib/types";

type SendResult = { sent: boolean; reason?: string };

export async function sendOrderConfirmation(
  order: Order,
  items: OrderItem[],
  locale: string
): Promise<SendResult> {
  const client = getResendClient();
  if (!client) return { sent: false, reason: "RESEND_NOT_CONFIGURED" };
  if (!order.email) return { sent: false, reason: "NO_RECIPIENT" };

  const { subject, html, text } = renderOrderConfirmation({
    order,
    items,
    locale,
  });

  try {
    const { error } = await client.emails.send({
      from: EMAIL_FROM,
      to: [order.email],
      replyTo: EMAIL_REPLY_TO,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("[email] order confirmation failed:", error);
      return { sent: false, reason: "SEND_FAILED" };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] order confirmation exception:", err);
    return { sent: false, reason: "EXCEPTION" };
  }
}

export async function sendMagicLink(
  email: string,
  link: string,
  locale: string
): Promise<SendResult> {
  const client = getResendClient();
  if (!client) return { sent: false, reason: "RESEND_NOT_CONFIGURED" };
  if (!email) return { sent: false, reason: "NO_RECIPIENT" };

  const { subject, html, text } = renderMagicLink({ email, link, locale });

  try {
    const { error } = await client.emails.send({
      from: EMAIL_FROM,
      to: [email],
      replyTo: EMAIL_REPLY_TO,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("[email] magic link failed:", error);
      return { sent: false, reason: "SEND_FAILED" };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] magic link exception:", err);
    return { sent: false, reason: "EXCEPTION" };
  }
}

export async function sendWaitlistConfirmation(
  email: string,
  locale: string,
  interestedPeptides: string[] = []
): Promise<SendResult> {
  const client = getResendClient();
  if (!client) return { sent: false, reason: "RESEND_NOT_CONFIGURED" };
  if (!email) return { sent: false, reason: "NO_RECIPIENT" };

  const { subject, html, text } = renderWaitlistConfirmation({
    email,
    locale,
    interestedPeptides,
  });

  try {
    const { error } = await client.emails.send({
      from: EMAIL_FROM,
      to: [email],
      replyTo: EMAIL_REPLY_TO,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("[email] waitlist confirmation failed:", error);
      return { sent: false, reason: "SEND_FAILED" };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] waitlist confirmation exception:", err);
    return { sent: false, reason: "EXCEPTION" };
  }
}

export async function sendShippingUpdate(
  order: Order,
  locale: string
): Promise<SendResult> {
  const client = getResendClient();
  if (!client) return { sent: false, reason: "RESEND_NOT_CONFIGURED" };
  if (!order.email) return { sent: false, reason: "NO_RECIPIENT" };

  const { subject, html, text } = renderShippingUpdate({ order, locale });

  try {
    const { error } = await client.emails.send({
      from: EMAIL_FROM,
      to: [order.email],
      replyTo: EMAIL_REPLY_TO,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("[email] shipping update failed:", error);
      return { sent: false, reason: "SEND_FAILED" };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] shipping update exception:", err);
    return { sent: false, reason: "EXCEPTION" };
  }
}
