"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({
  items
}: {
  items: readonly { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <button
            type="button"
            key={item.question}
            onClick={() => setOpen(isOpen ? null : index)}
            className="premium-card block w-full rounded-[28px] p-6 text-left"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="font-sans text-base font-semibold text-[var(--foreground)]">{item.question}</span>
              <ChevronDown className={cn("mt-1 h-5 w-5 shrink-0 text-[var(--muted)] transition", isOpen ? "rotate-180" : "")} />
            </div>
            {isOpen ? <p className="font-sans mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">{item.answer}</p> : null}
          </button>
        );
      })}
    </div>
  );
}
