/* ============================================
   DEŇ ZÁCHRANY - Audio Player
   ============================================ */

function AudioPlayer(audioElement, options) {
    'use strict';

    this.audio = audioElement;
    this.options = Object.assign({
        showDownload: false,
        showRepeat: true
    }, options || {});

    this.isPlaying = false;
    this.currentSpeed = 1;
    this.isRepeating = false;
    this.isDragging = false;

    this.init();
}

AudioPlayer.prototype.init = function() {
    var self = this;
    var container = this.audio.closest('.player');

    if (!container) return;

    // Elementy
    this.playBtn = container.querySelector('.player-play');
    this.pauseBtn = container.querySelector('.player-pause');
    this.restartBtn = container.querySelector('.player-restart');
    this.progressBar = container.querySelector('.player-progress');
    this.progressFill = container.querySelector('.progress-fill');
    this.progressThumb = container.querySelector('.progress-thumb');
    this.timeCurrent = container.querySelector('.time-current');
    this.timeDuration = container.querySelector('.time-duration');
    this.speedBtns = container.querySelectorAll('.speed-btn');

    // Event listeners
    if (this.playBtn) {
        this.playBtn.addEventListener('click', function() { self.play(); });
    }

    if (this.pauseBtn) {
        this.pauseBtn.addEventListener('click', function() { self.pause(); });
    }

    if (this.restartBtn) {
        this.restartBtn.addEventListener('click', function() { self.restart(); });
    }

    // Audio events
    this.audio.addEventListener('loadedmetadata', function() {
        self.updateDuration();
    });

    this.audio.addEventListener('timeupdate', function() {
        self.updateProgress();
    });

    this.audio.addEventListener('ended', function() {
        self.onEnded();
    });

    this.audio.addEventListener('error', function() {
        self.onError();
    });

    // Progress bar — klik aj ťahanie (myš + dotyk)
    if (this.progressBar) {
        this.progressBar.addEventListener('pointerdown', function(e) {
            self.isDragging = true;
            if (self.progressBar.setPointerCapture) {
                try { self.progressBar.setPointerCapture(e.pointerId); } catch (err) {}
            }
            self.seek(e);
        });

        this.progressBar.addEventListener('pointermove', function(e) {
            if (self.isDragging) self.seek(e);
        });

        var endDrag = function() { self.isDragging = false; };
        this.progressBar.addEventListener('pointerup', endDrag);
        this.progressBar.addEventListener('pointercancel', endDrag);

        this.progressBar.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                self.audio.currentTime = Math.max(0, self.audio.currentTime - 5);
            } else if (e.key === 'ArrowRight') {
                self.audio.currentTime = Math.min(self.audio.duration, self.audio.currentTime + 5);
            }
        });
    }

    // Rýchlosť
    this.speedBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var speed = parseFloat(this.dataset.speed);
            self.setSpeed(speed);
        });
    });

    // Inicializácia
    this.updateDuration();
    this.hasPrimed = false;
};

AudioPlayer.prototype.play = function() {
    var self = this;

    if (!this.hasPrimed) {
        // ⚠ NEMENIŤ BEZ PREČÍTANIA docs/AUDIO-PREHRAVAC.md
        // Seek na 0 + krátke čakanie prinútia prehliadač naplniť buffer skôr,
        // než sa spustí zvuk. Vyzerá to ako zbytočnosť, nie je.
        // 30.8.2026 to bolo nahradené čakaním na 'canplay' → v úvodnom slove
        // bolo počuť "nemôžeš" → pauza → zvyšok. Revert: commit b80f800.
        // Tento prehrávač obsluhuje úvodné slovo, 22 modlitieb aj 19 piesní —
        // zmena sa dotkne všetkého naraz. verify.js [2b] to stráži.
        this.hasPrimed = true;
        this.audio.currentTime = 0;

        // Krátke čakanie na inicializáciu dekodéra
        setTimeout(function() {
            self.audio.play().then(function() {
                self.isPlaying = true;
                self.togglePlayBtn();
            }).catch(function(error) {
                console.warn('Prehrávanie zlyhalo:', error);
            });
        }, 100);
        return;
    }

    this.audio.play().then(function() {
        self.isPlaying = true;
        self.togglePlayBtn();
    }).catch(function(error) {
        console.warn('Prehrávanie zlyhalo:', error);
    });
};

AudioPlayer.prototype.pause = function() {
    this.audio.pause();
    this.isPlaying = false;
    this.togglePlayBtn();
};

AudioPlayer.prototype.togglePlayBtn = function() {
    if (this.playBtn) {
        this.playBtn.hidden = this.isPlaying;
    }
    if (this.pauseBtn) {
        this.pauseBtn.hidden = !this.isPlaying;
    }
};

AudioPlayer.prototype.updateProgress = function() {
    if (!this.audio.duration) return;

    var percent = (this.audio.currentTime / this.audio.duration) * 100;

    if (this.progressFill) {
        this.progressFill.style.width = percent + '%';
    }

    if (this.progressThumb) {
        this.progressThumb.style.left = percent + '%';
    }

    if (this.timeCurrent) {
        this.timeCurrent.textContent = this.formatTime(this.audio.currentTime);
    }

    // Update ARIA
    if (this.progressBar) {
        this.progressBar.setAttribute('aria-valuenow', Math.round(percent));
    }
};

AudioPlayer.prototype.updateDuration = function() {
    if (this.timeDuration && this.audio.duration) {
        this.timeDuration.textContent = this.formatTime(this.audio.duration);
    }
};

AudioPlayer.prototype.seek = function(e) {
    if (!this.audio.duration) return;

    var rect = this.progressBar.getBoundingClientRect();
    var pos = (e.clientX - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos));

    this.audio.currentTime = pos * this.audio.duration;
    this.updateProgress();
};

AudioPlayer.prototype.restart = function() {
    this.audio.currentTime = 0;
    this.updateProgress();
};

AudioPlayer.prototype.setSpeed = function(speed) {
    this.currentSpeed = speed;
    this.audio.playbackRate = speed;

    this.speedBtns.forEach(function(btn) {
        btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
    });
};

AudioPlayer.prototype.onEnded = function() {
    this.isPlaying = false;
    this.togglePlayBtn();

    if (this.isRepeating) {
        this.audio.currentTime = 0;
        this.play();
    }
};

AudioPlayer.prototype.onError = function() {
    this.isPlaying = false;
    this.togglePlayBtn();

    if (this.timeCurrent) {
        this.timeCurrent.textContent = 'Chyba';
    }
};

AudioPlayer.prototype.formatTime = function(seconds) {
    if (isNaN(seconds)) return '00:00';

    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);

    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
};

// Export pre globálne použitie
window.AudioPlayer = AudioPlayer;
