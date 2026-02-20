import { Request, Response } from 'express';
import { getPrismaClient } from '../database/connection';

const prisma = getPrismaClient();

/**
 * Helper: Procesar fecha/hora desde strings del frontend
 * Frontend envía fecha (YYYY-MM-DD) y hora (HH:MM) separados
 * Backend necesita convertir a DateTime para Prisma
 */
function processFechaHora(data: any): any {
  const processedData: any = { ...data };
  
  // Procesar fecha
  if (typeof data.fecha === 'string') {
    processedData.fecha = new Date(data.fecha);
  }
  
  // Procesar hora (combinar con fecha si ambos existen)
  if (typeof data.hora === 'string') {
    if (typeof data.fecha === 'string') {
      // Combinar fecha + hora para correcta zona horaria
      const [hours, minutes] = data.hora.split(':');
      const fechaHora = new Date(data.fecha);
      fechaHora.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      processedData.hora = fechaHora;
    } else {
      // Solo hora, usar fecha actual
      const [hours, minutes] = data.hora.split(':');
      const timeDate = new Date();
      timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      processedData.hora = timeDate;
    }
  }
  
  return processedData;
}

/**
 * Obtener formato de hospitalización por admisionId
 * GET /api/formato-hospitalizacion/admision/:admisionId
 */
export const getFormatoByAdmision = async (req: Request, res: Response): Promise<void> => {
  try {
    const { admisionId } = req.params;

    const formato = await prisma.formatoHospitalizacion.findFirst({
      where: { admisionId: Number(admisionId) },
      include: {
        signosVitales: { orderBy: { createdAt: 'desc' } },
        laboratorios: { orderBy: { fecha: 'desc' } },
        estudiosEspeciales: { orderBy: { fecha: 'desc' } },
        electrocardiogramas: { orderBy: { fecha: 'desc' } },
        antecedentesDetallados: true,
        examenFuncional: true,
        examenFisicoCompleto: true,
        resumenIngreso: true,
        ordenesMedicas: { orderBy: { fecha: 'desc' } },
        evolucionesMedicas: { orderBy: { fecha: 'desc' } },
      },
    });

    if (!formato) {
      res.status(404).json({ error: 'Formato de hospitalización no encontrado' });
      return;
    }

    res.json(formato);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener formato de hospitalización' });
  }
};

/**
 * Crear nuevo formato de hospitalización
 * POST /api/formato-hospitalizacion
 */
export const createFormato = async (req: Request, res: Response): Promise<void> => {
  try {
    const { admisionId, pacienteId } = req.body;

    if (!admisionId || !pacienteId) {
      res.status(400).json({ error: 'admisionId y pacienteId son requeridos' });
      return;
    }

    // Usar upsert para crear o devolver el existente
    const formato = await prisma.formatoHospitalizacion.upsert({
      where: { admisionId: Number(admisionId) },
      create: {
        admisionId: Number(admisionId),
        pacienteId: Number(pacienteId),
      },
      update: {}, // No actualizar nada si ya existe, solo devolverlo
      include: {
        signosVitales: true,
        laboratorios: true,
        estudiosEspeciales: true,
        electrocardiogramas: true,
        antecedentesDetallados: true,
        examenFuncional: true,
        examenFisicoCompleto: true,
        resumenIngreso: true,
        ordenesMedicas: true,
        evolucionesMedicas: true,
      },
    });

    res.status(201).json(formato);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al crear formato de hospitalización' });
  }
};

/**
 * Agregar signos vitales
 * POST /api/formato-hospitalizacion/:id/signos-vitales
 */
