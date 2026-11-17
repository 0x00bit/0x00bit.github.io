/* ---------- typewriter (original) ---------- */
function typeWriterEffect(elementId, text, delay = 100, loop = false) {
    let index = 0;
    const element = document.getElementById(elementId);

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, delay);
        } else if (loop) {
            setTimeout(() => {
                element.innerHTML = "";
                index = 0;
                type();
            }, 2000);
        }
    }
    type();
}
typeWriterEffect("present-day", "Present Day, Present Time...", 100, true);

/* ---------- translations (static dictionary, no external service) ---------- */
const I18N = {
  en: { lang:"Language", nav_articles:"Articles", nav_writeups:"Write-ups", nav_programming:"Programming",
        nav_projects:"Projects", nav_contact:"Contact", 
        open:"Open", close:"[ CLOSE BOX ]", plate:"COLLECTION", linkedin:"My LinkedIn",
        kernel:"The Linux Kernel Archives", point:"Point at a slide...", soon:"Coming soon...",
        p1:"A small web server written in C.", p2:"A simple web shell.", p3:"My first kernel." },
  pt: { lang:"Idioma", nav_articles:"Artigos", nav_writeups:"Write-ups", nav_programming:"Programação",
        nav_projects:"Projetos", nav_contact:"Contato", 
        open:"Abrir", close:"[ FECHAR CAIXA ]", plate:"COLEÇÃO", linkedin:"Meu LinkedIn",
        kernel:"Os Arquivos do Kernel Linux", point:"Aponte para uma lâmina...", soon:"Em breve...",
        p1:"Um pequeno servidor web escrito em C.", p2:"Uma web shell simples.", p3:"Meu primeiro kernel." },
  es: { lang:"Idioma", nav_articles:"Artículos", nav_writeups:"Write-ups", nav_programming:"Programación",
        nav_projects:"Proyectos", nav_contact:"Contacto", 
        open:"Abrir", close:"[ CERRAR CAJA ]", plate:"COLECCIÓN", linkedin:"Mi LinkedIn",
        kernel:"Los Archivos del Kernel de Linux", point:"Apunta a una lámina...", soon:"Próximamente...",
        p1:"Un pequeño servidor web escrito en C.", p2:"Una web shell sencilla.", p3:"Mi primer kernel." },
  fr: { lang:"Langue", nav_articles:"Articles", nav_writeups:"Write-ups", nav_programming:"Programmation",
        nav_projects:"Projets", nav_contact:"Contact", 
        open:"Ouvrir", close:"[ FERMER LA BOÎTE ]", plate:"COLLECTION", linkedin:"Mon LinkedIn",
        kernel:"Les Archives du noyau Linux", point:"Pointez une lame...", soon:"Bientôt...",
        p1:"Un petit serveur web écrit en C.", p2:"Un web shell simple.", p3:"Mon premier noyau." },
  ru: { lang:"Язык", nav_articles:"Статьи", nav_writeups:"Write-ups", nav_programming:"Программирование",
        nav_projects:"Проекты", nav_contact:"Контакты", 
        open:"Открыть", close:"[ ЗАКРЫТЬ КОРОБКУ ]", plate:"КОЛЛЕКЦИЯ", linkedin:"Мой LinkedIn",
        kernel:"Архивы ядра Linux", point:"Наведите на стекло...", soon:"Скоро...",
        p1:"Небольшой веб-сервер на C.", p2:"Простой веб-шелл.", p3:"Моё первое ядро." }
};
let LANG = "en";
const t = k => (I18N[LANG] && I18N[LANG][k]) || I18N.en[k] || k;

function applyLang(l, save) {
  if (!I18N[l]) l = "en";
  LANG = l;
  document.documentElement.lang = l;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.getElementById("plate").textContent = t("plate");
  document.querySelectorAll(".gbtn[data-lang]").forEach(b =>
    b.setAttribute("aria-pressed", b.dataset.lang === l ? "true" : "false"));
  SLIDES.forEach((s, i) => fillRow(i));
  renderList();
  showReader(-1);
  cowRun(false);
  if (save) { try { localStorage.setItem("lang", l); } catch (e) {} }
}
function detectLang() {
  try { const s = localStorage.getItem("lang"); if (s && I18N[s]) return s; } catch (e) {}
  const prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
  for (const p of prefs) { const c = p.slice(0, 2).toLowerCase(); if (I18N[c]) return c; }
  return "en";
}

