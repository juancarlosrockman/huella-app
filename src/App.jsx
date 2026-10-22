import { useState } from "react";
import { Heart, Home, BookOpen, UserRound, Flame, LockKeyhole, Check, Menu } from "lucide-react";

const SLOGAN = "Pequeñas acciones. Grandes huellas.";

export default function App() {
  const [view, setView] = useState("inicio");
  const [action, setAction] = useState("");
  const [saved, setSaved] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-mark" aria-hidden="true"><Heart size={25} strokeWidth={2.7}/><span className="foot">●</span></div>
      <div className="brand-copy"><strong>HUELLA</strong><span>{SLOGAN}</span></div>
      <button className="icon-button" aria-label="Acerca de HUELLA" onClick={() => setShowAbout(!showAbout)}><Menu/></button>
    </header>
    {showAbout && <section className="about panel"><strong>El cambio empieza por nosotros.</strong><p>HUELLA busca animarnos a hacer pequeñas cosas buenas por los demás, sin competir ni juzgar.</p><button className="text-button" onClick={() => setShowAbout(false)}>Cerrar</button></section>}
    <main>
      {view === "inicio" && <>
        <section className="welcome"><span className="eyebrow">UN GESTO A LA VEZ</span><h1>El cambio empieza<br/>por nosotros.</h1><p>Cada pequeño gesto cuenta.</p></section>
        <section className="panel action-panel">
          <label htmlFor="action">¿Qué buena acción hiciste?</label>
          <textarea id="action" maxLength={250} value={action} onChange={e => {setAction(e.target.value); setSaved(false);}} placeholder="Escribe ese pequeño gesto..."/>
          <div className="input-meta"><span>{action.length}/250</span><span>Tu bitácora es privada</span></div>
          <button className="primary-button" disabled={!action.trim()} onClick={() => {setSaved(true); setAction("");}}>Guardar en mi camino <Heart size={18}/></button>
          {saved && <p className="success"><Check size={17}/> ¡Gracias por dejar tu huella! Cada pequeño gesto cuenta.</p>}
          <p className="privacy-note"><LockKeyhole size={14}/> Vista previa: todavía no guarda datos en una cuenta.</p>
        </section>
        <section className="counter panel"><div className="section-kicker"><Flame size={18}/> ENTRE TODOS</div><h2>Una comunidad que deja huella</h2><p>Pronto veremos aquí las buenas acciones compartidas por la comunidad.</p><span className="preview-label">Contador comunitario pendiente de conectar a datos reales</span></section>
      </>}
      {view === "testimonios" && <section className="panel content-panel"><span className="eyebrow">COMUNIDAD</span><h1>Testimonios</h1><p>Historias anónimas que inspiran, revisadas antes de publicarse.</p><div className="empty-state"><Heart size={28}/><strong>Estamos preparando este espacio</strong><span>Los testimonios no se publicarán hasta tener moderación real.</span></div></section>}
      {view === "camino" && <section className="panel content-panel"><span className="eyebrow">TU ESPACIO PRIVADO</span><h1>Mi camino</h1><p>Tu bitácora será privada, cronológica y sin puntuaciones ni competencia.</p><div className="empty-state"><BookOpen size={28}/><strong>Tu bitácora estará aquí</strong><span>El guardado seguro requiere configurar autenticación y base de datos.</span></div></section>}
      {view === "perfil" && <section className="panel content-panel"><span className="eyebrow">CONFIGURACIÓN</span><h1>Perfil y privacidad</h1><p>HUELLA será gratuita y no venderá tus datos ni tendrá perfiles públicos.</p><div className="setting-row"><LockKeyhole/><div><strong>Privacidad primero</strong><span>Autenticación, exportación y eliminación de cuenta deben implementarse antes del lanzamiento público.</span></div></div><div className="setting-row"><Heart/><div><strong>Modo general y modo católico</strong><span>La experiencia católica será opcional y el cambio será irreversible según lo acordado.</span></div></div></section>}
    </main>
    <nav className="bottom-nav" aria-label="Navegación principal">
      <button className={view==="inicio"?"active":""} onClick={()=>setView("inicio")}><Home/><span>Inicio</span></button>
      <button className={view==="testimonios"?"active":""} onClick={()=>setView("testimonios")}><Heart/><span>Testimonios</span></button>
      <button className={view==="camino"?"active":""} onClick={()=>setView("camino")}><BookOpen/><span>Mi camino</span></button>
      <button className={view==="perfil"?"active":""} onClick={()=>setView("perfil")}><UserRound/><span>Perfil</span></button>
    </nav>
    <footer>HUELLA <span>·</span> {SLOGAN}</footer>
  </div>;
}