document.addEventListener('DOMContentLoaded', function () {
   // Syntax highlighting (if highlight.js is loaded)
   if (typeof hljs !== 'undefined') {
      hljs.highlightAll();
   }

   // Theme toggle (dark/light)
   var toggle = document.querySelector('.sk-theme-toggle');
   if (toggle) {
      toggle.addEventListener('click', function () {
         var current = document.documentElement.getAttribute('data-theme');
         var next = current === 'dark' ? 'light' : 'dark';
         document.documentElement.setAttribute('data-theme', next);
         localStorage.setItem('theme', next);
      });
   }

   // Mobile nav toggle
   var navToggle = document.querySelector('.sk-nav-toggle');
   var navList = document.querySelector('.sk-nav-list');
   if (navToggle && navList) {
      navToggle.addEventListener('click', function () {
         navList.classList.toggle('sk-nav-open');
         var expanded = navToggle.getAttribute('aria-expanded') === 'true';
         navToggle.setAttribute('aria-expanded', !expanded);
      });
   }

   // Search modal
   var searchBtn = document.querySelector('.sk-search-btn');
   if (searchBtn) {
      var searchData = null;
      var fullTextData = null;
      var fullTextLoading = false;
      var searchOverlay = null;
      var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
      var shortcutLabel = isMac ? '\u2318K' : 'Ctrl+K';

      // Add tooltip to search button
      var tooltip = document.createElement('span');
      tooltip.className = 'sk-tooltip';
      tooltip.textContent = 'Search (' + shortcutLabel + ')';
      searchBtn.appendChild(tooltip);

      function tagURL(slug) {
         return '/tags/' + slug + '/';
      }

      function highlightMatch(text, query) {
         if (!query) return escapeHTML(text);
         var escaped = escapeHTML(text);
         var idx = escaped.toLowerCase().indexOf(query.toLowerCase());
         if (idx === -1) return escaped;
         return escaped.substring(0, idx) +
            '<mark class="sk-search-highlight">' + escaped.substring(idx, idx + query.length) + '</mark>' +
            escaped.substring(idx + query.length);
      }

      function escapeHTML(str) {
         var div = document.createElement('div');
         div.textContent = str;
         return div.innerHTML;
      }

      function truncateAround(text, query, maxLen) {
         if (!text) return '';
         var lower = text.toLowerCase();
         var idx = query ? lower.indexOf(query.toLowerCase()) : -1;
         if (idx > 30) {
            var start = text.lastIndexOf(' ', idx - 15);
            if (start === -1) start = idx - 20;
            text = '\u2026' + text.substring(Math.max(0, start));
         }
         if (text.length > maxLen) {
            text = text.substring(0, maxLen) + '\u2026';
         }
         return text;
      }

      function renderArticle(a, query, useText) {
         var preview = '';
         if (useText) {
            preview = truncateAround(a.text || '', query, 120);
         } else {
            preview = truncateAround(a.summary || '', query, 100);
         }
         return '<a class="sk-search-post" href="' + a.url + '">' +
            '<span class="sk-search-post-title">' + highlightMatch(a.title, query) + '</span>' +
            (preview ? '<span class="sk-search-post-summary">' + highlightMatch(preview, query) + '</span>' : '') +
            '</a>';
      }

      // Loading state management
      var activeLoads = 0;
      function setLoading(loading) {
         activeLoads += loading ? 1 : -1;
         if (activeLoads < 0) activeLoads = 0;
         var spinner = searchOverlay && searchOverlay.querySelector('.sk-search-header-spinner');
         if (spinner) spinner.style.display = activeLoads > 0 ? 'block' : 'none';
      }

      function createModal() {
         searchOverlay = document.createElement('div');
         searchOverlay.className = 'sk-search-overlay';
         searchOverlay.innerHTML =
            '<div class="sk-search-modal">' +
               '<div class="sk-search-header">' +
                  '<button class="sk-search-close" aria-label="Close">\u00d7</button>' +
                  '<input class="sk-search-input" type="text" placeholder="Search articles, tags\u2026" autocomplete="off"/>' +
                  '<div class="sk-search-spinner sk-search-header-spinner" style="display:none"></div>' +
                  '<kbd class="sk-search-kbd">Esc</kbd>' +
               '</div>' +
               '<div class="sk-search-results"></div>' +
            '</div>';
         document.body.appendChild(searchOverlay);

         var input = searchOverlay.querySelector('.sk-search-input');
         var results = searchOverlay.querySelector('.sk-search-results');
         var closeBtn = searchOverlay.querySelector('.sk-search-close');

         closeBtn.addEventListener('click', closeSearch);
         searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) closeSearch();
         });

         var fullTextTimer = null;
         input.addEventListener('input', function() {
            var query = input.value.trim();
            if (fullTextTimer) clearTimeout(fullTextTimer);
            if (!query) {
               results.innerHTML = '';
               return;
            }
            if (searchData) {
               renderInstantResults(results, query);
            }
            fullTextTimer = setTimeout(function() {
               triggerFullTextSearch(results, query);
            }, 300);
         });

         return searchOverlay;
      }

      function renderInstantResults(container, query) {
         var html = '';
         var lower = query.toLowerCase();

         // Match tags
         var matchedTags = [];
         var tags = searchData.tags || {};
         for (var slug in tags) {
            if (slug.indexOf(lower) !== -1 || tags[slug].toLowerCase().indexOf(lower) !== -1) {
               matchedTags.push({ slug: slug, name: tags[slug] });
            }
         }

         if (matchedTags.length > 0) {
            html += '<div class="sk-search-section">TAGS</div>';
            matchedTags.slice(0, 5).forEach(function(tag) {
               html += '<a class="sk-search-tag" href="' + tagURL(tag.slug) + '">' + highlightMatch(tag.name, query) + '</a>';
            });
         }

         // Match articles by title + summary
         var articles = searchData.articles || [];
         var matched = articles.filter(function(a) {
            return a.title.toLowerCase().indexOf(lower) !== -1 ||
                   (a.summary && a.summary.toLowerCase().indexOf(lower) !== -1);
         });

         if (matched.length > 0) {
            html += '<div class="sk-search-section">ARTICLES</div>';
            matched.slice(0, 10).forEach(function(a) {
               html += renderArticle(a, query, false);
            });
         }

         if (!matchedTags.length && !matched.length) {
            html += '<div class="sk-search-no-results">No results found.</div>';
         }

         container.innerHTML = html;
      }

      function triggerFullTextSearch(container, query) {
         if (!searchData) return;
         var lower = query.toLowerCase();

         var instantSlugs = new Set();
         (searchData.articles || []).forEach(function(a) {
            if (a.title.toLowerCase().indexOf(lower) !== -1 ||
                (a.summary && a.summary.toLowerCase().indexOf(lower) !== -1)) {
               instantSlugs.add(a.slug);
            }
         });

         function doFullTextSearch() {
            if (!fullTextData) return;
            var currentQuery = searchOverlay.querySelector('.sk-search-input').value.trim();
            if (currentQuery !== query) return;

            var navMap = {};
            (searchData.articles || []).forEach(function(a) { navMap[a.slug] = a; });

            var fullMatches = fullTextData.filter(function(entry) {
               if (instantSlugs.has(entry.slug)) return false;
               return entry.text && entry.text.toLowerCase().indexOf(lower) !== -1;
            }).map(function(entry) {
               var nav = navMap[entry.slug] || {};
               return {
                  slug: entry.slug,
                  url: entry.url || nav.url || '',
                  title: entry.title || nav.title || entry.slug,
                  text: entry.text
               };
            });

            setLoading(false);

            if (fullMatches.length > 0) {
               var prev = container.querySelector('.sk-search-fulltext');
               if (prev) prev.remove();

               var fulltextHTML = '<div class="sk-search-section">FULL TEXT</div>';
               fullMatches.slice(0, 10).forEach(function(a) {
                  fulltextHTML += renderArticle(a, query, true);
               });
               var wrapper = document.createElement('div');
               wrapper.className = 'sk-search-fulltext';
               wrapper.innerHTML = fulltextHTML;
               container.appendChild(wrapper);
            }
         }

         if (fullTextData) {
            setLoading(true);
            requestAnimationFrame(function() {
               doFullTextSearch();
            });
         } else if (!fullTextLoading) {
            setLoading(true);
            fullTextLoading = true;
            fetch('/assets/search-index.json')
               .then(function(res) { return res.json(); })
               .then(function(data) {
                  fullTextData = data;
                  fullTextLoading = false;
                  doFullTextSearch();
               })
               .catch(function() {
                  fullTextLoading = false;
                  setLoading(false);
               });
         }
      }

      function ensureSearchData(callback) {
         if (searchData) { callback(); return; }
         setLoading(true);
         fetch('/assets/nav-index.json')
            .then(function(res) { return res.json(); })
            .then(function(data) {
               searchData = data;
               setLoading(false);
               callback();
            })
            .catch(function() { setLoading(false); });
      }

      function openSearch() {
         if (!searchOverlay) createModal();
         searchOverlay.style.display = 'flex';
         requestAnimationFrame(function() {
            searchOverlay.classList.add('sk-search-visible');
         });
         var input = searchOverlay.querySelector('.sk-search-input');
         input.value = '';
         searchOverlay.querySelector('.sk-search-results').innerHTML = '';
         input.focus();
         document.body.style.overflow = 'hidden';

         ensureSearchData(function() {
            var query = input.value.trim();
            if (query) {
               renderInstantResults(searchOverlay.querySelector('.sk-search-results'), query);
            }
         });
      }

      function closeSearch() {
         if (!searchOverlay) return;
         searchOverlay.classList.remove('sk-search-visible');
         document.body.style.overflow = '';
         setTimeout(function() {
            searchOverlay.style.display = 'none';
         }, 150);
      }

      searchBtn.addEventListener('click', openSearch);

      document.addEventListener('keydown', function(e) {
         if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
         }
         if (e.key === 'Escape') {
            closeSearch();
         }
      });

      var searchParam = new URLSearchParams(window.location.search).get('q');
      if (searchParam) {
         ensureSearchData(function() {
            openSearch();
            var input = searchOverlay.querySelector('.sk-search-input');
            input.value = searchParam;
            input.dispatchEvent(new Event('input'));
         });
      }
   }

   // wwdc.ai AI-summary fallback link (WWDC26 stub pages only).
   // SiteKit replaces a stub's markdown body with its own empty-state component,
   // so this fallback link is injected client-side here rather than in the notes.
   (function () {
      var match = window.location.pathname.match(/^\/documentation\/wwdc26-(\d+)-/);
      if (!match) return;                                 // only WWDC26 session pages
      var emptyState = document.querySelector('.sk-docc-empty');
      if (!emptyState) return;                            // only when the stub empty-state exists
      if (document.querySelector('.wn-aisum')) return;    // idempotent

      var code = match[1];
      var wrap = document.createElement('p');
      wrap.className = 'wn-aisum';

      var link = document.createElement('a');
      link.className = 'wn-aisum-link';
      link.href = 'https://wwdc.ai/2026/' + code;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Read an AI-generated summary on wwdc.ai \u2197';

      var note = document.createElement('span');
      note.className = 'wn-aisum-note';
      note.textContent = ' (unofficial, by Superwall)';

      wrap.appendChild(link);
      wrap.appendChild(note);

      // place it as a sibling directly below the empty-state card, not inside it
      emptyState.parentNode.insertBefore(wrap, emptyState.nextSibling);
   })();

   // "Built with SiteKit" footer attribution (site-wide). SiteKit's DocC footer
   // does not render it natively, so inject it client-side. The footer legal-text
   // block is a flex row (left description | right legal notice); group the
   // description and the attribution into one left column so that two-column
   // layout is preserved and "Built with SiteKit" sits on its own line below it.
   (function () {
      var legalText = document.querySelector('.sk-docc-footer-legal-text');
      if (!legalText) return;                                    // only where the footer exists
      if (legalText.querySelector('.wn-footer-leftcol')) return; // idempotent

      var desc = legalText.querySelector(':scope > p');          // the description paragraph
      if (!desc) return;

      var line = document.createElement('p');
      line.className = 'wn-builtwith';
      line.appendChild(document.createTextNode('Built with '));

      var skLink = document.createElement('a');
      skLink.className = 'wn-builtwith-link';
      skLink.href = 'https://github.com/FlineDev/SiteKit';
      skLink.target = '_blank';
      skLink.rel = 'nofollow noopener';
      skLink.textContent = 'SiteKit';
      line.appendChild(skLink);

      var leftcol = document.createElement('div');
      leftcol.className = 'wn-footer-leftcol';
      legalText.insertBefore(leftcol, desc);
      leftcol.appendChild(desc);                                 // move description into the column
      leftcol.appendChild(line);                                 // attribution on its own line below
   })();
});
