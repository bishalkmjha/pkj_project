/**
 * Natural remedies, by symptom. Each tip carries an honest evidence label:
 *   good        – supported by several clinical trials or systematic reviews
 *   some        – a few small trials with positive results
 *   traditional – widely used (often in Indian home remedies), little research; safe in normal food amounts
 *
 * Rules for this content: food-based amounts only, no supplement doses, never anything to "bring on"
 * a period, always say when to see a doctor. MUST be reviewed by a gynaecologist before release.
 */
import type { Lang, Mood, Symptom } from "../lib/types";

export type Evidence = "good" | "some" | "traditional";
type L = Record<Lang, string>;

export interface Remedy {
  id: RemedyId;
  icon: string;
  title: L;
  intro: L;
  tips: { evidence: Evidence; text: L }[];
  caution?: L;
  doctor: L;
}

export type RemedyId =
  | "cramps" | "backache" | "headache" | "bloating" | "breastTenderness" | "acne" | "fatigue"
  | "nausea" | "cravings" | "insomnia" | "mood" | "hotFlashes";

/** Which remedy page helps with a logged symptom or mood (null = see a doctor / article instead). */
export const SYMPTOM_REMEDY: Record<Symptom, RemedyId | null> = {
  cramps: "cramps", headache: "headache", backache: "backache", bloating: "bloating",
  breastTenderness: "breastTenderness", acne: "acne", fatigue: "fatigue", nausea: "nausea",
  dizziness: "fatigue", cravings: "cravings", insomnia: "insomnia", excessHair: null,
  discharge: null, hotFlashes: "hotFlashes",
};
export const MOOD_REMEDY: Record<Mood, RemedyId | null> = {
  happy: null, calm: null, sad: "mood", anxious: "mood", irritable: "mood", moodSwings: "mood", low: "fatigue",
};

