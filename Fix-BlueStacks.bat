@echo off
echo Desmontando disco virtual de BlueStacks (Data.vhdx)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Dismount-DiskImage -ImagePath 'C:\ProgramData\BlueStacks_nxt\Engine\Pie64\Data.vhdx'"
echo.
if %ERRORLEVEL% EQU 0 (
    echo [OK] El disco virtual se ha desmontado correctamente.
    echo Ya puedes abrir BlueStacks 5.
) else (
    echo [ERROR] No se pudo desmontar automáticamente.
    echo Asegúrate de ejecutar este archivo haciendo clic derecho -> "Ejecutar como administrador".
)
pause
