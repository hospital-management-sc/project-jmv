/**
 * Utilidad para convertir BigInt a String en objetos
 * Prisma usa BigInt para IDs, pero JSON no lo soporta nativamente
 */

export function convertBigIntToString(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertBigIntToString(value);
    }
    return result;
  }

  return obj;
}

/**
 * Middleware para convertir BigInt en respuestas JSON
 */
export function bigIntMiddleware(data: unknown): unknown {
  return convertBigIntToString(data);
}
