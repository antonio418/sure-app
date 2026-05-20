/**
 * Utilidad robusta para extraer y parsear JSON generado por modelos de IA (Claude, etc.).
 * Maneja desviaciones comunes como bloques markdown mal formados, texto conversacional extra,
 * comas flotantes (trailing commas) y saltos de línea literales dentro de cadenas de texto.
 */
export function extractAndParseJSON(str: string): any {
  if (!str) {
    throw new Error("Cadena vacía o indefinida suministrada al parseador JSON.");
  }

  let cleaned = str.trim();

  // 1. Descartar bloques markdown de código si están presentes
  if (cleaned.includes('```json')) {
    cleaned = cleaned.split('```json')[1].split('```')[0].trim();
  } else if (cleaned.includes('```')) {
    cleaned = cleaned.split('```')[1].split('```')[0].trim();
  }

  // 2. Extraer el primer '{' y el último '}' para ignorar textos conversacionales iniciales/finales
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  // 3. Corregir comas de cierre huérfanas en arreglos y objetos (trailing commas)
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  // 4. Intentar parseo directo
  try {
    return JSON.parse(cleaned);
  } catch (firstError: any) {
    console.warn("Primer intento de parseo JSON falló. Aplicando reparación de saltos de línea crudos...", firstError.message);
    
    // 5. Corregir saltos de línea crudos (new lines) dentro de cadenas de texto.
    // Un JSON válido prohíbe saltos de línea literales dentro de un string de texto. Debe usarse '\n' escapado.
    try {
      const lines = cleaned.split('\n');
      let repaired = '';
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        repaired += line;
        if (i < lines.length - 1) {
          const trimmedLine = line.trim();
          // Decidir si el salto de línea es estructural (separador de JSON) o si es parte de un valor de texto
          if (
            trimmedLine.endsWith(',') || 
            trimmedLine.endsWith('{') || 
            trimmedLine.endsWith('[') || 
            trimmedLine.endsWith('}') || 
            trimmedLine.endsWith(']') || 
            trimmedLine.endsWith(':') ||
            trimmedLine.startsWith('"') && trimmedLine.endsWith('"')
          ) {
            repaired += '\n'; // Es estructural
          } else {
            repaired += '\\n'; // Es parte de un string, lo escapamos
          }
        }
      }
      
      // Aplicar corrección final de comas huérfanas de nuevo en la cadena reparada
      repaired = repaired.replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(repaired);
    } catch (secondError: any) {
      throw new Error(`Error crítico al parsear JSON de la IA. Original: ${firstError.message}. Reparado: ${secondError.message}. Contenido crudo: ${str}`);
    }
  }
}
