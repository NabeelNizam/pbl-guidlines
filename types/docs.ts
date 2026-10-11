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

export interface DocModule {
  slug: string;
  phaseId: string;
  order: number;
  title: string;
  subtitle: string;
  category: DocCategory;
  layer: LayerType;
  estimatedMinutes: number;
  
  // 12 Standard Sections
  tujuan: string;
  prasyarat: string[];
  tasks: string[];
  steps: {
    title: string;
    description: string;
    detail?: string;
  }[];
  fileTree: FileTreeItem[];
  codeSnippets: CodeSnippet[];
  integration: {
    title: string;
    explanation: string;
    connectedWith: string[];
  };
  testingGuide: {
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

export interface BlueprintCase {
  id: string;
  title: string;
  archetype: string;
  description: string;
  domainEntities: string[];
  workflowMapping: {
    stage: string;
    implementation: string;
  }[];
}
