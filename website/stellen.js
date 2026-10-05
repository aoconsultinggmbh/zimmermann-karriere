/* ============================================================================
   STELLEN: Diese Datei ist die einzige Stelle, an der Stellenanzeigen gepflegt
   werden. Die index.html liest sie beim Öffnen aus und baut daraus Stellenkarten,
   Detailansicht, Ampel, Bewerbungsformular und das JobPosting-Schema für Google.

   WARUM .js UND NICHT .json?
   Chrome darf beim Öffnen per Doppelklick (file://) keine Nachbardateien per
   fetch() lesen. Als Skript funktioniert die Datei lokal UND auf dem Server.
   Der Inhalt ist trotzdem reines JSON, nur mit "window.STELLEN =" davor.

   SO WIRD EINE STELLE GEPFLEGT
   - Neue Stelle: einen Block { ... } kopieren, Werte ändern, "slug" muss einmalig
     sein (klein, Bindestriche, keine Umlaute). Der Slug ist Teil der Adresse:
     index.html#/stelle/<slug>
   - Stelle auf Rot setzen (besetzt): "status": "besetzt". Die Karte bleibt sichtbar
     mit rotem Punkt, der Bewerbungsknopf verschwindet, Google bekommt die Stelle
     nicht mehr als offen gemeldet.
   - Stelle ausblenden: "sichtbar": false
   - Initiativ: "status": "initiativ" (gelber Punkt, Formular bleibt offen)
   - Online: "status": "online" (grüner Punkt)
   - "gueltigBis": Datum, bis zu dem die Anzeige bei Google als offen gilt.
     Nach Ablauf wird die Stelle automatisch wie "besetzt" behandelt, bis das
     Datum verlängert wird. Format JJJJ-MM-TT.
   - "gehalt": { "von": 3000, "bis": 3500, "einheit": "MONTH" } oder null.
     Nur eintragen, wenn die Praxis die Zahl freigegeben hat. Sie wird dann auf
     der Detailseite angezeigt und an Google gemeldet.
   - "beschaeftigung": Werte für Google: FULL_TIME, PART_TIME, INTERN, OTHER.
   ============================================================================ */
