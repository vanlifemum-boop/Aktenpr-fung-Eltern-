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

**Adresse:** https://vanlifemum-boop.github.io/aktenlage/

GitHub Pages, Quelle: Branch `main`, Ordner `/` (root). `.nojekyll` ist vorhanden. Alle Pfade im
Projekt sind relativ, die Seite läuft deshalb auch im Unterverzeichnis einer Projekt-Page.

Einschalten unter **Settings → Pages → Source: „Deploy from a branch" → `main` / `(root)`**.

Eigene Domain später: Datei `CNAME` mit der Domain als einziger Zeile anlegen, DNS beim Registrar
auf GitHub Pages zeigen lassen — und die Adresse in `sitemap.xml` und `robots.txt` ersetzen.
GitHub leitet die alte github.io-Adresse danach automatisch weiter.

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
