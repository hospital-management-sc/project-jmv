-- Extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. pacientes
CREATE TABLE pacientes (
  id BIGSERIAL PRIMARY KEY,
  nro_historia VARCHAR(50) UNIQUE,
  apellidos_nombres VARCHAR(200) NOT NULL,
  ci VARCHAR(50) UNIQUE,
  fecha_nacimiento DATE,
  sexo VARCHAR(3) CHECK (sexo IN ('M','F')),
  nacionalidad VARCHAR(100),
  direccion VARCHAR(300),
  telefono VARCHAR(50),
  lugar_nacimiento VARCHAR(200),
  estado VARCHAR(100),
  region VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. personal_militar (opcional, un registro por paciente cuando aplica)
CREATE TABLE personal_militar (
  id BIGSERIAL PRIMARY KEY,
  paciente_id BIGINT UNIQUE REFERENCES pacientes(id) ON DELETE CASCADE,
  grado VARCHAR(50),
  componente VARCHAR(100),
  unidad VARCHAR(200)
);

-- 3. usuarios (médicos/administrativos)
CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  ci VARCHAR(50),
  cargo VARCHAR(100),
  email VARCHAR(200),
  role VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. admision (registro de admisión inicial)
CREATE TABLE admision (
  id BIGSERIAL PRIMARY KEY,
  paciente_id BIGINT NOT NULL REFERENCES pacientes(id),
  fecha_admision DATE NOT NULL,
  hora_admision TIME WITHOUT TIME ZONE,
  forma_ingreso VARCHAR(20) CHECK (forma_ingreso IN ('AMBULANTE','AMBULANCIA')) ,
  habitacion VARCHAR(50),
  firma_facultativo VARCHAR(200),
  estado_admision VARCHAR(50),
  created_by BIGINT REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. estancia_hospitalaria (alta y cálculo de días)
CREATE TABLE estancia_hospitalaria (
  id BIGSERIAL PRIMARY KEY,
  admision_id BIGINT UNIQUE REFERENCES admision(id) ON DELETE CASCADE,
  fecha_alta DATE,
  dias_hosp INT,
  diagnostico_ingreso_id BIGINT REFERENCES diagnosticos(id),
  diagnostico_egreso_id BIGINT REFERENCES diagnosticos(id),
  notas TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. diagnosticos (catálogo)
CREATE TABLE diagnosticos (
  id BIGSERIAL PRIMARY KEY,
  codigo_cie VARCHAR(20),
  descripcion VARCHAR(500) NOT NULL,
  tipo VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. encuentros (visitas/atenciones: emergencia, hospitalización, consulta)
CREATE TABLE encuentros (
  id BIGSERIAL PRIMARY KEY,
  paciente_id BIGINT NOT NULL REFERENCES pacientes(id),
  admision_id BIGINT REFERENCES admision(id),
  tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('EMERGENCIA','HOSPITALIZACION','CONSULTA','OTRO')),
  fecha DATE NOT NULL,
  hora TIME WITHOUT TIME ZONE,
  motivo_consulta VARCHAR(1000),
  enfermedad_actual TEXT,
  procedencia VARCHAR(200),
  nro_cama VARCHAR(50),
  created_by BIGINT REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. signos_vitales
CREATE TABLE signos_vitales (
  id BIGSERIAL PRIMARY KEY,
  encuentro_id BIGINT NOT NULL REFERENCES encuentros(id) ON DELETE CASCADE,
  ta_sistolica SMALLINT,
  ta_diastolica SMALLINT,
  pulso SMALLINT,
  temperatura NUMERIC(4,2),
  fr SMALLINT,
  observaciones VARCHAR(500),
  registrado_en TIMESTAMPTZ DEFAULT now()
);

-- 9. examen_regional
CREATE TABLE examen_regional (
  id BIGSERIAL PRIMARY KEY,
  encuentro_id BIGINT NOT NULL REFERENCES encuentros(id) ON DELETE CASCADE,
  piel TEXT,
  cabeza TEXT,
  cuello TEXT,
  torax TEXT,
  pulmones TEXT,
  corazon TEXT,
  abdomen TEXT,
  ano_recto TEXT,
  genitales TEXT
);

-- 10. antecedentes
CREATE TABLE antecedentes (
  id BIGSERIAL PRIMARY KEY,
  paciente_id BIGINT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  tipo VARCHAR(20) CHECK (tipo IN ('PERSONAL','FAMILIAR','OTRO')),
  descripcion TEXT,
  registrado_en TIMESTAMPTZ DEFAULT now()
);

-- 11. impresiones_diagnosticas
CREATE TABLE impresiones_diagnosticas (
  id BIGSERIAL PRIMARY KEY,
  encuentro_id BIGINT NOT NULL REFERENCES encuentros(id) ON DELETE CASCADE,
  codigo_cie VARCHAR(20),
  descripcion TEXT,
  clase VARCHAR(20) CHECK (clase IN ('PRESUNTIVO','CONFIRMADO')) DEFAULT 'PRESUNTIVO',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. audit_log (cambios críticos)
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  tabla VARCHAR(100) NOT NULL,
  registro_id BIGINT,
  usuario_id BIGINT,
  accion VARCHAR(50) NOT NULL,
  detalle JSONB,
  creado_en TIMESTAMPTZ DEFAULT now()
);

-- Índices básicos sugeridos
CREATE INDEX idx_pacientes_ci ON pacientes(ci);
CREATE INDEX idx_encuentros_paciente_fecha ON encuentros(paciente_id, fecha);
CREATE INDEX idx_admision_paciente ON admision(paciente_id);
CREATE INDEX idx_impresiones_codigo ON impresiones_diagnosticas(codigo_cie);