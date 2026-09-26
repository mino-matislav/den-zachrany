#!/bin/bash
# Pri štarte úlohy v Claude Code na webe doinštaluje ffmpeg a numpy (potrebné pre audio kontroly vo verify.js).
# Pri zlyhaní nepokračuje potichu: vypíše upozornenie, ktoré Claude uvidí a musí oznámiť Adminovi.
set -uo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

LOG=/tmp/session-start-install.log

# ffmpeg
if command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg je dostupný: $(ffmpeg -version | head -1)"
else
  export DEBIAN_FRONTEND=noninteractive
  if ! apt-get install -y -qq ffmpeg >>"$LOG" 2>&1; then
    apt-get update -qq >>"$LOG" 2>&1
    apt-get install -y -qq ffmpeg >>"$LOG" 2>&1
  fi
  if command -v ffmpeg >/dev/null 2>&1; then
    echo "ffmpeg bol nainštalovaný: $(ffmpeg -version | head -1)"
  else
    echo "UPOZORNENIE: ffmpeg sa pri štarte úlohy NEPODARILO nainštalovať (log: $LOG)."
    echo "Podľa CLAUDE.md to hneď oznám Adminovi a bez audio kontrol vo verify.js nepokračuj."
    tail -5 "$LOG"
  fi
fi

# numpy (scripts/audio-profil.py, kontrola [9])
if python3 -c "import numpy" >/dev/null 2>&1; then
  echo "numpy je dostupný: $(python3 -c 'import numpy; print(numpy.__version__)')"
else
  pip install -q --break-system-packages numpy >>"$LOG" 2>&1
  if python3 -c "import numpy" >/dev/null 2>&1; then
    echo "numpy bol nainštalovaný: $(python3 -c 'import numpy; print(numpy.__version__)')"
  else
    echo "UPOZORNENIE: numpy sa pri štarte úlohy NEPODARILO nainštalovať (log: $LOG)."
    echo "Podľa CLAUDE.md to hneď oznám Adminovi a bez audio kontrol vo verify.js nepokračuj."
    tail -5 "$LOG"
  fi
fi
exit 0
