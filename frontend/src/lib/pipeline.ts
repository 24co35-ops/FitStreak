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
    title: "Data Loading",
    navName: "Stats & Profile",
    syllabus: "Schema & IQR Outliers",
    href: "/upload",
    tag: "Ingestion",
  },
  {
    num: 2,
    title: "EDA Visuals",
    navName: "EDA Dashboard",
    syllabus: "Bivariate & Boxplots",
    href: "/eda",
    tag: "Distribution",
  },
  {
    num: 3,
    title: "Insights & PCA",
    navName: "Insights & PCA",
    syllabus: "Correlation & VIF",
    href: "/insights",
    tag: "Reduction",
  },
  {
    num: 4,
    title: "ML Models",
    navName: "ML Predict",
    syllabus: "Linear & Logistic Reg",
    href: "/predict",
    tag: "Inference",
  },
];

