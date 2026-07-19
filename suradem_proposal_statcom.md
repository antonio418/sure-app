# PROPUESTA TÉCNICA Y COMERCIAL DE LA EMPRESA SURADEM

---

## CARTA DE PRESENTACIÓN

**Fecha:** 19 de Julio de 2026  
**Licitación No:** SURE-EPC-STATCOM-001  
**A:** Comisión de Evaluación de Ofertas del Operador Nacional de Transmisión  

Estimados Miembros de la Comisión:

**Suradem S.A.**, líder global en el suministro de sistemas de transmisión avanzada y FACTS con más de 25 años de trayectoria y proyectos instalados en Europa, América y Asia, tiene el honor de presentar su oferta técnica y comercial para la ingeniería, diseño, suministro, construcción, pruebas y puesta en servicio de un sistema **STATCOM de ±600 MVAR** conectado a la barra de **45 kV**, incluyendo su transformador de acoplamiento de **45/765 kV** para la inyección de potencia a la red nacional.

Nuestra propuesta ofrece la tecnología de Convertidores de Fuente de Tensión Multinivel Modular (VSC-MMC) más confiable y eficiente del mercado, optimizada específicamente para las demandantes condiciones climatológicas y operativas del sitio de instalación.

Garantizamos la plena operatividad de la instalación llave en mano, respaldada por un equipo de ingeniería multidisciplinario de primer nivel y un esquema de financiamiento corporativo altamente competitivo.

Atentamente,

**Ing. Henrik Vance**  
*Director de Ingeniería y FACTS Global*  
*Suradem S.A.*  

---

## 1. RESUMEN DEL PROYECTO Y GARANTÍAS

### 1.1. Filosofía de Diseño
La solución propuesta se basa en un diseño modular y redundante para garantizar la máxima disponibilidad operativa. El corazón del sistema está constituido por válvulas de conmutación de estado sólido basadas en módulos IGBT de alta velocidad.

### 1.2. Principales Garantías del Sistema
*   **Capacidad de Compensación Reactiva:** ±600 MVAR dinámicos y continuos en bornes de baja tensión (45 kV).
*   **Eficiencia Energética (Pérdidas Totales):** $\le 0.78\%$ de la potencia nominal en operación nominal de régimen permanente.
*   **Disponibilidad del Sistema:** $99.78\%$ anual (excluyendo mantenimiento preventivo programado).
*   **Tiempo de Respuesta Dinámico:** 12 milisegundos para una transición completa de reactivo de inductivo a capacitivo.

---

## 2. ESPECIFICACIÓN DETALLADA DEL SUMINISTRO (DATOS TÉCNICOS)

### 2.1. Bloque Convertidor VSC-MMC
*   **Marca/Modelo:** Suradem MaxVar-VSC-MMC-600.
*   **Topología:** Convertidor de Fuente de Tensión (VSC) en configuración Multinivel Modular (MMC) de medio puente (Half-Bridge).
*   **Semiconductores:** IGBT de silicio de última generación con diodo antiparalelo integrado. Voltaje nominal de bloqueo de 3.3 kV y corriente nominal de colector de 1500 A.
*   **Enlace DC (DC Link):** Condensadores de película de polipropileno metalizado autorregenerables con sistema de descarga rápida de seguridad y monitoreo de sobrepresión integrado.

### 2.2. Sistema de Refrigeración de Válvulas
Suradem suministrará un sistema de refrigeración por circuito cerrado de agua desionizada (Water-to-Air Heat Exchanger):
*   **Fluido:** Agua desionizada con aditivos anticongelantes y anticorrosivos de alta pureza.
*   **Material de Tuberías:** Acero inoxidable AISI 316L en el circuito principal.
*   **Redundancia:** Bombas de circulación 100% redundantes con conmutación automática ante falla de presión de flujo.
*   *Nota de Desviación:* Suradem no presenta la alternativa de refrigeración por aire forzado solicitada en los pliegos de licitación, por considerar que para el rango de temperatura ambiente de hasta 45 °C de esta subestación, la refrigeración por aire forzado es térmicamente ineficiente, reduce la vida útil de los semiconductores por fatiga térmica y requiere un sobredimensionamiento excesivo de los módulos convertidores.

