(function () {
"use strict";
var layout = document.querySelector(".sk-docc-layout");
if (!layout) return;
var toc = layout.querySelector(".sk-docc-toc");
if (!toc) return;
var scroller = layout.querySelector(".sk-docc-scroll");
if (!scroller) return;
function getTargets() {
var links = Array.from(toc.querySelectorAll("a.sk-docc-toc-item"));
var targets = [];
links.forEach(function (a) {
var href = a.getAttribute("href");
if (!href || href.charAt(0) !== "#") return;
var el = document.getElementById(href.slice(1));
if (el) targets.push(el);
});
targets.sort(function (a, b) {
var pos = a.compareDocumentPosition(b);
return (pos & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
});
return targets;
}
function tocLink(id) {
return toc.querySelector("a.sk-docc-toc-item[href=\"#" + id + "\"]");
}
function setActive(id) {
var items = Array.from(toc.querySelectorAll(".sk-docc-toc-item"));
items.forEach(function (a) { a.classList.remove("is-active"); });
if (!id) return;
var link = tocLink(id);
if (link) link.classList.add("is-active");
}
function computeActive(targets) {
if (!targets.length) return null;
var scrollable = scroller.scrollHeight - scroller.clientHeight > 4;
if (scrollable && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4) {
return targets[targets.length - 1].id;
}
var threshold = scroller.scrollTop + 90;
var cur = targets[0].id;
for (var i = 0; i < targets.length; i++) {
var el = targets[i];
var top = 0;
var node = el;
while (node && node !== scroller) {
top += node.offsetTop;
node = node.offsetParent;
}
if (top <= threshold) {
cur = el.id;
} else {
break;
}
}
return cur;
}
var targetsCache = null;
function onScroll() {
if (!targetsCache) targetsCache = getTargets();
setActive(computeActive(targetsCache));
}
scroller.addEventListener("scroll", onScroll, { passive: true });
targetsCache = getTargets();
setActive(computeActive(targetsCache));
Array.from(toc.querySelectorAll("a.sk-docc-toc-item")).forEach(function (a) {
a.addEventListener("click", function (evt) {
var href = a.getAttribute("href");
if (!href || href.charAt(0) !== "#") return;
var id = href.slice(1);
var target = document.getElementById(id);
if (!target) return;
evt.preventDefault();
var top = 0;
var node = target;
while (node && node !== scroller) {
top += node.offsetTop;
node = node.offsetParent;
}
var marginTop = parseInt(window.getComputedStyle(target).scrollMarginTop, 10) || 24;
scroller.scrollTo({ top: top - marginTop, behavior: "smooth" });
setActive(id);
});
});
})();