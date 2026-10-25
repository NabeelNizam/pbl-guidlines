export type DocCategory = 'core-standard' | 'feature-recipe' | 'devops' | 'architecture';

export type LayerType = 'frontend' | 'backend' | 'database' | 'integration' | 'devops';

export interface CodeSnippet {
  filename: string;
  language: string;
  code: string;
  description?: string;
  isExecutableOrComplete?: boolean;
}

export interface FileTreeItem {
  path: string;
  type: 'file' | 'folder';
  status?: 'added' | 'modified' | 'deleted' | 'unchanged';
  description?: string;
}

export interface AcceptanceCriterion {
  id: string;
  text: string;
  tip?: string;
}

export interface CommonPitfall {
  symptom: string;
  cause: string;
  solution: string;
}

export interface VisualReference {
  figureNumber: number;
  type: 'editor' | 'terminal' | 'browser' | 'postman' | 'diagram';
  caption: string;
  description: string;
}

export interface PracticalStep {
  stepNumber: number;
  title: string;
  description: string;
  instructions: string[];
  fileTreeSnippet?: string;
  codeSnippet?: CodeSnippet;
  visualReference?: VisualReference;
  verification?: {
    action: string;
    expectedResult: string;
  };
  interactiveWidget?: 'folder-explorer' | 'component-scope';
}

export interface PracticalTask {
  taskNumber: number;
  title: string;
  description: string;
  isOptional?: boolean;
  isConditional?: boolean;
  steps: PracticalStep[];
}

export interface AdaptationMapping {
  aspect: string;
  universalExample: string;
  projectExampleA: string;
  projectExampleB: string;
}

export interface DocModule {
  slug: string;
  phaseId: string;
  order: number;
  title: string;
  subtitle: string;
  category: DocCategory;
  layer: LayerType;
  estimatedMinutes: number;
  
  // Panduan Inti
  tujuan: string;
  prasyarat: string[];
  adaptationTable?: AdaptationMapping[];

  // Format Praktikum Step-by-Step Modern (Vertical Flow)
  practicalTasks?: PracticalTask[];

  // Backward compatibility fields
  tasks: string[];
  steps: {
    title: string;
    description: string;
    detail?: string;
  }[];
  fileTree: FileTreeItem[];
  codeSnippets: CodeSnippet[];
  integration?: {
    title: string;
    explanation: string;
    connectedWith: string[];
  };
  testingGuide?: {
    manualSteps: string[];
    expectedResult: string;
  };
  acceptanceCriteria: AcceptanceCriterion[];
  gitStandard: {
    branchName: string;
    commitExample: string;
    prTitle: string;
  };
  pitfalls: CommonPitfall[];
  nextStep: {
    title: string;
    slug: string;
    description: string;
  };
}

export interface PhaseGroup {
  id: string;
  number: number;
  title: string;
  description: string;
  modules: DocModule[];
}
