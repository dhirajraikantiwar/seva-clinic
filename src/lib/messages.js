// ─────────────────────────────────────────────────────────────────────────────
// Message generation — template / rule-based ONLY. No LLM calls in v1.
//
// Guardrails baked in here:
//  • Every message is a DRAFT. Nothing in this app sends anything.
//  • The report explainer never diagnoses and never suggests treatment.
//    It only states a value's position vs the range printed on the report,
//    plus a plain description of what the test measures.
//  • Every report explanation ends with the hard-coded closing line.
// ─────────────────────────────────────────────────────────────────────────────

import { clinic } from '../data/seed.js';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi · हिन्दी' },
  { code: 'mr', label: 'Marathi · मराठी' },
];

// Hard-coded closing line for every report explanation. Do not soften or
// make this optional — it is the safety line of the whole feature.
export const DOCTOR_CONFIRM_LINE = {
  en: 'Please confirm with your doctor.',
  hi: 'कृपया अपने डॉक्टर से इस रिपोर्ट पर बात करके पुष्टि करें।',
  mr: 'कृपया आपल्या डॉक्टरांशी या रिपोर्टबद्दल बोलून खात्री करा।',
};

const INFO_ONLY_LINE = {
  en: 'This is information only — it is not a diagnosis and not treatment advice.',
  hi: 'यह सिर्फ जानकारी है — यह कोई निदान या इलाज की सलाह नहीं है।',
  mr: 'ही फक्त माहिती आहे — हे निदान किंवा उपचारांचा सल्ला नाही।',
};

export function buildReminder(patient, appointment, lang) {
  const when = `${appointment.dateLabel}, ${appointment.time}`;
  if (lang === 'hi') {
    return `नमस्ते ${patient.name} जी, यह ${clinic.name} से आपके अपॉइंटमेंट की याद दिलाने के लिए है।
भेंट: ${appointment.visitType}
समय: ${when}
डॉक्टर: ${patient.doctor}
कृपया 10 मिनट पहले आएँ और अपनी पुरानी रिपोर्ट साथ लाएँ। समय बदलना हो तो इस नंबर पर जवाब दें।
— ${clinic.name} (यह एक ड्राफ्ट है, भेजा नहीं गया)`;
  }
  if (lang === 'mr') {
    return `नमस्कार ${patient.name}, ही ${clinic.name} कडून तुमच्या अपॉइंटमेंटची आठवण आहे।
भेट: ${appointment.visitType}
वेळ: ${when}
डॉक्टर: ${patient.doctor}
कृपया 10 मिनिटे आधी या आणि मागील रिपोर्ट सोबत आणा। वेळ बदलायची असेल तर या नंबरवर उत्तर द्या।
— ${clinic.name} (हा एक ड्राफ्ट आहे, पाठवलेला नाही)`;
  }
  return `Hello ${patient.name}, this is a reminder from ${clinic.name} for your appointment.
Visit: ${appointment.visitType}
When: ${when}
Doctor: ${patient.doctor}
Please arrive 10 minutes early and bring your previous reports. Reply to this message if you need to reschedule.
— ${clinic.name} (draft only — not sent)`;
}

export function buildNudge(patient, followup, lang) {
  if (lang === 'hi') {
    return `नमस्ते ${patient.name} जी, ${clinic.name} से संपर्क कर रहे हैं। आपकी पिछली भेंट (${followup.reason}) को ${followup.lastVisitDays} दिन हो गए हैं, और अब आपके फॉलो-अप का समय हो गया है। क्या हम इस हफ्ते ${patient.doctor} के साथ एक स्लॉट बुक कर दें? YES लिखकर जवाब दें, हम समय की पुष्टि कर देंगे।
— ${clinic.name} (यह एक ड्राफ्ट है, भेजा नहीं गया)`;
  }
  if (lang === 'mr') {
    return `नमस्कार ${patient.name}, ${clinic.name} कडून संपर्क करत आहोत। तुमच्या मागील भेटीला (${followup.reason}) ${followup.lastVisitDays} दिवस झाले आहेत, आणि तुमचा फॉलो-अप आता बाकी आहे। आम्ही या आठवड्यात ${patient.doctor} सोबत स्लॉट बुक करू का? YES म्हणून उत्तर द्या, आम्ही वेळ निश्चित करू।
— ${clinic.name} (हा एक ड्राफ्ट आहे, पाठवलेला नाही)`;
  }
  return `Hello ${patient.name}, this is ${clinic.name}. It's been ${followup.lastVisitDays} days since your last visit (${followup.reason}), and your follow-up is now due. Would you like us to book a slot this week with ${patient.doctor}? Reply YES and we will confirm a time.
— ${clinic.name} (draft only — not sent)`;
}

