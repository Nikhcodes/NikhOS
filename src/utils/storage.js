export const STORAGE_KEYS = {
  SUBJECTS:    'nikhos_subjects',
  ASSIGNMENTS: 'nikhos_assignments',
  LINKS:       'nikhos_links',
  TIMER:       'nikhos_timer',
}

export const DEFAULT_SUBJECTS = [
  { id: '1', name: 'PR + SD',  grade: 6.3, color: '#a855f7' },
  { id: '2', name: 'Front-Backend Development',      grade: 6.4, color: '#ec4899' },
]

export const DEFAULT_ASSIGNMENTS = [
  {
    id: '1',
    title: 'Stageplan',
    dueDate: '2027-01-15',
    priority: 'low',
    completed: false,
  },
  {
    id: '2',
    title: 'PvA SS BP',
    dueDate: '2026-04-20',
    priority: 'medium',
    completed: false,
  },
  {
    id: '3',
    title: 'Presentatie BP SS',
    dueDate: '2026-05-25',
    priority: 'medium',
    completed: false,
  },
  {
    id: '4',
    title: 'Individuele bevraging BP SS',
    dueDate: '2026-05-25',
    priority: 'medium',
    completed: false,
  },
  {
    id: '5',
    title: 'Verantwoording Verslag SEM 3 SS (PP)',
    dueDate: '2026-05-28',
    priority: 'low',
    completed: false,
  },
]

export const DEFAULT_LINKS = [
  { id: '1', label: 'Notion',      url: 'https://unasat.notion.site/ict-student',      icon: '📓' },
  { id: '2', label: 'SharePoint',  url: 'https://unasat.sharepoint.com/', icon: '📁' },
  { id: '3', label: 'Trajectplanner',url: 'https://unasat.trajectplanner.nl/index.php?',icon: '🙏' },
  { id: '4', label: 'Schedule', url: 'https://unasat.notion.site/27d50cdc0bfd80479ad5eda077633fb5?v=27d50cdc0bfd808db497000c6eb5f329', icon: '🗓️'}
]

export const DEFAULT_EVENTS = [
  {
    id: '1',
    title: 'SE - Software Security',
    date: '2026-06-02',
    type: 'exam',
    color: '#a855f7',
  },
  {
    id: '2',
    title: 'SE - Datastructureren & Algoritmen',
    date: '2026-08-08',
    type: 'exam',
    color: '#a855f7',
  },
]