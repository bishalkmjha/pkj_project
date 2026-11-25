/**
 * Phase-by-phase wellness guide. These are general wellbeing ideas. Research on "cycle syncing" is
 * limited, so the text says "many people" and "listen to your body" rather than making promises.
 */
import type { Lang } from "../lib/types";

type L = Record<Lang, string>;
export type GuidePhase = "period" | "follicular" | "fertile" | "luteal";

export interface PhaseGuide {
  id: GuidePhase;
  icon: string;
  days: L;
  hormones: L;
  body: L;
  food: L[];
  move: L[];
  care: L[];
}

export const PHASE_GUIDES: PhaseGuide[] = [
  {
    id: "period",
    icon: "🩸",
    days: { en: "About days 1–5", hi: "लगभग दिन 1–5" },
    hormones: { en: "Estrogen and progesterone are at their lowest.", hi: "एस्ट्रोजन और प्रोजेस्टेरोन सबसे कम होते हैं।" },
    body: {
      en: "The uterus sheds its lining. You may feel tired, crampy or want to rest more. That's normal.",
      hi: "गर्भाशय अपनी परत बाहर निकालता है। थकान, ऐंठन या ज़्यादा आराम की ज़रूरत महसूस हो सकती है। यह सामान्य है।",
    },
    food: [
      { en: "Iron-rich foods with vitamin C to replace blood loss: palak, dal, chana, eggs with lemon or amla.", hi: "खून की कमी पूरी करने के लिए विटामिन C के साथ आयरन वाले खाने: पालक, दाल, चना, अंडे, नींबू या आँवले के साथ।" },
      { en: "Warm, easy meals like khichdi, soups and dal; ginger tea for cramps.", hi: "गर्म, हल्का खाना जैसे खिचड़ी, सूप और दाल; ऐंठन के लिए अदरक की चाय।" },
      { en: "Plenty of water and fluids.", hi: "भरपूर पानी और तरल पदार्थ।" },
    ],
    move: [
      { en: "Gentle walking, stretching or restful yoga. Exercise is safe during a period; do what feels right.", hi: "हल्का टहलना, स्ट्रेचिंग या आराम वाला योग। पीरियड में व्यायाम सुरक्षित है; जो ठीक लगे वही करें।" },
    ],
    care: [
      { en: "Change pads or tampons every 4–8 hours; use heat for cramps.", hi: "हर 4–8 घंटे में पैड या टैम्पोन बदलें; ऐंठन के लिए सिकाई करें।" },
      { en: "Bathing and washing your hair are completely safe, and help you feel better.", hi: "नहाना और बाल धोना पूरी तरह सुरक्षित है, और इससे अच्छा महसूस होता है।" },
      { en: "Note your flow and pain in Sakhi; it helps your doctor.", hi: "सखी में अपनी ब्लीडिंग और दर्द दर्ज करें; इससे डॉक्टर को मदद मिलती है।" },
    ],
  },
  {
    id: "follicular",
    icon: "🌱",
    days: { en: "After your period until about a week before ovulation", hi: "पीरियड के बाद से ओव्यूलेशन से लगभग एक हफ़्ता पहले तक" },
    hormones: { en: "Estrogen rises steadily.", hi: "एस्ट्रोजन धीरे-धीरे बढ़ता है।" },
    body: {
      en: "Many people feel more energy, better mood and clearer skin in this phase.",
      hi: "इस चरण में कई लोग ज़्यादा ऊर्जा, बेहतर मूड और साफ़ त्वचा महसूस करते हैं।",
    },
    food: [
      { en: "Balanced meals with protein (dal, eggs, paneer, sprouts), vegetables and whole grains.", hi: "प्रोटीन (दाल, अंडे, पनीर, अंकुरित अनाज), सब्ज़ियों और साबुत अनाज वाला संतुलित खाना।" },
      { en: "Keep up iron-rich foods after your period.", hi: "पीरियड के बाद भी आयरन वाले खाने जारी रखें।" },
    ],
    move: [
      { en: "A good time for more active workouts, sports, running or trying something new, if you feel like it.", hi: "अगर मन हो, तो ज़्यादा सक्रिय व्यायाम, खेल, दौड़ या कुछ नया आज़माने का अच्छा समय।" },
    ],
    care: [
      { en: "Good time for a monthly breast self-check, a few days after your period ends.", hi: "पीरियड खत्म होने के कुछ दिन बाद हर महीने स्तनों की खुद जाँच का अच्छा समय।" },
      { en: "Discharge is usually low or sticky now, becoming creamier as ovulation nears.", hi: "इस समय डिस्चार्ज आमतौर पर कम या चिपचिपा होता है, और ओव्यूलेशन पास आने पर क्रीमी होने लगता है।" },
    ],
  },
  {
    id: "fertile",
    icon: "🌼",
    days: { en: "About 5 days before ovulation to the day after", hi: "ओव्यूलेशन से लगभग 5 दिन पहले से अगले दिन तक" },
    hormones: { en: "Estrogen peaks, then LH surges to release an egg.", hi: "एस्ट्रोजन सबसे ज़्यादा होता है, फिर LH हार्मोन बढ़कर अंडा बाहर निकालता है।" },
    body: {
      en: "Discharge often becomes clear, slippery and stretchy, like raw egg white. Some people feel a twinge on one side of the lower belly, or a higher sex drive.",
      hi: "डिस्चार्ज अक्सर साफ़, फिसलन वाला और खिंचने वाला हो जाता है, कच्चे अंडे की सफ़ेदी जैसा। कुछ लोगों को पेट के निचले हिस्से में एक तरफ़ हल्की चुभन या सेक्स की ज़्यादा इच्छा महसूस होती है।",
    },
    food: [
      { en: "Stay hydrated, and eat folate-rich foods (green leafy vegetables, dal, citrus). Folate is important if you might become pregnant.", hi: "पानी पीती रहें, और फ़ोलेट वाले खाने (हरी पत्तेदार सब्ज़ियाँ, दाल, खट्टे फल) खाएँ। गर्भ ठहरने की संभावना हो तो फ़ोलेट ज़रूरी है।" },
    ],
    move: [
      { en: "Energy is often high. Enjoy whatever exercise you like.", hi: "ऊर्जा अक्सर ज़्यादा होती है। जो व्यायाम पसंद हो, करें।" },
    ],
    care: [
      { en: "This is when pregnancy is most likely. If you don't want to become pregnant, use reliable contraception every time; app predictions are not birth control.", hi: "इसी समय गर्भ ठहरने की संभावना सबसे ज़्यादा होती है। अगर गर्भ नहीं चाहतीं, तो हर बार भरोसेमंद गर्भनिरोधक इस्तेमाल करें; ऐप के अनुमान गर्भनिरोधक नहीं हैं।" },
    ],
  },
  {
    id: "luteal",
    icon: "🍂",
    days: { en: "After ovulation until your next period (about 14 days)", hi: "ओव्यूलेशन के बाद से अगले पीरियड तक (लगभग 14 दिन)" },
    hormones: { en: "Progesterone rises, then both hormones drop if there's no pregnancy.", hi: "प्रोजेस्टेरोन बढ़ता है, फिर गर्भ न ठहरने पर दोनों हार्मोन घटते हैं।" },
    body: {
      en: "In the last week you may notice PMS: bloating, tender breasts, cravings, acne, tiredness or mood changes.",
      hi: "आख़िरी हफ़्ते में PMS दिख सकता है: पेट फूलना, स्तनों में दर्द, खाने की तलब, मुंहासे, थकान या मूड में बदलाव।",
    },
    food: [
      { en: "Calcium-rich foods (milk, curd, ragi, til) and magnesium-rich foods (nuts, seeds, bananas, spinach) can ease PMS.", hi: "कैल्शियम वाले (दूध, दही, रागी, तिल) और मैग्नीशियम वाले (मेवे, बीज, केला, पालक) खाने PMS में आराम दे सकते हैं।" },
      { en: "Less salt, sugar and caffeine in the last week; regular meals to steady cravings.", hi: "आख़िरी हफ़्ते में नमक, चीनी और कैफ़ीन कम; तलब काबू में रखने के लिए नियमित खाना।" },
    ],
    move: [
      { en: "Moderate exercise like walking, cycling, swimming or yoga helps mood and bloating.", hi: "टहलना, साइकिल, तैराकी या योग जैसा मध्यम व्यायाम मूड और पेट फूलने में मदद करता है।" },
    ],
    care: [
      { en: "Prioritise sleep and be gentle with yourself. Log your mood to spot patterns.", hi: "नींद को प्राथमिकता दें और खुद के साथ नरमी बरतें। पैटर्न पहचानने के लिए मूड दर्ज करें।" },
      { en: "Keep pads or your cup ready as your period approaches.", hi: "पीरियड पास आने पर पैड या कप तैयार रखें।" },
    ],
  },
];

export const PHASE_NOTE: L = {
  en: "Every body is different and research on phase-based routines is still limited. Use these as gentle ideas and listen to your body.",
  hi: "हर शरीर अलग होता है और चरण के हिसाब से दिनचर्या पर शोध अभी सीमित है। इन्हें हल्के सुझाव समझें और अपने शरीर की सुनें।",
};