/* ---------- panel clock ---------- */
function tick() {
  const d = new Date(), p = n => String(n).padStart(2, "0");
  document.getElementById("clock").textContent =
    d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
}
tick(); setInterval(tick, 1000);

/* ---------- cowsay.sh ---------- */
const COW = {
  en:["Moo. You found my corner of the net.","Have you tried turning it off and on again?","sudo make me a sandwich","Let's all love Lain."],
  pt:["Muu. Você achou meu cantinho da rede.","Já tentou desligar e ligar de novo?","sudo make me a sandwich","Vamos todos amar a Lain."],
  es:["Muu. Encontraste mi rincón de la red.","¿Has probado a apagarlo y encenderlo otra vez?","sudo make me a sandwich","Amemos todos a Lain."],
  fr:["Meuh. Tu as trouvé mon coin du net.","Tu as essayé de l'éteindre et de le rallumer ?","sudo make me a sandwich","Aimons tous Lain."],
  ru:["Муу. Ты нашёл мой уголок сети.","Пробовал выключить и включить снова?","sudo make me a sandwich","Давайте все любить Лэйн."]
};
let cowIdx = 0;
function wrapText(str, w) {
  const out = []; let line = "";
  str.split(" ").forEach(word => {
    if (line && (line + " " + word).length > w) { out.push(line); line = word; }
    else line = line ? line + " " + word : word;
  });
  if (line) out.push(line);
  return out;
}
function cowsay(msg) {
  const lines = wrapText(msg, 26), w = Math.max(...lines.map(l => l.length));
  let b = " " + "_".repeat(w + 2) + "\n";
  if (lines.length === 1) b += "< " + lines[0] + " >\n";
  else lines.forEach((l, i) => {
    const [L, R] = i === 0 ? ["/", "\\"] : i === lines.length - 1 ? ["\\", "/"] : ["|", "|"];
    b += L + " " + l + " ".repeat(w - l.length) + " " + R + "\n";
  });
  b += " " + "-".repeat(w + 2) + "\n";
  b += "        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||";
  return b;
}
function cowRun(next) {
  const list = COW[LANG] || COW.en;
  if (next) cowIdx = (cowIdx + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length;
  document.getElementById("cow").textContent = cowsay(list[cowIdx % list.length]);
}
document.getElementById("cowbtn").addEventListener("click", () => cowRun(true));
cowIdx = Math.floor(Math.random() * 4);

/* ---------- quote typed in a terminal, cursor keeps blinking ---------- */
(function () {
  const text = "\u201CIntelligence is the ability to avoid doing work, yet getting the work done.\u201D \u2015 Linus Torvalds";
  const el = document.getElementById("quote");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let started = false;
  function start() {
    if (started) return; started = true;
    if (reduce) { el.textContent = text; return; }
    let i = 0;
    (function step() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(step, 55 + Math.random() * 60);
    })();
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { start(); o.disconnect(); } }, { threshold: .4 })
      .observe(document.getElementById("term"));
  } else start();
})();

/* ---------- project vault ---------- */
/* ============ EDIT YOUR SLIDES HERE ============
   title : short name shown on the side label
   text  : i18n key (see I18N above) or plain text
   url   : page the visitor is sent to when clicking
   target: "_self" (same tab) or "_blank" (new tab)   */
