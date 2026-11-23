/* WireBench — modulo "Chiedi un preventivo" (italiano e inglese).
 *
 * ======================== UNICO PUNTO DA CAMBIARE ========================
 * Come si invia la richiesta (scelta di Stefano del 19/11/2026: Tally Free).
 *   tally: ""        → incollare qui l'ID del modulo Tally (es. "wA1bC2": è la parte finale del link
 *                      di condivisione https://tally.so/r/wA1bC2). Con l'ID compilato la pagina mostra il
 *                      modulo Tally incorporato al posto di quello del sito (pagine italiane e inglesi).
 *   tallyEn: ""      → facoltativo: ID di un secondo modulo Tally in inglese, usato dalle pagine en/.
 *                      Vuoto = anche le pagine inglesi mostrano il modulo di "tally".
 *   Con "tally" VUOTO resta la riserva, modo "mailto": apre il programma di posta del cliente con i dati
 *                      già scritti verso INVIO.email; il cliente allega le foto a mano.
 *   modo: "endpoint" → (piano B, oggi non usato) invio POST multipart di campi e foto a INVIO.url,
 *                      es. script PHP su hosting Aruba. Il servizio deve rispondere con un codice 2xx.
 * Guida passo passo: linee/sito-wirebench/pubblicazione.md · campi da creare in Tally: tally-campi.md
 * ========================================================================== */
var INVIO = {
  tally: "",          // ← ID del modulo Tally: L'UNICA COSA DA INCOLLARE
  tallyEn: "",        // facoltativo
  modo: "mailto",
  email: "info@cablaggitalia.com",
  url: "",            // da compilare solo con modo "endpoint"
  maxFoto: 10,
  maxMB: 10           // limite per foto di Tally Free: 10 MB per file
};

/* Modalità Tally: modulo incorporato con il codice "Standard embed" di Tally
 * (https://developers.tally.so/widgets/embeds · https://tally.so/help/embed-your-form). */
(function () {
  "use strict";
  var en = document.documentElement.lang === "en";
  var id = String((en && INVIO.tallyEn) || INVIO.tally || "").trim();
  var form = document.getElementById("modulo-preventivo");
  if (!id || !form) return;
  if (!/^[A-Za-z0-9]+$/.test(id)) { console.warn("INVIO.tally: serve solo l'ID (es. wA1bC2), non il link intero. Uso la riserva mailto."); return; }
  var box = document.createElement("div");
  box.className = "modulo-tally";
  var fr = document.createElement("iframe");
  fr.setAttribute("data-tally-src", "https://tally.so/embed/" + id + "?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&lingua=" + (en ? "en" : "it"));
  fr.setAttribute("loading", "lazy");
  fr.setAttribute("width", "100%");
  fr.setAttribute("height", "900");
  fr.setAttribute("frameborder", "0");
  fr.setAttribute("marginheight", "0");
  fr.setAttribute("marginwidth", "0");
  fr.setAttribute("title", en ? "Quote request form" : "Modulo di richiesta preventivo");
  box.appendChild(fr);
  var riserva = document.createElement("p");
  riserva.className = "aiuto";
  riserva.textContent = en
    ? "If the form does not appear, write to " + INVIO.email + " with your vehicle details and photos of the harness."
    : "Se il modulo non compare, scrivi a " + INVIO.email + " con i dati del veicolo e le foto del cablaggio.";
  box.appendChild(riserva);
  form.parentNode.insertBefore(box, form);
  form.hidden = true;
  form.setAttribute("data-sostituito-da-tally", "1");
  var avvia = function () {
    if (window.Tally && window.Tally.loadEmbeds) { window.Tally.loadEmbeds(); return; }
    Array.prototype.forEach.call(document.querySelectorAll("iframe[data-tally-src]:not([src])"), function (e) { e.src = e.getAttribute("data-tally-src"); });
  };
  var s = document.createElement("script");
  s.src = "https://tally.so/widgets/embed.js";
  s.onload = avvia; s.onerror = avvia;
  document.body.appendChild(s);
})();

