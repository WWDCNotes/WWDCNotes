(function () {
"use strict";
var buttons = document.querySelectorAll("[data-docc-missing-more]");
if (!buttons.length) return;
Array.prototype.forEach.call(buttons, function (button) {
var row = button.closest(".sk-docc-coverage");
if (!row) return;
var extras = row.querySelectorAll(".sk-docc-missing-card--extra");
if (!extras.length) return;
var labelMore = button.getAttribute("data-docc-missing-label-more") || button.textContent;
var labelLess = button.getAttribute("data-docc-missing-label-less") || labelMore;
row.classList.add("is-collapsed");
button.textContent = labelMore;
button.setAttribute("aria-expanded", "false");
button.hidden = false;
button.addEventListener("click", function () {
var collapsed = row.classList.toggle("is-collapsed");
button.setAttribute("aria-expanded", collapsed ? "false" : "true");
button.textContent = collapsed ? labelMore : labelLess;
});
});
})();