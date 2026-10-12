# Použitie: python3 scripts/odstran-tony.py vstup.wav vystup.wav [prah_dB]
# Nájde trvalé tónové špičky 4-15 kHz (artefakt „bzučania“) a odstráni ich úzkymi zárezmi (~1/12 oktávy).
import wave,numpy as np,sys
from numpy.lib.stride_tricks import sliding_window_view as sw
src,dst=sys.argv[1:3]; TH=float(sys.argv[3]) if len(sys.argv)>3 else 3.5
w=wave.open(src);sr=w.getframerate();a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768
n=16384;f=np.fft.rfftfreq(n,1/sr);P=0;c=0
for i in range(0,len(a)-n,n//2):
    y=a[i:i+n]
    if np.sqrt((y**2).mean())<0.01: continue
    P=P+np.abs(np.fft.rfft(y*np.hanning(n)))**2;c+=1
d=10*np.log10(P/c+1e-12);k=121;ex=d-np.median(sw(np.pad(d,k//2,mode='edge'),k),axis=1)
cand=[]
for i in np.argsort(ex)[::-1]:
    if ex[i]<TH: break
    if 4000<f[i]<15000 and all(abs(f[i]-c_)>80 for c_,_ in cand): cand.append((f[i],ex[i]))
# aplikácia v STFT: zárez Gauss, hĺbka = prebytok (max 9 dB)
N=4096;H=1024;win=np.hanning(N);F=np.fft.rfftfreq(N,1/sr);G=np.zeros_like(F)
for fc,e in cand:
    G-=min(9,e-1.5)*np.exp(-0.5*((F-fc)/30.0)**2)
g=10**(G/20);pad=np.concatenate([np.zeros(N),a,np.zeros(N)]);out=np.zeros_like(pad);nm=np.zeros_like(pad)
for i in range(0,len(pad)-N,H):
    out[i:i+N]+=np.fft.irfft(np.fft.rfft(pad[i:i+N]*win)*g)*win;nm[i:i+N]+=win**2
y=(out/np.maximum(nm,1e-6))[N:N+len(a)]
o=wave.open(dst,'wb');o.setnchannels(1);o.setsampwidth(2);o.setframerate(sr);o.writeframes((np.clip(y,-1,1)*32767).astype(np.int16).tobytes());o.close()
print("zárezy:",[(int(c_),round(min(9,e),1)) for c_,e in sorted(cand)])
