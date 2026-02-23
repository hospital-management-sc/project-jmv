/**
 * Authorized Personnel Service (Personal Autorizado)
 * 
 * Este servicio implementa el sistema de "Whitelist" de personal autorizado.
 * Solo las personas que aparezcan en esta lista pueden registrarse en el sistema.
 * 
 * SEGURIDAD CRÍTICA:
 * - La tabla PersonalAutorizado es gestionada ÚNICAMENTE por autoridades del hospital
 * - Ningún usuario puede auto-registrarse si no está pre-autorizado
 * - Se valida CI, nombre y rol autorizado durante el registro
 * - Se registra auditoría de todas las operaciones
 */

import { getPrismaClient } from '../database/connection';
import { ValidationError, NotFoundError } from '../types/responses';
import logger from '../utils/logger';

const prisma = getPrismaClient();

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface AuthorizedPersonnelRecord {
  id: number;
  ci: string;
  nombreCompleto: string;
  email: string | null;
  rolAutorizado: string;
  departamento: string | null;
  cargo: string | null;
  estado: string;
  fechaIngreso: Date;
  fechaVencimiento: Date | null;
  registrado: boolean;
  fechaRegistro: Date | null;
  usuarioId: number | null;
}

export interface VerificationResult {
  isAuthorized: boolean;
  personnelRecord: AuthorizedPersonnelRecord | null;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface CreateAuthorizedPersonnelInput {
  ci: string;
  nombreCompleto: string;
  email?: string;
  rolAutorizado: string;
  departamento?: string;
  cargo?: string;
  fechaIngreso: Date;
  fechaVencimiento?: Date;
  autorizadoPor: string;
}

export interface UpdateAuthorizedPersonnelInput {
  nombreCompleto?: string;
  email?: string;
  rolAutorizado?: string;
  departamento?: string;
  cargo?: string;
  estado?: string;
  fechaVencimiento?: Date;
  motivoBaja?: string;
}

// ============================================
// ROLES VÁLIDOS DEL SISTEMA
// ============================================

export const VALID_ROLES = [
  'SUPER_ADMIN',  // Máximo nivel - gestiona whitelist y sistema
  'ADMIN',        // Administrativo - gestiona admisiones, citas
  'MEDICO',       // Personal médico
] as const;

export const ESTADOS_PERSONAL = [
  'ACTIVO',       // Puede registrarse/usar el sistema
  'INACTIVO',     // Temporalmente sin acceso
  'SUSPENDIDO',   // Acceso revocado temporalmente
  'BAJA',         // Ya no trabaja en el hospital
] as const;

// ============================================
// FUNCIONES DE VERIFICACIÓN
// ============================================

/**
 * Verifica si una persona está autorizada para registrarse en el sistema
 * Esta es la función PRINCIPAL de seguridad del sistema de whitelist
 * 
 * @param ci - Cédula de identidad del usuario
 * @param nombreCompleto - Nombre proporcionado en el registro
 * @param rolSolicitado - Rol que el usuario solicita
 * @param email - Email proporcionado en el registro (debe coincidir con whitelist)
 * @returns VerificationResult con el estado de autorización
 */
export const verifyAuthorizedPersonnel = async (
  ci: string,
  nombreCompleto: string,
  rolSolicitado: string,
  email: string
): Promise<VerificationResult> => {
  try {
    // Buscar en la whitelist por CI
    const personnelRecord = await prisma.personalAutorizado.findUnique({
      where: { ci: ci.toUpperCase() },
    });

    // VALIDACIÓN 1: Verificar existencia en whitelist
    if (!personnelRecord) {
      logger.security(`[WHITELIST] Intento de registro RECHAZADO - CI no autorizado: ${ci}`);
      return {
        isAuthorized: false,
        personnelRecord: null,
        errorCode: 'NOT_IN_WHITELIST',
        errorMessage: 'No está autorizado para registrarse. Contacte al departamento de Recursos Humanos del hospital.',
      };
    }

    // VALIDACIÓN 2: Verificar que no esté ya registrado
    if (personnelRecord.registrado) {
      logger.security(`[WHITELIST] Intento de registro RECHAZADO - Usuario ya registrado: ${ci}`);
      return {
        isAuthorized: false,
        personnelRecord: personnelRecord as AuthorizedPersonnelRecord,
        errorCode: 'ALREADY_REGISTERED',
        errorMessage: 'Ya existe una cuenta registrada con esta cédula. Si olvidó su contraseña, utilice la opción de recuperación.',
      };
    }

    // VALIDACIÓN 3: Verificar estado activo
    if (personnelRecord.estado !== 'ACTIVO') {
      logger.security(`[WHITELIST] Intento de registro RECHAZADO - Personal no activo: ${ci} (estado: ${personnelRecord.estado})`);
      return {
        isAuthorized: false,
        personnelRecord: personnelRecord as AuthorizedPersonnelRecord,
        errorCode: 'NOT_ACTIVE',
        errorMessage: `Su autorización está en estado "${personnelRecord.estado}". Contacte al departamento de Recursos Humanos.`,
      };
    }

    // VALIDACIÓN 4: Verificar vigencia temporal
    if (personnelRecord.fechaVencimiento) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expirationDate = new Date(personnelRecord.fechaVencimiento);
      expirationDate.setHours(0, 0, 0, 0);

      if (today > expirationDate) {
        logger.security(`[WHITELIST] Intento de registro RECHAZADO - Autorización vencida: ${ci}`);
        return {
          isAuthorized: false,
          personnelRecord: personnelRecord as AuthorizedPersonnelRecord,
          errorCode: 'AUTHORIZATION_EXPIRED',
          errorMessage: 'Su autorización ha vencido. Contacte al departamento de Recursos Humanos para renovarla.',
        };
      }
    }

    // VALIDACIÓN 5: Verificar coincidencia de nombre (tolerancia a mayúsculas/minúsculas)
    const normalizedDbName = personnelRecord.nombreCompleto.toLowerCase().trim();
    const normalizedInputName = nombreCompleto.toLowerCase().trim();
    
    // Calcular similitud del nombre (permitir pequeñas diferencias)
    if (!areNamesSimilar(normalizedDbName, normalizedInputName)) {
      logger.security(`[WHITELIST] Intento de registro RECHAZADO - Nombre no coincide: ${ci} (DB: ${personnelRecord.nombreCompleto}, Input: ${nombreCompleto})`);
      return {
        isAuthorized: false,
        personnelRecord: personnelRecord as AuthorizedPersonnelRecord,
        errorCode: 'NAME_MISMATCH',
        errorMessage: 'El nombre proporcionado no coincide con nuestros registros. Verifique que sea exactamente como aparece en su documento de identidad.',
      };
    }

    // VALIDACIÓN 6: Verificar que el email coincida EXACTAMENTE con la whitelist (CRÍTICA)
    if (!personnelRecord.email) {
      logger.security(`[WHITELIST] Intento de registro RECHAZADO - Email no registrado en whitelist: ${ci}`);
      return {
        isAuthorized: false,
        personnelRecord: personnelRecord as AuthorizedPersonnelRecord,
        errorCode: 'EMAIL_NOT_IN_WHITELIST',
        errorMessage: 'No hay un email registrado para esta cédula en nuestros registros. Contacte al departamento de Recursos Humanos.',
      };
    }

    const normalizedDbEmail = personnelRecord.email.toLowerCase().trim();
    const normalizedInputEmail = email.toLowerCase().trim();
    
    if (normalizedDbEmail !== normalizedInputEmail) {
      logger.security(`[WHITELIST] Intento de registro RECHAZADO - Email no coincide: ${ci} (DB: ${personnelRecord.email}, Input: ${email})`);
      return {
        isAuthorized: false,
        personnelRecord: personnelRecord as AuthorizedPersonnelRecord,
        errorCode: 'EMAIL_MISMATCH',
        errorMessage: 'El correo electrónico proporcionado no coincide con nuestros registros. Verifique que sea exactamente como aparece en la documentación de autorización del hospital.',
      };
    }

    // VALIDACIÓN 7: Verificar que el rol solicitado coincida con el autorizado
    if (personnelRecord.rolAutorizado !== rolSolicitado) {
      logger.security(`[WHITELIST] Intento de registro RECHAZADO - Rol no autorizado: ${ci} (autorizado: ${personnelRecord.rolAutorizado}, solicitado: ${rolSolicitado})`);
      return {
        isAuthorized: false,
        personnelRecord: personnelRecord as AuthorizedPersonnelRecord,
        errorCode: 'ROLE_NOT_AUTHORIZED',
        errorMessage: `No está autorizado para registrarse como "${rolSolicitado}". Su rol autorizado es "${personnelRecord.rolAutorizado}".`,
      };
    }

    // ✅ TODAS LAS VALIDACIONES PASARON
    logger.info(`[WHITELIST] Personal autorizado verificado exitosamente: ${ci}`);
    return {
      isAuthorized: true,
      personnelRecord: personnelRecord as AuthorizedPersonnelRecord,
      errorCode: null,
      errorMessage: null,
    };

  } catch (error) {
    logger.error('[WHITELIST] Error al verificar personal autorizado:', error);
    throw error;
  }
};

