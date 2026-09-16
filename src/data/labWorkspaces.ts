import type { LabWorkspaceDefinition } from '@/types/labWorkspace';

/** Public briefing and file provenance only. Evidence bytes remain in private storage. */
export const routerWorkspace: LabWorkspaceDefinition = {
  objective: 'Identifica la dirección IPv4 de salida del router y justifica tu respuesta con los registros de la red.',
  context: 'Recibes registros de consola de un servidor Windows, un gateway Linux y un equipo cliente. Debes reconstruir cómo se conectan y distinguir una dirección de la red interna de la interfaz que da salida a Internet.',
  deliverable: 'Una flag con la dirección encontrada y un informe breve que cite el archivo y las líneas que sustentan tu conclusión.',
  prerequisites: ['Saber abrir y leer un archivo de texto.', 'No necesitas instalar Linux, una VPN ni máquinas virtuales. Los registros se leen aquí.'],
  glossary: [
    { term: 'IP', meaning: 'Dirección que identifica una interfaz dentro de una red.' },
    { term: 'LAN / WAN', meaning: 'LAN es la red interna. WAN es la conexión del router hacia otra red.' },
    { term: 'Gateway', meaning: 'Equipo al que se envía el tráfico para llegar a otras redes.' },
    { term: 'Ruta por defecto', meaning: 'Camino usado cuando no existe una ruta más específica para el destino.' },
    { term: 'NAT', meaning: 'Traducción de direcciones que permite, por ejemplo, que varios equipos compartan una salida.' },
  ],
  source: {
    label: 'Material de laboratorio aportado por ShadowBytes',
    archive: 'ctf_forensics_shadowbytes.zip',
    sha256: 'd473e1e8a8e98fcb9b11745144fd3e04209ee18e7036432c9966a2b95a399bc6',
    note: 'Los registros se conservan sin modificar, incluidos los nombres históricos del escenario. Son evidencias educativas; no representan sistemas a los que debas conectarte. La guía actual pertenece a ShadowBytes.',
  },
  evidence: [
    { id: 'server', title: 'Servidor Windows', filename: '02_LOGS_VM1_WINDOWS_SERVER.txt', storagePath: 'forense-redes-router/evidence/02_LOGS_VM1_WINDOWS_SERVER.txt', byteLength: 3986, sha256: 'd1ade312cca0c6185f28e6a51c301431ba82a56825e8675d26bd1b8660eed597', description: 'Configuración de red y servicios DNS, DHCP, archivos y web.' },
    { id: 'gateway', title: 'Router / gateway', filename: '03_LOGS_VM2_ROUTER_GATEWAY.txt', storagePath: 'forense-redes-router/evidence/03_LOGS_VM2_ROUTER_GATEWAY.txt', byteLength: 2503, sha256: '6bf36a034c939dc35cef7254d611a7501f85865a9bff6772f5c5a3fb5ec87c8c', description: 'Interfaces, rutas y reglas de traducción y filtrado de tráfico.' },
    { id: 'client', title: 'Equipo cliente', filename: '04_LOGS_VM3_CLIENT_WORKSTATION.txt', storagePath: 'forense-redes-router/evidence/04_LOGS_VM3_CLIENT_WORKSTATION.txt', byteLength: 2723, sha256: '49df681246c70c8cb20db37efa9d50e7bce74e4d010ad42b9f1b2eac7f20d9e1', description: 'Configuración del cliente y pruebas de conectividad recogidas en el escenario.' },
  ],
  topology: {
    caption: 'Mapa conceptual del escenario descrito en el archivo de instrucciones. Completa las direcciones y comprueba las relaciones leyendo los registros; el mapa no sustituye esa evidencia.',
    nodes: [
      { id: 'client', title: 'Equipo cliente', role: 'Windows 10', evidenceId: 'client' },
      { id: 'server', title: 'Servidor', role: 'Windows Server 2022', evidenceId: 'server' },
      { id: 'gateway', title: 'Gateway', role: 'Linux · LAN / WAN', evidenceId: 'gateway' },
      { id: 'internet', title: 'Red externa', role: 'Destino del tráfico' },
    ],
    links: [
      { from: 'client', to: 'server', label: 'Servicios internos' },
      { from: 'client', to: 'gateway', label: 'Salida de la LAN' },
      { from: 'gateway', to: 'internet', label: 'Enlace WAN' },
    ],
  },
};

export function getLabWorkspace(slug: string): LabWorkspaceDefinition | undefined {
  return slug === 'forense-redes-router' ? routerWorkspace : undefined;
}
