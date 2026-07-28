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
            const textEl = document.querySelector('.chapter-text');
            const prayerEl = document.querySelector('.chapter-prayer-text');
            const audioTitle = document.querySelector('.chapter-audio-title');

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
            html += '<h3 class="chapter-title">' + s.title + '</h3>';
            if (s.subtitle) {
                html += '<p class="chapter-desc">' + s.subtitle + '</p>';
            }
            html += '<a href="piesen.html?id=' + s.id + '" class="chapter-link" aria-label="Otvoriť pieseň ' + s.number + ': ' + s.title + '">Otvoriť pieseň</a>';
            html += '</article>';
        });
        songsListEl.innerHTML = html;
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
                    lyricsHtml += '<p class="lyric-lines">' + section.lines.join('<br>') + '</p>';
                    lyricsHtml += '</div>';
                });
                lyricsEl.innerHTML = lyricsHtml;
            }

            // Biblické verše (ECAV / SEB)
            var verses = song.verses || (song.verse ? [song.verse] : []);
            if (verses.length) {
                const wrap = document.querySelector('.song-verse-wrap');
                if (wrap) {
                    let vHtml = '';
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
