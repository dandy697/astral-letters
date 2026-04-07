import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Badge variant="soft">{eyebrow}</Badge>
      <h2 className="section-title mt-5">{title}</h2>
      {description ? <p className="section-copy mt-5">{description}</p> : null}
    </div>
  );
}
