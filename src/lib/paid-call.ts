// Paid 15-minute call. Payment happens on a Stripe Payment Link whose
// after-payment redirect is the Motion booking page. The Motion URL lives only
// in Stripe, never in this (public) repo.
export const paidCall = {
  priceUsd: 50,
  minutes: 15,
  // Paste the buy.stripe.com Payment Link here once it exists.
  paymentLinkUrl: "",
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
