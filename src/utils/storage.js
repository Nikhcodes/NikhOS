export const STORAGE_KEYS = {
  SUBJECTS:    'nikhos_subjects',
  ASSIGNMENTS: 'nikhos_assignments',
  LINKS:       'nikhos_links',
  TIMER:       'nikhos_timer',
}

export const DEFAULT_SUBJECTS = [
  { id: '1', name: 'DevOps',  grade: 7.5, color: '#a855f7' },
  { id: '2', name: 'Front-Backend Development',      grade: 6.0, color: '#ec4899' },
]

export const DEFAULT_ASSIGNMENTS = [
  {
    id: '1',
    title: 'Beroepsprodukt',
    dueDate: '2026-03-13',
    priority: 'high',
    completed: true,
  },
  {
    id: '2',
    title: 'Reflectieverslag',
    dueDate: '2026-03-28',
    priority: 'medium',
    completed: true,
  },
  {
    id: '3',
    title: 'Stageplan',
    dueDate: '2027-01-15',
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
    title: 'Software engineering',
    date: '2026-05-01',
    type: 'exam',
    color: '#a855f7',
  }
]