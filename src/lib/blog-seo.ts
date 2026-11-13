import type { Metadata } from "next";
import type { BlogPost } from "./blog-posts.ts";

const SITE = "https://drakmarketing.com";

export interface Faq {
  question: string;
  answer: string;
}

/** Schema.org BlogPosting for a post. The author is a Person with profile links, not just a name. */
export function blogPostingJsonLd(post: BlogPost) {
  const url = `${SITE}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    author: {
      "@type": "Person",
      name: post.author,
      url: `${SITE}/about`,
      sameAs: ["https://www.linkedin.com/in/markharnett/", "https://github.com/mharnett"],
    },
    publisher: { "@type": "Organization", name: "Drak Marketing", url: SITE },
  };
}

/** Page metadata: canonical URL and article Open Graph. Relative URLs resolve against the layout's metadataBase. */
export function blogPostMetadata(post: BlogPost): Metadata {
  const path = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: path,
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

/**
 * Questions from a `## FAQ` section: each `### Question` heading plus the paragraphs
 * under it, up to the next `###` or `##`. A `###` outside that section is not a question.
 */
export function extractFaqs(content: string): Faq[] {
  const faqs: Faq[] = [];
  let inFaq = false;
  let current: { question: string; parts: string[] } | null = null;
  const flush = () => {
    if (current && current.parts.length > 0) {
      faqs.push({ question: current.question, answer: current.parts.join(" ") });
    }
    current = null;
  };
  for (const block of content.split("\n\n")) {
    if (block.startsWith("## ")) {
      flush();
      inFaq = block.slice(3).trim().toLowerCase() === "faq";
    } else if (inFaq && block.startsWith("### ")) {
      flush();
      current = { question: block.slice(4).trim(), parts: [] };
    } else if (inFaq && current) {
      current.parts.push(block.trim());
    }
  }
  flush();
  return faqs;
}

/** Schema.org FAQPage, or null when the post has no FAQ. */
export function faqPageJsonLd(faqs: Faq[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
