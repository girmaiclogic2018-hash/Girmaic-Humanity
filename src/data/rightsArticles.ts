/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RightsArticle } from '../types';

export const rightsArticles: RightsArticle[] = [
  {
    id: 'equality',
    title: 'Equality Before The Law',
    category: 'Equality',
    summary: 'The principle that each independent individual must be treated equally by the law and is entitled to equal protection.',
    fullExplanation: 'All human beings are born free and equal in dignity and rights. Equality before the law, also known as legal egalitarianism, means that all citizens are subject to the same laws of justice without any special privileges. The law must apply to everyone equally, regardless of race, gender, nationality, religion, or background.',
    multilingual: {
      en: {
        title: 'Equality Before The Law',
        summary: 'All citizens are equal under the law.',
        fullExplanation: 'Every individual is entitled to equal protection of the law and equal opportunities, free from arbitrary privilege or discrimination.'
      },
      am: {
        title: 'በህግ ፊት እኩልነት (Equality Before The Law)',
        summary: 'ሁሉም ዜጎች በህግ ፊት እኩል ናቸው።',
        fullExplanation: 'ማንኛውም ሰው በህግ ፊት እኩል ጥበቃ የማግኘት መብት አለው። ያለምንም ልዩነት የህግ ጥበቃ ይደረግለታል።'
      }
    },
    source: 'Universal Declaration of Human Rights (UDHR) - Article 7',
    sourceUrl: 'https://www.un.org/en/about-us/universal-declaration-of-human-rights',
    jurisdiction: 'International / Universal',
    publicationDate: '1948-12-10',
    lastReviewed: '2026-08-15',
    reviewStatus: 'verified'
  },
  {
    id: 'freedom_expression',
    title: 'Freedom of Expression',
    category: 'Freedom of expression',
    summary: 'The right of every individual to hold opinions and seek, receive, and impart information through any media.',
    fullExplanation: 'Freedom of expression is a cornerstone of democratic society. It enables peaceful dissent, independent journalism, creative exploration, and political debate. It includes the freedom to hold opinions without interference and to seek, receive and impart information and ideas through any media and regardless of frontiers.',
    multilingual: {
      en: {
        title: 'Freedom of Expression',
        summary: 'Right to hold opinions and share information.',
        fullExplanation: 'This right protects peaceful speech, artistic work, and critical journalism from arbitrary state censorship or suppression.'
      },
      am: {
        title: 'የሃሳብን በነጻነት የመግለጽ መብት (Freedom of Expression)',
        summary: 'ሀሳብን በነጻነት የመግለጽ እና መረጃ የማጋራት መብት።',
        fullExplanation: 'ማንኛውም ሰው ያለማንም ጣልቃ ገብነት የራሱን አመለካከት የመያዝና ሃሳቡን በንግግርም ሆነ በጽሁፍ የመግለጽ መብት አለው።'
      }
    },
    source: 'International Covenant on Civil and Political Rights (ICCPR) - Article 19',
    sourceUrl: 'https://www.ohchr.org/en/instruments-mechanisms/instruments/international-covenant-civil-and-political-rights',
    jurisdiction: 'International / Universal',
    publicationDate: '1966-12-16',
    lastReviewed: '2026-08-20',
    reviewStatus: 'verified'
  },
  {
    id: 'due_process',
    title: 'Due Process & Fair Trial',
    category: 'Due process',
    summary: 'The legal requirement that the state must respect all legal rights that are owed to a person under the law.',
    fullExplanation: 'Due process secures protection against arbitrary treatment by authority and guarantees a fair, public trial by an independent, impartial court. Every person accused of a crime is presumed innocent until proven guilty according to law in a public trial at which they have had all the guarantees necessary for their defense.',
    multilingual: {
      en: {
        title: 'Due Process & Fair Trial',
        summary: 'Guarantees of legal fairness and representation.',
        fullExplanation: 'Guarantees that no person is convicted without fair presentation of evidence, access to independent counsel, and a public trial.'
      },
      am: {
        title: 'ፍትሃዊ የዳኝነት ሂደት (Due Process)',
        summary: 'ፍትሃዊ የህግ ሂደት እና የመከላከል መብት ማግኘት።',
        fullExplanation: 'ማንኛውም ሰው ከመፈረዱ በፊት በገለልተኛ አካል ፍትሃዊ በሆነ ህዝባዊ ችሎት የመዳኘት እና የመከላከል መብቱ እንዲከበርለት ይደረጋል።'
      }
    },
    source: 'UDHR - Article 10 & 11',
    sourceUrl: 'https://www.un.org/en/about-us/universal-declaration-of-human-rights',
    jurisdiction: 'International / Universal',
    publicationDate: '1948-12-10',
    lastReviewed: '2026-09-01',
    reviewStatus: 'verified'
  },
  {
    id: 'digital_rights',
    title: 'Digital Rights & Online Privacy',
    category: 'Digital rights',
    summary: 'Human rights applied in the digital realm, protecting internet access, encryption, and digital confidentiality.',
    fullExplanation: 'Digital rights are human rights in the internet era. They protect individuals from mass surveillance, unlawful data mining, state-ordered internet shutdowns, and digital censorship. Privacy in the digital world is a prerequisite for exercising free speech, organizing peaceful movements, and maintaining secure human-rights documentation.',
    multilingual: {
      en: {
        title: 'Digital Rights & Online Privacy',
        summary: 'Human rights protections in the digital and online world.',
        fullExplanation: 'Protects communication privacy, bans arbitrary network shutdowns, and safeguards secure personal digital encryption.'
      },
      am: {
        title: 'የዲጂታል መብቶች እና ግላዊነት (Digital Rights)',
        summary: 'በይነመረብ ላይ ያሉ ሰብአዊ መብቶች ጥበቃ።',
        fullExplanation: 'በዲጂታል ዓለም ውስጥ ያሉ የግላዊነት፣ የመረጃ ደህንነት እና በይነመረብን ያለገደብ የመጠቀም መብቶችን ያጠቃልላል።'
      }
    },
    source: 'UN Human Rights Council Resolution on the promotion, protection and enjoyment of human rights on the Internet',
    sourceUrl: 'https://www.ohchr.org/en/internet',
    jurisdiction: 'International / Universal',
    publicationDate: '2016-07-01',
    lastReviewed: '2026-08-28',
    reviewStatus: 'verified'
  }
];
