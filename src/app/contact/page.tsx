"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <section className="mx-auto max-w-xl px-6 py-16 md:py-24 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Message sent</h1>
        <p className="mt-2 text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you shortly.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Get in Touch
      </h1>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        Interested in AI marketing consulting, need help with our tools, or want
        to discuss a project? Drop us a line.
      </p>

      <form
        action="https://formsubmit.co/mark@drakmarketing.com"
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
          }).then((res) => {
            if (res.ok) setSubmitted(true);
          });
        }}
        className="mt-8 space-y-5"
      >
        {/* Honeypot for spam prevention */}
        <input type="text" name="_honey" className="hidden" />
        {/* Disable captcha redirect */}
        <input type="hidden" name="_captcha" value="false" />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium"
            >
              Name
            </label>
            <Input id="name" name="name" required placeholder="Your name" />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-sm font-medium"
          >
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Tell us about your project or question..."
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Send Message
        </button>
      </form>

      <div className="mt-12 border-t border-border pt-8">
        <p className="text-sm text-muted-foreground">
          Or email directly:{" "}
          <a
            href="mailto:mark@drakmarketing.com"
            className="font-medium text-foreground hover:underline"
          >
            mark@drakmarketing.com
          </a>
        </p>
      </div>
    </section>
  );
}