const SLIDES = [
  { title:"C-web-server",    text:"p1", url:"https://github.com/0x00bit/C-web-server",    target:"_blank" },
  { title:"simple-webshell", text:"p2", url:"https://github.com/0x00bit/simple-webshell", target:"_blank" },
  { title:"FirstKernel",     text:"p3", url:"https://github.com/0x00bit/FirstKernel",     target:"_blank" },
  { title:"Doom in a Router", text:"p4", url:"https://github.com/0x00bit/Doom-Router",  target:"_self" },
  { title:"Slide 05", text:"soon", url:"https://example.com/5",  target:"_self" },
  { title:"Slide 06", text:"soon", url:"https://example.com/6",  target:"_self" },
  { title:"Slide 07", text:"soon", url:"https://example.com/7",  target:"_self" },
  { title:"Slide 08", text:"soon", url:"https://example.com/8",  target:"_self" },
  { title:"Slide 09", text:"soon", url:"https://example.com/9",  target:"_self" },
  { title:"Slide 10", text:"soon", url:"https://example.com/10", target:"_self" },
  { title:"Slide 11", text:"soon", url:"https://example.com/11", target:"_self" },
  { title:"Slide 12", text:"soon", url:"https://example.com/12", target:"_self" }
];
const MAX_LIFT = 40;   // how high a slide rises (px)
const SPREAD   = 2.5;  // how many neighbours rise with it
/* ================================================ */

const box = document.getElementById('box'),
      vault = document.getElementById('vault'),
      rowsEl = document.getElementById('rows'),
      hint = document.getElementById('hint'),
      closeBtn = document.getElementById('close'),
      reader = document.getElementById('reader'),
      plist = document.getElementById('plist');
const desc = s => t(s.text);

const rows = SLIDES.map((s, i) => {
  const a = document.createElement('a');
  a.className = 'row';
  a.href = s.url; a.target = s.target || '_self';
  if (a.target === '_blank') a.rel = 'noopener';
  a.style.top = (i * 30 + 10) + 'px';
  a.innerHTML = '<div class="glass"></div><div class="txt"><b></b><i></i></div>';
  a.addEventListener('pointerenter', () => setActive(i));
  a.addEventListener('focus', () => setActive(i));
  rowsEl.appendChild(a);
  return a;
});
function fillRow(i) {
  rows[i].querySelector('b').textContent = SLIDES[i].title;
  rows[i].querySelector('i').textContent = desc(SLIDES[i]);
}
function renderList() {
  plist.innerHTML = "";
  SLIDES.forEach(s => {
    const li = document.createElement('li'), a = document.createElement('a');
    a.href = s.url; a.target = s.target || '_self'; if (a.target === '_blank') a.rel = 'noopener';
    a.textContent = s.title; li.appendChild(a); li.appendChild(document.createTextNode(' - ' + desc(s)));
    plist.appendChild(li);
  });
}
function showReader(a) {
  reader.innerHTML = "";
  if (a < 0) { reader.textContent = "> " + t("point"); return; }
  const b = document.createElement('b'); b.textContent = SLIDES[a].title;
  reader.appendChild(b); reader.appendChild(document.createTextNode(" - " + desc(SLIDES[a])));
}
function setActive(a) {
  rows.forEach((r, i) => {
    const lift = a < 0 ? 0 : MAX_LIFT * Math.max(0, 1 - Math.abs(i - a) / SPREAD);
    r.style.setProperty('--lift', lift.toFixed(1));
    r.classList.toggle('hot', i === a);
  });
  showReader(a);
}
rowsEl.addEventListener('pointerleave', () => setActive(-1));
rows.forEach(r => r.addEventListener('blur', () => setActive(-1)));

function toggle(open) {
  box.classList.toggle('open', open);
  hint.classList.toggle('hidden', open);
  closeBtn.classList.toggle('show', open);
  if (!open) setActive(-1);
}
box.addEventListener('click', () => { if (!box.classList.contains('open')) toggle(true); });
box.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target === box) { e.preventDefault(); toggle(true); }
});
closeBtn.addEventListener('click', () => toggle(false));

function fit() {
  const s = Math.min(1, vault.clientWidth / 600);
  box.style.setProperty('--s', s.toFixed(3));
}
addEventListener('resize', fit); fit();

/* ---------- boot ---------- */
document.querySelectorAll(".gbtn[data-lang]").forEach(b =>
  b.addEventListener("click", () => applyLang(b.dataset.lang, true)));
applyLang(detectLang(), false);
