// ─────────────────────────────────────────────────────────────────────────────
// Seva Clinic — SEED DATA (100% synthetic / fictional)
//
// No real patients, no real PHI. Every name, value and date below is invented
// for the demo. This file is the local stand-in for the Supabase tables in
// supabase/schema.sql — the shapes match the tables one-to-one so the data
// layer (src/lib/data.js) can be swapped to Supabase without UI changes.
// ─────────────────────────────────────────────────────────────────────────────

export const clinic = {
  name: 'Seva Clinic',
  phone: '+91 98XXX XXXXX (demo)',
};

export const patients = [
  { id: 'p1', name: 'Asha Patil', language: 'mr', doctor: 'Dr. Sharma' },
  { id: 'p2', name: 'Rohan Mehta', language: 'en', doctor: 'Dr. Sharma' },
  { id: 'p3', name: 'Sunita Desai', language: 'hi', doctor: 'Dr. Sharma' },
  { id: 'p4', name: 'Kavita Joshi', language: 'mr', doctor: 'Dr. Sharma' },
  { id: 'p5', name: 'Prakash Nair', language: 'en', doctor: 'Dr. Sharma' },
];

// dateLabel is a display label ("Today" / "Tomorrow" / weekday) so the demo
// never goes stale; a real deployment would store a timestamp instead.
export const appointments = [
  { id: 'a1', patientId: 'p4', visitType: 'Routine health check', dateLabel: 'Today', time: '9:30 AM' },
  { id: 'a2', patientId: 'p1', visitType: 'Pregnancy check-up (28 weeks)', dateLabel: 'Today', time: '11:30 AM' },
  { id: 'a3', patientId: 'p2', visitType: 'Diabetes review', dateLabel: 'Today', time: '4:00 PM' },
  { id: 'a4', patientId: 'p3', visitType: 'Thyroid follow-up', dateLabel: 'Tomorrow', time: '10:00 AM' },
  { id: 'a5', patientId: 'p5', visitType: 'Blood pressure review', dateLabel: 'Tomorrow', time: '12:15 PM' },
];

