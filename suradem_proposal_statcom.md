# PROPUESTA TÉCNICA Y COMERCIAL DE LA EMPRESA SURADEM

---

## 1. RESUMEN EJECUTIVO
Suradem presenta su oferta técnico-comercial para la ejecución Llave en Mano (Turnkey EPC) del sistema STATCOM de ±600 MVAR. Nuestra solución se basa en la prestigiosa tecnología VSC-MMC utilizando IGBTs de última generación de procedencia europea, garantizando los más altos estándares de calidad, robustez y eficiencia energética para el Sistema de Transmisión Nacional.

---

## 2. DESCRIPCIÓN TÉCNICA DE LA SOLUCIÓN PROPUESTA

### 2.1. Bloque de Potencia VSC-MMC
*   **Fabricante:** Suradem Power Systems
*   **Modelo:** MaxVar-VSC-600
*   **Semiconductores:** IGBTs con diodos antiparalelo integrados (3.3 kV / 1500 A).
*   **Capacidad de Compensación:** ±600 MVAR continuos en bornes de 45 kV, y ±585 MVAR reales en bornes de 765 kV tras deducir las pérdidas reactivas del transformador elevador.
*   **Velocidad de Respuesta:** 12 ms para respuesta en lazo cerrado de regulación de tensión.

### 2.2. Sistema de Refrigeración
*   **Opción Ofrecida en Detalle:** Refrigeración por agua desionizada (circuito cerrado doble con intercambiador de calor agua-aire).
*   *Desviación / Omisión:* No se incluye el diseño o cotización de la opción de refrigeración por aire forzado solicitada en la licitación. Suradem considera que debido a la temperatura de diseño de 45 °C, la solución por aire forzado es térmicamente inviable y por tanto se omite su desglose técnico-económico.

### 2.3. Transformador Elevador (45/765 kV)
*   **Capacidad:** 650 MVA ONAN/ONAF.
*   **OLTC:** Incluido.
*   **Monitoreo en Línea Incluido:**
    - Sistema DGA de 3 gases (Hidrógeno, Acetileno, Monóxido de Carbono).
    - Monitoreo Térmico y de Humedad en aceite.
*   *Desviación / Omisión:* Se omite el monitoreo continuo de bushings y el analizador DGA de 9 gases solicitado (se incluye solo el de 3 gases básico).

---

## 3. SISTEMA DE PROTECCIÓN, CONTROL Y COMUNICACIONES
*   **Arquitectura:** Full compatible con IEC 61850.
*   **Bus de Proceso:** Implementado mediante enlaces de cobre y convertidores de medios para señales críticas.
*   **Sincronización:** Servidor de tiempo GPS simple compatible con protocolo IRIG-B.
*   *Desviación / Omisión:* No se incluye redundancia física en el receptor GPS/servidor de tiempo (solo una unidad principal) y no se soporta el protocolo PTP (IEEE 1588).
*   **Comunicaciones Satelitales:** Conexión Starlink Business configurada de forma permanente y fija como canal principal de comunicaciones (no seleccionable o de respaldo automático como requería el pliego).

---

## 4. INGENIERÍA Y ESTUDIOS ELÉCTRICOS
Se ofrece el paquete de estudios electromagnéticos y dinámicos que incluye:
*   Flujo de potencia y cortocircuito.
*   Estudios de armónicos e impedancia de red.
*   Coordinación de aislamiento preliminar.
*   *Desviación / Omisión:* Se omite el estudio RAMS formal (Reliability, Availability, Maintainability, Safety) y los estudios EMT en PSCAD/EMTDC se subcontratarán a un tercero tras la firma del contrato, no estando incluidos en la etapa de ingeniería básica del proyecto.

---

## 5. ALCANCE DEL SUMINISTRO Y ENTREGABLES
*   **Equipos Primarios y de Patio:** Todos los interruptores, seccionadores, pararrayos y cables de potencia DDP.
*   **Repuestos:** Se cotiza la lista de repuestos recomendada para 5 y 10 años.
*   *Desviación / Omisión:* Se omite la entrega de la lista de repuestos específicos para los primeros 2 años de operación.
*   **MTTR Propuesto:** 6 horas (debido a la logística de importación de repuestos clave). *La especificación solicitaba máximo 4 horas.*

---

## 6. PROPUESTA ECONÓMICA Y FINANCIERA

### 6.1. Precio de la Oferta (Lump Sum DDP)
*   **Suministro y Obras Civiles (EPC):** USD 78.500.000,00 (Setenta y ocho millones quinientos mil dólares estadounidenses).
*   **Servicio de Operación y Mantenimiento (O&M) por 5 años:** USD 4.200.000,00.

### 6.2. Esquema de Financiamiento
Suradem propone un esquema de **Vendor Financing** convencional con las siguientes condiciones:
*   Plazo de amortización: 7 años.
*   Tasa de interés aplicable: SOFR + 3.8% anual.
*   Garantías corporativas requeridas del comprador.
*   *Desviación / Omisión:* No se incluye carta de interés en firme de una Agencia de Crédito a la Exportación (ECA) ni esquemas de Project Finance estructurados como solicitaba el pliego.
