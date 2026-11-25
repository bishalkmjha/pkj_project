/**
 * Pregnancy-mode content, based on WHO antenatal care guidance and India's national programmes
 * (PMSMA, JSSK). MUST be reviewed by an obstetrician before public release.
 */
import type { Lang } from "../lib/types";

type L = Record<Lang, string>;

export interface Stage { from: number; to: number; title: L; body: L; baby: L; todo: L[] }

export const STAGES: Stage[] = [
  {
    from: 0, to: 8,
    title: { en: "Early pregnancy", hi: "शुरुआती गर्भावस्था" },
    body: { en: "Tiredness, nausea, tender breasts and passing urine more often are common.", hi: "थकान, जी मिचलाना, स्तनों में दर्द और बार-बार पेशाब आना आम है।" },
    baby: { en: "The baby's heart, brain and spine are starting to form. The heartbeat can often be seen on a scan from about week 6–7.", hi: "बच्चे का दिल, दिमाग और रीढ़ बनना शुरू हो रहे हैं। लगभग 6–7वें हफ़्ते से स्कैन में अक्सर धड़कन दिख जाती है।" },
    todo: [
      { en: "Book your first check-up and register your pregnancy at a health centre to get your Mother and Child Protection (MCP) card.", hi: "पहली जाँच करवाएँ और स्वास्थ्य केंद्र पर गर्भावस्था का पंजीकरण कराकर मातृ एवं शिशु सुरक्षा (MCP) कार्ड लें।" },
      { en: "Take folic acid as your doctor advises.", hi: "डॉक्टर की सलाह के अनुसार फ़ोलिक एसिड लें।" },
      { en: "No alcohol, smoking or tobacco, and no medicines without a doctor's advice.", hi: "शराब, धूम्रपान या तंबाकू बिल्कुल नहीं, और डॉक्टर की सलाह के बिना कोई दवा नहीं।" },
      { en: "For nausea: small, frequent meals and ginger.", hi: "जी मिचलाने के लिए: थोड़ा-थोड़ा, बार-बार खाना और अदरक।" },
    ],
  },
  {
    from: 9, to: 13,
    title: { en: "End of the first trimester", hi: "पहली तिमाही का आख़िरी हिस्सा" },
    body: { en: "Nausea often starts to ease by weeks 12–14. Your waistline may begin to change.", hi: "12–14वें हफ़्ते तक जी मिचलाना अक्सर कम होने लगता है। कमर का आकार बदलना शुरू हो सकता है।" },
    baby: { en: "All the main organs are formed and the baby is starting to move, though you can't feel it yet.", hi: "सभी मुख्य अंग बन चुके हैं और बच्चा हिलना शुरू कर देता है, हालाँकि आप अभी महसूस नहीं करेंगी।" },
    todo: [
      { en: "First scan (usually 11–13 weeks) to confirm dates and check the baby.", hi: "पहला स्कैन (आमतौर पर 11–13 हफ़्ते) तारीख पक्की करने और बच्चे की जाँच के लिए।" },
      { en: "Blood and urine tests: haemoglobin, blood group, sugar, thyroid and infections, as your doctor advises.", hi: "खून और पेशाब की जाँच: हीमोग्लोबिन, ब्लड ग्रुप, शुगर, थायरॉइड और इन्फ़ेक्शन, डॉक्टर की सलाह के अनुसार।" },
    ],
  },
  {
    from: 14, to: 20,
    title: { en: "Second trimester begins", hi: "दूसरी तिमाही की शुरुआत" },
    body: { en: "Many people feel more energetic. Your bump starts to show.", hi: "कई लोग ज़्यादा ऊर्जावान महसूस करते हैं। पेट दिखने लगता है।" },
    baby: { en: "You may feel the first movements, like flutters, between weeks 16 and 22.", hi: "16 से 22वें हफ़्ते के बीच पहली हलचल, फड़फड़ाहट जैसी, महसूस हो सकती है।" },
    todo: [
      { en: "Your doctor usually starts iron-folic acid and calcium tablets now. They are free at government health centres.", hi: "डॉक्टर आमतौर पर अब आयरन-फ़ोलिक एसिड और कैल्शियम की गोलियाँ शुरू करते हैं। ये सरकारी स्वास्थ्य केंद्रों पर मुफ़्त मिलती हैं।" },
      { en: "Detailed anomaly scan around weeks 18–20.", hi: "लगभग 18–20वें हफ़्ते में विस्तृत (एनॉमली) स्कैन।" },
      { en: "Td (tetanus-diphtheria) vaccine, as advised.", hi: "Td (टिटनेस-डिप्थीरिया) का टीका, सलाह के अनुसार।" },
    ],
  },
  {
    from: 21, to: 27,
    title: { en: "Growing steadily", hi: "लगातार बढ़त" },
    body: { en: "Backache, heartburn and mild swelling of the feet are common.", hi: "कमर दर्द, सीने में जलन और पैरों में हल्की सूजन आम है।" },
    baby: { en: "The baby is growing fast, can hear sounds and has regular sleep and wake times.", hi: "बच्चा तेज़ी से बढ़ रहा है, आवाज़ें सुन सकता है और उसके सोने-जागने का समय तय होने लगता है।" },
    todo: [
      { en: "Sugar test for gestational diabetes, usually between weeks 24 and 28.", hi: "गर्भावस्था की डायबिटीज़ के लिए शुगर की जाँच, आमतौर पर 24 से 28वें हफ़्ते के बीच।" },
      { en: "Keep taking iron and calcium; eat an extra healthy snack each day.", hi: "आयरन और कैल्शियम लेती रहें; रोज़ एक अतिरिक्त पौष्टिक नाश्ता खाएँ।" },
    ],
  },
  {
    from: 28, to: 36,
    title: { en: "Third trimester", hi: "तीसरी तिमाही" },
    body: { en: "You may feel heavier, breathless or tired, and sleep can be harder. Sleeping on your side is recommended from now on.", hi: "भारीपन, साँस फूलना या थकान महसूस हो सकती है, और नींद मुश्किल हो सकती है। अब से करवट लेकर सोने की सलाह दी जाती है।" },
    baby: { en: "The baby is gaining weight and its lungs are maturing. Movements should continue every day.", hi: "बच्चे का वज़न बढ़ रहा है और फेफड़े परिपक्व हो रहे हैं। हलचल हर दिन होती रहनी चाहिए।" },
    todo: [
      { en: "Get to know your baby's movement pattern. If movements slow down or stop, go to hospital the same day.", hi: "बच्चे की हलचल का पैटर्न समझें। अगर हलचल कम हो या रुक जाए, तो उसी दिन अस्पताल जाएँ।" },
      { en: "Check-ups become more frequent; blood pressure is checked each time.", hi: "जाँचें बार-बार होने लगती हैं; हर बार ब्लड प्रेशर जाँचा जाता है।" },
      { en: "Plan your hospital, transport, money and a birth companion, and keep a bag ready.", hi: "अस्पताल, आने-जाने का साधन, पैसे और साथ रहने वाले व्यक्ति की योजना बनाएँ, और एक बैग तैयार रखें।" },
    ],
  },
  {
    from: 37, to: 45,
    title: { en: "Full term", hi: "पूरे दिन" },
    body: { en: "Your baby could arrive any day. Signs of labour: regular, painful contractions that get closer together, your waters breaking, or a 'show' (mucus with a little blood).", hi: "बच्चा किसी भी दिन आ सकता है। प्रसव के संकेत: नियमित, दर्द वाले संकुचन जो पास-पास आने लगें, पानी की थैली फटना, या खून मिला हुआ चिपचिपा स्राव।" },
    baby: { en: "The baby is ready to be born and usually settles head-down.", hi: "बच्चा जन्म के लिए तैयार है और आमतौर पर सिर नीचे की ओर कर लेता है।" },
    todo: [
      { en: "Go to hospital when labour starts or your waters break. Delivery is free in government hospitals under JSSK.", hi: "प्रसव शुरू होने या पानी की थैली फटने पर अस्पताल जाएँ। JSSK के तहत सरकारी अस्पतालों में प्रसव मुफ़्त है।" },
      { en: "If you go past 40–41 weeks, your doctor will discuss next steps.", hi: "अगर 40–41 हफ़्ते पार हो जाएँ, तो डॉक्टर आगे के कदमों पर बात करेंगे।" },
    ],
  },
];

