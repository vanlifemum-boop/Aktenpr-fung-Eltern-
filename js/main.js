/* Aktenlage — gemeinsames Verhalten aller Seiten.
   Kein Framework, keine externen Aufrufe, kein Tracking. */
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

    knopf.addEventListener("click", function () {
      var offen = nav.classList.toggle("offen");
      knopf.setAttribute("aria-expanded", offen ? "true" : "false");
      knopf.textContent = offen ? "✕" : "☰";
      knopf.setAttribute("aria-label", offen ? "Menü schließen" : "Menü öffnen");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName !== "A") return;
      nav.classList.remove("offen");
      knopf.setAttribute("aria-expanded", "false");
      knopf.textContent = "☰";
    });
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
