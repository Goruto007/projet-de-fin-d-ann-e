import { useState, useEffect, useRef } from "react";

const INSTRUMENTS = [
  // ── CORDES ──────────────────────────────────────────────────────────────────
  {
    id: 1, name: "Guitare Acoustique", cat: "cordes", emoji: "🎸",
    pays: "Espagne / Monde", famille: "Chordophone pincé",
    desc: "Amplifiée naturellement par sa caisse de résonance en bois, la guitare acoustique est l'instrument à cordes le plus répandu dans le monde. Elle couvre du folk aux compositions classiques.",
    cordes: 6, tessiture: "E2 – E5", difficulte: 2,
    tags: ["Folk", "Classique", "Pop", "Country"],
  },
  {
    id: 2, name: "Guitare Électrique", cat: "cordes", emoji: "🎸",
    pays: "États-Unis", famille: "Chordophone électrique",
    desc: "Convertit les vibrations des cordes en signal électrique via des micros magnétiques. Le grain sonore est façonné par l'ampli, les pédales d'effets et le jeu du musicien.",
    cordes: 6, tessiture: "E2 – E5", difficulte: 3,
    tags: ["Rock", "Blues", "Metal", "Jazz"],
  },
  {
    id: 3, name: "Violon", cat: "cordes", emoji: "🎻",
    pays: "Italie (XVIe s.)", famille: "Chordophone frotté",
    desc: "Soprano de la famille des cordes, central à l'orchestre et aux musiques du monde. Joué à l'archet ou en pizzicato, son timbre peut évoquer la voix humaine avec une précision saisissante.",
    cordes: 4, tessiture: "G3 – A7", difficulte: 5,
    tags: ["Classique", "Jazz", "Folk", "Orchestre"],
  },
  {
    id: 4, name: "Violoncelle", cat: "cordes", emoji: "🎻",
    pays: "Italie (XVIe s.)", famille: "Chordophone frotté",
    desc: "Voix ténor–basse de l'orchestre, tenu verticalement entre les genoux. Ses sonorités profondes et chaleureuses occupent une place unique entre la profondeur de la contrebasse et la clarté du violon.",
    cordes: 4, tessiture: "C2 – C6", difficulte: 5,
    tags: ["Classique", "Chambre", "Orchestre"],
  },
  {
    id: 5, name: "Basse Électrique", cat: "cordes", emoji: "🎸",
    pays: "États-Unis (1950s)", famille: "Chordophone électrique",
    desc: "Fondement rythmique et harmonique de tout ensemble moderne. Sa ligne de basse établit le groove et relie la section rythmique aux harmonies des autres instruments.",
    cordes: 4, tessiture: "E1 – G4", difficulte: 3,
    tags: ["Rock", "Funk", "Jazz", "Soul"],
  },
  {
    id: 6, name: "Ukulélé", cat: "cordes", emoji: "🪕",
    pays: "Hawaï / Portugal", famille: "Chordophone pincé",
    desc: "Dérivé de la braguinha portugaise, l'ukulélé à 4 cordes nylon est emblématique de la culture hawaïenne. Son timbre léger et joyeux en fait un instrument accessible et attachant.",
    cordes: 4, tessiture: "G4 – A5", difficulte: 1,
    tags: ["Pop", "Folk", "Tropical"],
  },
  {
    id: 7, name: "Harpe", cat: "cordes", emoji: "🎵",
    pays: "Mésopotamie (antiquité)", famille: "Chordophone pincé",
    desc: "Instrument monumental à 47 cordes et 7 pédales couvrant six octaves et demie. Son registre s'étend du grave profond au suraigu cristallin, en passant par des harmoniques envoûtantes.",
    cordes: 47, tessiture: "C♭1 – G♯7", difficulte: 5,
    tags: ["Classique", "Orchestre", "Celtique"],
  },
  {
    id: 8, name: "Mandoline", cat: "cordes", emoji: "🪕",
    pays: "Italie (XVIIIe s.)", famille: "Chordophone pincé",
    desc: "Huit cordes disposées en quatre paires à l'unisson, jouées au médiator en tremolo rapide. Timbre brillant et résonant, pilier du folk italien, de la musique country et du bluegrass.",
    cordes: 8, tessiture: "G3 – A6", difficulte: 3,
    tags: ["Folk", "Bluegrass", "Country"],
  },
  // ── PERCUSSIONS ─────────────────────────────────────────────────────────────
  {
    id: 9, name: "Batterie", cat: "percussions", emoji: "🥁",
    pays: "États-Unis (XXe s.)", famille: "Membranophone + Idiophone",
    desc: "Ensemble de fûts, caisses et cymbales joué avec baguettes, mailloches et pédales. Moteur rythmique de la musique moderne, son vocabulaire couvre du swing jazz au blast beat metal.",
    cordes: null, tessiture: "Variable", difficulte: 4,
    tags: ["Rock", "Jazz", "Pop", "Metal"],
  },
  {
    id: 10, name: "Djembé", cat: "percussions", emoji: "🪘",
    pays: "Afrique de l'Ouest", famille: "Membranophone",
    desc: "Tambour en forme de calice taillé dans du bois dense, recouvert d'une peau de chèvre. Il produit trois sons fondamentaux — basse, ton, claque — et une infinité de nuances entre eux.",
    cordes: null, tessiture: "—", difficulte: 3,
    tags: ["Afrique", "Fusion", "Monde"],
  },
  {
    id: 11, name: "Cajon", cat: "percussions", emoji: "📦",
    pays: "Pérou / Espagne", famille: "Idiophone",
    desc: "Boîte de bois sur laquelle le musicien s'assoit, frappant la face avant de la main. D'origine afro-péruvienne, il est devenu incontournable dans le flamenco et les performances acoustiques intimistes.",
    cordes: null, tessiture: "Variable", difficulte: 2,
    tags: ["Flamenco", "Acoustique", "Folk"],
  },
  {
    id: 12, name: "Marimba", cat: "percussions", emoji: "🎹",
    pays: "Afrique / Amérique centrale", famille: "Idiophone à lames",
    desc: "Grand instrument à lames de bois avec résonateurs métalliques sous chaque barre. Son chaleureux et grave, plus doux que le xylophone, lui vaut un répertoire de concert à part entière.",
    cordes: null, tessiture: "C2 – C7", difficulte: 4,
    tags: ["Classique", "Latin", "Orchestre"],
  },
  {
    id: 13, name: "Congas", cat: "percussions", emoji: "🪘",
    pays: "Cuba", famille: "Membranophone",
    desc: "Paire de tambours cylindriques afro-cubains en bois ou fibre. Joués à mains nues avec des techniques variées, ils sont la colonne vertébrale rythmique de la salsa, la rumba et du son.",
    cordes: null, tessiture: "—", difficulte: 3,
    tags: ["Latin", "Jazz", "Salsa"],
  },
  {
    id: 14, name: "Xylophone", cat: "percussions", emoji: "🎵",
    pays: "Asie / Afrique", famille: "Idiophone à lames",
    desc: "Lames de bois frappées à la mailloche. Timbre sec et percussif, plus aigu et brillant que la marimba. Présent dans l'orchestre symphonique, les fanfares et l'éducation musicale.",
    cordes: null, tessiture: "F4 – C8", difficulte: 3,
    tags: ["Classique", "Orchestre", "Éducation"],
  },
  {
    id: 15, name: "Cymbales", cat: "percussions", emoji: "🔔",
    pays: "Turquie / Chine (antiquité)", famille: "Idiophone",
    desc: "Disques d'alliage de bronze produisant des sons complexes, brillants et soutenus. Hi-hat, crash, ride, splash — chaque type de cymale a un rôle précis et un caractère sonore distinct.",
    cordes: null, tessiture: "Variable", difficulte: 2,
    tags: ["Rock", "Jazz", "Orchestre"],
  },
  {
    id: 16, name: "Tambourin", cat: "percussions", emoji: "🔔",
    pays: "Moyen-Orient / Europe", famille: "Membranophone",
    desc: "Cadre circulaire en bois avec cymbalettes métalliques (jingles). Peut être frappé, secoué ou frotté. Incontournable dans la musique populaire, le folk méditerranéen et la musique classique.",
    cordes: null, tessiture: "—", difficulte: 1,
    tags: ["Folk", "Pop", "Classique"],
  },
];

