from pathlib import Path
import json,struct,hashlib
r=Path(__file__).resolve().parent
m=json.loads((r/'assets/manifest.json').read_text(encoding='utf-8'))
errors=[]
for a in m['assets']:
 p=r/'assets'/a['file']
 if not p.exists():errors.append(a['id']+': missing');continue
 d=p.read_bytes()
 if d[:8]!=b'\x89PNG\r\n\x1a\n':errors.append(a['id']+': not PNG');continue
 w,h=struct.unpack('>II',d[16:24])
 if (w,h)!=(a['w'],a['h']):errors.append(a['id']+': size mismatch')
 if d[25]!=6:errors.append(a['id']+': not RGBA')
print(f"checked={len(m['assets'])}, errors={len(errors)}")
print('\n'.join(errors))
raise SystemExit(bool(errors))
