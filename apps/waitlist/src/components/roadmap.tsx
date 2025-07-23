"use client";

import { motion } from "framer-motion";
import { Check, Clock, Circle } from "lucide-react";
import Link from "next/link";
import { BlurReveal } from "./ui/blur-reveal";
import { FadeUpWord } from "./ui/fade-up-word";

const roadmapItems = [
  {
    title: "Core Functionality",
    status: "in-progress",
    description: "Basic functionality",
  },
  {
    title: "Dashboard UI",
    status: "planned",
    description: "Main interface and navigation",
  },
  {
    title: "Slack Integration",
    status: "planned",
    description: "Connect Slack for updates.",
  },
  {
    title: "Being awesome",
    status: "completed",
    description: "we're awesome already :P",
  },
] as const;

type RoadmapStatus = "completed" | "in-progress" | "planned";

interface StatusIconProps {
  status: RoadmapStatus;
}

const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case "completed":
      return <Check className="h-4 w-4 text-green-600" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: RoadmapStatus): string => {
  switch (status) {
    case "completed":
      return "text-green-600";
    case "in-progress":
      return "text-yellow-600";
    default:
      return "text-muted-foreground";
  }
};

export default function Roadmap() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <FadeUpWord className="justify-center text-4xl font-bold tracking-tighter mb-2">
          Roadmap
        </FadeUpWord>
      </div>

      <div className="space-y-4">
        {roadmapItems.map((item, index) => (
          <BlurReveal
            delay={0.1 * index}
            className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/10 transition-colors"
          >
            <div className="mt-0.5">
              <StatusIcon status={item.status} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{item.title}</h3>
                <span
                  className={`text-xs capitalize ${getStatusColor(item.status)}`}
                >
                  {item.status === "in-progress" ? "in progress" : item.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </BlurReveal>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>This is an open source project. Want to contribute?</p>
        <Link
          href="https://github.com/1w6ts/relaykit"
          target="_blank"
          prefetch
          className="text-primary hover:underline font-medium"
        >
          Check out our GitHub →
        </Link>
      </div>
    </div>
  );
}
