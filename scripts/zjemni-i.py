# zjemni-i.py in.wav out.wav [prah_dB=-2] [sila=0.7] [max_dB=6]
# Dynamicky stlmi pasmo ~2.3-4.8 kHz len v znelych ramcoch (nie sykavky), kde (2.5-4.5k − 1-2.5k) prevysuje prah (p75 vzorov 8 a 9).
import sys,wave,numpy as np
w=wave.open(sys.argv[1]); a=np.frombuffer(w.readframes(w.getnframes()),np.int16)/32768
thr=float(sys.argv[3]) if len(sys.argv)>3 else -2.0; k=float(sys.argv[4]) if len(sys.argv)>4 else 0.7; mx=float(sys.argv[5]) if len(sys.argv)>5 else 6.0
sr=44100;N=1024;H=256;f=np.fft.rfftfreq(N,1/sr);win=np.hanning(N)
n=(len(a)-N)//H+1
X=np.stack([np.fft.rfft(a[i*H:i*H+N]*win) for i in range(n)]); P=np.abs(X)**2
b=lambda lo,hi:10*np.log10(P[:,(f>=lo)&(f<hi)].sum(1)+1e-12)
tot=b(70,8000); hi=b(2500,4500); m=b(1000,2500); s=b(4500,8000); body=b(200,500)
v=(tot>tot.max()-35)&(s<hi-6)&(body>tot-8)
cut=np.where(v,np.clip((hi-m-thr)*k,0,mx),0.0)
# vyhladenie v case (~25 ms)
L=5; cut=np.convolve(cut,np.hanning(2*L+1)/np.hanning(2*L+1).sum(),'same')
shape=np.clip(np.minimum((f-2100)/400,(5000-f)/400),0,1)   # plynuly okraj 2.1-2.5k a 4.6-5.0k
G=10**(-cut[:,None]*shape[None,:]/20)
out=np.zeros(len(a));ws=np.zeros(len(a))
for i in range(n):
    out[i*H:i*H+N]+=np.fft.irfft(X[i]*G[i])*win; ws[i*H:i*H+N]+=win**2
out=out/np.maximum(ws,1e-8); out[ws<1e-3]=a[ws<1e-3]
o=wave.open(sys.argv[2],'w');o.setnchannels(1);o.setsampwidth(2);o.setframerate(sr);o.writeframes((np.clip(out,-1,1)*32767).astype(np.int16).tobytes())
print(f"zjemnené rámce: {100*(cut>0.5).mean():.1f} %, priemer zásahu v nich {cut[cut>0.5].mean() if (cut>0.5).any() else 0:.1f} dB, max {cut.max():.1f} dB")
