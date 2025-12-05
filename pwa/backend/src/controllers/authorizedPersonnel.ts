/**
 * Authorized Personnel Controller
 * 
 * Controlador para gestionar la whitelist de personal autorizado.
 * La validación de SUPER_ADMIN está garantizada por middleware,
 * por lo que no es necesario verificar nuevamente aquí.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  getAllAuthorizedPersonnel,
  getAuthorizedPersonnelByCI,
  addAuthorizedPersonnel,
  updateAuthorizedPersonnel,
  deactivateAuthorizedPersonnel,
  getWhitelistStats,
} from '../services/authorizedPersonnel';
import { ValidationError, AppError } from '../types/responses';
import logger from '../utils/logger';

/**
 * GET /api/authorized-personnel
 * Lista todo el personal autorizado con filtros opcionales
 */
export const getAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { estado, rol, registrado, departamento } = req.query;

    const filters = {
      estado: estado as string | undefined,
      rolAutorizado: rol as string | undefined,
      registrado: registrado === 'true' ? true : registrado === 'false' ? false : undefined,
      departamento: departamento as string | undefined,
    };

    const personnel = await getAllAuthorizedPersonnel(filters);

    // Convert BigInt to number for JSON serialization
    const serialized = personnel.map(p => ({
      ...p,
      id: Number(p.id),
      usuarioId: p.usuarioId ? Number(p.usuarioId) : null,
      usuario: p.usuario ? {
        ...p.usuario,
        id: Number(p.usuario.id),
      } : null,
    }));

    res.status(200).json({
      success: true,
      data: serialized,
      count: serialized.length,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Error getting authorized personnel:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error al obtener personal autorizado',
      });
    }
  }
};

/**
 * GET /api/authorized-personnel/stats
 * Obtiene estadísticas de la whitelist
 */
export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await getWhitelistStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Error getting whitelist stats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error al obtener estadísticas',
      });
    }
  }
};

/**
 * GET /api/authorized-personnel/:ci
 * Obtiene un registro de personal autorizado por CI
 */
export const getByCI = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ci } = req.params;

    if (!ci) {
      throw new ValidationError('CI es requerido');
    }

    const personnel = await getAuthorizedPersonnelByCI(ci);

    if (!personnel) {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Personal autorizado no encontrado',
      });
      return;
    }

    // Convert BigInt to number for JSON serialization
    const serialized = {
      ...personnel,
      id: Number(personnel.id),
      usuarioId: personnel.usuarioId ? Number(personnel.usuarioId) : null,
      usuario: personnel.usuario ? {
        ...personnel.usuario,
        id: Number(personnel.usuario.id),
      } : null,
    };

    res.status(200).json({
      success: true,
      data: serialized,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Error getting authorized personnel by CI:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error al obtener personal autorizado',
      });
    }
  }
};

/**
 * POST /api/authorized-personnel
 * Agrega nuevo personal a la whitelist
 */
export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      ci,
      nombreCompleto,
      email,
      rolAutorizado,
      departamento,
      cargo,
      fechaIngreso,
      fechaVencimiento,
    } = req.body;

    // Validaciones
    if (!ci || !nombreCompleto || !rolAutorizado || !fechaIngreso) {
      throw new ValidationError('CI, nombre completo, rol autorizado y fecha de ingreso son requeridos');
    }

    const newPersonnel = await addAuthorizedPersonnel(
      {
        ci,
        nombreCompleto,
        email,
        rolAutorizado,
        departamento,
        cargo,
        fechaIngreso: new Date(fechaIngreso),
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
        autorizadoPor: req.user?.nombre || 'Sistema',
      },
      Number(req.user!.id)
    );

    // Convert BigInt to number for JSON serialization
    const serialized = {
      ...newPersonnel,
      id: Number(newPersonnel.id),
      usuarioId: newPersonnel.usuarioId ? Number(newPersonnel.usuarioId) : null,
    };

    res.status(201).json({
      success: true,
      data: serialized,
      message: 'Personal autorizado agregado exitosamente',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Error creating authorized personnel:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error al agregar personal autorizado',
      });
    }
  }
};

