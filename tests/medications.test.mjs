import test from 'node:test';import assert from 'node:assert/strict';
import {dataSchema,emptyData,demoData,localDate} from '../lib/care.ts';
import {expiryStatus,validExpiry,isLowStock,medicationSchema} from '../lib/medications.ts';
const medicine={id:'m1',profileId:'thatha',name:'Sample medication',strength:'',instructions:'',expiry:'2026-10',quantity:5,unit:'tablets',lowStockAt:10,batch:'',archived:false};
test('existing households without medications load with an empty inventory',()=>{const old={...emptyData};delete old.medications;assert.deepEqual(dataSchema.parse(old).medications,[])});
test('medications reject unknown family members and duplicate IDs',()=>{const d=demoData(new Date());assert.equal(dataSchema.safeParse({...d,medications:[medicine]}).success,true);assert.equal(dataSchema.safeParse({...d,medications:[{...medicine,profileId:'unknown'}]}).success,false);assert.equal(dataSchema.safeParse({...d,medications:[medicine,medicine]}).success,false)});
test('date validation respects month lengths, leap years, and unknown expiration',()=>{for(const date of ['2026-02-30','2026-13','2026-00','2026-02-29','2026-01-00'])assert.equal(validExpiry(date),false);for(const date of ['', '2028-02-29','2026-02','2026-10-31'])assert.equal(validExpiry(date),true)});
test('month-only expiration is not expired before the end of its printed month',()=>{assert.equal(expiryStatus('2026-10','2026-10-15').state,'soon');assert.equal(expiryStatus('2026-10','2026-10-31').state,'today');assert.equal(expiryStatus('2026-10','2026-11-01').state,'expired')});
test('exact-day and 30-day boundaries are distinct from unknown dates',()=>{assert.equal(expiryStatus('2026-10-15','2026-10-15').state,'today');assert.equal(expiryStatus('2026-11-14','2026-10-15').state,'soon');assert.equal(expiryStatus('2026-11-15','2026-10-15').state,'ok');assert.equal(expiryStatus('','2026-10-15').state,'unknown')});
test('India and US families can have different expiration states at the same moment',()=>{const now=new Date('2026-10-15T20:00:00Z');assert.equal(expiryStatus('2026-10-15',localDate(now,'Asia/Kolkata')).state,'expired');assert.equal(expiryStatus('2026-10-15',localDate(now,'America/New_York')).state,'today')});
test('stock distinguishes zero, unknown, and archived entries',()=>{assert.equal(isLowStock({...medicine,quantity:0}),true);assert.equal(isLowStock({...medicine,quantity:null}),false);assert.equal(isLowStock({...medicine,archived:true}),false);assert.equal(medicationSchema.safeParse({...medicine,quantity:-1}).success,false);assert.equal(medicationSchema.safeParse({...medicine,quantity:1.5}).success,false)});

const {saveMedication,scheduledToday}=await import('../lib/care.ts');
test('old medication entries remain inventory-only',()=>{const m=medicationSchema.parse(medicine);assert.equal(m.timing,'unscheduled');assert.deepEqual(m.times,[])});
test('scheduled medication requires valid distinct times and a valid course',()=>{
 for(const change of [{times:[]},{times:['25:00']},{times:['09:00','09:00']},{times:['09:00'],days:[]},{times:['09:00'],startDate:'2026-10-20',endDate:'2026-10-19'}])assert.equal(medicationSchema.safeParse({...medicine,timing:'scheduled',...change}).success,false);
});
test('linked check-ins follow weekdays, course dates and India local midnight',()=>{
 const m=medicationSchema.parse({...medicine,timing:'scheduled',times:['09:00','18:00'],days:[5],startDate:'2026-10-16',endDate:'2026-10-16'});const d=saveMedication(demoData(new Date()),m);const linked=d.schedules.filter(s=>s.medicationId===m.id);assert.equal(linked.length,2);
 assert.equal(scheduledToday(d,linked[0],new Date('2026-10-15T18:29:00Z')),false);
 assert.equal(scheduledToday(d,linked[0],new Date('2026-10-15T18:30:00Z')),true);
 assert.equal(scheduledToday(d,linked[0],new Date('2026-10-16T18:30:00Z')),false);
});
test('editing keeps unchanged time IDs and history; archiving pauses linked checks only',()=>{
 const m=medicationSchema.parse({...medicine,timing:'scheduled',times:['09:00','18:00']});const d=saveMedication(demoData(new Date()),m);const old=d.schedules.find(s=>s.medicationId===m.id&&s.time==='09:00');const changed=saveMedication(d,{...m,name:'New label',times:['09:00','20:00']});assert.equal(changed.schedules.find(s=>s.medicationId===m.id&&s.time==='09:00').id,old.id);assert.equal(changed.schedules.some(s=>s.medicationId===m.id&&s.time==='18:00'),false);assert.deepEqual(changed.responses,d.responses);
 const archived=saveMedication(d,{...m,archived:true});assert.equal(archived.schedules.filter(s=>s.medicationId===m.id).every(s=>!s.active),true);assert.equal(archived.schedules.find(s=>s.id==='thatha-tablets').active,true);assert.equal(dataSchema.safeParse(archived).success,true);
 const restored=saveMedication(archived,m);assert.equal(restored.schedules.filter(s=>s.medicationId===m.id).every(s=>s.active),true);
 const prn=saveMedication(d,{...m,timing:'as-needed',times:[]});assert.equal(prn.schedules.some(s=>s.medicationId===m.id),false);assert.deepEqual(prn.responses,d.responses);
});
