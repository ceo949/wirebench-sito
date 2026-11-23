/* WireBench — storico lavori: legge dati/lavori.json e mostra una scheda per ogni lavoro dell'elenco "lavori".
 * Il blocco "_esempio_NON_PUBBLICATO" del file non viene mai mostrato. Elenco vuoto → resta il testo "I primi lavori…". */
(function () {
  "use strict";
  var box = document.getElementById("schede-lavori");
  var vuoto = document.getElementById("nessun-lavoro");
  if (!box) return;
  var en = document.documentElement.lang === "en";
  var base = box.getAttribute("data-foto-base") || "";
  var L = en
    ? { riparazione: "Repair", replica: "Replica from sample", problema: "The problem", intervento: "The work", prima: "Before", dopo: "After", durante: "During the work", consegna: "Delivered", video: "Watch the video", mesi: ["January","February","March","April","May","June","July","August","September","October","November","December"] }
    : { riparazione: "Riparazione", replica: "Replica dal campione", problema: "Il problema", intervento: "L'intervento", prima: "Prima", dopo: "Dopo", durante: "Durante il lavoro", consegna: "Consegna", video: "Guarda il video", mesi: ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"] };

  function el(tag, cls, testo) { var e = document.createElement(tag); if (cls) e.className = cls; if (testo != null) e.textContent = testo; return e; }
  function t(v) { return v && typeof v === "object" ? (v[en ? "en" : "it"] || v.it || "") : (v || ""); }
  // consegna: "AAAA-MM" oppure "AAAA-MM-GG" (data scelta in Pages CMS): si mostra solo mese e anno
  function mese(s) { var m = /^(\d{4})-(\d{2})(-\d{2})?$/.exec(s || ""); return m ? L.mesi[+m[2] - 1] + " " + m[1] : (s || ""); }
  function figura(src, didascalia) {
    // percorsi di Pages CMS: "/dati/foto/x.jpg" (dalla radice del sito) → usati così; "dati/foto/x.jpg" → con la base della pagina
    var f = el("figure"); var i = el("img"); i.src = /^(\/|https:\/\/)/.test(src) ? src : base + src; i.alt = didascalia; i.loading = "lazy";
    f.appendChild(i); f.appendChild(el("figcaption", null, didascalia)); return f;
  }
  function scheda(j) {
    var a = el("article", "scheda");
    var foto = el("div", "foto");
    if (j.foto_prima) foto.appendChild(figura(j.foto_prima, L.prima));
    if (j.foto_dopo) foto.appendChild(figura(j.foto_dopo, L.dopo));
    if (j.foto_durante) foto.appendChild(figura(j.foto_durante, L.durante));
    if (foto.children.length) a.appendChild(foto);
    var c = el("div", "corpo");
    c.appendChild(el("h3", null, t(j.titolo)));
    c.appendChild(el("p", "etichetta", (L[j.tipo] || j.tipo || "") + (t(j.cablaggio) ? " · " + t(j.cablaggio) : "")));
    var p1 = el("p"); p1.appendChild(el("strong", null, L.problema + ": ")); p1.appendChild(document.createTextNode(t(j.problema))); c.appendChild(p1);
    var p2 = el("p"); p2.appendChild(el("strong", null, L.intervento + ": ")); p2.appendChild(document.createTextNode(t(j.intervento))); c.appendChild(p2);
    if (j.consegna) c.appendChild(el("p", "aiuto", L.consegna + ": " + mese(j.consegna)));
    if (j.video && /^https:\/\//.test(j.video)) { var v = el("a", null, L.video + " →"); v.href = j.video; v.rel = "noopener"; c.appendChild(v); }
    a.appendChild(c); return a;
  }
  fetch(box.getAttribute("data-dati"), { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (dati) {
      var lavori = Array.isArray(dati.lavori) ? dati.lavori.slice() : [];
      if (!lavori.length) return;
      lavori.sort(function (x, y) { return String(y.consegna || "").localeCompare(String(x.consegna || "")); });
      lavori.forEach(function (j) { box.appendChild(scheda(j)); });
      if (vuoto) vuoto.hidden = true;
    })
    .catch(function (e) { console.info("Storico lavori non caricato (aperto da file locale o file non valido):", e.message); });
})();
