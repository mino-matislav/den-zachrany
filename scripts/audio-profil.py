#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Zvukovy profil modlitieb (FFT). Ciel = zvukovy standard z 12. 10. 2026 (vzory 8 a 9).
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
TONE_MAX = 6.5  # dB nad okolim: trvaly uzky ton 4-15 kHz = 'bzucanie' (stare bzuciace nahravky 7,0-7,8; zjednotene <= 5,8)
VZORY = {'modlitba-8','modlitba-9'}  # vzorove modlitby (schvalil Admin), profil sa im nekontroluje
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

def tone(path):
    # najsilnejsi trvaly uzky ton 4-15 kHz voci okoliu (len recove ramce), v dB
    subprocess.run(f"ffmpeg -y -i '{path}' -ar 44100 -ac 1 -c:a pcm_s16le /tmp/_at.wav", shell=True, capture_output=True)
    w=wave.open('/tmp/_at.wav','rb'); sr=w.getframerate()
    a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16)/32768
    n=16384; f=np.fft.rfftfreq(n,1/sr); P=0; c=0
    for i in range(0,len(a)-n,n//2):
        y=a[i:i+n]
        if np.sqrt((y**2).mean())<0.01: continue
        P=P+np.abs(np.fft.rfft(y*np.hanning(n)))**2; c+=1
    d=10*np.log10(P/max(c,1)+1e-12); k=121
    from numpy.lib.stride_tricks import sliding_window_view as sw
    ex=d-np.median(sw(np.pad(d,k//2,mode='edge'),k),axis=1)
    m=(f>4000)&(f<15000); return float(ex[m].max())

# Ciel = priemer 26 modliteb zjednotenych 12. 10. 2026 (1-7, 10-28) na standard medzi farbou 8 a 6.
# Vzory 8 a 9 sa od neho odchyluju opacnym smerom (8 jasnejsia, 9 tmavsia), preto sa im profil nekontroluje.
# Stary ciel (priemer 6/7/8/9, svetlejsi) bol: 1-2k -6.4, 2-3.5k -8.4, 3.5-5k -13.2, 5-8k -18.4, 8-12k -15.0.
TARGET={'1-2k':-10.7,'2-3.5k':-15.7,'3.5-5k':-20.2,'5-8k':-22.3,'8-12k':-23.1}
def target():
    return dict(TARGET)

def main():
    if len(sys.argv)<2:
        print("pouzitie: --check | --target | <subor>"); return 0
    if sys.argv[1]=='--target':
        t=target(); print("CIEL (zvukovy standard 12. 10. 2026, dB k telu 200-500):")
        for k in BANDS: print("  %-8s %+.1f" % (k,t[k]))
        return 0
    if sys.argv[1]=='--check':
        t=target(); warned=0
        import glob, re as _re
        # cislovane modlitby podla cisla, ostatne (napr. modlitba-zachrany) za nimi podla nazvu
        def poradie(f):
            m=_re.search(r'modlitba-(\d+)\.mp3$',f)
            return (0,int(m.group(1)),'') if m else (1,0,os.path.basename(f))
        for f in sorted(glob.glob(os.path.join(AUD,'modlitba-*.mp3')),key=poradie):
            nazov=os.path.basename(f)[:-4]
            p=profile(f)
            dev=[] if nazov in VZORY else [("%s %+.1f"%(k,p[k]-t[k])) for k in BANDS if abs(p[k]-t[k])>TOL]
            tn=tone(f)
            if tn>TONE_MAX: dev.append("bzuciaci ton %.1f dB (max %.1f)"%(tn,TONE_MAX))
            if dev: print("  ! %s mimo profilu: %s"%(nazov,", ".join(dev))); warned+=1
            else: print("  OK %s%s"%(nazov," (vzor)" if nazov in VZORY else ""))
        print(("  -> %d modlitieb mimo profilu"%warned) if warned else "  -> vsetky sedia na zvukovy standard (vzory 8 a 9)")
        return 0
    p=profile(sys.argv[1]); t=target()
    print("profil (dB k telu) | odchylka od ciela:")
    for k in BANDS: print("  %-8s %+6.1f | %+.1f"%(k,p[k],p[k]-t[k]))
    return 0

sys.exit(main())
