// Paid 15-minute call. Payment happens on a Stripe Payment Link whose
// after-payment redirect is the Motion booking page. The Motion URL lives only
// in Stripe, never in this (public) repo.
export const paidCall = {
  priceUsd: 50,
  minutes: 15,
  // Stripe Payment Link "15-minute call with Mark Harnett" ($50, one-time).
  paymentLinkUrl: "https://book.stripe.com/14A4gyeyM2JY0Bf6Nn1Jm01",
};

export function isPaymentLinkLive(url: string = paidCall.paymentLinkUrl): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      (u.hostname === "buy.stripe.com" || u.hostname.endsWith(".stripe.com"))
    );
  } catch {
    return false;
  }
}