/**
 * Compara dos nombres permitiendo pequeñas diferencias
 * (acentos, espacios extra, orden de apellidos)
 */
function areNamesSimilar(name1: string, name2: string): boolean {
  // Normalizar: quitar acentos, espacios extra
  const normalize = (str: string) => str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/\s+/g, ' ')            // Normalizar espacios
    .trim()
    .toLowerCase();

  const n1 = normalize(name1);
  const n2 = normalize(name2);

  // Coincidencia exacta
  if (n1 === n2) return true;

  // Verificar que al menos el 85% de las palabras coincidan
  const words1 = n1.split(' ').filter(w => w.length > 1);
  const words2 = n2.split(' ').filter(w => w.length > 1);
  
  let matchCount = 0;
  for (const word of words1) {
    if (words2.some(w => w === word || w.includes(word) || word.includes(w))) {
      matchCount++;
    }
  }

  const similarity = matchCount / Math.max(words1.length, words2.length);
  return similarity >= 0.75; // Al menos 75% de palabras deben coincidir
}

/**
 * Marca a un personal autorizado como registrado después de crear su cuenta
 */
export const markAsRegistered = async (
  ci: string,
  usuarioId: number
): Promise<void> => {
  try {
    await prisma.personalAutorizado.update({
      where: { ci: ci.toUpperCase() },
      data: {
        registrado: true,
        fechaRegistro: new Date(),
        usuarioId: usuarioId,
      },
    });
    logger.info(`[WHITELIST] Personal marcado como registrado: ${ci}`);
  } catch (error) {
    logger.error('[WHITELIST] Error al marcar personal como registrado:', error);
    throw error;
  }
};

