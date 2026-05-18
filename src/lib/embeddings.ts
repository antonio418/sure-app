import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Genera un vector numérico (embedding) para un texto dado usando Gemini.
 * Útil para la memoria vectorial y búsquedas semánticas (RAG).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    });
    
    // El modelo devuelve un arreglo de números (típicamente 768 dimensiones)
    if (response.embeddings && response.embeddings.length > 0) {
      return response.embeddings[0].values || [];
    }
    throw new Error('No se pudo generar el embedding.');
  } catch (error) {
    console.error('Error generando embedding:', error);
    throw error;
  }
}
