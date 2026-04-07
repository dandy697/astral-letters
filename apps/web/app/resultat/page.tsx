import { redirect } from "next/navigation";
import { demoUser } from "@/lib/demo-content";

type ResultPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResultRedirectPage({ searchParams }: ResultPageProps) {
  const params = searchParams ? await searchParams : {};
  const reportId = typeof params.report === "string" && params.report ? params.report : null;

  if (reportId) {
    redirect(`/resultat/${reportId}`);
  }

  // If no report param, redirect to home
  redirect("/");
}
