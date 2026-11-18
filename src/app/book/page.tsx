import type { Metadata } from "next";
import { paidCall, isPaymentLinkLive } from "@/lib/paid-call";

export const metadata: Metadata = {
  title: "Book a Call",
  description: `Book a ${paidCall.minutes}-minute call with Mark Harnett.`,
  robots: { index: false, follow: false },
};

export default function BookPage() {
  const live = isPaymentLinkLive();

  return (
    <section className="mx-auto max-w-xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Book a {paidCall.minutes}-minute call
      </h1>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        I get a lot of meeting requests. To keep my calendar for people who
        are serious, intro calls are ${paidCall.priceUsd}, paid up front. After
        payment you&apos;ll go straight to my calendar to pick a time.
      </p>

      <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
        <li>• {paidCall.minutes} minutes on Google Meet</li>
        <li>• If we start working together, the ${paidCall.priceUsd} comes off the first invoice</li>
        <li>• If I cancel or miss the call, you get a full refund</li>
        <li>• If you don&apos;t book within 14 days, email me for a refund</li>
      </ul>

      <div className="mt-8">
        {live ? (
          <a
            href={paidCall.paymentLinkUrl}
            className="inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Pay ${paidCall.priceUsd} and pick a time
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">
            Booking opens soon. Until then, email{" "}
            <a
              href="mailto:hello@drakmarketing.com"
              className="font-medium text-foreground hover:underline"
            >
              hello@drakmarketing.com
            </a>
            .
          </p>
        )}
      </div>

      <p className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
        Clients and existing contacts: use the link I sent you, not this page.
      </p>
    </section>
  );
}
