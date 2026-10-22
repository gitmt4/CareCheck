export const ttsPrompts={
 meal:{te:'మీరు భోజనం చేశారా?',ta:'இந்த வேளை உணவை சாப்பிட்டீர்களா?',en:'Have you eaten this meal?'},
 medicine:{te:'మీరు మందులు వేసుకున్నారా?',ta:'நீங்கள் எடுத்துக்கொள்ள வேண்டிய மாத்திரைகளை எடுத்துக்கொண்டீர்களா?',en:'Have you taken your scheduled tablets?'},
 consent:{te:'మీరు భోజనం చేశారో, మందులు తీసుకున్నారో ఇక్కడ చెప్పవచ్చు. ఈ వివరాలు మీ కుటుంబం చూడగలరు. మీకు ఇష్టమైతే అవును నొక్కండి.',ta:'உங்கள் உணவு மற்றும் மாத்திரைகளைப் பற்றி இங்கே தெரிவிக்கலாம். நீங்கள் பகிரும் பதில்களை உங்கள் குடும்பத்தினர் பார்க்கலாம். சம்மதித்தால், ஆம் என்பதை அழுத்தவும்.',en:'You can tell us about your meals and tablets. Your family can see the answers you choose to share. If you agree, tap Yes, I agree.'},
 test:{te:'నమస్కారం! మీరు భోజనం చేశారా?',ta:'வணக்கம்! நீங்கள் சாப்பிட்டீர்களா?',en:'Hello! Have you eaten your meal?'}
} as const;
export type SpeechPrompt=keyof typeof ttsPrompts;
export const edgeVoices={te:'te-IN-ShrutiNeural',ta:'ta-IN-PallaviNeural',en:'en-IN-NeerjaNeural'} as const;
export function audioPath(prompt:string,language:string){
 if(!Object.hasOwn(ttsPrompts,prompt)||!Object.hasOwn(edgeVoices,language))return null;
 return `/audio/edge-v1/${prompt}-${language}.mp3`;
}
