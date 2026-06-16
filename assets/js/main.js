/* =========================================================================
   Moonstep Motion — main.js
   Datensparsam: kein Tracking; Instagram wird erst nach aktivem Klick extern geladen.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- Mobile-Navigation ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    // Menü nach Klick auf einen Link schließen
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Header-Tiefe beim Scrollen ---------- */
  var header = document.querySelector(".site-header");
  var setHeaderDepth = function () {
    if (!header) { return; }
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  setHeaderDepth();
  window.addEventListener("scroll", setHeaderDepth, { passive: true });

  /* ---------- Scroll-Reveal (dezent, respektiert reduced-motion) ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  Array.prototype.forEach.call(
    document.querySelectorAll(".cards .reveal, .usp-grid .reveal, .steps .reveal"),
    function (el, index) {
      el.style.setProperty("--reveal-delay", String((index % 6) * 65) + "ms");
    }
  );
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Ruhige Parallax-Tiefe für Bildflächen ---------- */
  var depthEls = Array.prototype.slice.call(document.querySelectorAll(".hero-figure, .split-media, .cta-band"));
  if (!reduce && depthEls.length) {
    var depthTicking = false;
    var updateDepth = function () {
      var viewport = window.innerHeight || 1;
      depthEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var progress = Math.max(-1, Math.min(1, (center - viewport / 2) / viewport));
        el.style.setProperty("--depth-y", String((progress * -18).toFixed(2)) + "px");
        el.style.setProperty("--depth-y-soft", String((progress * -8).toFixed(2)) + "px");
      });
      depthTicking = false;
    };
    var requestDepth = function () {
      if (depthTicking) { return; }
      depthTicking = true;
      window.requestAnimationFrame(updateDepth);
    };
    updateDepth();
    window.addEventListener("scroll", requestDepth, { passive: true });
    window.addEventListener("resize", requestDepth);
  }

  /* ---------- Aktuelles Jahr im Footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---------- Instagram-Embed erst nach aktivem Klick laden ---------- */
  var instagramButton = document.querySelector("[data-load-instagram]");
  if (instagramButton) {
    instagramButton.addEventListener("click", function () {
      var card = instagramButton.closest("[data-instagram-card]");
      if (!card) { return; }

      var frame = card.querySelector(".instagram-frame");
      var consent = card.querySelector("[data-instagram-consent]");
      if (!frame || !frame.dataset.src) { return; }

      if (!frame.getAttribute("src")) {
        frame.setAttribute("src", frame.dataset.src);
      }
      frame.hidden = false;
      if (consent) { consent.hidden = true; }
      card.classList.add("loaded");
    });
  }

  /* ---------- Impressionen-Slideshow mit optionaler IONOS/PHP-Bildliste ---------- */
  var impressionWall = document.querySelector("[data-impressions]");
  if (impressionWall) {
    var fallbackImpressions = [
      { src: "assets/img/class-teaching.jpg", alt: "Lea leitet eine Gruppe Kinder beim Tanztraining an" },
      { src: "assets/img/outdoor-duo.jpg", alt: "Zwei Tänzerinnen bewegen sich gemeinsam draußen" },
      { src: "assets/img/studio-group.jpg", alt: "Tanzgruppe übt vor dem Spiegel im Studio" },
      { src: "assets/img/back-arms.jpg", alt: "Tänzerin mit ausgebreiteten Armen in der Halle" },
      { src: "assets/img/class-jump.jpg", alt: "Sprung mitten in der Bewegung vor einer Kindergruppe" },
      { src: "assets/img/lea-outdoor-dance.jpg", alt: "Lea tanzt Shuffle im Freien" },
      { src: "assets/img/lea-portrait.jpg", alt: "Lea lacht während eines Trainings im Studio" }
    ];
    var impressionImages = fallbackImpressions.slice();
    var impressionTiles = Array.prototype.slice.call(impressionWall.querySelectorAll(".impression-tile"));
    var impressionImgs = Array.prototype.slice.call(impressionWall.querySelectorAll("img"));
    var nextButton = document.querySelector("[data-impressions-next]");
    var prevButton = document.querySelector("[data-impressions-prev]");
    var impressionTimer = null;

    var normalizeImpression = function (item) {
      if (typeof item === "string") {
        return { src: item, alt: "Impression von Moonstep Motion" };
      }
      if (item && item.src) {
        return { src: item.src, alt: item.alt || "Impression von Moonstep Motion" };
      }
      return null;
    };

    var dedupeImpressions = function (items) {
      var seen = {};
      return items.map(normalizeImpression).filter(function (item) {
        if (!item || seen[item.src]) { return false; }
        seen[item.src] = true;
        return true;
      });
    };

    var shuffled = function (items) {
      var list = items.slice();
      for (var i = list.length - 1; i > 0; i -= 1) {
        var j = Math.floor(Math.random() * (i + 1));
        var swap = list[i];
        list[i] = list[j];
        list[j] = swap;
      }
      return list;
    };

    var showImpressions = function () {
      if (!impressionImages.length) { return; }
      var pool = shuffled(impressionImages);
      impressionTiles.forEach(function (tile) { tile.classList.add("is-swapping"); });

      window.setTimeout(function () {
        impressionImgs.forEach(function (img, index) {
          var item = pool[index % pool.length];
          img.src = item.src;
          img.alt = item.alt;
        });
        impressionTiles.forEach(function (tile) { tile.classList.remove("is-swapping"); });
      }, 180);
    };

    var restartImpressionTimer = function () {
      if (reduce) { return; }
      if (impressionTimer) { window.clearInterval(impressionTimer); }
      impressionTimer = window.setInterval(showImpressions, 5200);
    };

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        showImpressions();
        restartImpressionTimer();
      });
    }
    if (prevButton) {
      prevButton.addEventListener("click", function () {
        showImpressions();
        restartImpressionTimer();
      });
    }

    if (window.fetch) {
      window.fetch("assets/php/impressions.php", { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) { throw new Error("No dynamic image list"); }
          return response.json();
        })
        .then(function (paths) {
          if (!Array.isArray(paths) || !paths.length) { return; }
          impressionImages = dedupeImpressions(fallbackImpressions.concat(paths));
          showImpressions();
        })
        .catch(function () {
          impressionImages = dedupeImpressions(fallbackImpressions);
        });
    }
    restartImpressionTimer();
  }

  /* ---------- Kontaktformular -> mailto (kein Backend, keine Cookies) ---------- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // HTML5-Validierung
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Felder über IDs lesen (form.name würde die Form-Eigenschaft treffen, nicht das Feld)
      var val = function (id) {
        var el = document.getElementById(id);
        return el ? (el.value || "").trim() : "";
      };
      var name = val("name");
      var email = val("email");
      var phone = val("phone");
      var interest = val("interest");
      var message = val("message");

      var subject = "Anfrage über die Website – " + interest;
      var bodyLines = [
        "Hallo Lea,",
        "",
        message,
        "",
        "—",
        "Name: " + name,
        "E-Mail: " + email,
        (phone ? "Telefon: " + phone : "Telefon: –"),
        "Interesse: " + interest,
        "",
        "(Gesendet über das Kontaktformular auf moonstep-motion.de)"
      ];
      var mailto =
        "mailto:LeaOster02@gmx.de" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailto;

      if (note) {
        note.textContent =
          "Dein E-Mail-Programm sollte sich jetzt öffnen. Falls nicht, schreib bitte direkt an LeaOster02@gmx.de.";
      }
    });
  }
})();
