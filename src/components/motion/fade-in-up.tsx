"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

interface FadeInUpProps extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate"> {
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
}

export function FadeInUp({
  delay = 0,
  duration = 0.7,
  amount = 0.3,
  once = true,
  ...rest
}: FadeInUpProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    />
  );
}
