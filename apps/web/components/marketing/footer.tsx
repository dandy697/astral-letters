import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="container-shell py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <span className="text-white text-sm font-bold">✦</span>
              </div>
              <span className="text-lg font-bold tracking-tight">Astral Letters</span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-sm">
              Votre thème astral, calculé à partir de données réelles et transformé en lecture claire, personnelle et utile.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
              Navigation
            </p>
            <nav className="flex flex-col gap-2">
              <Link href="/#ce-que-vous-recevez" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Ce que vous recevez
              </Link>
              <Link href="/#comment-ca-marche" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Comment ça marche
              </Link>
              <Link href="/tarifs" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Tarifs
              </Link>
              <Link href="/#faq" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
              Légal
            </p>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Mentions légales
              </Link>
              <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                CGU / CGV
              </Link>
              <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Politique de confidentialité
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} Astral Letters. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
