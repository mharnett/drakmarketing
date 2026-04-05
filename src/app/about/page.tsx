import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Drak Marketing builds open-source AI marketing tools and consults on paid media strategy. 25+ years of performance marketing experience.",
};

const team = [
  {
    name: "Mark Harnett",
    role: "Principal",
    image: "/images/team/mark-n.png",
    linkedin: "https://www.linkedin.com/in/harnett/",
    bio: "Experienced online marketer with an analytical approach to driving profitable customer acquisition through rigorous testing, landing page optimization, and customer value analysis. Built the MCP Marketing Suite to connect AI assistants to the ad platforms he manages every day.",
  },
  {
    name: "Felipe Fuentes",
    role: "Data Analyst",
    image: "/images/team/felipe-n.png",
    linkedin: "https://www.linkedin.com/in/felipe-fuentes/",
    bio: "Data analyst skilled in digital marketing analytics and web analytics. Turns campaign data into actionable insights across Google Ads, Meta, and LinkedIn.",
  },
  {
    name: "Jose Fuentes",
    role: "Data Engineering",
    image: "/images/team/jose-n.png",
    linkedin: "https://www.linkedin.com/in/jose-f-0047babb/",
    bio: "Data engineer focused on data infrastructure, pipeline automation, and ensuring data quality for data-driven marketing insights.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        About Drak Marketing
      </h1>

      <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
        <p>
          Drak Marketing is a team of analytical marketers with over 25 years of
          online advertising experience. Internet marketing channels have evolved
          and changed over time. Taking an analytical approach to measuring return
          on investment and pairing that with deep customer insights consistently
          leads to high performing campaigns.
        </p>
        <p>
          We started building open-source tools because we kept solving the same
          problem: connecting AI assistants to the ad platforms we manage every
          day. Instead of building one-off integrations for each client, we
          open-sourced everything.
        </p>
        <p>
          The result is a suite of{" "}
          <strong className="text-foreground">8 MCP servers</strong> covering
          Google Ads, LinkedIn, Bing, Meta, Reddit, GA4, Search Console, and
          Google Tag Manager — over{" "}
          <strong className="text-foreground">124 tools</strong> that anyone can
          install with a single command.
        </p>
        <p>
          The tools are free. When clients need help with strategy, campaign
          architecture, or building custom AI workflows for their marketing
          teams, that&apos;s where we come in.
        </p>
      </div>

      {/* Team */}
      <div className="mt-16">
        <h2 className="text-lg font-semibold mb-8">Meet the Team</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {team.map((person) => (
            <div key={person.name} className="text-center">
              <Image
                src={person.image}
                alt={person.name}
                width={120}
                height={120}
                className="mx-auto rounded-full object-cover"
              />
              <h3 className="mt-4 font-semibold text-sm">{person.name}</h3>
              <p className="text-xs text-muted-foreground">{person.role}</p>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {person.bio}
              </p>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
              >
                LinkedIn
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="mt-16 flex items-center gap-6">
        <Image
          src="/images/badges/google-partner.svg"
          alt="Google Partner"
          width={100}
          height={40}
          className="h-10 w-auto"
        />
        <Image
          src="/images/badges/meta-business-partner.jpg"
          alt="Meta Business Partner"
          width={100}
          height={40}
          className="h-10 w-auto rounded"
        />
      </div>
    </section>
  );
}
