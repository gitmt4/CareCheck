import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {audioPath,edgeVoices,ttsPrompts} from '../lib/tts.ts';
test('only fixed prompt IDs and languages resolve to bundled audio',()=>{
 for(const bad of ['__proto__','constructor','../secret','personal note',''])assert.equal(audioPath(bad,'te'),null);
 assert.equal(audioPath('meal','fr'),null);assert.equal(audioPath('meal','te'),'/audio/edge-v1/meal-te.mp3');
});
test('every supported prompt/language has an actual nonempty MP3 file',()=>{
 for(const prompt of Object.keys(ttsPrompts))for(const language of Object.keys(edgeVoices)){
 const data=fs.readFileSync(new URL('../public'+audioPath(prompt,language),import.meta.url));
 assert.ok(data.length>1000);assert.ok(data.subarray(0,3).toString()==='ID3'||(data[0]===255&&(data[1]&224)===224));
 }
});
test('generation manifest matches the current texts and selected Telugu voice',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../public/audio/edge-v1/manifest.json',import.meta.url),'utf8'));
 assert.deepEqual(manifest.prompts,ttsPrompts);assert.deepEqual(manifest.voices,edgeVoices);assert.equal(manifest.voices.te,'te-IN-ShrutiNeural');
});
