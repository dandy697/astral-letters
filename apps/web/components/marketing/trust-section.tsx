import { Lock, ShieldCheck, Undo2 } from "lucide-react";
import { trustPoints } from "@/lib/demo-content";
import { Card } from "@/components/ui/card";

const icons = [ShieldCheck, Undo2, Lock, ShieldCheck];

export function TrustSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-shell grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {trustPoints.map((point, index) => {
          const Icon = icons[index];
          return (
            <Card variant="glass" className="p-6" key={point}>
              <Icon className="h-5 w-5 text-[var(--accent-strong)]" />
              <p className="font-sans mt-4 text-sm leading-7 text-[var(--foreground)]">{point}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
