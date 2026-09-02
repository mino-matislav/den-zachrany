#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Zvukovy profil modlitieb (FFT). Ciel = priemer 6/7/8/9.
# Pouzitie:
#   python3 scripts/audio-profil.py --check     # skontroluje vsetky modlitby, upozorni na odchylky
#   python3 scripts/audio-profil.py --target    # vypise cielovy profil
#   python3 scripts/audio-profil.py <subor>     # vypise profil suboru
# Podrobnosti: docs/AUDIO-PREHRAVAC.md bod 9.
import subprocess, wave, array, math, sys, os
import numpy as np

BANDS = {'1-2k':(1000,2000),'2-3.5k':(2000,3500),'3.5-5k':(3500,5000),
         '5-8k':(5000,8000),'8-12k':(8000,12000)}
TOL = 3.0  # dB
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD = os.path.join(HERE, 'assets', 'audio')

def profile(path):
    subprocess.run(f"ffmpeg -y -i '{path}' -ar 44100 -ac 1 -c:a pcm_s16le /tmp/_ap.wav",
                   shell=True, capture_output=True)
    w=wave.open('/tmp/_ap.wav','rb'); sr=w.getframerate()
    a=array.array('h'); a.frombytes(w.readframes(w.getnframes()))
    a=np.array([x/32768 for x in a]); n=len(a)
    S=np.abs(np.fft.rfft(a*np.hanning(n))); fr=np.fft.rfftfreq(n,1/sr)
    def b(lo,hi):
        m=(fr>=lo)&(fr<=hi); return 20*math.log10(np.sqrt((S[m]**2).sum())/n+1e-9)
    ref=b(200,500)
    return {k:b(*v)-ref for k,v in BANDS.items()}

def target():
    ps=[profile(os.path.join(AUD,f'modlitba-{n}.mp3')) for n in [6,7,8,9]]
    return {k:sum(p[k] for p in ps)/len(ps) for k in BANDS}

def main():
    if len(sys.argv)<2:
        print("pouzitie: --check | --target | <subor>"); return 0
    if sys.argv[1]=='--target':
        t=target(); print("CIEL (priemer 6/7/8/9, dB k telu 200-500):")
        for k in BANDS: print("  %-8s %+.1f" % (k,t[k]))
        return 0
    if sys.argv[1]=='--check':
        t=target(); warned=0
        for i in range(1,23):
            f=os.path.join(AUD,f'modlitba-{i}.mp3')
            if not os.path.exists(f): continue
            p=profile(f)
            dev=[("%s %+.1f"%(k,p[k]-t[k])) for k in BANDS if abs(p[k]-t[k])>TOL]
            if dev: print("  ! modlitba-%d mimo profilu: %s"%(i,", ".join(dev))); warned+=1
            else: print("  OK modlitba-%d"%i)
        print(("  -> %d modlitieb mimo profilu"%warned) if warned else "  -> vsetky sedia na profil 6/7/8/9")
        return 0
    p=profile(sys.argv[1]); t=target()
    print("profil (dB k telu) | odchylka od ciela:")
    for k in BANDS: print("  %-8s %+6.1f | %+.1f"%(k,p[k],p[k]-t[k]))
    return 0

sys.exit(main())
