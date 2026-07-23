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

    this.init();
}

AudioPlayer.prototype.init = function() {
    var self = this;
    var container = this.audio.closest('.player');

    if (!container) return;

    // Elementy
    this.playBtn = container.querySelector('.player-play');
    this.pauseBtn = container.querySelector('.player-pause');
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

    // Progress bar
    if (this.progressBar) {
        this.progressBar.addEventListener('click', function(e) {
            self.seek(e);
        });

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
};

AudioPlayer.prototype.play = function() {
    var self = this;

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
