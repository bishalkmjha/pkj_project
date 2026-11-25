/**
 * Body-literacy, sexual & reproductive health and wellbeing articles.
 * MUST be reviewed by a qualified gynaecologist before public release.
 */
import type { Article } from "./articles";

export const MORE_ARTICLES: Article[] = [
  {
    id: "discharge",
    category: "body",
    icon: "💧",
    text: {
      en: {
        title: "Discharge: what's normal",
        summary: "How discharge changes through your cycle, and signs of infection.",
        body: [
          "Vaginal discharge is normal and healthy. It keeps the vagina clean and moist, and it changes through your cycle.",
          "After your period: little or none (dry).",
          "Before ovulation: sticky or creamy, white or slightly cloudy.",
          "Around ovulation: clear, wet, slippery and stretchy, like raw egg white. This is the most fertile time.",
          "After ovulation: thicker and less, until your next period.",
          "You can log your discharge in Sakhi to learn your own pattern.",
          "See a doctor if discharge has a strong fishy or bad smell; is thick and white like cottage cheese with itching; is green, yellow, grey or frothy; is mixed with blood outside your period; or comes with itching, burning, pain or sores. These are often easily treated infections.",
          "Don't douche (wash inside the vagina) or use scented washes. Plain water on the outside is enough. Wear cotton underwear and change out of damp clothes.",
        ],
      },
      hi: {
        title: "डिस्चार्ज: क्या सामान्य है",
        summary: "चक्र के साथ डिस्चार्ज कैसे बदलता है, और इन्फ़ेक्शन के संकेत।",
        body: [
          "योनि से डिस्चार्ज सामान्य और स्वस्थ है। यह योनि को साफ़ और नम रखता है, और चक्र के साथ बदलता है।",
          "पीरियड के बाद: बहुत कम या बिल्कुल नहीं (सूखा)।",
          "ओव्यूलेशन से पहले: चिपचिपा या क्रीमी, सफ़ेद या हल्का धुंधला।",
          "ओव्यूलेशन के आसपास: साफ़, गीला, फिसलन वाला और खिंचने वाला, कच्चे अंडे की सफ़ेदी जैसा। यह सबसे फ़र्टाइल समय है।",
          "ओव्यूलेशन के बाद: अगले पीरियड तक गाढ़ा और कम।",
          "अपना पैटर्न समझने के लिए आप सखी में डिस्चार्ज दर्ज कर सकती हैं।",
          "डॉक्टर को दिखाएँ अगर डिस्चार्ज में मछली जैसी या तेज़ बदबू हो; पनीर जैसा गाढ़ा सफ़ेद हो और खुजली हो; हरा, पीला, स्लेटी या झागदार हो; पीरियड के अलावा खून मिला हो; या खुजली, जलन, दर्द या छाले हों। ये अक्सर आसानी से ठीक होने वाले इन्फ़ेक्शन होते हैं।",
          "अंदर की धुलाई (डूशिंग) न करें और खुशबू वाले वॉश इस्तेमाल न करें। बाहर सादा पानी काफ़ी है। सूती अंडरवियर पहनें और गीले कपड़े जल्दी बदलें।",
        ],
      },
    },
  },
  {
    id: "breast-check",
    category: "body",
    icon: "🎀",
    text: {
      en: {
        title: "Breast self-check",
        summary: "A 5-minute monthly habit to know what's normal for you.",
        body: [
          "Checking your breasts once a month helps you notice changes early. The best time is a few days after your period ends, when breasts are least tender. Sakhi can remind you.",
          "Look: stand in front of a mirror with arms down, then raised. Look for changes in size or shape, dimpling or puckering of the skin, redness, or a nipple that has turned inwards.",
          "Feel: lying down, use the flat pads of your three middle fingers. Press in small circles, with light, medium and firm pressure, covering the whole breast from collarbone to below the breast and from armpit to breastbone. Check the armpits too.",
          "See a doctor if you find a new lump or thickening, nipple discharge (especially bloody), skin changes, or pain in one spot that doesn't go away after your period.",
          "Most lumps are not cancer, but every new lump should be checked. A doctor can also examine your breasts during routine check-ups.",
        ],
      },
      hi: {
        title: "स्तनों की खुद जाँच",
        summary: "हर महीने 5 मिनट की आदत, ताकि पता रहे कि आपके लिए क्या सामान्य है।",
        body: [
          "महीने में एक बार स्तनों की जाँच से बदलाव जल्दी पता चलते हैं। सबसे अच्छा समय पीरियड खत्म होने के कुछ दिन बाद है, जब स्तनों में सबसे कम दर्द होता है। सखी आपको याद दिला सकती है।",
          "देखें: शीशे के सामने खड़ी होकर पहले हाथ नीचे, फिर ऊपर करके देखें। आकार या बनावट में बदलाव, त्वचा में गड्ढे या सिकुड़न, लाली, या निप्पल का अंदर की ओर मुड़ना देखें।",
          "छूकर देखें: लेटकर बीच की तीन उंगलियों के सपाट हिस्से से हल्के, मध्यम और गहरे दबाव से छोटे-छोटे गोल घेरे बनाएँ। कॉलरबोन से स्तन के नीचे तक और बगल से छाती की हड्डी तक पूरा स्तन जाँचें। बगल भी जाँचें।",
          "डॉक्टर को दिखाएँ अगर कोई नई गाँठ या सख़्त हिस्सा मिले, निप्पल से कुछ निकले (खासकर खून), त्वचा में बदलाव हो, या एक ही जगह दर्द हो जो पीरियड के बाद भी न जाए।",
          "ज़्यादातर गाँठें कैंसर नहीं होतीं, लेकिन हर नई गाँठ की जाँच ज़रूरी है। नियमित जाँच के दौरान डॉक्टर भी स्तनों की जाँच कर सकते हैं।",
        ],
      },
    },
  },
  {
    id: "myths",
    category: "body",
    icon: "💬",
    text: {
      en: {
        title: "Period myths vs facts",
        summary: "Common beliefs, and what science actually says.",
        body: [
          "Myth: You shouldn't bathe or wash your hair during a period. Fact: Bathing is safe and helps with hygiene and cramps.",
          "Myth: Touching pickles, plants or food spoils them. Fact: Periods don't spoil anything. This belief has no scientific basis.",
          "Myth: Period blood is dirty or impure. Fact: It is blood and tissue from the uterus lining, a normal part of a healthy body.",
          "Myth: You shouldn't exercise or play sports. Fact: Exercise is safe and often reduces cramps.",
          "Myth: You can't get pregnant during your period. Fact: It's less likely but possible, especially with short cycles, because sperm can survive up to 5 days.",
          "Myth: Using a tampon or menstrual cup affects virginity. Fact: Virginity is not a medical condition, and tampons and cups are safe to use at any age once periods start.",
          "Myth: Irregular periods mean you can't have children. Fact: Many people with irregular cycles get pregnant. But irregular periods are worth checking, as treatable conditions like PCOS or thyroid problems can be the cause.",
          "Myth: PMS is 'all in your head'. Fact: PMS and PMDD are real, hormone-related conditions.",
        ],
      },
      hi: {
        title: "पीरियड से जुड़े मिथक और सच",
        summary: "आम मान्यताएँ, और विज्ञान असल में क्या कहता है।",
        body: [
          "मिथक: पीरियड में नहाना या बाल धोना नहीं चाहिए। सच: नहाना सुरक्षित है और सफ़ाई व ऐंठन दोनों में मदद करता है।",
          "मिथक: अचार, पौधे या खाना छूने से वे खराब हो जाते हैं। सच: पीरियड से कुछ भी खराब नहीं होता। इस मान्यता का कोई वैज्ञानिक आधार नहीं है।",
          "मिथक: पीरियड का खून गंदा या अपवित्र होता है। सच: यह गर्भाशय की परत का खून और ऊतक है, स्वस्थ शरीर का सामान्य हिस्सा।",
          "मिथक: व्यायाम या खेल नहीं करना चाहिए। सच: व्यायाम सुरक्षित है और अक्सर ऐंठन कम करता है।",
          "मिथक: पीरियड के दौरान गर्भ नहीं ठहर सकता। सच: संभावना कम है पर मुमकिन है, खासकर छोटे चक्र में, क्योंकि शुक्राणु 5 दिन तक जीवित रह सकते हैं।",
          "मिथक: टैम्पोन या मेंस्ट्रुअल कप से कौमार्य पर असर पड़ता है। सच: कौमार्य कोई मेडिकल स्थिति नहीं है, और पीरियड शुरू होने के बाद किसी भी उम्र में टैम्पोन और कप सुरक्षित हैं।",
          "मिथक: अनियमित पीरियड का मतलब है बच्चे नहीं हो सकते। सच: अनियमित चक्र वाले कई लोग गर्भवती होते हैं। फिर भी जाँच करवाना ठीक है, क्योंकि PCOS या थायरॉइड जैसी इलाज योग्य समस्याएँ कारण हो सकती हैं।",
          "मिथक: PMS 'सिर्फ़ मन का वहम' है। सच: PMS और PMDD असली, हार्मोन से जुड़ी समस्याएँ हैं।",
        ],
      },
    },
  },
  {
    id: "perimenopause",
    category: "body",
    icon: "🍁",
    text: {
      en: {
        title: "Perimenopause & menopause",
        summary: "What changes in your 40s, and what's not normal.",
        body: [
          "Perimenopause is the time, often several years, before periods stop for good. It usually starts in the 40s. Menopause is confirmed after 12 months in a row without a period; in India this often happens in the mid-to-late 40s.",
          "Common changes: cycles getting shorter or longer, heavier or lighter periods, skipped periods, hot flashes, night sweats, poor sleep, mood changes and vaginal dryness.",
          "You can still get pregnant during perimenopause, so keep using contraception until a doctor says it's safe to stop.",
          "Look after your bones and heart: calcium, vitamin D, weight-bearing exercise like brisk walking, and regular check-ups.",
          "See a doctor if periods stop before age 40, if bleeding is very heavy or happens between periods, or if symptoms affect your daily life. Any bleeding after menopause must always be checked.",
        ],
      },
      hi: {
        title: "पेरिमेनोपॉज़ और मेनोपॉज़",
        summary: "40 की उम्र में क्या बदलता है, और क्या सामान्य नहीं है।",
        body: [
          "पेरिमेनोपॉज़ वह समय है, अक्सर कई साल, जब पीरियड हमेशा के लिए बंद होने वाले होते हैं। यह आमतौर पर 40 की उम्र में शुरू होता है। लगातार 12 महीने पीरियड न आने पर मेनोपॉज़ माना जाता है; भारत में यह अक्सर 45 से 50 की उम्र के बीच होता है।",
          "आम बदलाव: चक्र छोटे या लंबे होना, ज़्यादा या कम ब्लीडिंग, पीरियड छूटना, अचानक गर्मी लगना, रात में पसीना, कम नींद, मूड में बदलाव और योनि में सूखापन।",
          "पेरिमेनोपॉज़ में भी गर्भ ठहर सकता है, इसलिए जब तक डॉक्टर न कहें, गर्भनिरोधक इस्तेमाल करती रहें।",
          "हड्डियों और दिल का ध्यान रखें: कैल्शियम, विटामिन D, तेज़ चलने जैसा व्यायाम, और नियमित जाँच।",
          "डॉक्टर को दिखाएँ अगर 40 की उम्र से पहले पीरियड बंद हो जाएँ, बहुत ज़्यादा ब्लीडिंग हो या पीरियड्स के बीच हो, या लक्षण रोज़मर्रा की ज़िंदगी पर असर डालें। मेनोपॉज़ के बाद किसी भी ब्लीडिंग की जाँच हमेशा ज़रूरी है।",
        ],
      },
    },
  },
  {
    id: "contraception",
    category: "sexual",
    icon: "🛡️",
    text: {
      en: {
        title: "Contraception basics",
        summary: "The main options, and why app predictions aren't birth control.",
        body: [
          "Contraception lets you decide if and when to become pregnant. A doctor, gynaecologist or government health centre can help you choose. Many methods are free at government health centres in India.",
          "Condoms: the only method that also protects against sexually transmitted infections (STIs). Use one every time.",
          "Pills: daily tablets. Combined pills contain estrogen and progestin; some people can only take progestin-only pills. They work well when taken every day.",
          "IUD (such as Copper-T): a small device placed in the uterus by a doctor. It lasts for years and is one of the most effective methods.",
          "Injection: given every 3 months by a health worker.",
          "Emergency contraception: a pill taken as soon as possible after unprotected sex, ideally within 72 hours. It is a backup, not a regular method.",
          "Less reliable methods: withdrawal and counting 'safe days'. Period apps, including Sakhi, only estimate ovulation and must not be used as contraception.",
          "Your choice of contraception is yours. You have the right to accurate information and to say no to sex at any time.",
        ],
      },
      hi: {
        title: "गर्भनिरोधक की बुनियादी जानकारी",
        summary: "मुख्य विकल्प, और ऐप के अनुमान गर्भनिरोधक क्यों नहीं हैं।",
        body: [
          "गर्भनिरोधक से आप तय कर सकती हैं कि गर्भ कब और चाहिए या नहीं। डॉक्टर, स्त्री रोग विशेषज्ञ या सरकारी स्वास्थ्य केंद्र सही तरीका चुनने में मदद कर सकते हैं। भारत में सरकारी स्वास्थ्य केंद्रों पर कई तरीके मुफ़्त मिलते हैं।",
          "कंडोम: अकेला तरीका जो यौन संचारित संक्रमण (STI) से भी बचाता है। हर बार इस्तेमाल करें।",
          "गोलियाँ: रोज़ ली जाने वाली गोलियाँ। कंबाइंड गोलियों में एस्ट्रोजन और प्रोजेस्टिन होते हैं; कुछ लोग सिर्फ़ प्रोजेस्टिन वाली गोलियाँ ही ले सकते हैं। रोज़ लेने पर ये अच्छी तरह काम करती हैं।",
          "IUD (जैसे कॉपर-T): डॉक्टर द्वारा गर्भाशय में लगाया जाने वाला छोटा उपकरण। यह कई साल चलता है और सबसे असरदार तरीकों में से एक है।",
          "इंजेक्शन: हर 3 महीने में स्वास्थ्य कर्मचारी द्वारा लगाया जाता है।",
          "इमरजेंसी गर्भनिरोधक: असुरक्षित सेक्स के बाद जितनी जल्दी हो सके, बेहतर है 72 घंटे के अंदर, ली जाने वाली गोली। यह बैकअप है, नियमित तरीका नहीं।",
          "कम भरोसेमंद तरीके: बाहर निकालना (विदड्रॉल) और 'सुरक्षित दिन' गिनना। सखी समेत पीरियड ऐप सिर्फ़ ओव्यूलेशन का अनुमान लगाते हैं और इन्हें गर्भनिरोधक के रूप में इस्तेमाल नहीं करना चाहिए।",
          "गर्भनिरोधक चुनना आपका फ़ैसला है। आपको सही जानकारी पाने का और किसी भी समय सेक्स के लिए मना करने का अधिकार है।",
        ],
      },
    },
  },
  {
    id: "pregnancy",
    category: "sexual",
    icon: "🤰",
    text: {
      en: {
        title: "Could I be pregnant?",
        summary: "Early signs, when to test, and what to do next.",
        body: [
          "Early signs can include a missed period, nausea, tender breasts, tiredness and needing to pass urine more often. Some people have no signs at first.",
          "Home pregnancy tests are reliable from the first day of a missed period. Use your first morning urine and follow the instructions.",
          "If the test is negative but your period still hasn't come, test again in 3–5 days. If it stays negative and you have no period, see a doctor.",
          "If you are pregnant, see a doctor or government health centre early. They can confirm the pregnancy, check your health and talk through your options. Start folic acid if you plan to continue the pregnancy.",
          "Safe abortion services are legal in India when provided by registered doctors and approved centres. Never take abortion pills without a doctor's guidance.",
          "If you are trying to get pregnant: eat folate-rich foods, ask a doctor about folic acid, avoid smoking and alcohol, and see a doctor if it hasn't happened after 12 months of trying (6 months if you are over 35).",
        ],
      },
      hi: {
        title: "क्या मैं गर्भवती हो सकती हूँ?",
        summary: "शुरुआती संकेत, टेस्ट कब करें, और आगे क्या करें।",
        body: [
          "शुरुआती संकेतों में पीरियड न आना, जी मिचलाना, स्तनों में दर्द, थकान और बार-बार पेशाब आना शामिल हो सकते हैं। कुछ लोगों में शुरू में कोई संकेत नहीं होता।",
          "घर पर किया जाने वाला प्रेगनेंसी टेस्ट पीरियड छूटने के पहले दिन से भरोसेमंद होता है। सुबह का पहला पेशाब इस्तेमाल करें और निर्देश ध्यान से पढ़ें।",
          "अगर टेस्ट नेगेटिव है लेकिन पीरियड अब भी नहीं आया, तो 3–5 दिन बाद फिर टेस्ट करें। अगर फिर भी नेगेटिव रहे और पीरियड न आए, तो डॉक्टर को दिखाएँ।",
          "अगर आप गर्भवती हैं, तो जल्दी डॉक्टर या सरकारी स्वास्थ्य केंद्र जाएँ। वे गर्भ की पुष्टि करेंगे, आपकी सेहत जाँचेंगे और आपके विकल्पों पर बात करेंगे। अगर गर्भ जारी रखना है, तो फ़ोलिक एसिड शुरू करें।",
          "भारत में पंजीकृत डॉक्टरों और मान्यता प्राप्त केंद्रों द्वारा सुरक्षित गर्भपात कानूनी है। डॉक्टर की सलाह के बिना कभी भी गर्भपात की गोलियाँ न लें।",
          "अगर आप गर्भ चाहती हैं: फ़ोलेट वाले खाने खाएँ, डॉक्टर से फ़ोलिक एसिड के बारे में पूछें, धूम्रपान और शराब से बचें, और 12 महीने कोशिश के बाद भी गर्भ न ठहरे (35 से ज़्यादा उम्र हो तो 6 महीने) तो डॉक्टर को दिखाएँ।",
        ],
      },
    },
  },
  {
    id: "sexual-health",
    category: "sexual",
    icon: "🩺",
    text: {
      en: {
        title: "Sexual health, HPV & screening",
        summary: "Infections, the HPV vaccine, cervical screening and your rights.",
        body: [
          "Sexually transmitted infections (STIs) are common and often have no symptoms. Condoms lower the risk. See a doctor for unusual discharge, sores, itching, pain during sex or bleeding after sex.",
          "Urinary tract infections (UTIs) cause burning, frequent urge to pass urine, or lower belly pain. Drink enough water, pass urine after sex, and wipe front to back. See a doctor if you have symptoms, as UTIs need treatment.",
          "HPV vaccine: HPV causes most cervical cancer, one of the most common cancers in women in India. The vaccine works best when given at ages 9–14, and older girls and young women can still benefit. Ask your doctor.",
          "Cervical screening (Pap smear or HPV test) finds changes early, before cancer develops. Ask your doctor when to start and how often; it commonly starts between ages 21 and 30 and is repeated every 3–5 years.",
          "Consent: no one has the right to touch you or pressure you into sex. If someone hurts or threatens you, you can call the Women Helpline on 181 or the emergency number 112 (India).",
        ],
      },
      hi: {
        title: "यौन स्वास्थ्य, HPV और जाँच",
        summary: "इन्फ़ेक्शन, HPV टीका, गर्भाशय ग्रीवा की जाँच और आपके अधिकार।",
        body: [
          "यौन संचारित संक्रमण (STI) आम हैं और अक्सर इनके कोई लक्षण नहीं होते। कंडोम से खतरा कम होता है। असामान्य डिस्चार्ज, छाले, खुजली, सेक्स के दौरान दर्द या सेक्स के बाद ब्लीडिंग हो तो डॉक्टर को दिखाएँ।",
          "पेशाब के रास्ते का इन्फ़ेक्शन (UTI) जलन, बार-बार पेशाब जाने की इच्छा, या पेट के निचले हिस्से में दर्द करता है। पर्याप्त पानी पिएँ, सेक्स के बाद पेशाब करें, और आगे से पीछे की ओर पोंछें। लक्षण हों तो डॉक्टर को दिखाएँ, क्योंकि UTI का इलाज ज़रूरी है।",
          "HPV टीका: ज़्यादातर गर्भाशय ग्रीवा (सर्विक्स) का कैंसर HPV से होता है, जो भारत में महिलाओं के सबसे आम कैंसर में से एक है। टीका 9–14 साल की उम्र में सबसे अच्छा काम करता है, और बड़ी लड़कियों और युवा महिलाओं को भी फ़ायदा हो सकता है। अपने डॉक्टर से पूछें।",
          "सर्विक्स की जाँच (पैप स्मीयर या HPV टेस्ट) कैंसर बनने से पहले ही बदलाव पकड़ लेती है। डॉक्टर से पूछें कि कब शुरू करें और कितनी बार करवाएँ; आमतौर पर यह 21 से 30 साल के बीच शुरू होती है और हर 3–5 साल में दोहराई जाती है।",
          "सहमति: किसी को आपको छूने या सेक्स के लिए दबाव डालने का अधिकार नहीं है। अगर कोई आपको नुकसान पहुँचाए या धमकाए, तो आप महिला हेल्पलाइन 181 या इमरजेंसी नंबर 112 (भारत) पर कॉल कर सकती हैं।",
        ],
      },
    },
  },
  {
    id: "nutrition",
    category: "wellbeing",
    icon: "🥗",
    text: {
      en: {
        title: "Nutrition for women",
        summary: "Iron, calcium, vitamin D, B12 and folate: why they matter.",
        body: [
          "Iron: more than half of women in India are anaemic. Eat green leafy vegetables, dal, chana, rajma, eggs, fish or meat, with vitamin C (lemon, amla, guava) and away from tea.",
          "Calcium: your bones are building strength until about age 30. Milk, curd, paneer, ragi, til (sesame) and green leafy vegetables every day.",
          "Vitamin D: helps your body use calcium. Spend 15–20 minutes in sunlight with arms and face uncovered on most days. Deficiency is very common; a doctor can test for it.",
          "Vitamin B12: found almost only in animal foods (milk, curd, eggs, fish, meat). Vegetarians often run low; tiredness and tingling hands or feet can be signs. Ask a doctor before taking supplements.",
          "Folate: important for everyone and essential before and in early pregnancy. Green leafy vegetables, dal, beans and citrus fruit.",
          "Also: protein at every meal, iodised salt, plenty of water, and fewer sugary drinks and packaged snacks.",
          "Very strict dieting or over-exercising can stop your periods. That's a sign your body isn't getting enough energy, and worth seeing a doctor about.",
        ],
      },
      hi: {
        title: "महिलाओं के लिए पोषण",
        summary: "आयरन, कैल्शियम, विटामिन D, B12 और फ़ोलेट: ये क्यों ज़रूरी हैं।",
        body: [
          "आयरन: भारत में आधी से ज़्यादा महिलाओं में खून की कमी (एनीमिया) है। हरी पत्तेदार सब्ज़ियाँ, दाल, चना, राजमा, अंडे, मछली या मांस खाएँ, विटामिन C (नींबू, आँवला, अमरूद) के साथ और चाय से दूर।",
          "कैल्शियम: लगभग 30 साल की उम्र तक हड्डियाँ मज़बूत होती रहती हैं। रोज़ दूध, दही, पनीर, रागी, तिल और हरी पत्तेदार सब्ज़ियाँ।",
          "विटामिन D: शरीर को कैल्शियम इस्तेमाल करने में मदद करता है। ज़्यादातर दिन 15–20 मिनट धूप में बैठें, हाथ और चेहरा खुले रखें। इसकी कमी बहुत आम है; डॉक्टर इसकी जाँच कर सकते हैं।",
          "विटामिन B12: लगभग सिर्फ़ पशु-आधारित खाने (दूध, दही, अंडे, मछली, मांस) में मिलता है। शाकाहारियों में अक्सर इसकी कमी होती है; थकान और हाथ-पैरों में झुनझुनी इसके संकेत हो सकते हैं। सप्लीमेंट से पहले डॉक्टर से पूछें।",
          "फ़ोलेट: सबके लिए ज़रूरी है और गर्भ से पहले व शुरुआती गर्भावस्था में बेहद ज़रूरी। हरी पत्तेदार सब्ज़ियाँ, दाल, बीन्स और खट्टे फल।",
          "साथ ही: हर खाने में प्रोटीन, आयोडीन वाला नमक, भरपूर पानी, और कम मीठे पेय व पैकेट वाले स्नैक्स।",
          "बहुत सख़्त डाइटिंग या ज़रूरत से ज़्यादा व्यायाम से पीरियड रुक सकते हैं। यह संकेत है कि शरीर को पर्याप्त ऊर्जा नहीं मिल रही, और इसके लिए डॉक्टर को दिखाना चाहिए।",
        ],
      },
    },
  },
  {
    id: "stress-sleep",
    category: "wellbeing",
    icon: "🧠",
    text: {
      en: {
        title: "Stress, sleep & your cycle",
        summary: "How your mind and daily habits affect your periods.",
        body: [
          "Stress affects the brain signals that control ovulation. Exams, a move, illness or emotional stress can delay a period or make it irregular for a cycle or two.",
          "Sleep: 7–9 hours at regular times keeps hormones steadier and helps PMS, cravings and mood.",
          "Movement: about 30 minutes of activity most days, like walking, dancing, yoga or sports, helps mood, cramps and sleep.",
          "Calm your nervous system: slow breathing (in for 4, out for 6), time outdoors, talking to people you trust, and breaks from your phone.",
          "It's okay to ask for help. If you feel low, anxious or hopeless for more than two weeks, talk to a doctor or counsellor. In India, Tele-MANAS (14416) offers free, confidential mental health support 24×7 in many languages.",
        ],
      },
      hi: {
        title: "तनाव, नींद और आपका चक्र",
        summary: "आपका मन और रोज़ की आदतें पीरियड पर कैसे असर डालती हैं।",
        body: [
          "तनाव दिमाग के उन संकेतों पर असर डालता है जो ओव्यूलेशन को नियंत्रित करते हैं। परीक्षा, घर बदलना, बीमारी या भावनात्मक तनाव से पीरियड एक-दो चक्र के लिए देर से या अनियमित हो सकता है।",
          "नींद: तय समय पर 7–9 घंटे की नींद हार्मोन को स्थिर रखती है और PMS, तलब और मूड में मदद करती है।",
          "हलचल: ज़्यादातर दिन लगभग 30 मिनट टहलना, डांस, योग या खेल मूड, ऐंठन और नींद में मदद करते हैं।",
          "मन को शांत करें: धीमी साँस (4 तक अंदर, 6 तक बाहर), बाहर खुली हवा में समय, भरोसेमंद लोगों से बात, और फ़ोन से ब्रेक।",
          "मदद माँगना ठीक है। अगर दो हफ़्ते से ज़्यादा उदासी, बेचैनी या निराशा रहे, तो डॉक्टर या काउंसलर से बात करें। भारत में टेली-मानस (14416) कई भाषाओं में 24 घंटे मुफ़्त और गोपनीय मानसिक स्वास्थ्य सहायता देता है।",
        ],
      },
    },
  },
];
