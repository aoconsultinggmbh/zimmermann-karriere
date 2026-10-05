# Karriereseite Dres. Zimmermann, Edenkoben (Entwurf im neuen Stil)

Stand: 02.10.2026. Nachbau des Karriereportals (b3s7f3.myrdbx.io) im Design der neuen Hauptwebseite (b45p5s.myrdbx.io). Alle Texte, Stellen, Benefits, FAQ und Rechtstexte wurden eins zu eins übernommen.

## Öffnen

Doppelklick auf `index.html`. Die Seite läuft komplett lokal in Chrome, ohne Server. Alle Unterseiten stecken in dieser einen Datei und werden über die Adresse angesteuert:

| Ansicht | Adresse |
|---|---|
| Startseite | `index.html` oder `index.html#/` |
| Sprung zu einem Abschnitt | `index.html#/#benefits`, `#/#faq`, `#/#tippsprozess`, `#/#ueber-uns`, `#/#stellen` |
| Einzelne Stelle | `index.html#/stelle/<slug>` (z. B. `#/stelle/zfa-behandlungsassistenz-prophylaxe`) |
| Impressum, Datenschutz, Gleichstellung | `#/impressum`, `#/datenschutz`, `#/gleichstellung` |

Hinweis für den Doppelklick: Chrome meldet unter `file://` in der Konsole einen CORS-Fehler für die Schrift-Preloads. Das ist eine Eigenart des Protokolls, über HTTP (Vorschau, Livegang) tritt er nicht auf. Die Seite funktioniert trotzdem vollständig.

## Stellen pflegen

Alle Stellen stehen in **`stellen.js`**. Oben in der Datei steht eine Anleitung. Kurzfassung:

- `"status": "online"` = grüner Punkt, Formular offen, Stelle wird an Google gemeldet
- `"status": "initiativ"` = gelber Punkt, Formular offen
- `"status": "besetzt"` = roter Punkt, Titel durchgestrichen, kein Formular, keine Meldung an Google (in der Regel besser `"sichtbar": false`, dann verschwindet die Karte ganz)
- `"gueltigBis"` abgelaufen = automatisch wie besetzt, bis das Datum verlängert wird
- `"sichtbar": false` = Stelle wird gar nicht angezeigt
- `"gehalt"`: nur eintragen, wenn die Praxis die Zahl freigegeben hat (siehe offene Punkte)

Warum `.js` statt `.json`: Chrome darf beim Öffnen per Doppelklick keine Nachbardateien lesen. Als Skript funktioniert die Datei lokal und auf dem Server gleichermaßen. Der Inhalt ist reines JSON mit `window.STELLEN =` davor.

Aus `stellen.js` entstehen automatisch: Stellenkarten mit Ampel (ohne Bild, ohne Filter), Detailseite mit Bewerbungsformular, Zähler auf der Startseite, JobPosting-Schema (JSON-LD) je offener Stelle, Brotkrumen-Schema.

## Aufbau

```
karriere/
  index.html        eine Datei, enthält CSS und JS inline
  stellen.js        Stellen (siehe oben)
  sitemap.xml, robots.txt
  assets/           einwilligung.css/js (Banner), barrierefreiheit.css/js (Widget), AO-Standardbausteine
  fonts/            Montserrat 400/500/600/700, lokal (SIL OFL, Lizenz liegt bei)
  img/              WebP + JPG, SEO-Dateinamen, Logo hell/dunkel, Favicon
  src/              Quelltexte (stil.css, skript.js, seite.html, datenschutz.html) und bauen.py
```

Änderungen an Stil oder Skript bitte in `src/` machen und `python3 src/bauen.py` ausführen, das setzt alles in `index.html` zusammen. Wer nur die `index.html` ändert, verliert die Änderung beim nächsten Bauen.

## CI (von der Hauptwebseite übernommen)

| Element | Wert |
|---|---|
| Hintergrund | #EAE6DF (beige) |
| Text, Knöpfe, dunkle Flächen | #2A333F (slate) |
| Nebentext | #999999, #606266 |
| Karten | weiß, Ecken 0 px, leichter Schatten |
| Schrift | Montserrat, Fließtext 16 px / 1.6, Überschriften Gewicht 500 |
| Knöpfe | eckig, dunkel mit weißer Schrift, Pfeil », Hover invertiert |
| Ampel | Grün #22C55E, Gelb #F59E0B, Rot #EF4444 (wie ao-karriere.de) |

## Was gegenüber dem alten Portal bewusst anders ist