window.STELLEN = {
  "arbeitgeber": {
    "name": "Gemeinschaftspraxis Dres. Zimmermann",
    "kurz": "Dres. Zimmermann Zahnärzte",
    "strasse": "Rappenstraße 19",
    "plz": "67480",
    "ort": "Edenkoben",
    "region": "Rheinland-Pfalz",
    "land": "DE",
    "telefon": "+49 6323 93434",
    "telefonAnzeige": "+49 6323 93434",
    "email": "info@dres-zimmermann.de",
    "branche": "Zahnarztpraxis",
    "ansprechpartner": "Familie Zimmermann",
    "website": "https://www.zahnaerzte-edenkoben.de",
    "geo": { "lat": 49.2846, "lng": 8.1282 }
  },

  "unternehmensbeschreibung": "Als familiengeführte Zahnarztpraxis stehen bei uns Vertrauen, Menschlichkeit und eine hochwertige zahnmedizinische Versorgung im Mittelpunkt. Mit viel Engagement begleiten wir unsere Patientinnen und Patienten in einer angenehmen Atmosphäre und legen großen Wert auf ein persönliches Miteinander, sowohl im Team als auch im Umgang mit unseren Patienten.",

  "stellen": [
    {
      "slug": "zfa-behandlungsassistenz-prophylaxe",
      "titel": "ZFA / Zahnmedizinische Fachangestellte (m/w/d) Behandlungsassistenz & Prophylaxe",
      "status": "online",
      "sichtbar": true,
      "tags": ["Neu", "ab sofort"],
      "beginn": "ab sofort",
      "anstellung": "Vollzeit, Teilzeit",
      "beschaeftigung": ["FULL_TIME", "PART_TIME"],
      "umfang": "Vollzeit oder Teilzeit",
      "veroeffentlicht": "2026-07-13",
      "gueltigBis": "2027-01-31",
      "gehalt": null,
      "bild": "stelle-zfa-edenkoben-behandlungsassistenz-prophylaxe",
      "bildAlt": "Zahnmedizinische Fachangestellte bei der Prophylaxe-Behandlung in der Praxis Dres. Zimmermann in Edenkoben",
      "kurz": "Assistenz bei zahnärztlichen Behandlungen, Prophylaxe und Patientenbetreuung in einer familiengeführten Praxis mit eigenem CAD/CAM-Labor.",
      "aufgaben": [
        "Assistenz bei zahnärztlichen Behandlungen",
        "Vor- und Aufbereitung von Behandlungsräumen und Instrumenten",
        "Verwaltung von Patientendaten und Terminen",
        "Durchführung von Röntgenaufnahmen",
        "Eigenständige Durchführung professioneller Zahnreinigungen (PZR) nach Qualifikation",
        "Betreuung und Beratung von Patienten im Bereich Prophylaxe und Mundhygiene"
      ],
      "profil": [
        "Abgeschlossene Berufsausbildung als Zahnmedizinische Fachangestellte / ZFA / Zahnarzthelferin (m/w/d)",
        "Idealerweise Erfahrung in der professionellen Zahnreinigung (PZR) oder Interesse, sich in diesem Bereich weiterzuentwickeln",
        "Ein gültiger Röntgenschein ist von Vorteil, aber nicht zwingend erforderlich",
        "Grundkenntnisse mit Computern sind von Vorteil",
        "Kenntnisse über Hygiene- und Sicherheitsstandards in einer Praxis",
        "Freundliches und serviceorientiertes Auftreten sowie Freude am Umgang mit Patienten"
      ],
      "benefits": [
        "Überdurchschnittliche Bezahlung", "Weihnachtsgeld", "Team Frühstück", "Regelmäßige Teambesprechungen",
        "Mitarbeiterevents", "After Work", "Pate / Mentor / Buddy-Programm", "Tankgutscheine",
        "Bonus für das Anwerben neuer Kollegen", "Vermögenswirksame Leistungen", "Kita Zuschuss",
        "Rabattierung auf Hausleistungen", "Selbstverständlich: Wasser, Kaffee, Obst & Süßigkeiten",
        "Einarbeitungsplan", "Weiterbildungsmöglichkeiten", "Freie Wahl der Weiterbildung", "Karrieremöglichkeiten",
        "Wiedereinsteiger & Berufseinsteiger sind willkommen", "Teilzeit Möglichkeiten", "Ergonomische Arbeitsplätze",
        "Gute Parksituation", "Gute Verkehrsanbindung", "Klimatisierter Arbeitsbereich"
      ]
    },
    {
      "slug": "zmv-abrechnung",
      "titel": "Zahnmedizinische Verwaltungsangestellte – ZMV / ZFA für die Abrechnung (m/w/d)",
      "status": "online",
      "sichtbar": true,
      "tags": ["Neu", "ab sofort"],
      "beginn": "ab sofort",
      "anstellung": "Vollzeit, Teilzeit",
      "beschaeftigung": ["FULL_TIME", "PART_TIME"],
      "umfang": "Vollzeit oder Teilzeit",
      "veroeffentlicht": "2026-07-13",
      "gueltigBis": "2027-01-31",
      "gehalt": null,
      "bild": "stelle-zmv-edenkoben-abrechnung-verwaltung",
      "bildAlt": "Zwei Mitarbeiterinnen der Verwaltung an der Rezeption der Zahnarztpraxis Dres. Zimmermann in Edenkoben",
      "kurz": "Heil- und Kostenpläne, zahnmedizinische Abrechnung und Verwaltung in einer modernen, digital arbeitenden Praxis.",
      "aufgaben": [
        "Erstellung von Heil- und Kostenplänen (BEMA/GOZ/BEL/BEB)",
        "Eigenverantwortliche Abwicklung der zahnmedizinischen Abrechnung",
        "Klärung von abrechnungsrelevanten Fragestellungen mit Krankenkassen und Patienten",
        "Verwaltung von Patientendaten und Abrechnungsunterlagen",
        "Zusammenarbeit mit dem Behandlungsteam zur Sicherstellung korrekter Abrechnungsprozesse",
        "Unterstützung bei administrativen Tätigkeiten in der Zahnarztpraxis"
      ],
      "profil": [
        "Abgeschlossene Ausbildung zur Zahnarzthelferin, zahnmedizinische Fachangestellte (ZFA), mit einer Weiterbildung zur ZMV - Zahnmedizinischen Verwaltungsangestellten (m/w/d) oder eine vergleichbare Qualifikation",
        "Fundierte Kenntnisse in der zahnärztlichen Abrechnung, gerne auch mit Erfahrung im Laborbereich",
        "Sicherer Umgang mit Abrechnungssoftware"
      ],
      "benefits": [
        "Überdurchschnittliche Bezahlung", "Weihnachtsgeld", "Team Frühstück", "Regelmäßige Teambesprechungen",
        "Mitarbeiterevents", "After Work", "Pate / Mentor / Buddy-Programm", "Tankgutscheine",
        "Bonus für das Anwerben neuer Kollegen", "Vermögenswirksame Leistungen", "Kita Zuschuss",
        "Rabattierung auf Hausleistungen", "Selbstverständlich: Wasser, Kaffee, Obst & Süßigkeiten",
        "Einarbeitungsplan", "Weiterbildungsmöglichkeiten", "Freie Wahl der Weiterbildung", "Karrieremöglichkeiten",
        "Wiedereinsteiger & Berufseinsteiger sind willkommen", "Teilzeit Möglichkeiten", "Ergonomische Arbeitsplätze",
        "Gute Parksituation", "Gute Verkehrsanbindung", "Klimatisierter Arbeitsbereich"
      ]
    },
    {
      "slug": "ausbildung-zfa",
      "titel": "Ausbildung als ZFA / Zahnmedizinische Fachangestellte (m/w/d)",
      "status": "online",
      "sichtbar": true,
      "tags": ["Ausbildung", "ab 2026"],
      "beginn": "ab 2026",
      "anstellung": "Ausbildung",
      "beschaeftigung": ["OTHER"],
      "umfang": "Ausbildung, Vollzeit",
      "veroeffentlicht": "2026-07-13",
      "gueltigBis": "2027-01-31",
      "gehalt": null,
      "bild": "stelle-ausbildung-zfa-edenkoben",
      "bildAlt": "Auszubildende assistiert bei einer Behandlung in der Zahnarztpraxis Dres. Zimmermann in Edenkoben",
      "kurz": "Abwechslungsreiche Ausbildung mit Assistenz, Prophylaxe und Verwaltung in einem freundlichen, kollegialen Team.",
      "aufgaben": [
        "Eine abwechslungsreiche Ausbildung in einem freundlichen und kollegialen Team",
        "Ein breites Spektrum an Aufgaben im Bereich der Zahnmedizin, inklusive Assistenz bei Behandlungen, Durchführung von Prophylaxemaßnahmen und Verwaltungsaufgaben",
        "Regelmäßige interne Schulungen und Fortbildungen",
        "Die Möglichkeit, eigene Ideen und Vorschläge einzubringen und aktiv an der Gestaltung der Praxis mitzuwirken"
      ],
      "profil": [
        "Ein guter Schulabschluss",
        "Interesse an medizinischen Themen und Freude am Umgang mit Menschen",
        "Eine sorgfältige Arbeitsweise und eine ausgeprägte Serviceorientierung",
        "Gute Deutschkenntnisse in Wort und Schrift"
      ],
      "benefits": [
        "Überdurchschnittliche Bezahlung", "Weihnachtsgeld", "Team Frühstück", "Regelmäßige Teambesprechungen",
        "Mitarbeiterevents", "After Work", "Pate / Mentor / Buddy-Programm", "Tankgutscheine",
        "Bonus für das Anwerben neuer Kollegen", "Vermögenswirksame Leistungen", "Kita Zuschuss",
        "Rabattierung auf Hausleistungen", "Selbstverständlich: Wasser, Kaffee, Obst & Süßigkeiten",
        "Einarbeitungsplan", "Weiterbildungsmöglichkeiten", "Karrieremöglichkeiten", "Ergonomische Arbeitsplätze",
        "Gute Parksituation", "Gute Verkehrsanbindung", "Klimatisierter Arbeitsbereich"
      ]
    },
    {
      "slug": "initiativbewerbung",
      "titel": "Initiativbewerbung (m/w/d)",
      "status": "initiativ",
      "sichtbar": true,
      "tags": ["jederzeit"],
      "beginn": "jederzeit",
      "anstellung": "Vollzeit, Teilzeit",
      "beschaeftigung": ["FULL_TIME", "PART_TIME"],
      "umfang": "nach Absprache",
      "veroeffentlicht": "2026-10-02",
      "gueltigBis": "2027-12-31",
      "gehalt": null,
      "bild": "praxisteam-zfa-edenkoben-zusammenhalt",
      "bildAlt": "Das Praxisteam der Zahnarztpraxis Dres. Zimmermann in Edenkoben steht zusammen",
      "kurz": "Eine Initiativbewerbung ist jederzeit möglich. Wir lassen uns gerne von den eingereichten Fähigkeiten überzeugen.",
      "aufgaben": [],
      "profil": [],
      "benefits": [
        "Überdurchschnittliche Bezahlung", "Regelmäßige Teambesprechungen", "Vermögenswirksame Leistungen",
        "Tankgutscheine", "Gute Verkehrsanbindung", "Weiterbildungsmöglichkeiten", "Mitarbeiterevents",
        "Ergonomische Arbeitsplätze", "Gute Parksituation"
      ]
    }
  ]
};
