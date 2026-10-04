"use client";

import type { ComponentProps, MouseEvent } from "react";
import { scrollToTarget } from "@/lib/scroll";

type Props = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  onNavigate?: () => void;
};

/** A normal <a href="#section"> that scrolls smoothly instead of jumping. */
export default function ScrollLink({ href, onNavigate, onClick, children, ...rest }: Props) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    e.preventDefault();
    scrollToTarget(href);
    onNavigate?.();
  };
  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}