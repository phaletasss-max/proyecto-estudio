import type { LearningPath } from '@/types/auth';

export const PROGRAMMING_PATH: LearningPath = {
  id: 'programming-ai', slug: 'programacion-con-ia', title: 'Programación desde cero con IA',
  description: 'Aprende a describir un problema, entender código sencillo y comprobar las propuestas de un asistente de IA. Sin experiencia previa ni API de pago.',
  icon: 'code', level: 'Fundamental', estimatedHours: 2,
  tags: ['Principiantes', 'JavaScript', 'IA', 'Pruebas'],
  modules: [
    {
      id: 'p1', title: 'Tu primer programa: entrada, proceso y salida', type: 'theory', durationMinutes: 15, points: 0,
      description: 'Descubre qué hace un programa usando una calculadora de minutos. Solo necesitas leer esta página.',
      guide: {
        objective: 'Reconocer qué recibe un programa, qué operación hace y qué devuelve.',
        keyIdeas: ['Un programa es una lista de instrucciones precisas.', 'La entrada es el dato que le das. El proceso lo transforma. La salida es el resultado.', 'En JavaScript, return entrega el resultado de una función. Una función es un bloque de instrucciones con nombre.'],
        steps: ['Lee este ejemplo: function aMinutos(horas) { return horas * 60; }', 'Identifica la entrada: horas. Por ejemplo, si escribes aMinutos(2), la entrada es 2.', 'Sigue el proceso: multiplica 2 por 60.', 'Comprueba la salida: 120. Si la entrada es 0, la salida debería ser 0.', 'Antes de pedir ayuda a una IA, explica con tus palabras lo que esperas que haga la función.'],
        practice: 'Calcula a mano el resultado de aMinutos(3). Después escribe un caso con cero. No tienes que instalar ni ejecutar nada.',
      },
      knowledgeCheck: { question: 'Si aMinutos(horas) devuelve horas × 60, ¿qué devuelve aMinutos(3)?', choices: ['63', '180', '60'], correctIndex: 1, explanation: 'La entrada es 3. El programa calcula 3 × 60 y devuelve 180 minutos.' },
    },
    {
      id: 'p2', title: 'Pide ayuda a una IA con un objetivo claro', type: 'theory', durationMinutes: 20, points: 0,
      description: 'Construye una petición que incluya el problema, ejemplos y restricciones. Puedes hacer el ejercicio sin contratar un asistente.',
      guide: {
        objective: 'Escribir una petición que otra persona o un asistente pueda comprobar.',
        keyIdeas: ['Un prompt es la instrucción que envías al asistente.', 'Incluye ejemplos de entrada y salida: ayudan a detectar malentendidos.', 'Pide una explicación y pruebas. El código generado puede contener errores.'],
        steps: ['Define el objetivo: convertir horas a minutos.', 'Añade ejemplos: 2 horas → 120 minutos; 0 horas → 0 minutos.', 'Especifica un límite: no aceptar números negativos.', 'Escribe tu petición: «Crea una función aMinutos en JavaScript. Debe convertir horas a minutos y rechazar números negativos. Incluye los casos 2, 0 y -1. Explica cada línea. No uses bibliotecas externas».', 'Revisa la respuesta con los ejemplos antes de copiarla a un proyecto. Si no tienes un asistente, intercambia la petición con otra persona o revísala tú mismo.'],
        practice: 'Redacta una petición para convertir minutos a segundos. Incluye dos ejemplos y una regla para entradas inválidas.',
      },
      knowledgeCheck: { question: '¿Qué petición es más fácil de comprobar?', choices: ['Haz una calculadora increíble.', 'Convierte minutos a segundos: 2 debe dar 120 y 0 debe dar 0. Explica la función.', 'Escribe mucho código rápidamente.'], correctIndex: 1, explanation: 'Los ejemplos definen resultados concretos. Permiten comparar lo que pediste con lo que entrega el programa.' },
    },
    {
      id: 'p3', title: 'Encuentra un error antes de confiar en el código', type: 'theory', durationMinutes: 25, points: 0,
      description: 'Revisa un ejemplo con un error intencional y aprende a formular una prueba sencilla.',
      guide: {
        objective: 'Detectar una diferencia entre el comportamiento esperado y el real.',
        keyIdeas: ['Una prueba compara un resultado real con uno esperado.', 'Un caso normal no basta: prueba también cero y entradas inválidas.', 'La explicación de la IA no reemplaza la evidencia de una prueba.'],
        steps: ['Revisa: function aSegundos(minutos) { return minutos + 60; }', 'Escribe el resultado esperado para 2 minutos: 120 segundos.', 'Sigue lo que realmente hace el código: 2 + 60 = 62.', 'Identifica el error: debe multiplicar por 60, no sumar 60.', 'Comprueba el cambio con 2 → 120 y 0 → 0. Después decide cómo debería tratar un número negativo.'],
        practice: 'Escribe tres líneas: entrada, resultado esperado y resultado real del código con el error. Luego explica la corrección sin usar palabras técnicas.',
      },
      knowledgeCheck: { question: 'La función usa minutos + 60. ¿Qué cambio corrige la conversión?', choices: ['Cambiar el nombre de la función.', 'Cambiar + por *.', 'Aceptar la explicación sin comprobar el resultado.'], correctIndex: 1, explanation: 'Cada minuto tiene 60 segundos. Por eso el cálculo correcto es minutos × 60.' },
    },
    {
      id: 'p4', title: 'Elige cómo trabajar con modelos de IA', type: 'theory', durationMinutes: 20, points: 0,
      description: 'Distingue chat, asistente de editor y modelo local. Decide según la tarea, la privacidad y los recursos disponibles.',
      guide: {
        objective: 'Elegir una forma de asistencia sin depender de una marca o modelo concreto.',
        keyIdeas: ['Un chat ayuda a explicar ideas y revisar fragmentos pequeños.', 'Un asistente en el editor puede proponer cambios en archivos; debes revisar qué modifica.', 'Un modelo local necesita recursos del equipo. No implica que cualquier extensión o herramienta conectada sea privada.', 'Una API permite integrar un modelo en un programa. Puede tener costos y necesita proteger sus credenciales.'],
        steps: ['Para entender una función, empieza con una explicación o un chat.', 'Para cambiar un proyecto, guarda una copia o usa control de versiones y revisa cada diferencia.', 'Antes de enviar código a un servicio, elimina claves, contraseñas y datos de otras personas.', 'Si evalúas un modelo local, comprueba memoria, licencia y qué conexiones hacen las herramientas que lo rodean.', 'Compara opciones con el mismo ejercicio y las mismas pruebas. Prioriza respuestas que puedas entender y verificar.'],
        practice: 'Elige cómo pedirías ayuda para una función de 10 líneas. Explica qué información enviarías y qué información mantendrías privada.',
      },
      knowledgeCheck: { question: '¿Qué debes hacer antes de enviar un archivo de configuración a un asistente?', choices: ['Copiarlo completo para ahorrar tiempo.', 'Revisar y retirar credenciales y datos privados.', 'Cambiar únicamente el nombre del archivo.'], correctIndex: 1, explanation: 'El nombre del archivo no protege su contenido. Revisa claves, contraseñas, tokens y datos personales antes de compartirlo.' },
    },
    { id: 'p5', title: 'Proyecto guiado: una aplicación de tareas', type: 'lab', durationMinutes: 60, points: 0, status: 'coming_soon', description: 'Próximo taller: construir una interfaz, guardar tareas y revisar los cambios propuestos por IA.' },
  ],
};
