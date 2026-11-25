/**
 * Health education articles. Plain-language summaries of mainstream guidance (WHO, ACOG, NHS, FOGSI).
 * MUST be reviewed by a qualified gynaecologist before public release.
 */
import type { Lang } from "../lib/types";

interface Text { title: string; summary: string; body: string[] }
export interface Article { id: string; icon: string; text: Record<Lang, Text> }

export const ARTICLES: Article[] = [
  {
    id: "cycle-basics",
    icon: "🌸",
    text: {
      en: {
        title: "Understanding your cycle",
        summary: "What happens in each phase, and what counts as normal.",
        body: [
          "Your menstrual cycle starts on the first day of your period and ends the day before your next period starts.",
          "For most adults a cycle is 21–35 days long, and a period lasts 2–7 days. In the first few years after periods start, and in the years before menopause, cycles are often less regular.",
          "Period (menstrual phase): the lining of the uterus is shed as bleeding.",
          "Follicular phase: estrogen rises and an egg matures in the ovary.",
          "Ovulation: an egg is released, usually about 14 days before the next period, not necessarily on day 14.",
          "Luteal phase: progesterone rises. If there is no pregnancy, hormone levels drop and the next period begins.",
          "Small changes from month to month are normal. Logging every period helps you and your doctor see what is normal for you.",
        ],
      },
      hi: {
        title: "अपने चक्र को समझें",
        summary: "हर चरण में क्या होता है, और क्या सामान्य माना जाता है।",
        body: [
          "आपका माहवारी चक्र पीरियड के पहले दिन से शुरू होता है और अगले पीरियड शुरू होने से एक दिन पहले खत्म होता है।",
          "ज़्यादातर वयस्कों में चक्र 21–35 दिन का होता है, और पीरियड 2–7 दिन चलता है। पीरियड शुरू होने के शुरुआती सालों में और मेनोपॉज़ से पहले के सालों में चक्र अक्सर कम नियमित होते हैं।",
          "पीरियड (माहवारी चरण): गर्भाशय की परत ब्लीडिंग के रूप में बाहर निकलती है।",
          "फॉलिक्युलर चरण: एस्ट्रोजन बढ़ता है और अंडाशय में एक अंडा तैयार होता है।",
          "ओव्यूलेशन: अंडा बाहर आता है, आमतौर पर अगले पीरियड से लगभग 14 दिन पहले; ज़रूरी नहीं कि चक्र के 14वें दिन।",
          "ल्यूटियल चरण: प्रोजेस्टेरोन बढ़ता है। गर्भ न ठहरने पर हार्मोन घटते हैं और अगला पीरियड शुरू होता है।",
          "हर महीने थोड़ा-बहुत बदलाव सामान्य है। हर पीरियड दर्ज करने से आपको और आपके डॉक्टर को पता चलता है कि आपके लिए क्या सामान्य है।",
        ],
      },
    },
  },
  {
    id: "see-doctor",
    icon: "🩺",
    text: {
      en: {
        title: "When to see a doctor",
        summary: "Signs that are worth a check-up, and when to get help urgently.",
        body: [
          "Book a visit with a doctor or gynaecologist if you notice:",
          "• Periods coming more often than every 21 days, or less often than every 35 days, again and again.",
          "• No period for 3 months or more (when not pregnant or breastfeeding), or no periods at all by age 15.",
          "• Bleeding that lasts more than 7 days, or soaking through a pad or tampon every 1–2 hours.",
          "• Bleeding between periods, after sex, or after menopause.",
          "• Period pain that stops you from going to school, college or work, or that painkillers don't help.",
          "• Unusual vaginal discharge with a bad smell, itching or pain.",
          "Get urgent medical help if you have very heavy bleeding with dizziness or fainting, severe sudden pain in the lower belly, or a high fever with a tampon or menstrual cup in place.",
          "You can show your doctor the Doctor report in Sakhi's Insights tab.",
        ],
      },
      hi: {
        title: "डॉक्टर को कब दिखाएँ",
        summary: "किन संकेतों पर जाँच करवानी चाहिए, और कब तुरंत मदद लेनी चाहिए।",
        body: [
          "अगर आपको ये दिखें, तो डॉक्टर या स्त्री रोग विशेषज्ञ को दिखाएँ:",
          "• बार-बार 21 दिन से पहले पीरियड आना, या 35 दिन से ज़्यादा देर से आना।",
          "• 3 महीने या उससे ज़्यादा पीरियड न आना (गर्भावस्था या स्तनपान के बिना), या 15 साल की उम्र तक पीरियड शुरू न होना।",
          "• 7 दिन से ज़्यादा ब्लीडिंग, या हर 1–2 घंटे में पैड या टैम्पोन पूरा भीग जाना।",
          "• पीरियड्स के बीच, सेक्स के बाद, या मेनोपॉज़ के बाद ब्लीडिंग।",
          "• इतना दर्द कि स्कूल, कॉलेज या काम पर न जा पाएँ, या दर्द की दवा से आराम न मिले।",
          "• बदबू, खुजली या दर्द के साथ असामान्य डिस्चार्ज।",
          "अगर बहुत ज़्यादा ब्लीडिंग के साथ चक्कर या बेहोशी हो, पेट के निचले हिस्से में अचानक बहुत तेज़ दर्द हो, या टैम्पोन या मेंस्ट्रुअल कप लगे होने पर तेज़ बुखार हो, तो तुरंत डॉक्टरी मदद लें।",
          "आप सखी के 'जानकारी' टैब में डॉक्टर रिपोर्ट अपने डॉक्टर को दिखा सकती हैं।",
        ],
      },
    },
  },
  {
    id: "heavy-anemia",
    icon: "🩸",
    text: {
      en: {
        title: "Heavy periods and anaemia",
        summary: "Why heavy bleeding matters, and how to keep your iron up.",
        body: [
          "Heavy menstrual bleeding is common and treatable. Signs include needing to change protection every 1–2 hours, passing large clots, or bleeding through clothes or bedding.",
          "Losing a lot of blood every month can cause iron-deficiency anaemia. Anaemia is very common among women in India. Signs include tiredness, breathlessness, dizziness, pale skin and a fast heartbeat.",
          "A simple haemoglobin blood test can check for anaemia. Don't start iron tablets in high doses without advice, but do talk to a doctor.",
          "Iron-rich foods include green leafy vegetables, lentils (dal), chana and rajma, eggs, fish and meat. Eating them with a source of vitamin C (lemon, amla, oranges, tomatoes) helps your body absorb iron. Tea or coffee with meals reduces absorption.",
        ],
      },
      hi: {
        title: "ज़्यादा ब्लीडिंग और एनीमिया",
        summary: "ज़्यादा ब्लीडिंग क्यों मायने रखती है, और आयरन कैसे ठीक रखें।",
        body: [
          "ज़्यादा ब्लीडिंग आम है और इसका इलाज हो सकता है। इसके संकेत हैं: हर 1–2 घंटे में पैड बदलना, बड़े थक्के निकलना, या कपड़ों या बिस्तर पर दाग लग जाना।",
          "हर महीने ज़्यादा खून जाने से आयरन की कमी वाला एनीमिया हो सकता है। भारत में महिलाओं में एनीमिया बहुत आम है। इसके संकेत हैं: थकान, साँस फूलना, चक्कर, पीली त्वचा और तेज़ धड़कन।",
          "एक आसान हीमोग्लोबिन खून की जाँच से एनीमिया का पता चल सकता है। बिना सलाह के ज़्यादा मात्रा में आयरन की गोलियाँ शुरू न करें, लेकिन डॉक्टर से ज़रूर बात करें।",
          "आयरन से भरपूर खाने में हरी पत्तेदार सब्ज़ियाँ, दालें, चना और राजमा, अंडे, मछली और मांस शामिल हैं। इन्हें विटामिन C (नींबू, आँवला, संतरा, टमाटर) के साथ खाने से शरीर आयरन अच्छे से सोखता है। खाने के साथ चाय या कॉफ़ी पीने से आयरन कम सोखा जाता है।",
        ],
      },
    },
  },
  {
    id: "pcos",
    icon: "🔬",
    text: {
      en: {
        title: "PCOS (polycystic ovary syndrome)",
        summary: "A common hormone condition, and why early diagnosis helps.",
        body: [
          "PCOS is one of the most common hormone conditions in women of reproductive age.",
          "Common signs are irregular or missed periods, acne, extra hair on the face or body, hair thinning on the scalp, and weight gain. Not everyone with PCOS has every sign.",
          "A doctor diagnoses PCOS using your history, an examination, blood tests and sometimes an ultrasound. An app cannot diagnose it.",
          "PCOS can be managed. Regular exercise, a balanced diet and, when needed, medicines help control symptoms and lower long-term risks like diabetes.",
          "If you log long or irregular cycles together with acne or unusual hair growth, Sakhi will suggest you discuss PCOS with a doctor.",
        ],
      },
      hi: {
        title: "PCOS (पॉलीसिस्टिक ओवरी सिंड्रोम)",
        summary: "एक आम हार्मोन समस्या, और जल्दी पहचान क्यों मददगार है।",
        body: [
          "PCOS प्रजनन उम्र की महिलाओं में सबसे आम हार्मोन से जुड़ी समस्याओं में से एक है।",
          "इसके आम संकेत हैं: अनियमित या छूटे हुए पीरियड, मुंहासे, चेहरे या शरीर पर ज़्यादा बाल, सिर के बाल पतले होना, और वज़न बढ़ना। ज़रूरी नहीं कि PCOS वाले हर व्यक्ति में सभी संकेत हों।",
          "डॉक्टर आपकी जानकारी, जाँच, खून की जाँच और कभी-कभी अल्ट्रासाउंड से PCOS की पहचान करते हैं। कोई ऐप इसकी पहचान नहीं कर सकता।",
          "PCOS को संभाला जा सकता है। नियमित व्यायाम, संतुलित खाना और ज़रूरत पड़ने पर दवाइयाँ लक्षणों को काबू में रखने और डायबिटीज़ जैसे लंबे समय के खतरों को कम करने में मदद करती हैं।",
          "अगर आप लंबे या अनियमित चक्र के साथ मुंहासे या असामान्य बाल उगना दर्ज करती हैं, तो सखी आपको डॉक्टर से PCOS के बारे में बात करने का सुझाव देगी।",
        ],
      },
    },
  },
  {
    id: "pain",
    icon: "💢",
    text: {
      en: {
        title: "Period pain and endometriosis",
        summary: "What helps cramps, and when pain is not normal.",
        body: [
          "Mild to moderate cramps in the first 1–3 days of a period are common.",
          "Things that often help: a hot water bottle on the lower belly, gentle exercise or stretching, rest, and over-the-counter painkillers. Ask a pharmacist or doctor which is safe for you.",
          "Pain is not normal if it stops you from daily life, gets worse over time, happens during sex, or comes with heavy bleeding. This can be a sign of endometriosis or fibroids.",
          "Endometriosis often takes years to be diagnosed because period pain is dismissed. Logging your pain level in Sakhi gives your doctor a clear record.",
        ],
      },
      hi: {
        title: "पीरियड का दर्द और एंडोमेट्रियोसिस",
        summary: "ऐंठन में क्या मदद करता है, और कब दर्द सामान्य नहीं है।",
        body: [
          "पीरियड के पहले 1–3 दिनों में हल्की से मध्यम ऐंठन आम है।",
          "जो अक्सर मदद करता है: पेट के निचले हिस्से पर गर्म पानी की बोतल, हल्का व्यायाम या स्ट्रेचिंग, आराम, और दर्द की आम दवाइयाँ। कौन-सी दवा आपके लिए सुरक्षित है, यह फ़ार्मासिस्ट या डॉक्टर से पूछें।",
          "दर्द सामान्य नहीं है अगर वह रोज़मर्रा की ज़िंदगी रोक देता है, समय के साथ बढ़ता जाता है, सेक्स के दौरान होता है, या ज़्यादा ब्लीडिंग के साथ होता है। यह एंडोमेट्रियोसिस या फ़ाइब्रॉइड का संकेत हो सकता है।",
          "एंडोमेट्रियोसिस की पहचान में अक्सर सालों लग जाते हैं, क्योंकि पीरियड के दर्द को अनदेखा कर दिया जाता है। सखी में अपना दर्द दर्ज करने से आपके डॉक्टर को साफ़ रिकॉर्ड मिलता है।",
        ],
      },
    },
  },
  {
    id: "pms",
    icon: "🌙",
    text: {
      en: {
        title: "PMS and PMDD",
        summary: "Mood and body changes before your period.",
        body: [
          "PMS (premenstrual syndrome) is a group of symptoms in the days before a period: bloating, tender breasts, headaches, food cravings, irritability or low mood. They go away once the period starts.",
          "Regular exercise, enough sleep, and less salt, sugar and caffeine before your period can help.",
          "PMDD (premenstrual dysphoric disorder) is a more severe form, with intense sadness, anxiety, anger or hopelessness that affects relationships, studies or work. It is a real medical condition and can be treated.",
          "Logging your mood every day for two or more cycles helps a doctor tell PMS or PMDD apart from other conditions.",
          "If you ever have thoughts of harming yourself, please reach out right away to someone you trust or a local emergency or mental-health helpline.",
        ],
      },
      hi: {
        title: "PMS और PMDD",
        summary: "पीरियड से पहले मूड और शरीर में बदलाव।",
        body: [
          "PMS (प्रीमेंस्ट्रुअल सिंड्रोम) पीरियड से पहले के दिनों के कुछ लक्षण हैं: पेट फूलना, स्तनों में दर्द, सिरदर्द, खाने की तलब, चिड़चिड़ापन या उदासी। पीरियड शुरू होने पर ये ठीक हो जाते हैं।",
          "नियमित व्यायाम, पूरी नींद, और पीरियड से पहले कम नमक, चीनी और कैफ़ीन लेने से मदद मिल सकती है।",
          "PMDD (प्रीमेंस्ट्रुअल डिस्फ़ोरिक डिसऑर्डर) इसका ज़्यादा गंभीर रूप है, जिसमें बहुत ज़्यादा उदासी, बेचैनी, गुस्सा या निराशा होती है, जो रिश्तों, पढ़ाई या काम पर असर डालती है। यह एक असली मेडिकल समस्या है और इसका इलाज हो सकता है।",
          "दो या उससे ज़्यादा चक्रों तक रोज़ अपना मूड दर्ज करने से डॉक्टर PMS या PMDD को दूसरी समस्याओं से अलग पहचान पाते हैं।",
          "अगर आपके मन में कभी खुद को नुकसान पहुँचाने के ख़याल आएँ, तो तुरंत किसी भरोसेमंद व्यक्ति से या किसी इमरजेंसी या मानसिक स्वास्थ्य हेल्पलाइन से संपर्क करें।",
        ],
      },
    },
  },
  {
    id: "hygiene",
    icon: "🧼",
    text: {
      en: {
        title: "Period hygiene",
        summary: "Pads, tampons, cups and staying infection-free.",
        body: [
          "Change pads every 4–8 hours, or sooner if they feel full. Change tampons at least every 8 hours, and use the lowest absorbency you need.",
          "Menstrual cups can usually be worn for up to 12 hours. Wash your hands before and after, and clean the cup as the maker advises.",
          "If you use cloth pads, wash them with soap and dry them fully in sunlight.",
          "Wash the outside genital area with plain water. Avoid douching and scented products, which can upset healthy bacteria and cause infections.",
          "Rarely, tampons or cups can cause toxic shock syndrome. Remove them and get urgent help if you suddenly develop a high fever, rash, vomiting or dizziness.",
        ],
      },
      hi: {
        title: "पीरियड के दौरान साफ़-सफ़ाई",
        summary: "पैड, टैम्पोन, कप और इन्फ़ेक्शन से बचाव।",
        body: [
          "हर 4–8 घंटे में पैड बदलें, या भर जाने पर पहले ही बदल दें। टैम्पोन कम से कम हर 8 घंटे में बदलें, और ज़रूरत जितनी ही सोखने की क्षमता वाला टैम्पोन इस्तेमाल करें।",
          "मेंस्ट्रुअल कप आमतौर पर 12 घंटे तक लगाए रखा जा सकता है। पहले और बाद में हाथ धोएँ, और कप को बनाने वाली कंपनी के बताए तरीके से साफ़ करें।",
          "अगर आप कपड़े के पैड इस्तेमाल करती हैं, तो उन्हें साबुन से धोकर धूप में पूरी तरह सुखाएँ।",
          "बाहरी हिस्से को सादे पानी से धोएँ। अंदर की धुलाई (डूशिंग) और खुशबू वाले प्रोडक्ट से बचें, क्योंकि इनसे अच्छे बैक्टीरिया बिगड़ सकते हैं और इन्फ़ेक्शन हो सकता है।",
          "बहुत कम मामलों में टैम्पोन या कप से टॉक्सिक शॉक सिंड्रोम हो सकता है। अगर अचानक तेज़ बुखार, दाने, उल्टी या चक्कर आएँ, तो उसे निकालें और तुरंत डॉक्टरी मदद लें।",
        ],
      },
    },
  },
];
