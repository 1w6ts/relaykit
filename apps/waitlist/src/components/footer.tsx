"use client";

import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import WordmarkLogo from "./marketing/wordmark";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <WordmarkLogo className="h-4 sm:h-5" />
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Stop losing feedback in Slack threads.
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 sm:pt-8 mt-6 sm:mt-8">
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/tryrelaykit/relaykit"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="h-4 sm:h-5 w-4 sm:w-5" />
            </Link>
            <Link
              href="https://x.com/tryrelaykit"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter/X"
            >
              <FaXTwitter className="h-4 sm:h-5 w-4 sm:w-5" />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} RelayKit - All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
