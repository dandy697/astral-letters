import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { lunarPulse as staticLunarPulse } from "@/lib/demo-content";
import { Moon, MoonStar, Sun, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LunarTracker() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLunarData() {
      try {
        const res = await fetch("/api/lunar-pulse");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch lunar data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLunarData();
  }, []);

  const displayPhases = data?.phases || staticLunarPulse.phases;
  const currentMonth = data?.month || "Avril 2026";

  return (
    <section id="pouls-lunaire" className="section-wrap border-b border-[#e2e8f0] bg-white">
      <div className="container-shell">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-6">{staticLunarPulse.title}</p>
            <h2 className="section-title mb-6">{staticLunarPulse.subtitle}</h2>
            <p className="text-xl text-[#64748b] font-medium leading-relaxed">
              La lune influence nos marées internes. En {currentMonth.toLowerCase()}, suivez son cycle pour ajuster vos initiatives à votre niveau d&apos;énergie naturelle.
            </p>
          </div>
          <div className="hidden lg:block pb-2">
            <div className="flex items-center gap-4 px-6 py-3 bg-[#f1f5f9] rounded-full border border-[#e2e8f0]">
              {loading ? (
                <Loader2 className="h-4 w-4 text-[#4f46e5] animate-spin" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
              )}
              <span className="text-[10px] uppercase tracking-widest font-black text-[#64748b]">
                {loading ? "Synchronisation..." : "Cycle en cours : Lune Croissante"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {displayPhases.map((phase: any, index: number) => (
            <motion.div
              key={phase.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-8 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#4f46e5] transition-all duration-300"
            >
              <div className="mb-10 flex justify-between items-start">
                <div className="h-14 w-14 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-center shadow-sm group-hover:border-[#4f46e5] transition-colors">
                  {index === 0 ? (
                    <Circle className="h-7 w-7 text-black fill-black" />
                  ) : index === 1 ? (
                    <Moon className="h-7 w-7 text-[#4f46e5]" />
                  ) : index === 2 ? (
                    <Circle className="h-7 w-7 text-[#4f46e5] fill-[#4f46e5]" />
                  ) : (
                    <Moon className="h-7 w-7 text-[#64748b] rotate-180" />
                  )}
                </div>
                <span className="text-[10px] font-black text-[#94a3b8] tracking-widest">{phase.date}</span>
              </div>
              
              <h3 className="text-xl font-black mb-3 tracking-tight">{phase.name}</h3>
              <p className="text-sm font-bold text-[#4f46e5] mb-4 uppercase tracking-tighter">
                {phase.impact || (index === 0 ? "Introspection" : index === 1 ? "Action" : index === 2 ? "Visibilité" : "Bilan")}
              </p>
              <div className="h-1 w-full bg-[#e2e8f0] rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: "100%" }}
                   transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                   className="h-full bg-[#4f46e5]" 
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-2xl bg-[#0f172a] text-white flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="max-w-xl">
              <h4 className="text-2xl font-black mb-4 tracking-tighter">Votre météo émotionnelle</h4>
              <p className="text-slate-400 font-medium leading-relaxed">
                Chaque mois, recevez une analyse détaillée de l&apos;impact de ces phases sur votre profil personnel. Ne naviguez plus à l&apos;aveugle.
              </p>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-[#0f172a] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                       {i}
                    </div>
                 ))}
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#4f46e5]">Actif pour</p>
                 <p className="text-xs font-bold text-white uppercase tracking-tighter">12,400+ Utilisateurs</p>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
