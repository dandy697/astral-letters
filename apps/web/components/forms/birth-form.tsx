"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { intakeSchema, type IntakeInput } from "@/lib/schemas";
import { formMicrocopy } from "@/lib/demo-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const fields = [
  { name: "firstName", label: "Prénom", type: "text", placeholder: "Votre prénom" },
  { name: "email", label: "Email", type: "email", placeholder: "votre@email.com" },
  { name: "birthDate", label: "Date de naissance", type: "date", placeholder: "" },
  { name: "birthTime", label: "Heure de naissance", type: "time", placeholder: "" },
  { name: "birthLocation", label: "Lieu de naissance", type: "text", placeholder: "Ville, Pays" },
] as const;

export function BirthForm({ onNameChange }: { onNameChange?: (name: string) => void }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [progressIndex, setProgressIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const form = useForm<IntakeInput>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      firstName: "",
      email: "",
      birthDate: "",
      birthTime: "",
      birthLocation: "",
      consent: true,
    },
  });

  const firstNameValue = form.watch("firstName");

  useEffect(() => {
    onNameChange?.(firstNameValue);
  }, [firstNameValue, onNameChange]);

  useEffect(() => {
    if (!isPending) {
      setProgressIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setProgressIndex((value) => (value + 1) % formMicrocopy.loadingSteps.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [isPending]);

  const onSubmit = (values: IntakeInput) => {
    setServerError(null);
    startTransition(async () => {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error ?? "Erreur lors du calcul. Veuillez réessayer.");
        return;
      }

      if (data.resultUrl) {
        router.push(data.resultUrl);
        return;
      }

      const search = new URLSearchParams({
        firstName: values.firstName,
        sun: data.chart?.luminaries?.sun?.sign ?? "",
        moon: data.chart?.luminaries?.moon?.sign ?? "",
        ascendant: data.chart?.luminaries?.ascendant?.sign ?? "",
        summary: data.summary ?? "",
      });

      router.push(`/resultat?${search.toString()}`);
    });
  };

  return (
    <Card className="rounded-2xl border-[var(--border)] p-8 md:p-12 shadow-lg relative bg-[var(--surface)] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)]" />

      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-[var(--accent)]" />
          <p className="eyebrow">Aperçu gratuit</p>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
          Découvrez votre thème astral
        </h3>
        <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
          Renseignez vos informations de naissance pour recevoir votre première lecture personnalisée.
        </p>
      </div>

      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          {fields.slice(0, 2).map((field) => {
            const error = form.formState.errors[field.name];
            return (
              <div key={field.name} className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-semibold text-[var(--foreground)]"
                >
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  {...form.register(field.name)}
                />
                {error ? (
                  <p className="text-xs text-[var(--danger)] font-medium">
                    {error.message}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {fields.slice(2, 5).map((field) => {
            const error = form.formState.errors[field.name];
            return (
              <div key={field.name} className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-semibold text-[var(--foreground)]"
                >
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  {...form.register(field.name)}
                />
                {error ? (
                  <p className="text-xs text-[var(--danger)] font-medium">
                    {error.message}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <label className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] cursor-pointer hover:border-[var(--primary)] transition-all group">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 accent-[var(--primary)] rounded"
            {...form.register("consent")}
          />
          <span className="text-xs leading-relaxed text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors">
            {formMicrocopy.consent}
          </span>
        </label>

        <Button
          type="submit"
          size="xl"
          className="w-full group"
          disabled={isPending}
        >
          {isPending ? "Calcul en cours…" : "Recevoir mon aperçu gratuit"}
          {!isPending && (
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          )}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]">
        <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
        {formMicrocopy.privacy}
      </div>

      <AnimatePresence>
        {isPending ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--surface)] p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-sm"
            >
              <div className="mb-8 flex justify-center">
                <div className="h-16 w-16 border-3 border-[var(--primary)] animate-spin border-t-transparent rounded-full" />
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={progressIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-lg font-semibold text-[var(--foreground)]"
                >
                  {(() => {
                    const name = form.getValues("firstName") || "vous";
                    const steps = [
                      `Interrogation des éphémérides pour ${name}…`,
                      "Cartographie des 12 maisons de votre ciel…",
                      `Analyse des aspects planétaires majeurs…`,
                      `Finalisation de votre Manuel de Soi, ${name}…`,
                    ];
                    return steps[progressIndex];
                  })()}
                </motion.p>
              </AnimatePresence>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Cela prend quelques secondes…
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {serverError ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-[var(--danger)] text-center font-medium"
        >
          {serverError}
        </motion.div>
      ) : null}
    </Card>
  );
}

export { BirthForm as IntakeForm };
