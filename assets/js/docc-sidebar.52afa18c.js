(function () {
"use strict";
var layout = document.querySelector(".sk-docc-layout");
if (!layout) return;
layout.classList.add("sk-docc-js");
var openBtn = layout.querySelector("[data-docc-sidebar-open]");
var closeBtn = layout.querySelector("[data-docc-sidebar-close]");
var scrim = layout.querySelector("[data-docc-sidebar-scrim]");
var sidebar = layout.querySelector(".sk-docc-sidebar");
function setOpen(open) {
if (open) {
layout.setAttribute("data-sidebar-open", "");
} else {
layout.removeAttribute("data-sidebar-open");
}
if (openBtn) openBtn.setAttribute("aria-expanded", open ? "true" : "false");
if (scrim) scrim.hidden = !open;
if (sidebar) {
if (open) sidebar.setAttribute("aria-modal", "true");
else sidebar.removeAttribute("aria-modal");
}
var mainEl = layout.querySelector("main");
var appbarEl = layout.querySelector(".sk-docc-appbar");
if (mainEl) mainEl.inert = open;
if (appbarEl) appbarEl.inert = open;
document.documentElement.style.overflow = open ? "hidden" : "";
}
function open() {
setOpen(true);
if (closeBtn) {
closeBtn.focus();
} else if (sidebar) {
sidebar.focus();
}
}
function close() {
setOpen(false);
if (openBtn) openBtn.focus();
}
if (openBtn) openBtn.addEventListener("click", open);
if (closeBtn) closeBtn.addEventListener("click", close);
if (scrim) scrim.addEventListener("click", close);
if (sidebar) {
sidebar.addEventListener("click", function (event) {
var link = event.target.closest("a.sk-docc-nav-link");
if (link) close();
});
}
document.addEventListener("keydown", function (event) {
if (event.key === "Escape" && layout.hasAttribute("data-sidebar-open")) {
close();
}
});
var tops = Array.prototype.slice.call(layout.querySelectorAll(".sk-docc-nav-top"));
function subtreeOf(top) {
var twist = top.querySelector("[data-docc-subtree-toggle]");
if (!twist) return null;
var id = twist.getAttribute("aria-controls");
return id ? document.getElementById(id) : null;
}
function setBranchOpen(top, open) {
var twist = top.querySelector("[data-docc-subtree-toggle]");
var sub = subtreeOf(top);
if (sub) {
if (open) sub.removeAttribute("hidden");
else sub.setAttribute("hidden", "");
}
if (twist) twist.setAttribute("aria-expanded", open ? "true" : "false");
}
function navigateRow(top) {
var navLink = top.querySelector("a.sk-docc-nav-link");
if (navLink && navLink.href) window.location.href = navLink.href;
}
function openAccordion(top) {
tops.forEach(function (other) {
if (other !== top) setBranchOpen(other, false);
});
setBranchOpen(top, true);
}
var navDataPromise = null;
function loadNavData() {
if (!navDataPromise) {
navDataPromise = fetch("/assets/docc-sidebar-nav.json").then(function (resp) {
if (!resp.ok) throw new Error("docc-sidebar-nav.json " + resp.status);
return resp.json();
});
}
return navDataPromise;
}
var stubTitle = sidebar ? sidebar.getAttribute("data-docc-stub-title") : null;
var iconByFramework = {};
Array.prototype.forEach.call(
layout.querySelectorAll(".sk-docc-nav-fw-icon[data-framework]"),
function (el) {
var fw = el.getAttribute("data-framework");
if (fw && !iconByFramework[fw]) iconByFramework[fw] = el.outerHTML;
}
);
function escapeHTML(value) {
return String(value)
.replace(/&/g, "&amp;")
.replace(/"/g, "&quot;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;");
}
function iconHTML(framework) {
if (framework && iconByFramework[framework]) return iconByFramework[framework];
return '<span class="sk-docc-nav-icon" aria-hidden="true"></span>';
}
function sessionRowHTML(session) {
var stubClass = session.isStub ? " sk-docc-nav-stub" : "";
var stubAttr = session.isStub && stubTitle ? ' title="' + escapeHTML(stubTitle) + '"' : "";
return '<li class="sk-docc-nav-session' + stubClass + '">'
+ '<a class="sk-docc-nav-link" href="' + escapeHTML(session.url) + '"' + stubAttr + ">"
+ iconHTML(session.framework)
+ '<span class="sk-docc-nav-text">' + escapeHTML(session.title) + "</span></a></li>";
}
function buildSubtreeInner(yearData) {
var sessions = yearData.sessions || {};
var groups = yearData.groups || [];
var sortedSlugs = Object.keys(sessions).sort();
if (groups.length === 0) {
return sortedSlugs
.map(function (slug) { return sessionRowHTML(sessions[slug]); })
.join("");
}
var placed = {};
var html = "";
groups.forEach(function (group) {
var rows = "";
(group.slugs || []).forEach(function (slug) {
if (sessions[slug]) {
placed[slug] = true;
rows += sessionRowHTML(sessions[slug]);
}
});
if (rows) {
html += '<li class="sk-docc-nav-subgroup">'
+ '<span class="sk-docc-nav-subgroup-h">' + escapeHTML(group.title) + "</span>"
+ '<ul class="sk-docc-nav-sessions">' + rows + "</ul></li>";
}
});
var ungrouped = sortedSlugs
.filter(function (slug) { return !placed[slug]; })
.map(function (slug) { return sessionRowHTML(sessions[slug]); })
.join("");
if (ungrouped) html += '<li class="sk-docc-nav-subgroup">' + ungrouped + "</li>";
return html;
}
function hydrateAndOpen(top, sub) {
var year = sub.getAttribute("data-docc-unhydrated");
loadNavData()
.then(function (data) {
var yearData = data && data[year];
var inner = yearData ? buildSubtreeInner(yearData) : "";
if (!inner) {
navigateRow(top);
return;
}
sub.innerHTML = inner;
if ((yearData.groups || []).length > 0) sub.classList.add("sk-docc-nav-grouped");
sub.removeAttribute("data-docc-unhydrated");
openAccordion(top);
})
.catch(function () {
navigateRow(top);
});
}
tops.forEach(function (top) {
var twist = top.querySelector("[data-docc-subtree-toggle]");
if (!twist) return;
twist.addEventListener("click", function (event) {
event.preventDefault();
var sub = subtreeOf(top);
var isOpen = sub && !sub.hasAttribute("hidden");
if (isOpen) {
setBranchOpen(top, false);
return;
}
if (sub && sub.hasAttribute("data-docc-unhydrated")) {
hydrateAndOpen(top, sub);
return;
}
if (!sub || sub.children.length === 0) {
navigateRow(top);
return;
}
openAccordion(top);
});
});
window.SKDocCNav = {
loadNavData: loadNavData,
buildSubtreeInner: buildSubtreeInner,
};
})();