/* Pinta el portfolio a partir de window.CONTENT (content.js).
   Aquí no hay textos: para cambiar lo que pone, edita content.js. */
(function () {
  "use strict";
  var C = window.CONTENT;
  var root = document.documentElement;
  var page = document.body.getAttribute("data-page");
  var HOME = page === "home" ? "" : "index.html";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- utilidades ---------- */
  function lang() { return root.getAttribute("lang") === "en" ? "en" : "es"; }
  function t(v) {
    if (v == null) return "";
    if (typeof v === "object" && !Array.isArray(v)) return v[lang()] != null ? v[lang()] : (v.es || "");
    return String(v);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function tx(v) { return esc(t(v)); }
  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function fmtDate(ym) {
    if (!ym) return t(C.ui.present);
    var p = String(ym).split("-");
    if (p.length === 1) return p[0];
    var d = new Date(+p[0], (+p[1] || 1) - 1, 1);
    return d.toLocaleDateString(lang() === "en" ? "en-GB" : "es-ES", { month: "short", year: "numeric" }).replace(".", "");
  }
  function initials(name) { return name.split(" ").map(function (w) { return w[0]; }).slice(0, 2).join(""); }

  /* ---------- iconos ---------- */
  var ICON = {
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" class="fill"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.6 4.77 6V21h-4v-5c0-1.2-.02-2.73-1.66-2.73-1.67 0-1.93 1.3-1.93 2.64V21h-4z"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true" class="fill"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    // Cómo trabajo: uno por criterio, en orden
    principles: [
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v18M6 12h8l4-4M14 12l4 4"/></svg>',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17 9 6l4 7 3-4 5 8z"/></svg>',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/></svg>',
    ],
  };

  /* Logo: "AB compartida" -- la pata derecha de la A es el asta de la B.
     Mismo dibujo que assets/img/logo/ab-negro.svg; aqui en currentColor para que
     vaya en blanco sobre el degradado de la marca. */
  var LOGO_AB = '<svg viewBox="0 0 256 256"><g fill="none" stroke="currentColor" stroke-width="28" stroke-linejoin="round" stroke-linecap="round" transform="translate(-6 0)"><path d="M136 48 L45 206"/><path d="M70 166 H136"/><path d="M136 206 V48 H166 a37 37 0 0 1 0 74 H136"/><path d="M136 122 H170 a42 42 0 0 1 0 84 H136"/></g></svg>';

  /* Icono de los proyectos que no tienen capturas (por slug) */
  var PROJECT_ICONS = {
    granthub: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h5"/><circle cx="15.5" cy="16" r="2.5"/></svg>',
    "cv-studio": '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><circle cx="12" cy="12.5" r="2"/><path d="M8.5 18c.7-1.5 2-2.3 3.5-2.3s2.8.8 3.5 2.3"/></svg>',
    organizador: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M8 13h8M12 10.5v5"/></svg>',
  };

  /* Logos de herramientas, guardados en assets/img/tools/ para no depender de
     servicios externos. Origen: Devicon, Iconify (set "logos") y Simple Icons;
     pcm.svg es propio (una metodología no tiene logo). Lo que no está aquí sale
     con un punto de color. */
  var TOOL_DIR = "assets/img/tools/";
  var LOGOS = {
    "Jira": "jira", "Trello": "trello", "Notion": "notion", "Slack": "slack",
    "ClickUp": "clickup", "Microsoft 365": "microsoft365", "Google Workspace": "googleworkspace",
    "Power BI": "powerbi", "Claude": "claude", "Make": "make", "Funding & Tenders Portal": "eu",
    "PCM y Marco Lógico": "pcm", "PCM and Logical Framework": "pcm",
    "Electron": "electron", "React": "react", "TypeScript": "typescript",
    "Tailwind CSS": "tailwindcss", "SQLite": "sqlite", "Python": "python",
    "GitHub": "github", "Unity": "unity", "Unreal Engine": "unreal", "DaVinci Resolve": "davinci",
    "Canva": "canva", "WordPress": "wordpress", "Figma": "figma", "Blender": "blender",
    "Gestiona": "gestiona", "Absys": "absys.png",
  };
  // Logos casi negros o muy oscuros: en modo oscuro se aclaran para que se vean.
  var DARK_LOGOS = { notion: 1, make: 1, pcm: 1, github: 1, unity: 1, unreal: 1, davinci: 1, wordpress: 1, gestiona: 1, "absys.png": 1 };
  function chip(name) {
    var n = t(name), logo = LOGOS[n];
    var mark = logo ? '<img src="' + TOOL_DIR + logo + (/\.\w+$/.test(logo) ? "" : ".svg") + '" alt="" width="18" height="18" loading="lazy">' : '<span class="chip-dot" aria-hidden="true"></span>';
    return '<li class="chip' + (logo && DARK_LOGOS[logo] ? " chip-darklogo" : "") + '">' + mark + "<span>" + esc(n) + "</span></li>";
  }
  function chips(list) { return '<ul class="chips">' + (list || []).map(function (n, k) { return chip(n).replace('<li class="chip', '<li style="--i:' + k + '" class="chip'); }).join("") + "</ul>"; }

  /* ---------- proyectos ---------- */
  function projUrl(p) { return "proyecto.html?p=" + encodeURIComponent(p.slug); }
  function fundUrl(f) { return "proyecto.html?f=" + encodeURIComponent(f.slug); }
  function hasFundCase(f) { var m = f.more || {}; return !!(m.role || (m.details && m.details.length) || (m.highlights && m.highlights.length)); }
  function img(src) { return /^(https?:)?\/\//.test(src) ? src : "assets/img/projects/" + src; }
  function hasCase(p) { return !!(p.problem || (p.owned && p.owned.length) || (p.decisions && p.decisions.length) || p.ai || p.outcome); }
  function picture(im, eager) {
    // Tamaño declarado para que la página no salte mientras carga (las capturas son 1600 × 900).
    var attrs = ' alt="' + tx(im.alt) + '" width="' + (im.width || 1600) + '" height="' + (im.height || 900) + '"' +
      (eager ? "" : ' loading="lazy"') + ' decoding="async">';
    if (im.dark) {
      return '<img class="shot only-light" src="' + img(im.src) + '"' + attrs +
        '<img class="shot only-dark" src="' + img(im.dark) + '"' + attrs;
    }
    return '<img class="shot" src="' + img(im.src) + '"' + attrs;
  }
  function cvHref() {
    var cv = C.profile.cv || {};
    return cv[lang()] || cv.es || cv.en || null;
  }

  /* ---------- cabecera y pie ---------- */
  var NAV = ["about", "experience", "projects", "approach", "contact"].filter(function (id) { return id !== "approach" || C.showApproach !== false; });

  function renderHeader() {
    var links = NAV.map(function (id) {
      return '<li><a href="' + HOME + "#" + id + '" data-nav="' + id + '">' + tx(C.ui.nav[id]) + "</a></li>";
    }).join("");
    var dark = root.getAttribute("data-theme") === "dark";
    var cv = cvHref();
    var cta = cv
      ? '<a class="btn btn-sm nav-cta" href="' + esc(cv) + '" download>' + tx(C.ui.downloadCv) + "</a>"
      : '<a class="btn btn-sm nav-cta" href="' + HOME + '#contact">' + tx(C.ui.ctaContact) + "</a>";

    $("site-header").innerHTML =
      '<div class="container nav-inner">' +
        '<a class="logo" href="' + (HOME || "#home") + '"><span class="logo-mark" aria-hidden="true">' + LOGO_AB + '</span><span class="logo-text">' + esc(C.profile.name) + "</span></a>" +
        '<nav class="nav-links" aria-label="' + (lang() === "en" ? "Main" : "Principal") + '"><ul>' + links + "</ul></nav>" +
        '<div class="nav-actions">' +
          '<button class="icon-btn lang-btn" id="lang-toggle" type="button" aria-label="' + tx(C.ui.langSwitch) + '"><span class="' + (lang() === "es" ? "on" : "") + '">ES</span><span class="' + (lang() === "en" ? "on" : "") + '">EN</span></button>' +
          '<button class="icon-btn" id="theme-toggle" type="button" aria-label="' + tx(dark ? C.ui.themeLight : C.ui.themeDark) + '">' + (dark ? ICON.sun : ICON.moon) + "</button>" +
          cta +
          '<button class="icon-btn menu-btn" id="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="' + tx(C.ui.menu) + '">' + ICON.menu + "</button>" +
        "</div>" +
      "</div>" +
      '<div class="mobile-menu" id="mobile-menu" hidden><ul>' + links + "</ul></div>";

    $("lang-toggle").addEventListener("click", function () {
      var next = lang() === "en" ? "es" : "en";
      root.setAttribute("lang", next);
      store("lang", next);
      render();
      $("lang-toggle").focus();
    });
    $("theme-toggle").addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store("theme", next);
      renderHeader();
      $("theme-toggle").focus();
    });
    var menu = $("mobile-menu"), btn = $("menu-toggle");
    function setMenu(open) {
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      btn.innerHTML = open ? ICON.close : ICON.menu;
      $("site-header").classList.toggle("menu-open", open);
    }
    btn.addEventListener("click", function () { setMenu(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); btn.focus(); } });
  }

  function renderFooter() {
    var p = C.profile;
    var social = [];
    if (p.linkedin) social.push('<a href="' + esc(p.linkedin) + '" aria-label="LinkedIn">' + ICON.linkedin + "</a>");
    if (p.github) social.push('<a href="' + esc(p.github) + '" aria-label="GitHub">' + ICON.github + "</a>");
    $("site-footer").innerHTML =
      '<div class="container footer-inner">' +
        "<p>© " + new Date().getFullYear() + " " + esc(p.name) + "</p>" +
        '<p class="footer-note">' + tx(C.ui.footer) + "</p>" +
        '<p class="footer-social">' + social.join("") + "</p>" +
      "</div>";
  }

  function head(id) {
    var s = C.ui.sections[id];
    return '<header class="section-head reveal"><h2 id="' + id + '-title">' + tx(s.title) + "</h2>" + (s.sub ? "<p>" + tx(s.sub) + "</p>" : "") + "</header>";
  }

  /* ---------- portada ---------- */
  function renderHero() {
    var h = C.hero, p = C.profile;
    var photo = h.photo
      ? '<img class="hero-photo" src="assets/img/' + esc(h.photo) + '" alt="' + esc(p.name) + '" width="800" height="1000" fetchpriority="high">'
      : '<div class="hero-photo hero-monogram" aria-hidden="true"><span>' + esc(initials(p.name)) + "</span></div>";
    var cards = (h.cards || []).map(function (c, i) {
      return '<div class="float-card fc' + (i + 1) + '"><strong data-count="' + tx(c.value) + '">' + tx(c.value) + "</strong><span>" + tx(c.text) + "</span></div>";
    }).join("");
    var social = [];
    if (p.linkedin) social.push('<li><a href="' + esc(p.linkedin) + '" aria-label="LinkedIn">' + ICON.linkedin + "</a></li>");
    if (p.github) social.push('<li><a href="' + esc(p.github) + '" aria-label="GitHub">' + ICON.github + "</a></li>");
    if (p.email) social.push('<li><a href="mailto:' + esc(p.email) + '" aria-label="Email">' + ICON.mail + "</a></li>");
    var parts = p.name.split(" ");

    $("home").innerHTML =
      '<div class="container hero-inner">' +
        '<div class="hero-text">' +
          '<p class="badge reveal">' + tx(p.role) + "</p>" +
          '<h1 class="hero-name reveal" style="--d:1">' + esc(parts[0]) + '<span class="hero-surname">' + esc(parts.slice(1).join(" ")) + "</span></h1>" +
          '<p class="typed reveal" style="--d:2" aria-label="' + esc((h.roles || []).map(t).join(", ")) + '"><span id="typed" aria-hidden="true"></span><span class="caret" aria-hidden="true"></span></p>' +
          '<p class="lead reveal" style="--d:3">' + tx(h.tagline) + "</p>" +
          '<div class="hero-ctas reveal" style="--d:4">' +
            '<a class="btn btn-primary" href="#projects">' + tx(C.ui.ctaProjects) + "</a>" +
            '<a class="btn btn-ghost" href="#contact">' + tx(C.ui.ctaContact) + "</a>" +
          "</div>" +
          '<ul class="hero-social reveal" style="--d:5">' + social.join("") + "</ul>" +
        "</div>" +
        '<div class="hero-visual reveal" style="--d:2"><div class="photo-frame">' + photo + "</div>" + cards + "</div>" +
      "</div>";
    startTyping();
  }

  var typingTimer = null;
  function startTyping() {
    clearTimeout(typingTimer);
    var el = $("typed");
    var roles = (C.hero.roles || []).map(t);
    if (!el || !roles.length) return;
    var typed = el.parentNode;
    typed.classList.remove("is-done");
    // Recorre las frases en bucle (como pidió Amanda). Con "reducir movimiento"
    // se queda quieta en la primera.
    if (reduceMotion || roles.length === 1) { el.textContent = roles[0]; typed.classList.add("is-done"); return; }
    var i = 0, n = 0, deleting = false;
    (function tick() {
      var word = roles[i];
      n += deleting ? -1 : 1;
      el.textContent = word.slice(0, n);
      var wait = deleting ? 35 : 70;
      if (!deleting && n === word.length) { deleting = true; wait = 1800; }
      else if (deleting && n === 0) { deleting = false; i = (i + 1) % roles.length; wait = 350; }
      typingTimer = setTimeout(tick, wait);
    })();
  }

  /* Cifras que cuentan desde cero cuando aparecen en pantalla ("+960.000 €", "+3"...).
     Toma el primer número del texto, lo anima y lo vuelve a escribir con el formato
     del idioma; el resto del texto (signos, €) se queda igual. */
  function countUp(el) {
    var original = el.getAttribute("data-count");
    var m = original.match(/\d[\d.,]*/);
    if (!m || reduceMotion) { el.textContent = original; return; }
    var target = parseInt(m[0].replace(/[.,]/g, ""), 10);
    var grouped = /[.,]/.test(m[0]);
    var locale = lang() === "en" ? "en-GB" : "es-ES";
    var start = null, dur = 1400;
    // Red de seguridad: si la pestaña está en segundo plano el navegador pausa la
    // animación; pase lo que pase, la cifra acaba mostrando su valor real.
    setTimeout(function () { el.textContent = original; }, dur + 300);
    function fmt(v) { return grouped ? v.toLocaleString(locale, { useGrouping: "always" }) : String(v); }
    (function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = original.replace(m[0], fmt(Math.round(target * eased)));
      if (p < 1) requestAnimationFrame(frame); else el.textContent = original;
    })(performance.now());
  }
  var counter = null;
  function setupCounters() {
    var els = [].slice.call(document.querySelectorAll("[data-count]"));
    if (!("IntersectionObserver" in window)) return;
    if (!counter) {
      counter = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { counter.unobserve(en.target); countUp(en.target); } });
      }, { rootMargin: "0px 0px -10% 0px" });
    }
    els.forEach(function (el) { counter.observe(el); });
  }

  function renderAbout() {
    var a = C.about;
    var stats = (a.stats || []).map(function (s) { return "<div><dt>" + tx(s.label) + '</dt><dd data-count="' + tx(s.value) + '">' + tx(s.value) + "</dd></div>"; }).join("");
    var journey = (a.journey || []).map(function (j, i) {
      var kind = j.kind && C.ui.journeyKinds[j.kind] ? '<span class="j-kind j-kind-' + j.kind + '">' + tx(C.ui.journeyKinds[j.kind]) + "</span>" : "";
      return '<li class="j-' + (j.kind || "work") + (j.now ? " is-now" : "") + '" style="--d:' + i + '">' +
        '<span class="j-year">' + tx(j.year) + "</span>" +
        '<div><p class="j-title">' + tx(j.title) + (j.now ? ' <span class="j-now">' + tx(C.ui.now) + "</span>" : "") + "</p>" +
          '<p class="j-text">' + kind + tx(j.text) + "</p></div>" +
      "</li>";
    }).join("");
    $("about").innerHTML =
      '<div class="container">' + head("about") +
        '<div class="about-grid">' +
          '<div class="about-text reveal" style="--d:1">' + a.paragraphs.map(function (x) { return "<p>" + tx(x) + "</p>"; }).join("") +
            '<dl class="stats">' + stats + "</dl>" +
          "</div>" +
          '<ol class="journey reveal">' + journey + "</ol>" +
        "</div>" +
      "</div>";
  }

  function renderExperience() {
    var list = C.experience.concat((C.otherRoles || []).map(function (o) {
      return { role: o.role, org: o.org, place: o.place, start: o.start, end: o.end, points: o.points || (o.text ? [o.text] : []), tools: o.tools, logo: o.logo, logoPos: o.logoPos, logoSize: o.logoSize, tabLabel: o.tabLabel, short: o.short };
    }));
    var tabs = list.map(function (e, i) {
      return '<button class="xp-tab" role="tab" type="button" id="xp-tab-' + i + '" aria-controls="xp-panel-' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' +
        (e.logo ? '<span class="xp-logo" aria-hidden="true" style="background-image:url(assets/img/companies/' + esc(e.logo) + ')' + (e.logoPos ? ';background-position:' + e.logoPos : '') + (e.logoSize ? ';background-size:' + e.logoSize : '') + '"></span>' : '') + '<span class="xp-tab-org">' + tx(e.tabLabel || e.org) + '</span><span class="xp-tab-short">' + tx(e.short || e.tabLabel || e.org) + '</span><span class="xp-tab-years">' + esc(String(e.start).split("-")[0]) + (e.end && String(e.end).split("-")[0] !== String(e.start).split("-")[0] ? "–" + esc(String(e.end).split("-")[0]) : (e.end ? "" : "–" + tx(C.ui.present))) + "</span></button>";
    }).join("");
    var panels = list.map(function (e, i) {
      return '<div class="xp-panel" role="tabpanel" id="xp-panel-' + i + '" aria-labelledby="xp-tab-' + i + '"' + (i === 0 ? "" : " hidden") + ">" +
        '<h3 class="xp-role">' + tx(e.role) + ' <span class="xp-at">' + (lang() === "en" ? "at" : "en") + " " + tx(e.org) + "</span></h3>" +
        '<p class="xp-meta">' + esc(fmtDate(e.start)) + " – " + esc(fmtDate(e.end)) + (e.place ? " <span>" + tx(e.place) + "</span>" : "") + "</p>" +
        '<ul class="xp-points">' + (e.points || []).map(function (pt, k) { return '<li style="--i:' + k + '">' + ICON.check + "<span>" + tx(pt) + "</span></li>"; }).join("") + "</ul>" +
        // Herramientas usadas en ese puesto, como chips con logo (solo si hay)
        (e.tools && e.tools.length ? '<div class="xp-tools"><p class="xp-tools-label">' + tx(C.ui.toolsTitle) + "</p>" + chips(e.tools) + "</div>" : "") +
      "</div>";
    }).join("");

    // Cada proyecto financiado es un desplegable (<details>): accesible con
    // teclado y lector de pantalla sin JavaScript extra. Lo que va dentro sale
    // de `more` en content.js; si todavía está vacío, se dice.
    var u = C.ui;
    // Cada proyecto laboral es una tarjeta; si tiene contenido ("more"), enlaza a su
    // página propia, igual que los proyectos propios.
    var funded = (C.funded || []).map(function (f, fi) {
      var meta = [t(f.programmeShort || f.programme), t(f.year)].filter(Boolean).map(esc).join(", ");
      var link = hasFundCase(f);
      var title = link ? '<a href="' + fundUrl(f) + '">' + tx(f.name) + "</a>" : tx(f.name);
      return '<li class="reveal" style="--d:' + (fi % 2) + '"><div class="fund' + (link ? " fund-link" : "") + '">' +
        '<div class="fund-top"><h4>' + title + "</h4>" + (f.amount ? '<span class="fund-amount">' + tx(f.amount) + "</span>" : "") + "</div>" +
        '<p class="fund-meta">' + meta + '</p><p class="fund-text">' + tx(f.text) + "</p>" +
        (link ? '<p class="fund-foot"><a class="pj-more" href="' + fundUrl(f) + '">' + tx(u.viewProject) + "</a></p>" : "") +
      "</div></li>";
    }).join("");

    $("experience").innerHTML =
      '<div class="container">' + head("experience") +
        '<div class="xp reveal"><div class="xp-tabs" role="tablist" aria-label="' + tx(C.ui.nav.experience) + '">' + tabs + "</div>" +
        '<div class="xp-panels">' + panels + "</div></div>" +
        (funded ? '<h3 class="sub-title reveal">' + tx(C.ui.fundedTitle) + '</h3><ul class="funds">' + funded + "</ul>" : "") +
      "</div>";

    var btns = [].slice.call(document.querySelectorAll(".xp-tab"));
    function select(i, focus) {
      btns.forEach(function (b, j) {
        var on = i === j;
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
        $("xp-panel-" + j).hidden = !on;
      });
      if (focus) btns[i].focus();
    }
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () { select(i); });
      b.addEventListener("keydown", function (ev) {
        var k = ev.key, n = btns.length, to = null;
        if (k === "ArrowDown" || k === "ArrowRight") to = (i + 1) % n;
        else if (k === "ArrowUp" || k === "ArrowLeft") to = (i - 1 + n) % n;
        else if (k === "Home") to = 0;
        else if (k === "End") to = n - 1;
        if (to !== null) { ev.preventDefault(); select(to, true); }
      });
    });
  }

  function renderProjects() {
    var rows = C.projects.map(function (p, i) {
      var link = hasCase(p);
      var media = p.images && p.images.length
        ? picture(p.images[0])
        : '<div class="pj-placeholder" aria-hidden="true"><span class="pj-icon">' + (PROJECT_ICONS[p.slug] || ICON.check) + "</span></div>";
      var title = link ? '<a href="' + projUrl(p) + '">' + tx(p.title) + "</a>" : tx(p.title);
      return '<article class="pj reveal' + (i === 0 ? " pj-featured" : "") + '" style="--d:' + (i === 0 ? 0 : i - 1) + '">' +
        '<div class="pj-media">' + media + "</div>" +
        '<div class="pj-body">' +
          '<p class="pj-kind">' + tx(p.kind) + ", " + tx(p.year) + "</p>" +
          '<h3 class="pj-name">' + title + "</h3>" +
          '<p class="pj-summary">' + tx(p.summary) + "</p>" +
          chips(p.stack) +
          '<p class="pj-foot"><span class="pj-status">' + tx(p.status) + "</span>" +
            (link ? '<a class="pj-more" href="' + projUrl(p) + '">' + tx(C.ui.viewProject) + "</a>" : "") + "</p>" +
        "</div>" +
      "</article>";
    }).join("");
    $("projects").innerHTML = '<div class="container">' + head("projects") + '<div class="pj-list">' + rows + "</div></div>";
  }

  function renderApproach() {
    var cards = C.approach.map(function (a, i) {
      return '<li class="principle reveal" style="--d:' + i + '"><span class="principle-icon">' + (ICON.principles[i] || ICON.check) + "</span>" +
        "<h3>" + tx(a.title) + "</h3><p>" + tx(a.text) + "</p></li>";
    }).join("");
    $("approach").innerHTML = '<div class="container">' + head("approach") + '<ul class="principles">' + cards + "</ul></div>";
  }

  function renderSkills() {
    // Cada tarjeta lleva su icono para que el título se distinga de un vistazo.
    var SKILL_ICONS = {
      education: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9.5 12 5l10 4.5-10 4.5z"/><path d="M6 11.5v4.5c1.6 1.5 3.6 2.2 6 2.2s4.4-.7 6-2.2v-4.5M22 9.5V15"/></svg>',
      certificates: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="5"/><path d="M9 13.2 8 21l4-2 4 2-1-7.8"/></svg>',
      languages: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3z"/></svg>',
      tools: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L3.5 17.5a1.4 1.4 0 0 0 2 2l5.7-5.7a4 4 0 0 0 5.3-5.3l-2.4 2.4-2-.5-.5-2z"/></svg>',
    };
    function cardTitle(title, icon) {
      return '<h3 class="skill-title"><span class="skill-icon">' + SKILL_ICONS[icon] + "</span>" + tx(title) + "</h3>";
    }
    var cardIndex = 0;
    function list(title, arr, line, icon) {
      return arr && arr.length ? '<div class="skill-card reveal" style="--d:' + (cardIndex++) + '">' + cardTitle(title, icon) + '<ul class="skill-list">' + arr.map(line).join("") + "</ul></div>" : "";
    }
    var item = function (x) { return "<li><strong>" + tx(x.title) + "</strong><span>" + tx(x.org) + ", " + tx(x.year) + "</span></li>"; };
    $("skills").innerHTML =
      '<div class="container">' + head("skills") +
        '<div class="skills-grid">' +
          list(C.ui.educationTitle, C.education, item, "education") +
          list(C.ui.certificatesTitle, C.certificates, item, "certificates") +
          list(C.ui.languagesTitle, C.languages, function (x) { return "<li><strong>" + tx(x.name) + "</strong><span>" + tx(x.level) + "</span></li>"; }, "languages") +
        "</div>" +
        '<div class="tools reveal">' + cardTitle(C.ui.toolsTitle, "tools") + chips(C.tools) + "</div>" +
      "</div>";
  }

  function renderContact() {
    var p = C.profile, u = C.ui;
    var rows = [];
    if (p.email) rows.push('<a class="contact-row" href="mailto:' + esc(p.email) + '">' + ICON.mail + "<span>" + esc(p.email) + "</span></a>");
    if (p.linkedin) rows.push('<a class="contact-row" href="' + esc(p.linkedin) + '">' + ICON.linkedin + "<span>LinkedIn</span></a>");
    if (p.github) rows.push('<a class="contact-row" href="' + esc(p.github) + '">' + ICON.github + "<span>GitHub</span></a>");
    $("contact").innerHTML =
      '<div class="container"><div class="contact-card reveal">' +
        '<div class="contact-info"><h2 id="contact-title">' + tx(u.contactTitle) + "</h2><p>" + tx(u.contactText) + "</p>" +
          (p.email ? "" : '<p class="todo-note">' + tx(u.emailMissing) + "</p>") +
        "</div>" +
        '<div class="contact-links">' + rows.join("") + "</div>" +
      "</div></div>";
  }

  /* ---------- página de proyecto ---------- */
  /* Página de un proyecto laboral (proyecto.html?f=slug) */
  function renderFundPage(fslug) {
    var u = C.ui, main = $("project");
    var f = (C.funded || []).filter(function (x) { return x.slug === fslug; })[0] || null;
    if (f && !hasFundCase(f)) f = null;
    if (!f) {
      document.title = t(u.notFound) + " " + C.profile.name;
      main.innerHTML = '<div class="container case-missing"><p>' + tx(u.notFound) + '</p><p><a class="btn btn-ghost" href="index.html#experience">' + tx(u.backExperience) + "</a></p></div>";
      return;
    }
    document.title = t(f.name) + ", " + C.profile.name;
    var m = f.more || {};
    function block(title, body) { return body ? '<section class="case-block reveal"><h2>' + tx(title) + "</h2>" + body + "</section>" : ""; }
    // Convocatoria: el código enlaza a su ficha en el portal Funding & Tenders
    var call = f.call ? (f.call.url ? '<a class="fact-link" href="' + esc(f.call.url) + '" target="_blank" rel="noopener">' + esc(f.call.id) + "</a>" : esc(f.call.id)) : "";
    var facts = [["programme", tx(f.programme)], ["call", call], ["amount", tx(f.amount)], ["year", tx(f.year)], ["duration", tx(f.duration)]]
      .filter(function (x) { return x[1]; })
      .map(function (x) { return "<div><dt>" + tx(u.facts[x[0]]) + "</dt><dd>" + x[1] + "</dd></div>"; }).join("");
    // Enlaces públicos (prensa, web del programa), uno por línea en la ficha
    if (f.links && f.links.length) {
      facts += "<div><dt>" + tx(u.links) + "</dt><dd>" + f.links.map(function (l) {
        return '<a class="fact-link fact-link-block" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + tx(l.label) + "</a>";
      }).join("") + "</dd></div>";
    }
    var others = (C.funded || []).filter(function (o) { return o !== f; }).map(function (o) {
      var title = hasFundCase(o) ? '<a href="' + fundUrl(o) + '">' + tx(o.name) + "</a>" : tx(o.name);
      return '<li class="other reveal"><h3>' + title + "</h3><p>" + tx(o.text) + "</p></li>";
    }).join("");
    main.innerHTML =
      '<div class="container">' +
        '<a class="case-back reveal" href="index.html#experience">' + ICON.arrowLeft + tx(u.backExperience) + "</a>" +
        '<header class="case-head reveal">' +
          '<p class="pj-kind">' + tx(f.programme) + (f.year ? ", " + tx(f.year) : "") + "</p>" +
          '<h1 class="case-title">' + tx(f.name) + "</h1>" +
          '<p class="case-summary">' + tx(f.text) + "</p>" +
        "</header>" +
        '<div class="case-grid">' +
          '<div class="case-body">' +
            block(u.caseRole, m.role ? "<p>" + tx(m.role) + "</p>" : "") +
            block(u.caseAbout, (m.details || []).map(function (d) { return "<p>" + tx(d) + "</p>"; }).join("")) +
            block(u.caseHighlights, m.highlights && m.highlights.length ? '<ul class="xp-points">' + m.highlights.map(function (h) { return "<li>" + ICON.check + "<span>" + tx(h) + "</span></li>"; }).join("") + "</ul>" : "") +
          "</div>" +
          '<aside class="case-facts reveal"><dl>' + facts + "</dl></aside>" +
        "</div>" +
      "</div>" +
      // Galería (p. ej., carteles de cursos): imágenes verticales, en rejilla
      (f.images && f.images.length ? '<section class="section alt"><div class="container"><h2 class="sub-title">' + tx(u.gallery) + '</h2><div class="work-gallery">' +
        f.images.map(function (im) { return '<figure class="work-shot reveal"><img src="assets/img/work/' + esc(im.src) + '" alt="' + tx(im.alt) + '" width="800" height="1000" loading="lazy" decoding="async"></figure>'; }).join("") +
      "</div></div></section>" : "") +
      (others ? '<section class="section"><div class="container"><h2 class="sub-title">' + tx(u.otherWorkProjects) + '</h2><ul class="others">' + others + "</ul></div></section>" : "");
  }

  function renderProjectPage() {
    var fslug = new URLSearchParams(location.search).get("f");
    if (fslug) { renderFundPage(fslug); return; }
    var slug = new URLSearchParams(location.search).get("p");
    var p = C.projects.filter(function (x) { return x.slug === slug; })[0] || null;
    if (p && !hasCase(p)) p = null;
    var main = $("project"), u = C.ui;
    if (!p) {
      document.title = t(u.notFound) + " " + C.profile.name;
      main.innerHTML = '<div class="container case-missing"><p>' + tx(u.notFound) + '</p><p><a class="btn btn-ghost" href="index.html#projects">' + tx(u.back) + "</a></p></div>";
      return;
    }
    document.title = t(p.title) + ", " + C.profile.name;

    function block(title, body) { return body ? '<section class="case-block reveal"><h2>' + tx(title) + "</h2>" + body + "</section>" : ""; }
    function para(v) { return v ? "<p>" + tx(v) + "</p>" : ""; }
    function list(arr) { return arr && arr.length ? '<ul class="xp-points">' + arr.map(function (x) { return "<li>" + ICON.check + "<span>" + tx(x) + "</span></li>"; }).join("") + "</ul>" : ""; }

    var repo = p.repo ? '<a class="fact-link" href="' + esc(p.repo) + '">' + ICON.github + "<span>" + tx(u.repoLabel) + "</span></a>" : "";
    var facts = [["kind", tx(p.kind)], ["year", tx(p.year)], ["status", tx(p.status)], ["repo", repo]]
      .filter(function (f) { return f[1]; })
      .map(function (f) { return "<div><dt>" + tx(u.facts[f[0]]) + "</dt><dd>" + f[1] + "</dd></div>"; }).join("");
    var images = p.images || [];
    // Con vídeo, la portada es el vídeo (la captura hace de imagen de espera); si no, la captura.
    var v = p.video;
    var cover = v
      ? '<figure class="case-cover case-video reveal"><video controls playsinline preload="metadata" width="1280" height="720" poster="' + img(v.poster) + '">' +
          '<source src="assets/video/' + esc(v.src) + '" type="video/mp4"></video>' +
          (v.caption ? "<figcaption>" + tx(v.caption) + "</figcaption>" : "") + "</figure>"
      : images.length ? '<figure class="case-cover reveal">' + picture(images[0], true) + "</figure>" : "";
    var gallery = images.slice(1).map(function (im) {
      return '<figure class="case-shot reveal">' + picture(im) + "<figcaption>" + tx(im.alt) + "</figcaption></figure>";
    }).join("");
    var others = C.projects.filter(function (o) { return o !== p; }).map(function (o) {
      var title = hasCase(o) ? '<a href="' + projUrl(o) + '">' + tx(o.title) + "</a>" : tx(o.title);
      return '<li class="other reveal"><h3>' + title + "</h3><p>" + tx(o.summary) + "</p></li>";
    }).join("");
    var link = p.link ? '<a class="btn btn-primary" href="' + esc(p.link) + '">' + tx(u.openLink) + "</a>" : "";

    main.innerHTML =
      '<div class="container">' +
        '<a class="case-back reveal" href="index.html#projects">' + ICON.arrowLeft + tx(u.back) + "</a>" +
        '<header class="case-head reveal">' +
          '<p class="pj-kind">' + tx(p.kind) + "</p>" +
          '<h1 class="case-title">' + tx(p.title) + "</h1>" +
          '<p class="case-summary">' + tx(p.summary) + "</p>" + chips(p.stack) + link +
        "</header>" +
        cover +
        '<div class="case-grid">' +
          '<div class="case-body">' +
            block(u.caseProblem, para(p.problem)) +
            block(u.caseOwned, list(p.owned)) +
            block(u.caseDecisions, list(p.decisions)) +
            block(u.caseAi, para(p.ai)) +
            block(u.caseOutcome, para(p.outcome)) +
          "</div>" +
          '<aside class="case-facts reveal"><dl>' + facts + "</dl></aside>" +
        "</div>" +
      "</div>" +
      (gallery ? '<section class="section alt"><div class="container"><div class="case-gallery">' + gallery + "</div></div></section>" : "") +
      '<section class="section"><div class="container"><h2 class="sub-title">' + tx(u.otherProjects) + '</h2><ul class="others">' + others + "</ul></div></section>";
  }

  /* ---------- aparición al hacer scroll ---------- */
  var observer = null;
  function setupReveal() {
    var els = [].slice.call(document.querySelectorAll(".reveal:not(.in)"));
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); observer.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -8% 0px" });
    }
    els.forEach(function (el) {
      // Lo que ya está en pantalla al cargar aparece sin esperar al observador.
      if (el.getBoundingClientRect().top < window.innerHeight) { void el.offsetWidth; el.classList.add("in"); }
      else observer.observe(el);
    });
  }

  /* Marca en el menú el apartado que se está viendo */
  function setupActiveNav() {
    if (page !== "home" || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        document.querySelectorAll("[data-nav]").forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("data-nav") === en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach(function (id) { var el = $(id); if (el) io.observe(el); });
  }

  /* ---------- arranque ---------- */
  function render() {
    $("skip").textContent = t(C.ui.skip);
    renderHeader();
    if (page === "home") {
      renderHero(); renderAbout(); renderExperience(); renderProjects(); if (C.showApproach !== false) renderApproach(); else $("approach").hidden = true; renderSkills(); renderContact();
    } else {
      renderProjectPage();
    }
    renderFooter();
    if ($("to-top")) $("to-top").setAttribute("aria-label", t(C.ui.toTop));
    if (document.body.classList.contains("ready")) document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    setupReveal();
    setupCounters();
  }

  /* Botón para volver arriba (en móvil y tablet; en escritorio lo oculta el CSS).
     Aparece tras bajar algo más de una pantalla. */
  var toTop = document.createElement("button");
  toTop.type = "button"; toTop.id = "to-top"; toTop.className = "to-top"; toTop.innerHTML = ICON.arrowUp;
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    var logo = document.querySelector("#site-header a");
    if (logo) logo.focus({ preventScroll: true });
  });
  document.body.appendChild(toTop);
  function updateToTop() { toTop.classList.toggle("show", window.scrollY > window.innerHeight * 1.2); }
  window.addEventListener("scroll", updateToTop, { passive: true });

  render();
  updateToTop();
  setupActiveNav();
  window.addEventListener("scroll", function () { $("site-header").classList.toggle("is-scrolled", window.scrollY > 8); }, { passive: true });
  // El contenido se pinta con JavaScript, así que el salto a #apartado se hace después.
  if (location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
      target.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }
  document.body.classList.add("ready");
})();
