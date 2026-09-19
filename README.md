# Aktenlage

Website für den Aktenprüfungs-Service für betroffene Eltern.

**Claim:** Entschieden wird nach Aktenlage. Also sollte jemand die Akte gelesen haben.

Statische Website, kein Build-Schritt, keine Abhängigkeiten. Reines HTML, ein Stylesheet,
zwei kleine JavaScript-Dateien. Es wird nichts von fremden Servern geladen.

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
| Papier | `#faf7f2` |
| Papier dunkler | `#f2ece2` |
| Tinte | `#17181a` |
| Signal | `#c8471c` |
| Marker | `#ffe08a` |
| Schrift | Systemschrift, kein Webfont |

Die Bildmarke sind drei versetzte Balken: Aktenschichten, der mittlere steht als Karteireiter
hervor. Der Textmarker-Effekt (`.mark`) ist das wiederkehrende Gestaltungselement.

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

## Vorschau-Modus (aktuell aktiv)

Die Seite ist absichtlich **für Suchmaschinen gesperrt** und zeigt auf jeder Seite oben einen
Hinweis, dass sie noch nicht in Betrieb ist — weil Impressum und Datenschutzerklärung noch
unvollständig sind.

Alles, was dazugehört, ist im Quelltext mit dem Wort `VORSCHAU` markiert:

```bash
grep -rn "VORSCHAU" --include="*.html" --include="*.css" --include="*.txt" .
```

**Zum Abschalten, wenn die Pflichtangaben stehen:**

1. In den sieben Inhaltsseiten je den `VORSCHAU`-Kommentar mit der Zeile
   `<meta name="robots" content="noindex, nofollow" />` löschen —
   **nicht** in `impressum.html`, `datenschutz.html`, `agb.html` und `404.html`,
   die sollen dauerhaft auf `noindex` bleiben
2. In denselben Seiten den Block `<div class="vorschau">…</div>` löschen
3. In `css/styles.css` den Abschnitt „Vorschau-Banner" löschen
4. In `robots.txt` den oberen Block durch den auskommentierten unteren ersetzen

## Vor dem Livegang ausfüllen

Alle offenen Stellen sind im Quelltext als `[PLATZHALTER: …]` markiert und auf der Seite sichtbar
umrandet. Suchen mit:

```bash
grep -rn "PLATZHALTER" --include="*.html" --include="*.js" --include="*.txt" --include="*.xml" .
```

Mindestens nötig:

- **Impressum** und **Datenschutzerklärung** vollständig ausfüllen (ohne diese Angaben nicht live gehen)
- **AGB** anwaltlich prüfen lassen, Widerrufsbelehrung ergänzen
- E-Mail-Adresse in `anfrage.html` (`window.ANFRAGE_CONFIG.email`) — ohne sie zeigt das Formular
  nur einen Hinweis statt der fertigen E-Mail
- Preise in `angebote.html`, Fristen in `ablauf.html` und `vertraulichkeit.html`
- Bei eigener Domain: Adresse in `sitemap.xml` und `robots.txt` ersetzen
- Eingesetzten Übermittlungsdienst in `vertraulichkeit.html`
- Bankverbindung für den Spendentopf in `sozialtarif.html`

## Bilder

Noch keine. Die Flächen sind bis dahin rein per CSS gebaut (`.aktenblatt`). Geplant sind
abstrakt-grafische Motive in der Markenpalette — keine Menschen, keine Gesichter, keine lesbaren
Dokumente.