- **Hero** geteilt: Text links auf dunklem Grund, Teambild rechts ohne Text darüber, damit bei keiner Bildschirmgröße Schrift auf Gesichtern liegt. Darunter drei weiße Karten (Offene Stellen, Ansprechpartner, Arbeitsort). Auf Handy steht das Bild über dem Text.
- **Initiativbewerbung** als eigene Karte mit gelber Ampel. Gewünscht war, dass Stellen als initiativ gekennzeichnet werden können; im alten Portal gab es dafür nur die FAQ-Antwort.
- **Eine zusätzliche FAQ** „Wo befindet sich die Zahnarztpraxis Dres. Zimmermann in Edenkoben?“ mit Adresse und Kontakt. Pflicht nach dem AO-Standard (Ortsbezug, zitierfähiger Absatz für die lokale Suche).
- **Formular**: Verschickt im Entwurf nichts an einen Server. Nach der Pflichtfeldprüfung öffnet sich das E-Mail-Programm mit allen Angaben an info@dres-zimmermann.de, die Danke-Ansicht erscheint. Dateien hängt der Bewerber in der E-Mail an. Vor dem Livegang entscheiden: so lassen, Zapier wieder anbinden oder Formulardienst.
- **Google Analytics** aus dem alten Portal wurde durch **Matomo** ersetzt (lädt erst nach Einwilligung, Cookies deaktiviert, IP gekürzt). URL und Site-ID stehen oben in `src/skript.js` (`MATOMO_URL`, `MATOMO_SITE_ID`) und sind leer, solange nichts eingetragen ist, wird nichts geladen.
- **Google Fonts** entfallen, Montserrat liegt lokal. **reCAPTCHA** entfällt (kein Serverformular). **Borlabs** entfällt, Einwilligung läuft über den AO-Banner (localStorage, kein Cookie).
- **Karte** lädt erst nach Klick oder Zustimmung im Banner (Zwei-Klick-Lösung).

## Google, SEO, Geo

- JobPosting-Schema je offener Stelle, auf der Startseite als ItemList, auf der Detailseite einzeln. Dentist/LocalBusiness-Schema mit Adresse, Telefon, Sprechzeiten (von der Hauptwebseite) und Geo-Koordinaten. FAQPage-Schema deckungsgleich mit dem sichtbaren Text. BreadcrumbList auf Stellenseiten.
- Title, Description, Canonical, Open Graph und Twitter Cards wechseln je Ansicht.
- `sitemap.xml` und `robots.txt` liegen bei, Platzhalter für die Search-Console-Verifizierung steht im `<head>`.
- **Wichtig für Google for Jobs:** Google indexiert Hash-Adressen (`#/stelle/...`) nicht als eigene Seiten. Für den Livegang braucht jede Stelle eine echte Adresse (z. B. `/stelle/zfa-behandlungsassistenz-prophylaxe/`). Das geht mit einer kleinen Server-Umleitung (.htaccess) auf die `index.html` plus Umstellung von Hash- auf Pfad-Routing in `src/skript.js` (eine Zeile). Bis dahin bekommt Google alle Stellen über das ItemList-Schema auf der Startseite.
- Canonical-Domain ist als Platzhalter `https://karriere.zahnaerzte-edenkoben.de/` eingetragen (Konstante `BASIS` in `src/skript.js` und im `<head>`). Vor dem Livegang auf die echte Domain ändern.

## Barrierefreiheit

AO-Widget unten rechts (Kontrast, Schriftgröße, Lesehilfen, speichert in localStorage). Dazu im Markup: Sprunglinks, Fokusringe, `aria-expanded` am Burger, Escape schließt Menü und Lightbox, genau eine h1 je Ansicht, FAQ-Fragen als echte Überschriften im `summary`, Alt-Texte an allen Bildern, `prefers-reduced-motion`, Bedienelemente mindestens 44 px.

## Bilder

Alle Fotos stammen aus den **grün markierten** Picdrop-Bildern (102 Dateien, Ordner `_transport/zimmermann-src/picdrop`). Bearbeitete Versionen (Endung `-2`) wurden bevorzugt. Zuordnung alt → neu:

| Stelle auf der Seite | Picdrop |
|---|---|
| Hero (Team) | 435 |
| Was uns ausmacht | 353-2 |
| Galerie (12) | 205, 269, 299, 401, 389, 451, 359-2, 412, 441, 423, 207, 258 |
| Ansprechpartner (Familie Zimmermann) | 192 |
| Prozess: Bewerben, Telefonat, Kennenlerntag, Schnuppertag | 204-2, 213, 393, 454 |
| Stellen-Detailseiten: ZFA, ZMV, Ausbildung, Initiativ | 414, 200, 418-2, 441 |

