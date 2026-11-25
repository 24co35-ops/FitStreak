export interface PipelineStage {
  num: number;
  title: string;
  navName: string;
  syllabus: string;
  href: string;
  tag: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    num: 1,
    title: "Your Stats",
    navName: "Your Stats",
    syllabus: "Stage 1: Data Input",
    href: "/upload",
    tag: "Step 1",
  },
  {
    num: 2,
    title: "Data Charts",
    navName: "Data Charts",
    syllabus: "Stage 2: Visual EDA",
    href: "/eda",
    tag: "Step 2",
  },
  {
    num: 3,
    title: "Patterns & Links",
    navName: "Patterns",
    syllabus: "Stage 3: Correlation & PCA",
    href: "/insights",
    tag: "Step 3",
  },
  {
    num: 4,
    title: "Predict Results",
    navName: "Predict",
    syllabus: "Stage 4: ML Prediction",
    href: "/predict",
    tag: "Step 4",
  },
];