/**
 * PUT /api/authorized-personnel/:ci
 * Actualiza un registro de personal autorizado
 */
export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ci } = req.params;
    const updateData = req.body;

    if (!ci) {
      throw new ValidationError('CI es requerido');
    }

    // Parse dates if provided
    if (updateData.fechaVencimiento) {
      updateData.fechaVencimiento = new Date(updateData.fechaVencimiento);
    }

    const updatedPersonnel = await updateAuthorizedPersonnel(
      ci,
      updateData,
      Number(req.user!.id)
    );

    // Convert BigInt to number for JSON serialization
    const serialized = {
      ...updatedPersonnel,
      id: Number(updatedPersonnel.id),
      usuarioId: updatedPersonnel.usuarioId ? Number(updatedPersonnel.usuarioId) : null,
    };

    res.status(200).json({
      success: true,
      data: serialized,
      message: 'Personal autorizado actualizado exitosamente',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Error updating authorized personnel:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error al actualizar personal autorizado',
      });
    }
  }
};

/**
 * DELETE /api/authorized-personnel/:ci
 * Da de baja a un personal autorizado (no elimina, cambia estado a BAJA)
 */
export const deactivate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ci } = req.params;
    const { motivoBaja } = req.body;

    if (!ci) {
      throw new ValidationError('CI es requerido');
    }

    if (!motivoBaja) {
      throw new ValidationError('Motivo de baja es requerido');
    }

    const updatedPersonnel = await deactivateAuthorizedPersonnel(
      ci,
      motivoBaja,
      Number(req.user!.id)
    );

    // Convert BigInt to number for JSON serialization
    const serialized = {
      ...updatedPersonnel,
      id: Number(updatedPersonnel.id),
      usuarioId: updatedPersonnel.usuarioId ? Number(updatedPersonnel.usuarioId) : null,
    };

    res.status(200).json({
      success: true,
      data: serialized,
      message: 'Personal dado de baja exitosamente',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Error deactivating authorized personnel:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error al dar de baja personal autorizado',
      });
    }
  }
};

/**
 * POST /api/authorized-personnel/bulk
 * Agrega múltiples registros de personal a la whitelist (carga masiva)
 */
export const bulkCreate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { personnel } = req.body;

    if (!Array.isArray(personnel) || personnel.length === 0) {
      throw new ValidationError('Se requiere un array de personal autorizado');
    }

    if (personnel.length > 100) {
      throw new ValidationError('Máximo 100 registros por carga');
    }

    const results = {
      created: [] as any[],
      errors: [] as any[],
    };

    for (const person of personnel) {
      try {
        const newPersonnel = await addAuthorizedPersonnel(
          {
            ci: person.ci,
            nombreCompleto: person.nombreCompleto,
            email: person.email,
            rolAutorizado: person.rolAutorizado,
            departamento: person.departamento,
            cargo: person.cargo,
            fechaIngreso: new Date(person.fechaIngreso),
            fechaVencimiento: person.fechaVencimiento ? new Date(person.fechaVencimiento) : undefined,
            autorizadoPor: req.user?.nombre || 'Sistema (Carga Masiva)',
          },
          Number(req.user!.id)
        );

        results.created.push({
          ci: newPersonnel.ci,
          nombreCompleto: newPersonnel.nombreCompleto,
          id: Number(newPersonnel.id),
        });
      } catch (error: any) {
        results.errors.push({
          ci: person.ci,
          error: error.message || 'Error desconocido',
        });
      }
    }

    res.status(201).json({
      success: true,
      data: results,
      message: `Procesados ${personnel.length} registros: ${results.created.length} creados, ${results.errors.length} errores`,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Error bulk creating authorized personnel:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error en carga masiva de personal autorizado',
      });
    }
  }
};