Das Teambild mit den Ärzten (2-2, 5-2) wird auf der Hauptwebseite verwendet, auf der Karriereseite das Team der Mitarbeiterinnen (435), wie im alten Portal. Bilder liegen als WebP (Qualität 82) und JPG (80), lange Kante 1800 px, mit `<picture>`.

## Offene Punkte vor dem Livegang

1. **Impressum**: Kammer, KZV, berufsrechtliche Regelungen, Vertretungsberechtigte, Bildnachweis fehlen auf beiden bestehenden Seiten. Im Entwurf gelb markiert mit Vorschlag (Landeszahnärztekammer Rheinland-Pfalz), bitte von der Praxis bestätigen.
2. **Datenschutz**: Hoster nach Umzug (ALL-INKL statt Raidboxes), Matomo-Hosting, Zapier ja/nein, Formularweg. Gelb markiert.
3. **E-Mail-Adresse**: Karriereportal nutzt info@dres-zimmermann.de, Hauptwebseite info@zahnaerzte-edenkoben.de. Übernommen wurde die Karriere-Adresse. Bitte klären, welche gelten soll.
4. **Gehalt**: Das alte Portal meldete Google 3.000 bis 3.500 € für alle drei Stellen, auch für die Ausbildung, ohne es sichtbar anzuzeigen. Das wirkt wie eine Plugin-Vorgabe und wurde nicht übernommen (`"gehalt": null`). Wenn die Praxis Zahlen freigibt, in `stellen.js` eintragen, dann erscheinen sie auf der Detailseite und im Schema.
5. **Gültig bis**: Das alte Portal hatte 13.10.2026 (läuft in Kürze ab). Hier auf 31.01.2027 gesetzt, bitte regelmäßig verlängern.
6. **Geo-Koordinaten** (49.2847, 8.1310) sind geschätzt für Rappenstraße 19, bitte in Google Maps prüfen.
7. **Domain und Pfad-Routing** für Google for Jobs (siehe oben).
8. **Sprechzeiten** im Schema stammen von der Hauptwebseite. Die Stellenanzeigen nannten „Mo bis Do 8 bis 20 Uhr, Fr 8 bis 15 Uhr“ als Arbeitszeit, das widerspricht sich; bitte klären.
9. Fotos: Namen einzelner Mitarbeitender stehen nicht auf der Seite. Die Alt-Texte nennen nur die Ärzte (Familie Zimmermann), wie auf der Hauptwebseite.

## Geprüft

Playwright bei 1920, 1440, 1240, 1024, 768 und 390 px: kein horizontales Scrollen, Burger ab 860 px, genau eine h1 je Ansicht, lückenlose Überschriften, keine defekten Bilder, alle Bilder mit Alt-Text, JSON-LD gültig, keine Konsolenfehler, **keine Anfrage an einen fremden Host vor der Einwilligung**, Banner-Knöpfe gleich groß auf einer Zeile, Formular prüft Pflichtfelder.

## Änderungen 03.10.2026

Hero geteilt statt Text auf dem Bild, Knöpfe kräftiger (gefüllt, bleiben beim Hover gefüllt), Stellenkarten ohne Bild, Filter nach Status entfernt, „Stellenangebote“ springt zum Abschnitt statt auf eine eigene Ansicht, Veröffentlichungs- und Gültigkeitsdatum auf der Detailseite ausgeblendet (bleiben im Google-Schema).

## Funktionsprüfung 03.10.2026

Automatisch geprüft: Banner blockiert vor Entscheidung, Karte lädt erst nach Klick, Cookie-Einstellungen aus der Fußzeile, alle Menüpunkte (Anker) und Fußzeilen-Links, Logo zur Startseite, Stellenkarten mit Ampel, Detailseite mit JobPosting-Schema und ohne sichtbares Datum, „Direkt bewerben“ scrollt zum Formular, Formular leer (Fehler) und gefüllt (Danke), „Zurück zu den Stellen“, unbekannte Stelle zeigt Hinweis, alte Adresse #/stellen leitet um, Galerie-Lightbox öffnet und schließt, Burger-Menü, Title und Description in Google-Länge, eine h1 je Ansicht, JSON-LD gültig, Bilder mit Maßen und Alt, keine toten Anker, keine Konsolenfehler. Title und Description wurden auf Google-Länge gekürzt, Schema um hasMap und areaServed ergänzt.
