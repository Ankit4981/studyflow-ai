import { MaterialType } from "@/types";

export const DEMO_STORAGE_KEY = "studyflow-ai:pending-demo";

export interface DemoMaterial {
  id: string;
  label: string;
  course: string;
  materialType: MaterialType;
  text: string;
  icon?: string;
  badgeColor?: string;
}

export const DEMO_MATERIALS: DemoMaterial[] = [
  {
    id: "biology-101",
    label: "Biology: Cellular Respiration",
    course: "Biology & Bioenergetics",
    materialType: "notes",
    icon: "🧬",
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    text: `Cellular respiration is a set of metabolic reactions and processes that take place in the cells of organisms to convert biochemical energy from organic substances into adenosine triphosphate (ATP), and then release waste products. The reactions involved in respiration are catabolic reactions which involve breaking larger molecules into smaller ones. The overall process is broken down into three main stages: glycolysis, the citric acid cycle (Krebs cycle), and oxidative phosphorylation (the electron transport chain).

Glycolysis takes place in the cytoplasm and splits one glucose molecule into two pyruvate molecules, producing a small net gain of ATP and NADH without requiring oxygen. The Krebs cycle occurs in the mitochondrial matrix, where pyruvate is further broken down, releasing carbon dioxide and generating high-energy electron carriers (NADH and FADH2). The electron transport chain, located across the inner mitochondrial membrane, uses those electron carriers to pump protons and drive ATP synthase, producing the majority of the cell's ATP. Oxygen acts as the final electron acceptor, combining with electrons and protons to form water.

Students often confuse anaerobic fermentation with glycolysis — glycolysis happens in both aerobic respiration and fermentation, but fermentation yields far less ATP because it does not use the electron transport chain.`,
  },
  {
    id: "cs-algorithms",
    label: "CS: Big-O & Algorithm Complexity",
    course: "Computer Science & Data Structures",
    materialType: "notes",
    icon: "💻",
    badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    text: `Asymptotic analysis evaluates an algorithm's performance as input size n approaches infinity. Big-O notation O(g(n)) describes the upper bound (worst-case scenario), Omega notation Ω(g(n)) describes the lower bound (best-case), and Theta notation Θ(g(n)) defines tight asymptotic bounds.

Common Time Complexity Classes:
1. O(1) Constant Time: Hash table lookups on average, array indexing by index.
2. O(log n) Logarithmic Time: Binary search on sorted arrays, balanced binary search tree operations (AVL, Red-Black).
3. O(n) Linear Time: Single traversal of an array or linked list, linear search.
4. O(n log n) Linearithmic Time: Efficient comparison sorting algorithms including Merge Sort and Heap Sort.
5. O(n²) Quadratic Time: Nested loops, Bubble Sort, Insertion Sort, Selection Sort on unsorted arrays.
6. O(2ⁿ) Exponential Time: Naive recursive Fibonacci computation, travelling salesperson brute-force.

Space Complexity evaluates auxiliary memory allocated relative to n. For example, Merge Sort requires O(n) auxiliary space for merging arrays, whereas QuickSort requires O(log n) stack space.`,
  },
  {
    id: "ap-history-essay",
    label: "History: Causes of the French Revolution",
    course: "World History & Social Studies",
    materialType: "assignment",
    icon: "🏛️",
    badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    text: `Assignment Prompt: Evaluate the extent to which Enlightenment ideas caused the outbreak of the French Revolution in 1789. Your essay should be roughly 800 words and must include a clear, arguable thesis, at least three pieces of specific historical evidence, and a counterargument that you address directly.

Consider these categories of causation covered in class: (1) Enlightenment philosophy and its spread through salons and pamphlets, particularly the ideas of Rousseau on popular sovereignty and Montesquieu on separation of powers; (2) the financial crisis of the French monarchy, driven by debt from the Seven Years' War and American Revolution and by an inefficient, unequal tax system; (3) the social structure of the Estates-General and resentment of the Third Estate toward the privileges of the First and Second Estates; and (4) immediate triggers such as poor harvests, bread prices, and the storming of the Bastille.

Your essay will be graded on thesis clarity, use of specific evidence, historical reasoning (causation), and engagement with counterargument, per the class rubric distributed last week.`,
  },
];

