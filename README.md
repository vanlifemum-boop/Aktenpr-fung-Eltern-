# Aktenlage

Website für den Aktenprüfungs-Service für betroffene Eltern.

**Claim:** Entschieden wird nach Aktenlage. Also sollte jemand die Akte gelesen haben.

Statische Website, kein Build-Schritt, keine Abhängigkeiten. Reines HTML, ein Stylesheet
und drei JavaScript-Dateien. Es wird nichts von fremden Servern geladen.

## Grundregel

Das eingesetzte Prüfverfahren wird **nicht veröffentlicht** — weder auf dieser Website noch in
diesem Repository, noch in Werbetexten oder Blogartikeln. Beschrieben wird ausschließlich das
Ergebnis, das die auftraggebende Person bekommt. Bitte diese Regel bei jeder Änderung mitdenken.

## Aufbau

```
index.html            Startseite
ablauf.html           So läuft eine Prüfung ab
angebote.html         Angebote und Pakete
sozialtarif.html      Sozialtarif und Spendentopf
vertraulichkeit.html  Vertraulichkeit und Datenweg
fragen.html           Fragen und Antworten
anfrage.html          Anfrageformular
impressum.html        Pflichtangaben        (noindex)
datenschutz.html      Datenschutzerklärung  (noindex)
agb.html              Geschäftsbedingungen  (noindex)
404.html              Fehlerseite

css/styles.css        gesamtes Designsystem
js/shader-hero.js     WebGL-Animation im Startseiten-Hero
js/main.js            Menü, Einblenden, aktiver Link, Hinweisleiste, Jahreszahl
js/anfrage.js         Formularprüfung und vorausgefüllte E-Mail
favicon.svg           Bildmarke
img/logo.svg          Wort-Bild-Marke für Briefpapier, Social Media und Ähnliches
```

Kopf- und Fußzeile sind auf allen Seiten identisch. Wird dort etwas geändert, muss es in **allen**
HTML-Dateien nachgezogen werden — es gibt bewusst keinen Build-Schritt.

## Marke

| | |
|---|---|
| Nacht | `#070914` |
| Papier | `#f6f7fc` |
| Papier dunkler | `#eceff8` |
| Tinte | `#15182d` |
| Electric Blue | `#35c8ff` |
| Violett | `#7357ff` |
| Pink | `#ff5ca8` |
| Schrift | System-Sans für Text und Überschriften; keine Webfonts |

Die Bildmarke sind drei versetzte Balken: Aktenschichten, der mittlere steht als Karteireiter
hervor. Das Gestaltungssystem verbindet eine dunkle, technisch präzise Bühne mit elektrischen
Akzentfarben, klaren Rastern und Statusmarken. Die Startseite folgt bewusst der Dramaturgie
Versprechen → Problem → Ergebnis → Abgrenzung → Ablauf → Anfrage.

## Lokal ansehen

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Veröffentlichen

**Adresse:** https://jugendamtsakte-pruefen.pro/

GitHub Pages ist eingerichtet: Quelle „Deploy from a branch", Branch `main`, Ordner `/` (root),
eigene Domain über `CNAME`, HTTPS erzwungen. `.nojekyll` verhindert die Jekyll-Verarbeitung.
Alle Pfade im Projekt sind relativ, die Seite läuft damit unter jeder Adresse.

**Jeder Push auf `main` veröffentlicht.** Einen Build von Hand gibt es nicht — wer die Quelle in den
Einstellungen umstellt, muss danach einmal pushen, sonst bleibt die alte Auslieferung stehen
beziehungsweise es wird gar nichts ausgeliefert.

Die Datei `CNAME` bindet die eigene Domain. Damit sie greift, müssen beim Registrar die
DNS-Einträge auf GitHub Pages zeigen — die konkreten Werte zeigt GitHub unter
**Settings → Pages** an. Solange das nicht steht, ist die Seite unter keiner Adresse erreichbar:
`CNAME` schaltet die github.io-Adresse auf Weiterleitung. Wer die Seite übergangsweise unter
github.io braucht, löscht `CNAME` wieder.

## Suchmaschinen-Sperre (aktuell aktiv)

Der sichtbare Vorschauhinweis ist abgeschaltet. Die sieben Inhaltsseiten bleiben bis zur
endgültigen Freigabe über `<meta name="robots" content="noindex, nofollow" />` und `robots.txt`
für Suchmaschinen gesperrt.

**Zur endgültigen Freigabe:**

1. In den sieben Inhaltsseiten die Zeile
   `<meta name="robots" content="noindex, nofollow" />` löschen —
   **nicht** in `impressum.html`, `datenschutz.html`, `agb.html` und `404.html`,
   die sollen dauerhaft auf `noindex` bleiben
2. In `robots.txt` den oberen Block durch den auskommentierten unteren ersetzen

## Vor dem Livegang ausfüllen

Alle offenen Stellen sind im Quelltext als `[PLATZHALTER: …]` markiert und auf der Seite sichtbar
umrandet. Suchen mit:

```bash
grep -rn "PLATZHALTER" --include="*.html" --include="*.js" --include="*.txt" --include="*.xml" .
```

Mindestens nötig:

- **Impressum** und **Datenschutzerklärung** vor dem Livegang rechtlich prüfen lassen und bei neuen
  Dienstleistern oder Datenflüssen aktualisieren
- **AGB** anwaltlich prüfen lassen, Widerrufsbelehrung ergänzen
- Fristen in `ablauf.html` und `vertraulichkeit.html`
- Bei eigener Domain: Adresse in `sitemap.xml` und `robots.txt` ersetzen
- Eingesetzten Übermittlungsdienst in `vertraulichkeit.html`
- Bankverbindung für den Spendentopf in `sozialtarif.html`

## Bilder

Noch keine externen Bilddateien. Der animierte Hero wird in `js/shader-hero.js` direkt mit WebGL
gerendert; bei fehlender WebGL-Unterstützung greift ein CSS-Hintergrund. Die Berichtsvorschau ist
vollständig in HTML und CSS gebaut. Es gibt keine Menschen, Gesichter oder echten Falldokumente.