export const DANGER_SIGNS: { title: L; items: L[]; call: L } = {
  title: { en: "Go to hospital immediately if you have", hi: "इनमें से कुछ भी हो तो तुरंत अस्पताल जाएँ" },
  items: [
    { en: "Bleeding from the vagina", hi: "योनि से ब्लीडिंग" },
    { en: "Severe headache, blurred vision, or sudden swelling of the face or hands", hi: "तेज़ सिरदर्द, धुंधला दिखना, या चेहरे या हाथों में अचानक सूजन" },
    { en: "Fits (convulsions) or fainting", hi: "दौरे पड़ना या बेहोशी" },
    { en: "Severe pain in the belly", hi: "पेट में तेज़ दर्द" },
    { en: "Fever", hi: "बुखार" },
    { en: "Water leaking from the vagina", hi: "योनि से पानी रिसना" },
    { en: "The baby moving less than usual, or not at all", hi: "बच्चे की हलचल सामान्य से कम होना, या बिल्कुल न होना" },
    { en: "Difficulty breathing, or vomiting so much you can't keep anything down", hi: "साँस लेने में तकलीफ़, या इतनी उल्टी कि कुछ भी पेट में न रुके" },
  ],
  call: { en: "In India call 108 for an emergency ambulance. In many states, 102 gives pregnant women free transport to hospital.", hi: "भारत में इमरजेंसी एम्बुलेंस के लिए 108 पर कॉल करें। कई राज्यों में 102 पर गर्भवती महिलाओं को अस्पताल तक मुफ़्त परिवहन मिलता है।" },
};

