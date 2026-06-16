(function () {
"use strict";
var overlay = document.querySelector("[data-docc-search-overlay]");
var input = document.querySelector(".sk-docc-search-input");
var results = document.querySelector(".sk-docc-search-results");
var countEl = document.querySelector(".sk-docc-search-count");
var previewEl = document.querySelector("[data-docc-search-preview]");
var seeAllFoot = document.querySelector("[data-docc-search-foot]");
var seeAllLink = document.querySelector("[data-docc-search-seeall]");
var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
var isMac = /mac|ios|iphone|ipad|ipod/i.test(platform);
if (!isMac) {
var kbdEls = document.querySelectorAll("[data-docc-kbd]");
for (var k = 0; k < kbdEls.length; k++) {
kbdEls[k].textContent = "Ctrl+K";
}
}
if (!overlay || !input || !results) return;
var countTemplate = input.getAttribute("data-docc-search-count") || "%lld results";
var emptyTitle = input.getAttribute("data-docc-search-empty-title") || "No matches";
var emptyBody = input.getAttribute("data-docc-search-empty-body") || "";
var watchLabel = input.getAttribute("data-docc-search-watch") || "Watch Video";
var moreLabel = input.getAttribute("data-docc-search-more") || "View more";
var typeLabels = {
ai: input.getAttribute("data-docc-label-ai") || "AI",
community: input.getAttribute("data-docc-label-community") || "Community",
stub: input.getAttribute("data-docc-label-stub") || "Stub"
};
var frameworkColors = {};
var registryEl = overlay.querySelector("[data-docc-search-frameworks]");
if (registryEl) {
try { frameworkColors = JSON.parse(registryEl.textContent) || {}; } catch (e) { frameworkColors = {}; }
}
var lastFocus = null;
var visibleRecords = [];
var activeTerms = [];
var layout = document.querySelector(".sk-docc-layout");
function openSearch() {
if (!overlay.hasAttribute("hidden")) return;
lastFocus = document.activeElement;
overlay.removeAttribute("hidden");
document.documentElement.style.overflow = "hidden";
if (layout) {
var appbarEl = layout.querySelector(".sk-docc-appbar");
var bodyEl = layout.querySelector(".sk-docc-body");
if (appbarEl) appbarEl.inert = true;
if (bodyEl) bodyEl.inert = true;
}
input.focus();
input.select();
loadIndex();
}
function closeSearch() {
if (overlay.hasAttribute("hidden")) return;
overlay.setAttribute("hidden", "");
document.documentElement.style.overflow = "";
if (layout) {
var appbarEl = layout.querySelector(".sk-docc-appbar");
var bodyEl = layout.querySelector(".sk-docc-body");
if (appbarEl) appbarEl.inert = false;
if (bodyEl) bodyEl.inert = false;
}
input.value = "";
renderResults("");
if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}
var openBtns = document.querySelectorAll("[data-docc-search-open]");
for (var p = 0; p < openBtns.length; p++) {
openBtns[p].addEventListener("click", openSearch);
}
var closeBtns = overlay.querySelectorAll("[data-docc-search-close]");
for (var c = 0; c < closeBtns.length; c++) {
closeBtns[c].addEventListener("click", closeSearch);
}
var chips = overlay.querySelectorAll("[data-docc-search-suggest]");
for (var s = 0; s < chips.length; s++) {
chips[s].addEventListener("click", function () {
var term = this.getAttribute("data-docc-search-suggest") || "";
input.value = term;
input.focus();
loadIndex().then(function () { renderResults(term); });
});
}
document.addEventListener("keydown", function (event) {
var modifierHeld = isMac ? event.metaKey : event.ctrlKey;
var key = event.key.toLowerCase();
var opensSearch = (modifierHeld && key === "k") || (modifierHeld && event.shiftKey && key === "o");
if (opensSearch) {
var tag = document.activeElement && document.activeElement.tagName;
var typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
|| (document.activeElement && document.activeElement.isContentEditable);
if (typing && document.activeElement !== input) return;
event.preventDefault();
openSearch();
return;
}
if (event.key === "Escape" && !overlay.hasAttribute("hidden")) {
event.preventDefault();
closeSearch();
}
});
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
var records = null;
var loadPromise = null;
function loadIndex() {
if (loadPromise) return loadPromise;
loadPromise = fetch("/assets/search/docc-search.json")
.then(function (response) { return response.json(); })
.then(function (manifest) {
var shards = (manifest && manifest.shards) || [];
return Promise.all(shards.map(function (url) {
return fetch(url).then(function (response) { return response.json(); });
}));
})
.then(function (shards) {
records = Array.prototype.concat.apply([], shards);
for (var i = 0; i < records.length; i++) {
records[i].normTitle = normalizeForSearch(records[i].title || "");
records[i].normText = normalizeForSearch(records[i].text || "");
}
})
.catch(function () {
records = [];
});
return loadPromise;
}
function scoreRecord(record, terms) {
var score = 0;
for (var i = 0; i < terms.length; i++) {
var term = terms[i];
if (record.normTitle.indexOf(term) !== -1) {
score += 10;
} else if (record.normText.indexOf(term) !== -1) {
score += 1;
} else {
return 0;
}
}
return score;
}
function escapeHTML(value) {
return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(value) {
return escapeHTML(value).replace(/"/g, "&quot;");
}
function highlight(text, terms) {
text = String(text == null ? "" : text);
var nm = normalizeWithMap(text);
var ranges = [];
for (var i = 0; i < terms.length; i++) {
var term = terms[i];
if (!term) continue;
var idx = nm.norm.indexOf(term);
while (idx !== -1) {
ranges.push([nm.map[idx], nm.map[idx + term.length - 1] + 1]);
idx = nm.norm.indexOf(term, idx + term.length);
}
}
if (!ranges.length) return escapeHTML(text);
ranges.sort(function (a, b) { return a[0] - b[0]; });
var merged = [ranges[0]];
for (var r = 1; r < ranges.length; r++) {
var prev = merged[merged.length - 1];
if (ranges[r][0] <= prev[1]) prev[1] = Math.max(prev[1], ranges[r][1]);
else merged.push(ranges[r]);
}
var out = "";
var pos = 0;
for (var m = 0; m < merged.length; m++) {
out += escapeHTML(text.slice(pos, merged[m][0]))
+ "<mark class=\"sk-docc-search-hl\">" + escapeHTML(text.slice(merged[m][0], merged[m][1])) + "</mark>";
pos = merged[m][1];
}
return out + escapeHTML(text.slice(pos));
}
function sessionIDFromURL(url, year) {
var parts = url.split("/").filter(Boolean);
var slug = parts.length ? parts[parts.length - 1] : "";
if (!year || slug.indexOf(year + "-") !== 0) return "";
var rest = slug.slice(year.length + 1);
var seg = rest.split("-")[0];
return seg || "";
}
function eyebrowFor(record) {
var year = record.year || "";
if (!year) return "";
var sid = sessionIDFromURL(record.url, year);
return year.toUpperCase() + (sid ? " · " + sid : "");
}
function iconHTML(record) {
var colors = record.framework ? frameworkColors[record.framework] : null;
var style = "";
if (colors && colors.length >= 2) {
style = " style=\"background:linear-gradient(145deg," + colors[0] + "," + colors[1] + ")\"";
} else if (colors && colors.length === 1) {
style = " style=\"background:" + colors[0] + "\"";
}
return "<span class=\"sk-docc-sessitem-icon\"" + style + " aria-hidden=\"true\"></span>";
}
function clamp(text, limit) {
text = (text || "").trim();
if (text.length <= limit) return text;
var cut = text.slice(0, limit);
var lastSpace = cut.lastIndexOf(" ");
if (lastSpace > limit * 0.5) cut = cut.slice(0, lastSpace);
return cut + "…";
}
function excerptFrom(record) {
var text = (record.text || "").trim();
var summary = (record.summary || "").trim();
if (summary && text.indexOf(summary) === 0) {
text = text.slice(summary.length).trim();
}
return text;
}
function rowBlurb(record) {
var summary = (record.summary || "").trim();
return clamp(summary || excerptFrom(record), 140);
}
function rowHTML(record, terms, index) {
var eyebrow = eyebrowFor(record);
var type = record.type || "community";
var badgeLabel = typeLabels[type] || type;
var isStub = type === "stub";
var head = "<div class=\"sk-docc-sessitem-head\">";
if (eyebrow) head += "<span class=\"sk-docc-sessitem-eyebrow\">" + escapeHTML(eyebrow) + "</span>";
head += "<span class=\"sk-docc-sessitem-title\">" + highlight(record.title || "", terms) + "</span>";
head += "</div>";
var blurb = rowBlurb(record);
var main = "<div class=\"sk-docc-sessitem-main\">" + head;
if (blurb) main += "<p class=\"sk-docc-sessitem-blurb\">" + highlight(blurb, terms) + "</p>";
main += "<div class=\"sk-docc-sessitem-foot\">"
+ "<span class=\"sk-docc-note-badge sk-docc-note-badge--" + type + "\">" + escapeHTML(badgeLabel) + "</span>"
+ "</div>";
main += "</div>";
return "<li><a class=\"sk-docc-sessitem" + (isStub ? " is-stub" : "") + "\" href=\"" + escapeAttr(record.url) + "\""
+ " data-docc-search-idx=\"" + index + "\">"
+ iconHTML(record)
+ main
+ "<i class=\"sk-docc-sessitem-chev\" aria-hidden=\"true\">›</i>"
+ "</a></li>";
}
var playIconSVG = "<svg class=\"sk-docc-watch-ic\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\""
+ " fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M8 5v14l11-7z\"/></svg>";
function previewHTML(record) {
if (!record) return "";
var eyebrow = eyebrowFor(record);
var head = "<div class=\"sk-docc-search-preview-head\">"
+ iconHTML(record)
+ (eyebrow ? "<span class=\"sk-docc-search-preview-eyebrow\">" + escapeHTML(eyebrow) + "</span>" : "")
+ "</div>";
var html = "<div class=\"sk-docc-search-preview-card\">"
+ head
+ "<h3 class=\"sk-docc-search-preview-title\">" + highlight(record.title || "", activeTerms) + "</h3>";
var summary = (record.summary || "").trim();
if (summary) {
html += "<p class=\"sk-docc-search-preview-desc\">" + highlight(summary, activeTerms) + "</p>";
}
if (record.video) {
var minutes = (typeof record.minutes === "number") ? record.minutes : null;
var label = watchLabel + (minutes !== null ? " (" + minutes + " min)" : "");
html += "<a class=\"sk-docc-watch\" href=\"" + escapeAttr(record.video) + "\">" + playIconSVG + escapeHTML(label) + "</a>";
}
var excerpt = clamp(excerptFrom(record), 320);
if (excerpt) {
html += "<p class=\"sk-docc-search-preview-excerpt\">" + highlight(excerpt, activeTerms) + "</p>";
}
html += "<a class=\"sk-docc-search-preview-more\" href=\"" + escapeAttr(record.url) + "\">"
+ escapeHTML(moreLabel) + " <span aria-hidden=\"true\">→</span></a>";
html += "</div>";
return html;
}
function showPreview(index) {
if (!previewEl) return;
var rows = results.querySelectorAll(".sk-docc-sessitem");
for (var i = 0; i < rows.length; i++) {
rows[i].classList.toggle("is-active", String(index) === rows[i].getAttribute("data-docc-search-idx"));
}
var record = (index >= 0 && index < visibleRecords.length) ? visibleRecords[index] : null;
if (!record) {
hidePreview();
return;
}
previewEl.innerHTML = previewHTML(record);
previewEl.hidden = false;
previewEl.removeAttribute("aria-hidden");
}
function hidePreview() {
if (!previewEl) return;
previewEl.hidden = true;
previewEl.innerHTML = "";
previewEl.setAttribute("aria-hidden", "true");
}
function updateSeeAll(rawQuery) {
if (!seeAllFoot || !seeAllLink) return;
var q = rawQuery.trim();
var base = seeAllLink.getAttribute("data-docc-search-page-url") || seeAllLink.getAttribute("href");
seeAllLink.setAttribute("href", q ? base + "?q=" + encodeURIComponent(q) : base);
seeAllFoot.hidden = !q;
}
function clearResults() {
results.hidden = true;
results.innerHTML = "";
visibleRecords = [];
hidePreview();
if (countEl) { countEl.hidden = true; countEl.textContent = ""; }
}
function renderResults(query) {
updateSeeAll(query);
var normalized = normalizeForSearch(query.trim());
var terms = normalized ? normalized.split(/\s+/).filter(Boolean) : [];
if (!terms.length || !records) {
clearResults();
return;
}
activeTerms = terms;
var scored = [];
for (var i = 0; i < records.length; i++) {
var score = scoreRecord(records[i], terms);
if (score > 0) scored.push({ record: records[i], score: score });
}
scored.sort(function (a, b) { return b.score - a.score; });
var top = scored.slice(0, 20);
if (top.length === 0) {
visibleRecords = [];
if (countEl) { countEl.hidden = true; countEl.textContent = ""; }
hidePreview();
results.innerHTML = "<li class=\"sk-docc-search-empty\">"
+ "<span class=\"sk-docc-search-empty-title\">" + escapeHTML(emptyTitle) + "</span>"
+ (emptyBody ? "<span class=\"sk-docc-search-empty-body\">" + escapeHTML(emptyBody) + "</span>" : "")
+ "</li>";
results.hidden = false;
return;
}
if (countEl) {
countEl.hidden = false;
countEl.textContent = countTemplate.replace("%lld", String(scored.length));
}
visibleRecords = top.map(function (item) { return item.record; });
results.innerHTML = top.map(function (item, idx) { return rowHTML(item.record, terms, idx); }).join("");
results.hidden = false;
showPreview(0);
}
function previewFromEvent(event) {
var row = event.target.closest ? event.target.closest(".sk-docc-sessitem") : null;
if (!row) return;
var idx = parseInt(row.getAttribute("data-docc-search-idx"), 10);
if (!isNaN(idx)) showPreview(idx);
}
results.addEventListener("mouseover", previewFromEvent);
results.addEventListener("focusin", previewFromEvent);
var debounceTimer;
input.addEventListener("input", function () {
var value = input.value;
clearTimeout(debounceTimer);
debounceTimer = setTimeout(function () {
loadIndex().then(function () { renderResults(value); });
}, 120);
});
var searchModal = overlay.querySelector(".sk-docc-search-modal");
if (searchModal) {
searchModal.addEventListener("keydown", function (event) {
if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
var resultLinks = results ? Array.prototype.slice.call(results.querySelectorAll(".sk-docc-sessitem")) : [];
if (!resultLinks.length) return;
event.preventDefault();
var focused = document.activeElement;
var currentIdx = resultLinks.indexOf(focused);
if (event.key === "ArrowDown") {
if (focused === input || currentIdx === -1) {
resultLinks[0].focus();
} else {
resultLinks[(currentIdx + 1) % resultLinks.length].focus();
}
} else {
if (focused === input || currentIdx === -1) {
resultLinks[resultLinks.length - 1].focus();
} else {
resultLinks[(currentIdx - 1 + resultLinks.length) % resultLinks.length].focus();
}
}
});
}
})();