/* Modulo del sito (riserva mailto, o endpoint): attivo solo se Tally non è impostato. */
(function () {
  "use strict";
  var form = document.getElementById("modulo-preventivo");
  if (!form || form.hasAttribute("data-sostituito-da-tally")) return;
  var en = document.documentElement.lang === "en";
  var M = en ? {
    obbligatorio: "This field is required.",
    email: "Please check the email address.",
    foto: "Please add at least one photo of the harness.",
    troppe: "You can send up to " + INVIO.maxFoto + " photos.",
    grande: "The photo is too large: the limit is " + INVIO.maxMB + " MB.",
    tipo: "Only JPG, PNG or HEIC photos.",
    anno: "Please write the year with 4 digits.",
    privacy: "To send the request please confirm you have read the privacy notice.",
    altro: "Please specify which harness.",
    grazieT: "Thank you, we have received your request.",
    grazie: "We will look at your photos and reply by email with the first check, free of charge. If the job can be done, we will tell you how to ship us the harness.",
    mailT: "Your email program should now open with your request already written.",
    mail: "Before sending it, please attach these photos to the email: ",
    mailNo: "If no email program opens, write to " + INVIO.email + " with your vehicle details and the photos.",
    ko: "Sending failed. Please try again in a few minutes, or write to " + INVIO.email + ".",
    oggetto: "Quote request", invio: "Sending…"
  } : {
    obbligatorio: "Questo campo è obbligatorio.",
    email: "Controlla l'indirizzo email.",
    foto: "Aggiungi almeno una foto del cablaggio.",
    troppe: "Puoi mandare al massimo " + INVIO.maxFoto + " foto.",
    grande: "La foto è troppo grande: il limite è " + INVIO.maxMB + " MB.",
    tipo: "Solo foto JPG, PNG o HEIC.",
    anno: "Scrivi l'anno con 4 cifre.",
    privacy: "Per inviare la richiesta conferma di aver letto l'informativa sulla privacy.",
    altro: "Specifica quale cablaggio.",
    grazieT: "Grazie, abbiamo ricevuto la tua richiesta.",
    grazie: "Guardiamo le foto e ti rispondiamo via email con la prima analisi, gratis. Se il lavoro si può fare, ti diciamo come spedirci il cablaggio.",
    mailT: "Ora dovrebbe aprirsi il tuo programma di posta con la richiesta già scritta.",
    mail: "Prima di inviarla, allega all'email queste foto: ",
    mailNo: "Se non si apre nessun programma di posta, scrivi a " + INVIO.email + " con i dati del veicolo e le foto.",
    ko: "Invio non riuscito. Riprova fra qualche minuto, oppure scrivi a " + INVIO.email + ".",
    oggetto: "Richiesta di preventivo", invio: "Invio in corso…"
  };

  // mostra il limite in MB scritto nel testo di aiuto
  Array.prototype.forEach.call(document.querySelectorAll("[data-max-mb]"), function (s) { s.textContent = INVIO.maxMB; });

  var fotoInput = form.querySelector("#foto");
  var elencoFoto = form.querySelector("#elenco-foto");
  var altroBox = form.querySelector('input[name="quale_cablaggio"][value="altro"]');
  var altroTesto = form.querySelector("#quale_altro");

  altroBox.addEventListener("change", function () { altroTesto.hidden = !altroBox.checked; if (altroBox.checked) altroTesto.focus(); });
  fotoInput.addEventListener("change", function () {
    elencoFoto.innerHTML = "";
    Array.prototype.forEach.call(fotoInput.files, function (f) {
      var li = document.createElement("li");
      li.textContent = f.name + " — " + (f.size / 1048576).toFixed(1) + " MB";
      elencoFoto.appendChild(li);
    });
    controllaCampo(fotoInput);
  });

  function campoDi(el) { return el.closest(".campo"); }
  function pulisci(campo) {
    campo.classList.remove("ha-errore");
    var e = campo.querySelector(".errore-campo"); if (e) e.remove();
  }
  function errore(campo, testo, el) {
    pulisci(campo);
    campo.classList.add("ha-errore");
    var p = document.createElement("p");
    p.className = "errore-campo"; p.id = "err-" + (el.name || el.id); p.textContent = testo;
    campo.appendChild(p);
    if (el.setAttribute) { el.setAttribute("aria-invalid", "true"); }
    return false;
  }
  function estOk(nome) { return /\.(jpe?g|png|heic|heif)$/i.test(nome); }

  function controllaCampo(el) {
    var campo = campoDi(el); if (!campo) return true;
    var v = (el.value || "").trim();
    if (el.removeAttribute) el.removeAttribute("aria-invalid");
    if (el.type === "file") {
      if (!el.files.length) return errore(campo, M.foto, el);
      if (el.files.length > INVIO.maxFoto) return errore(campo, M.troppe, el);
      for (var i = 0; i < el.files.length; i++) {
        if (!estOk(el.files[i].name)) return errore(campo, M.tipo, el);
        if (el.files[i].size > INVIO.maxMB * 1048576) return errore(campo, M.grande, el);
      }
    } else if (el.type === "radio") {
      if (!form.querySelector('input[name="' + el.name + '"]:checked')) return errore(campo, M.obbligatorio, el);
    } else if (el.type === "checkbox" && el.name === "privacy") {
      if (!el.checked) return errore(campo, M.privacy, el);
    } else if (el.required && !v) {
      return errore(campo, M.obbligatorio, el);
    } else if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return errore(campo, M.email, el);
    } else if (el.name === "anno" && !/^\d{4}$/.test(v)) {
      return errore(campo, M.anno, el);
    }
    pulisci(campo); return true;
  }
  function controllaTutto() {
    var primo = null, ok = true;
    var visti = {};
    Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (el) {
      if (el.type === "checkbox" && el.name === "quale_cablaggio") return;
      if (el.id === "quale_altro") return;
      if (el.type === "radio") { if (visti[el.name]) return; visti[el.name] = 1; }
      if (!el.required && el.type !== "email") return;
      if (!controllaCampo(el)) { ok = false; primo = primo || el; }
    });
    // "Quale cablaggio": almeno una casella; se "Altro", serve il testo
    var gruppo = form.querySelector('[data-gruppo="quale_cablaggio"]');
    var segnati = form.querySelectorAll('input[name="quale_cablaggio"]:checked');
    if (!segnati.length) { errore(gruppo, M.obbligatorio, altroBox); ok = false; primo = primo || altroBox; }
    else if (altroBox.checked && !altroTesto.value.trim()) { errore(gruppo, M.altro, altroTesto); ok = false; primo = primo || altroTesto; }
    else pulisci(gruppo);
    if (primo) primo.focus();
    return ok;
  }
  Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (el) {
    el.addEventListener("blur", function () { if (campoDi(el) && campoDi(el).classList.contains("ha-errore")) controllaCampo(el); });
  });

  function valori() {
    var fd = new FormData(form);
    var testo = function (n) { return (fd.getAll(n) || []).join(", "); };
    var etichetta = function (n) {
      return Array.prototype.map.call(form.querySelectorAll('input[name="' + n + '"]:checked'), function (i) { return i.parentNode.textContent.trim(); }).join(", ");
    };
    var quale = etichetta("quale_cablaggio") + (altroTesto.value.trim() ? " (" + altroTesto.value.trim() + ")" : "");
    return { fd: fd, righe: [
      [en ? "Make" : "Marca", testo("marca")], [en ? "Model" : "Modello", testo("modello")], [en ? "Year" : "Anno", testo("anno")],
      [en ? "Vehicle type" : "Tipo di veicolo", etichetta("tipo_veicolo")], [en ? "Which harness" : "Quale cablaggio", quale],
      [en ? "What you need" : "Cosa serve", etichetta("cosa_serve")], [en ? "The problem" : "Il problema", testo("problema")],
      [en ? "Full name" : "Nome e cognome", testo("nome")], [en ? "Company" : "Azienda", testo("azienda")], ["Email", testo("email")],
      [en ? "Phone" : "Telefono", testo("telefono")], [en ? "Country" : "Paese", testo("paese")],
      [en ? "Privacy notice read" : "Informativa privacy letta", en ? "yes" : "sì"],
      [en ? "Site language" : "Lingua del sito", en ? "English" : "Italiano"]
    ] };
  }
  function esito(classe, titolo, testo, extra) {
    var box = document.getElementById("esito");
    box.className = "esito " + classe; box.innerHTML = "";
    var h = document.createElement("p"); h.innerHTML = "<strong></strong>"; h.firstChild.textContent = titolo; box.appendChild(h);
    var p = document.createElement("p"); p.textContent = testo; box.appendChild(p);
    if (extra) { var q = document.createElement("p"); q.textContent = extra; box.appendChild(q); }
    box.setAttribute("tabindex", "-1"); box.focus();
  }

  function inviaMailto(v) {
    var nomiFoto = Array.prototype.map.call(fotoInput.files, function (f) { return f.name; });
    var corpo = v.righe.filter(function (r) { return r[1]; }).map(function (r) { return r[0] + ": " + r[1]; }).join("\n");
    corpo += "\n\n" + (en ? "Photos to attach: " : "Foto da allegare: ") + nomiFoto.join(", ");
    if (corpo.length > 1600) corpo = corpo.slice(0, 1600) + " […]";
    var oggetto = M.oggetto + " — " + v.fd.get("marca") + " " + v.fd.get("modello") + " " + v.fd.get("anno");
    window.location.href = "mailto:" + INVIO.email + "?subject=" + encodeURIComponent(oggetto) + "&body=" + encodeURIComponent(corpo);
    esito("ok", M.mailT, M.mail + nomiFoto.join(", "), M.mailNo);
  }
  function inviaEndpoint(v, bottone) {
    bottone.disabled = true; var t = bottone.textContent; bottone.textContent = M.invio;
    fetch(INVIO.url, { method: "POST", body: v.fd, headers: { "Accept": "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); elencoFoto.innerHTML = ""; esito("ok", M.grazieT, M.grazie); })
      .catch(function () { esito("ko", M.ko, ""); })
      .then(function () { bottone.disabled = false; bottone.textContent = t; });
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!controllaTutto()) return;
    var v = valori();
    if (INVIO.modo === "endpoint" && INVIO.url) inviaEndpoint(v, form.querySelector('button[type="submit"]'));
    else inviaMailto(v);
  });
})();
