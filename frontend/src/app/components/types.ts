export interface Grade {
  subject_name: string;
  ca1: number;
  ca2: number;
  assignment: number;
  exam: number;
  total_score: string;
  grade: string;
  grade_remark: string;
}

export interface ResultData {
  school: {
    motto?: string;
    address: string;
    principal_name: string;
  };
  session: {
    term_name: string;
    name: string;
  };
  student: {
    full_name: string;
    admission_number: string;
    class_name: string;
    gender: string;
  };
  performance: {
    student_average: string;
    position?: number;
    class_size?: number;
  };
  grades: Grade[];
  psychomotor?: Record<string, string | number>;
}

export function gradeBadge(grade: string): string {
  if (grade === 'A1') return 'grade-badge g-a1';
  if (['B2', 'B3'].includes(grade)) return 'grade-badge g-b';
  if (['C4', 'C5', 'C6'].includes(grade)) return 'grade-badge g-c';
  if (grade === 'D7') return 'grade-badge g-d';
  if (grade === 'E8') return 'grade-badge g-e';
  return 'grade-badge g-f';
}

export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const PSYCHO_LABELS: Record<string, string> = {
  punctuality: 'Punctuality',
  neatness: 'Neatness',
  politeness: 'Politeness',
  honesty: 'Honesty',
  leadership: 'Leadership',
  cooperation: 'Cooperation',
  sports_games: 'Sports & Games',
  handwork_crafts: 'Handwork & Crafts',
  drawing_painting: 'Drawing & Painting',
};
