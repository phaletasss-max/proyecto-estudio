export interface WslSetupStep {
  id: string;
  title: string;
  place: 'Windows' | 'PowerShell administrador' | 'PowerShell' | 'Linux';
  command?: string;
  expected: string;
  commonError: string;
  solution: string;
  warning?: string;
}

export const WSL_SETUP_STEPS: WslSetupStep[] = [
  { id: 'requirements', title: 'Confirma la versión de Windows', place: 'Windows', command: 'winver', expected: 'Windows 10 2004 o posterior, o Windows 11.', commonError: 'La versión es anterior o Windows Update está pendiente.', solution: 'Actualiza Windows antes de continuar.' },
  { id: 'virtualization', title: 'Verifica la virtualización', place: 'Windows', expected: 'Administrador de tareas → Rendimiento → CPU muestra “Virtualización: Habilitada”.', commonError: 'Aparece como deshabilitada.', solution: 'Activa Intel VT-x o AMD-V/SVM en BIOS/UEFI siguiendo el manual de tu equipo.' },
  { id: 'admin-shell', title: 'Abre una terminal administrativa', place: 'PowerShell administrador', command: 'Start-Process powershell -Verb RunAs', expected: 'Una ventana de PowerShell con privilegios elevados.', commonError: 'Acceso denegado al habilitar características.', solution: 'Cierra la terminal y vuelve a abrirla como administrador.' },
  { id: 'install', title: 'Instala WSL 2', place: 'PowerShell administrador', command: 'wsl --install', expected: 'Windows habilita WSL y prepara Ubuntu; puede pedir reinicio.', commonError: 'El comando no se reconoce o queda pendiente.', solution: 'Instala actualizaciones de Windows, reinicia y ejecuta nuevamente como administrador.' },
  { id: 'list-online', title: 'Consulta distribuciones disponibles', place: 'PowerShell', command: 'wsl --list --online', expected: 'Una lista con Ubuntu, Kali y otras distribuciones.', commonError: '0x80072ee7 o no se puede resolver el servidor.', solution: 'Comprueba Internet y DNS; ejecuta ipconfig /flushdns y prueba un DNS confiable.' },
  { id: 'distro', title: 'Instala Ubuntu o Kali', place: 'PowerShell', command: 'wsl --install -d Ubuntu', expected: 'La distribución se descarga y queda registrada.', commonError: 'Ya existe una distribución con ese nombre.', solution: 'Usa wsl -l -v para verla o elige otra distribución con -d.' },
  { id: 'user', title: 'Crea tu usuario Linux', place: 'Linux', expected: 'La primera apertura solicita usuario y contraseña UNIX.', commonError: 'La contraseña no muestra caracteres al escribir.', solution: 'Es normal en Linux: escribe la contraseña y presiona Enter.' },
  { id: 'update', title: 'Actualiza paquetes', place: 'Linux', command: 'sudo apt update && sudo apt upgrade -y', expected: 'APT actualiza índices y paquetes sin errores críticos.', commonError: 'Temporary failure resolving o servidor DNS desconocido.', solution: 'Ejecuta wsl --shutdown desde PowerShell, abre WSL y revisa /etc/resolv.conf.' },
  { id: 'windows-disks', title: 'Accede a archivos de Windows', place: 'Linux', command: 'cd /mnt/c && ls', expected: 'Ves el contenido del disco C: desde Linux.', commonError: '/mnt/c no existe.', solution: 'Reinicia WSL y comprueba automount en /etc/wsl.conf.' },
  { id: 'linux-files', title: 'Abre Linux desde Windows', place: 'Linux', command: 'explorer.exe .', expected: 'El Explorador abre la carpeta Linux actual; también puedes usar \\wsl$.', commonError: 'explorer.exe no abre o \\wsl$ no responde.', solution: 'Confirma que la distribución esté ejecutándose con wsl -l -v.' },
  { id: 'openvpn', title: 'Instala OpenVPN', place: 'Linux', command: 'sudo apt install openvpn -y', expected: 'OpenVPN queda disponible en la distribución.', commonError: 'Unable to locate package openvpn.', solution: 'Ejecuta sudo apt update y repite la instalación.' },
  { id: 'vpn-connect', title: 'Conecta una VPN autorizada', place: 'Linux', command: 'sudo openvpn --config ~/vpn/lab.ovpn', expected: 'El proveedor del laboratorio muestra Initialization Sequence Completed.', commonError: 'No existe el archivo o falla la autenticación.', solution: 'Verifica la ruta y descarga un perfil vigente desde la plataforma autorizada.' },
  { id: 'tun0', title: 'Comprueba la interfaz VPN', place: 'Linux', command: 'ip addr show tun0', expected: 'tun0 tiene una dirección asignada por la VPN.', commonError: 'Device tun0 does not exist.', solution: 'Mantén OpenVPN ejecutándose y revisa el error de conexión anterior.' },
  { id: 'lhost', title: 'Elige correctamente LHOST', place: 'Linux', command: 'ip -br addr', expected: 'Distingues eth0 (WSL), la IP de Windows y tun0 (VPN).', commonError: 'Se usa la IP de eth0 para un laboratorio conectado por VPN.', solution: 'Cuando el retorno atraviesa la VPN, usa la dirección de tun0 como LHOST.' },
  { id: 'shutdown', title: 'Reinicia WSL de forma segura', place: 'PowerShell', command: 'wsl --shutdown', expected: 'Todas las distribuciones se detienen y liberan recursos.', commonError: 'Cambios de red o .wslconfig no se aplican.', solution: 'Ejecuta el comando, espera unos segundos y abre de nuevo la distribución.' },
  { id: 'backup', title: 'Crea un backup', place: 'PowerShell', command: 'wsl --export Ubuntu C:\\Backups\\ubuntu.tar', expected: 'Se crea un archivo .tar restaurable.', commonError: 'La carpeta destino no existe o falta espacio.', solution: 'Crea C:\\Backups y confirma espacio libre antes de exportar.', warning: 'wsl --unregister elimina por completo una distribución. No lo ejecutes sin un backup verificado.' },
  { id: 'final-check', title: 'Ejecuta la prueba final', place: 'Linux', command: 'printf "WSL_OK\\n" && uname -a && ip -br addr', expected: 'Ves WSL_OK, información del kernel y tus interfaces sin errores.', commonError: 'Alguna comprobación anterior sigue fallando.', solution: 'Vuelve al primer paso incompleto y corrígelo antes de iniciar un laboratorio.' },
];
