import { useState } from 'react';
import { Terminal, Shield, Zap, Trophy, Users, Code, Cpu } from 'lucide-react';
import Editor from '@monaco-editor/react';

export function App() {
  const [code, setCode] = useState<string>(
`def tri_rapide(liste):
    """
    Défi : Implémentez le tri rapide (QuickSort)
    Complexité visée : O(n log n)
    """
    if len(liste) <= 1:
        return liste
    pivot = liste[len(liste) // 2]
    gauche = [x for x in liste if x < pivot]
    milieu = [x for x in liste if x == pivot]
    droite = [x for x in liste if x > pivot]
    return tri_rapide(gauche) + milieu + tri_rapide(droite)
`
  );

  return (
    <div className="min-h-screen bg-[#0a0d14] flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-neon-border bg-[#121622]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center neon-glow-cyan">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-wider text-white">
              CODE<span className="text-neon-cyan">QUEST</span>
            </h1>
            <p className="text-xs text-neon-muted font-mono">Dédale d'ORACLE · v1.0</p>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-sm font-mono text-slate-300">
          <a href="#catalogue" className="hover:text-neon-cyan transition-colors flex items-center gap-1.5">
            <Code className="w-4 h-4" /> Défis
          </a>
          <a href="#battle" className="hover:text-neon-magenta transition-colors flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> Battle Royale
          </a>
          <a href="#leaderboard" className="hover:text-neon-cyan transition-colors flex items-center gap-1.5">
            <Trophy className="w-4 h-4" /> Classements
          </a>
          <a href="#teams" className="hover:text-neon-cyan transition-colors flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Équipes
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#0a0d14] border border-neon-border px-3 py-1.5 rounded-full text-xs font-mono">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-semibold">100 / 100 PV</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a0d14] border border-neon-border px-3 py-1.5 rounded-full text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan"></span>
            <span className="text-neon-cyan font-bold">1 250 Bits</span>
          </div>
          <button className="px-4 py-1.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black font-mono text-sm font-semibold transition-all">
            Connexion
          </button>
        </div>
      </header>

      {/* Main Workspace Preview */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Side: Challenge Statement */}
        <section className="col-span-5 bg-neon-card border border-neon-border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
                ALGORITHMIQUE · TRI
              </span>
              <span className="text-xs font-mono text-neon-muted">Difficulté : ★★★☆☆</span>
            </div>
            <h2 className="text-2xl font-bold font-mono text-white mb-2">#01 — Tri Rapide (QuickSort)</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Dans le secteur du Dédale des Tris, une corruption de données désordonne les flux de paquets d'ORACLE.
              Écrivez une fonction efficace capable de trier une liste d'entiers en respectant la complexité minimale.
            </p>

            <div className="bg-[#0a0d14] border border-neon-border rounded-lg p-4 mb-4 text-xs font-mono space-y-2">
              <div className="text-neon-cyan font-semibold">Contraintes de Sandbox :</div>
              <div className="text-slate-400">• Temps CPU optimal (t_opt) : 45 ms</div>
              <div className="text-slate-400">• Limite de temps (t_max) : 400 ms</div>
              <div className="text-slate-400">• Évaluation : Médiane sur 5 exécutions strictes</div>
              <div className="text-slate-400">• Réseau : Désactivé (--net=none)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex-1 py-2.5 bg-neon-magenta hover:bg-neon-magenta/90 text-white font-mono font-bold rounded-lg transition-all shadow-lg shadow-neon-magenta/30 flex items-center justify-center gap-2">
              <Cpu className="w-4 h-4" /> Soumettre le code
            </button>
          </div>
        </section>

        {/* Right Side: Monaco Editor */}
        <section className="col-span-7 bg-neon-card border border-neon-border rounded-xl overflow-hidden flex flex-col">
          <div className="bg-[#161b2a] border-b border-neon-border px-4 py-2 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>solution.py (Python 3.11)</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Sandbox connectée
            </span>
          </div>
          <div className="flex-1 min-h-[460px]">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'Fira Code, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

