/* ============================================
   DEŇ ZÁCHRANY - App Logic
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // NAVIGÁCIA
    // ============================================
    const nav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Scroll efekt na navigáciu
    if (nav) {
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // Mobilné menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('open');
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Zatvoriť menu pri kliknutí na link
        navMenu.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // PROGRESS BAR
    // ============================================
    const progressBar = document.getElementById('progress-bar');

    if (progressBar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }, { passive: true });
    }

    // ============================================
    // LOCAL STORAGE - Naposledy čítaná kapitola
    // ============================================
    const Storage = {
        key: 'den-zachrany-last-read',

        setLastRead: function(chapterId) {
            try {
                localStorage.setItem(this.key, chapterId);
            } catch (e) {
                console.warn('LocalStorage nie je dostupný');
            }
        },

        getLastRead: function() {
            try {
                return localStorage.getItem(this.key);
            } catch (e) {
                return null;
            }
        }
    };

    // ============================================
    // ZOZNAM KAPITOL - Filter
    // ============================================
    const chaptersList = document.querySelector('.chapters-list');

    if (chaptersList) {
        // Dynamické generovanie kariet kapitol z dát
        if (typeof chapterData !== 'undefined') {
            const ids = Object.keys(chapterData).sort(function(a, b) { return parseInt(a) - parseInt(b); });
            let listHtml = '';
            ids.forEach(function(id) {
                const ch = chapterData[id];
                const num = parseInt(id);
                const coming = ch.available === false;
                let classes = 'chapter-item';
                if (ch.isStarter) classes += ' starter';
                if (coming) classes += ' coming-soon';
                const tagsAttr = (ch.tags || []).join(',');

                listHtml += '<article class="' + classes + '" data-id="' + id + '" data-tags="' + tagsAttr + '" role="listitem">';
                listHtml += '<div class="chapter-number">' + num + (ch.isStarter ? '. Štartovacia kapitola' : '. Kapitola') + '</div>';
                if (ch.starterLabel) {
                    listHtml += '<div class="starter-label">' + ch.starterLabel + '</div>';
                }
                if (coming) {
                    listHtml += '<span class="chapter-badge">Pripravujeme</span>';
                }
                if (coming) {
                    listHtml += '<h3 class="chapter-title">' + ch.title + '</h3>';
                } else {
                    listHtml += '<h3 class="chapter-title"><a href="kapitola.html?id=' + id + '" class="card-link" aria-label="Otvoriť kapitolu ' + num + ': ' + ch.title + '">' + ch.title + '</a></h3>';
                }
                listHtml += '<p class="chapter-desc">' + ch.subtitle + '</p>';
                if (ch.tags && ch.tags.length) {
                    listHtml += '<div class="chapter-tags">';
                    ch.tags.forEach(function(t) { listHtml += '<span class="chapter-tag">' + t + '</span>'; });
                    listHtml += '</div>';
                }
                if (coming) {
                    listHtml += '<span class="chapter-link is-disabled" aria-disabled="true">Pripravujeme čoskoro</span>';
                }
                listHtml += '</article>';
            });
            chaptersList.innerHTML = listHtml;
        }

        const chapterItems = document.querySelectorAll('.chapter-item');
        const lastReadId = Storage.getLastRead();

        // Označiť naposledy čítanú
        if (lastReadId) {
            chapterItems.forEach(function(item) {
                if (item.dataset.id === lastReadId) {
                    item.classList.add('last-read');
                }
            });
        }

        // ============================================
        // FILTER KAPITOL
        // ============================================
        const filterBar = document.querySelector('.filter-bar');

        // Témy sa vytvárajú z dát kapitol — vždy sedia s obsahom.
        // Nové témy sa objavia automaticky; slovník tagGroups určuje ich zaradenie.
        if (filterBar && typeof chapterData !== 'undefined') {
            const counts = {};
            Object.keys(chapterData).forEach(function(id) {
                (chapterData[id].tags || []).forEach(function(t) {
                    const tag = t.trim().toLowerCase();
                    if (tag) counts[tag] = (counts[tag] || 0) + 1;
                });
            });
            const groups = (typeof tagGroups !== 'undefined') ? tagGroups : [];
            const zaradene = {};
            groups.forEach(function(g) {
                g.tags.forEach(function(t) { zaradene[t] = true; });
            });
            // téma mimo slovníka sa nestratí — pridá sa do skupiny Ďalšie témy
            const ostatne = Object.keys(counts).filter(function(t) { return !zaradene[t]; });
            const vsetky = groups.concat(ostatne.length ? [{ label: 'Ďalšie témy', tags: ostatne }] : []);

            let html = '<button class="filter-btn active" data-tag="all" aria-pressed="true">Všetky kapitoly</button>';
            vsetky.forEach(function(g) {
                const dostupne = g.tags.filter(function(t) { return counts[t]; });
                if (!dostupne.length) return;
                html += '<div class="filter-group"><span class="filter-group-label">' + g.label + '</span>';
                dostupne.sort(function(a, b) {
                    if (counts[b] !== counts[a]) return counts[b] - counts[a];
                    return a.localeCompare(b, 'sk');
                });
                dostupne.forEach(function(tag) {
                    const label = tag.charAt(0).toUpperCase() + tag.slice(1);
                    html += '<button class="filter-btn" data-tag="' + tag + '" aria-pressed="false">' + label + '</button>';
                });
                html += '</div>';
            });
            filterBar.innerHTML = html;
        }

        // Rozbaľovanie panela — stránka ostáva pokojná, kým človek sám nehľadá
        const filterToggle = document.querySelector('.filter-toggle');
        const filterPanel = document.querySelector('.filter-panel');
        const toggleValue = document.querySelector('.filter-toggle-value');
        const toggleLabel = document.querySelector('.filter-toggle-label');

        function setPanel(open) {
            if (!filterToggle || !filterPanel) return;
            filterToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            filterPanel.hidden = !open;
            filterToggle.classList.toggle('is-open', open);
        }
        if (filterToggle) {
            filterToggle.addEventListener('click', function() {
                setPanel(filterToggle.getAttribute('aria-expanded') !== 'true');
            });
        }
        const filterCloseBtn = document.querySelector('.filter-close');
        if (filterCloseBtn) {
            filterCloseBtn.addEventListener('click', function() {
                setPanel(false);
                if (filterToggle) filterToggle.focus();
            });
        }
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && filterToggle &&
                filterToggle.getAttribute('aria-expanded') === 'true') {
                setPanel(false);
                filterToggle.focus();
            }
        });
        function setToggleValue(tag, label) {
            if (!toggleValue || !toggleLabel) return;
            if (tag === 'all') {
                toggleValue.hidden = true;
                toggleValue.textContent = '';
                toggleLabel.textContent = 'Hľadám pomoc pri…';
            } else {
                toggleLabel.textContent = 'Hľadám pomoc pri:';
                toggleValue.hidden = false;
                toggleValue.textContent = label;
            }
        }

        const filterBtns = document.querySelectorAll('.filter-btn');
        const resultBox = document.querySelector('.filter-result');
        const resultText = document.querySelector('.filter-result-text');
        const resetBtn = document.querySelector('.filter-reset');
        const listEl = document.querySelector('.chapters-list');

        // Slovenské skloňovanie: 1 kapitola / 2-4 kapitoly / 5+ kapitol
        function pocetKapitol(n) {
            if (n === 1) return '1 kapitola';
            if (n >= 2 && n <= 4) return n + ' kapitoly';
            return n + ' kapitol';
        }

        // témy tlačidiel pochádzajú priamo z dát, preto porovnávame presne
        function matchesTag(item, tag) {
            const tags = (item.dataset.tags || '').split(',');
            return tags.some(function(t) { return t.trim().toLowerCase() === tag; });
        }

        function scrollToList() {
            if (!listEl) return;
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const nav = document.querySelector('.main-nav');
            const offset = (nav ? nav.offsetHeight : 64) + 16;
            const top = listEl.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top < 0 ? 0 : top, behavior: reduce ? 'auto' : 'smooth' });
        }

        function applyFilter(tag, label, doScroll) {
            let count = 0;

            chapterItems.forEach(function(item) {
                const match = (tag === 'all') || matchesTag(item, tag);
                item.classList.toggle('hidden', !match);
                item.classList.remove('is-match', 'flash');
                if (match && tag !== 'all') {
                    item.classList.add('is-match');
                    count++;
                }
            });

            // krátke rozsvietenie zhodných kariet
            if (tag !== 'all') {
                void listEl.offsetWidth;   // vynútiť prekreslenie, nech animácia nabehne aj opakovane
                chapterItems.forEach(function(item) {
                    if (item.classList.contains('is-match')) item.classList.add('flash');
                });
            }

            // informačný pruh
            if (resultBox && resultText) {
                if (tag === 'all') {
                    resultBox.hidden = true;
                } else {
                    resultBox.hidden = false;
                    resultText.textContent = count > 0
                        ? 'Téma ' + label + ' — ' + pocetKapitol(count)
                        : 'K téme ' + label + ' zatiaľ nemáme kapitolu.';
                    resultBox.classList.toggle('is-empty', count === 0);
                }
            }

            if (doScroll !== false && tag !== 'all') scrollToList();
        }

        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const tag = this.dataset.tag;

                filterBtns.forEach(function(b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');

                const label = this.textContent.trim();
                setToggleValue(tag, label);
                setPanel(false);
                applyFilter(tag, label);
            });
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                const allBtn = document.querySelector('.filter-btn[data-tag="all"]');
                filterBtns.forEach(function(b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                if (allBtn) {
                    allBtn.classList.add('active');
                    allBtn.setAttribute('aria-pressed', 'true');
                }
                setToggleValue('all');
                applyFilter('all', 'Všetky', false);
            });
        }

        // Kliknutie na tému priamo na karte kapitoly
        if (listEl) {
            listEl.addEventListener('click', function(e) {
                const tagEl = e.target.closest('.chapter-tag');
                if (!tagEl) return;
                e.preventDefault();
                const tag = tagEl.textContent.trim().toLowerCase();
                const btn = document.querySelector('.filter-btn[data-tag="' + tag + '"]');
                if (btn) {
                    btn.click();
                } else {
                    applyFilter(tag, tagEl.textContent.trim());
                }
            });
        }
    }


    // ============================================
    // KAPITOLA - Načítanie dát
    // ============================================
    const chapterPage = document.querySelector('.chapter-page');

    if (chapterPage && typeof chapterData !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const chapterId = urlParams.get('id');

        if (chapterId && chapterData[chapterId]) {
            const chapter = chapterData[chapterId];

            // Uložiť ako naposledy čítanú
            Storage.setLastRead(chapterId);

            // Naplniť obsah
            document.title = chapter.title + ' — Deň Záchrany';

            const titleEl = document.querySelector('.chapter-heading');
            const subEl = document.querySelector('.chapter-subheading');
            const numEl = document.querySelector('.chapter-number-label');
            const textEl = document.querySelector('.chapter-text');
            const prayerEl = document.querySelector('.chapter-prayer-text');
            const audioTitle = document.querySelector('.chapter-audio-title');

            if (numEl) numEl.textContent = chapterId + '. Kapitola';
            if (chapter.starterLabel) {
                var labelEl = document.createElement('div');
                labelEl.className = 'starter-label';
                labelEl.textContent = chapter.starterLabel;
                numEl.parentNode.insertBefore(labelEl, numEl.nextSibling);
            }
            if (titleEl) titleEl.textContent = chapter.title;
            if (subEl) subEl.textContent = chapter.subtitle;
            if (audioTitle) audioTitle.textContent = 'Audio modlitby';

            // Text kapitoly s veršami
            if (textEl) {
                let html = '';

                // Rozdeliť text na odseky
                const paragraphs = chapter.fullText.split('\n\n');
                let verseIndex = 0;

                paragraphs.forEach(function(para) {
                    para = para.trim();
                    if (!para) return;

                    // Skontrolovať, či je to verš
                    if (para.startsWith('"') && para.includes('"') && verseIndex < chapter.verses.length) {
                        const verse = chapter.verses[verseIndex];
                        html += '<blockquote class="chapter-verse">';
                        html += '<p>' + verse.text + '</p>';
                        html += '<footer class="chapter-verse-ref">— ' + verse.ref + '</footer>';
                        html += '</blockquote>';
                        verseIndex++;
                    } else {
                        html += '<p>' + para + '</p>';
                    }
                });

                textEl.innerHTML = html;
            }

            // Modlitba
            if (prayerEl) {
                const prayerParagraphs = chapter.prayer.split('\n\n');
                let prayerHtml = '';
                prayerParagraphs.forEach(function(para) {
                    para = para.trim();
                    if (para) {
                        prayerHtml += '<p>' + para + '</p>';
                    }
                });
                prayerEl.innerHTML = prayerHtml;
            }

            // Audio
            const audioEl = document.querySelector('.chapter-audio audio');
            const audioWrap = document.querySelector('.chapter-audio');
            const audioMsg = audioWrap ? audioWrap.querySelector('.player > p') : null;
            const audioControls = audioWrap ? audioWrap.querySelector('.player-controls') : null;
            if (audioEl && chapter.audioUrl) {
                audioEl.querySelector('source').src = chapter.audioUrl;
                audioEl.load();
                if (audioMsg) audioMsg.hidden = true;
            } else {
                if (audioControls) audioControls.hidden = true;
            }
        } else {
            // Chýbajúca kapitola
            window.location.href = 'kapitoly.html';
        }
    }

    // ============================================
    // SPOLOČNÉ VYKRESLENIE OBSAHU PIESNE
    // ============================================
    function renderSongContent(song) {
        const headingEl = document.querySelector('.song-heading');
        const subEl = document.querySelector('.song-subheading');
        if (headingEl) headingEl.textContent = (song.number ? song.number + '. ' : '') + song.title;
        if (subEl) subEl.textContent = song.subtitle || '';

        // Text piesne
        const lyricsEl = document.querySelector('.song-lyrics');
        if (lyricsEl && song.lyrics) {
            let lyricsHtml = '';
            song.lyrics.forEach(function(section) {
                let cls = 'lyric-section';
                if (section.type === 'chorus') cls += ' chorus';
                else if (section.type === 'bridge') cls += ' bridge';

                lyricsHtml += '<div class="' + cls + '">';
                if (section.label) {
                    lyricsHtml += '<div class="lyric-label">' + section.label + '</div>';
                }
                var linesHtml = section.lines.map(function(line) {
                    if (line === '') return '<span class="lyric-line lyric-gap"></span>';
                    var isBacking = line.charAt(0) === '(';
                    return '<span class="lyric-line' + (isBacking ? ' backing' : '') + '">' + line + '</span>';
                }).join('');
                lyricsHtml += '<p class="lyric-lines">' + linesHtml + '</p>';
                lyricsHtml += '</div>';
            });
            lyricsEl.innerHTML = lyricsHtml;
        }

        // Biblické verše (ECAV)
        var verses = song.verses || (song.verse ? [song.verse] : []);
        const wrap = document.querySelector('.song-verse-wrap');
        if (wrap) {
            if (verses.length) {
                let vHtml = '<div class="song-verse-header">' +
                    '<svg class="song-verse-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                    '<path d="M12 6.6C10.2 5.3 7.8 5 5.5 5v12c2.3 0 4.7.3 6.5 1.6 1.8-1.3 4.2-1.6 6.5-1.6V5c-2.3 0-4.7.3-6.5 1.6z"/>' +
                    '<path d="M12 6.6V18.6"/></svg>' +
                    '<h2 class="song-verse-title">Inšpirácia z Biblie</h2>' +
                    '</div>';
                verses.forEach(function(v) {
                    vHtml += '<blockquote class="chapter-verse song-verse">';
                    vHtml += '<p class="song-verse-text">' + v.text + '</p>';
                    vHtml += '<footer class="chapter-verse-ref song-verse-ref">— ' + v.ref + '</footer>';
                    vHtml += '</blockquote>';
                });
                wrap.innerHTML = vHtml;
                wrap.hidden = false;
            } else {
                wrap.innerHTML = '';
                wrap.hidden = true;
            }
        }

        // Kredit
        const creditEl = document.querySelector('.song-credit');
        if (creditEl) creditEl.textContent = song.credit || '';
    }

    // ============================================
    // ZOZNAM PIESNÍ
    // ============================================
    const songsListEl = document.querySelector('.songs-list');

    if (songsListEl && typeof songList !== 'undefined') {
        let html = '';
        songList.forEach(function(s) {
            html += '<article class="chapter-item" data-id="' + s.id + '" role="listitem">';
            html += '<div class="chapter-number">' + s.number + '</div>';
            html += '<a class="song-play-btn" href="pocuvaj.html?id=' + s.id + '" aria-label="Počúvať a čítať pieseň ' + s.title + '">';
            html += '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
            html += '</a>';
            html += '<h3 class="chapter-title"><a href="piesen.html?id=' + s.id + '" class="card-link" aria-label="Otvoriť pieseň ' + s.number + ': ' + s.title + '">' + s.title + '</a></h3>';
            if (s.subtitle) {
                html += '<p class="chapter-desc">' + s.subtitle + '</p>';
            }
            html += '</article>';
        });
        songsListEl.innerHTML = html;

    }

    // ============================================
    // STRÁNKA "POČÚVAJ A ČÍTAJ"
    // ============================================
    const listenPage = document.querySelector('.listen-page');

    if (listenPage && typeof songData !== 'undefined' && typeof songList !== 'undefined') {
        const queueAudio = document.querySelector('.queue-audio');
        const nowEl = document.querySelector('.queue-now');
        const shuffleBtn = document.querySelector('.queue-shuffle');
        const songLink = document.querySelector('.listen-song-link');
        const contentEl = document.querySelector('.listen-content');

        const ids = songList.map(function(s) { return String(s.id); });
        let order = ids.slice();
        let pos = 0;
        let shuffled = false;
        let hasStarted = false;
        const player = new AudioPlayer(queueAudio);

        function shuffleArray(a) {
            const r = a.slice();
            for (let i = r.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const t = r[i]; r[i] = r[j]; r[j] = t;
            }
            return r;
        }

        function setMediaSession(song) {
            if (!('mediaSession' in navigator)) return;
            try {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: song.title,
                    artist: 'Deň Záchrany',
                    album: 'Piesne',
                    artwork: [{ src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png' }]
                });
                navigator.mediaSession.setActionHandler('play', function() { player.play(); });
                navigator.mediaSession.setActionHandler('pause', function() { player.pause(); });
                navigator.mediaSession.setActionHandler('nexttrack', function() { playAt(pos + 1); });
                navigator.mediaSession.setActionHandler('previoustrack', prev);
            } catch (e) {}
        }

        function loadAt(index) {
            if (!order.length) return;
            if (index < 0) index = order.length - 1;
            if (index >= order.length) index = 0;      // dokola
            pos = index;

            const id = order[pos];
            const song = songData[id];
            if (!song) return;

            queueAudio.src = song.audioUrl;
            queueAudio.load();

            renderSongContent(song);
            if (nowEl) nowEl.textContent = 'Práve hrá: ' + song.number + '. ' + song.title;
            if (songLink) songLink.href = 'piesen.html?id=' + id;
            document.title = song.title + ' — Počúvaj a čítaj';

            // adresa v prehliadači nech zodpovedá piesni (dá sa zdieľať aj obnoviť)
            const q = 'pocuvaj.html?id=' + id + (shuffled ? '&nahodne=1' : '');
            history.replaceState(null, '', q);

            setMediaSession(song);
        }

        function scrollToText() {
            if (!contentEl) return;
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const playerEl = document.querySelector('.listen-player');
            const navEl = document.querySelector('.main-nav');
            const offset = (navEl ? navEl.offsetHeight : 64) +
                           (playerEl ? playerEl.offsetHeight : 0) +
                           16;
            const top = contentEl.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top < 0 ? 0 : top, behavior: reduce ? 'auto' : 'smooth' });
        }

        function playAt(index, doScroll) {
            loadAt(index);
            player.play();
            if (doScroll !== false) scrollToText();
        }

        function prev() {
            if (queueAudio.currentTime > 3) {
                queueAudio.currentTime = 0;
            } else {
                playAt(pos - 1);
            }
        }

        queueAudio.addEventListener('play', function() { hasStarted = true; });
        queueAudio.addEventListener('ended', function() { playAt(pos + 1); });

        document.querySelector('.queue-next').addEventListener('click', function() { playAt(pos + 1); });
        document.querySelector('.queue-prev').addEventListener('click', prev);

        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', function() {
                shuffled = !shuffled;
                shuffleBtn.classList.toggle('is-on', shuffled);
                shuffleBtn.setAttribute('aria-pressed', shuffled ? 'true' : 'false');

                const currentId = order[pos];
                order = shuffled ? shuffleArray(ids) : ids.slice();

                if (hasStarted) {
                    // práve hrajúcu pieseň nechať dohrať
                    const i = order.indexOf(currentId);
                    if (i > -1) { order.splice(i, 1); order.unshift(currentId); pos = 0; }
                } else {
                    loadAt(0);
                }
            });
        }

        // ---- štart podľa adresy ----
        const params = new URLSearchParams(window.location.search);
        if (params.get('nahodne') === '1') {
            shuffled = true;
            order = shuffleArray(ids);
            if (shuffleBtn) {
                shuffleBtn.classList.add('is-on');
                shuffleBtn.setAttribute('aria-pressed', 'true');
            }
        }

        const startId = params.get('id');
        let startIndex = 0;
        if (startId && songData[startId]) {
            const i = order.indexOf(String(startId));
            if (i > -1) startIndex = i;
        }

        loadAt(startIndex);
        // prehliadače nedovolia zvuk bez kliknutia — ak sa nepodarí, zostane pauza
        player.play();
    }

    // ============================================
    // PIESEŇ - Načítanie dát
    // ============================================
    const songPage = document.querySelector('.song-page');

    if (songPage && typeof songData !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const songId = urlParams.get('id');

        if (songId && songData[songId]) {
            const song = songData[songId];

            document.title = song.title + ' — Deň Záchrany';

            renderSongContent(song);

            const audioTitle = document.querySelector('.song-audio-title');
            if (audioTitle) audioTitle.textContent = 'Audio piesne: ' + song.title;

            // odkaz na súvislé počúvanie od tejto piesne
            const listenLink = document.querySelector('.song-listen-link');
            if (listenLink) listenLink.href = 'pocuvaj.html?id=' + songId;

            // Audio
            const audioEl = document.querySelector('.song-audio-element');
            if (audioEl && song.audioUrl) {
                audioEl.querySelector('source').src = song.audioUrl;
                audioEl.load();
            }
        } else {
            window.location.href = 'piesne.html';
        }
    }

    // ============================================
    // AUDIO PREHRÁVAČE - Inicializácia
    // ============================================
    if (typeof AudioPlayer !== 'undefined') {
        document.querySelectorAll('.player audio').forEach(function(audioEl) {
            new AudioPlayer(audioEl);
        });
    }

    // ============================================
    // PWA - Service Worker Registration
    // ============================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js')
                .then(function(registration) {
                    console.log('SW registrovaný:', registration.scope);
                })
                .catch(function(error) {
                    console.log('SW registrácia zlyhala:', error);
                });
        });
    }

})();
