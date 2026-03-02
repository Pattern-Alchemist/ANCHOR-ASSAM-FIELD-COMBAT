export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ContentType = 'drill' | 'lesson' | 'scenario';
export type Pillar = 'Striking' | 'Grappling' | 'Weapon Transitions' | 'Clinch' | 'Conditioning';

export interface SearchFilters {
  query: string;
  difficulty?: DifficultyLevel[];
  type?: ContentType[];
  pillar?: Pillar[];
  durationMin?: number;
  durationMax?: number;
  favorites?: boolean;
}

export interface Searchable {
  id: string;
  name: string;
  description?: string;
  difficulty?: DifficultyLevel;
  type?: ContentType;
  pillar?: Pillar;
  duration?: number;
  tags?: string[];
}

export function filterByQuery(items: Searchable[], query: string): Searchable[] {
  if (!query) return items;
  
  const lowerQuery = query.toLowerCase();
  return items.filter((item) => {
    const searchText = [
      item.name,
      item.description,
      ...(item.tags || []),
    ]
      .join(' ')
      .toLowerCase();
    
    return searchText.includes(lowerQuery);
  });
}

export function filterByDifficulty(
  items: Searchable[],
  difficulties: DifficultyLevel[]
): Searchable[] {
  if (!difficulties.length) return items;
  return items.filter((item) => item.difficulty && difficulties.includes(item.difficulty));
}

export function filterByType(items: Searchable[], types: ContentType[]): Searchable[] {
  if (!types.length) return items;
  return items.filter((item) => item.type && types.includes(item.type));
}

export function filterByPillar(items: Searchable[], pillars: Pillar[]): Searchable[] {
  if (!pillars.length) return items;
  return items.filter((item) => item.pillar && pillars.includes(item.pillar));
}

export function filterByDuration(
  items: Searchable[],
  minMinutes?: number,
  maxMinutes?: number
): Searchable[] {
  return items.filter((item) => {
    if (!item.duration) return false;
    if (minMinutes && item.duration < minMinutes) return false;
    if (maxMinutes && item.duration > maxMinutes) return false;
    return true;
  });
}

export function applyAllFilters(items: Searchable[], filters: SearchFilters): Searchable[] {
  let result = items;

  if (filters.query) {
    result = filterByQuery(result, filters.query);
  }

  if (filters.difficulty?.length) {
    result = filterByDifficulty(result, filters.difficulty);
  }

  if (filters.type?.length) {
    result = filterByType(result, filters.type);
  }

  if (filters.pillar?.length) {
    result = filterByPillar(result, filters.pillar);
  }

  if (filters.durationMin !== undefined || filters.durationMax !== undefined) {
    result = filterByDuration(result, filters.durationMin, filters.durationMax);
  }

  return result;
}

export function highlightQuery(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export const DURATION_RANGES = [
  { label: '5-10 min', min: 5, max: 10 },
  { label: '10-20 min', min: 10, max: 20 },
  { label: '20-30 min', min: 20, max: 30 },
  { label: '30+ min', min: 30, max: Infinity },
];

export const DIFFICULTY_LEVELS: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

export const PILLARS: Pillar[] = [
  'Striking',
  'Grappling',
  'Weapon Transitions',
  'Clinch',
  'Conditioning',
];

export const CONTENT_TYPES: ContentType[] = ['drill', 'lesson', 'scenario'];