export const addSignosVitales = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Procesar fecha/hora
    let processedData = processFechaHora(data);
    
    // Convertir campos numéricos
    if (data.taSistolica) processedData.taSistolica = Number(data.taSistolica);
    if (data.taDiastolica) processedData.taDiastolica = Number(data.taDiastolica);
    if (data.tam) processedData.tam = parseFloat(data.tam);
    if (data.fc) processedData.fc = Number(data.fc);
    if (data.fr) processedData.fr = Number(data.fr);
    if (data.temperatura) processedData.temperatura = parseFloat(data.temperatura);
    if (data.spo2) processedData.spo2 = Number(data.spo2);

    const registro = await prisma.signosVitalesHosp.create({
      data: {
        formatoHospId: Number(id),
        ...processedData,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al agregar signos vitales', details: error.message });
  }
};

/**
 * Actualizar signos vitales
 * PUT /api/formato-hospitalizacion/signos-vitales/:id
 */
export const updateSignosVitales = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Procesar fecha/hora
    let processedData = processFechaHora(data);
    
    // Convertir campos numéricos
    if (data.taSistolica) processedData.taSistolica = Number(data.taSistolica);
    if (data.taDiastolica) processedData.taDiastolica = Number(data.taDiastolica);
    if (data.tam) processedData.tam = parseFloat(data.tam);
    if (data.fc) processedData.fc = Number(data.fc);
    if (data.fr) processedData.fr = Number(data.fr);
    if (data.temperatura) processedData.temperatura = parseFloat(data.temperatura);
    if (data.spo2) processedData.spo2 = Number(data.spo2);

    const registro = await prisma.signosVitalesHosp.update({
      where: { id: Number(id) },
      data: processedData,
    });

    res.json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar signos vitales', details: error.message });
  }
};

/**
 * Eliminar signos vitales
 * DELETE /api/formato-hospitalizacion/signos-vitales/:id
 */
export const deleteSignosVitales = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.signosVitalesHosp.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Error al eliminar signos vitales' });
  }
};

/**
 * Agregar laboratorio
 * POST /api/formato-hospitalizacion/:id/laboratorio
 */
export const addLaboratorio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Procesar fecha/hora
    const processedData = processFechaHora(data);

    const registro = await prisma.laboratorio.create({
      data: {
        formatoHospId: Number(id),
        ...processedData,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al agregar laboratorio', details: error.message });
  }
};

/**
 * Eliminar laboratorio
 * DELETE /api/formato-hospitalizacion/laboratorio/:id
 */
export const deleteLaboratorio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.laboratorio.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Error al eliminar laboratorio' });
  }
};

/**
 * Agregar estudio especial
 * POST /api/formato-hospitalizacion/:id/estudio-especial
 */
export const addEstudioEspecial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Procesar fecha/hora
    const processedData = processFechaHora(data);

    const registro = await prisma.estudioEspecial.create({
      data: {
        formatoHospId: Number(id),
        ...processedData,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al agregar estudio especial', details: error.message });
  }
};

/**
 * Eliminar estudio especial
 * DELETE /api/formato-hospitalizacion/estudio-especial/:id
 */
export const deleteEstudioEspecial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.estudioEspecial.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Error al eliminar estudio especial' });
  }
};

/**
 * Agregar electrocardiograma
 * POST /api/formato-hospitalizacion/:id/electrocardiograma
 */
export const addElectrocardiograma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Procesar fecha/hora
    const processedData = processFechaHora(data);

    const registro = await prisma.electrocardiograma.create({
      data: {
        formatoHospId: Number(id),
        ...processedData,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al agregar electrocardiograma', details: error.message });
  }
};

/**
 * Actualizar electrocardiograma
 * PUT /api/formato-hospitalizacion/electrocardiograma/:id
 */
export const updateElectrocardiograma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Procesar fecha/hora
    const processedData = processFechaHora(data);

    const registro = await prisma.electrocardiograma.update({
      where: { id: Number(id) },
      data: processedData,
    });

    res.json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar electrocardiograma', details: error.message });
  }
};

/**
 * Eliminar electrocardiograma
 * DELETE /api/formato-hospitalizacion/electrocardiograma/:id
 */
export const deleteElectrocardiograma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.electrocardiograma.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Error al eliminar electrocardiograma' });
  }
};

/**
 * Actualizar antecedentes detallados
 * PUT /api/formato-hospitalizacion/:id/antecedentes-detallados
 */
export const updateAntecedentesDetallados = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Buscar si existe
    const existente = await prisma.antecedentesDetallados.findFirst({
      where: { formatoHospId: Number(id) },
    });

    let registro;
    if (existente) {
      registro = await prisma.antecedentesDetallados.update({
        where: { id: existente.id },
        data,
      });
    } else {
      registro = await prisma.antecedentesDetallados.create({
        data: {
          formatoHospId: Number(id),
          ...data,
        },
      });
    }

    res.json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar antecedentes detallados' });
  }
};