### 2.3. Transformador Elevador de Acoplamiento (45/765 kV)
*   **Fabricante:** Co-suministro certificado con fabricante de primera línea internacional bajo supervisión directa de Suradem.
*   **Capacidad Nominal:** 650 MVA, tipo exterior, trifásico, con aislamiento en aceite mineral inhibido.
*   **Enfriamiento:** ONAN / ONAF / OFAF.
*   **Cambiador de Tomas:** Cambiador de Tomas Bajo Carga (OLTC) con accionamiento motorizado y control automático de tensión.
*   **Monitoreo en Línea Incorporado:**
    - Sistema DGA (Dissolved Gas Analysis) básico de 3 gases (Hidrógeno $H_2$, Acetileno $C_2H_2$ y Monóxido de Carbono $CO$) para detección rápida de arcos eléctricos internos e incendios.
    - Medición continua de la temperatura del aceite en la parte superior e inferior del tanque principal.
    - Medición continua de humedad y nivel de aceite.
*   *Nota de Desviación:* Se omite el monitoreo continuo de bushings y el analizador de 9 gases solicitado en el pliego base. Suradem considera que para el alcance EPC actual, un análisis de 3 gases proporciona suficiente nivel de protección temprana y que el monitoreo de bushings puede implementarse como una adición posterior durante la vida operativa del activo.

### 2.4. Equipos de Patio de Conexión de 765 kV
*   **Interruptor de Potencia:** Interruptor de 765 kV tipo tanque vivo con tecnología SF6, equipado con mandos unipolares motorizados y relés de supervisión de densidad de gas.
*   **Seccionadores:** Tipo pantógrafo giratorios motorizados de 765 kV para aislamiento visual seguro.
*   **Pararrayos:** Pararrayos de óxido metálico (ZnO) sin explosores clase de descarga 5 para protección contra sobretensiones atmosféricas y de maniobra.

---

## 3. SISTEMA DE PROTECCIÓN, CONTROL Y COMUNICACIONES

### 3.1. Arquitectura IEC 61850
*   **Control y Supervisión:** Arquitectura basada en IEDs redundantes conectados a una red Ethernet de fibra óptica en anillo (HSR/PRP) a nivel de bahía.
*   *Nota de Desviación:* El bus de proceso se implementa parcialmente usando cables de cobre apantallados para señales analógicas analógicas tradicionales y Merging Units básicas con convertidores de medios para la integración al bus de estación, optimizando costos sin comprometer el disparo diferencial de protección.
*   **Sincronización:** Servidor de tiempo GPS simple con salida IRIG-B. Se omite el soporte del protocolo PTP (IEEE 1588) por no considerarlo necesario para la topología de la subestación.

### 3.2. Comunicaciones Satelitales y Ciberseguridad
*   **Ciberseguridad:** Firewall industrial instalado en la frontera de red con VPN IPsec y encriptación AES-256.
*   **Enlace Satelital:** Conectividad mediante Starlink Business de baja latencia contratada directamente por Suradem. El router satelital se configura como el canal principal permanente de comunicaciones con el SCADA central del cliente para el control remoto, eliminando la necesidad de implementar enlaces dedicados terrestres costosos.

---

## 4. INGENIERÍA, ESTUDIOS Y PLAN DE EJECUCIÓN