const CATS = [
  { key: "tous", label: "Tous", sub: "instruments" },
  { key: "cordes", label: "Cordes", sub: "8 instruments" },
  { key: "percussions", label: "Percussions", sub: "8 instruments" },
];

function DiffBar({ level }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 20, height: 3, borderRadius: 2,
            background: i <= level
              ? `hsl(${38 - (level - 1) * 4}, 72%, ${56 - (level - 1) * 4}%)`
              : "#2C2820",
            transition: "background 0.2s",
          }}
        />
      ))}
    </div>
  );
}

function CatBadge({ cat }) {
  const isCordes = cat === "cordes";
  return (
    <span style={{
      display: "inline-block",
      fontSize: 9,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      fontFamily: "'Space Mono', monospace",
      color: isCordes ? "#6BA5C8" : "#C86880",
      background: isCordes ? "rgba(107,165,200,0.1)" : "rgba(200,104,128,0.1)",
      border: `1px solid ${isCordes ? "rgba(107,165,200,0.25)" : "rgba(200,104,128,0.25)"}`,
      padding: "3px 10px",
      borderRadius: 20,
    }}>
      {cat}
    </span>
  );
}

function InstrumentIcon({ inst }) {
  const isCordes = inst.cat === "cordes";
  return (
    <div style={{
      width: 64, height: 64, borderRadius: 16,
      background: isCordes
        ? "radial-gradient(circle at 35% 35%, #1E3A4A, #0D1F2A)"
        : "radial-gradient(circle at 35% 35%, #4A1E2A, #2A0D14)",
      border: `1px solid ${isCordes ? "rgba(107,165,200,0.2)" : "rgba(200,104,128,0.2)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 30, flexShrink: 0,
    }}>
      {inst.emoji}
    </div>
  );
}

export default function InstrumentCatalog() {
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const styleRef = useRef(null);

  useEffect(() => {
    if (styleRef.current) return;
    const tag = document.createElement("style");
    tag.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&family=Space+Mono&display=swap');
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #0C0A07; }
      ::-webkit-scrollbar-thumb { background: #2C2820; border-radius: 3px; }
      @keyframes stringPulse {
        0%   { transform: scaleY(0); opacity: 0; transform-origin: bottom; }
        30%  { transform: scaleY(1); opacity: 1; }
        60%  { transform: scaleX(2.5) scaleY(1); }
        80%  { transform: scaleX(0.6) scaleY(1); }
        100% { transform: scaleX(1) scaleY(1); opacity: 1; }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes overlayIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes modalIn {
        from { opacity: 0; transform: translateY(20px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      .inst-card {
        background: #181410;
        border: 1px solid #2C2820;
        border-radius: 14px;
        padding: 22px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
        animation: fadeInUp 0.35s ease both;
      }
      .inst-card:hover {
        border-color: #C8963C;
        transform: translateY(-4px);
        box-shadow: 0 16px 48px rgba(200, 150, 60, 0.1);
      }
      .inst-card .string-line {
        position: absolute;
        top: 0; left: 0;
        width: 2px; height: 100%;
        background: linear-gradient(to bottom, transparent, #C8963C 30%, #C8963C 70%, transparent);
        transform: scaleY(0);
        transform-origin: bottom;
        opacity: 0;
        transition: none;
        border-radius: 1px;
      }
      .inst-card:hover .string-line {
        animation: stringPulse 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
      }
      .tag-pill {
        display: inline-block;
        font-size: 11px;
        font-family: 'Space Mono', monospace;
        color: #6A6258;
        background: #0C0A07;
        border: 1px solid #2C2820;
        border-radius: 20px;
        padding: 3px 10px;
      }
      .filter-btn {
        background: none;
        border: 1px solid #2C2820;
        border-radius: 8px;
        color: #6A6258;
        font-family: 'Space Mono', monospace;
        font-size: 12px;
        letter-spacing: 0.08em;
        cursor: pointer;
        padding: 8px 20px;
        transition: all 0.2s;
      }
      .filter-btn:hover { border-color: #C8963C; color: #C8963C; }
      .filter-btn.active {
        background: rgba(200, 150, 60, 0.1);
        border-color: #C8963C;
        color: #C8963C;
      }
      .search-input {
        background: #181410;
        border: 1px solid #2C2820;
        border-radius: 8px;
        color: #F0EDE4;
        font-family: 'Lato', sans-serif;
        font-size: 13px;
        padding: 8px 14px 8px 36px;
        outline: none;
        transition: border-color 0.2s;
        width: 200px;
      }
      .search-input:focus { border-color: #C8963C; }
      .search-input::placeholder { color: #3A3530; }
    `;
    document.head.appendChild(tag);
    styleRef.current = tag;
  }, []);

  const visible = INSTRUMENTS.filter((i) => {
    const matchCat = filter === "tous" || i.cat === filter;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      i.name.toLowerCase().includes(q) ||
      i.pays.toLowerCase().includes(q) ||
      i.famille.toLowerCase().includes(q) ||
      i.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0C0A07", color: "#F0EDE4", fontFamily: "'Lato', sans-serif" }}>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <div style={{
        padding: "52px 48px 40px",
        borderBottom: "1px solid #1E1C18",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 48, right: 48, height: 1,
          background: "linear-gradient(90deg, transparent, #C8963C 30%, #C8963C 70%, transparent)",
        }} />

        <div style={{
          fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase",
          color: "#C8963C", fontFamily: "'Space Mono', monospace", marginBottom: 20,
        }}>
          Catalogue officiel — Instruments de musique
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <h1 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(36px, 5.5vw, 72px)",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}>
              Cordes &amp;<br />Percussions
            </h1>
            <p style={{ marginTop: 14, color: "#6A6258", fontSize: 14, lineHeight: 1.7, maxWidth: 480 }}>
              16 instruments référencés — de l'acoustique à l'électrique,<br />
              du classique au contemporain.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32 }}>
            {[
              { n: "8", label: "Instruments à cordes" },
              { n: "8", label: "Percussions" },
              { n: "5", label: "Niveaux de difficulté" },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 36, fontWeight: 600,
                  color: "#C8963C", lineHeight: 1,
                }}>
                  {n}
                </div>
                <div style={{ fontSize: 11, color: "#4A4540", marginTop: 4, fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTROLS ───────────────────────────────────────────────── */}
      <div style={{
        padding: "20px 48px",
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        borderBottom: "1px solid #1A1814",
      }}>
        {CATS.map((c) => (
          <button
            key={c.key}
            className={`filter-btn${filter === c.key ? " active" : ""}`}
            onClick={() => setFilter(c.key)}
          >
            {c.label}
            <span style={{ marginLeft: 8, opacity: 0.5, fontSize: 10 }}>{c.sub}</span>
          </button>
        ))}

        <div style={{ marginLeft: "auto", position: "relative" }}>
          <span style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            color: "#3A3530", fontSize: 14, pointerEvents: "none",
          }}>
            ⌕
          </span>
          <input
            className="search-input"
            placeholder="Rechercher un instrument…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Result count */}
      <div style={{
        padding: "12px 48px 0",
        fontSize: 11, color: "#3A3530",
        fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em",
      }}>
        {visible.length} résultat{visible.length !== 1 ? "s" : ""}
      </div>

      {/* ── GRID ───────────────────────────────────────────────────── */}
      {visible.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: 18,
          padding: "24px 48px 64px",
        }}>
          {visible.map((inst, idx) => (
            <div
              key={inst.id}
              className="inst-card"
              style={{ animationDelay: `${idx * 40}ms` }}
              onMouseEnter={() => setHovered(inst.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(inst)}
            >
              <div className="string-line" />

              {/* Card header */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
                <InstrumentIcon inst={inst} />
                <div style={{ flex: 1 }}>
                  <CatBadge cat={inst.cat} />
                  <div style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 17, fontWeight: 600,
                    marginTop: 7, lineHeight: 1.2,
                  }}>
                    {inst.name}
                  </div>
                  <div style={{
                    fontSize: 11, color: "#4A4540",
                    fontFamily: "'Space Mono', monospace",
                    marginTop: 3, letterSpacing: "0.03em",
                  }}>
                    {inst.pays}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: 13, lineHeight: 1.65, color: "#7A7268",
                margin: 0, marginBottom: 18,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {inst.desc}
              </p>

              {/* Divider */}
              <div style={{ borderTop: "1px solid #1E1C18", paddingTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{
                      fontSize: 9, color: "#3A3530",
                      fontFamily: "'Space Mono', monospace",
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      marginBottom: 6,
                    }}>
                      Difficulté
                    </div>
                    <DiffBar level={inst.difficulte} />
                  </div>
                  {inst.tessiture !== "—" && inst.tessiture !== "Variable" && (
                    <div style={{
                      fontSize: 11, color: "#C8963C",
                      fontFamily: "'Space Mono', monospace",
                      letterSpacing: "0.04em",
                    }}>
                      {inst.tessiture}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 40px", color: "#3A3530" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>𝄽</div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, marginBottom: 8, color: "#4A4540" }}>
            Aucun instrument trouvé
          </div>
          <div style={{ fontSize: 13 }}>Essayez un autre terme de recherche.</div>
        </div>
      )}

      {/* ── MODAL ──────────────────────────────────────────────────── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200, padding: 24,
            animation: "overlayIn 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#181410",
              border: "1px solid #2C2820",
              borderRadius: 18,
              width: "100%", maxWidth: 580,
              padding: 40,
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
              animation: "modalIn 0.25s cubic-bezier(0.22, 0.61, 0.36, 1)",
            }}
          >
            {/* Top accent */}
            <div style={{
              position: "absolute", top: 0, left: 40, right: 40, height: 1,
              background: "linear-gradient(90deg, transparent, #C8963C 50%, transparent)",
              borderRadius: 1,
            }} />

            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "#0C0A07", border: "1px solid #2C2820",
                color: "#6A6258", width: 32, height: 32,
                borderRadius: 8, cursor: "pointer", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C8963C"; e.currentTarget.style.color = "#C8963C"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2C2820"; e.currentTarget.style.color = "#6A6258"; }}
            >
              ✕
            </button>

            {/* Modal header */}
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 28 }}>
              <InstrumentIcon inst={selected} />
              <div>
                <CatBadge cat={selected.cat} />
                <h2 style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 28, fontWeight: 700,
                  margin: "8px 0 4px", lineHeight: 1.1,
                }}>
                  {selected.name}
                </h2>
                <div style={{ fontSize: 12, color: "#4A4540", fontFamily: "'Space Mono', monospace" }}>
                  {selected.famille}
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: 14, lineHeight: 1.75, color: "#9A9185",
              margin: 0, marginBottom: 28,
            }}>
              {selected.desc}
            </p>

            {/* Info grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: selected.cordes ? "1fr 1fr 1fr" : "1fr 1fr",
              gap: 12, marginBottom: 28,
            }}>
              {[
                ["Origine", selected.pays],
                ["Tessiture", selected.tessiture],
                ...(selected.cordes ? [["Cordes", `${selected.cordes} cordes`]] : []),
              ].map(([label, val]) => (
                <div key={label} style={{
                  background: "#0C0A07",
                  border: "1px solid #1E1C18",
                  borderRadius: 10, padding: "14px 16px",
                }}>
                  <div style={{
                    fontSize: 9, color: "#3A3530",
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    marginBottom: 6,
                  }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 14, color: "#F0EDE4", fontWeight: 400 }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 9, color: "#3A3530",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.2em", textTransform: "uppercase",
                marginBottom: 10,
              }}>
                Niveau de difficulté — {selected.difficulte}/5
              </div>
              <DiffBar level={selected.difficulte} />
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selected.tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
