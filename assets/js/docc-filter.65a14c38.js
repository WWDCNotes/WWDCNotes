(function () {
"use strict";
var layout = document.querySelector(".sk-docc-layout");
if (!layout) return;
var filterInput = layout.querySelector(".sk-docc-filter-input");
var clearBtn = layout.querySelector(".sk-docc-filter-clear");
if (!filterInput) return;
var nav = window.SKDocCNav || null;
var MIN_QUERY = 2;
var DEBOUNCE_MS = 150;
var topBranches = Array.from(layout.querySelectorAll(".sk-docc-nav-top"));
function subtreeOfTop(top) {
var twist = top.querySelector("[data-docc-subtree-toggle]");
if (!twist) return null;
var id = twist.getAttribute("aria-controls");
return id ? document.getElementById(id) : null;
}
function setTopOpen(top, open) {
var twist = top.querySelector("[data-docc-subtree-toggle]");
var sub = subtreeOfTop(top);
if (sub) {
if (open) sub.removeAttribute("hidden");
else sub.setAttribute("hidden", "");
}
if (twist) twist.setAttribute("aria-expanded", open ? "true" : "false");
}
function isCrossYearManaged(sub) {
return !!sub && (sub.hasAttribute("data-docc-unhydrated") || sub.hasAttribute("data-docc-filter-injected"));
}
var initialOpenBranch = (function () {
for (var i = 0; i < topBranches.length; i++) {
var sub = subtreeOfTop(topBranches[i]);
if (sub && !sub.hasAttribute("hidden")) return topBranches[i];
}
return null;
})();
function getFilterableItems() {
return Array.from(layout.querySelectorAll(".sk-docc-nav-session, .sk-docc-nav-item"))
.filter(function (li) { return !li.closest("[data-docc-filter-injected]"); });
}
function normalizeWithMap(text) {
var norm = "";
var map = [];
for (var i = 0; i < text.length; i++) {
var ch = text.charAt(i);
if (ch === "‘" || ch === "’") ch = "'";
else if (ch === "“" || ch === "”") ch = "\"";
if (ch === "'") continue;
var lower = ch.toLowerCase();
for (var j = 0; j < lower.length; j++) {
norm += lower.charAt(j);
map.push(i);
}
}
return { norm: norm, map: map };
}
function normalizeForSearch(text) {
return normalizeWithMap(String(text == null ? "" : text)).norm;
}
function highlight(text, query) {
if (!query) return text;
var nm = normalizeWithMap(text);
var idx = nm.norm.indexOf(query);
if (idx < 0) return text;
var start = nm.map[idx];
var end = nm.map[idx + query.length - 1] + 1;
return text.slice(0, start) + "<mark class=\"sk-docc-hl\">" + text.slice(start, end) + "</mark>" + text.slice(end);
}
var originalTexts = new WeakMap();
function saveOriginals() {
var items = getFilterableItems();
items.forEach(function (li) {
var textEl = li.querySelector(".sk-docc-nav-text");
if (textEl && !originalTexts.has(li)) {
originalTexts.set(li, textEl.innerHTML);
}
});
}
function restorePlaceholder(sub) {
if (!sub || !sub.hasAttribute("data-docc-filter-injected")) return;
var year = sub.getAttribute("data-docc-filter-year") || sub.getAttribute("data-docc-unhydrated");
sub.innerHTML = "";
sub.classList.remove("sk-docc-nav-grouped");
if (year) sub.setAttribute("data-docc-unhydrated", year);
sub.removeAttribute("data-docc-filter-injected");
sub.removeAttribute("data-docc-filter-year");
sub.setAttribute("hidden", "");
}
function matchingSubtreeInner(yearData, query) {
var sessions = (yearData && yearData.sessions) || {};
var filtered = {};
var any = false;
Object.keys(sessions).forEach(function (slug) {
var session = sessions[slug];
var title = session && session.title != null ? String(session.title) : "";
if (normalizeForSearch(title).indexOf(query) >= 0) {
filtered[slug] = session;
any = true;
}
});
if (!any) return "";
return nav.buildSubtreeInner({ groups: yearData.groups || [], sessions: filtered });
}
function highlightInjected(sub, query) {
Array.prototype.forEach.call(sub.querySelectorAll(".sk-docc-nav-session .sk-docc-nav-text"), function (textEl) {
textEl.innerHTML = highlight(textEl.innerHTML, query);
});
}
var filterSeq = 0;
function applyCrossYear(query, seq) {
if (!nav || !nav.loadNavData || !nav.buildSubtreeInner) return;
nav.loadNavData().then(function (data) {
if (seq !== filterSeq) return;
if (!data) return;
topBranches.forEach(function (top) {
var sub = subtreeOfTop(top);
if (!isCrossYearManaged(sub)) return;
var year = sub.getAttribute("data-docc-filter-year") || sub.getAttribute("data-docc-unhydrated");
var labelEl = top.querySelector(".sk-docc-nav-row .sk-docc-nav-text");
var labelMatch = labelEl ? normalizeForSearch(labelEl.textContent).indexOf(query) >= 0 : false;
var yearData = year ? data[year] : null;
var inner = yearData ? matchingSubtreeInner(yearData, query) : "";
if (inner) {
sub.innerHTML = inner;
if ((yearData.groups || []).length > 0) sub.classList.add("sk-docc-nav-grouped");
else sub.classList.remove("sk-docc-nav-grouped");
sub.setAttribute("data-docc-filter-year", year);
sub.setAttribute("data-docc-filter-injected", "");
sub.removeAttribute("data-docc-unhydrated");
highlightInjected(sub, query);
top.hidden = false;
setTopOpen(top, true);
} else {
restorePlaceholder(sub);
top.hidden = !labelMatch;
setTopOpen(top, false);
}
});
});
}
function applyFilter(q) {
filterSeq += 1;
var seq = filterSeq;
var query = normalizeForSearch(q.trim());
if (query.length < MIN_QUERY) query = "";
if (!query) {
Array.prototype.forEach.call(layout.querySelectorAll("[data-docc-filter-injected]"), restorePlaceholder);
}
saveOriginals();
var items = getFilterableItems();
items.forEach(function (li) {
var link = li.querySelector(".sk-docc-nav-link, .sk-docc-nav-year");
var textEl = li.querySelector(".sk-docc-nav-text");
if (!link || !textEl) return;
var original = originalTexts.get(li) || textEl.innerHTML;
if (!query) {
li.hidden = false;
textEl.innerHTML = original;
return;
}
var plainText = textEl.textContent || textEl.innerText || "";
if (normalizeForSearch(plainText).indexOf(query) >= 0) {
li.hidden = false;
textEl.innerHTML = highlight(original, query);
} else {
li.hidden = true;
textEl.innerHTML = original;
}
});
var yearItems = Array.from(layout.querySelectorAll(".sk-docc-nav-item"));
yearItems.forEach(function (yearLi) {
if (!query) {
yearLi.hidden = false;
return;
}
if (yearLi.classList.contains("sk-docc-nav-top") && isCrossYearManaged(subtreeOfTop(yearLi))) return;
var yearLink = yearLi.querySelector(".sk-docc-nav-year");
var yearText = yearLink ? (yearLink.textContent || "") : "";
var titleMatch = normalizeForSearch(yearText).indexOf(query) >= 0;
var sessions = Array.from(yearLi.querySelectorAll(".sk-docc-nav-session"));
var anyVisible = sessions.some(function (s) { return !s.hidden; });
yearLi.hidden = !(titleMatch || anyVisible);
});
var subgroups = Array.from(layout.querySelectorAll(".sk-docc-nav-subgroup"));
subgroups.forEach(function (sg) {
if (!query) {
sg.hidden = false;
return;
}
if (sg.closest("[data-docc-filter-injected]")) return;
var sessions = Array.from(sg.querySelectorAll(".sk-docc-nav-session"));
sg.hidden = sessions.length > 0 && sessions.every(function (s) { return s.hidden; });
});
topBranches.forEach(function (top) {
if (!query) {
setTopOpen(top, top === initialOpenBranch);
return;
}
var sub = subtreeOfTop(top);
if (isCrossYearManaged(sub)) return;
var labelEl = top.querySelector(".sk-docc-nav-row .sk-docc-nav-text");
var labelMatch = labelEl ? normalizeForSearch(labelEl.textContent).indexOf(query) >= 0 : false;
var hasVisibleDescendant = sub
? Array.from(sub.querySelectorAll(".sk-docc-nav-session")).some(function (s) { return !s.hidden; })
: false;
setTopOpen(top, labelMatch || hasVisibleDescendant);
});
if (query) applyCrossYear(query, seq);
}
var debounceTimer = null;
filterInput.addEventListener("input", function () {
var q = filterInput.value;
if (clearBtn) clearBtn.hidden = !q;
if (debounceTimer) {
clearTimeout(debounceTimer);
debounceTimer = null;
}
if (q.trim().length < MIN_QUERY) {
applyFilter("");
return;
}
debounceTimer = setTimeout(function () {
debounceTimer = null;
applyFilter(q);
}, DEBOUNCE_MS);
});
if (clearBtn) {
clearBtn.addEventListener("click", function () {
filterInput.value = "";
if (debounceTimer) {
clearTimeout(debounceTimer);
debounceTimer = null;
}
applyFilter("");
clearBtn.hidden = true;
filterInput.focus();
});
}
})();