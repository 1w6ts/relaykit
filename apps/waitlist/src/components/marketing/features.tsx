"use client";
import {
  Zap,
  Cpu,
  Fingerprint,
  Pencil,
  Settings2,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { FeatureCard } from "./grid-feature-cards";
import NotificationList from "./notification-list";

const features = [
  {
    title: "Faaast",
    icon: Zap,
    description: "It supports an entire helping developers and innovate.",
  },
  {
    title: "Powerful",
    icon: Cpu,
    description: "It supports an entire helping developers and businesses.",
  },
  {
    title: "Security",
    icon: Fingerprint,
    description: "It supports an helping developers businesses.",
  },
  {
    title: "Customization",
    icon: Pencil,
    description: "It supports helping developers and businesses innovate.",
  },
  {
    title: "Control",
    icon: Settings2,
    description: "It supports helping developers and businesses innovate.",
  },
  // The last cell will be replaced with NotificationList
];

export default function Features() {
  return (
    <section className="py-16 md:py-32 w-full bg-neutral-50 dark:bg-neutral-950">
      {/* Heading container (centered, not full width) */}
      <div className="max-w-3xl mx-auto text-center px-4 mb-12">
        <AnimatedContainer>
          <h2 className="text-3xl font-bold tracking-tighter text-balance md:text-4xl lg:text-5xl xl:font-semibold">
            Power. Speed. Control.
          </h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
            Everything you need to build fast, secure, scalable apps.
          </p>
        </AnimatedContainer>
      </div>
      {/* Full-width bento grid */}
      <AnimatedContainer
        delay={0.4}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full divide-x divide-y divide-dashed border-t border-b border-dashed bg-white dark:bg-neutral-950"
      >
        {features.map((feature, i) => (
          <FeatureCard
            key={i}
            feature={feature}
            className="bg-transparent p-8 min-h-[220px] flex flex-col items-center justify-center"
          />
        ))}
        {/* NotificationList as a bento cell */}
        <div className="bg-transparent p-8 min-h-[220px] flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full max-w-xs overflow-hidden">
            <NotificationList />
          </div>
        </div>
      </AnimatedContainer>
    </section>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: React.ComponentProps<typeof motion.div>["className"];
  children: React.ReactNode;
};

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
