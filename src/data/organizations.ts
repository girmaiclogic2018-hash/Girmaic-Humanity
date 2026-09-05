/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Organization } from '../types';

export const officialOrganizations: Organization[] = [
  {
    id: 'amnesty_international',
    name: 'Amnesty International',
    categories: ['Human-rights organizations', 'Anti-discrimination support', 'Legal aid'],
    description: 'A global movement of over 10 million people campaigning for a world where human rights are enjoyed by all.',
    contactEmail: 'contactus@amnesty.org',
    website: 'https://www.amnesty.org',
    status: 'VERIFIED',
    location: 'Global / United Kingdom'
  },
  {
    id: 'unhcr',
    name: 'UNHCR (United Nations High Commissioner for Refugees)',
    categories: ['Refugee assistance', 'Humanitarian assistance', 'Displacement'],
    description: 'The UN Refugee Agency is a global organization dedicated to saving lives, protecting rights and building a better future for refugees, forcibly displaced communities and stateless people.',
    contactEmail: 'unhcr@unhcr.org',
    website: 'https://www.unhcr.org',
    status: 'VERIFIED',
    location: 'Global / Switzerland'
  },
  {
    id: 'unicef',
    name: 'UNICEF (United Nations Children\'s Fund)',
    categories: ['Child protection', 'Humanitarian assistance'],
    description: 'UNICEF works in over 190 countries and territories to save children\'s lives, to defend their rights, and to help them fulfill their potential, from early childhood through adolescence.',
    contactEmail: 'unicef@unicef.org',
    website: 'https://www.unicef.org',
    status: 'VERIFIED',
    location: 'Global / United States'
  },
  {
    id: 'cpj',
    name: 'Committee to Protect Journalists (CPJ)',
    categories: ['Journalist support', 'Human-rights organizations'],
    description: 'An independent, nonprofit organization that promotes press freedom worldwide. We defend the right of journalists to report the news safely and without fear of reprisal.',
    contactEmail: 'info@cpj.org',
    website: 'https://cpj.org',
    status: 'VERIFIED',
    location: 'Global / United States'
  },
  {
    id: 'doctors_without_borders',
    name: 'Doctors Without Borders (MSF)',
    categories: ['Humanitarian assistance'],
    description: 'An international, independent medical humanitarian organization that provides medical assistance to people affected by conflict, epidemics, disasters, or exclusion from healthcare.',
    contactEmail: 'office@msf.org',
    website: 'https://www.msf.org',
    status: 'VERIFIED',
    location: 'Global / Switzerland'
  }
];
