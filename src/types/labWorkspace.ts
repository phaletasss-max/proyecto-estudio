export type LabSection = 'briefing' | 'topology' | 'evidence' | 'questions' | 'indicators' | 'report' | 'completion';

export interface LabEvidence {
  id: string;
  title: string;
  filename: string;
  storagePath: string;
  byteLength: number;
  sha256: string;
  description: string;
}

export interface LabWorkspaceDefinition {
  objective: string;
  context: string;
  deliverable: string;
  prerequisites: string[];
  glossary: { term: string; meaning: string }[];
  source: { label: string; archive: string; sha256: string; note: string };
  evidence: LabEvidence[];
  topology: {
    caption: string;
    nodes: { id: string; title: string; role: string; evidenceId?: string }[];
    links: { from: string; to: string; label: string }[];
  };
}

export interface LabIndicator {
  id: string;
  kind: 'ip' | 'host' | 'domain' | 'other';
  value: string;
  evidenceId: string;
  line: number;
  interpretation: string;
}

export interface LabCustodyEvent {
  evidenceId: string;
  observedAt: string;
  sha256: string;
  verified: boolean;
}

export interface LabReport {
  summary: string;
  method: string;
  conclusion: string;
  limitations: string;
  nextSteps: string;
}

export interface LabNotebook {
  version: 1;
  reviewed: LabSection[];
  notes: string;
  indicators: LabIndicator[];
  custody: LabCustodyEvent[];
  report: LabReport;
}
