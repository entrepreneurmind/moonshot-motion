# Moonstep Motion — Website v2

Statische Website (HTML/CSS/JS, kein Build-Step) für **Lea Oster / Moonstep Motion**.
Sofort livefähig, mobile-first, DSGVO-sensibel und auf **Wittlich** ausgerichtet.

## Struktur

```
output-v2/
├── index.html          # Onepager (Hero, Über, Lea, Angebote, Warum, Ablauf,
│                        #          Standort & Preise, Impressionen, Instagram, Kontakt)
├── impressum.html      # Impressum (§ 5 DDG) – mit Platzhaltern
├── datenschutz.html    # Datenschutzerklärung – auf genutzte Dienste zugeschnitten
└── assets/
    ├── css/styles.css  # Designsystem nach moonstep-motion-ci.html
    ├── js/main.js      # Mobile-Nav, Scroll-Reveal, mailto-Formular
    ├── php/            # optionale IONOS/PHP-Helfer, z. B. Bildliste
    └── img/            # Logo + Fotos (umbenannt)
```

## Lokal ansehen

Einfach `index.html` im Browser öffnen — oder ein lokaler Server:
```bash
cd output-v2 && python3 -m http.server 8080   # -> http://localhost:8080
```

## CI-Anwendung

- **Quelle:** `moonstep-motion-ci.html` im Ordner `output-v2/`.
- **Stimmung:** elegant · aktiv · ermutigend · leicht mystisch. Sprache: locker & persönlich (du-Form).
- **Farben:** Moon Peach `#FFCDB2`, Soft Step `#FFB4A2`, Pulse Rose `#E5989B`,
  Velvet Move `#B5838D`, Night Ash `#6D6875`, Moon Night `#2B2430`,
  Warm White `#FFF8F5`.
- **Logo-System:** Header, Favicon, OpenGraph und Footer nutzen das neue Badge-Logo
  `assets/img/logo-alt-badge-night.png`. Das alte detailreiche Masterlogo bleibt als Asset erhalten,
  wird aber nicht mehr als primäres Website-Logo eingesetzt.
- **Typografie:** eleganter Serif (Headlines) + klarer Sans (Text), als System-Font-Stack →
  keine externen Requests. *Upgrade:* Fraunces/Cormorant + Inter self-hosten (siehe unten).
- **Komponenten:** Pill-Buttons in Rosé/Mauve/Peach, abgerundete Cards, weiche Schatten,
  warme Bild-Layer, dezente Scroll-Animationen und leichte Parallax-Tiefe.

## Instagram & Datenschutz

Die Seite lädt Instagram **nicht automatisch**, sondern erst nach aktivem Klick auf
„Instagram-Feed laden". Bis dahin bleibt die Website datensparsam:
- Kontaktformular per **mailto** (kein Backend, kein Dritter)
- Schriften **lokal** (keine externen Google Fonts)
- **kein** Google Maps-Embed, **kein** Analytics
- Instagram als 2-Klick-Embed plus Fallback-Link

Wird Instagram später automatisch geladen oder kommen Google Maps, Analytics oder ein
Formular-Dienst (Formspree/Netlify Forms) dazu, **muss** die Datenschutzerklärung erweitert und
ggf. ein Consent-Banner eingebaut werden.

## Impressionen-Slideshow

Die Section nutzt vorhandene Bilder als Fallback. Auf IONOS kann `assets/php/impressions.php`
zusätzlich alle Bilddateien aus `assets/img/` und optional `assets/img/impressions/` auslesen.
Neue Fotos einfach in einen dieser Ordner legen; die Slideshow mischt sie dann zufällig ein.

Wenn der Host kein PHP ausführt, bleibt die Slideshow mit den fest hinterlegten Bildern aktiv.
Dann neue Bilder zusätzlich in `assets/js/main.js` in `fallbackImpressions` eintragen.

## ✅ To-dos für Lea VOR dem Livegang

1. **Impressum vervollständigen:** vollständiger Name, ladungsfähige Anschrift, ggf. Telefon,
   USt-ID bzw. Kleinunternehmer-Hinweis (§ 19 UStG). Alle `[Platzhalter]` ersetzen.
2. **Datenschutz vervollständigen:** Hosting-Anbieter + Anschrift, Logfile-Speicherdauer, zuständige
   Aufsichtsbehörde (Rheinland-Pfalz), Stand (Monat/Jahr).
3. **Impressum & Datenschutz rechtlich prüfen lassen** (dies ist keine Rechtsberatung).
4. **Bildrechte klären:** Einige Fotos tragen ein Fotografen-Wasserzeichen → Nutzungsrecht/Credit
   sichern. Einverständnis abgebildeter Kinder/Personen für Web & Social einholen.
5. **Standort prüfen:** Diese v2 ist auf **Wittlich** ausgerichtet. Bitte konkrete Adresse,
   Kursort und feste Zeiten ergänzen, sobald diese feststehen.
6. **Hosting bei IONOS:** kompletten Inhalt des Ordners `output-v2/` hochladen. Die `index.html`
   muss im Webroot liegen, nicht der übergeordnete Ordner selbst.

## Optionale Verbesserungen (nach Livegang)

- **Echtes Formular-Backend** statt mailto (Formspree, Netlify Forms) — dann Datenschutz ergänzen.
- **Schriften self-hosten** (Fraunces/Cormorant + Inter) für ein noch markanteres Schriftbild —
  `.woff2` in `assets/fonts/` legen und `@font-face` in `styles.css` ergänzen (Variablen
  `--font-display` / `--font-body` anpassen).
- **Transparentes Logo-PNG** für flexiblere Platzierung auf hellen Flächen.
- Fotos für schnellere Ladezeit als **WebP** exportieren und Größen optimieren.

---
Quelle der Inhalte: `../Lea Website Resources/fragebogen.md.md`; Standort in v2 nach neuer Vorgabe:
**Wittlich**. Es wurden keine persönlichen Daten, Referenzen oder Bewertungen erfunden.