export const DEFAULT_SAMPLE_FLOW: import("@/types").StudyFlow = {
  id: "sample-bio-flow",
  title: "Cellular Respiration & Bioenergetics",
  sourceType: "notes",
  summary: "Cellular respiration converts biochemical energy from nutrients into ATP across three major stages: Glycolysis in cytoplasm, Krebs cycle in mitochondrial matrix, and Oxidative Phosphorylation on the inner mitochondrial membrane.",
  eli5: "Think of your cells like tiny power plants. They take food (glucose), chop it up into smaller fuel blocks, and spin tiny turbines to produce energy batteries (ATP) so your body can move and think!",
  keyTakeaways: [
    { label: "Stage 1", title: "Glycolysis", description: "Splits 1 glucose into 2 pyruvate in cytoplasm, yielding net 2 ATP and 2 NADH without oxygen." },
    { label: "Stage 2", title: "Krebs Cycle", description: "Occurs in mitochondrial matrix, oxidizes acetyl-CoA, producing CO2, NADH, and FADH2." },
    { label: "Stage 3", title: "Oxidative Phosphorylation", description: "Electron transport chain on inner membrane powers ATP synthase, generating ~28-32 ATP." },
    { label: "Key Distinction", title: "Aerobic vs Anaerobic", description: "Fermentation occurs without oxygen to regenerate NAD+, producing far less ATP than full aerobic respiration." },
  ],
  deepDive: [
    { question: "Why is oxygen called the terminal electron acceptor?", answer: "Oxygen has high electronegativity, pulling electrons down the electron transport chain and combining with H+ to produce water (H2O), preventing system blockage." },
    { question: "What is the role of ATP synthase?", answer: "ATP synthase acts as a rotary molecular motor driven by the proton gradient (proton-motive force) across the inner membrane to phosphorylate ADP into ATP." }
  ],
  tasks: [
    { id: "task-1", title: "Map the 3 Stages of Respiration", description: "Draw a diagram showing cytoplasm vs mitochondrial matrix vs inner membrane.", estimatedMinutes: 10, priority: "high", order: 1 },
    { id: "task-2", title: "Calculate Net ATP Yield", description: "Break down ATP yields from glycolysis (2 ATP) vs oxidative phosphorylation (28-32 ATP).", estimatedMinutes: 12, priority: "high", order: 2 },
    { id: "task-3", title: "Trace Electron Carriers (NADH / FADH2)", description: "Review how high-energy electrons are passed to complexes I, II, III, and IV.", estimatedMinutes: 15, priority: "medium", order: 3 },
    { id: "task-4", title: "Differentiate Fermentation Pathways", description: "Compare lactic acid fermentation in muscles with alcoholic fermentation in yeast.", estimatedMinutes: 10, priority: "medium", order: 4 },
  ],
  flashcards: [
    { id: "fc-1", question: "Where does glycolysis take place in eukaryotic cells?", answer: "In the cytoplasm (cytosol).", difficulty: "easy" },
    { id: "fc-2", question: "What is the net ATP yield per glucose molecule in glycolysis?", answer: "Net gain of 2 ATP (4 produced minus 2 consumed).", difficulty: "easy" },
    { id: "fc-3", question: "Which organelle membrane contains the Electron Transport Chain?", answer: "The inner mitochondrial membrane (cristae).", difficulty: "medium" },
    { id: "fc-4", question: "What acts as the final electron acceptor in aerobic respiration?", answer: "Molecular oxygen (O2), which combines with electrons and protons to form H2O.", difficulty: "medium" },
    { id: "fc-5", question: "What creates the proton gradient that drives ATP synthase?", answer: "Protons (H+) pumped from the matrix into the intermembrane space by ETC complexes.", difficulty: "hard" },
  ],
  createdAt: new Date().toISOString(),
};

export function getDemoMaterial(id: string): DemoMaterial | undefined {
  return DEMO_MATERIALS.find((d) => d.id === id);
}