/**
 * Actualizar examen funcional
 * PUT /api/formato-hospitalizacion/:id/examen-funcional
 */
export const updateExamenFuncional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existente = await prisma.examenFuncional.findFirst({
      where: { formatoHospId: Number(id) },
    });

    let registro;
    if (existente) {
      registro = await prisma.examenFuncional.update({
        where: { id: existente.id },
        data,
      });
    } else {
      registro = await prisma.examenFuncional.create({
        data: {
          formatoHospId: Number(id),
          ...data,
        },
      });
    }

    res.json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar examen funcional' });
  }
};

/**
 * Actualizar examen físico completo
 * PUT /api/formato-hospitalizacion/:id/examen-fisico-completo
 */
export const updateExamenFisicoCompleto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existente = await prisma.examenFisicoCompleto.findFirst({
      where: { formatoHospId: Number(id) },
    });

    let registro;
    if (existente) {
      registro = await prisma.examenFisicoCompleto.update({
        where: { id: existente.id },
        data,
      });
    } else {
      registro = await prisma.examenFisicoCompleto.create({
        data: {
          formatoHospId: Number(id),
          ...data,
        },
      });
    }

    res.json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar examen físico completo' });
  }
};

/**
 * Actualizar resumen de ingreso
 * PUT /api/formato-hospitalizacion/:id/resumen-ingreso
 */
export const updateResumenIngreso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existente = await prisma.resumenIngreso.findFirst({
      where: { formatoHospId: Number(id) },
    });

    let registro;
    if (existente) {
      registro = await prisma.resumenIngreso.update({
        where: { id: existente.id },
        data,
      });
    } else {
      registro = await prisma.resumenIngreso.create({
        data: {
          formatoHospId: Number(id),
          ...data,
        },
      });
    }

    res.json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar resumen de ingreso' });
  }
};

/**
 * Obtener órdenes médicas
 * GET /api/formato-hospitalizacion/:id/ordenes-medicas
 */
export const getOrdenesMedicas = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ordenes = await prisma.ordenMedica.findMany({
      where: { formatoHospId: Number(id) },
      orderBy: { fecha: 'desc' },
    });

    res.json(ordenes);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener órdenes médicas' });
  }
};

/**
 * Agregar orden médica
 * POST /api/formato-hospitalizacion/:id/orden-medica
 */
export const addOrdenMedica = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Procesar fecha/hora
    const processedData = processFechaHora(data);

    const registro = await prisma.ordenMedica.create({
      data: {
        formatoHospId: Number(id),
        ...processedData,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al agregar orden médica', details: error.message });
  }
};

/**
 * Actualizar orden médica
 * PUT /api/formato-hospitalizacion/orden-medica/:id
 */
export const updateOrdenMedica = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Procesar fecha/hora
    const processedData = processFechaHora(data);

    const registro = await prisma.ordenMedica.update({
      where: { id: Number(id) },
      data: processedData,
    });

    res.json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar orden médica', details: error.message });
  }
};

/**
 * Eliminar orden médica
 * DELETE /api/formato-hospitalizacion/orden-medica/:id
 */
export const deleteOrdenMedica = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.ordenMedica.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Error al eliminar orden médica' });
  }
};

/**
 * Agregar evolución médica
 * POST /api/formato-hospitalizacion/:id/evolucion-medica
 */
export const addEvolucionMedica = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Procesar fecha/hora
    const processedData = processFechaHora(data);

    const registro = await prisma.evolucionMedica.create({
      data: {
        formatoHospId: Number(id),
        ...processedData,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al agregar evolución médica', details: error.message });
  }
};

/**
 * Actualizar evolución médica
 * PUT /api/formato-hospitalizacion/evolucion-medica/:id
 */
export const updateEvolucionMedica = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Procesar fecha/hora
    const processedData = processFechaHora(data);

    const registro = await prisma.evolucionMedica.update({
      where: { id: Number(id) },
      data: processedData,
    });

    res.json(registro);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar evolución médica', details: error.message });
  }
};

/**
 * Eliminar evolución médica
 * DELETE /api/formato-hospitalizacion/evolucion-medica/:id
 */
export const deleteEvolucionMedica = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.evolucionMedica.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Error al eliminar evolución médica' });
  }
};
