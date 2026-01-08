import { WeekModule } from '@/types';

export const INITIAL_DATA: WeekModule[] = [
  {
    id: 1,
    title: "Week 1: Algebra Foundations",
    description: "Mastering the basics of functions and equations.",
    topics: [
      { id: 'w1-t1', title: 'Real Numbers & Radicals', completed: false },
      { id: 'w1-t2', title: 'Polynomials & Factoring', completed: false },
      { id: 'w1-t3', title: 'Linear Equations & Inequalities', completed: false },
      { id: 'w1-t4', title: 'Quadratic Functions', completed: false },
      { id: 'w1-t5', title: 'Systems of Equations', completed: false },
    ]
  },
  {
    id: 2,
    title: "Week 2: Trigonometry",
    description: "Angles, circles, and waves.",
    topics: [
      { id: 'w2-t1', title: 'Unit Circle & Radians', completed: false },
      { id: 'w2-t2', title: 'Trig Functions & Graphs', completed: false },
      { id: 'w2-t3', title: 'Trig Identities', completed: false },
      { id: 'w2-t4', title: 'Inverse Trig Functions', completed: false },
      { id: 'w2-t5', title: 'Law of Sines & Cosines', completed: false },
    ]
  },
  {
    id: 3,
    title: "Week 3: Limits & Derivatives",
    description: "Introduction to Calculus I.",
    topics: [
      { id: 'w3-t1', title: 'Limits & Continuity', completed: false },
      { id: 'w3-t2', title: 'Definition of Derivative', completed: false },
      { id: 'w3-t3', title: 'Power, Product, Quotient Rules', completed: false },
      { id: 'w3-t4', title: 'Chain Rule', completed: false },
      { id: 'w3-t5', title: 'Implicit Differentiation', completed: false },
    ]
  },
  {
    id: 4,
    title: "Week 4: Applications of Derivatives",
    description: "Using calculus to solve problems.",
    topics: [
      { id: 'w4-t1', title: 'Related Rates', completed: false },
      { id: 'w4-t2', title: 'Critical Points & Extrema', completed: false },
      { id: 'w4-t3', title: 'Concavity & Curve Sketching', completed: false },
      { id: 'w4-t4', title: 'Optimization Problems', completed: false },
      { id: 'w4-t5', title: 'Mean Value Theorem', completed: false },
    ]
  },
  {
    id: 5,
    title: "Week 5: Integrals",
    description: "Area under the curve and accumulation.",
    topics: [
      { id: 'w5-t1', title: 'Riemann Sums', completed: false },
      { id: 'w5-t2', title: 'Definite Integrals', completed: false },
      { id: 'w5-t3', title: 'Fundamental Theorem of Calculus', completed: false },
      { id: 'w5-t4', title: 'Integration by Substitution', completed: false },
      { id: 'w5-t5', title: 'Area Between Curves', completed: false },
    ]
  },
  {
    id: 6,
    title: "Week 6: Statistics & Probability",
    description: "Data analysis and chance.",
    topics: [
      { id: 'w6-t1', title: 'Descriptive Statistics', completed: false },
      { id: 'w6-t2', title: 'Probability Rules', completed: false },
      { id: 'w6-t3', title: 'Random Variables', completed: false },
      { id: 'w6-t4', title: 'Normal Distribution', completed: false },
      { id: 'w6-t5', title: 'Final Review Mock Exam', completed: false },
    ]
  }
];
