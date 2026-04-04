import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Drak Marketing privacy policy.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: April 4, 2026
      </p>

      <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Who we are
          </h2>
          <p>
            Drak Marketing (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
            operates the website drakmarketing.com. This policy explains how we
            collect, use, and protect your information.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Information we collect
          </h2>
          <p>
            We collect information you voluntarily provide through our contact
            form: your name, email address, and message. We do not collect
            information automatically beyond standard server logs (IP address,
            browser type, pages visited).
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            How we use your information
          </h2>
          <p>
            We use your contact information solely to respond to your inquiry.
            We do not sell, rent, or share your personal information with third
            parties for marketing purposes.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Third-party services
          </h2>
          <p>
            Our website is hosted on Vercel. Contact form submissions are
            processed through Formspree. These services may collect standard
            server logs. We may use Google Analytics to understand site traffic.
            Each service operates under its own privacy policy.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Cookies
          </h2>
          <p>
            We use only essential cookies required for the website to function.
            Third-party analytics tools may set their own cookies. You can
            disable cookies in your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Data retention
          </h2>
          <p>
            We retain contact form submissions only as long as needed to respond
            to your inquiry. You may request deletion of your data at any time.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Your rights
          </h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data by contacting us at{" "}
            <a
              href="mailto:mark@drakmarketing.com"
              className="font-medium text-foreground hover:underline"
            >
              mark@drakmarketing.com
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Changes to this policy
          </h2>
          <p>
            We may update this policy from time to time. Changes will be posted
            on this page with an updated date.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Contact
          </h2>
          <p>
            Questions about this policy? Email{" "}
            <a
              href="mailto:mark@drakmarketing.com"
              className="font-medium text-foreground hover:underline"
            >
              mark@drakmarketing.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
