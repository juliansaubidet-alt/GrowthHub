export const TERM_CONFIG = {
  short:  { label: 'Corto plazo',   badge: 'bg-g-100 text-g-800',  dot: 'bg-g-500'  },
  medium: { label: 'Mediano plazo', badge: 'bg-y-100 text-y-700',  dot: 'bg-y-500'  },
  long:   { label: 'Largo plazo',   badge: 'bg-p-100 text-p-800',  dot: 'bg-p-500'  },
}

export const PRIORITY_CONFIG = {
  1: { label: 'Esencial',     badge: 'bg-g-100 text-g-700'  },
  2: { label: 'Recomendado',  badge: 'bg-h-100 text-h-800'  },
  3: { label: 'Opcional',     badge: 'bg-p-100 text-p-700'  },
}

export const ROUTES_BY_TYPE = {
  vertical: [
    { value: 'senior-designer',    label: 'Senior Designer',    level: 'L3' },
    { value: 'design-lead',        label: 'Design Lead',        level: 'L4' },
    { value: 'ux-director',        label: 'UX Director',        level: 'L5' },
    { value: 'principal-designer', label: 'Principal Designer', level: 'L6' },
  ],
  lateral: [
    { value: 'ux-researcher',      label: 'UX Researcher',      level: 'L2' },
    { value: 'design-lead',        label: 'Design Lead',        level: 'L4' },
    { value: 'brand-designer',     label: 'Brand Designer',     level: 'L2' },
    { value: 'content-strategist', label: 'Content Strategist', level: 'L2' },
  ],
}

export const SKILLS_BY_ROUTE = {
  'senior-designer':    ['Visual Design', 'Prototyping', 'UX Research', 'Design Systems', 'Stakeholder Mgmt', 'Figma Advanced', 'Design Critique'],
  'design-lead':        ['Team Leadership', 'Design Strategy', 'Stakeholder Mgmt', 'Mentorship', 'Design Systems', 'Roadmap Planning'],
  'ux-director':        ['Strategic Planning', 'Executive Communication', 'Team Building', 'Design Ops', 'Budget Management', 'Cross-functional Leadership'],
  'principal-designer': ['Design Vision', 'System Thinking', 'Research Strategy', 'Influence & Impact', 'Design Ops', 'Technical Fluency'],
  'ux-researcher':      ['User Research', 'Data Analysis', 'Interview Techniques', 'Usability Testing', 'Synthesis & Insights', 'Survey Design'],
  'product-manager':    ['Product Strategy', 'Roadmapping', 'Stakeholder Management', 'Data Analysis', 'Agile Methodologies', 'Market Research'],
  'brand-designer':     ['Brand Strategy', 'Typography', 'Illustration', 'Motion Design', 'Visual Identity', 'Art Direction'],
  'content-strategist': ['Content Planning', 'UX Writing', 'SEO Basics', 'Analytics', 'Storytelling', 'Information Architecture'],
}

