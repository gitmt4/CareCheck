"""Generate fixed public app prompts. Requires edge-tts==7.3.1, Node, and network access.
Existing clips ship with the app; deployment does not call the synthesis service.
"""
import asyncio, json, os, subprocess
from pathlib import Path
import edge_tts
import edge_tts.communicate

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/audio/edge-v1'
# Add the environment's trusted CA without disabling TLS verification.
if os.environ.get('SSL_CERT_FILE'):
    edge_tts.communicate._SSL_CTX.load_verify_locations(cafile=os.environ['SSL_CERT_FILE'])
catalog=json.loads(subprocess.check_output(['node','--experimental-strip-types','--input-type=module','-e',"import {ttsPrompts,edgeVoices} from './lib/tts.ts'; console.log(JSON.stringify({prompts:ttsPrompts,voices:edgeVoices}));"],cwd=ROOT,text=True))
async def main():
    OUT.mkdir(parents=True,exist_ok=True)
    for prompt,translations in catalog['prompts'].items():
        for language,text in translations.items():
            path=OUT/f'{prompt}-{language}.mp3'
            temporary=path.with_suffix('.tmp')
            voice=catalog['voices'][language]
            await edge_tts.Communicate(text,voice,rate='-15%',proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy'),connect_timeout=15,receive_timeout=30).save(str(temporary))
            if temporary.stat().st_size<1000: raise RuntimeError('Audio clip is empty or incomplete')
            temporary.replace(path)
            print(f'Generated {path.name}: {path.stat().st_size} bytes',flush=True)
    (OUT/'manifest.json').write_text(json.dumps({'generator':'edge-tts 7.3.1','rate':'-15%','voices':catalog['voices'],'prompts':catalog['prompts']},ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__': asyncio.run(main())
