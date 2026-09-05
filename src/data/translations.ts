/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationDictionary {
  brand: string;
  tagline: string;
  missionStatement: string;
  buttonReport: string;
  buttonRights: string;
  buttonHelp: string;
  navHome: string;
  navReport: string;
  navRights: string;
  navHelp: string;
  navAI: string;
  navCommunity: string;
  navProfile: string;
  navAdmin: string;
  taglineSub: string;
  categoryTitle: string;
  emergencyDisclaimer: string;
}

export const translations: { [key: string]: TranslationDictionary } = {
  en: {
    brand: 'GIRMAIC HUMANITY',
    tagline: 'ONE HUMANITY. EQUAL DIGNITY. JUSTICE FOR ALL.',
    taglineSub: 'Global Human Rights, Justice & Human Dignity Platform',
    missionStatement: 'We do not fight people. We fight injustice. Empowering individuals to understand their rights, document concerns safely, and connect with verified supportive humanitarian resources.',
    buttonReport: 'REPORT A HUMAN-RIGHTS CONCERN',
    buttonRights: 'KNOW YOUR RIGHTS',
    buttonHelp: 'FIND HELP & ASSISTANCE',
    navHome: 'Home',
    navReport: 'Report Incident',
    navRights: 'Know Your Rights',
    navHelp: 'Get Help',
    navAI: 'AI Assistant',
    navCommunity: 'Community Discussion',
    navProfile: 'Profile & Privacy',
    navAdmin: 'Admin Panel',
    categoryTitle: 'The 20 Core Human-Rights Categories',
    emergencyDisclaimer: 'This platform provides information and connections to resources. It does not replace professional legal advice, emergency services, courts, law enforcement, or qualified humanitarian organizations.'
  },
  am: {
    brand: 'ግርማይክ ሰብአዊነት (GIRMAIC HUMANITY)',
    tagline: 'አንድ ሰብአዊነት። እኩል ክብር። ፍትህ ለሁሉም።',
    taglineSub: 'ዓለም አቀፍ የሰብአዊ መብቶች፣ የፍትህ እና የሰብአዊ ክብር መድረክ',
    missionStatement: 'እኛ ሰዎችን አንዋጋም፤ እኛ የምንዋጋው ኢፍትሃዊነትን ነው። ሰዎች መብቶቻቸውን እንዲረዱ፣ በደሎችን በደህና ሁኔታ እንዲመዘግቡ እና ከተረጋገጡ የሰብአዊ እርዳታ ሰጪ አካላት ጋር እንዲገናኙ እናስችላለን።',
    buttonReport: 'የሰብአዊ መብት ጥሰትን ሪፖርት አድርግ',
    buttonRights: 'መብቶችህን እወቅ',
    buttonHelp: 'እርዳታና ድጋፍ ፈልግ',
    navHome: 'መነሻ',
    navReport: 'ሪፖርት አድርግ',
    navRights: 'ሰብአዊ መብቶች',
    navHelp: 'እርዳታ ያግኙ',
    navAI: 'የአይ መረዳጃ',
    navCommunity: 'የህዝብ ውይይት',
    navProfile: 'መገለጫ እና ምስጢራዊነት',
    navAdmin: 'የአስተዳዳሪ ክፍል',
    categoryTitle: 'የ 20 ቱ ዋና የሰብአዊ መብት ምድቦች',
    emergencyDisclaimer: 'ይህ መድረክ መረጃዎችን እና የአገናኝ ግብዓቶችን ያቀርባል። ሙያዊ የህግ ምክርን፣ የድንገተኛ አደጋ አገልግሎቶችን፣ ፍርድ ቤቶችን፣ የህግ አስከባሪዎችን ወይም ብቁ የሰብአዊ ድርጅቶችን አይተካም።'
  },
  om: {
    brand: 'GIRMAIC HUMANITY',
    tagline: 'NAMA TOKKO. KABAYAA WALQIXAA. HAQA DEEBISUU.',
    taglineSub: 'Waltajjii Mirga Namummaa, Haqa fi Kabajaa Namummaa Idil-addunyaa',
    missionStatement: 'Nuti nama hin loumnu. Injustisii (jal’ina) loumna. Namoonni mirga isaanii akka hubatan, miidhaa nagaadhaan akka galmeessan fi qaamota gargaarsaa mirkanaayan wajjin akka wal-argan taasifna.',
    buttonReport: 'MIRGA NAMUMMAA RIIYPOORTI GOCHUU',
    buttonRights: 'MIRGA KEE BARADHU',
    buttonHelp: 'GARGAARSA BARADHU',
    navHome: 'Mana',
    navReport: 'Gabaasa Incident',
    navRights: 'Mirga Kee Baradhu',
    navHelp: 'Gargaarsa Argadhu',
    navAI: 'AI Assistant',
    navCommunity: 'Marii Hawaasaa',
    navProfile: 'Profile fi Privacy',
    navAdmin: 'Admin Panel',
    categoryTitle: 'Mata-Dureewwan Mirga Namummaa Gugurdoo 20',
    emergencyDisclaimer: 'Waltajjiin kun odeeffannoo fi hidhata qabeenyaa qofa kenna. Gorsa seeraa ogummaa, tajaajila ariifachiisaa, manneen murtii, yookaan dhaabbilee gargaarsaa hin bakka bu’u.'
  },
  so: {
    brand: 'GIRMAIC HUMANITY',
    tagline: 'KUN WAA AADAMINNIMO. SHARAF KALA MID AH. CADALAD DADKA OO DHAN.',
    taglineSub: 'Madasha Xuquuqda Aadanaha, Caddaaladda iyo Sharafta Aadanaha ee Caalamiga ah',
    missionStatement: 'Lama dagaallano dadka. Waxaan la dagaallanaa cadaalad-darrada. Awood siinta shakhsiyaadka inay fahmaan xuquuqdooda, si nabad ah u diiwaangeliyaan xadgudubyada, una xirmaan hay\'adaha gargaarka.',
    buttonReport: 'SOO SHEEG XADGUDUB XUQUUQDA AADANAHA',
    buttonRights: 'AKHRI XUQUUQDAADA',
    buttonHelp: 'RAADSO CAAWIMAAD',
    navHome: 'Hoyga',
    navReport: 'Gabaas Xadgudub',
    navRights: 'Baro Xuquuqdaada',
    navHelp: 'Hel Caawimaad',
    navAI: 'Kaaliyaha AI',
    navCommunity: 'Wada-hadalka Bulshada',
    navProfile: 'Xogta iyo Asturnaanta',
    navAdmin: 'Maamulka',
    categoryTitle: '20-ka Qaybood ee Xuquuqda Aadanaha',
    emergencyDisclaimer: 'Madashani waxay bixisaa macluumaad iyo isku xirka agabyada caawimaadda. Ma beddeleyso talooyinka sharci ee rasmiga ah, adeegyada gargaarka degdegga ah, ama booliska.'
  },
  ar: {
    brand: 'GIRMAIC HUMANITY',
    tagline: 'إنسانية واحدة. كرامة متساوية. العدالة للجميع.',
    taglineSub: 'المنصة العالمية لحقوق الإنسان والعدالة والكرامة الإنسانية',
    missionStatement: 'نحن لا نحارب الناس. نحن نحارب الظلم. تمكين الأفراد من فهم حقوقهم وتوثيق الانتهاكات بأمان والاتصال بموارد الإغاثة المعتمدة.',
    buttonReport: 'الإبلاغ عن انتهاك لحقوق الإنسان',
    buttonRights: 'اعرف حقوقك',
    buttonHelp: 'البحث عن مساعدة وإغاثة',
    navHome: 'الرئيسية',
    navReport: 'تقديم تقرير',
    navRights: 'اعرف حقوقك',
    navHelp: 'طلب المساعدة',
    navAI: 'مساعد الذكاء الاصطناعي',
    navCommunity: 'مناقشة المجتمع',
    navProfile: 'الملف الشخصي والخصوصية',
    navAdmin: 'لوحة التحكم للمسؤولين',
    categoryTitle: 'الفئات العشرون الرئيسية لحقوق الإنسان',
    emergencyDisclaimer: 'توفر هذه المنصة معلومات وتسهل الوصول للموارد الشريكة. لا تمثل بديلاً عن الاستشارات القانونية المهنية أو خدمات الطوارئ أو المحاكم.'
  },
  fr: {
    brand: 'GIRMAIC HUMANITY',
    tagline: 'UNE HUMANITÉ. ÉGALE DIGNITÉ. JUSTICE POUR TOUS.',
    taglineSub: 'Plateforme Globale pour les Droits de l’Homme, la Justice et la Dignité Humaine',
    missionStatement: 'Nous ne combattons pas les personnes. Nous combattons l’injustice. Donner aux citoyens les moyens de comprendre leurs droits, de documenter leurs préoccupations en toute sécurité et d’accéder à de l’aide humanitaire agréée.',
    buttonReport: 'SIGNALER UN ABUS DES DROITS DE L’HOMME',
    buttonRights: 'CONNAÎTRE VOS DROITS',
    buttonHelp: 'TROUVER DE L’AIDE',
    navHome: 'Accueil',
    navReport: 'Signaler un incident',
    navRights: 'Connaître vos droits',
    navHelp: 'Obtenir de l’aide',
    navAI: 'Assistant IA',
    navCommunity: 'Discussion Communautaire',
    navProfile: 'Profil et Confidentialité',
    navAdmin: 'Tableau de bord',
    categoryTitle: 'Les 20 Catégories Fondamentales des Droits de l’Homme',
    emergencyDisclaimer: 'Cette plateforme fournit des informations et des connexions vers des ressources. Elle ne remplace pas les conseils juridiques professionnels, les services d’urgence, ou les tribunaux.'
  }
};
