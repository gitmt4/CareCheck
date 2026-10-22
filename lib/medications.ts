import {z} from 'zod';
export function validExpiry(value:string){
 if(value==='')return true;
 if(!/^\d{4}-\d{2}(-\d{2})?$/.test(value))return false;
 const [y,m,d]=value.split('-').map(Number);if(y<1900||y>2200||m<1||m>12)return false;
 return d===undefined||(d>=1&&d<=new Date(Date.UTC(y,m,0)).getUTCDate());
}
export const medicationSchema=z.object({id:z.string().min(1).max(80),profileId:z.string().min(1).max(80),name:z.string().trim().min(1).max(100),strength:z.string().max(80),instructions:z.string().max(500),expiry:z.string().refine(validExpiry,'Enter a valid expiration date or month.'),quantity:z.number().int().min(0).max(999999).nullable(),unit:z.string().min(1).max(30),lowStockAt:z.number().int().min(0).max(999999),batch:z.string().max(80),archived:z.boolean(),dose:z.string().max(80).default(''),food:z.enum(['unspecified','before','with','after','empty']).default('unspecified'),timing:z.enum(['unscheduled','scheduled','as-needed']).default('unscheduled'),times:z.array(z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)).max(8).default([]),days:z.array(z.number().int().min(0).max(6)).min(1).max(7).default([0,1,2,3,4,5,6]),startDate:z.string().refine(v=>v===''||(v.length===10&&validExpiry(v))).default(''),endDate:z.string().refine(v=>v===''||(v.length===10&&validExpiry(v))).default('')}).superRefine((m,ctx)=>{if(m.timing==='scheduled'&&!m.times.length)ctx.addIssue({code:'custom',message:'Add at least one medication time.'});if(new Set(m.times).size!==m.times.length)ctx.addIssue({code:'custom',message:'Each time must be different.'});if(m.startDate&&m.endDate&&m.endDate<m.startDate)ctx.addIssue({code:'custom',message:'End date must be on or after start date.'});});
export const foodLabels={unspecified:'Follow prescription instructions',before:'Before food',with:'With food',after:'After food',empty:'On an empty stomach'};
export const dayLabels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export function medicationTiming(m:Medication){return m.timing==='scheduled'?`${m.times.join(', ')} · ${m.days.length===7?'Every day':m.days.map(d=>dayLabels[d]).join(', ')}`:m.timing==='as-needed'?'As needed · No scheduled check-in':'No times set'}

export type Medication=z.infer<typeof medicationSchema>;
export function expiryStatus(expiry:string,today:string):{state:'unknown'|'expired'|'today'|'soon'|'ok';days:number|null}{
 if(!expiry||!validExpiry(expiry))return {state:'unknown',days:null};
 const [y,m]=expiry.split('-').map(Number);const lastDay=expiry.length===7?`${expiry}-${String(new Date(Date.UTC(y,m,0)).getUTCDate()).padStart(2,'0')}`:expiry;
 const days=Math.round((Date.parse(lastDay+'T00:00:00Z')-Date.parse(today+'T00:00:00Z'))/86400000);
 return {state:days<0?'expired':days===0?'today':days<=30?'soon':'ok',days};
}
export function isLowStock(m:Medication){return !m.archived&&m.quantity!==null&&m.quantity<=m.lowStockAt}
