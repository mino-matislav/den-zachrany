# -*- coding: utf-8 -*-
# Jemné stlmenie bzučania v modlitbe LEN na úsekoch, kde vyčnieva (štandard od 12. 10. 2026).
# Meria po 2 s (krok 0,5 s) pásma 5-8 kHz a 8-14 kHz voči telu hlasu 200-500 Hz.
# Kde je pásmo nad -19 dB, utlmí ho o 0,8 x prebytok (max 8 dB) s plynulými prechodmi; zvyšok nahrávky nemení.
# Použitie: python3 scripts/stlm-bzucanie.py vstup.wav vystup.wav   (WAV 44,1 kHz mono, potom hlasitosť a tiché intro)
import wave,numpy as np,sys,math
src,dst=sys.argv[1],sys.argv[2]
w=wave.open(src);sr=w.getframerate();a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float64)/32768
def band(x,lo,hi):
    S=np.abs(np.fft.rfft(x*np.hanning(len(x))));f=np.fft.rfftfreq(len(x),1/sr);m=(f>=lo)&(f<=hi);return 20*math.log10(np.sqrt((S[m]**2).sum())+1e-9)
# 1) meranie po 2 s (okno 2 s, krok 0,5 s) -> potrebný útlm v dB
win,hop=2.0,0.5;cent=[];gB=[];gH=[]
t=0.0
while t+win<=len(a)/sr+1e-9:
    x=a[int(t*sr):int((t+win)*sr)];r=band(x,200,500)
    if r<-60: ex_b=ex_h=0
    else:
        ex_b=max(0,(band(x,5000,8000)-r)-(-19.0)); ex_h=max(0,(band(x,8000,14000)-r)-(-19.0))
    cent.append(t+win/2);gB.append(-min(8,0.8*ex_b));gH.append(-min(8,0.8*ex_h));t+=hop
cent=np.array(cent);gB=np.array(gB);gH=np.array(gH)
# 2) STFT a plynulé krivky útlmu (lineárna interpolácia, vyhladenie 0,3 s)
n=2048;h=512;win_=np.hanning(n)
pad=np.concatenate([np.zeros(n),a,np.zeros(n)])
frames=range(0,len(pad)-n,h);f=np.fft.rfftfreq(n,1/sr)
tt=np.array([(i+n/2-n)/sr for i in frames])
def smooth(v,sec):
    k=max(1,int(sec*sr/h));ker=np.ones(k)/k;return np.convolve(np.pad(v,k,mode='edge'),ker,mode='same')[k:-k]
cb=smooth(np.interp(tt,cent,gB),0.3);ch=smooth(np.interp(tt,cent,gH),0.3)
# tvar pásiem: 5-8k zvon okolo 6,3 kHz; 8-12k plató s miernymi bokmi
wb=np.exp(-0.5*((np.log2(np.maximum(f,1)/6300))/0.35)**2)
wh=np.clip(np.minimum((f-7300)/700,(13500-f)/1500),0,1)
out=np.zeros_like(pad);norm=np.zeros_like(pad)
for k,i in enumerate(frames):
    X=np.fft.rfft(pad[i:i+n]*win_)
    gdb=cb[k]*wb+ch[k]*wh
    X*=10**(gdb/20)
    out[i:i+n]+=np.fft.irfft(X)*win_;norm[i:i+n]+=win_**2
y=(out/np.maximum(norm,1e-6))[n:n+len(a)]
ww=wave.open(dst,'wb');ww.setnchannels(1);ww.setsampwidth(2);ww.setframerate(sr)
ww.writeframes((np.clip(y,-1,1)*32767).astype(np.int16).tobytes());ww.close()
print("max útlm 6,3k: %.1f dB, 8-12k: %.1f dB; úsekov so zásahom: %d z %d"%(gB.min(),gH.min(),int(((gB<-0.5)|(gH<-0.5)).sum()),len(gB)))