// ============================================
// FUNCIONES CRUD (Solo para SUPER_ADMIN)
// ============================================

/**
 * Obtener todos los registros de personal autorizado
 * Solo SUPER_ADMIN puede ver esta información
 */
export const getAllAuthorizedPersonnel = async (
  filters?: {
    estado?: string;
    rolAutorizado?: string;
    registrado?: boolean;
    departamento?: string;
  }
) => {
  const where: any = {};

  if (filters?.estado) where.estado = filters.estado;
  if (filters?.rolAutorizado) where.rolAutorizado = filters.rolAutorizado;
  if (filters?.registrado !== undefined) where.registrado = filters.registrado;
  if (filters?.departamento) where.departamento = filters.departamento;

  return prisma.personalAutorizado.findMany({
    where,
    orderBy: { nombreCompleto: 'asc' },
    include: {
      usuario: {
        select: {
          id: true,
          nombre: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });
};

/**
 * Obtener un registro de personal autorizado por CI
 */
export const getAuthorizedPersonnelByCI = async (ci: string) => {
  return prisma.personalAutorizado.findUnique({
    where: { ci: ci.toUpperCase() },
    include: {
      usuario: {
        select: {
          id: true,
          nombre: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });
};

/**
 * Agregar nuevo personal autorizado a la whitelist
 * Solo SUPER_ADMIN puede ejecutar esta acción
 */
export const addAuthorizedPersonnel = async (
  input: CreateAuthorizedPersonnelInput,
  adminUserId: number
) => {
  // Validar CI
  const ciRegex = /^[VEP]\d{7,9}$/;
  if (!ciRegex.test(input.ci.toUpperCase())) {
    throw new ValidationError('Formato de C.I. inválido. Debe ser V, E o P seguido de 7-9 dígitos.');
  }

  // Validar rol
  if (!VALID_ROLES.includes(input.rolAutorizado as any)) {
    throw new ValidationError(`Rol inválido. Roles válidos: ${VALID_ROLES.join(', ')}`);
  }

  // Verificar que no exista ya
  const existing = await prisma.personalAutorizado.findUnique({
    where: { ci: input.ci.toUpperCase() },
  });

  if (existing) {
    throw new ValidationError('Ya existe un registro con esta cédula de identidad.');
  }

  // Crear registro
  const newRecord = await prisma.personalAutorizado.create({
    data: {
      ci: input.ci.toUpperCase(),
      nombreCompleto: input.nombreCompleto.trim(),
      email: input.email?.toLowerCase().trim(),
      rolAutorizado: input.rolAutorizado,
      departamento: input.departamento,
      cargo: input.cargo,
      fechaIngreso: input.fechaIngreso,
      fechaVencimiento: input.fechaVencimiento,
      autorizadoPor: input.autorizadoPor,
      estado: 'ACTIVO',
      registrado: false,
    },
  });

  // Registrar en auditoría
  await prisma.auditLog.create({
    data: {
      tabla: 'PersonalAutorizado',
      registroId: newRecord.id,
      usuarioId: adminUserId,
      accion: 'CREATE',
      detalle: {
        ci: newRecord.ci,
        nombreCompleto: newRecord.nombreCompleto,
        rolAutorizado: newRecord.rolAutorizado,
        autorizadoPor: newRecord.autorizadoPor,
      },
    },
  });

  logger.info(`[WHITELIST] Nuevo personal autorizado agregado: ${input.ci} por admin ${adminUserId}`);
  return newRecord;
};

/**
 * Actualizar registro de personal autorizado
 * Solo SUPER_ADMIN puede ejecutar esta acción
 */
export const updateAuthorizedPersonnel = async (
  ci: string,
  input: UpdateAuthorizedPersonnelInput,
  adminUserId: number
) => {
  const existing = await prisma.personalAutorizado.findUnique({
    where: { ci: ci.toUpperCase() },
  });

  if (!existing) {
    throw new NotFoundError('Personal autorizado no encontrado.');
  }

  // Validar rol si se está actualizando
  if (input.rolAutorizado && !VALID_ROLES.includes(input.rolAutorizado as any)) {
    throw new ValidationError(`Rol inválido. Roles válidos: ${VALID_ROLES.join(', ')}`);
  }

  // Validar estado si se está actualizando
  if (input.estado && !ESTADOS_PERSONAL.includes(input.estado as any)) {
    throw new ValidationError(`Estado inválido. Estados válidos: ${ESTADOS_PERSONAL.join(', ')}`);
  }

  const updatedRecord = await prisma.personalAutorizado.update({
    where: { ci: ci.toUpperCase() },
    data: {
      ...input,
      nombreCompleto: input.nombreCompleto?.trim(),
      email: input.email?.toLowerCase().trim(),
    },
  });

  // Registrar en auditoría
  await prisma.auditLog.create({
    data: {
      tabla: 'PersonalAutorizado',
      registroId: updatedRecord.id,
      usuarioId: adminUserId,
      accion: 'UPDATE',
      detalle: {
        ci: updatedRecord.ci,
        cambios: JSON.parse(JSON.stringify(input)),
      },
    },
  });

  logger.info(`[WHITELIST] Personal autorizado actualizado: ${ci} por admin ${adminUserId}`);
  return updatedRecord;
};

/**
 * Dar de baja a personal autorizado
 * Solo SUPER_ADMIN puede ejecutar esta acción
 * Esto NO elimina el registro, solo lo marca como BAJA
 */
export const deactivateAuthorizedPersonnel = async (
  ci: string,
  motivoBaja: string,
  adminUserId: number
) => {
  const existing = await prisma.personalAutorizado.findUnique({
    where: { ci: ci.toUpperCase() },
  });

  if (!existing) {
    throw new NotFoundError('Personal autorizado no encontrado.');
  }

  if (!motivoBaja || motivoBaja.trim().length < 10) {
    throw new ValidationError('Debe proporcionar un motivo de baja detallado (mínimo 10 caracteres).');
  }

  const updatedRecord = await prisma.personalAutorizado.update({
    where: { ci: ci.toUpperCase() },
    data: {
      estado: 'BAJA',
      motivoBaja: motivoBaja.trim(),
    },
  });

  // Registrar en auditoría
  await prisma.auditLog.create({
    data: {
      tabla: 'PersonalAutorizado',
      registroId: updatedRecord.id,
      usuarioId: adminUserId,
      accion: 'DEACTIVATE',
      detalle: {
        ci: updatedRecord.ci,
        motivoBaja: motivoBaja,
        fechaBaja: new Date().toISOString(),
      },
    },
  });

  logger.security(`[WHITELIST] Personal dado de baja: ${ci} por admin ${adminUserId}. Motivo: ${motivoBaja}`);
  return updatedRecord;
};

/**
 * Estadísticas de la whitelist
 */
export const getWhitelistStats = async () => {
  const [total, activos, registrados, porRol] = await Promise.all([
    prisma.personalAutorizado.count(),
    prisma.personalAutorizado.count({ where: { estado: 'ACTIVO' } }),
    prisma.personalAutorizado.count({ where: { registrado: true } }),
    prisma.personalAutorizado.groupBy({
      by: ['rolAutorizado'],
      _count: { id: true },
    }),
  ]);

  return {
    total,
    activos,
    registrados,
    pendientesRegistro: activos - registrados,
    porRol: porRol.map(r => ({ rol: r.rolAutorizado, cantidad: Number(r._count.id) })),
  };
};
