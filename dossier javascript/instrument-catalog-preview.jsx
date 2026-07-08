import { useState, useEffect, useRef } from "react";

const INSTRUMENTS = [
  { id: 1, name: "Guitare Acoustique", cat: "cordes", emoji: "🎸", pays: "Espagne / Monde", famille: "Chordophone pincé", desc: "Amplifiée naturellement par sa caisse de résonance en bois, la guitare acoustique est l'instrument à cordes le plus répandu dans le monde. Elle couvre du folk aux compositions classiques.", cordes: 6, tessiture: "E2 – E5", difficulte: 2, tags: ["Folk", "Classique", "Pop", "Country"] },
  { id: 2, name: "Guitare Électrique", cat: "cordes", emoji: "🎸", pays: "États-Unis", famille: "Chordophone électrique", desc: "Convertit les vibrations des cordes en signal électrique via des micros magnétiques. Le grain sonore est façonné par l'ampli, les pédales d'effets et le jeu du musicien.", cordes: 6, tessiture: "E2 – E5", difficulte: 3, tags: ["Rock", "Blues", "Metal", "Jazz"] },
  { id: 3, name: "Violon", cat: "cordes", emoji: "🎻", pays: "Italie (XVIe s.)", famille: "Chordophone frotté", desc: "Soprano de la famille des cordes, central à l'orchestre et aux musiques du monde. Joué à l'archet ou en pizzicato, son timbre peut évoquer la voix humaine avec une précision saisissante.", cordes: 4, tessiture: "G3 – A7", difficulte: 5, tags: ["Classique", "Jazz", "Folk", "Orchestre"] },
  { id: 4, name: "Violoncelle", cat: "cordes", emoji: "🎻", pays: "Italie (XVIe s.)", famille: "Chordophone frotté", desc: "Voix ténor–basse de l'orchestre, tenu verticalement entre les genoux. Ses sonorités profondes et chaleureuses occupent une place unique entre la profondeur de la contrebasse et la clarté du violon.", cordes: 4, tessiture: "C2 – C6", difficulte: 5, tags: ["Classique", "Chambre", "Orchestre"] },
  { id: 5, name: "Basse Électrique", cat: "cordes", emoji: "🎸", pays: "États-Unis (1950s)", famille: "Chordophone électrique", desc: "Fondement rythmique et harmonique de tout ensemble moderne. Sa ligne de basse établit le groove et relie la section rythmique aux harmonies des autres instruments.", cordes: 4, tessiture: "E1 – G4", difficulte: 3, tags: ["Rock", "Funk", "Jazz", "Soul"] },
  { id: 6, name: "Ukulélé", cat: "cordes", emoji: "🪕", pays: "Hawaï / Portugal", famille: "Chordophone pincé", desc: "Dérivé de la braguinha portugaise, l'ukulélé à 4 cordes nylon est emblématique de la culture hawaïenne. Son timbre léger et joyeux en fait un instrument accessible et attachant.", cordes: 4, tessiture: "G4 – A5", difficulte: 1, tags: ["Pop", "Folk", "Tropical"] },
  { id: 7, name: "Harpe", cat: "cordes", emoji: "🎵", pays: "Mésopotamie (antiquité)", famille: "Chordophone pincé", desc: "Instrument monumental à 47 cordes et 7 pédales couvrant six octaves et demie. Son registre s'étend du grave profond au suraigu cristallin, en passant par des harmoniques envoûtantes.", cordes: 47, tessiture: "C♭1 – G♯7", difficulte: 5, tags: ["Classique", "Orchestre", "Celtique"] },
  { id: 8, name: "Mandoline", cat: "cordes", emoji: "🪕", pays: "Italie (XVIIIe s.)", famille: "Chordophone pincé", desc: "Huit cordes disposées en quatre paires à l'unisson, jouées au médiator en tremolo rapide. Timbre brillant et résonant, pilier du folk italien, de la musique country et du bluegrass.", cordes: 8, tessiture: "G3 – A6", difficulte: 3, tags: ["Folk", "Bluegrass", "Country"] },
  { id: 9, name: "Batterie", cat: "percussions", emoji: "🥁", pays: "États-Unis (XXe s.)", famille: "Membranophone + Idiophone", desc: "Ensemble de fûts, caisses et cymbales joué avec baguettes, mailloches et pédales. Moteur rythmique de la musique moderne, son vocabulaire couvre du swing jazz au blast beat metal.", cordes: null, tessiture: "Variable", difficulte: 4, tags: ["Rock", "Jazz", "Pop", "Metal"] },
  { id: 10, name: "Djembé", cat: "percussions", emoji: "🪘", pays: "Afrique de l'Ouest", famille: "Membranophone", desc: "Tambour en forme de calice taillé dans du bois dense, recouvert d'une peau de chèvre. Il produit trois sons fondamentaux — basse, ton, claque — et une infinité de nuances entre eux.", cordes: null, tessiture: "—", difficulte: 3, tags: ["Afrique", "Fusion", "Monde"] },
  { id: 11, name: "Cajon", cat: "percussions", emoji: "📦", pays: "Pérou / Espagne", famille: "Idiophone", desc: "Boîte de bois sur laquelle le musicien s'assoit, frappant la face avant de la main. D'origine afro-péruvienne, il est devenu incontournable dans le flamenco et les performances acoustiques.", cordes: null, tessiture: "Variable", difficulte: 2, tags: ["Flamenco", "Acoustique", "Folk"] },
  { id: 12, name: "Marimba", cat: "percussions", emoji: "🎹", pays: "Afrique / Amérique centrale", famille: "Idiophone à lames", desc: "Grand instrument à lames de bois avec résonateurs métalliques sous chaque barre. Son chaleureux et grave, plus doux que le xylophone, lui vaut un répertoire de concert à part entière.", cordes: null, tessiture: "C2 – C7", difficulte: 4, tags: ["Classique", "Latin", "Orchestre"] },
  { id: 13, name: "Congas", cat: "percussions", emoji: "🪘", pays: "Cuba", famille: "Membranophone", desc: "Paire de tambours cylindriques afro-cubains en bois ou fibre. Joués à mains nues avec des techniques variées, ils sont la colonne vertébrale rythmique de la salsa, la rumba et du son.", cordes: null, tessiture: "—", difficulte: 3, tags: ["Latin", "Jazz", "Salsa"] },
  { id: 14, name: "Xylophone", cat: "percussions", emoji: "🎵", pays: "Asie / Afrique", famille: "Idiophone à lames", desc: "Lames de bois frappées à la mailloche. Timbre sec et percussif, plus aigu et brillant que la marimba. Présent dans l'orchestre symphonique, les fanfares et l'éducation musicale.", cordes: null, tessiture: "F4 – C8", difficulte: 3, tags: ["Classique", "Orchestre", "Éducation"] },
  { id: 15, name: "Cymbales", cat: "percussions", emoji: "🔔", pays: "Turquie / Chine (antiquité)", famille: "Idiophone", desc: "Disques d'alliage de bronze produisant des sons complexes, brillants et soutenus. Hi-hat, crash, ride, splash — chaque type de cymale a un rôle précis et un caractère sonore distinct.", cordes: null, tessiture: "Variable", difficulte: 2, tags: ["Rock", "Jazz", "Orchestre"] },
  { id: 16, name: "Tambourin", cat: "percussions", emoji: "🔔", pays: "Moyen-Orient / Europe", famille: "Membranophone", desc: "Cadre circulaire en bois avec cymbalettes métalliques. Peut être frappé, secoué ou frotté. Incontournable dans la musique populaire, le folk méditerranéen et la musique classique.", cordes: null, tessiture: "—", difficulte: 1, tags: ["Folk", "Pop", "Classique"] },
];

