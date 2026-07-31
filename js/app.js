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
                listHtml += '<div class="chapter-number">' + num + '. Kapitola</div>';
                if (coming) {
                    listHtml += '<span class="chapter-badge">Pripravujeme</span>';
                }
                listHtml += '<h3 class="chapter-title">' + ch.title + '</h3>';
                listHtml += '<p class="chapter-desc">' + ch.subtitle + '</p>';
                if (ch.tags && ch.tags.length) {
                    listHtml += '<div class="chapter-tags">';
                    ch.tags.forEach(function(t) { listHtml += '<span class="chapter-tag">' + t + '</span>'; });
                    listHtml += '</div>';
                }
                if (coming) {
                    listHtml += '<span class="chapter-link is-disabled" aria-disabled="true">Pripravujeme čoskoro</span>';
                } else {
                    listHtml += '<a href="kapitola.html?id=' + id + '" class="chapter-link" aria-label="Otvoriť kapitolu ' + num + ': ' + ch.title + '">Otvoriť kapitolu</a>';
                }
                listHtml += '</article>';
            });
            chaptersList.innerHTML = listHtml;
        }

        const filterBtns = document.querySelectorAll('.filter-btn');
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

        // Filter
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const tag = this.dataset.tag;

                // Aktivovať tlačidlo
                filterBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                // Filtrovať kapitoly
                chapterItems.forEach(function(item) {
                    if (tag === 'all') {
                        item.classList.remove('hidden');
                    } else {
                        const itemTags = item.dataset.tags || '';
                        if (itemTags.includes(tag)) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    }
                });
            });
        });
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
            if (titleEl) titleEl.textContent = chapter.title;
            if (subEl) subEl.textContent = chapter.subtitle;
            if (audioTitle) audioTitle.textContent = 'Audio kapitoly: ' + chapter.title;

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
            if (audioEl && chapter.audioUrl) {
                audioEl.querySelector('source').src = chapter.audioUrl;
                audioEl.load();
            }
        } else {
            // Chýbajúca kapitola
            window.location.href = 'kapitoly.html';
        }
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
            html += '<button class="song-play-btn" type="button" data-id="' + s.id + '" aria-label="Prehrať pieseň ' + s.title + '">';
            html += '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
            html += '</button>';
            html += '<h3 class="chapter-title">' + s.title + '</h3>';
            if (s.subtitle) {
                html += '<p class="chapter-desc">' + s.subtitle + '</p>';
            }
            html += '<a href="piesen.html?id=' + s.id + '" class="chapter-link" aria-label="Otvoriť pieseň ' + s.number + ': ' + s.title + '">Otvoriť pieseň</a>';
            html += '</article>';
        });
        songsListEl.innerHTML = html;

        // ============================================
        // SÚVISLÉ PREHRÁVANIE PIESNÍ
        // ============================================
        const queueCard = document.querySelector('.queue-card');
        const queueAudio = document.querySelector('.queue-audio');

        if (queueCard && queueAudio && typeof songData !== 'undefined') {
            queueCard.hidden = false;

            const ids = songList.map(function(s) { return String(s.id); });
            let order = ids.slice();      // aktuálne poradie prehrávania
            let pos = -1;                 // index v poradí
            let shuffled = false;
            let hasStarted = false;
            const player = new AudioPlayer(queueAudio);

            const nowEl = document.querySelector('.queue-now');
            const shuffleBtn = document.querySelector('.queue-shuffle');

            function shuffleArray(a) {
                const r = a.slice();
                for (let i = r.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    const t = r[i]; r[i] = r[j]; r[j] = t;
                }
                return r;
            }

            function highlight(id) {
                songsListEl.querySelectorAll('.chapter-item').forEach(function(el) {
                    el.classList.toggle('is-playing', el.dataset.id === String(id));
                });
            }

            function scrollToCard(id) {
                const card = songsListEl.querySelector('.chapter-item[data-id="' + id + '"]');
                if (!card) return;
                const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
            }

            function setMediaSession(song) {
                if (!('mediaSession' in navigator)) return;
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: song.title,
                    artist: 'Deň Záchrany',
                    album: 'Piesne',
                    artwork: [{ src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png' }]
                });
                navigator.mediaSession.setActionHandler('play', function() { player.play(); });
                navigator.mediaSession.setActionHandler('pause', function() { player.pause(); });
                navigator.mediaSession.setActionHandler('nexttrack', function() { playAt(pos + 1); });
                navigator.mediaSession.setActionHandler('previoustrack', function() { prev(); });
            }

            function loadAt(index) {
                if (!order.length) return;
                if (index < 0) index = order.length - 1;
                if (index >= order.length) index = 0;   // dokola
                pos = index;

                const id = order[pos];
                const song = songData[id];
                if (!song) return;

                queueAudio.src = song.audioUrl;
                queueAudio.load();
                if (nowEl) nowEl.textContent = song.number + '. ' + song.title;
                setMediaSession(song);
            }

            function playAt(index, doScroll) {
                loadAt(index);
                player.play();
                if (doScroll !== false) scrollToCard(order[pos]);
            }

            function prev() {
                // do 3 sekúnd = predchádzajúca, inak od začiatku
                if (queueAudio.currentTime > 3) {
                    queueAudio.currentTime = 0;
                } else {
                    playAt(pos - 1);
                }
            }

            // zvýraznenie karty až keď sa naozaj hrá
            queueAudio.addEventListener('play', function() {
                hasStarted = true;
                highlight(order[pos]);
            });

            // koniec piesne -> ďalšia
            queueAudio.addEventListener('ended', function() {
                playAt(pos + 1);
            });

            // tlačidlá pri kartách
            songsListEl.addEventListener('click', function(e) {
                const btn = e.target.closest('.song-play-btn');
                if (!btn) return;
                const id = btn.dataset.id;
                if (hasStarted && pos >= 0 && order[pos] === id) {
                    // tá istá pieseň -> prepnúť prehrávanie
                    if (player.isPlaying) { player.pause(); } else { player.play(); }
                    return;
                }
                playAt(order.indexOf(id), false);
            });

            document.querySelector('.queue-next').addEventListener('click', function() { playAt(pos + 1); });
            document.querySelector('.queue-prev').addEventListener('click', prev);

            if (shuffleBtn) {
                shuffleBtn.addEventListener('click', function() {
                    shuffled = !shuffled;
                    shuffleBtn.classList.toggle('is-on', shuffled);
                    shuffleBtn.setAttribute('aria-pressed', shuffled ? 'true' : 'false');

                    const currentId = pos >= 0 ? order[pos] : null;
                    order = shuffled ? shuffleArray(ids) : ids.slice();

                    if (hasStarted && currentId) {
                        // práve hrajúcu pieseň nechať znieť ďalej
                        const i = order.indexOf(currentId);
                        if (i > -1) { order.splice(i, 1); order.unshift(currentId); pos = 0; }
                    } else {
                        // ešte sa nehralo -> pripraviť prvú z nového poradia
                        loadAt(0);
                    }
                });
            }

            // pripraviť prvú pieseň (aby fungovalo hlavné tlačidlo prehrať)
            loadAt(0);
        }
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

            const headingEl = document.querySelector('.song-heading');
            const subEl = document.querySelector('.song-subheading');
            const audioTitle = document.querySelector('.song-audio-title');

            if (headingEl) headingEl.textContent = song.title;
            if (subEl) subEl.textContent = song.subtitle || '';
            if (audioTitle) audioTitle.textContent = 'Audio piesne: ' + song.title;

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

            // Biblické verše (ECAV / SEB)
            var verses = song.verses || (song.verse ? [song.verse] : []);
            if (verses.length) {
                const wrap = document.querySelector('.song-verse-wrap');
                if (wrap) {
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
                }
            }

            // Kredit
            const creditEl = document.querySelector('.song-credit');
            if (creditEl) creditEl.textContent = song.credit || '';

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
