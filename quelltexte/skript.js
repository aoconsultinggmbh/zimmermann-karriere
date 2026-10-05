(function () {
  'use strict';

  var D = window.STELLEN || { stellen: [], arbeitgeber: {} };
  var AG = D.arbeitgeber || {};
  var BASIS = 'https://karriere.zahnaerzte-edenkoben.de/';   // Canonical, vor Livegang prüfen
  var MATOMO_URL = '';      // z. B. 'https://matomo.ao-consult.de/' (mit Schrägstrich am Ende). Leer = kein Tracking.
  var MATOMO_SITE_ID = '';  // z. B. '12'

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function bild(name, alt, extra) {
    return '<picture><source srcset="img/' + name + '.webp" type="image/webp"><img src="img/' + name + '.jpg" alt="' + esc(alt) + '" width="1800" height="1200" loading="lazy" decoding="async"' + (extra || '') + '></picture>';
  }
  function datumDe(iso) {
    if (!iso) return '';
    var t = iso.split('-'); return t[2] + '.' + t[1] + '.' + t[0];
  }
  function heute() { return new Date().toISOString().slice(0, 10); }

  /* ---------- Status / Ampel ---------- */
  function statusVon(s) {
    if (s.status === 'besetzt') return 'besetzt';
    if (s.gueltigBis && s.gueltigBis < heute()) return 'besetzt';   // abgelaufen = wie besetzt
    return s.status === 'initiativ' ? 'initiativ' : 'online';
  }
  var AMPEL_TEXT = { online: 'Online', initiativ: 'Initiativ bewerben', besetzt: 'Besetzt' };
  function ampel(st) { return '<span class="ampel ampel--' + st + '">' + AMPEL_TEXT[st] + '</span>'; }
  function sichtbare() { return (D.stellen || []).filter(function (s) { return s.sichtbar !== false; }); }

  /* ---------- Stellenliste ---------- */
  function karteStelle(s, tag) {
    tag = tag || 'h3';
    var st = statusVon(s);
    var tags = (s.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
    var knopf = st === 'besetzt' ? '<span class="knopf knopf--umriss knopf--ohne" aria-hidden="true">Besetzt</span>' : '<span class="knopf">Stelle ansehen</span>';
    return '<a class="stelle stelle--' + st + '" href="#/stelle/' + esc(s.slug) + '" data-status="' + st + '" aria-label="' + esc(s.titel) + ', ' + AMPEL_TEXT[st] + '">' +
      '<div class="text"><div class="meta">' + ampel(st) + tags + '</div>' +
      '<' + tag + '>' + esc(s.titel) + '</' + tag + '>' +
      '<p class="ort">' + esc(AG.ort) + ', ' + esc(s.anstellung) + '</p></div>' +
      '<div class="aktion">' + knopf + '</div></a>';
  }
  function zeichneListe(container, filter) {
    if (!container) return;
    var tag = container.id === 'stellen-liste-2' ? 'h2' : 'h3';
    var alle = sichtbare();
    var liste = alle.filter(function (s) { return filter === 'alle' || statusVon(s) === filter; });
    container.innerHTML = liste.length ? liste.map(function (s) { return karteStelle(s, tag); }).join('') : '<div class="stelle stelle--leer">Aktuell keine Stelle mit diesem Status. Eine Initiativbewerbung ist jederzeit möglich.</div>';
  }
  function bindeFilter(filterEl, listeEl) {
    if (!filterEl) return;
    $$('button', filterEl).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', filterEl).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        zeichneListe(listeEl, b.getAttribute('data-filter'));
      });
    });
  }
  function zaehler() {
    var el = $('#stellen-zaehler'); if (!el) return;
    var n = sichtbare().filter(function (s) { return statusVon(s) === 'online'; }).length;
    el.innerHTML = n === 1 ? 'Aktuell ist <strong>eine Stelle online</strong>. Initiativbewerbungen sind jederzeit willkommen.'
      : 'Aktuell sind <strong>' + n + ' Stellen online</strong>. Initiativbewerbungen sind jederzeit willkommen.';
  }

  /* ---------- Detailansicht ---------- */
  function liste(arr) { return arr && arr.length ? '<ul>' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : ''; }
  function gehaltText(g) {
    if (!g || !g.von) return '';
    var e = { MONTH: 'pro Monat', YEAR: 'pro Jahr', HOUR: 'pro Stunde' }[g.einheit] || '';
    var f = function (n) { return n.toLocaleString('de-DE'); };
    return f(g.von) + (g.bis ? ' bis ' + f(g.bis) : '') + ' € ' + e;
  }
  function zeichneDetail(slug) {
    var s = sichtbare().filter(function (x) { return x.slug === slug; })[0];
    var box = $('#detail');
    if (!s) {
      box.innerHTML = '<div class="detail-haupt"><h1>Diese Stelle gibt es nicht mehr</h1><p>Vielleicht ist sie inzwischen besetzt. Alle aktuellen Stellen findest Du in der <a href="#/stellen">Übersicht</a>.</p></div>';
      return null;
    }
    var st = statusVon(s);
    var tags = (s.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
    var offen = st !== 'besetzt';
    var h = '<div class="detail-haupt">' +
      '<div class="bild">' + bild(s.bild, s.bildAlt || s.titel, ' fetchpriority="high"').replace(' loading="lazy"', '') + '</div>' +
      '<h1>' + esc(s.titel) + '</h1>' +
      '<div class="meta">' + ampel(st) + tags + '</div>' +
      (offen ? '<a class="knopf" href="#bewerbung" data-direkt>Direkt bewerben</a>' : '<p class="einleitung" style="margin:0 0 10px"><strong>Diese Stelle ist bereits besetzt.</strong> Eine <a href="#/stelle/initiativbewerbung">Initiativbewerbung</a> ist jederzeit möglich.</p>') +
      '<h2>Unternehmensbeschreibung</h2><p>' + esc(D.unternehmensbeschreibung) + '</p>' +
      (s.aufgaben && s.aufgaben.length ? '<h2>Dein Aufgabenbereich</h2>' + liste(s.aufgaben) : '') +
      (s.profil && s.profil.length ? '<h2>Dein Profil</h2>' + liste(s.profil) : '') +
      (s.slug === 'initiativbewerbung' ? '<h2>Deine Initiativbewerbung</h2><p>' + esc(s.kurz) + ' Schreib uns, in welchem Bereich Du Dich siehst und ab wann Du starten könntest.</p>' : '') +
      (s.benefits && s.benefits.length ? '<h2>Freue Dich auf</h2><div class="chips">' + s.benefits.map(function (b) { return '<span>' + esc(b) + '</span>'; }).join('') + '</div>' : '') +
      (offen ? formular(s) : '') +
      '</div>';
    var g = gehaltText(s.gehalt);
    var seite = '<aside class="seite-box" aria-label="Eckdaten zur Stelle">' +
      '<h2>Ansprechpartner</h2>' + bild('familie-zimmermann-zahnaerzte-edenkoben', 'Familie Zimmermann, Ansprechpartner für Bewerbungen') +
      '<p style="margin:0"><strong>' + esc(AG.ansprechpartner) + '</strong><br><a href="mailto:' + esc(AG.email) + '">' + esc(AG.email) + '</a><br><a href="tel:' + esc(AG.telefon.replace(/\s/g, '')) + '">' + esc(AG.telefonAnzeige) + '</a></p>' +
      '<dl><dt>Status</dt><dd>' + ampel(st) + '</dd>' +
      '<dt>Anstellung</dt><dd>' + esc(s.anstellung) + '</dd>' +
      '<dt>Beginn</dt><dd>' + esc(s.beginn) + '</dd>' +
      (g ? '<dt>Gehalt</dt><dd>' + esc(g) + '</dd>' : '') +
      '<dt>Branche</dt><dd>' + esc(AG.branche) + '</dd>' +
      '<dt>Arbeitsort</dt><dd>' + esc(AG.strasse) + ', ' + esc(AG.plz) + ' ' + esc(AG.ort) + ', ' + esc(AG.region) + ', Deutschland</dd>' +
      '</dl>' +
      (offen ? '<a class="knopf direkt" href="#bewerbung" data-direkt>Direkt bewerben</a>' : '') +
      '</aside>';
    box.innerHTML = h + seite;
    $('#krume-stelle').textContent = s.titel;
    $$('[data-direkt]', box).forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); var f = $('#bewerbung'); if (f) { f.scrollIntoView({ behavior: 'smooth', block: 'start' }); var erst = $('input', f); if (erst) setTimeout(function () { erst.focus({ preventScroll: true }); }, 500); } });
    });
    bindeFormular(s);
    return s;
  }

  /* ---------- Formular (Entwurf: übergibt an das E-Mail-Programm) ---------- */
  function formular(s) {
    return '<form class="formular" id="bewerbung" novalidate aria-labelledby="form-titel">' +
      '<h2 id="form-titel">Bewerbungsformular</h2>' +
      '<p class="einleitung" style="margin:0 0 20px;max-width:none">Unterlagen parat? Falls nicht, kann auch ohne Unterlagen Kontakt aufgenommen werden. Felder mit <span class="pflicht" aria-hidden="true">*</span> sind Pflichtfelder.</p>' +
      '<div class="zwei-felder">' +
      '<div class="feld"><label for="f-vorname">Vorname <span class="pflicht" aria-hidden="true">*</span></label><input id="f-vorname" name="vorname" type="text" autocomplete="given-name" required aria-required="true"><span class="fehler" id="f-vorname-fehler">Bitte Vornamen eintragen.</span></div>' +
      '<div class="feld"><label for="f-nachname">Nachname <span class="pflicht" aria-hidden="true">*</span></label><input id="f-nachname" name="nachname" type="text" autocomplete="family-name" required aria-required="true"><span class="fehler">Bitte Nachnamen eintragen.</span></div>' +
      '<div class="feld"><label for="f-email">E-Mail <span class="pflicht" aria-hidden="true">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" required aria-required="true"><span class="fehler">Bitte eine gültige E-Mail-Adresse eintragen.</span></div>' +
      '<div class="feld"><label for="f-telefon">Telefonnummer <span class="pflicht" aria-hidden="true">*</span></label><input id="f-telefon" name="telefon" type="tel" autocomplete="tel" required aria-required="true" placeholder="+49 "><span class="fehler">Bitte Telefonnummer eintragen.</span></div>' +
      '</div>' +
      '<div class="feld"><label for="f-unterlagen">Unterlagen (Lebenslauf, Zeugnisse)</label><input id="f-unterlagen" name="unterlagen" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"><span class="fehler"></span><small style="color:var(--grau)">Dateien können im nächsten Schritt direkt an die E-Mail angehängt werden.</small></div>' +
      '<div class="feld"><label for="f-nachricht">Fragen, Anregungen etc.</label><textarea id="f-nachricht" name="nachricht"></textarea></div>' +
      '<label class="zustimmung"><input type="checkbox" id="f-zustimmung" required aria-required="true"><span>Durch das Absenden des Formulars erfolgt die Zustimmung zur Speicherung der Daten gemäß der <a href="#/datenschutz">Datenschutzerklärung</a>. <span class="pflicht" aria-hidden="true">*</span></span></label>' +
      '<span class="fehler" id="f-zustimmung-fehler" style="display:none;color:#B91C1C;font-size:.875rem;margin:-12px 0 14px">Bitte der Datenschutzerklärung zustimmen.</span>' +
      '<button class="knopf" type="submit">Absenden</button>' +
      '<div class="danke" id="danke" role="status">' +
      '<strong>Vielen Dank für Deine Bewerbung!</strong><br>Dein E-Mail-Programm hat sich mit allen Angaben geöffnet. Bitte dort noch Deine Unterlagen anhängen und absenden. Wir melden uns schnellstmöglich bei Dir. Falls sich kein Fenster geöffnet hat, schreib uns direkt an <a href="mailto:' + esc(AG.email) + '">' + esc(AG.email) + '</a>.' +
      '</div></form>';
  }
  function bindeFormular(s) {
    var f = $('#bewerbung'); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('.feld', f).forEach(function (feld) {
        var inp = $('input,textarea', feld); if (!inp || !inp.required) return;
        var gut = inp.value.trim().length > 1 && (inp.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value));
        feld.classList.toggle('hat-fehler', !gut);
        inp.setAttribute('aria-invalid', gut ? 'false' : 'true');
        if (!gut) ok = false;
      });
      var z = $('#f-zustimmung'); var zf = $('#f-zustimmung-fehler');
      zf.style.display = z.checked ? 'none' : 'block';
      if (!z.checked) ok = false;
      if (!ok) { var erster = $('.hat-fehler input, .hat-fehler textarea', f) || z; erster.focus(); return; }
      var body = 'Bewerbung: ' + s.titel + '\n\n' +
        'Name: ' + $('#f-vorname').value.trim() + ' ' + $('#f-nachname').value.trim() + '\n' +
        'E-Mail: ' + $('#f-email').value.trim() + '\n' +
        'Telefon: ' + $('#f-telefon').value.trim() + '\n\n' +
        ($('#f-nachricht').value.trim() ? 'Nachricht:\n' + $('#f-nachricht').value.trim() + '\n\n' : '') +
        'Zustimmung zur Datenschutzerklärung erteilt am ' + datumDe(heute()) + '.\n' +
        '(Unterlagen bitte an diese E-Mail anhängen.)';
      window.location.href = 'mailto:' + AG.email + '?subject=' + encodeURIComponent('Bewerbung: ' + s.titel) + '&body=' + encodeURIComponent(body);
      $('#danke').setAttribute('data-an', 'true');
      $('#danke').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      spur('Bewerbung', 'Formular abgesendet', s.titel);
    });
  }

  /* ---------- Strukturierte Daten (Google for Jobs, Organisation, FAQ) ---------- */
  function jobPosting(s) {
    var st = statusVon(s);
    var j = {
      '@context': 'https://schema.org', '@type': 'JobPosting',
      'title': s.titel,
      'description': '<p>' + esc(D.unternehmensbeschreibung) + '</p>' +
        (s.aufgaben && s.aufgaben.length ? '<h3>Dein Aufgabenbereich</h3><ul>' + s.aufgaben.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
        (s.profil && s.profil.length ? '<h3>Dein Profil</h3><ul>' + s.profil.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
        (s.benefits && s.benefits.length ? '<h3>Freue Dich auf</h3><ul>' + s.benefits.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : ''),
      'identifier': { '@type': 'PropertyValue', 'name': AG.name, 'value': s.slug },
      'datePosted': s.veroeffentlicht,
      'validThrough': s.gueltigBis ? s.gueltigBis + 'T23:59:59+01:00' : undefined,
      'employmentType': s.beschaeftigung,
      'hiringOrganization': { '@type': 'Organization', 'name': AG.name, 'sameAs': AG.website, 'logo': BASIS + 'img/zimmermann-logo.png' },
      'jobLocation': { '@type': 'Place', 'address': { '@type': 'PostalAddress', 'streetAddress': AG.strasse, 'addressLocality': AG.ort, 'addressRegion': AG.region, 'postalCode': AG.plz, 'addressCountry': AG.land } },
      'industry': AG.branche,
      'directApply': true,
      'url': BASIS + '#/stelle/' + s.slug,
      'responsibilities': (s.aufgaben || []).join('; ') || undefined,
      'qualifications': (s.profil || []).join('; ') || undefined,
      'jobBenefits': (s.benefits || []).join('; ') || undefined
    };
    if (s.gehalt && s.gehalt.von) {
      j.baseSalary = { '@type': 'MonetaryAmount', 'currency': 'EUR', 'value': { '@type': 'QuantitativeValue', 'minValue': s.gehalt.von, 'maxValue': s.gehalt.bis || s.gehalt.von, 'unitText': s.gehalt.einheit || 'MONTH' } };
    }
    if (st === 'initiativ') { j.employmentType = s.beschaeftigung; j.title = s.titel; }
    return j;
  }
  function setzeSchema(id, obj) {
    var alt = document.getElementById(id); if (alt) alt.remove();
    if (!obj) return;
    var sc = document.createElement('script'); sc.type = 'application/ld+json'; sc.id = id;
    sc.textContent = JSON.stringify(obj, function (k, v) { return v === undefined ? undefined : v; });
    document.head.appendChild(sc);
  }
  function schemaStart() {
    var offene = sichtbare().filter(function (s) { return statusVon(s) !== 'besetzt'; });
    setzeSchema('ld-org', {
      '@context': 'https://schema.org', '@type': 'Dentist', '@id': BASIS + '#praxis',
      'name': AG.name, 'url': BASIS, 'image': BASIS + 'img/zahnarztpraxis-edenkoben-praxisteam-zfa-karriere.jpg',
      'logo': BASIS + 'img/zimmermann-logo.png', 'telephone': AG.telefon, 'email': AG.email,
      'address': { '@type': 'PostalAddress', 'streetAddress': AG.strasse, 'addressLocality': AG.ort, 'addressRegion': AG.region, 'postalCode': AG.plz, 'addressCountry': AG.land },
      'geo': AG.geo ? { '@type': 'GeoCoordinates', 'latitude': AG.geo.lat, 'longitude': AG.geo.lng } : undefined,
      'openingHoursSpecification': [
        { '@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Monday', 'Tuesday', 'Thursday'], 'opens': '08:00', 'closes': '18:00' },
        { '@type': 'OpeningHoursSpecification', 'dayOfWeek': 'Wednesday', 'opens': '08:30', 'closes': '17:00' },
        { '@type': 'OpeningHoursSpecification', 'dayOfWeek': 'Friday', 'opens': '08:00', 'closes': '14:00' }
      ],
 'hasMap': 'https://www.google.com/maps/search/?api=1&query=Gemeinschaftspraxis+Dres.+Zimmermann+Rappenstr.+19+67480+Edenkoben',
      'areaServed': [{ '@type': 'City', 'name': 'Edenkoben' }, { '@type': 'AdministrativeArea', 'name': 'Landkreis Südliche Weinstraße' }],
     
      'sameAs': [AG.website]
    });
    setzeSchema('ld-jobs', { '@context': 'https://schema.org', '@type': 'ItemList', 'itemListElement': offene.map(function (s, i) { return { '@type': 'ListItem', 'position': i + 1, 'item': jobPosting(s) }; }) });
    var faq = $$('[data-ansicht="start"] .faq details').map(function (d) {
      return { '@type': 'Question', 'name': $('summary', d).textContent.trim(), 'acceptedAnswer': { '@type': 'Answer', 'text': $('.antwort', d).textContent.trim() } };
    });
    setzeSchema('ld-faq', { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': faq });
    setzeSchema('ld-krumen', null);
  }
  function schemaDetail(s) {
    setzeSchema('ld-jobs', statusVon(s) !== 'besetzt' ? jobPosting(s) : null);
    setzeSchema('ld-faq', null);
    setzeSchema('ld-krumen', { '@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Karriere', 'item': BASIS },
      { '@type': 'ListItem', 'position': 2, 'name': 'Stellenangebote', 'item': BASIS + '#/#stellen' },
      { '@type': 'ListItem', 'position': 3, 'name': s.titel, 'item': BASIS + '#/stelle/' + s.slug }] });
  }

  /* ---------- Galerie und Benefits ---------- */
  var GALERIE = [
    ['zfa-edenkoben-rezeption-terminvergabe', 'Zwei Mitarbeiterinnen an der Rezeption der Zahnarztpraxis Dres. Zimmermann'],
    ['zfa-edenkoben-instrumente-aufbereitung', 'Zahnmedizinische Fachangestellte bereitet Instrumente im Behandlungszimmer vor'],
    ['zahnarzt-edenkoben-intraoralscanner-behandlung', 'Dr. Christian Zimmermann scannt die Zähne einer Patientin mit dem Intraoralscanner'],
    ['zfa-edenkoben-digitales-roentgen', 'Mitarbeiterin bereitet eine Patientin am digitalen Röntgengerät vor'],
    ['zfa-edenkoben-wartezimmer-patientin', 'Mitarbeiterin holt eine Patientin aus dem Wartezimmer ab'],
    ['praxisteam-edenkoben-fruehstueck-pause', 'Das Praxisteam beim gemeinsamen Frühstück mit frischem Obst'],
    ['zahnaerztin-edenkoben-patientin-gespraech', 'Dr. Charlotte Zimmermann im Gespräch mit einer Patientin'],
    ['prophylaxe-edenkoben-professionelle-zahnreinigung', 'Prophylaxe-Mitarbeiterin bei der professionellen Zahnreinigung'],
    ['praxisteam-zfa-edenkoben-zusammenhalt', 'Fünf Mitarbeiterinnen des Praxisteams stehen zusammen'],
    ['prophylaxe-edenkoben-pulverstrahlgeraet', 'Prophylaxe-Mitarbeiterin mit Pulverstrahlgerät im Behandlungszimmer'],
    ['zmv-edenkoben-verwaltung-telefon', 'Mitarbeiterin der Verwaltung telefoniert am Empfang'],
    ['zahnarztpraxis-edenkoben-instrumententablett', 'Behandschuhte Hand greift ein Instrument vom Tablett']
  ];
  function zeichneGalerie() {
    var g = $('#galerie'); if (!g) return;
    g.innerHTML = GALERIE.map(function (b) { return '<a href="img/' + b[0] + '.jpg" aria-label="' + esc(b[1]) + ', Bild vergrößern">' + bild(b[0], b[1]) + '</a>'; }).join('');
    $$('a', g).forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); lightbox(a); }); });
    /* Pfeile und Pfeiltasten: blättern wie auf der Hauptseite */
    function schritt() { return g.firstElementChild ? g.firstElementChild.getBoundingClientRect().width + 14 : 300; }
    $$('.pfeil').forEach(function (p) {
      p.addEventListener('click', function () { g.scrollBy({ left: schritt() * (+p.getAttribute('data-richtung')) * 2, behavior: 'smooth' }); });
    });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); g.scrollBy({ left: e.key === 'ArrowRight' ? schritt() : -schritt(), behavior: 'smooth' }); }
    });
  }
  function lightbox(a) {
    var dlg = document.createElement('dialog'); dlg.className = 'lb';
    dlg.style.cssText = 'border:0;padding:0;background:transparent;max-width:min(96vw,1400px);max-height:96vh';
    dlg.innerHTML = '<button type="button" aria-label="Schließen" style="position:absolute;top:8px;right:8px;background:#fff;border:0;width:44px;height:44px;font-size:1.5rem;cursor:pointer">×</button><img src="' + a.getAttribute('href') + '" alt="' + esc(a.getAttribute('aria-label').replace(', Bild vergrößern', '')) + '" style="max-width:100%;max-height:96vh;display:block;box-shadow:0 20px 60px rgba(0,0,0,.4)">';
    document.body.appendChild(dlg);
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.tagName === 'BUTTON') dlg.close(); });
    dlg.addEventListener('close', function () { dlg.remove(); });
    dlg.showModal();
  }
  var ICONS = {
    geld: '<path d="M8 14c0-3 7-5 16-5s16 2 16 5-7 5-16 5-16-2-16-5z"/><path d="M8 14v10c0 3 7 5 16 5s16-2 16-5V14"/><path d="M8 24v10c0 3 7 5 16 5s16-2 16-5V24"/>',
    team: '<path d="M6 32V16a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H14l-8 6z"/><path d="M30 18h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-2v6l-7-6"/>',
    vl: '<path d="M6 20l8-8 8 8-8 8z"/><path d="M26 20l8-8 8 8-8 8z"/><path d="M16 30l8 8 8-8"/><path d="M24 12v26"/>',
    tank: '<rect x="8" y="10" width="20" height="30" rx="2"/><path d="M12 16h12v8H12z"/><path d="M28 18h4a4 4 0 0 1 4 4v10a3 3 0 0 0 6 0V18l-5-5"/><path d="M8 40h20"/>',
    bahn: '<rect x="10" y="6" width="28" height="30" rx="6"/><path d="M10 22h28"/><path d="M18 36l-4 6M30 36l4 6"/><circle cx="17" cy="29" r="2"/><circle cx="31" cy="29" r="2"/><path d="M16 6h16"/>',
    bildung: '<path d="M4 18l20-9 20 9-20 9z"/><path d="M12 22v9c0 3 6 6 12 6s12-3 12-6v-9"/><path d="M44 18v12"/>',
    event: '<path d="M14 6l-4 16c-1 5 3 8 7 8s8-3 7-8L20 6z"/><path d="M17 30v10M11 40h12"/><path d="M34 6l4 16c1 5-3 8-7 8"/><path d="M31 30v10M25 40h12"/>',
    stuhl: '<path d="M12 26V12a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v14"/><path d="M8 26h32v8H8z"/><path d="M12 34v8M36 34v8"/><path d="M16 26v-6h16v6"/>',
    parken: '<rect x="8" y="8" width="32" height="32" rx="2"/><path d="M18 34V14h8a6 6 0 0 1 0 12h-8"/>'
  };
  var BENEFITS = [
    ['geld', 'Überdurchschnittliche Bezahlung', 'Faire und attraktive Vergütung. Heute und in der Zukunft.', 'Fair bezahlt'],
    ['team', 'Regelmäßige Teambesprechungen', 'Regelmäßige Teambesprechungen halten alle auf dem neuesten Stand.', 'Immer informiert'],
    ['vl', 'Vermögenswirksame Leistungen', 'Wir unterstützen Dich, damit Du rundum versorgt bist.', 'Rundum versorgt'],
    ['tank', 'Tankgutscheine', 'Wir versorgen unsere Kollegen regelmäßig mit Tankgutscheinen.', 'Extra im Tank'],
    ['bahn', 'Gute Verkehrsanbindung', 'Bei uns profitierst Du von einer guten Verkehrslage direkt am Bahnhof.', 'Direkt am Bahnhof'],
    ['bildung', 'Weiterbildungs\u00ADmöglichkeiten', 'Du möchtest Dich weiterbilden? Dann stehen wir Dir zur Seite.', 'Wir fördern Dich'],
    ['event', 'Mitarbeiterevents', 'Regelmäßige Teamevents und gemeinsame Aktivitäten runden unser Portfolio ab.', 'Gemeinsam feiern'],
    ['stuhl', 'Ergonomische Arbeitsplätze', 'Wir achten auf Deine Gesundheit am Arbeitsplatz und sind entsprechend ausgerüstet.', 'Gesund arbeiten'],
    ['parken', 'Gute Parksituation', 'Dank guter Parksituation findest Du jederzeit einen Parkplatz.', 'Entspannt ankommen']
  ];
  function zeichneBenefits() {
    var r = $('#benefits-raster'); if (!r) return;
    r.innerHTML = BENEFITS.map(function (b) {
      return '<div class="blurb"><svg viewBox="0 0 48 48" aria-hidden="true">' + ICONS[b[0]] + '</svg><h3>' + esc(b[1]) + '</h3><p>' + esc(b[2]) + '</p><span class="merk">' + esc(b[3]) + '</span></div>';
    }).join('');
  }

  /* ---------- Karte erst nach Einwilligung ---------- */
  var KARTE_SRC = 'https://www.google.com/maps?q=' + encodeURIComponent(AG.name + ', ' + AG.strasse + ', ' + AG.plz + ' ' + AG.ort) + '&output=embed&hl=de';
  function ladeKarte() {
    var k = $('#karte'); if (!k || k.getAttribute('data-geladen') === 'true') return;
    var f = document.createElement('iframe'); f.src = KARTE_SRC; f.title = 'Google Maps: Anfahrt zur Gemeinschaftspraxis Dres. Zimmermann, Rappenstr. 19, 67480 Edenkoben'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.setAttribute('allowfullscreen', '');
    k.innerHTML = ''; k.appendChild(f); k.setAttribute('data-geladen', 'true');
  }
  function pruefeKarte() {
    var e = window.aoEinwilligung;
    if (e && e.entschieden() && e.erlaubt('medien')) ladeKarte();
  }
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-karte-laden]'); if (!b) return;
    if (window.aoEinwilligung) window.aoEinwilligung.setze('medien', true);
    ladeKarte();
  });

  /* ---------- Matomo erst nach Einwilligung ---------- */
  var matomoGeladen = false;
  function pruefeMatomo() {
    var e = window.aoEinwilligung;
    if (!MATOMO_URL || !MATOMO_SITE_ID || matomoGeladen || !e || !e.entschieden() || !e.erlaubt('statistik')) return;
    matomoGeladen = true;
    var _paq = window._paq = window._paq || [];
    _paq.push(['disableCookies']); _paq.push(['trackPageView']); _paq.push(['enableLinkTracking']);
    _paq.push(['setTrackerUrl', MATOMO_URL + 'matomo.php']); _paq.push(['setSiteId', MATOMO_SITE_ID]);
    var g = document.createElement('script'); g.async = true; g.src = MATOMO_URL + 'matomo.js'; document.head.appendChild(g);
  }
  function spur(kat, aktion, name) { if (window._paq && matomoGeladen) window._paq.push(['trackEvent', kat, aktion, name]); }
  document.addEventListener('ao:einwilligung', function () { pruefeKarte(); pruefeMatomo(); });

  /* ---------- Routing ---------- */
  var TITEL = {
    start: ['ZFA, ZMV und Zahnarzt Jobs in Edenkoben | Dres. Zimmermann', 'Karriere bei Dres. Zimmermann in Edenkoben: offene Stellen für ZFA, ZMV und Auszubildende, Benefits, Bewerbungsprozess und Ansprechpartner. Jetzt bewerben.'],
    stellen: ['Stellenangebote in Edenkoben | ZFA, ZMV, Ausbildung | Dres. Zimmermann', 'Alle offenen Stellen der Zahnarztpraxis Dres. Zimmermann in Edenkoben mit Ampelstatus: online, initiativ oder besetzt.'],
    impressum: ['Impressum | Karriere Dres. Zimmermann Edenkoben', 'Impressum der Karriereseite der Gemeinschaftspraxis Dres. Zimmermann, Edenkoben.'],
    datenschutz: ['Datenschutzerklärung | Karriere Dres. Zimmermann Edenkoben', 'Datenschutzerklärung der Karriereseite der Gemeinschaftspraxis Dres. Zimmermann, Edenkoben.'],
    gleichstellung: ['Gleichstellungshinweis | Karriere Dres. Zimmermann Edenkoben', 'Hinweis zur Gleichstellung auf der Karriereseite der Gemeinschaftspraxis Dres. Zimmermann.']
  };
  function setzeMeta(t, d) {
    document.title = t;
    $('meta[name="description"]').setAttribute('content', d);
    $('meta[property="og:title"]').setAttribute('content', t);
    $('meta[property="og:description"]').setAttribute('content', d);
    $('meta[name="twitter:title"]').setAttribute('content', t);
    $('meta[name="twitter:description"]').setAttribute('content', d);
    var h = location.hash && location.hash !== '#/' ? location.hash : '';
    $('link[rel="canonical"]').setAttribute('href', BASIS + h);
    $('meta[property="og:url"]').setAttribute('content', BASIS + h);
  }
  function zeige(name) {
    $$('[data-ansicht]').forEach(function (v) { v.setAttribute('data-aktiv', v.getAttribute('data-ansicht') === name ? 'true' : 'false'); });
    $('#kopf').classList.toggle('ist-unterseite', name !== 'start');
    $$('.menue a').forEach(function (a) { a.removeAttribute('aria-current'); });
    var akt = $('.menue a[data-nav="' + (name === 'stelle' ? 'stellen' : name) + '"]'); if (akt) akt.setAttribute('aria-current', 'true');
  }
  function route() {
    var h = location.hash || '#/';
    var m;
    schliesseMenue();
    if ((m = h.match(/^#\/stelle\/([a-z0-9-]+)/))) {
      zeige('stelle');
      var s = zeichneDetail(m[1]);
      if (s) { setzeMeta(s.titel + ' | Stellenangebot Edenkoben | Dres. Zimmermann', (s.kurz || '') + ' ' + AG.ort + ', ' + s.anstellung + '. Jetzt bewerben bei Dres. Zimmermann.'); schemaDetail(s); spur('Stelle', 'Geöffnet', s.titel); }
      else setzeMeta('Stelle nicht gefunden | Karriere Dres. Zimmermann', 'Diese Stelle ist nicht mehr verfügbar.');
      window.scrollTo(0, 0); fokusInhalt(); return;
    }
    if (h.indexOf('#/stellen') === 0) { location.replace('#/#stellen'); return; }
    if (h.indexOf('#/impressum') === 0) { zeige('impressum'); setzeMeta.apply(null, TITEL.impressum); setzeSchema('ld-jobs', null); setzeSchema('ld-faq', null); setzeSchema('ld-krumen', null); window.scrollTo(0, 0); fokusInhalt(); return; }
    if (h.indexOf('#/datenschutz') === 0) { zeige('datenschutz'); setzeMeta.apply(null, TITEL.datenschutz); setzeSchema('ld-jobs', null); setzeSchema('ld-faq', null); setzeSchema('ld-krumen', null); window.scrollTo(0, 0); fokusInhalt(); return; }
    if (h.indexOf('#/gleichstellung') === 0) { zeige('gleichstellung'); setzeMeta.apply(null, TITEL.gleichstellung); setzeSchema('ld-jobs', null); setzeSchema('ld-faq', null); setzeSchema('ld-krumen', null); window.scrollTo(0, 0); fokusInhalt(); return; }
    // Startseite, ggf. mit Sprungziel: #/#benefits
    var warAktiv = $('[data-ansicht="start"]').getAttribute('data-aktiv') === 'true';
    zeige('start'); setzeMeta.apply(null, TITEL.start); schemaStart();
    var ziel = h.split('#')[2];
    if (ziel) { var el = document.getElementById(ziel); if (el) { requestAnimationFrame(function () { el.scrollIntoView({ behavior: warAktiv ? 'smooth' : 'auto', block: 'start' }); }); } }
    else window.scrollTo({ top: 0, behavior: warAktiv ? 'smooth' : 'auto' });
  }
  function fokusInhalt() { var m = $('#hauptinhalt'); if (m) m.focus({ preventScroll: true }); }
  function aktiverFilter(filterEl) { var b = filterEl && $('button[aria-pressed="true"]', filterEl); return b ? b.getAttribute('data-filter') : 'alle'; }

  /* ---------- Menü ---------- */
  var burger = $('.burger'), menue = $('#menue');
  function schliesseMenue() { if (!burger) return; burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Menü öffnen'); menue.setAttribute('data-offen', 'false'); }
  if (burger) {
    burger.addEventListener('click', function () {
      var offen = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!offen)); burger.setAttribute('aria-label', offen ? 'Menü öffnen' : 'Menü schließen');
      menue.setAttribute('data-offen', String(!offen));
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { schliesseMenue(); burger.focus(); } });
    $$('a', menue).forEach(function (a) { a.addEventListener('click', function () { if (a.getAttribute('href') === location.hash) route(); }); });
  }

  /* ---------- Nach-oben-Knopf ---------- */
  var oben = $('#oben');
  window.addEventListener('scroll', function () { if (oben) oben.setAttribute('data-an', window.scrollY > 600 ? 'true' : 'false'); }, { passive: true });
  if (oben) oben.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); fokusInhalt(); });

  /* ---------- Start ---------- */
  zeichneGalerie(); zeichneBenefits(); zaehler();
  zeichneListe($('#stellen-liste'), 'alle');
  $('#jahr').textContent = new Date().getFullYear();
  window.addEventListener('hashchange', route);
  route();
  pruefeKarte(); pruefeMatomo();
})();
