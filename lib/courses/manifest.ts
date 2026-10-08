export type CourseLevel = "Débutant" | "Intermédiaire" | "Avancé"

export interface CourseMeta {
  slug: string
  title: string
  subtitle: string
  level: CourseLevel
  duration_min: number
  available: boolean
  order: number
}

export const COURSES: CourseMeta[] = [
  {
    slug: "mathematiques",
    title: "1. Les mathématiques du poker",
    subtitle: "Combinatoire, probabilités, cotes, EV, equity, variance",
    level: "Débutant",
    duration_min: 45,
    available: true,
    order: 1,
  },
  {
    slug: "position",
    title: "2. Position et dynamique de table",
    subtitle: "Pourquoi la position vaut de l'or, comment elle façonne les ranges",
    level: "Débutant",
    duration_min: 30,
    available: true,
    order: 2,
  },
  {
    slug: "ranges",
    title: "3. Penser en ranges",
    subtitle: "Range vs main, construction, polarisation, range advantage",
    level: "Intermédiaire",
    duration_min: 40,
    available: true,
    order: 3,
  },
  {
    slug: "pot-odds-equity",
    title: "4. Pot odds, equity et implied odds",
    subtitle: "Calcul rigoureux des cotes, decision framework, drawing hands, MDF",
    level: "Intermédiaire",
    duration_min: 40,
    available: true,
    order: 4,
  },
  {
    slug: "gto-fondamentaux",
    title: "5. GTO — Fondamentaux",
    subtitle: "Équilibre de Nash, indifférence, fréquences de bluff, solveurs",
    level: "Avancé",
    duration_min: 50,
    available: true,
    order: 5,
  },
  {
    slug: "preflop-avance",
    title: "6. Preflop avancé",
    subtitle: "3-bet, 4-bet, squeeze, cold call, défense BB, ajustements stacks",
    level: "Intermédiaire",
    duration_min: 40,
    available: true,
    order: 6,
  },
  {
    slug: "postflop",
    title: "7. Postflop — C-bet et board textures",
    subtitle: "Textures dry/wet, sizings par board, turn/river, SPR",
    level: "Intermédiaire",
    duration_min: 45,
    available: true,
    order: 7,
  },
  {
    slug: "exploitation",
    title: "8. Exploitation et lecture d'adversaires",
    subtitle: "Profils Nit/TAG/LAG/Fish, stats HUD, tells, contre-exploit",
    level: "Avancé",
    duration_min: 35,
    available: true,
    order: 8,
  },
  {
    slug: "tournois-icm",
    title: "9. Tournois et ICM",
    subtitle: "ICM, bubble factor, push/fold Nash, deal negotiation",
    level: "Avancé",
    duration_min: 45,
    available: true,
    order: 9,
  },
  {
    slug: "mental-game",
    title: "10. Mental game et bankroll",
    subtitle: "Variance psycho, 7 types de tilt, décision vs résultat, BRM",
    level: "Débutant",
    duration_min: 35,
    available: true,
    order: 10,
  },
]

export function getCourseBySlug(slug: string): CourseMeta | undefined {
  return COURSES.find((c) => c.slug === slug)
}
