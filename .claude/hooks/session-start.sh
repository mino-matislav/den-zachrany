#!/bin/bash
# Pri štarte úlohy v Claude Code na webe doinštaluje ffmpeg (potrebný pre audio kontroly vo verify.js).
# Pri zlyhaní nepokračuje potichu: vypíše upozornenie, ktoré Claude uvidí a musí oznámiť Adminovi.
set -uo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

if command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg je dostupný: $(ffmpeg -version | head -1)"
  exit 0
fi

export DEBIAN_FRONTEND=noninteractive
LOG=/tmp/ffmpeg-install.log
if ! apt-get install -y -qq ffmpeg >"$LOG" 2>&1; then
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
exit 0
