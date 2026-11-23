/* WireBench — video della guida (pagina Guida, italiano e inglese). 23/11/2026.
 * Il lettore YouTube si carica SOLO quando il visitatore preme "Guarda il video" (dominio youtube-nocookie.com):
 * prima del clic la pagina non contatta YouTube e non riceve cookie. I link dei video si scrivono nella tabella
 * VIDEO di strumenti/genera-sito.js, non qui. */
(function () {
  "use strict";
  var boxes = document.querySelectorAll(".video[data-yt]");
  Array.prototype.forEach.call(boxes, function (box) {
    var id = box.getAttribute("data-yt");
    var btn = box.querySelector(".video-avvia");
    if (!btn || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = btn.getAttribute("data-titolo") || "Video";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.setAttribute("allowfullscreen", "");
      f.referrerPolicy = "strict-origin-when-cross-origin";
      var schermo = box.querySelector(".video-schermo");
      schermo.innerHTML = "";
      schermo.appendChild(f);
    });
  });
})();
