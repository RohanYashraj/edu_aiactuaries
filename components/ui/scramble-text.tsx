"use client";

import React, { useEffect, useState, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?~";

interface ScrambleTextProps {
  text: string;
  duration?: number;
  className?: string;
  as?: React.ElementType;
}

export function ScrambleText({ text, duration = 800, className = "", as: Component = "span" }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const textLength = text.length;

  useEffect(() => {
    let animationFrame: number;
    let isCancelled = false;

    const animate = (time: number) => {
      if (isCancelled) return;
      if (!startTimeRef.current) startTimeRef.current = time;

      const progress = Math.min((time - startTimeRef.current) / duration, 1);
      
      // Calculate how many characters should be revealed based on progress
      const revealCount = Math.floor(progress * textLength);
      
      let scrambled = "";
      for (let i = 0; i < textLength; i++) {
        if (i < revealCount) {
          scrambled += text[i];
        } else if (text[i] === " ") {
          scrambled += " ";
        } else {
          scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplayText(scrambled);

      if (progress < 1) {
        frameRef.current++;
        // Throttling the updates slightly makes it look more like a terminal
        if (frameRef.current % 2 === 0) {
           animationFrame = requestAnimationFrame(animate);
        } else {
           animationFrame = requestAnimationFrame(() => requestAnimationFrame(animate));
        }
      }
    };

    startTimeRef.current = 0;
    frameRef.current = 0;
    animationFrame = requestAnimationFrame(animate);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrame);
    };
  }, [text, duration, textLength]);

  return <Component className={className}>{displayText}</Component>;
}