export const CHECKUPS: L = {
  en: "WHO recommends at least 8 antenatal contacts during pregnancy. Government health facilities offer free check-ups, including on the 9th of every month under PMSMA, and free delivery care under JSSK.",
  hi: "WHO गर्भावस्था के दौरान कम से कम 8 बार जाँच की सलाह देता है। सरकारी स्वास्थ्य केंद्रों पर मुफ़्त जाँच होती है, जिसमें PMSMA के तहत हर महीने की 9 तारीख की जाँच शामिल है, और JSSK के तहत प्रसव की देखभाल मुफ़्त है।",
};

export const HEALTHY_HABITS: L[] = [
  { en: "Eat a varied diet with an extra healthy snack: dal, vegetables, fruit, milk or curd, eggs or paneer.", hi: "विविध खाना और एक अतिरिक्त पौष्टिक नाश्ता: दाल, सब्ज़ियाँ, फल, दूध या दही, अंडे या पनीर।" },
  { en: "No alcohol, smoking, gutkha or other tobacco. Keep tea and coffee to 1–2 cups a day.", hi: "शराब, धूम्रपान, गुटखा या कोई भी तंबाकू नहीं। चाय-कॉफ़ी दिन में 1–2 कप तक।" },
  { en: "Only take medicines, including herbal ones, that your doctor has approved.", hi: "सिर्फ़ डॉक्टर की बताई दवाइयाँ लें, जड़ी-बूटी वाली भी।" },
  { en: "Stay gently active, like walking or prenatal yoga, unless your doctor says otherwise.", hi: "डॉक्टर मना न करें तो हल्का सक्रिय रहें, जैसे टहलना या गर्भावस्था योग।" },
  { en: "Wash fruit and vegetables well and eat food that is cooked through.", hi: "फल और सब्ज़ियाँ अच्छे से धोएँ और पूरी तरह पका खाना खाएँ।" },
];

export const ENDED_BIRTH: L = {
  en: "Congratulations! Your periods may take weeks or months to return, and longer if you breastfeed. You can get pregnant again before your first period, so talk to your doctor about contraception. See a doctor urgently for heavy bleeding, fever, foul-smelling discharge or a severe headache. If you feel low for more than two weeks, that may be postnatal depression; it's common and treatable. Tele-MANAS: 14416.",
  hi: "बधाई हो! पीरियड लौटने में कुछ हफ़्ते या महीने लग सकते हैं, और स्तनपान कराने पर ज़्यादा। पहले पीरियड से पहले भी फिर से गर्भ ठहर सकता है, इसलिए गर्भनिरोधक के बारे में डॉक्टर से बात करें। ज़्यादा ब्लीडिंग, बुखार, बदबूदार डिस्चार्ज या तेज़ सिरदर्द हो तो तुरंत डॉक्टर को दिखाएँ। अगर दो हफ़्ते से ज़्यादा उदासी रहे, तो यह प्रसव के बाद का डिप्रेशन हो सकता है; यह आम है और इसका इलाज हो सकता है। टेली-मानस: 14416।",
};

export const ENDED_LOSS: L = {
  en: "We're so sorry. Whatever happened, it is not your fault. See a doctor urgently if you have heavy bleeding, fever, severe pain or foul-smelling discharge. Your period usually returns in 4–8 weeks. Grief is normal; please lean on people you trust, and you can call Tele-MANAS on 14416 any time.",
  hi: "हमें बहुत दुख है। जो भी हुआ, उसमें आपकी कोई गलती नहीं है। ज़्यादा ब्लीडिंग, बुखार, तेज़ दर्द या बदबूदार डिस्चार्ज हो तो तुरंत डॉक्टर को दिखाएँ। पीरियड आमतौर पर 4–8 हफ़्तों में लौट आता है। दुख होना स्वाभाविक है; अपने भरोसेमंद लोगों का सहारा लें, और आप कभी भी टेली-मानस 14416 पर कॉल कर सकती हैं।",
};

export function stageFor(weeks: number): Stage {
  return STAGES.find((s) => weeks >= s.from && weeks <= s.to) ?? STAGES[STAGES.length - 1];
}
