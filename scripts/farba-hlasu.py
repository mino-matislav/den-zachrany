# Prispôsobí farbu hlasu modlitby vzoru (priemer modlitieb 8 a 6). Použitie: python3 scripts/farba-hlasu.py vstup.wav vzor8.wav,vzor6.wav vystup.wav [sila]
# Prispôsobí priemernú farbu hlasu (spektrum reči) vstupu k referencii. Plynulá krivka (1/3 oktávy), limit ±LIM dB.
import wave,numpy as np,sys
src,ref,dst=sys.argv[1:4]; strength=float(sys.argv[4]) if len(sys.argv)>4 else 1.0; LIM=10.0
def load(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768, w.getframerate()
a,sr=load(src); refs=[load(x)[0] for x in ref.split(',')]; n=4096; h=1024; win=np.hanning(n); f=np.fft.rfftfreq(n,1/sr)
def ltas(x):
    P=np.zeros(n//2+1); c=0
    for i in range(0,len(x)-n,h):
        fr=x[i:i+n]
        if np.sqrt((fr**2).mean())<10**(-40/20): continue   # len rečové rámce
        P+=np.abs(np.fft.rfft(fr*win))**2; c+=1
    return 10*np.log10(P/c+1e-12)
A=ltas(a)
f_=np.fft.rfftfreq(n,1/sr); bb=(f_>=200)&(f_<=500)
Rs=[ltas(x) for x in refs]; R=np.mean([x-x[bb].mean() for x in Rs],axis=0)
def smooth(d):   # 1/3-oktávové vyhladenie
    out=np.copy(d)
    for i,fi in enumerate(f):
        if fi<20: continue
        m=(f>=fi/2**(1/6))&(f<=fi*2**(1/6)); out[i]=d[m].mean()
    return out
diff=smooth(R-A)
band=(f>=200)&(f<=500); diff-=diff[band].mean()   # zachovaj telo hlasu, mení sa len pomer pásiem
diff[f<60]=diff[np.argmin(abs(f-60))]; diff[f>15000]=diff[np.argmin(abs(f-15000))]
g=np.clip(diff*strength,-LIM,LIM); G=10**(g/20)
pad=np.concatenate([np.zeros(n),a,np.zeros(n)]); out=np.zeros_like(pad); nm=np.zeros_like(pad)
for i in range(0,len(pad)-n,h):
    X=np.fft.rfft(pad[i:i+n]*win)*G; out[i:i+n]+=np.fft.irfft(X)*win; nm[i:i+n]+=win**2
y=(out/np.maximum(nm,1e-6))[n:n+len(a)]; y/=max(1,np.abs(y).max()/0.98)
w=wave.open(dst,'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((y*32767).astype(np.int16).tobytes()); w.close()
for lo,hi in [(80,200),(500,1000),(1000,2000),(2000,3500),(3500,5000),(5000,8000),(8000,12000)]:
    m=(f>=lo)&(f<hi); print(f"{lo}-{hi} Hz: {g[m].mean():+.1f} dB",end=" | ")
print()
