import { SkillSentence } from '../types';
import { RAW_SKILL_SEED } from './seedData';

export const initialSkillsData: SkillSentence[] = RAW_SKILL_SEED.map((line, idx) => {
  const parts = line.split('|');
  return {
    id: `sk_${idx + 1}`,
    category: parts[0] || 'General',
    kannada: parts[1] || '',
    roman: parts[2] || '',
    deva: parts[3] || ''
  };
});