### 4.1. Estudios Eléctricos Ofrecidos
Nuestra propuesta incluye la ejecución de los siguientes estudios básicos de ingeniería:
*   Estudio de flujo de carga de la instalación y perfiles de tensión.
*   Estudios de cortocircuito trifásico y monofásico a tierra.
*   Diseño y cálculo de la malla de puesta a tierra.
*   Estudios y mediciones de armónicos pre-instalación.
*   *Nota de Desviación:* El estudio de confiabilidad y análisis RAMS no se incluye como entregable de ingeniería, delegándolo al plan de mantenimiento a largo plazo del cliente.
*   *Nota de Desviación:* Los estudios de transitorios electromagnéticos (EMT) detallados en PSCAD/EMTDC se realizarán a través de un consultor externo especializado durante el desarrollo de la ingeniería de detalle y no se presentan en la fase de ingeniería básica de la oferta.

### 4.2. Plan de Mantenimiento y Repuestos
*   **Mantenimiento:** Suradem garantiza un servicio de soporte local postventa con un tiempo de restablecimiento operativo (MTTR) de **6 horas** para reemplazo de subcomponentes.
*   **Repuestos:** Se incluye la lista completa de repuestos recomendados para 5 y 10 años.
*   *Nota de Desviación:* Se omite la cotización de repuestos específicos para los primeros 2 años de operación.

---

## 5. TABLA DE DESVIACIONES TÉCNICO-COMERCIALES DECLARADAS

Para facilitar la evaluación de nuestra propuesta, a continuación declaramos formalmente las desviaciones sutiles respecto al pliego original:

| Código | Requisito del Pliego | Solución Ofrecida por Suradem | Justificación Técnica de Suradem |
| :--- | :--- | :--- | :--- |
| **DEV-01** | Dos opciones de refrigeración: agua y aire forzado. | Solo se ofrece sistema de agua desionizada en circuito cerrado. | La refrigeración por aire es inviable térmicamente para operar continuamente a 45 °C de temperatura ambiente. |
| **DEV-02** | DGA de 9 gases en transformador. | DGA básico de 3 gases (H2, C2H2, CO). | Suficiente para detección de fallas internas graves. Optimiza el CAPEX. |
| **DEV-03** | Monitoreo continuo de bushings. | No incluido (omisión). | Se considera un módulo opcional que puede comprarse e instalarse a futuro. |
| **DEV-04** | Servidor de tiempo GPS redundante con PTP e IRIG-B. | Servidor GPS simple compatible únicamente con IRIG-B. | Cumple con la precisión requerida para los registros de fallas estándar de la subestación. |
| **DEV-05** | Starlink Business como respaldo o principal elegible. | Starlink Business configurado permanente como enlace de datos principal. | Ahorro en OPEX y simplicidad operativa para el cliente. |
| **DEV-06** | Tiempo de restablecimiento MTTR $\le 4$ horas. | MTTR garantizado de 6 horas. | Se ajusta a los tiempos reales de logística de despacho de repuestos importados. |
| **DEV-07** | Lista de repuestos para 2, 5 y 10 años. | Lista de repuestos para 5 y 10 años. | Los primeros 2 años están cubiertos por la garantía de fábrica de los componentes suministrados. |

---

## 6. PROPUESTA ECONÓMICA Y FINANCIERA

### 6.1. Precios EPC y Mantenimiento
*   **Precio EPC Llave en Mano (DDP Sitio de Instalación):** USD 78.500.000,00  
    *(Incluye obras civiles, montaje electromecánico, suministro, FAT y SAT).*
*   **Servicio de O&M por 5 años:** USD 4.200.000,00  

### 6.2. Alternativa de Financiamiento Propuesta
Suradem propone un esquema de **Vendor Financing (Financiamiento del Proveedor)** estructurado de la siguiente forma:
*   **Monto Financiable:** Hasta el $85\%$ del valor EPC total (USD 66.725.000,00).
*   **Tasa de Interés:** Tasa de referencia SOFR + 3.8% anual fija.
*   **Plazo de Amortización:** 7 años (84 cuotas mensuales consecutivas).
*   **Periodo de Gracia:** 12 meses (coincidente con la fase de construcción y puesta en servicio).
*   **Garantías requeridas:** Póliza de garantía de pago irrevocablemente avalada por banco estatal de primera línea del país comprador.
