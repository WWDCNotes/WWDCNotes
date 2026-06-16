(function () {
"use strict";
var root = document.querySelector("[data-docc-search-page]");
if (!root) return;
var input = root.querySelector(".sk-docc-searchpage-input");
var clearQueryBtn = root.querySelector("[data-docc-searchpage-clear-query]");
var suggestRow = root.querySelector("[data-docc-searchpage-suggest]");
var countEl = root.querySelector("[data-docc-searchpage-count]");
var resultsEl = root.querySelector("[data-docc-searchpage-results]");
var stateEl = root.querySelector("[data-docc-searchpage-state]");
var clearAllBtn = root.querySelector("[data-docc-search-clear]");
if (!input || !resultsEl) return;
var countTemplate = input.getAttribute("data-docc-search-count") || "%lld results";
var emptyTitle = input.getAttribute("data-docc-search-empty-title") || "No matches";
var emptyBody = input.getAttribute("data-docc-search-empty-body") || "";
var promptText = input.getAttribute("data-docc-search-prompt") || "";
var loadingText = input.getAttribute("data-docc-search-loading") || "";
var typeLabels = {
ai: root.getAttribute("data-docc-label-ai") || "AI",
community: root.getAttribute("data-docc-label-community") || "Community",
stub: root.getAttribute("data-docc-label-stub") || "Stub"
};
var frameworkColors = {};
var registryEl = root.querySelector("[data-docc-search-frameworks]");
if (registryEl) {
try { frameworkColors = JSON.parse(registryEl.textContent) || {}; } catch (e) { frameworkColors = {}; }
}
var ALL_GROUPS = ["year", "type", "framework"];
var GROUPS = ALL_GROUPS.filter(function (group) {
return !!root.querySelector("[data-docc-facet-group=\"" + group + "\"]");
});
var facets = { year: "", type: "", framework: "" };
var query = "";
var MAX_ROWS = 200;
function readStateFromURL() {
var params = new URLSearchParams(window.location.search);
query = params.get("q") || "";
for (var i = 0; i < GROUPS.length; i++) {
var g = GROUPS[i];
var key = g === "type" ? "type" : g;
facets[g] = params.get(key) || "";
}
input.value = query;
}
function writeStateToURL() {
var params = new URLSearchParams();
if (query.trim()) params.set("q", query.trim());
if (facets.year) params.set("year", facets.year);
if (facets.type) params.set("type", facets.type);
if (facets.framework) params.set("framework", facets.framework);
var qs = params.toString();
var newURL = window.location.pathname + (qs ? "?" + qs : "");
window.history.replaceState(null, "", newURL);
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
var records = null;
var loadPromise = null;
function loadIndex() {
if (loadPromise) return loadPromise;
loadPromise = fetch("/assets/search/docc-search.json")
.then(function (response) { return response.json(); })
.then(function (manifest) {
var shards = (manifest && manifest.shards) || [];
return Promise.all(shards.map(function (url) {
return fetch(url).then(function (r) { return r.json(); });
}));
})
.then(function (shards) {
records = Array.prototype.concat.apply([], shards);
for (var i = 0; i < records.length; i++) {
records[i].normTitle = normalizeForSearch(records[i].title || "");
records[i].normText = normalizeForSearch(records[i].text || "");
}
})
.catch(function () { records = []; });
return loadPromise;
}
function recordField(record, group) {
if (group === "year") return record.year || "";
if (group === "type") return record.type || "";
if (group === "framework") return record.framework || "";
return "";
}
function matchesFacets(record, f) {
for (var i = 0; i < GROUPS.length; i++) {
var g = GROUPS[i];
if (f[g] && recordField(record, g) !== f[g]) return false;
}
return true;
}
function scoreQuery(record, terms) {
if (!terms.length) return 1;
var score = 0;
for (var i = 0; i < terms.length; i++) {
var term = terms[i];
if (record.normTitle.indexOf(term) !== -1) score += 10;
else if (record.normText.indexOf(term) !== -1) score += 1;
else return 0;
}
return score;
}
function queryTerms() {
var normalized = normalizeForSearch(query.trim());
return normalized ? normalized.split(/\s+/).filter(Boolean) : [];
}
function countFor(group, value, terms) {
if (!records) return 0;
var probe = { year: facets.year, type: facets.type, framework: facets.framework };
probe[group] = value;
var n = 0;
for (var i = 0; i < records.length; i++) {
if (matchesFacets(records[i], probe) && scoreQuery(records[i], terms) > 0) n++;
}
return n;
}
function escapeHTML(value) {
return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
function blurbFrom(record) {
var text = (record.text || "").trim();
if (text.length <= 150) return text;
var cut = text.slice(0, 150);
var lastSpace = cut.lastIndexOf(" ");
if (lastSpace > 80) cut = cut.slice(0, lastSpace);
return cut + "…";
}
function rowHTML(record, terms) {
var year = record.year || "";
var eyebrow = "";
if (year) {
var sid = sessionIDFromURL(record.url, year);
eyebrow = year.toUpperCase() + (sid ? " · " + sid : "");
}
var type = record.type || "community";
var badgeLabel = typeLabels[type] || type;
var isStub = type === "stub";
var head = "<div class=\"sk-docc-sessitem-head\">";
if (eyebrow) head += "<span class=\"sk-docc-sessitem-eyebrow\">" + escapeHTML(eyebrow) + "</span>";
head += "<span class=\"sk-docc-sessitem-title\">" + highlight(record.title || "", terms) + "</span>";
head += "</div>";
var blurb = blurbFrom(record);
var main = "<div class=\"sk-docc-sessitem-main\">" + head;
if (blurb) main += "<p class=\"sk-docc-sessitem-blurb\">" + escapeHTML(blurb) + "</p>";
main += "<div class=\"sk-docc-sessitem-foot\">"
+ "<span class=\"sk-docc-note-badge sk-docc-note-badge--" + type + "\">" + escapeHTML(badgeLabel) + "</span>"
+ "</div>";
main += "</div>";
return "<li><a class=\"sk-docc-sessitem" + (isStub ? " is-stub" : "") + "\" href=\"" + record.url + "\">"
+ iconHTML(record)
+ main
+ "<i class=\"sk-docc-sessitem-chev\" aria-hidden=\"true\">›</i>"
+ "</a></li>";
}
function updateChips(terms) {
var chips = root.querySelectorAll("[data-docc-facet]");
for (var i = 0; i < chips.length; i++) {
var chip = chips[i];
var group = chip.getAttribute("data-docc-facet");
var value = chip.getAttribute("data-docc-facet-value") || "";
var active = facets[group] === value;
chip.classList.toggle("is-active", active);
chip.setAttribute("aria-pressed", active ? "true" : "false");
var countSlot = chip.querySelector("[data-docc-facet-count]");
if (countSlot) {
var n = countFor(group, value, terms);
countSlot.textContent = String(n);
}
}
}
function hasActiveFacet() {
return !!(facets.year || facets.type || facets.framework);
}
function setState(html) {
if (!stateEl) return;
stateEl.innerHTML = html;
stateEl.hidden = !html;
}
function render() {
var terms = queryTerms();
var idle = !terms.length && !hasActiveFacet();
if (clearQueryBtn) clearQueryBtn.hidden = !query.trim();
if (clearAllBtn) clearAllBtn.hidden = idle;
if (suggestRow) suggestRow.hidden = !idle;
if (!records) {
if (idle) {
resultsEl.hidden = true;
resultsEl.innerHTML = "";
if (countEl) { countEl.hidden = true; }
setState("<p class=\"sk-docc-searchpage-prompt\">" + escapeHTML(promptText) + "</p>");
} else {
resultsEl.hidden = true;
if (countEl) { countEl.hidden = true; }
setState("<p class=\"sk-docc-searchpage-loading\">" + escapeHTML(loadingText) + "</p>");
}
return;
}
updateChips(terms);
if (idle) {
resultsEl.hidden = true;
resultsEl.innerHTML = "";
if (countEl) { countEl.hidden = true; countEl.textContent = ""; }
setState("<p class=\"sk-docc-searchpage-prompt\">" + escapeHTML(promptText) + "</p>");
return;
}
var scored = [];
for (var i = 0; i < records.length; i++) {
var record = records[i];
if (!matchesFacets(record, facets)) continue;
var score = scoreQuery(record, terms);
if (score > 0) scored.push({ record: record, score: score });
}
if (terms.length) scored.sort(function (a, b) { return b.score - a.score; });
if (scored.length === 0) {
resultsEl.hidden = true;
resultsEl.innerHTML = "";
if (countEl) { countEl.hidden = true; countEl.textContent = ""; }
setState(
"<div class=\"sk-docc-search-empty\">"
+ "<span class=\"sk-docc-search-empty-title\">" + escapeHTML(emptyTitle) + "</span>"
+ (emptyBody ? "<span class=\"sk-docc-search-empty-body\">" + escapeHTML(emptyBody) + "</span>" : "")
+ "</div>"
);
return;
}
setState("");
if (countEl) {
countEl.hidden = false;
countEl.textContent = countTemplate.replace("%lld", String(scored.length));
}
var rows = scored.slice(0, MAX_ROWS).map(function (item) { return rowHTML(item.record, terms); });
resultsEl.innerHTML = rows.join("");
resultsEl.hidden = false;
}
function refresh() {
writeStateToURL();
if (!records) {
render();
loadIndex().then(render);
} else {
render();
}
}
var debounceTimer;
input.addEventListener("input", function () {
query = input.value;
clearTimeout(debounceTimer);
debounceTimer = setTimeout(refresh, 120);
});
if (clearQueryBtn) {
clearQueryBtn.addEventListener("click", function () {
query = "";
input.value = "";
input.focus();
refresh();
});
}
if (clearAllBtn) {
clearAllBtn.addEventListener("click", function () {
query = "";
input.value = "";
facets = { year: "", type: "", framework: "" };
refresh();
});
}
var chips = root.querySelectorAll("[data-docc-facet]");
for (var c = 0; c < chips.length; c++) {
chips[c].addEventListener("click", function () {
var group = this.getAttribute("data-docc-facet");
var value = this.getAttribute("data-docc-facet-value") || "";
facets[group] = (facets[group] === value) ? "" : value;
refresh();
});
}
var suggestChips = root.querySelectorAll("[data-docc-search-suggest]");
for (var s = 0; s < suggestChips.length; s++) {
suggestChips[s].addEventListener("click", function () {
query = this.getAttribute("data-docc-search-suggest") || "";
input.value = query;
input.focus();
refresh();
});
}
readStateFromURL();
refresh();
})();