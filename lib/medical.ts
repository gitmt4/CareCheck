import {z} from 'zod';
export const MAX_UPLOAD=20*1024*1024;
export const uploadMeta=z.object({profileId:z.string().min(1).max(80),visitId:z.string().max(80).default(''),title:z.string().min(1).max(120),fileName:z.string().min(1).max(150),kind:z.enum(['report','audio']),addedBy:z.string().min(1).max(60),recordingConsent:z.boolean().default(false)}).refine(m=>m.kind!=='audio'||(m.visitId&&m.recordingConsent),{message:'Audio needs a saved visit and recording consent.'});
export type MedicalFile={id:string;profileId:string;visitId:string;title:string;fileName:string;mime:string;bytes:number;kind:'report'|'audio';addedBy:string;createdAt:string;url?:string};
export function sniffType(b:Uint8Array,kind:'report'|'audio'):string|null{
const ascii=(a:number,n:number)=>String.fromCharCode(...b.slice(a,a+n));
if(kind==='report'){
if(ascii(0,5)==='%PDF-')return 'application/pdf';
if(b[0]===0xff&&b[1]===0xd8&&b[2]===0xff)return 'image/jpeg';
if([137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v))return 'image/png';
if(ascii(4,4)==='ftyp'&&/heic|heix|hevc|hevx|mif1|msf1/.test(ascii(8,24)))return 'image/heic';
}else{
if(ascii(4,4)==='ftyp')return 'audio/mp4';
if([0x1a,0x45,0xdf,0xa3].every((v,i)=>b[i]===v))return 'audio/webm';
if(ascii(0,4)==='OggS')return 'audio/ogg';
if(ascii(0,4)==='RIFF'&&ascii(8,4)==='WAVE')return 'audio/wav';
if(ascii(0,3)==='ID3'||(b[0]===0xff&&[0xfb,0xf3,0xf2].includes(b[1])))return 'audio/mpeg';
}
return null;
}
export function parseRange(header:string|null,size:number):{offset:number;length:number}|null|false{
if(!header)return null;const m=/^bytes=(\d*)-(\d*)$/.exec(header);if(!m||(!m[1]&&!m[2]))return false;
let start:number,end:number;if(!m[1]){const suffix=Number(m[2]);if(!Number.isSafeInteger(suffix)||suffix<=0)return false;start=Math.max(0,size-suffix);end=size-1}else{start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),size-1):size-1}
if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return false;return {offset:start,length:end-start+1};
}
