(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
  var wrap = document.getElementById("panels");
  var indicator = document.getElementById("indicator");
  var current = 0, heightTimer = null;

  function moveIndicator(tab) {
    indicator.style.width = tab.offsetWidth + "px";
    indicator.style.transform = "translateX(" + tab.offsetLeft + "px)";
  }

  function select(i, setFocus) {
    if (i === current) { if (setFocus) tabs[i].focus(); return; }
    var oldPanel = panels[current], newPanel = panels[i];

    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    moveIndicator(tabs[i]);
    tabs[i].scrollIntoView({ block: "nearest", inline: "nearest" });
    if (setFocus) tabs[i].focus();

    // animate the container height between the two panels
    clearTimeout(heightTimer);
    var from = wrap.offsetHeight;
    wrap.style.height = from + "px";
    oldPanel.classList.remove("active");
    oldPanel.hidden = true;
    newPanel.hidden = false;
    newPanel.classList.remove("active");
    var to = newPanel.offsetHeight;
    void wrap.offsetHeight;                 // flush styles
    wrap.style.height = to + "px";
    requestAnimationFrame(function () { newPanel.classList.add("active"); });
    heightTimer = setTimeout(function () { wrap.style.height = "auto"; }, 380);

    current = i;
  }

  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(i, false); });
    t.addEventListener("keydown", function (e) {
      var n = tabs.length, k = null;
      if (e.key === "ArrowRight") k = (i + 1) % n;
      else if (e.key === "ArrowLeft") k = (i - 1 + n) % n;
      else if (e.key === "Home") k = 0;
      else if (e.key === "End") k = n - 1;
      if (k !== null) { e.preventDefault(); select(k, true); }
    });
  });

  window.addEventListener("resize", function () { moveIndicator(tabs[current]); });
  window.addEventListener("load", function () { moveIndicator(tabs[current]); });

  // ----- contact form (no page reload) -----
  var box = document.getElementById("contactBox");
  var f = { name: document.getElementById("cName"), email: document.getElementById("cEmail"), msg: document.getElementById("cMsg") };
  document.getElementById("sendBtn").addEventListener("click", function () {
    var ok = true;
    var checks = {
      name: f.name.value.trim().length > 0,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()),
      msg: f.msg.value.trim().length > 0
    };
    Object.keys(checks).forEach(function (k) {
      f[k].parentNode.classList.toggle("invalid", !checks[k]);
      if (!checks[k]) ok = false;
    });
    if (!ok) return;
    var from = wrap.offsetHeight; wrap.style.height = from + "px";
    box.classList.add("done");
    var to = panels[current].offsetHeight; void wrap.offsetHeight; wrap.style.height = to + "px";
    clearTimeout(heightTimer);
    heightTimer = setTimeout(function () { wrap.style.height = "auto"; }, 380);
  });

  moveIndicator(tabs[0]);
})();