// Position of a value vs the range printed on the report. Pure comparison —
// this is the entire "interpretation" the explainer is allowed to do.
export function valuePosition(value) {
  if (value.value < value.low) return 'below';
  if (value.value > value.high) return 'above';
  return 'inside';
}

const POSITION_TEXT = {
  en: {
    inside: 'inside the range printed on the report',
    below: 'below the range printed on the report',
    above: 'above the range printed on the report',
  },
  hi: {
    inside: 'रिपोर्ट पर दी गई सीमा के अंदर है',
    below: 'रिपोर्ट पर दी गई सीमा से नीचे है',
    above: 'रिपोर्ट पर दी गई सीमा से ऊपर है',
  },
  mr: {
    inside: 'रिपोर्टवर दिलेल्या मर्यादेच्या आत आहे',
    below: 'रिपोर्टवर दिलेल्या मर्यादेपेक्षा खाली आहे',
    above: 'रिपोर्टवर दिलेल्या मर्यादेपेक्षा वर आहे',
  },
};

export function explainValue(value, lang) {
  const pos = valuePosition(value);
  const range = `${value.low}–${value.high} ${value.unit}`;
  if (lang === 'hi') {
    return `${value.plain.hi} आपका मान ${value.value} ${value.unit} है; रिपोर्ट पर दी गई सीमा ${range} है, और यह मान उस सीमा के हिसाब से ${POSITION_TEXT.hi[pos]}।`;
  }
  if (lang === 'mr') {
    return `${value.plain.mr} तुमचं मान ${value.value} ${value.unit} आहे; रिपोर्टवर दिलेली मर्यादा ${range} आहे, आणि हे मान त्या मर्यादेनुसार ${POSITION_TEXT.mr[pos]}।`;
  }
  return `${value.plain.en} Your value is ${value.value} ${value.unit}; the range printed on the report is ${range}, and this value is ${POSITION_TEXT.en[pos]}.`;
}

// Full plain-language summary of one report, in one language.
// Structure is fixed: intro → one line per value → info-only line → closing.
export function buildReportSummary(patient, report, lang) {
  const lines = report.values.map((v) => `• ${v.name}: ${explainValue(v, lang)}`);
  const outside = report.values.filter((v) => valuePosition(v) !== 'inside').length;
  const intro = {
    en: `${patient.name}, here is your ${report.title} (${report.dateLabel}) in simple words. ${outside} of ${report.values.length} values are outside the range printed on the report, and ${report.values.length - outside} are inside it.`,
    hi: `${patient.name} जी, यह आपकी ${report.title} (${report.dateLabel}) आसान शब्दों में है। ${report.values.length} मानों में से ${outside} रिपोर्ट पर दी गई सीमा के बाहर हैं, और ${report.values.length - outside} सीमा के अंदर हैं।`,
    mr: `${patient.name}, ही तुमची ${report.title} (${report.dateLabel}) सोप्या शब्दांत। ${report.values.length} मानांपैकी ${outside} रिपोर्टवर दिलेल्या मर्यादेच्या बाहेर आहेत, आणि ${report.values.length - outside} मर्यादेच्या आत आहेत।`,
  }[lang];
  return [intro, '', ...lines, '', INFO_ONLY_LINE[lang], DOCTOR_CONFIRM_LINE[lang]].join('\n');
}