export const COURSES_BY_ROUTE = {
  'senior-designer': [
    { id: 'c1', emoji: '📗', title: 'Stakeholder Management Fundamentals', type: 'Curso',         duration: '4h',  provider: 'LinkedIn Learning' },
    { id: 'c2', emoji: '🎨', title: 'Advanced Design Systems',             type: 'Certificación', duration: '12h', provider: 'Figma Academy'     },
    { id: 'c3', emoji: '🔬', title: 'UX Research Methods',                 type: 'Curso',         duration: '8h',  provider: 'Humand Learn'      },
    { id: 'c4', emoji: '💡', title: 'Design Critique & Feedback',          type: 'Workshop',      duration: '3h',  provider: 'Humand Learn'      },
  ],
  'design-lead': [
    { id: 'c5', emoji: '👥', title: 'Design Team Leadership',   type: 'Curso',         duration: '6h',  provider: 'Humand Learn'      },
    { id: 'c6', emoji: '🗺️', title: 'Design Strategy & Vision', type: 'Certificación', duration: '10h', provider: 'IDEO U'            },
    { id: 'c7', emoji: '🧭', title: 'Product Roadmap Planning', type: 'Curso',         duration: '5h',  provider: 'LinkedIn Learning' },
    { id: 'c8', emoji: '🎓', title: 'Mentoring & Coaching',     type: 'Workshop',      duration: '4h',  provider: 'Humand Learn'      },
  ],
  'ux-researcher': [
    { id: 'c9',  emoji: '🔍', title: 'User Research Fundamentals',       type: 'Certificación', duration: '15h', provider: 'Nielsen Norman Group' },
    { id: 'c10', emoji: '📊', title: 'Quantitative Research Methods',    type: 'Curso',         duration: '8h',  provider: 'Humand Learn'         },
    { id: 'c11', emoji: '🎤', title: 'User Interview Mastery',           type: 'Workshop',      duration: '3h',  provider: 'Humand Learn'         },
  ],
  'product-manager': [
    { id: 'c12', emoji: '🚀', title: 'Product Management Fundamentals', type: 'Certificación', duration: '20h', provider: 'Product School'    },
    { id: 'c13', emoji: '📈', title: 'Data-Driven Product Decisions',   type: 'Curso',         duration: '8h',  provider: 'Humand Learn'      },
    { id: 'c14', emoji: '🏃', title: 'Agile & Scrum for PMs',           type: 'Curso',         duration: '6h',  provider: 'LinkedIn Learning' },
  ],
  'brand-designer': [
    { id: 'c15', emoji: '✏️', title: 'Brand Identity Design',  type: 'Certificación', duration: '10h', provider: 'Humand Learn'      },
    { id: 'c16', emoji: '🎬', title: 'Motion Design Basics',   type: 'Curso',         duration: '6h',  provider: 'LinkedIn Learning' },
    { id: 'c17', emoji: '🖋️', title: 'Typography Masterclass', type: 'Curso',         duration: '4h',  provider: 'Humand Learn'      },
  ],
  'content-strategist': [
    { id: 'c18', emoji: '📝', title: 'UX Writing Fundamentals',     type: 'Curso',    duration: '5h',  provider: 'Humand Learn'      },
    { id: 'c19', emoji: '🔎', title: 'Content Strategy & SEO',      type: 'Curso',    duration: '7h',  provider: 'LinkedIn Learning' },
    { id: 'c20', emoji: '📐', title: 'Information Architecture',    type: 'Workshop', duration: '3h',  provider: 'Humand Learn'      },
  ],
  'ux-director': [
    { id: 'c21', emoji: '🏛️', title: 'Design Operations Leadership', type: 'Certificación', duration: '12h', provider: 'IDEO U'       },
    { id: 'c22', emoji: '💼', title: 'Executive Communication',      type: 'Curso',         duration: '6h',  provider: 'Humand Learn' },
    { id: 'c23', emoji: '🌐', title: 'Cross-functional Leadership',  type: 'Workshop',      duration: '4h',  provider: 'Humand Learn' },
  ],
  'principal-designer': [
    { id: 'c24', emoji: '🧠', title: 'Systems Thinking for Designers', type: 'Certificación', duration: '14h', provider: 'IDEO U'       },
    { id: 'c25', emoji: '🔭', title: 'Design Vision & Strategy',       type: 'Curso',         duration: '8h',  provider: 'Humand Learn' },
    { id: 'c26', emoji: '💎', title: 'Influence & Impact at Scale',    type: 'Workshop',      duration: '3h',  provider: 'Humand Learn' },
  ],
}

export const DEFAULT_COURSES = [
  { id: 'cd1', emoji: '🤝', title: 'Cross-functional Collaboration', type: 'Workshop',      duration: '2h',  provider: 'Humand Learn', priority: 2 },
  { id: 'cd2', emoji: '💬', title: 'Comunicación Ejecutiva',         type: 'Curso',         duration: '5h',  provider: 'Humand Learn', priority: 2 },
  { id: 'cd3', emoji: '🧩', title: 'Design Thinking Avanzado',       type: 'Certificación', duration: '10h', provider: 'IDEO U',       priority: 3 },
]

export const MANAGERS = [
  { value: 'maria-gonzalez', label: 'María González', role: 'Design Director'   },
  { value: 'carlos-ruiz',    label: 'Carlos Ruiz',    role: 'VP of Product'     },
  { value: 'ana-garcia',     label: 'Ana García',     role: 'Head of Design'    },
  { value: 'luis-herrera',   label: 'Luis Herrera',   role: 'Engineering Lead'  },
  { value: 'mia-torres',     label: 'Mia Torres',     role: 'Product Lead'      },
]
