"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps, useInView } from "framer-motion";
import { useRef } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

interface FadeUpWordProps
  extends Omit<HTMLMotionProps<HeadingLevel>, "children"> {
  children: string;
  as?: HeadingLevel;
  className?: string;
}

export function FadeUpWord({
  children,
  as = "h2",
  className,
  ...props
}: FadeUpWordProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const Component = motion[as];

  return (
    <Component
      ref={ref}
      className={cn("tracking-tight flex flex-wrap gap-[0.5rem]", className)}
      {...props}
    >
      {children.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20 }
          }
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            ease: [0.75, 0.25, 0.25, 0.75],
          }}
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}
