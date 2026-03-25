export const STORAGE_KEYS = {
  SUBJECTS:    'nikhos_subjects',
  ASSIGNMENTS: 'nikhos_assignments',
  LINKS:       'nikhos_links',
  TIMER:       'nikhos_timer',
}

export const DEFAULT_SUBJECTS = [
  { id: '1', name: 'Mathematics',  grade: 7.5, color: '#a855f7' },
  { id: '2', name: 'Physics',      grade: 6.0, color: '#ec4899' },
  { id: '3', name: 'English',      grade: 8.0, color: '#3b82f6' },
  { id: '4', name: 'History',      grade: 5.5, color: '#f59e0b' },
]

export const DEFAULT_ASSIGNMENTS = [
  {
    id: '1',
    title: 'Math Chapter 5 Exercises',
    dueDate: '2025-04-10',
    priority: 'high',
    completed: false,
  },
  {
    id: '2',
    title: 'Physics Lab Report',
    dueDate: '2025-04-08',
    priority: 'medium',
    completed: false,
  },
  {
    id: '3',
    title: 'English Essay Draft',
    dueDate: '2025-04-15',
    priority: 'low',
    completed: true,
  },
]

export const DEFAULT_LINKS = [
  { id: '1', label: 'Notion',      url: 'https://notion.so',      icon: '📓' },
  { id: '2', label: 'SharePoint',  url: 'https://sharepoint.com', icon: '📁' },
  { id: '3', label: 'Google Drive',url: 'https://drive.google.com',icon: '☁️' },
]