const CATS = [
  { key: "tous", label: "Tous", sub: "16 instruments" },
  { key: "cordes", label: "Cordes", sub: "8" },
  { key: "percussions", label: "Percussions", sub: "8" },
];

function DiffBar({ level }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 20, height: 3, borderRadius: 2,
          background: i <= level ? `hsl(${38 - (level-1)*4}, 72%, ${56-(level-1)*4}%)` : "#2C2820",
        }} />
      ))}
    </div>
  );
}

function CatBadge({ cat }) {
  const c = cat === "cordes";
  return (
    <span style={{
      display: "inline-block", fontSize: 9, letterSpacing: "0.18em",
      textTransform: "uppercase", fontFamily: "monospace",
      color: c ? "#6BA5C8" : "#C86880",
      background: c ? "rgba(107,165,200,0.1)" : "rgba(200,104,128,0.1)",
      border: `1px solid ${c ? "rgba(107,165,200,0.25)" : "rgba(200,104,128,0.25)"}`,
      padding: "3px 10px", borderRadius: 20,
    }}>{cat}</span>
  );
}

function InstIcon({ inst }) {
  const c = inst.cat === "cordes";
  return (
    <div style={{
      width: 58, height: 58, borderRadius: 14, flexShrink: 0,
      background: c ? "radial-gradient(circle at 35% 35%, #1E3A4A, #0D1F2A)" : "radial-gradient(circle at 35% 35%, #4A1E2A, #2A0D14)",
      border: `1px solid ${c ? "rgba(107,165,200,0.2)" : "rgba(200,104,128,0.2)"}`,
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
    }}>{inst.emoji}</div>
  );
}

