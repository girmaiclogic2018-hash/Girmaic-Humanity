/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReportCategory } from '../types';

export const coreCategories: ReportCategory[] = [
  {
    id: 'discrimination',
    name: 'Discrimination',
    description: 'Unfair treatment based on race, gender, religion, nationality, disability, or other protected characteristics.',
    educationalExplanation: 'Discrimination violates the fundamental principle that all humans are born free and equal in dignity and rights. It occurs when a person is treated less favorably than another in a comparable situation based on arbitrary personal characteristics.',
    examples: [
      'Denial of employment or housing due to ethnic background.',
      'Refusal of medical services based on gender identity or religious beliefs.',
      'Unequal pay for equal work based solely on demographic classification.'
    ],
    safetyGuidance: 'Document specific dates, times, statements, and witnesses of discriminatory conduct. Keep copies of any written communication, emails, or policies that demonstrate bias, ensuring your physical safety is never compromised.',
    relatedRights: ['Equality before the law', 'Right to fair employment', 'Right to non-discrimination'],
    relatedResources: ['Office of the High Commissioner for Human Rights (OHCHR)', 'National Equality Bodies'],
    multilingual: {
      en: { name: 'Discrimination', description: 'Unfair treatment based on identity characteristics.' },
      am: { name: 'አድልዎ (Discrimination)', description: 'በማንነት ላይ የተመሰረተ ኢ-ፍትሃዊ አያያዝ።' },
      om: { name: 'Loonummaa (Discrimination)', description: 'Amala eenyummaa irratti hundahuun looguu.' },
      so: { name: 'Takoorid (Discrimination)', description: 'La dhaqanka aan cadaalad ahayn ee ku salaysan aqoonsiga.' },
      ar: { name: 'التمييز (Discrimination)', description: 'المعاملة غير العادلة على أساس خصائص الهوية.' },
      fr: { name: 'Discrimination', description: 'Traitement injuste fondé sur des caractéristiques identitaires.' }
    }
  },
  {
    id: 'marginalization',
    name: 'Marginalization',
    description: 'Social exclusion of individuals or groups, pushing them to the edge of society and denying them resources.',
    educationalExplanation: 'Marginalization strips people of their voice and power, preventing full participation in social, economic, and civic life. It leaves communities vulnerable to systemic neglect and deprivation.',
    examples: [
      'Exclusion of indigenous groups from local governance and land decisions.',
      'Neglecting minority neighborhoods during development of infrastructure or clean water pipelines.',
      'Failing to translate public safety and health notices into local minority languages.'
    ],
    safetyGuidance: 'Focus on documenting systemic patterns and group disparities. Collaborate with local civil society organizations to document communal exclusion safely.',
    relatedRights: ['Right to participate in public life', 'Right to education', 'Social security benefits'],
    relatedResources: ['International Work Group for Indigenous Affairs', 'Minority Rights Group'],
    multilingual: {
      en: { name: 'Marginalization', description: 'Social exclusion and pushing groups to the edge.' },
      am: { name: 'ማግለል (Marginalization)', description: 'ሰዎችን ወይም ቡድኖችን ከማህበራዊ ህይወት ማግለል።' },
      om: { name: 'Dagatamuu (Marginalization)', description: 'Garee tokko hawaasummaa keessaa moggeessuu.' },
      so: { name: 'Gisitaad (Marginalization)', description: 'Ka saarida kooxaha ee nolosha bulshada.' },
      ar: { name: 'التهميش (Marginalization)', description: 'الاستبعاد الاجتماعي ودفع الفئات إلى الهامش.' },
      fr: { name: 'Marginalisation', description: 'Exclusion sociale et relégation des groupes à la périphérie.' }
    }
  },
  {
    id: 'oppression',
    name: 'Oppression',
    description: 'Prolonged cruel or unjust treatment or control by an authority power.',
    educationalExplanation: 'Oppression represents the systematic abuse of institutional power to restrict a group’s freedom, dignity, and survival. It often manifests as combined political, legal, and social restrictions.',
    examples: [
      'Total ban on public gatherings of specific communities or religious groups.',
      'Systematic surveillance and profiling of peaceful civic human-rights defenders.',
      'A widespread administrative regime that limits mobility and speech for entire populations.'
    ],
    safetyGuidance: 'When documenting widespread state or major authority oppression, use confidential or anonymous reporting tools. Prioritize your digital trail and physical security above all.',
    relatedRights: ['Freedom from tyranny', 'Right to liberty', 'Freedom of movement'],
    relatedResources: ['Amnesty International', 'Human Rights Watch'],
    multilingual: {
      en: { name: 'Oppression', description: 'Cruel or unjust exercise of authority.' },
      am: { name: 'ጭቆና (Oppression)', description: 'ስልጣንን በኃይልና በጭካኔ ተግባር ላይ ማዋልና መጫን።' },
      om: { name: 'Garbummaa (Oppression)', description: 'Bulchiinsa jal’aa fi hamaan cunqursuuf bal’isuu.' },
      so: { name: 'Caburis (Oppression)', description: 'Cadaadis joogto ah oo eex iyo naxariis darro ah.' },
      ar: { name: 'الاضطهاد (Oppression)', description: 'الممارسة القاسية أو غير العادلة للسلطة.' },
      fr: { name: 'Oppression', description: 'Exercice cruel ou injuste de l’autorité.' }
    }
  },
  {
    id: 'injustice',
    name: 'Injustice',
    description: 'Lack of fairness, violation of rights, or failure of legal systems to uphold justice.',
    educationalExplanation: 'Injustice occurs when the scales of fairness are broken, leading to biased court processes, lack of legal remedies, and unequal application of the law.',
    examples: [
      'Denial of legal counsel or a fair hearing in a civil or criminal matter.',
      'Different sentencing standards applied to citizens based on wealth or political connections.',
      'Refusal of authorities to investigate reported violent acts targeting minority members.'
    ],
    safetyGuidance: 'Document legal documents, official correspondence, and court dates. Avoid open defiance in highly volatile legal environments; seek professional, legal human-rights assistance.',
    relatedRights: ['Right to a fair trial', 'Equality before the law', 'Access to justice'],
    relatedResources: ['International Commission of Jurists', 'Local Legal Aid Associations'],
    multilingual: {
      en: { name: 'Injustice', description: 'Lack of fairness or violation of legal justice.' },
      am: { name: 'ኢፍትሃዊነት (Injustice)', description: 'ፍትህ ማጣት ወይም የህግ ስርዓቶች ፍትህን አለማስጠበቅ።' },
      om: { name: 'Jal’ina (Injustice)', description: 'Haqni dhabamuu fi seeraan walqixummaan dhabamuu.' },
      so: { name: 'Cadaalad-darro (Injustice)', description: 'Cadaalad la\'aan iyo ku xadgudubka xuquuqda.' },
      ar: { name: 'الظلم (Injustice)', description: 'غياب العدالة أو انتهاك العدالة القانونية.' },
      fr: { name: 'Injustice', description: 'Manque d’équité ou violation de la justice légale.' }
    }
  },
  {
    id: 'exploitation',
    name: 'Exploitation',
    description: 'The action of treating someone unfairly in order to benefit from their work or resources.',
    educationalExplanation: 'Exploitation takes advantage of power imbalances, forcing vulnerable individuals into highly dangerous, underpaid, or abusive labor conditions.',
    examples: [
      'Forced labor, human trafficking, or non-payment of agreed wages under threat of deportation.',
      'Exploitation of children in factories, fields, or hazardous mining activities.',
      'Confiscating a migrant worker\'s passport to prevent them from leaving an abusive employer.'
    ],
    safetyGuidance: 'Collect copies of contracts, identity documents, and payment histories. Never confront organized trafficking rings directly; contact international support agencies securely.',
    relatedRights: ['Freedom from forced labor', 'Children\'s rights', 'Right to fair wages'],
    relatedResources: ['International Labour Organization (ILO)', 'Walk Free Foundation'],
    multilingual: {
      en: { name: 'Exploitation', description: 'Unfair treatment of individuals for benefit.' },
      am: { name: 'ብዝበዛ (Exploitation)', description: 'የሰውን ጉልበት ወይም ንብረትን ያለአግባብ መበዝበዝ።' },
      om: { name: 'Saamichaa (Exploitation)', description: 'Nama cunqursuun fayyadama argachuuf hojjechiisuu.' },
      so: { name: 'Faa\'iidaysi xun (Exploitation)', description: 'U la dhaqanka dadka si aan cadaalad ahayn si looga faa\'iideysto.' },
      ar: { name: 'الاستغلال (Exploitation)', description: 'المعاملة غير العادلة للأفراد لتحقيق المنفعة.' },
      fr: { name: 'Exploitation', description: 'Traitement injuste d’individus à des fins lucratives.' }
    }
  },
  {
    id: 'suppression',
    name: 'Suppression',
    description: 'The forcible prevention of public activities, speech, or political participation.',
    educationalExplanation: 'Suppression aims to silence opposition, dismantle independent journalism, and crush civic activism to maintain absolute control over information and representation.',
    examples: [
      'Shutting down news outlets or arresting journalists covering protests.',
      'Using violence or excessive teargas to break up peaceful assembly and marches.',
      'Preventing the registration of independent civic rights organizations.'
    ],
    safetyGuidance: 'Utilize digital encryption tools for communication. Document events using secure backup features to prevent police confiscation of physical devices from destroying evidence.',
    relatedRights: ['Freedom of expression', 'Freedom of peaceful assembly', 'Press freedom'],
    relatedResources: ['Reporters Without Borders', 'Committee to Protect Journalists (CPJ)'],
    multilingual: {
      en: { name: 'Suppression', description: 'Forcible prevention of expression or activities.' },
      am: { name: 'ማፈን (Suppression)', description: 'ሀሳብን፣ እንቅስቃሴን ወይም የፖለቲካ ተሳትፎን በሃይል ማፈን።' },
      om: { name: 'Dhaabuu (Suppression)', description: 'Humnaan yaada yookaan sochii mirgaa ugguruu.' },
      so: { name: 'Caburin (Suppression)', description: 'Si xoog ah ku joojinta waxqabadka dadweynaha ama hadalka.' },
      ar: { name: 'القمع (Suppression)', description: 'المنع القسري للتعبير عن الرأي أو الأنشطة.' },
      fr: { name: 'Suppression', description: 'Empêchement forcé de l’expression ou des activités.' }
    }
  },
  {
    id: 'subjugation',
    name: 'Subjugation',
    description: 'Bringing a group under complete control or dominance, stripping them of autonomy.',
    educationalExplanation: 'Subjugation enforces a state of dependency and inferiority on a population, dismantling their cultural, legal, and economic self-determination.',
    examples: [
      'Enforcing laws that prevent women from traveling, working, or studying without male guardian permission.',
      'Placing regional governance completely in the hands of outside military administrators.',
      'Systematic disarmament and denial of property ownership rights to target minority clans.'
    ],
    safetyGuidance: 'Identify and document legal decrees, proclamations, or military orders. Prioritize secure organizational lines to maintain communications with international advocates.',
    relatedRights: ['Right to self-determination', 'Gender equality', 'Freedom of property'],
    relatedResources: ['UN Women', 'Unrepresented Nations and Peoples Organization (UNPO)'],
    multilingual: {
      en: { name: 'Subjugation', description: 'Enforced subordination and loss of autonomy.' },
      am: { name: 'ማስገበር (Subjugation)', description: 'አንድን ማህበረሰብ ሙሉ በሙሉ በቁጥጥር ስር በማዋል ነጻነቱን መንሳት።' },
      om: { name: 'Mata jala galchuu (Subjugation)', description: 'Mirga ofiin of bulchuu dhabsiisuun bituu.' },
      so: { name: 'Kaddib-dhigid (Subjugation)', description: 'Keenista dad hoos yimaada maamul buuxa oo awood leh.' },
      ar: { name: 'الإخضاع (Subjugation)', description: 'التبعية القسرية وفقدان الحكم الذاتي.' },
      fr: { name: 'Subjugation', description: 'Subordination forcée et perte d’autonomie.' }
    }
  },
  {
    id: 'persecution',
    name: 'Persecution',
    description: 'Hostility and ill-treatment, especially because of race or political or religious beliefs.',
    educationalExplanation: 'Persecution represents targeted harassment, legal harassment, or physical violence carried out against a specific group to drive them out or force conversion/capitulation.',
    examples: [
      'State-sanctioned violence or burning of religious minority places of worship.',
      'Arresting individuals solely for expressing peaceful political views or holding dissenting opinions.',
      'Widespread online and physical smear campaigns inciting violence against vulnerable minorities.'
    ],
    safetyGuidance: 'Create off-site encrypted backups of threat messages, public declarations, and incidents. Keep digital evidence safe and prepare emergency evacuation plans if violence escalates.',
    relatedRights: ['Freedom of religion or belief', 'Freedom of thought', 'Right to seek asylum'],
    relatedResources: ['UN High Commissioner for Refugees (UNHCR)', 'Open Doors'],
    multilingual: {
      en: { name: 'Persecution', description: 'Targeted hostility or systematic ill-treatment.' },
      am: { name: 'ስደትና ጥቃት (Persecution)', description: 'በዘር፣ በሃይማኖት ወይም በፖለቲካ አመለካከት ምክንያት የሚደርስ ስደትና እንግልት።' },
      om: { name: 'Ari’atama (Persecution)', description: 'Amantii yookaan siyaasaaf jecha miidhuu fi ari’uu.' },
      so: { name: 'Silcin (Persecution)', description: 'Cadaawad iyo dhibaateyn joogto ah oo ku salaysan aaminsanaanta.' },
      ar: { name: 'الاضطهاد المستهدف (Persecution)', description: 'العداء المستهدف أو سوء المعاملة المنهجية.' },
      fr: { name: 'Persécution', description: 'Hostilité ciblée ou mauvais traitements systématiques.' }
    }
  },
  {
    id: 'human_rights_violations',
    name: 'Human Rights Violations',
    description: 'Direct breach of fundamental rights guaranteed under international human-rights covenants.',
    educationalExplanation: 'Any act by state or non-state actors that actively undermines, restricts, or denies fundamental civil, political, economic, social, or cultural rights.',
    examples: [
      'Extrajudicial killings, torture, or degrading treatment of prisoners.',
      'Arbitrary arrests of human rights advocates without immediate presentation to judicial authority.',
      'Forced labor or Denial of primary education to specific demographics.'
    ],
    safetyGuidance: 'Document physical evidence of abuse, medical reports, and arrest certificates. Share reports via secure communication channels using end-to-end encryption.',
    relatedRights: ['Freedom from torture', 'Right to life', 'Right to physical integrity'],
    relatedResources: ['Universal Declaration of Human Rights (UDHR)', 'Amnesty International'],
    multilingual: {
      en: { name: 'Human Rights Violations', description: 'Direct breach of international human-rights laws.' },
      am: { name: 'የሰብአዊ መብቶች ጥሰት (Human Rights Violations)', description: 'በአለም አቀፍ ስምምነቶች የተረጋገጡ ሰብአዊ መብቶችን መጣስ።' },
      om: { name: 'Miidhaa Mirga Namummaa (Human Rights Violations)', description: 'Mirgoota namummaa seeraan mirkanaayan cabsuu.' },
      so: { name: 'Xadgudubyada Xuquuqda Aadanaha (Human Rights Violations)', description: 'Ku xadgudubka tooska ah ee xuquuqda aadanaha.' },
      ar: { name: 'انتهاكات حقوق الإنسان (Human Rights Violations)', description: 'الانتهاك المباشر لقوانين حقوق الإنسان الدولية.' },
      fr: { name: 'Violations des Droits de l’Homme', description: 'Violation directe des lois internationales sur les droits de l’homme.' }
    }
  },
  {
    id: 'segregation',
    name: 'Segregation',
    description: 'Enforced separation of different racial, national, or religious groups in daily life.',
    educationalExplanation: 'Segregation establishes a hierarchy of human dignity by separating groups in spatial, educational, public, and social environments, creating inherently unequal treatment.',
    examples: [
      'Establishing separate medical facilities, public transport, or educational standards for different ethnic groups.',
      'Zoning laws that legally prohibit specific communities from purchasing property in designated districts.',
      'Banning inter-ethnic marriage or social gatherings under administrative penalty.'
    ],
    safetyGuidance: 'Document institutional laws, local signs, and discriminatory practices. Do not put yourself in danger of legal or physical retaliation in segregated communities.',
    relatedRights: ['Freedom of movement', 'Right to equality', 'Social inclusion'],
    relatedResources: ['Anti-Discrimination Legal Centers', 'Human Rights Education Projects'],
    multilingual: {
      en: { name: 'Segregation', description: 'Enforced systemic spatial separation of groups.' },
      am: { name: 'ዘረኛ መለያየት (Segregation)', description: 'የሰዎችን ስብስብ በዘር፣ በጎሳ ወይም በሃይማኖት ለይቶ ማኖር።' },
      om: { name: 'Addaan Baasuu (Segregation)', description: 'Sanyii yookaan amantiin namoota gargar qoodanii hidhuu.' },
      so: { name: 'Saddexaynta/Kala-sooca (Segregation)', description: 'Kala saarista qasabka ah ee kooxaha bulshada.' },
      ar: { name: 'الفصل العنصري (Segregation)', description: 'الفصل المكاني والمنهجي القسري للمجموعات.' },
      fr: { name: 'Ségrégation', description: 'Séparation spatiale et systémique forcée des groupes.' }
    }
  },
  {
    id: 'systemic_bias',
    name: 'Systemic Bias',
    description: 'Inherent, institutionalized prejudices within operational frameworks that disadvantage certain populations.',
    educationalExplanation: 'Systemic bias is often invisible or codified into algorithms, credit scoring, school selection systems, and civil service recruitment, producing consistently biased outcomes without explicit malice.',
    examples: [
      'Automated welfare algorithms that systematically deny aid to specific geographic regions.',
      'Standardized civil hiring procedures that penalize candidates speaking local regional languages.',
      'Financial institutional policies systematically refusing standard business loans to minority-owned areas.'
    ],
    safetyGuidance: 'Identify statistical patterns, operational rules, and comparative case data. Share structural analysis with research and academic policy institutions.',
    relatedRights: ['Equal protection of the law', 'Right to work', 'Right to fair opportunities'],
    relatedResources: ['Digital Freedom Fund', 'Center for Systemic Justice'],
    multilingual: {
      en: { name: 'Systemic Bias', description: 'Institutionalized prejudices embedded in operations.' },
      am: { name: 'ስልታዊ አድልዎ (Systemic Bias)', description: 'በተቋማዊ አሰራር ውስጥ የሚገኙ እና ሰዎችን የሚጎዱ አድልዎዎች።' },
      om: { name: 'Loonummaa Sirnaa (Systemic Bias)', description: 'Sirnoota keessatti loogummaa dhokatee jiru.' },
      so: { name: 'Eexda Nidaamka (Systemic Bias)', description: 'Eexda ku dhex jirta hay\'adaha iyo habraacyada shaqada.' },
      ar: { name: 'الانحياز المنهجي (Systemic Bias)', description: 'التحيزات المؤسسية المتأصلة في العمليات.' },
      fr: { name: 'Biais Systémique', description: 'Préjugés institutionnalisés ancrés dans le fonctionnement.' }
    }
  },
  {
    id: 'disenfranchisement',
    name: 'Disenfranchisement',
    description: 'The revocation of the right to vote or active obstruction of democratic participation.',
    educationalExplanation: 'Disenfranchisement strips citizens of their ultimate peaceful mechanism for representation, accountability, and reform. It dilutes the democratic voice of entire communities.',
    examples: [
      'Implementing arbitrary literacy or tax tests to block specific groups from voter registration.',
      'Purging voter rolls of minority communities shortly before scheduled democratic elections.',
      'Arbitrarily removing physical polling stations from minority neighborhoods, making voting impossible.'
    ],
    safetyGuidance: 'Document voting irregularities, policy updates, and registration denials. Secure screenshots of voter registration databases showing arbitrary cancellations.',
    relatedRights: ['Right to vote', 'Right to democratic participation', 'Freedom of association'],
    relatedResources: ['International Foundation for Electoral Systems (IFES)', 'Civic Participation Network'],
    multilingual: {
      en: { name: 'Disenfranchisement', description: 'Obstruction of the right to vote and participate.' },
      am: { name: 'መብት መንሳት (Disenfranchisement)', description: 'የመምረጥ ወይም በዲሞክራሲያዊ ሂደቶች የመሳተፍ መብትን መከልከል።' },
      om: { name: 'Mirga Sagalee Dhabsiisuu (Disenfranchisement)', description: 'Mirga filachuu fi filatamuu dhabsiisuu.' },
      so: { name: 'Qadiyad ka-qaadid (Disenfranchisement)', description: 'Horistaaga xuquuqda cod bixinta ama ka qeybgalka doorashada.' },
      ar: { name: 'الحرمان من الحقوق (Disenfranchisement)', description: 'عرقلة الحق في التصويت والمشاركة الديمقراطية.' },
      fr: { name: 'Privation de Droits', description: 'Obstruction du droit de vote et de participation.' }
    }
  },
  {
    id: 'censorship',
    name: 'Censorship',
    description: 'Suppression or prohibition of speech, writing, art, or information by state or non-state authorities.',
    educationalExplanation: 'Censorship is a structural tool used to restrict access to diverse ideas, block human-rights documentation, and prevent critical investigation of administrative actions.',
    examples: [
      'Shutting down regional mobile networks or restricting access to social media during public protests.',
      'Mandating official approval or deletion of independent journalistic articles prior to publication.',
      'Arresting authors, academic scholars, or internet bloggers for publishing historical documents.'
    ],
    safetyGuidance: 'Use secure Virtual Private Networks (VPNs) and localized offline mesh networks where available. Save text drafts offline and share through end-to-end encrypted backup channels.',
    relatedRights: ['Freedom of expression', 'Right to seek and receive information', 'Academic freedom'],
    relatedResources: ['Amnesty International', 'Access Now'],
    multilingual: {
      en: { name: 'Censorship', description: 'Suppression of speech, writing, or information.' },
      am: { name: 'ሳንሱር (Censorship)', description: 'ጽሁፎችን፣ ጥበቦችን ወይም መረጃዎችን በባለስልጣናት ማፈን ወይም መከልከል።' },
      om: { name: 'Uggura Yaadaa (Censorship)', description: 'Yaada barruu fi holola seeraan dhabuuf uggura kaahuu.' },
      so: { name: 'Faafreeb (Censorship)', description: 'Mamnuucista ama caburinta hadalka ama macluumaadka.' },
      ar: { name: 'الرقابة (Censorship)', description: 'قمع التعبير عن الرأي أو منع تدفق المعلومات.' },
      fr: { name: 'Censure', description: 'Suppression de la parole, des écrits ou de l’information.' }
    }
  },
  {
    id: 'structural_oppression',
    name: 'Structural Oppression',
    description: 'Systemic barriers embedded within legal, cultural, and economic systems that permanently disadvantage groups.',
    educationalExplanation: 'Unlike individual acts of bias, structural oppression occurs when several interlocking systems (educational, housing, medical, legal) combine to keep a group subordinate.',
    examples: [
      'A legal framework that denies property land inheritance rights to women across generations.',
      'Unequal distribution of state funding, leaving minority-majority schools with no fundamental resources.',
      'Codified system where civil dispute resolutions prioritize testimonies of one social group over another.'
    ],
    safetyGuidance: 'Document systemic patterns and policy intersections. Focus reporting on legal frameworks, historical policies, and structural disparities safely.',
    relatedRights: ['Right to equality', 'Social security benefits', 'Cultural protection rights'],
    relatedResources: ['International Covenant on Economic, Social and Cultural Rights', 'UN Development Programme (UNDP)'],
    multilingual: {
      en: { name: 'Structural Oppression', description: 'Systemic, interlocking legal and cultural barriers.' },
      am: { name: 'መዋቅራዊ ጭቆና (Structural Oppression)', description: 'በህግ፣ በባህልና በኢኮኖሚ ውስጥ ስር የሰደዱ እና የተወሰኑ ሰዎችን የሚጎዱ መሰናክሎች።' },
      om: { name: 'Cunqursaa Sirnaa (Structural Oppression)', description: 'Miidhaa sirnoota seeraa fi dinagdee keessatti diriire.' },
      so: { name: 'Caburinta Habdhismeedka (Structural Oppression)', description: 'Dhibaatooyinka ku dhex milmay sharciga iyo dhaqaalaha.' },
      ar: { name: 'الاضطهاد الهيكلي (Structural Oppression)', description: 'العوائق القانونية والثقافية المنهجية المتداخلة.' },
      fr: { name: 'Oppression Structurelle', description: 'Barrières systémiques imbriquées (légales, culturelles).' }
    }
  },
  {
    id: 'economic_inequality',
    name: 'Economic Inequality',
    description: 'Systemic gaps in distribution of assets, wealth, and basic economic opportunities.',
    educationalExplanation: 'Extreme economic inequality is often a human-rights violation when driven by active exclusion, corruption, and denial of basic labor and social rights to marginalized classes.',
    examples: [
      'Denying marginalized groups access to primary agricultural resources or public banking facilities.',
      'Deliberate failure of government to provide primary schools and clean water resources to specific ethnic areas.',
      'Exploitative labor policies restricting minimum-wage rules to exclude specific minority immigrant workforces.'
    ],
    safetyGuidance: 'Document financial rules, local funding allocations, and public resources. Collaborate with economic policy and development watchdogs safely.',
    relatedRights: ['Right to an adequate standard of living', 'Right to fair work conditions', 'Economic security'],
    relatedResources: ['Oxfam International', 'World Bank Group Office of Ethics'],
    multilingual: {
      en: { name: 'Economic Inequality', description: 'Active systemic exclusion from financial opportunities.' },
      am: { name: 'የኢኮኖሚ እኩልነት ማጣት (Economic Inequality)', description: 'በሀብትና በኢኮኖሚ እድሎች ላይ የሚታይ ግልጽ መዋቅራዊ ልዩነት።' },
      om: { name: 'Qoodinsa Dinagdee Jal’aa (Economic Inequality)', description: 'Carraalee dinagdee fi qabeenyaa argachuu dhabuu.' },
      so: { name: 'Sinnaan-la\'aanta Dhaqaalaha (Economic Inequality)', description: 'Farqiga weyn ee dhinaca hantida iyo fursadaha dhaqaale.' },
      ar: { name: 'عدم المساواة الاقتصادية (Economic Inequality)', description: 'الفجوات المنهجية في توزيع الثروات والفرص.' },
      fr: { name: 'Inégalités Économiques', description: 'Écarts systémiques dans la répartition des richesses.' }
    }
  },
  {
    id: 'dehumanization',
    name: 'Dehumanization',
    description: 'The psychological process of demonizing and portraying a group of people as subhuman or inherently evil.',
    educationalExplanation: 'Dehumanization is a primary cognitive catalyst for mass atrocities and systemic violence. It lowers psychological barriers to abuse by stripping individuals of their human identity.',
    examples: [
      'State-sponsored broadcasts or newspapers comparing minority groups to insects, diseases, or animals.',
      'Public educational curriculum portraying specific ethnic groups as historically subhuman or violent.',
      'Codifying laws that declare specific classes of humans as biological threats to national security.'
    ],
    safetyGuidance: 'Collect physical or digital copies of broadcast recordings, publications, and textbooks. Do not interact directly with hate mobs; prioritize personal safety and report anonymously.',
    relatedRights: ['Right to human dignity', 'Protection from incitement to hatred', 'Right to personal safety'],
    relatedResources: ['Sentinel Project', 'UN Office on Genocide Prevention'],
    multilingual: {
      en: { name: 'Dehumanization', description: 'Portraying groups as subhuman or inherently evil.' },
      am: { name: 'ሰብአዊነትን ማሳጣት (Dehumanization)', description: 'ሰዎችን ከሰው በታች አድርጎ ማሳየት ወይም ማራከስ።' },
      om: { name: 'Namummaa Salphisuu (Dehumanization)', description: 'Eenyummaa namaa xiqqeessanii arguu fi balleessuu.' },
      so: { name: 'Aadaminnimo-ka-qaadid (Dehumanization)', description: 'U muujinta koox dad ah sidii xayawaan ama wax xun.' },
      ar: { name: 'تجريد من الإنسانية (Dehumanization)', description: 'تصوير مجموعات من البشر على أنهم غير شرعيين أو حيوانات.' },
      fr: { name: 'Déshumanisation', description: 'Processus visant à rabaisser ou diaboliser un groupe.' }
    }
  },
  {
    id: 'arbitrary_detention',
    name: 'Arbitrary Detention',
    description: 'The arrest or detention of an individual by a government or authority without proper legal basis or due process.',
    educationalExplanation: 'No person should be deprived of their liberty arbitrarily. Detention is arbitrary if it lacks legal justification, violates international standards, or targets individuals for expressing their rights.',
    examples: [
      'Arresting and keeping human rights defenders in prison without filing formal legal charges.',
      'Holding individuals in secret or unofficial detention sites without access to lawyers or family members.',
      'Detaining political opponents indefinitely under emergency decree without judicial oversight.'
    ],
    safetyGuidance: 'Obtain detention center names, specific dates, arresting officers\' units, and case file numbers. Share information with legal aid and prisoner advocacy organizations immediately.',
    relatedRights: ['Freedom from arbitrary arrest', 'Right to habeas corpus', 'Right to legal representation'],
    relatedResources: ['UN Working Group on Arbitrary Detention', 'Amnesty International'],
    multilingual: {
      en: { name: 'Arbitrary Detention', description: 'Arrest or imprisonment without proper legal basis.' },
      am: { name: 'ያለአግባብ መታሰር (Arbitrary Detention)', description: 'አንድን ሰው ያለምንም ህጋዊ መሰረት ወይም የፍርድ ቤት ትዕዛዝ ማሰር።' },
      om: { name: 'Hidhaa Seeraan Alaa (Arbitrary Detention)', description: 'Seeraan ala yookaan mana murtiitti hin dhiyaatin nama hidhuu.' },
      so: { name: 'Xarig aan Sharciga waafaqsanayn (Arbitrary Detention)', description: 'Xadhiga qofka oo aan loo cuskan dambi rasmi ah.' },
      ar: { name: 'الاحتجاز التعسفي (Arbitrary Detention)', description: 'الاعتقال أو السجن دون سند قانوني أو محاكمة عادلة.' },
      fr: { name: 'Détention Arbitraire', description: 'Arrestation ou détention sans fondement légal.' }
    }
  },
  {
    id: 'forced_displacement',
    name: 'Forced Displacement',
    description: 'Coerced movement of individuals or populations away from their home region, often due to persecution or violence.',
    educationalExplanation: 'Forced displacement strips people of their homes, communities, livelihoods, and history, creating severe humanitarian crises and statelessness vulnerability.',
    examples: [
      'Military forces clearing out entire minority villages under the guise of security operations.',
      'Forced eviction of poor urban neighborhoods for commercial developments without compensation.',
      'Creating life-threatening living conditions to force specific religious groups to emigrate.'
    ],
    safetyGuidance: 'Document physical movement, eviction notices, and destruction of buildings. Save maps of routes and gather community contact details to track displaced families.',
    relatedRights: ['Right to housing', 'Freedom of residence', 'Protection from displacement'],
    relatedResources: ['UN High Commissioner for Refugees (UNHCR)', 'Internal Displacement Monitoring Centre (IDMC)'],
    multilingual: {
      en: { name: 'Forced Displacement', description: 'Coerced evictions or removal from housing and homeland.' },
      am: { name: 'በግዳጅ መፈናቀል (Forced Displacement)', description: 'ሰዎችን ከቀያቸው በሃይል ማፈናቀል ወይም ማባረር።' },
      om: { name: 'Baqachiisa Humnaa (Forced Displacement)', description: 'Humnaan nama qubannoo isaa irraa buqqisuu.' },
      so: { name: 'Barakicin Qasab ah (Forced Displacement)', description: 'Ku qasbidda dadka inay ka baxaan dhulkooda.' },
      ar: { name: 'النزوح القسري (Forced Displacement)', description: 'إجبار السكان على مغادرة منازلهم وموطنهم.' },
      fr: { name: 'Déplacement Forcé', description: 'Expulsion forcée ou éloignement de son lieu de vie.' }
    }
  },
  {
    id: 'cultural_erasure',
    name: 'Cultural Erasure',
    description: 'The deliberate destruction, banning, or systemic dismantling of a group\'s cultural heritage, language, or practices.',
    educationalExplanation: 'Cultural erasure seeks to assimilate or wipe out a group\'s identity, destroying historical artifacts, language rights, and religious freedom to enforce cultural uniformity.',
    examples: [
      'Banning the teaching or public speaking of minority languages in regional schools.',
      'Deliberate demolition of ancient religious sites, community monuments, or historical archives.',
      'Forced assimilation programs placing indigenous children in state boarding schools to erase heritage.'
    ],
    safetyGuidance: 'Document language prohibitions, state decrees, and the destruction of cultural sites. Save photographs, books, and digital archives of regional heritage in secure servers.',
    relatedRights: ['Cultural rights', 'Freedom of language', 'Right to education'],
    relatedResources: ['UNESCO Cultural Heritage Division', 'Endangered Languages Project'],
    multilingual: {
      en: { name: 'Cultural Erasure', description: 'Dismantling or banning language and cultural heritage.' },
      am: { name: 'ባህላዊ ማንነትን ማጥፋት (Cultural Erasure)', description: 'የአንድን ማህበረሰብ ባህል፣ ቋንቋ ወይም ቅርሶች ሆን ብሎ ማጥፋት።' },
      om: { name: 'Aadaa Balleessuu (Cultural Erasure)', description: 'Beekumsaan aadaa fi afaan garee tokkoo akka badu gochuu.' },
      so: { name: 'Tirtiridda Dhaqanka (Cultural Erasure)', description: 'Burburinta ama mamnuucista hiddaha iyo dhaqanka.' },
      ar: { name: 'المحو الثقافي (Cultural Erasure)', description: 'التدمير المتعمد للتراث الثقافي أو منع ممارسة اللغة.' },
      fr: { name: 'Effacement Culturel', description: 'Destruction ou interdiction systématique de la culture et de la langue.' }
    }
  },
  {
    id: 'police_brutality',
    name: 'Police Brutality',
    description: 'The excessive and unlawful use of physical force, violence, or intimidation by law enforcement officers.',
    educationalExplanation: 'Law enforcement must operate under the rule of law. Police brutality violates physical safety and security rights, transforming public defenders into sources of trauma.',
    examples: [
      'Unlawful physical beatings or use of lethal weapons against peaceful protesters.',
      'Assaulting, threatening, or torturing individuals during custody or interrogation.',
      'Unjustified and violent raids of houses targeting civil activists or minority advocates.'
    ],
    safetyGuidance: 'Obtain officer names, badge numbers, police unit markings, and vehicle numbers if safe to do so. Gather immediate medical documentation and eye-witness statements.',
    relatedRights: ['Freedom from torture', 'Right to physical integrity', 'Equal security of person'],
    relatedResources: ['International Network of Civil Liberties Organizations', 'Local Human Rights Observers'],
    multilingual: {
      en: { name: 'Police Brutality', description: 'Excessive, unlawful use of physical force by law enforcement.' },
      am: { name: 'የፖሊስ ጭካኔ (Police Brutality)', description: 'በህግ አስከባሪዎች የሚፈጸም አግባብ ያልሆነ የሃይል አጠቃቀም ወይም ድብደባ።' },
      om: { name: 'Miidhaa Poolisii (Police Brutality)', description: 'Poolisiidhaan humna seeraan alaa fi miidhaa garmalee geessuu.' },
      so: { name: 'Xadgudubka Booliska (Police Brutality)', description: 'Adeegsiga xoog xad-dhaaf ah oo boolisku kula kaco dadka.' },
      ar: { name: 'وحشية الشرطة (Police Brutality)', description: 'الاستخدام المفرط وغير القانوني للقوة من قبل الشرطة.' },
      fr: { name: 'Brutalité Policière', description: 'Usage excessif et illégal de la force par la police.' }
    }
  }
];
