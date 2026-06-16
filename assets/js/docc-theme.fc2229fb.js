(function () {
"use strict";
var STORAGE_KEY = "theme";
var layout = document.querySelector(".sk-docc-layout");
if (!layout) return;
var toggle = layout.querySelector(".sk-docc-theme-toggle");
if (!toggle) return;
var mql = window.matchMedia("(prefers-color-scheme:dark)");
var mqlListener = null;
var MOON_ICON =
"<svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\""
+ " stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">"
+ "<path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"/></svg>";
var SUN_ICON =
"<svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\""
+ " stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">"
+ "<circle cx=\"12\" cy=\"12\" r=\"5\"/>"
+ "<line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"/>"
+ "<line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"/><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"/>"
+ "<line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"/><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"/>"
+ "<line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"/><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"/></svg>";
function currentTheme() {
return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}
function applyTheme(value) {
document.documentElement.setAttribute("data-theme", value);
}
function syncIcon() {
toggle.innerHTML = currentTheme() === "dark" ? SUN_ICON : MOON_ICON;
}
function stopFollowingOS() {
if (mqlListener) {
mql.removeEventListener("change", mqlListener);
mqlListener = null;
}
}
toggle.addEventListener("click", function () {
stopFollowingOS();
var next = currentTheme() === "dark" ? "light" : "dark";
localStorage.setItem(STORAGE_KEY, next);
applyTheme(next);
syncIcon();
});
syncIcon();
if (!localStorage.getItem(STORAGE_KEY)) {
mqlListener = function (e) {
if (!localStorage.getItem(STORAGE_KEY)) {
applyTheme(e.matches ? "dark" : "light");
syncIcon();
} else {
stopFollowingOS();
}
};
mql.addEventListener("change", mqlListener);
}
}());