export default function Catalog() {
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    const s = document.createElement("style");
    s.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&family=Space+Mono&display=swap');
      @keyframes stringPulse {
        0%   { transform: scaleY(0); opacity:0; transform-origin:bottom; }
        25%  { transform: scaleY(1); opacity:1; transform-origin:bottom; }
        55%  { transform: scaleY(1) scaleX(2.8); }
        75%  { transform: scaleY(1) scaleX(0.5); }
        100% { transform: scaleY(1) scaleX(1); opacity:1; }
      }
      @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
      @keyframes overlayIn { from{opacity:0} to{opacity:1} }
      @keyframes modalSlide { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:none} }
      .ic { background:#181410; border:1px solid #2C2820; border-radius:14px; padding:20px; cursor:pointer; position:relative; overflow:hidden; transition:border-color .22s,transform .22s,box-shadow .22s; }
      .ic:hover { border-color:#C8963C; transform:translateY(-4px); box-shadow:0 14px 40px rgba(200,150,60,.1); }
      .sl { position:absolute; top:0; left:0; width:2px; height:100%; background:linear-gradient(to bottom,transparent,#C8963C 30%,#C8963C 70%,transparent); transform:scaleY(0); transform-origin:bottom; opacity:0; border-radius:1px; }
      .ic:hover .sl { animation:stringPulse .38s cubic-bezier(.22,.61,.36,1) forwards; }
      .fb { background:none; border:1px solid #2C2820; border-radius:8px; color:#6A6258; font-family:monospace; font-size:11px; letter-spacing:.08em; cursor:pointer; padding:7px 16px; transition:all .18s; }
      .fb:hover,.fb.on { border-color:#C8963C; color:#C8963C; background:rgba(200,150,60,.08); }
      .si { background:#181410; border:1px solid #2C2820; border-radius:8px; color:#F0EDE4; font-size:13px; padding:7px 12px 7px 32px; outline:none; transition:border-color .2s; width:190px; }
      .si:focus { border-color:#C8963C; }
      .si::placeholder { color:#3A3530; }
    `;
    document.head.appendChild(s);
  }, []);

  const visible = INSTRUMENTS.filter(i => {
    const mc = filter === "tous" || i.cat === filter;
    const q = search.toLowerCase().trim();
    const ms = !q || i.name.toLowerCase().includes(q) || i.pays.toLowerCase().includes(q) || i.tags.some(t => t.toLowerCase().includes(q));
    return mc && ms;
  });

  return (
    <div style={{ minHeight:"100vh", background:"#0C0A07", color:"#F0EDE4", fontFamily:"'Lato',sans-serif" }}>

      {/* HERO */}
      <div style={{ padding:"48px 40px 36px", borderBottom:"1px solid #1E1C18", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:40, right:40, height:1, background:"linear-gradient(90deg,transparent,#C8963C 35%,#C8963C 65%,transparent)" }} />
        <div style={{ fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"#C8963C", fontFamily:"monospace", marginBottom:18 }}>
          Catalogue officiel — Instruments de musique
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:20 }}>
          <div>
            <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(30px,5vw,60px)", fontWeight:700, margin:0, lineHeight:1.05, letterSpacing:"-0.01em" }}>
              Cordes &amp;<br/>Percussions
            </h1>
            <p style={{ marginTop:12, color:"#6A6258", fontSize:13, lineHeight:1.7, maxWidth:440 }}>
              16 instruments référencés — de l'acoustique à l'électrique,<br/>du classique au contemporain.
            </p>
          </div>
          <div style={{ display:"flex", gap:28 }}>
            {[["8","Cordes"],["8","Percussions"],["5","Niveaux"]].map(([n,l]) => (
              <div key={l} style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:30, fontWeight:600, color:"#C8963C", lineHeight:1 }}>{n}</div>
                <div style={{ fontSize:10, color:"#4A4540", marginTop:3, fontFamily:"monospace", letterSpacing:".05em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{ padding:"18px 40px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", borderBottom:"1px solid #1A1814" }}>
        {CATS.map(c => (
          <button key={c.key} className={`fb${filter===c.key?" on":""}`} onClick={() => setFilter(c.key)}>
            {c.label} <span style={{ opacity:.5, fontSize:9 }}>{c.sub}</span>
          </button>
        ))}
        <div style={{ marginLeft:"auto", position:"relative" }}>
          <span style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", color:"#3A3530", fontSize:15, pointerEvents:"none" }}>⌕</span>
          <input className="si" placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ padding:"10px 40px 0", fontSize:10, color:"#3A3530", fontFamily:"monospace", letterSpacing:".08em" }}>
        {visible.length} résultat{visible.length!==1?"s":""}
      </div>

      {/* GRID */}
      {visible.length > 0 ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:16, padding:"20px 40px 60px" }}>
          {visible.map((inst,idx) => (
            <div key={inst.id} className="ic" style={{ animationName:"fadeUp", animationDuration:".3s", animationDelay:`${idx*35}ms`, animationFillMode:"both" }}
              onMouseEnter={() => setHovered(inst.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(inst)}
            >
              <div className="sl" />
              <div style={{ display:"flex", gap:12, marginBottom:16 }}>
                <InstIcon inst={inst} />
                <div style={{ flex:1 }}>
                  <CatBadge cat={inst.cat} />
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:16, fontWeight:600, marginTop:6, lineHeight:1.2 }}>{inst.name}</div>
                  <div style={{ fontSize:10, color:"#4A4540", fontFamily:"monospace", marginTop:2 }}>{inst.pays}</div>
                </div>
              </div>
              <p style={{ fontSize:12, lineHeight:1.65, color:"#7A7268", margin:"0 0 16px", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                {inst.desc}
              </p>
              <div style={{ borderTop:"1px solid #1E1C18", paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:9, color:"#3A3530", fontFamily:"monospace", letterSpacing:".18em", textTransform:"uppercase", marginBottom:5 }}>Difficulté</div>
                  <DiffBar level={inst.difficulte} />
                </div>
                {inst.tessiture !== "—" && inst.tessiture !== "Variable" && (
                  <div style={{ fontSize:10, color:"#C8963C", fontFamily:"monospace" }}>{inst.tessiture}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign:"center", padding:"80px 40px", color:"#3A3530" }}>
          <div style={{ fontSize:44, marginBottom:14 }}>𝄽</div>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:18, color:"#4A4540", marginBottom:8 }}>Aucun instrument trouvé</div>
          <div style={{ fontSize:13 }}>Essayez un autre terme de recherche.</div>
        </div>
      )}

      {/* MODAL */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20, animation:"overlayIn .2s ease" }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#181410", border:"1px solid #2C2820", borderRadius:18, width:"100%", maxWidth:560, padding:36, position:"relative", maxHeight:"90vh", overflowY:"auto", animation:"modalSlide .25s cubic-bezier(.22,.61,.36,1)" }}>
            <div style={{ position:"absolute", top:0, left:36, right:36, height:1, background:"linear-gradient(90deg,transparent,#C8963C 50%,transparent)" }} />
            <button onClick={() => setSelected(null)}
              style={{ position:"absolute", top:14, right:14, background:"#0C0A07", border:"1px solid #2C2820", color:"#6A6258", width:30, height:30, borderRadius:8, cursor:"pointer", fontSize:13 }}>✕</button>

            <div style={{ display:"flex", gap:18, alignItems:"flex-start", marginBottom:24 }}>
              <InstIcon inst={selected} />
              <div>
                <CatBadge cat={selected.cat} />
                <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:26, fontWeight:700, margin:"8px 0 4px", lineHeight:1.1 }}>{selected.name}</h2>
                <div style={{ fontSize:11, color:"#4A4540", fontFamily:"monospace" }}>{selected.famille}</div>
              </div>
            </div>

            <p style={{ fontSize:13, lineHeight:1.75, color:"#9A9185", margin:"0 0 24px" }}>{selected.desc}</p>

            <div style={{ display:"grid", gridTemplateColumns: selected.cordes ? "1fr 1fr 1fr" : "1fr 1fr", gap:10, marginBottom:24 }}>
              {[["Origine",selected.pays],["Tessiture",selected.tessiture],...(selected.cordes?[["Cordes",`${selected.cordes}`]]:[])]
                .map(([label,val]) => (
                  <div key={label} style={{ background:"#0C0A07", border:"1px solid #1E1C18", borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:9, color:"#3A3530", fontFamily:"monospace", letterSpacing:".2em", textTransform:"uppercase", marginBottom:5 }}>{label}</div>
                    <div style={{ fontSize:13, color:"#F0EDE4" }}>{val}</div>
                  </div>
                ))}
            </div>

            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:9, color:"#3A3530", fontFamily:"monospace", letterSpacing:".2em", textTransform:"uppercase", marginBottom:8 }}>Difficulté — {selected.difficulte}/5</div>
              <DiffBar level={selected.difficulte} />
            </div>

            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {selected.tags.map(tag => (
                <span key={tag} style={{ fontSize:11, fontFamily:"monospace", color:"#6A6258", background:"#0C0A07", border:"1px solid #2C2820", borderRadius:20, padding:"3px 10px" }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