export const REMEDIES: Remedy[] = [
  {
    id: "cramps",
    icon: "🔥",
    title: { en: "Period cramps", hi: "पीरियड की ऐंठन" },
    intro: {
      en: "Cramps happen when the uterus contracts to shed its lining, driven by chemicals called prostaglandins. They are usually worst in the first 1–3 days.",
      hi: "ऐंठन तब होती है जब गर्भाशय अपनी परत बाहर निकालने के लिए सिकुड़ता है। यह प्रोस्टाग्लैंडिन नाम के रसायनों की वजह से होता है। आमतौर पर पहले 1–3 दिन सबसे ज़्यादा होती है।",
    },
    tips: [
      { evidence: "good", text: { en: "Heat: a hot water bottle or heating pad on the lower belly or back. In studies it worked about as well as common painkillers.", hi: "सिकाई: पेट के निचले हिस्से या कमर पर गर्म पानी की बोतल या हीटिंग पैड। अध्ययनों में यह दर्द की आम दवाइयों जितना असरदार पाया गया।" } },
      { evidence: "good", text: { en: "Gentle movement: walking, stretching or yoga poses like child's pose and cat-cow. Regular exercise through the month also reduces period pain.", hi: "हल्की हलचल: टहलना, स्ट्रेचिंग, या बालासन और मार्जरी आसन जैसे योग। पूरे महीने नियमित व्यायाम से भी पीरियड का दर्द कम होता है।" } },
      { evidence: "some", text: { en: "Ginger tea: boil a few slices of fresh ginger in water for 5–10 minutes. Several small trials found it eases cramps when started at the beginning of the period.", hi: "अदरक की चाय: ताज़ी अदरक के कुछ टुकड़े पानी में 5–10 मिनट उबालें। कई छोटे अध्ययनों में पीरियड की शुरुआत से लेने पर ऐंठन में आराम मिला।" } },
      { evidence: "some", text: { en: "Fennel (saunf) water or tea: small trials found fennel reduced period pain.", hi: "सौंफ का पानी या चाय: छोटे अध्ययनों में सौंफ से पीरियड का दर्द कम हुआ।" } },
      { evidence: "some", text: { en: "Gentle belly massage in circles, with a little warm oil.", hi: "थोड़े गुनगुने तेल से पेट पर गोल-गोल हल्की मालिश।" } },
      { evidence: "traditional", text: { en: "Ajwain (carom seed) water, warm fluids, and resting with your knees bent or a pillow under them.", hi: "अजवाइन का पानी, गुनगुने पेय, और घुटने मोड़कर या उनके नीचे तकिया रखकर आराम।" } },
    ],
    caution: {
      en: "A pharmacist or doctor can tell you which painkiller is safe for you. Painkillers like ibuprofen work best when taken early, with food.",
      hi: "कौन-सी दर्द की दवा आपके लिए सुरक्षित है, यह फ़ार्मासिस्ट या डॉक्टर बता सकते हैं। आइबुप्रोफ़ेन जैसी दवाइयाँ जल्दी और खाने के साथ लेने पर ज़्यादा असर करती हैं।",
    },
    doctor: {
      en: "See a doctor if pain stops you from daily life, gets worse each month, doesn't improve with painkillers, or happens during sex. These can be signs of endometriosis or fibroids.",
      hi: "अगर दर्द रोज़मर्रा का काम रोक दे, हर महीने बढ़ता जाए, दवा से आराम न मिले, या सेक्स के दौरान हो, तो डॉक्टर को दिखाएँ। ये एंडोमेट्रियोसिस या फ़ाइब्रॉइड के संकेत हो सकते हैं।",
    },
  },
  {
    id: "backache",
    icon: "🧘",
    title: { en: "Lower back pain", hi: "कमर का दर्द" },
    intro: {
      en: "Period pain often spreads to the lower back, because the same nerves serve the uterus and the back.",
      hi: "पीरियड का दर्द अक्सर कमर तक फैलता है, क्योंकि गर्भाशय और कमर की नसें एक जैसी होती हैं।",
    },
    tips: [
      { evidence: "good", text: { en: "Heat on the lower back for 15–20 minutes at a time.", hi: "कमर पर एक बार में 15–20 मिनट सिकाई।" } },
      { evidence: "some", text: { en: "Gentle stretches: child's pose, cat-cow, and lying on your back hugging your knees.", hi: "हल्की स्ट्रेचिंग: बालासन, मार्जरी आसन, और पीठ के बल लेटकर घुटनों को सीने से लगाना।" } },
      { evidence: "some", text: { en: "Massage of the lower back by someone you trust, or with a tennis ball against a wall.", hi: "किसी भरोसेमंद व्यक्ति से कमर की मालिश, या दीवार और कमर के बीच टेनिस बॉल रखकर हल्का दबाव।" } },
      { evidence: "traditional", text: { en: "Sleeping on your side with a pillow between your knees.", hi: "करवट लेकर, घुटनों के बीच तकिया रखकर सोना।" } },
    ],
    doctor: {
      en: "See a doctor if back pain is severe, happens outside your period, or comes with fever or pain when passing urine.",
      hi: "अगर कमर दर्द बहुत तेज़ हो, पीरियड के अलावा भी हो, या बुखार या पेशाब में जलन के साथ हो, तो डॉक्टर को दिखाएँ।",
    },
  },
  {
    id: "headache",
    icon: "🤕",
    title: { en: "Headaches & period migraine", hi: "सिरदर्द और पीरियड माइग्रेन" },
    intro: {
      en: "The drop in estrogen just before a period can trigger headaches or migraine in some people.",
      hi: "पीरियड से ठीक पहले एस्ट्रोजन घटने से कुछ लोगों को सिरदर्द या माइग्रेन हो सकता है।",
    },
    tips: [
      { evidence: "good", text: { en: "Regular sleep and meals: skipped meals and poor sleep are common triggers.", hi: "नियमित नींद और खाना: खाना छोड़ना और कम नींद आम कारण हैं।" } },
      { evidence: "some", text: { en: "Drink enough water through the day; dehydration makes headaches worse.", hi: "दिनभर पर्याप्त पानी पिएँ; पानी की कमी से सिरदर्द बढ़ता है।" } },
      { evidence: "some", text: { en: "Magnesium-rich foods: pumpkin and sunflower seeds, almonds, spinach, bananas, whole grains. Low magnesium is linked to menstrual migraine.", hi: "मैग्नीशियम वाले खाने: कद्दू और सूरजमुखी के बीज, बादाम, पालक, केला, साबुत अनाज। मैग्नीशियम की कमी पीरियड माइग्रेन से जुड़ी है।" } },
      { evidence: "some", text: { en: "A cold pack on the forehead or back of the neck, and resting in a dark, quiet room.", hi: "माथे या गर्दन के पीछे ठंडी पट्टी, और अंधेरे, शांत कमरे में आराम।" } },
      { evidence: "traditional", text: { en: "Keep caffeine steady. Big changes in how much tea or coffee you drink can trigger headaches.", hi: "चाय-कॉफ़ी की मात्रा एक जैसी रखें। अचानक ज़्यादा या कम करने से सिरदर्द हो सकता है।" } },
    ],
    doctor: {
      en: "Get urgent help for a sudden, severe 'worst ever' headache, or a headache with weakness, confusion, vision loss or a stiff neck. See a doctor if migraines are frequent; if you have migraine with aura, ask before taking estrogen birth control pills.",
      hi: "अचानक, अब तक का सबसे तेज़ सिरदर्द हो, या सिरदर्द के साथ कमज़ोरी, उलझन, दिखना बंद होना या गर्दन अकड़ना हो, तो तुरंत मदद लें। बार-बार माइग्रेन हो तो डॉक्टर को दिखाएँ; अगर माइग्रेन से पहले रोशनी या धब्बे (ऑरा) दिखते हैं, तो एस्ट्रोजन वाली गर्भनिरोधक गोलियाँ लेने से पहले डॉक्टर से पूछें।",
    },
  },
  {
    id: "bloating",
    icon: "🎈",
    title: { en: "Bloating", hi: "पेट फूलना" },
    intro: {
      en: "Hormone changes before and during a period make the body hold more water and slow digestion.",
      hi: "पीरियड से पहले और दौरान हार्मोन बदलने से शरीर में पानी रुकता है और पाचन धीमा होता है।",
    },
    tips: [
      { evidence: "some", text: { en: "Eat less salt and fewer packaged or fried snacks in the week before your period.", hi: "पीरियड से पहले वाले हफ़्ते में नमक, पैकेट वाले और तले हुए स्नैक्स कम खाएँ।" } },
      { evidence: "some", text: { en: "Drink more water, not less. It helps the body let go of extra fluid.", hi: "पानी कम नहीं, ज़्यादा पिएँ। इससे शरीर अतिरिक्त पानी छोड़ता है।" } },
      { evidence: "some", text: { en: "Potassium-rich foods: bananas, coconut water, curd, tomatoes, spinach.", hi: "पोटैशियम वाले खाने: केला, नारियल पानी, दही, टमाटर, पालक।" } },
      { evidence: "some", text: { en: "A short walk after meals helps digestion and gas.", hi: "खाने के बाद थोड़ी देर टहलने से पाचन और गैस में मदद मिलती है।" } },
      { evidence: "traditional", text: { en: "Saunf (fennel), ajwain or jeera (cumin) water after meals; avoid fizzy drinks.", hi: "खाने के बाद सौंफ, अजवाइन या जीरे का पानी; सोडा वाले पेय से बचें।" } },
    ],
    doctor: {
      en: "See a doctor if bloating lasts most of the month, keeps getting worse, or comes with weight loss, a feeling of fullness after small meals, or pain. Ongoing bloating should be checked.",
      hi: "अगर पेट महीने के ज़्यादातर दिन फूला रहे, बढ़ता जाए, या वज़न घटने, थोड़ा खाने पर पेट भरा लगने, या दर्द के साथ हो, तो डॉक्टर को दिखाएँ। लगातार पेट फूलने की जाँच ज़रूरी है।",
    },
  },
  {
    id: "breastTenderness",
    icon: "💗",
    title: { en: "Breast tenderness", hi: "स्तनों में दर्द" },
    intro: {
      en: "Breasts often feel swollen or sore in the week before a period because of rising progesterone. It goes away once the period starts.",
      hi: "पीरियड से पहले वाले हफ़्ते में प्रोजेस्टेरोन बढ़ने से स्तन अक्सर भारी या दर्द वाले लगते हैं। पीरियड शुरू होने पर यह ठीक हो जाता है।",
    },
    tips: [
      { evidence: "some", text: { en: "Wear a well-fitting, supportive bra, including a soft one at night if it helps.", hi: "सही नाप की, सहारा देने वाली ब्रा पहनें; आराम मिले तो रात में मुलायम ब्रा।" } },
      { evidence: "traditional", text: { en: "Warm or cool compress, whichever feels better.", hi: "गर्म या ठंडी सिकाई, जो भी ज़्यादा आराम दे।" } },
      { evidence: "traditional", text: { en: "Cut down on salt and caffeine in the days before your period.", hi: "पीरियड से पहले के दिनों में नमक और कैफ़ीन कम करें।" } },
    ],
    doctor: {
      en: "See a doctor if you feel a new lump, notice nipple discharge, skin dimpling or redness, or pain in one spot that doesn't follow your cycle.",
      hi: "अगर कोई नई गाँठ महसूस हो, निप्पल से कुछ निकले, त्वचा में गड्ढा या लाली दिखे, या एक ही जगह दर्द हो जो चक्र के साथ न बदले, तो डॉक्टर को दिखाएँ।",
    },
  },
  {
    id: "acne",
    icon: "✨",
    title: { en: "Period acne", hi: "पीरियड के मुंहासे" },
    intro: {
      en: "Breakouts on the chin and jaw before a period are common. Hormones increase oil production.",
      hi: "पीरियड से पहले ठोड़ी और जबड़े पर मुंहासे आम हैं। हार्मोन से त्वचा में तेल बढ़ता है।",
    },
    tips: [
      { evidence: "good", text: { en: "Wash your face twice a day with a gentle cleanser; don't scrub hard.", hi: "दिन में दो बार हल्के फ़ेसवॉश से चेहरा धोएँ; ज़ोर से न रगड़ें।" } },
      { evidence: "good", text: { en: "Don't pick or squeeze spots; it causes scars and dark marks.", hi: "मुंहासे न नोचें, न दबाएँ; इससे निशान और दाग पड़ते हैं।" } },
      { evidence: "some", text: { en: "Choose 'non-comedogenic' (won't block pores) moisturiser, sunscreen and makeup.", hi: "'नॉन-कॉमेडोजेनिक' (रोमछिद्र बंद न करने वाले) मॉइस्चराइज़र, सनस्क्रीन और मेकअप चुनें।" } },
      { evidence: "some", text: { en: "Fewer sugary foods and refined flour (maida); more vegetables, dal and whole grains.", hi: "मीठा और मैदा कम; सब्ज़ियाँ, दाल और साबुत अनाज ज़्यादा।" } },
    ],
    caution: {
      en: "Avoid putting toothpaste, lemon juice or baking soda on your skin. They irritate and can burn it.",
      hi: "त्वचा पर टूथपेस्ट, नींबू का रस या बेकिंग सोडा न लगाएँ। इनसे जलन होती है और त्वचा जल सकती है।",
    },
    doctor: {
      en: "See a doctor or dermatologist if acne is painful or leaves scars, or comes with irregular periods or extra hair growth, which can be signs of PCOS.",
      hi: "अगर मुंहासे दर्द वाले हों या निशान छोड़ें, या अनियमित पीरियड या ज़्यादा बाल उगने के साथ हों, तो डॉक्टर या त्वचा विशेषज्ञ को दिखाएँ। ये PCOS के संकेत हो सकते हैं।",
    },
  },
  {
    id: "fatigue",
    icon: "🔋",
    title: { en: "Tiredness & low energy", hi: "थकान और कम ऊर्जा" },
    intro: {
      en: "Energy often dips before and during a period. Losing blood every month can also lower iron, which is a common cause of tiredness in women.",
      hi: "पीरियड से पहले और दौरान ऊर्जा अक्सर कम होती है। हर महीने खून जाने से आयरन भी घट सकता है, जो महिलाओं में थकान की आम वजह है।",
    },
    tips: [
      { evidence: "good", text: { en: "Iron-rich foods: green leafy vegetables, dal, chana, rajma, eggs, fish and meat.", hi: "आयरन वाले खाने: हरी पत्तेदार सब्ज़ियाँ, दाल, चना, राजमा, अंडे, मछली और मांस।" } },
      { evidence: "good", text: { en: "Eat iron foods with vitamin C (lemon, amla, orange, guava, tomato), and keep tea or coffee an hour away from meals.", hi: "आयरन वाले खाने के साथ विटामिन C (नींबू, आँवला, संतरा, अमरूद, टमाटर) लें, और चाय-कॉफ़ी खाने से एक घंटा दूर रखें।" } },
      { evidence: "good", text: { en: "7–9 hours of sleep, at regular times.", hi: "रोज़ एक तय समय पर 7–9 घंटे की नींद।" } },
      { evidence: "some", text: { en: "Light exercise like a 20-minute walk often raises energy more than resting.", hi: "20 मिनट टहलने जैसा हल्का व्यायाम अक्सर आराम से ज़्यादा ऊर्जा देता है।" } },
    ],
    caution: {
      en: "Don't start high-dose iron tablets without advice. Too much iron can be harmful.",
      hi: "बिना सलाह के ज़्यादा मात्रा वाली आयरन की गोलियाँ शुरू न करें। ज़्यादा आयरन नुकसानदायक हो सकता है।",
    },
    doctor: {
      en: "See a doctor for a haemoglobin test if you are often tired, breathless, dizzy or pale, especially with heavy periods. Thyroid problems can also cause tiredness.",
      hi: "अगर अक्सर थकान, साँस फूलना, चक्कर या पीलापन रहे, खासकर ज़्यादा ब्लीडिंग के साथ, तो हीमोग्लोबिन की जाँच के लिए डॉक्टर को दिखाएँ। थायरॉइड से भी थकान हो सकती है।",
    },
  },
  {
    id: "nausea",
    icon: "🍋",
    title: { en: "Nausea", hi: "जी मिचलाना" },
    intro: {
      en: "The same prostaglandins that cause cramps can upset the stomach during a period.",
      hi: "जो प्रोस्टाग्लैंडिन ऐंठन करते हैं, वही पीरियड के दौरान पेट भी खराब कर सकते हैं।",
    },
    tips: [
      { evidence: "good", text: { en: "Ginger: ginger tea or a small piece of fresh ginger. Ginger is one of the best-studied natural remedies for nausea.", hi: "अदरक: अदरक की चाय या ताज़ी अदरक का छोटा टुकड़ा। जी मिचलाने के लिए अदरक सबसे ज़्यादा अध्ययन किए गए प्राकृतिक उपायों में से है।" } },
      { evidence: "some", text: { en: "Small, plain meals often, instead of large ones. Dry toast, rice or khichdi are easy on the stomach.", hi: "बड़े खाने की जगह बार-बार थोड़ा सादा खाना। सूखा टोस्ट, चावल या खिचड़ी पेट के लिए हल्के होते हैं।" } },
      { evidence: "traditional", text: { en: "Sip water, nimbu pani or coconut water slowly; fresh air and mint can help.", hi: "पानी, नींबू पानी या नारियल पानी धीरे-धीरे पिएँ; ताज़ी हवा और पुदीना मदद कर सकते हैं।" } },
    ],
    doctor: {
      en: "If your period is late, take a pregnancy test. See a doctor if you can't keep fluids down or vomiting lasts more than a day.",
      hi: "अगर पीरियड देर से है, तो प्रेगनेंसी टेस्ट करें। अगर कुछ पीते ही उल्टी हो जाए या उल्टी एक दिन से ज़्यादा चले, तो डॉक्टर को दिखाएँ।",
    },
  },
  {
    id: "cravings",
    icon: "🍫",
    title: { en: "Food cravings", hi: "खाने की तलब" },
    intro: {
      en: "Cravings for sweet or salty food before a period are normal and linked to hormone and blood sugar changes.",
      hi: "पीरियड से पहले मीठा या नमकीन खाने की तलब सामान्य है और हार्मोन व ब्लड शुगर में बदलाव से जुड़ी है।",
    },
    tips: [
      { evidence: "some", text: { en: "Regular meals with protein and fibre (dal, paneer, eggs, sprouts, whole grains) keep blood sugar steady and cravings lower.", hi: "प्रोटीन और फ़ाइबर वाला नियमित खाना (दाल, पनीर, अंडे, अंकुरित अनाज, साबुत अनाज) ब्लड शुगर स्थिर रखता है और तलब कम करता है।" } },
      { evidence: "traditional", text: { en: "Satisfy a sweet craving with fruit, a few dates, or a small piece of dark chocolate.", hi: "मीठे की तलब फल, कुछ खजूर, या डार्क चॉकलेट के छोटे टुकड़े से पूरी करें।" } },
      { evidence: "traditional", text: { en: "Keep roasted chana, nuts or makhana handy for salty cravings.", hi: "नमकीन की तलब के लिए भुना चना, मेवे या मखाने पास रखें।" } },
    ],
    doctor: {
      en: "Be kind to yourself; cravings are not a lack of willpower. Talk to a doctor if eating feels out of control or causes you distress.",
      hi: "खुद पर सख़्त न हों; तलब इच्छाशक्ति की कमी नहीं है। अगर खाना बेकाबू लगे या परेशानी दे, तो डॉक्टर से बात करें।",
    },
  },
  {
    id: "insomnia",
    icon: "🌙",
    title: { en: "Poor sleep", hi: "नींद ठीक से न आना" },
    intro: {
      en: "Body temperature rises after ovulation and hormones shift before a period, so sleep is often lighter at that time.",
      hi: "ओव्यूलेशन के बाद शरीर का तापमान बढ़ता है और पीरियड से पहले हार्मोन बदलते हैं, इसलिए उस समय नींद अक्सर कच्ची होती है।",
    },
    tips: [
      { evidence: "good", text: { en: "Go to bed and wake up at the same time every day, even on weekends.", hi: "रोज़, छुट्टी के दिन भी, एक ही समय पर सोएँ और उठें।" } },
      { evidence: "good", text: { en: "Keep your room cool, dark and quiet; put the phone away 30–60 minutes before sleep.", hi: "कमरा ठंडा, अंधेरा और शांत रखें; सोने से 30–60 मिनट पहले फ़ोन दूर रखें।" } },
      { evidence: "some", text: { en: "No tea, coffee or cola after mid-afternoon.", hi: "दोपहर के बाद चाय, कॉफ़ी या कोला न लें।" } },
      { evidence: "traditional", text: { en: "A warm drink like haldi doodh (turmeric milk) or chamomile tea, and a few slow, deep breaths in bed.", hi: "हल्दी वाला दूध या कैमोमाइल चाय जैसा गुनगुना पेय, और बिस्तर पर कुछ धीमी, गहरी साँसें।" } },
    ],
    doctor: {
      en: "Talk to a doctor if poor sleep lasts for weeks, or comes with low mood, heavy snoring or night sweats.",
      hi: "अगर कई हफ़्तों तक नींद खराब रहे, या उदासी, तेज़ खर्राटे या रात में पसीने के साथ हो, तो डॉक्टर से बात करें।",
    },
  },
  {
    id: "mood",
    icon: "🌈",
    title: { en: "Mood changes & PMS", hi: "मूड में बदलाव और PMS" },
    intro: {
      en: "Feeling sad, anxious or irritable before a period is common, and real. It is caused by how the brain responds to hormone changes.",
      hi: "पीरियड से पहले उदासी, बेचैनी या चिड़चिड़ापन आम है, और असली है। यह इस वजह से होता है कि दिमाग हार्मोन के बदलाव पर कैसे प्रतिक्रिया करता है।",
    },
    tips: [
      { evidence: "good", text: { en: "Regular exercise, especially brisk walking, dancing or yoga, improves PMS mood symptoms.", hi: "नियमित व्यायाम, खासकर तेज़ चलना, डांस या योग, PMS के मूड लक्षणों में सुधार करता है।" } },
      { evidence: "good", text: { en: "Calcium-rich foods every day: milk, curd, paneer, ragi, sesame (til), green leafy vegetables. Calcium is one of the best-studied ways to reduce PMS.", hi: "रोज़ कैल्शियम वाले खाने: दूध, दही, पनीर, रागी, तिल, हरी पत्तेदार सब्ज़ियाँ। PMS कम करने के लिए कैल्शियम सबसे ज़्यादा अध्ययन किए गए उपायों में से है।" } },
      { evidence: "some", text: { en: "Slow breathing: breathe in for 4 counts, out for 6, for 5 minutes. Mindfulness and yoga also help anxiety.", hi: "धीमी साँस: 4 गिनती तक साँस लें, 6 तक छोड़ें, 5 मिनट तक। माइंडफ़ुलनेस और योग भी बेचैनी में मदद करते हैं।" } },
      { evidence: "some", text: { en: "Foods with vitamin B6: bananas, chickpeas, potatoes, peanuts, fish.", hi: "विटामिन B6 वाले खाने: केला, छोले, आलू, मूंगफली, मछली।" } },
      { evidence: "traditional", text: { en: "Plan lighter days before your period when you can, and tell people close to you what helps.", hi: "जहाँ हो सके, पीरियड से पहले हल्के दिन रखें, और अपने करीबी लोगों को बताएँ कि आपको किससे मदद मिलती है।" } },
    ],
    doctor: {
      en: "If mood changes are severe or affect your studies, work or relationships, talk to a doctor; this may be PMDD, which can be treated. If you ever think of harming yourself, call Tele-MANAS on 14416 (free, 24×7, India) or your local emergency number right away.",
      hi: "अगर मूड में बदलाव बहुत ज़्यादा हों या पढ़ाई, काम या रिश्तों पर असर डालें, तो डॉक्टर से बात करें; यह PMDD हो सकता है, जिसका इलाज हो सकता है। अगर कभी खुद को नुकसान पहुँचाने का ख़याल आए, तो तुरंत टेली-मानस 14416 (मुफ़्त, 24 घंटे, भारत) या अपने स्थानीय इमरजेंसी नंबर पर कॉल करें।",
    },
  },
  {
    id: "hotFlashes",
    icon: "🌡️",
    title: { en: "Hot flashes", hi: "अचानक गर्मी लगना" },
    intro: {
      en: "Sudden waves of heat and sweating are common in perimenopause, usually from the 40s, as estrogen levels change.",
      hi: "अचानक गर्मी और पसीना पेरिमेनोपॉज़ में आम है, आमतौर पर 40 की उम्र के बाद, जब एस्ट्रोजन का स्तर बदलता है।",
    },
    tips: [
      { evidence: "some", text: { en: "Dress in layers and cotton; keep a fan and cold water nearby.", hi: "परतों में और सूती कपड़े पहनें; पंखा और ठंडा पानी पास रखें।" } },
      { evidence: "some", text: { en: "Notice your triggers. Spicy food, hot drinks, alcohol and stress are common ones.", hi: "अपने ट्रिगर पहचानें। तीखा खाना, गर्म पेय, शराब और तनाव आम ट्रिगर हैं।" } },
      { evidence: "some", text: { en: "Slow, paced breathing when a flash starts; regular exercise and a healthy weight help too.", hi: "गर्मी शुरू होते ही धीमी, नियमित साँस; नियमित व्यायाम और सही वज़न भी मदद करते हैं।" } },
      { evidence: "some", text: { en: "Soy foods like soybean, tofu and soy milk may reduce flashes a little for some women.", hi: "सोयाबीन, टोफ़ू और सोया दूध जैसे खाने कुछ महिलाओं में गर्मी लगना थोड़ा कम कर सकते हैं।" } },
    ],
    doctor: {
      en: "Talk to a doctor if hot flashes disturb your sleep or daily life; safe, effective treatments exist. Hot flashes in your 20s or 30s should always be checked.",
      hi: "अगर गर्मी लगने से नींद या रोज़मर्रा की ज़िंदगी पर असर पड़े, तो डॉक्टर से बात करें; सुरक्षित और असरदार इलाज मौजूद हैं। 20 या 30 की उम्र में ऐसा हो तो ज़रूर जाँच करवाएँ।",
    },
  },
];

export const EVIDENCE_LABEL: Record<Evidence, L> = {
  good: { en: "Good evidence", hi: "अच्छे प्रमाण" },
  some: { en: "Some evidence", hi: "कुछ प्रमाण" },
  traditional: { en: "Traditional, little research", hi: "पारंपरिक, कम शोध" },
};

export const REMEDY_DISCLAIMER: L = {
  en: "Natural doesn't always mean safe for everyone. If you are pregnant, breastfeeding, have a health condition or take medicines, check with a doctor first. These tips ease symptoms; they don't treat the cause.",
  hi: "प्राकृतिक का मतलब हमेशा सबके लिए सुरक्षित नहीं होता। अगर आप गर्भवती हैं, स्तनपान करा रही हैं, कोई बीमारी है या दवाइयाँ लेती हैं, तो पहले डॉक्टर से पूछें। ये उपाय लक्षणों में आराम देते हैं; कारण का इलाज नहीं करते।",
};

export function remedyById(id: RemedyId): Remedy {
  return REMEDIES.find((r) => r.id === id)!;
}
