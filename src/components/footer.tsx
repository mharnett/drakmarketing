import Link from "next/link";
import { GitHubIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Drak Marketing. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/tools"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Tools
          </Link>
          <Link
            href="/work"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Work
          </Link>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </Link>
          <a
            href="https://github.com/mharnett"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
            aria-label="GitHub"
          >
            <GitHubIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
