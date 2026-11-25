import { Page } from "../components/ui";
import { useStore } from "../store";

/** In-app privacy policy. Keep in sync with public/privacy.html (the hosted copy for Google Play). */
export const PRIVACY: Record<"en" | "hi", { title: string; updated: string; body: string[] }> = {
  en: {
    title: "Privacy policy",
    updated: "Last updated: 25 November 2026",
    body: [
      "Sakhi is a menstrual cycle and health tracker. We designed it so that your health data stays with you.",
      "What we collect: nothing. Everything you enter (period dates, symptoms, moods, discharge, temperature, intimacy, pregnancy details, notes and settings) is stored only on your device. Sakhi has no accounts, no servers, no analytics, no advertising and no third-party trackers.",
      "Internet: the app does not send your data over the internet.",
      "Reminders: notifications are scheduled on your device by the operating system.",
      "Backups: if you choose 'Export my data', a file is created and you decide where to share or save it. Keep it somewhere private.",
      "App lock: if you set a PIN, only a salted hash of it is stored on your device.",
      "Deleting data: 'Delete all my data' in Settings, or uninstalling the app, permanently removes your data from the device.",
      "Children: Sakhi is intended for people aged 16 and over.",
      "Medical disclaimer: Sakhi provides estimates and general information. It is not a medical device, cannot diagnose conditions and must not be used as contraception.",
      "Contact: questions about this policy can be sent to the developer through the contact details on the Google Play store listing.",
    ],
  },
  hi: {
    title: "प्राइवेसी पॉलिसी",
    updated: "आख़िरी बदलाव: 25 नवंबर 2026",
    body: [
      "सखी एक माहवारी चक्र और सेहत ट्रैकर है। इसे इस तरह बनाया गया है कि आपका सेहत से जुड़ा डेटा आपके ही पास रहे।",
      "हम क्या इकट्ठा करते हैं: कुछ भी नहीं। आप जो भी दर्ज करती हैं (पीरियड की तारीखें, लक्षण, मूड, डिस्चार्ज, तापमान, अंतरंगता, गर्भावस्था की जानकारी, नोट और सेटिंग्स) वह सिर्फ़ आपके डिवाइस में रहता है। सखी में न अकाउंट है, न सर्वर, न एनालिटिक्स, न विज्ञापन, और न कोई थर्ड-पार्टी ट्रैकर।",
      "इंटरनेट: ऐप आपका डेटा इंटरनेट पर नहीं भेजता।",
      "रिमाइंडर: नोटिफ़िकेशन आपके डिवाइस पर ही ऑपरेटिंग सिस्टम द्वारा सेट किए जाते हैं।",
      "बैकअप: अगर आप 'मेरा डेटा एक्सपोर्ट करें' चुनती हैं, तो एक फ़ाइल बनती है और आप तय करती हैं कि उसे कहाँ शेयर या सेव करना है। उसे किसी निजी जगह पर रखें।",
      "ऐप लॉक: अगर आप PIN सेट करती हैं, तो आपके डिवाइस पर सिर्फ़ उसका सुरक्षित (salted) हैश रखा जाता है।",
      "डेटा हटाना: सेटिंग्स में 'मेरा सारा डेटा हटाएँ' चुनने या ऐप अनइंस्टॉल करने से आपका डेटा डिवाइस से हमेशा के लिए हट जाता है।",
      "बच्चे: सखी 16 साल और उससे ज़्यादा उम्र के लोगों के लिए है।",
      "मेडिकल अस्वीकरण: सखी अनुमान और सामान्य जानकारी देती है। यह मेडिकल डिवाइस नहीं है, बीमारी की पहचान नहीं कर सकती, और इसे गर्भनिरोधक के रूप में इस्तेमाल नहीं करना चाहिए।",
      "संपर्क: इस पॉलिसी के बारे में सवाल Google Play पेज पर दिए गए डेवलपर के संपर्क पते पर भेजे जा सकते हैं।",
    ],
  },
};

export function Privacy({ onBack }: { onBack: () => void }) {
  const { data } = useStore();
  const p = PRIVACY[data.settings.lang];
  return (
    <Page title={p.title} onBack={onBack}>
      <article className="card article">
        <p className="muted small">{p.updated}</p>
        {p.body.map((b, i) => <p key={i}>{b}</p>)}
      </article>
    </Page>
  );
}
