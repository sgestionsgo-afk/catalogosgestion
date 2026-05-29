"use client"

import { motion } from "motion/react"

type Props = {
  text: string
  className?: string
  delay?: number
}

export function ShiningText({ text, className = "", delay = 0 }: Props) {
  return (
    <motion.span
      className={`bg-[linear-gradient(110deg,#6b7280,35%,#fff,50%,#6b7280,75%,#6b7280)] bg-[length:200%_100%] bg-clip-text text-transparent ${className}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: "linear",
        delay,
      }}
    >
      {text}
    </motion.span>
  )
}
