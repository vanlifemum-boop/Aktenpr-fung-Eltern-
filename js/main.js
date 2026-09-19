/* Aktenlage — gemeinsames Verhalten aller Seiten.
   Kein Framework, keine externen Aufrufe, kein Tracking. */
document.documentElement.classList.add("js");

(function () {
  "use strict";

  /* Einblenden beim Scrollen */
  function einblenden() {
    var elemente = document.querySelectorAll("[data-reveal]");
    if (!elemente.length) return;

    var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (ruhig || !("IntersectionObserver" in window)) {
      elemente.forEach(function (el) { el.classList.add("sichtbar"); });
      return;
    }

    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (eintrag) {
        if (!eintrag.isIntersecting) return;
        eintrag.target.classList.add("sichtbar");
        beobachter.unobserve(eintrag.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    elemente.forEach(function (el) { beobachter.observe(el); });
  }

  /* Mobiles Menü */
  function menue() {
    var knopf = document.querySelector(".burger");
    var nav = document.querySelector(".nav");
    if (!knopf || !nav) return;

    function schliessen() {
      nav.classList.remove("offen");
      document.body.classList.remove("menu-open");
      knopf.setAttribute("aria-expanded", "false");
      knopf.textContent = "☰";
      knopf.setAttribute("aria-label", "Menü öffnen");
    }

    knopf.addEventListener("click", function () {
      var offen = nav.classList.toggle("offen");
      document.body.classList.toggle("menu-open", offen);
      knopf.setAttribute("aria-expanded", offen ? "true" : "false");
      knopf.textContent = offen ? "✕" : "☰";
      knopf.setAttribute("aria-label", offen ? "Menü schließen" : "Menü öffnen");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName !== "A") return;
      schliessen();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("offen")) {
        schliessen();
        knopf.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 930) schliessen();
    });
  }

  /* Kopfzeile beim Scrollen optisch vom Inhalt absetzen */
  function kopfzeile() {
    var header = document.querySelector(".header");
    if (!header) return;

    function aktualisieren() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    aktualisieren();
    window.addEventListener("scroll", aktualisieren, { passive: true });
  }

  /* Aktuellen Navigationspunkt markieren */
  function aktiverLink() {
    var datei = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav a").forEach(function (a) {
      var ziel = (a.getAttribute("href") || "").toLowerCase();
      if (ziel === datei) {
        a.classList.add("aktiv");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* Datenschutz-Hinweisleiste, Zustand nur lokal im Browser */
  function hinweisleiste() {
    var leiste = document.getElementById("datenschutz-hinweis");
    if (!leiste) return;

    var schluessel = "aktenlage-hinweis-ok";
    var gesehen = null;
    try { gesehen = localStorage.getItem(schluessel); } catch (e) { gesehen = "1"; }
    if (gesehen === "1") return;

    leiste.hidden = false;
    var knopf = leiste.querySelector("button");
    if (!knopf) return;
    knopf.addEventListener("click", function () {
      leiste.hidden = true;
      try { localStorage.setItem(schluessel, "1"); } catch (e) { /* egal */ }
    });
  }

  /* Jahreszahl im Fuß */
  function jahr() {
    var jetzt = String(new Date().getFullYear());
    document.querySelectorAll("[data-jahr]").forEach(function (el) {
      el.textContent = jetzt;
    });
  }

  function start() {
    einblenden();
    menue();
    kopfzeile();
    aktiverLink();
    hinweisleiste();
    jahr();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
