import type { CTFLab } from '@/types/ctf';

// Solo recursos y laboratorios reales del grupo de estudio ShadowBytes (SENATI 4.º Ciclo)
export const REAL_LABS: CTFLab[] = [
  {
    id: '1',
    title: 'Forense de Redes & Infraestructura — Router Gateway',
    slug: 'forense-redes-router',
    difficulty: 'Easy',
    category: 'Forensics',
    framework: 'Linux / Windows Server 2022',
    tags: ['Forensics', 'Linux', 'Windows Server 2022', 'Routing', 'NAT', 'SENATI'],
    description: 'Analiza los registros y capturas de consola de 3 máquinas virtuales (Windows Server 2022, Router Gateway Linux y Cliente Workstation) que conforman la topología empresarial de estudio para determinar la IP pública WAN del Gateway.',
    targetIp: '200.48.225.14',
    estimatedMinutes: 45,
    zip_url: '/downloads/ctf_forensics_shadowbytes.zip',
    flag_hash: 'HTB{200.48.225.14}',
    author: 'Victor Kenky / ShadowBytes',
    created_at: '2026-01-15T00:00:00.000Z',
    is_published: true,
    tasks: [
      {
        id: 'fr_t1',
        taskNumber: 1,
        title: 'Descarga y Análisis de Logs Forenses',
        description: 'Descarga el archivo ZIP adjunto (ctf_forensics_shadowbytes.zip) y extrae las evidencias de las 3 máquinas virtuales de la red.',
        questions: [
          {
            id: 'fr_q1',
            question: '¿Cuál es el nombre de la interfaz WAN en el Router Gateway (VM2)?',
            hint: 'Abre 03_LOGS_VM2_ROUTER_GATEWAY.txt y busca la salida de ip addr show.',
            points: 50,
            answerFormat: 'enp***',
            answerHash: 'enp0s8',
          },
          {
            id: 'fr_q2',
            question: 'Ingresa la Flag con la IP pública WAN del Router Gateway',
            hint: 'Formato estándar: HTB{IP_WAN}. La interfaz con salida a default gateway.',
            points: 100,
            answerFormat: 'HTB{***.**.***.**}',
            answerHash: 'HTB{200.48.225.14}',
          },
        ],
      },
    ],
    writeup_markdown: `# Forense de Redes & Infraestructura — Router Gateway

## Escenario
Se dispone de los registros de auditoría de tres máquinas virtuales desplegadas en un entorno de laboratorio:
- **VM1**: Windows Server 2022 (DNS, DHCP, IIS, Active Directory)
- **VM2**: Router Gateway Linux (Enrutamiento estático y NAT)
- **VM3**: Windows 10 Workstation (Cliente)

## Paso 1: Descargar los logs
Descarga y extrae el archivo \`ctf_forensics_shadowbytes.zip\`. Encontrarás:
- \`01_INSTRUCCIONES_Y_RETO_CTF.txt\`
- \`02_LOGS_VM1_WINDOWS_SERVER.txt\`
- \`03_LOGS_VM2_ROUTER_GATEWAY.txt\`
- \`04_LOGS_VM3_CLIENT_WORKSTATION.txt\`

## Paso 2: Análisis del Router Gateway (VM2)
Al abrir \`03_LOGS_VM2_ROUTER_GATEWAY.txt\`, revisamos la configuración de interfaces:
\`\`\`bash
2: enp0s3: <BROADCAST,MULTICAST,UP> mtu 1500
    inet 10.0.0.1/24 brd 10.0.0.255 scope global enp0s3
3: enp0s8: <BROADCAST,MULTICAST,UP> mtu 1500
    inet 200.48.225.14/24 brd 200.48.225.255 scope global enp0s8
\`\`\`

## Paso 3: Confirmación en la Tabla de Rutas
\`\`\`bash
default via 200.48.225.1 dev enp0s8
10.0.0.0/24 dev enp0s3 proto kernel scope link src 10.0.0.1
200.48.225.0/24 dev enp0s8 proto kernel scope link src 200.48.225.14
\`\`\`

La interfaz \`enp0s8\` tiene configurada la IP pública \`200.48.225.14\`, la cual es la puerta de enlace hacia el exterior.

## Flag
\`\`\`
HTB{200.48.225.14}
\`\`\``,
  },
  {
    id: '2',
    title: 'Guía Práctica: Configuración y Réplica de Linux en Windows con WSL 2',
    slug: 'wsl2-linux-alternativa-vms',
    difficulty: 'Easy',
    category: 'Misc',
    framework: 'WSL 2 / Ubuntu / Kali Linux',
    tags: ['WSL2', 'Linux', 'Kali Linux', 'Ubuntu', 'Windows 11', 'SysAdmin', 'Alternativa VMs'],
    description: 'Guía oficial para instalar, configurar, limitar recursos y replicar entornos Linux nativos en terminal (WSL 2) en Windows 10/11 como alternativa de alto rendimiento y bajo consumo frente a máquinas virtuales tradicionales.',
    targetIp: '127.0.0.1',
    estimatedMinutes: 30,
    zip_url: null,
    flag_hash: 'SB{WSL2_NATIVE_LINUX_SENATI}',
    author: 'ShadowBytes Team',
    created_at: '2026-02-01T00:00:00.000Z',
    is_published: true,
    tasks: [
      {
        id: 'wsl_t1',
        taskNumber: 1,
        title: 'Verificación de Requisitos e Instalación',
        description: 'Verifica la virtualización habilitada en BIOS/UEFI e instala el Subsistema de Windows para Linux.',
        questions: [
          {
            id: 'wsl_q1',
            question: '¿Cuál es el comando de una sola línea para instalar WSL 2 y Ubuntu en PowerShell como Administrador?',
            hint: 'Es el comando estándar de instalación de WSL.',
            points: 50,
            answerFormat: 'wsl --*******',
            answerHash: 'wsl --install',
          },
          {
            id: 'wsl_q2',
            question: '¿Qué comando en PowerShell se usa para exportar y crear un backup en .tar de una distro instalada?',
            hint: 'Sintaxis: wsl --export <Distro> <Ruta_Destino.tar>',
            points: 50,
            answerFormat: 'wsl --******',
            answerHash: 'wsl --export',
          },
          {
            id: 'wsl_q3',
            question: '¿Qué ruta de red se escribe en el Explorador de Windows para acceder a los archivos de Linux?',
            hint: 'Inicia con doble barra invertida y el signo dólar al final.',
            points: 100,
            answerFormat: '\\\\****$',
            answerHash: '\\\\wsl$',
          },
        ],
      },
    ],
    writeup_markdown: `# Guía Completa: Configuración y Réplica de Linux en Windows con WSL 2

Esta guía documenta todo el proceso necesario para instalar, configurar y replicar entornos **Linux nativos en terminal (WSL 2)** en cualquier máquina con Windows 10/11 sin necesidad de máquinas virtuales pesadas.

---

## 📋 Requisitos Previos en Windows
1. **Windows 10 (versión 2004 o superior) o Windows 11**.
2. **Virtualización activada en el BIOS/UEFI** (Intel VT-x o AMD-V / SVM).
   * *Para verificar*: Abre el Administrador de Tareas (\`Ctrl + Shift + Esc\`) > pestaña **Rendimiento** > **CPU** > confirmar que diga \`Virtualización: Habilitada\`.

---

## 🚀 Paso 1: Instalación de WSL 2

Abre **PowerShell** o **Windows Terminal** como **Administrador** y ejecuta:

\`\`\`powershell
wsl --install
\`\`\`

> **¿Qué hace este comando automáticamente?**
> 1. Habilita las características opcionales de Windows: *Plataforma de máquina virtual* y *Subsistema de Windows para Linux*.
> 2. Descarga e instala el Kernel Linux oficial de Microsoft.
> 3. Configura **WSL 2** como la versión predeterminada.
> 4. Descarga e instala la distribución por defecto (**Ubuntu**).

*(Si el sistema lo solicita, reinicia la computadora para completar la activación).*

---

## 👥 Paso 2: Configuración Inicial del Usuario

Al abrir por primera vez la distribución (Ubuntu), la terminal te pedirá:
1. **Enter new UNIX username**: Tu nombre de usuario Linux (ej: \`manuel\`).
2. **New password**: Tu contraseña (los caracteres no se mostrarán por seguridad).

Una vez dentro, actualiza el sistema:
\`\`\`bash
sudo apt update && sudo apt upgrade -y
\`\`\`

---

## 📦 Paso 3: Instalar Otras Distribuciones de Linux

WSL permite tener múltiples distribuciones funcionando en paralelo.

### Ver distribuciones disponibles para descarga:
\`\`\`powershell
wsl --list --online
\`\`\`

### Instalar una distribución específica:
* **Kali Linux** (ideal para ciberseguridad / HTB):
  \`\`\`powershell
  wsl --install -d kali-linux
  \`\`\`
* **Debian GNU/Linux**:
  \`\`\`powershell
  wsl --install -d Debian
  \`\`\`
* **Arch Linux**:
  \`\`\`powershell
  wsl --install -d archlinux
  \`\`\`
* **Fedora**:
  \`\`\`powershell
  wsl --install -d FedoraLinux-43
  \`\`\`
* **openSUSE Tumbleweed**:
  \`\`\`powershell
  wsl --install -d openSUSE-Tumbleweed
  \`\`\`

---

## 🛠️ Paso 4: Comandos Clave de Gestión en PowerShell

| Acción | Comando |
|---|---|
| **Ver distros instaladas y versión de WSL** | \`wsl -l -v\` |
| **Iniciar una distro específica** | \`wsl -d <nombre_distro>\` |
| **Iniciar sesión como usuario root** | \`wsl -d <distro> -u root\` |
| **Establecer una distro como predeterminada** | \`wsl -s <nombre_distro>\` |
| **Apagar una distro específica** | \`wsl -t <nombre_distro>\` |
| **Apagar todo WSL (libera RAM)** | \`wsl --shutdown\` |
| **Eliminar/desinstalar una distro** | \`wsl --unregister <nombre_distro>\` |

---

## 💾 Paso 5: Copias de Seguridad (Backup y Restauración)

Para clonar o migrar tu entorno Linux configurado a otra máquina sin volver a instalar nada:

### 1. Exportar (Crear Backup):
\`\`\`powershell
wsl --export Ubuntu C:\\Backups\\ubuntu_backup.tar
\`\`\`

### 2. Importar (Restaurar en otra máquina o con otro nombre):
\`\`\`powershell
wsl --import UbuntuClon C:\\WSL\\UbuntuClon C:\\Backups\\ubuntu_backup.tar
\`\`\`

---

## 📂 Paso 6: Integración e Interoperabilidad Windows <-> Linux

* **Acceder a los archivos de Windows desde Linux:**
  Tus discos locales están montados en \`/mnt/\`:
  \`\`\`bash
  cd /mnt/c/Users/Manuel/Documents/HTB
  \`\`\`

* **Acceder a los archivos de Linux desde el Explorador de Windows:**
  Abre el Explorador de archivos y escribe en la barra de direcciones:
  \`\`\`text
  \\\\wsl$
  \`\`\`
  O desde dentro de la terminal de Linux, escribe:
  \`\`\`bash
  explorer.exe .
  \`\`\`

---

## ⚡ Paso 7: Optimización de Recursos (Límite de Memoria RAM)

Por defecto, WSL 2 puede llegar a consumir hasta el 50% o más de tu RAM si se le exige. Para limitar su uso:

1. Crea o edita el archivo en tu carpeta de usuario de Windows:
   \`C:\\Users\\<TuUsuario>\\.wslconfig\`
2. Agrega la siguiente configuración (ejemplo: limitar a 4GB de RAM y 2 cores):
   \`\`\`ini
   [wsl2]
   memory=4GB
   processors=2
   swap=2GB
   \`\`\`
3. Reinicia WSL en PowerShell con:
   \`\`\`powershell
   wsl --shutdown
   \`\`\`

---

## 💻 Paso 8: Configuración en Windows Terminal

1. Instala **Windows Terminal** desde la Microsoft Store (si no lo tienes).
2. Cada distribución que instales aparecerá automáticamente como una opción en el menú desplegable (\`+\`).
3. Puedes personalizar la pestaña por defecto, temas y accesos directos desde la configuración de Windows Terminal.

---

## Flag de Confirmación de Estudio
\`\`\`
SB{WSL2_NATIVE_LINUX_SENATI}
\`\`\``,
  },
];
