# -*- coding: utf-8 -*-
# Zjednotenie modlitby na standard 6/7/8/9 (buzz-fix) + tiche intro ~1s.
# Pouzitie: python3 fixprayer.py <cislo> <buzz|intro>
#   buzz  = korekcia EQ na profil + intro
#   intro = iba pridat tiche intro (bez EQ)
import subprocess, wave, array, math, sys, os
import numpy as np

BANDS={'1-2k':(1000,2000),'2-3.5k':(2000,3500),'3.5-5k':(3500,5000),'5-8k':(5000,8000),'8-12k':(8000,12000)}
CENTER={'1-2k':1400,'2-3.5k':2700,'3.5-5k':4200,'5-8k':6300,'8-12k':10500}
QW={'1-2k':1.0,'2-3.5k':0.9,'3.5-5k':1.1,'5-8k':1.5,'8-12k':1.2}
TARGET={'1-2k':-6.4,'2-3.5k':-8.3,'3.5-5k':-13.2,'5-8k':-18.4,'8-12k':-15.1}
INTRO=1.0

def prof(path):
    subprocess.run(f"ffmpeg -y -i '{path}' -ar 44100 -ac 1 -c:a pcm_s16le /tmp/_p.wav",shell=True,capture_output=True)
    w=wave.open('/tmp/_p.wav','rb'); sr=w.getframerate()
    a=array.array('h'); a.frombytes(w.readframes(w.getnframes())); a=np.array([x/32768 for x in a]); n=len(a)
    S=np.abs(np.fft.rfft(a*np.hanning(n))); fr=np.fft.rfftfreq(n,1/sr)
    def b(lo,hi):
        m=(fr>=lo)&(fr<=hi); return 20*math.log10(np.sqrt((S[m]**2).sum())/n+1e-9)
    ref=b(200,500); return {k:b(*v)-ref for k,v in BANDS.items()}

def js(f):
    o=subprocess.run(f"ffmpeg -i {f} -af \"loudnorm=I=-16.4:TP=-1.7:LRA=11:print_format=json\" -f null -",shell=True,capture_output=True,text=True).stderr
    import re,json; m=re.search(r'\{[^}]+\}',o,re.S); return json.loads(m.group(0))

def normalize_intro(inwav, out):
    d=js(inwav)
    meas=f":measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:linear=true"
    subprocess.run(f"ffmpeg -y -i {inwav} -af \"loudnorm=I=-16.4:TP=-1.7:LRA=11{meas}\" -ar 44100 -ac 1 -c:a pcm_s16le /tmp/_n.wav",shell=True,capture_output=True)
    d2=js('/tmp/_n.wav'); gain=round(-16.4-float(d2['input_i'])+0.6,2)
    # limiter + intro naraz do WAV, potom encode
    subprocess.run(f"ffmpeg -y -i /tmp/_n.wav -af \"volume={gain}dB,alimiter=limit=0.822:level=false,adelay={int(INTRO*1000)}\" -ar 44100 -ac 1 -c:a pcm_s16le /tmp/_f.wav",shell=True,capture_output=True)
    subprocess.run(f"ffmpeg -y -i /tmp/_f.wav -c:a libmp3lame -b:a 192k -write_xing 1 {out}",shell=True,capture_output=True)

def eqstr(gains):
    return ",".join(f"equalizer=f={CENTER[k]}:t=q:w={QW[k]}:g={round(g,2)}" for k,g in gains.items() if abs(g)>=0.3)

def buzzfix(src,out):
    p=prof(src); g={k:(TARGET[k]-p[k])*0.9 for k in BANDS}
    for k in g: g[k]=max(-12,min(8,g[k]))
    subprocess.run(f"ffmpeg -y -i '{src}' -af \"{eqstr(g)}\" -ar 44100 -ac 1 -c:a pcm_s16le /tmp/_e1.wav",shell=True,capture_output=True)
    # normalizacia bez intro do medzisuboru na re-meranie
    d=js('/tmp/_e1.wav'); meas=f":measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:linear=true"
    subprocess.run(f"ffmpeg -y -i /tmp/_e1.wav -af \"loudnorm=I=-16.4:TP=-1.7:LRA=11{meas}\" -ar 44100 -ac 1 -c:a pcm_s16le /tmp/_o1.wav",shell=True,capture_output=True)
    p1=prof('/tmp/_o1.wav'); maxdev=max(abs(p1[k]-TARGET[k]) for k in BANDS)
    if maxdev>1.6:
        g2={k:(TARGET[k]-p1[k])*0.9 for k in BANDS}
        for k in g2: g2[k]=max(-8,min(6,g2[k]))
        subprocess.run(f"ffmpeg -y -i /tmp/_o1.wav -af \"{eqstr(g2)}\" -ar 44100 -ac 1 -c:a pcm_s16le /tmp/_e2.wav",shell=True,capture_output=True)
        normalize_intro('/tmp/_e2.wav',out)
    else:
        normalize_intro('/tmp/_o1.wav',out)

def intro_only(src,out):
    subprocess.run(f"ffmpeg -y -i '{src}' -ar 44100 -ac 1 -c:a pcm_s16le /tmp/_io.wav",shell=True,capture_output=True)
    normalize_intro('/tmp/_io.wav',out)

def check(out):
    # onset, loudness, peak, profil 5-8k
    subprocess.run(f"ffmpeg -y -t 3 -i {out} -ar 44100 -ac 1 -c:a pcm_s16le /tmp/_c.wav",shell=True,capture_output=True)
    w=wave.open('/tmp/_c.wav','rb'); sr=w.getframerate(); a=array.array('h'); a.frombytes(w.readframes(w.getnframes())); a=np.array([x/32768 for x in a])
    win=int(sr*0.01); onset=0
    for i in range(0,len(a)-win,win):
        if np.abs(a[i:i+win]).max()>0 and 20*math.log10(np.abs(a[i:i+win]).max())>-45: onset=i/sr;break
    mv=subprocess.run(f"ffmpeg -i {out} -af volumedetect -f null -",shell=True,capture_output=True,text=True).stderr
    mx=float([l for l in mv.split(chr(10)) if "max_volume" in l][0].split("max_volume:")[1].replace("dB","").strip())
    lo=subprocess.run(f"ffmpeg -i {out} -af 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=summary' -f null -",shell=True,capture_output=True,text=True).stderr
    lu=[l.split(':')[1].strip() for l in lo.split('\n') if 'Input Integrated' in l]
    p=prof(out); dev58=round(p['5-8k']-TARGET['5-8k'],1)
    return onset,mx,lu[0] if lu else '?',dev58

if __name__=='__main__':
    n=sys.argv[1]; mode=sys.argv[2]
    src=f'assets/audio/modlitba-{n}.mp3'; out=f'/tmp/mod{n}-out.mp3'
    if mode=='buzz': buzzfix(src,out)
    else: intro_only(src,out)
    onset,mx,lu,dev=check(out)
    ok = (0.85<=onset<=1.2) and mx<=-1.5 and abs(dev)<=2.5
    print(f"modlitba-{n} [{mode}]: intro {onset:.2f}s | peak {mx:.1f} dB | {lu} | 5-8k {dev:+.1f} | {'OK' if ok else 'POZOR!'}")
