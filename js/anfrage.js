/* Aktenlage — Anfrageformular.
   Läuft vollständig im Browser: prüfen, bestätigen, vorausgefüllte E-Mail
   anbieten. Es wird nichts an einen Server oder einen Dritten gesendet.
   Konfiguration kommt aus window.ANFRAGE_CONFIG (siehe anfrage.html). */
(function () {
  "use strict";

  var C = window.ANFRAGE_CONFIG || {};
  var EMPFAENGER = C.email || "";
  var MARKE = C.marke || "Aktenlage";

  function text(wert) {
    return String(wert == null ? "" : wert).trim();
  }

  function istEmail(wert) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(wert);
  }

  function feldVon(eingabe) {
    return eingabe.closest(".feld");
  }

  function fehlerSetzen(eingabe, meldung) {
    var feld = feldVon(eingabe);
    if (!feld) return;
    feld.classList.add("feld--fehler");
    var box = feld.querySelector(".feld__fehler");
    if (box) box.textContent = meldung;
    eingabe.setAttribute("aria-invalid", "true");
  }

  function fehlerLoeschen(eingabe) {
    var feld = feldVon(eingabe);
    if (!feld) return;
    feld.classList.remove("feld--fehler");
    eingabe.removeAttribute("aria-invalid");
  }

  /* Gibt eine Liste ungültiger Felder zurück, leer heißt: alles in Ordnung. */
  function pruefen(formular) {
    var probleme = [];

    var regeln = [
      { name: "anliegen", meldung: "Bitte wähle aus, worum es geht." },
      { name: "umfang", meldung: "Bitte gib an, wie umfangreich die Unterlagen ungefähr sind." },
      { name: "name", meldung: "Bitte trage einen Namen ein, mit dem wir dich ansprechen können." },
      { name: "email", meldung: "Bitte trage eine E-Mail-Adresse ein." }
    ];

    regeln.forEach(function (regel) {
      var eingabe = formular.elements[regel.name];
      if (!eingabe) return;
      if (!text(eingabe.value)) {
        fehlerSetzen(eingabe, regel.meldung);
        probleme.push(eingabe);
      } else {
        fehlerLoeschen(eingabe);
      }
    });

    var email = formular.elements.email;
    if (email && text(email.value) && !istEmail(text(email.value))) {
      fehlerSetzen(email, "Diese E-Mail-Adresse sieht nicht vollständig aus.");
      probleme.push(email);
    }

    var einwilligung = formular.elements.einwilligung;
    if (einwilligung && !einwilligung.checked) {
      fehlerSetzen(einwilligung, "Ohne diese Bestätigung können wir die Anfrage nicht bearbeiten.");
      probleme.push(einwilligung);
    } else if (einwilligung) {
      fehlerLoeschen(einwilligung);
    }

    return probleme;
  }

  function auswahlText(eingabe) {
    if (!eingabe) return "";
    if (eingabe.tagName === "SELECT") {
      var option = eingabe.options[eingabe.selectedIndex];
      return option ? text(option.textContent) : "";
    }
    return text(eingabe.value);
  }

  function datenSammeln(formular) {
    var e = formular.elements;
    return {
      anliegen: auswahlText(e.anliegen),
      umfang: auswahlText(e.umfang),
      dringlichkeit: auswahlText(e.dringlichkeit),
      name: text(e.name && e.name.value),
      email: text(e.email && e.email.value),
      nachricht: text(e.nachricht && e.nachricht.value),
      sozialtarif: !!(e.sozialtarif && e.sozialtarif.checked)
    };
  }

  function mailtoBauen(daten) {
    var betreff = "Anfrage Aktenprüfung — " + (daten.name || "ohne Namen");

    var zeilen = [
      "Anliegen: " + daten.anliegen,
      "Umfang der Unterlagen: " + daten.umfang,
      "Dringlichkeit: " + (daten.dringlichkeit || "nicht angegeben"),
      "Sozialtarif gewünscht: " + (daten.sozialtarif ? "ja" : "nein"),
      "",
      "Name: " + daten.name,
      "E-Mail: " + daten.email,
      "",
      "Nachricht:",
      daten.nachricht || "(keine)",
      "",
      "— gesendet über das Anfrageformular von " + MARKE
    ];

    return (
      "mailto:" + encodeURIComponent(EMPFAENGER) +
      "?subject=" + encodeURIComponent(betreff) +
      "&body=" + encodeURIComponent(zeilen.join("\n"))
    );
  }

  function zeile(dl, bezeichnung, wert) {
    var dt = document.createElement("dt");
    dt.textContent = bezeichnung;
    var dd = document.createElement("dd");
    dd.textContent = wert;
    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  function bestaetigungZeigen(ziel, daten) {
    ziel.textContent = "";

    var box = document.createElement("div");
    box.className = "bestaetigung";
    box.setAttribute("role", "status");
    box.setAttribute("tabindex", "-1");

    var h = document.createElement("h3");
    h.textContent = "Fast geschafft — jetzt noch abschicken";
    box.appendChild(h);

    var p1 = document.createElement("p");
    p1.textContent =
      "Diese Seite verschickt selbst keine Daten. Mit dem Knopf unten öffnet sich " +
      "deine E-Mail-App mit einer fertig ausgefüllten Nachricht an uns. Du siehst " +
      "vorher genau, was übermittelt wird, und schickst sie selbst ab.";
    box.appendChild(p1);

    var dl = document.createElement("dl");
    zeile(dl, "Anliegen", daten.anliegen);
    zeile(dl, "Umfang", daten.umfang);
    if (daten.dringlichkeit) zeile(dl, "Dringlichkeit", daten.dringlichkeit);
    zeile(dl, "Name", daten.name);
    zeile(dl, "E-Mail", daten.email);
    if (daten.sozialtarif) zeile(dl, "Sozialtarif", "gewünscht");
    box.appendChild(dl);

    if (EMPFAENGER) {
      var a = document.createElement("a");
      a.className = "btn";
      a.href = mailtoBauen(daten);
      a.textContent = "E-Mail jetzt öffnen und abschicken";
      box.appendChild(a);
    } else {
      var hinweis = document.createElement("p");
      hinweis.textContent = "Die Empfängeradresse ist derzeit nicht konfiguriert.";
      box.appendChild(hinweis);
    }

    var p2 = document.createElement("p");
    p2.className = "klein";
    p2.style.marginTop = "16px";
    p2.style.marginBottom = "0";
    p2.textContent =
      "Bitte hänge noch keine Unterlagen an. Wie deine Akte sicher zu uns kommt, " +
      "klären wir vorher gemeinsam im Erstgespräch.";
    box.appendChild(p2);

    ziel.appendChild(box);
    box.focus();
  }

  function start() {
    var formular = document.getElementById("anfrage-formular");
    if (!formular) return;
    var ziel = document.getElementById("anfrage-ergebnis");

    formular.setAttribute("novalidate", "novalidate");

    formular.addEventListener("submit", function (e) {
      e.preventDefault();
      var probleme = pruefen(formular);

      if (probleme.length) {
        if (ziel) ziel.textContent = "";
        probleme[0].focus();
        return;
      }

      bestaetigungZeigen(ziel, datenSammeln(formular));
    });

    /* Fehler verschwinden, sobald nachgebessert wird */
    formular.addEventListener("input", function (e) {
      if (e.target.matches("input, select, textarea")) fehlerLoeschen(e.target);
    });
    formular.addEventListener("change", function (e) {
      if (e.target.matches("input, select, textarea")) fehlerLoeschen(e.target);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
