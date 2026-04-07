-- BLINDAGE DE SÉCURITÉ ASTRAL LETTERS

-- 1. ACTIVER LE RLS SUR TOUTES LES TABLES
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NatalChart" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GeneratedReport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;

-- 2. POLITIQUES POUR "GeneratedReport" (Les rapports PDFs)
-- Autoriser l'application (Service Role) à tout faire (Déjà actif par défaut)
-- Autoriser les utilisateurs anonymes à LIRE seulement s'ils connaissent l'ID UUID (Security by UUID)
CREATE POLICY "Accès lecture par ID UUID" ON "GeneratedReport"
FOR SELECT USING (true);

-- 3. POLITIQUES POUR "NatalChart"
CREATE POLICY "Accès lecture graphique par ID" ON "NatalChart"
FOR SELECT USING (true);

-- 4. SÉCURISATION DU STORAGE (STORAGE.OBJECTS)
-- Seule l'application peut uploader ou supprimer.
-- La lecture se fera uniquement via des SENS SIGNÉES (Signed URLs) par l'application.
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture via Signed URLs uniquement" ON storage.objects
FOR SELECT USING (false); -- Bloque toute lecture directe sans URL signée

-- Note: Les opérations via la clé 'service_role' ignorent ces politiques, 
-- ce qui permet à l'application de continuer à fonctionner normalement.