// `plain` text only describes WHAT the test measures. It never interprets the
// result — the position vs the printed range is added by a fixed rule, and
// every explanation ends with "Please confirm with your doctor".
export const labReports = [
  {
    id: 'r1',
    patientId: 'p1',
    title: 'Antenatal panel (CBC + thyroid)',
    dateLabel: 'Yesterday',
    status: 'pending',
    values: [
      {
        name: 'Hemoglobin', value: 10.8, unit: 'g/dL', low: 12.0, high: 15.5,
        plain: {
          en: 'Hemoglobin carries oxygen in your blood.',
          hi: 'हीमोग्लोबिन आपके खून में ऑक्सीजन ले जाता है।',
          mr: 'हीमोग्लोबिन तुमच्या रक्तात ऑक्सिजन वाहते।',
        },
      },
      {
        name: 'Fasting Blood Sugar', value: 92, unit: 'mg/dL', low: 70, high: 99,
        plain: {
          en: 'This is your blood sugar measured after fasting, usually in the morning.',
          hi: 'यह बिना खाए (उपवास के बाद) मापा गया ब्लड शुगर है, आमतौर पर सुबह का।',
          mr: 'हा उपाशी पोटी (काहीही न खाता) मापलेला ब्लड शुगर आहे, सहसा सकाळी।',
        },
      },
      {
        name: 'TSH', value: 2.1, unit: 'uIU/mL', low: 0.4, high: 4.5,
        plain: {
          en: 'TSH is a signal that controls your thyroid gland.',
          hi: 'TSH एक संकेत है जो थायरॉइड ग्रंथि को नियंत्रित करता है।',
          mr: 'TSH हा एक संकेत आहे जो थायरॉइड ग्रंथी नियंत्रित करतो।',
        },
      },
      {
        name: 'Vitamin D', value: 18, unit: 'ng/mL', low: 30, high: 100,
        plain: {
          en: 'Vitamin D supports your bones and immune system.',
          hi: 'विटामिन D आपकी हड्डियों और रोग-प्रतिरोधक क्षमता के लिए ज़रूरी है।',
          mr: 'विटामिन D तुमच्या हाडांसाठी आणि रोगप्रतिकारक शक्तीसाठी महत्त्वाचं आहे।',
        },
      },
    ],
  },
  {
    id: 'r2',
    patientId: 'p2',
    title: 'Diabetes review panel',
    dateLabel: 'Yesterday',
    status: 'pending',
    values: [
      {
        name: 'HbA1c', value: 6.9, unit: '%', low: 4.0, high: 5.6,
        plain: {
          en: 'HbA1c shows your average blood sugar over the last 3 months.',
          hi: 'HbA1c पिछले 3 महीनों का औसत ब्लड शुगर दिखाता है।',
          mr: 'HbA1c मागील 3 महिन्यांचा सरासरी ब्लड शुगर दाखवतो।',
        },
      },
      {
        name: 'Fasting Blood Sugar', value: 128, unit: 'mg/dL', low: 70, high: 99,
        plain: {
          en: 'This is your blood sugar measured after fasting, usually in the morning.',
          hi: 'यह बिना खाए (उपवास के बाद) मापा गया ब्लड शुगर है, आमतौर पर सुबह का।',
          mr: 'हा उपाशी पोटी (काहीही न खाता) मापलेला ब्लड शुगर आहे, सहसा सकाळी।',
        },
      },
      {
        name: 'Total Cholesterol', value: 212, unit: 'mg/dL', low: 0, high: 200,
        plain: {
          en: 'Total cholesterol is the overall amount of cholesterol measured in your blood.',
          hi: 'कुल कोलेस्ट्रॉल आपके खून में कोलेस्ट्रॉल की कुल मात्रा है।',
          mr: 'एकूण कोलेस्ट्रॉल म्हणजे तुमच्या रक्तातील कोलेस्ट्रॉलची एकूण पातळी।',
        },
      },
      {
        name: 'Creatinine', value: 0.9, unit: 'mg/dL', low: 0.6, high: 1.3,
        plain: {
          en: 'Creatinine is a waste product in the blood that the kidneys remove.',
          hi: 'क्रिएटिनिन खून में पाया जाने वाला एक अपशिष्ट पदार्थ है जिसे किडनी बाहर निकालती है।',
          mr: 'क्रिएटिनिन हा रक्तातील टाकाऊ पदार्थ आहे जो किडनी बाहेर काढते।',
        },
      },
    ],
  },
  {
    id: 'r3',
    patientId: 'p3',
    title: 'Thyroid panel',
    dateLabel: '2 days ago',
    status: 'pending',
    values: [
      {
        name: 'TSH', value: 6.8, unit: 'uIU/mL', low: 0.4, high: 4.5,
        plain: {
          en: 'TSH is a signal that controls your thyroid gland.',
          hi: 'TSH एक संकेत है जो थायरॉइड ग्रंथि को नियंत्रित करता है।',
          mr: 'TSH हा एक संकेत आहे जो थायरॉइड ग्रंथी नियंत्रित करतो।',
        },
      },
      {
        name: 'Free T4', value: 1.1, unit: 'ng/dL', low: 0.8, high: 1.8,
        plain: {
          en: 'Free T4 is one of the main hormones made by the thyroid gland.',
          hi: 'Free T4 थायरॉइड ग्रंथि द्वारा बनाया गया एक मुख्य हार्मोन है।',
          mr: 'Free T4 हा थायरॉइड ग्रंथीने बनवलेला एक मुख्य हार्मोन आहे।',
        },
      },
      {
        name: 'Vitamin D', value: 24, unit: 'ng/mL', low: 30, high: 100,
        plain: {
          en: 'Vitamin D supports your bones and immune system.',
          hi: 'विटामिन D आपकी हड्डियों और रोग-प्रतिरोधक क्षमता के लिए ज़रूरी है।',
          mr: 'विटामिन D तुमच्या हाडांसाठी आणि रोगप्रतिकारक शक्तीसाठी महत्त्वाचं आहे।',
        },
      },
      {
        name: 'Hemoglobin', value: 12.4, unit: 'g/dL', low: 12.0, high: 15.5,
        plain: {
          en: 'Hemoglobin carries oxygen in your blood.',
          hi: 'हीमोग्लोबिन आपके खून में ऑक्सीजन ले जाता है।',
          mr: 'हीमोग्लोबिन तुमच्या रक्तात ऑक्सिजन वाहते।',
        },
      },
    ],
  },
];

// Follow-up cadence per patient. `due` is computed in the UI:
// lastVisitDays >= followEveryDays.
export const followups = [
  { id: 'f1', patientId: 'p1', reason: 'Pregnancy check-up', lastVisitDays: 34, followEveryDays: 30 },
  { id: 'f2', patientId: 'p2', reason: 'Diabetes review', lastVisitDays: 95, followEveryDays: 90 },
  { id: 'f3', patientId: 'p3', reason: 'Thyroid follow-up', lastVisitDays: 61, followEveryDays: 60 },
  { id: 'f4', patientId: 'p5', reason: 'Blood pressure review', lastVisitDays: 45, followEveryDays: 30 },
  { id: 'f5', patientId: 'p4', reason: 'Routine health check', lastVisitDays: 20, followEveryDays: 180 },
];

// The "~$30/month" stack — an ESTIMATE for the episode cost card, not a bill.
// Figures are the plan's target stack; the episode must re-measure before
// quoting them on camera (see README).
export const costStack = [
  { item: 'Hosting (Vercel)', detail: 'Static app hosting, hobby/pro tier', monthly: 0 },
  { item: 'Domain', detail: 'Custom domain, amortised monthly', monthly: 1 },
  { item: 'Database (Supabase)', detail: 'Free tier at this scale', monthly: 0 },
  { item: 'AI model API', detail: 'Low-cost model, report summaries only, low volume', monthly: 12 },
  { item: 'WhatsApp Business API', detail: 'Utility-message pricing, small clinic volume', monthly: 14 },
  { item: 'Misc (backups, monitoring)', detail: 'Free tiers + small buffer', monthly: 3 },
];
