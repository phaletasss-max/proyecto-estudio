import type { LabEvidence, LabNotebook, LabReport, LabSection } from '@/types/labWorkspace';

const sections: LabSection[] = ['briefing', 'topology', 'evidence', 'questions', 'indicators', 'report', 'completion'];
const text = (value: unknown, max = 10000): string => typeof value === 'string' ? value.slice(0, max) : '';
const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

export const emptyNotebook = (): LabNotebook => ({
  version: 1, reviewed: [], notes: '', indicators: [], custody: [],
  report: { summary: '', method: '', conclusion: '', limitations: '', nextSteps: '' },
});

export function notebookStorageKey(labId: string, userId?: string) {
  return `shadowbytes:lab-notebook:v1:${encodeURIComponent(userId || 'guest')}:${encodeURIComponent(labId)}`;
}

export function parseNotebook(raw: string | null): LabNotebook {
  const empty = emptyNotebook();
  try {
    const value = record(JSON.parse(raw || '{}'));
    if (value.version !== 1) return empty;
    const report = record(value.report);
    return {
      version: 1,
      notes: text(value.notes),
      reviewed: [...new Set(Array.isArray(value.reviewed) ? value.reviewed.filter((section): section is LabSection => sections.includes(section)) : [])],
      indicators: (Array.isArray(value.indicators) ? value.indicators : []).slice(0, 100).map(record).filter(item => typeof item.id === 'string' && typeof item.value === 'string').map(item => ({
        id: text(item.id, 100), kind: ['ip', 'host', 'domain', 'other'].includes(String(item.kind)) ? item.kind as 'ip' | 'host' | 'domain' | 'other' : 'other',
        value: text(item.value, 500), evidenceId: text(item.evidenceId, 100), line: Number.isInteger(item.line) && Number(item.line) > 0 ? Math.min(Number(item.line), 100000) : 1,
        interpretation: text(item.interpretation, 2000),
      })),
      custody: (Array.isArray(value.custody) ? value.custody : []).slice(-50).map(record).filter(item => typeof item.evidenceId === 'string' && typeof item.observedAt === 'string' && Number.isFinite(Date.parse(item.observedAt)) && /^[a-f0-9]{64}$/.test(String(item.sha256))).map(item => ({
        evidenceId: text(item.evidenceId, 100), observedAt: String(item.observedAt), sha256: String(item.sha256), verified: item.verified === true,
      })),
      report: Object.fromEntries(Object.keys(empty.report).map(key => [key, text(report[key])])) as unknown as LabReport,
    };
  } catch { return empty; }
}

/** Checks for report structure, never for correctness or CTF accreditation. */
export function reportChecklist(notebook: LabNotebook, evidenceIds: string[]) {
  return [
    { label: 'Objetivo y alcance descritos', complete: notebook.report.summary.trim().length >= 30 },
    { label: 'Método de análisis explicado', complete: notebook.report.method.trim().length >= 30 },
    { label: 'Conclusión razonada', complete: notebook.report.conclusion.trim().length >= 30 },
    { label: 'Limitaciones y siguiente acción documentadas', complete: notebook.report.limitations.trim().length >= 15 && notebook.report.nextSteps.trim().length >= 15 },
    ...(evidenceIds.length ? [{ label: 'Al menos una observación con fuente y justificación', complete: notebook.indicators.some(item => evidenceIds.includes(item.evidenceId) && item.line > 0 && item.value.trim().length > 0 && item.interpretation.trim().length >= 15) }] : []),
  ];
}

export function renderNotebookReport(title: string, notebook: LabNotebook, evidence: LabEvidence[], solved: boolean, exportedAt: string): string {
  const sections: [string, string][] = [
    ['Objetivo y alcance', notebook.report.summary], ['Método de análisis', notebook.report.method],
    ['Conclusión', notebook.report.conclusion], ['Limitaciones', notebook.report.limitations],
    ['Siguiente acción', notebook.report.nextSteps], ['Notas de análisis', notebook.notes],
  ];
  return [
    `# ${title}`, '', `Exportado: ${exportedAt}`, '',
    'Cuaderno personal de ShadowBytes. El informe no ha recibido evaluación técnica y no es un certificado.',
    `Estado mostrado en la cuenta al exportar: ${solved ? 'flag validada' : 'flag pendiente'}. Esta copia local no acredita puntos.`, '',
    ...sections.flatMap(([label, content]) => [`## ${label}`, '', content.trim() || 'Pendiente de documentar.', '']),
    '## Hallazgos y fuentes', '',
    ...(notebook.indicators.length ? notebook.indicators.flatMap((item, index) => [
      `### Hallazgo ${index + 1}`, '', `Tipo: ${item.kind}`, `Valor: ${item.value}`, '',
      `Fuente: ${evidence.find(source => source.id === item.evidenceId)?.filename || 'Ver notas'}${item.evidenceId ? `, línea ${item.line}` : ''}`, '',
      item.interpretation, '',
    ]) : ['Sin hallazgos documentados.', '']),
    '## Integridad y consulta', '',
    'Registro local editable del navegador; no es una cadena de custodia certificada.', '',
    ...(notebook.custody.length ? notebook.custody.flatMap(item => [
      `- Archivo: ${evidence.find(source => source.id === item.evidenceId)?.filename || item.evidenceId}`,
      `  - Consulta: ${item.observedAt}`,
      `  - SHA-256: ${item.sha256}`,
      `  - Verificación local: ${item.verified ? 'coincidente' : 'no confirmada'}`, '',
    ]) : ['No hay consultas verificadas registradas.', '']),
  ].join('\n');
}
