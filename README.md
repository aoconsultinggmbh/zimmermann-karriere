# Dres. Zimmermann Zahnärzte, Edenkoben – Karriereseite

Kundenprojekt der AO Consulting GmbH. Entwurf von Ovidiu Rieger (Oktober 2026),
Nachbau des Karriereportals (b3s7f3.myrdbx.io) im Stil der neuen Hauptwebseite.

- **Vorschau:** https://zimmermann-karriere.vorschau.ao-consult.de (Suchmaschinen ausgesperrt)
- **Spätere Domain:** karriere.zahnaerzte-edenkoben.de (Platzhalter, noch nicht bestätigt)
- **Hauptwebseite:** eigenes Projekt `zimmermann-website`

## Aufbau

| Ordner | wofür |
|---|---|
| `website/` | die Seite – nur was hier liegt, geht online. Eine `index.html`, Stellen in `stellen.js`, Unterseiten über die Adresse: `#/stelle/<name>`, `#/impressum`, `#/datenschutz`, `#/gleichstellung` |
| `quelltexte/` | Quelltexte `seite.html`, `stil.css`, `skript.js`, `datenschutz.html` und `bauen.py` |
| `doku/` | Unterlagen: Hinweise aus dem Entwurf (mit Bildzuordnung), Checkliste Livegang |
| `.github/workflows/` | die zwei Abläufe: `vorschau.yml` (main → Vorschau), `livegang.yml` (live → Hoster) |

## Stellen pflegen

Alle Stellen stehen in **`website/stellen.js`**, oben in der Datei steht die Anleitung.
`"status"`: `online` (grün), `initiativ` (gelb), `besetzt` (rot); `"sichtbar": false`
blendet eine Stelle ganz aus; `"gueltigBis"` regelmäßig verlängern (aktuell 31.01.2027).
Dafür muss nichts gebaut werden, die Datei wird direkt von der Seite gelesen.

## Ändern

Änderungen an Text, Stil oder Skript in `quelltexte/` machen, dann im Projektordner
`python3 quelltexte/bauen.py` ausführen. Das setzt `website/index.html`,
`sitemap.xml` und `robots.txt` neu zusammen.

## Die zwei Zweige

- **`main`** = Vorschau. Hier passiert die ganze Arbeit.
- **`live`** = die echte Seite. Erst wenn `live` auf den Stand von `main` gesetzt wird,
  geht etwas zum Hoster. **Nichts geht ohne Freigabe live.**

## Was drin ist, was nicht

- Keine externen Schriften, Skripte oder Tracker. Montserrat liegt lokal.
- Karte lädt erst nach Klick oder Einwilligung. Matomo vorbereitet, aber leer.
- Bewerbungsformular verschickt im Entwurf nichts an einen Server, sondern öffnet das
  E-Mail-Programm (an info@dres-zimmermann.de). Vor dem Livegang entscheiden: PHP-Versand,
  Zapier oder Formulardienst.

## Vor dem Livegang zu erledigen

1. Impressum: Kammer, KZV, berufsrechtliche Regelungen, Vertretungsberechtigte, Bildnachweis (gelb markiert) – Praxis bestätigen lassen.
2. Datenschutz: Hoster (All-Inkl), Matomo, Zapier ja/nein, Formularweg.
3. E-Mail-Adresse klären: info@dres-zimmermann.de (Karriere) oder info@zahnaerzte-edenkoben.de (Hauptseite)?
4. Gehalt: nur eintragen, wenn die Praxis Zahlen freigibt (`"gehalt"` in `stellen.js`).
5. Arbeitszeiten in den Stellen („Mo–Do 8–20, Fr 8–15") widersprechen den Sprechzeiten – klären.
6. Google for Jobs: echte Adressen je Stelle (`/stelle/…/`) statt `#/stelle/…` – `.htaccess`-Umleitung plus eine Zeile in `skript.js`.
7. Domain klären und überall eintragen; Geo-Koordinaten prüfen.
8. Die ganze Liste: `doku/checkliste-livegang.md`.

Keine Passwörter, keine Zugänge, keine Schlüssel in dieses Projekt – es ist öffentlich.
