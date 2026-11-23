/* WireBench — modulo "Informazioni sulla guida" (pagina Guida, italiano e inglese). 23/11/2026.
 *
 * ======================== UNICO PUNTO DA CAMBIARE ========================
 *   tally: ""    → ID del modulo Tally "Informazioni guida" (parte finale di https://tally.so/r/XXXXXX).
 *                  Con l'ID la pagina mostra il modulo Tally al posto di quello del sito.
 *   tallyEn: ""  → facoltativo, modulo in inglese per le pagine en/.
 *   Con "tally" VUOTO: l'invio apre il programma di posta del visitatore con i dati già scritti verso
 *                  INFO_GUIDA.email (commerciale@cablaggitalia.com).
 * Il parametro ?da=... dell'indirizzo (es. guida.html?da=yt-cap07) dice da quale video arriva il visitatore:
 * passa a Tally nel campo nascosto "da" e nella mail di riserva. Campi da creare: tally-guida-campi.md
 * ========================================================================== */
var INFO_GUIDA = {
  tally: "PRzGXe",
  tallyEn: "",
  email: "commerciale@cablaggitalia.com"
};

(function () {
  "use strict";
  var en = document.documentElement.lang === "en";
  var form = document.getElementById("modulo-guida");
  if (!form) return;
  var da = "";
  try { da = (new URLSearchParams(location.search).get("da") || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40); } catch (e) {}
  if (!da && document.referrer) { try { da = "rif-" + new URL(document.referrer).hostname.replace(/[^A-Za-z0-9.-]/g, "").slice(0, 36); } catch (e) {} }
  if (!da) da = "sito";
  var hid = document.getElementById("guida-da"); if (hid) hid.value = da;

  var id = String((en && INFO_GUIDA.tallyEn) || INFO_GUIDA.tally || "").trim();
  if (id && /^[A-Za-z0-9]+$/.test(id)) {
    var box = document.createElement("div");
    box.className = "modulo-tally";
    var fr = document.createElement("iframe");
    fr.setAttribute("data-tally-src", "https://tally.so/embed/" + id + "?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&lingua=" + (en ? "en" : "it") + "&da=" + encodeURIComponent(da));
    fr.setAttribute("loading", "lazy"); fr.setAttribute("width", "100%"); fr.setAttribute("height", "700");
    fr.setAttribute("frameborder", "0"); fr.setAttribute("marginheight", "0"); fr.setAttribute("marginwidth", "0");
    fr.setAttribute("title", en ? "Handbook information form" : "Modulo informazioni sulla guida");
    box.appendChild(fr);
    var ris = document.createElement("p"); ris.className = "aiuto";
    ris.textContent = en ? "If the form does not appear, write to " + INFO_GUIDA.email + "." : "Se il modulo non compare, scrivi a " + INFO_GUIDA.email + ".";
    box.appendChild(ris);
    form.parentNode.insertBefore(box, form);
    form.hidden = true;
    var s = document.createElement("script");
    s.src = "https://tally.so/widgets/embed.js";
    s.onload = function () { if (window.Tally && window.Tally.loadEmbeds) window.Tally.loadEmbeds(); };
    s.onerror = function () { Array.prototype.forEach.call(document.querySelectorAll("iframe[data-tally-src]:not([src])"), function (e) { e.src = e.getAttribute("data-tally-src"); }); };
    document.body.appendChild(s);
    return;
  }

  var M = en ? {
    obbl: "This field is required.", email: "Please enter a valid email address.", privacy: "Please confirm that you have read the privacy notice.",
    ok: "Your email program is opening with the message ready: just press Send.",
    mailNo: "If no email program opens, write to " + INFO_GUIDA.email + ".",
    oggetto: "Handbook information request - WireBench", si: "yes", no: "no"
  } : {
    obbl: "Campo obbligatorio.", email: "Scrivi un indirizzo email valido.", privacy: "Conferma di aver letto l'informativa sulla privacy.",
    ok: "Si sta aprendo il tuo programma di posta con il messaggio già pronto: basta premere Invia.",
    mailNo: "Se non si apre nessun programma di posta, scrivi a " + INFO_GUIDA.email + ".",
    oggetto: "Richiesta informazioni guida WireBench", si: "sì", no: "no"
  };
  function errore(campo, testo) {
    var box = campo.closest(".campo"); if (!box) return;
    box.classList.add("ha-errore");
    var p = document.createElement("p"); p.className = "errore-campo"; p.textContent = testo; box.appendChild(p);
  }
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    Array.prototype.forEach.call(form.querySelectorAll(".errore-campo"), function (e) { e.remove(); });
    Array.prototype.forEach.call(form.querySelectorAll(".ha-errore"), function (e) { e.classList.remove("ha-errore"); });
    var primo = null;
    ["g-nome", "g-email", "g-paese", "g-profilo"].forEach(function (k) {
      var c = document.getElementById(k);
      if (!c.value.trim()) { errore(c, M.obbl); primo = primo || c; }
      else if (k === "g-email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.value.trim())) { errore(c, M.email); primo = primo || c; }
    });
    var pr = document.getElementById("g-privacy");
    if (!pr.checked) { errore(pr, M.privacy); primo = primo || pr; }
    if (primo) { primo.focus(); return; }
    var sel = function (id) { var s = document.getElementById(id); return s.options[s.selectedIndex].text; };
    var interessi = Array.prototype.map.call(form.querySelectorAll("input[name=interessi]:checked"), function (c) { return c.parentNode.textContent.trim(); }).join(", ");
    var righe = [
      (en ? "Name: " : "Nome: ") + document.getElementById("g-nome").value.trim(),
      "Email: " + document.getElementById("g-email").value.trim(),
      (en ? "Country: " : "Paese: ") + sel("g-paese"),
      (en ? "Who I am: " : "Chi sono: ") + sel("g-profilo"),
      (en ? "Interested in: " : "Mi interessa: ") + (interessi || "-"),
      (en ? "Question: " : "Domanda: ") + (document.getElementById("g-domanda").value.trim() || "-"),
      (en ? "Privacy notice read: yes" : "Informativa privacy letta: sì"),
      (en ? "Email me when the handbook is available: " : "Avvisatemi quando la guida è disponibile: ") + (document.getElementById("g-avviso").checked ? M.si : M.no),
      (en ? "Source: " : "Provenienza: ") + da,
      (en ? "Language: en" : "Lingua: it")
    ];
    location.href = "mailto:" + INFO_GUIDA.email + "?subject=" + encodeURIComponent(M.oggetto) + "&body=" + encodeURIComponent(righe.join("\n"));
    var esito = document.getElementById("esito-guida");
    esito.innerHTML = "<p><strong>" + M.ok + "</strong></p><p class=\"aiuto\">" + M.mailNo + "</p>";
  });
})();
