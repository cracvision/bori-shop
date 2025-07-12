¡Excelente idea! Formalizar el conocimiento que hemos adquirido es un paso profesional y muy útil para el futuro del proyecto.

Aquí tienes un documento de especificación de sistema completo para la aplicación "Borí Shop", basado en toda nuestra interacción y el estado actual del proyecto.

---

### **Documento de Especificación de Requisitos del Sistema (ERS)**
### **Aplicación: Borí Shop**

---

**Control del Documento**
*   **Versión:** 1.0
*   **Fecha:** 12 de julio de 2025
*   **Estado:** Definido y Operacional
*   **Autor(es):** cracvision & Asistente AI
*   **Aprobado por:** cracvision

---

### **Historial de Revisiones**
| Versión | Fecha        | Autor(es)                 | Descripción de Cambios                                                                                             |
| :------ | :----------- | :------------------------ | :----------------------------------------------------------------------------------------------------------------- |
| 1.0     | 12/07/2025   | cracvision & Asistente AI | Creación inicial del documento después del despliegue exitoso en GitHub Pages y la integración en el sitio Wix. |

---

### **1. Introducción**

#### **1.1. Propósito**
Este documento define los requisitos funcionales, no funcionales, de interfaz y de arquitectura para la aplicación web "Borí Shop". El propósito de esta aplicación es mostrar y monetizar tours y actividades en Puerto Rico a través del programa de afiliados de Viator, integrándose de manera fluida en el sitio web existente `vistapelicano.com`.

#### **1.2. Alcance del Producto**
El sistema "Borí Shop" es una aplicación de página única (SPA) desarrollada en React que:
*   Consume la API de Viator para obtener una lista de tours en Puerto Rico.
*   Permite a los usuarios filtrar los tours por categorías predefinidas.
*   Muestra los tours en tarjetas de información detalladas.
*   Redirige a los usuarios a la página de Viator para realizar la reserva a través de un enlace de afiliado.
*   Está diseñada para ser alojada en una plataforma gratuita (GitHub Pages) y embebida en un sitio web de terceros (Wix) mediante un iFrame.

#### **1.3. Glosario**
*   **API:** Interfaz de Programación de Aplicaciones.
*   **CORS:** Intercambio de Recursos de Origen Cruzado. Mecanismo de seguridad del navegador.
*   **iFrame:** Elemento HTML que permite incrustar un documento HTML dentro de otro.
*   **PID:** ID de Socio (Partner ID) en el programa de afiliados de Viator.
*   **MCID:** ID de Campaña de Marketing (Marketing Campaign ID) en Viator.
*   **SPA:** Aplicación de Página Única (Single-Page Application).
*   **Velo:** Plataforma de desarrollo de Wix para añadir funcionalidades personalizadas.
*   **Wix:** Plataforma de creación de sitios web.

---

### **2. Descripción General del Sistema**

#### **2.1. Perspectiva del Producto**
"Borí Shop" es un componente autocontenido que se integra como un módulo dentro del sitio web `vistapelicano.com`. Aunque es técnicamente independiente, su propósito es funcionar como una extensión nativa de la marca Vista Pelícano, ofreciendo un valor añadido a los visitantes del sitio.

#### **2.2. Funciones Principales del Sistema**
*   **Visualización de Tours:** Muestra una galería de tours y actividades.
*   **Filtrado por Categorías:** Permite a los usuarios refinar la búsqueda de tours.
*   **Generación de Enlaces de Afiliado:** Construye dinámicamente los URLs de reserva con los parámetros de afiliado correctos para asegurar la atribución de comisiones.
*   **Manejo de Carga y Errores:** Proporciona retroalimentación visual al usuario durante la carga de datos y en caso de fallos de la API.

#### **2.3. Características de los Usuarios**
El usuario final es un visitante del sitio `vistapelicano.com`, típicamente un turista o local interesado en actividades de ocio en Puerto Rico. Se espera que el usuario tenga conocimientos básicos de navegación web.

#### **2.4. Restricciones, Asunciones y Dependencias**
*   **Restricciones:**
    *   El alojamiento debe ser gratuito (se eligió GitHub Pages).
    *   La integración en Wix debe realizarse sin modificar el core de Wix, utilizando métodos estándar como iFrame.
    *   La aplicación no maneja datos de usuario ni procesos de pago; delega toda la transacción a Viator.
*   **Asunciones:**
    *   La API de Viator permanecerá disponible y su estructura de datos será estable.
    *   Los identificadores de afiliado (PID y MCID) son correctos y permanecerán activos.
*   **Dependencias:**
    *   **Viator Partner API:** Fuente principal de datos.
    *   **GitHub Pages:** Plataforma de hosting.
    *   **Wix:** Plataforma anfitriona del iFrame.
    *   **Proxy CORS (cors-anywhere):** Dependencia externa para habilitar las llamadas a la API desde el navegador. Se reconoce como una solución temporal/de desarrollo.

---

### **3. Requisitos Específicos**

#### **3.1. Requisitos Funcionales**

*   **RF-01: Visualización de Tours**
    *   El sistema deberá obtener y mostrar una lista de tours de Puerto Rico (ID de destino: 36) desde la API de Viator.
*   **RF-02: Filtrado de Tours**
    *   El sistema deberá presentar una lista de categorías (ej. Kayak, ATV, Bio Bay) como checkboxes.
    *   Al seleccionar una o más categorías, la lista de tours deberá actualizarse en tiempo real para mostrar solo aquellos que coincidan con al menos una de las categorías seleccionadas.
*   **RF-03: Tarjeta de Atracción**
    *   Cada tour deberá mostrarse en una tarjeta que contenga:
        *   Imagen principal del tour.
        *   Nombre del tour.
        *   Descripción breve.
        *   Ubicación principal (ciudad).
        *   Un botón de acción "Reservar Ahora".
*   **RF-04: Enlace de Afiliado**
    *   El botón "Reservar Ahora" deberá redirigir al usuario a la página del producto en `viator.com`.
    *   La URL de redirección deberá contener los parámetros de afiliado: `pid=P00255360` y `mcid=42383`.
*   **RF-05: Indicador de Carga**
    *   Mientras se obtienen los datos de la API, el sistema deberá mostrar un spinner de carga animado.
*   **RF-06: Manejo de Errores de API**
    *   En caso de que la llamada a la API de Viator falle, el sistema deberá:
        1.  Mostrar un mensaje de error informativo al usuario.
        2.  Cargar y mostrar un conjunto de datos de muestra (mock data) para que la aplicación siga siendo funcional.

#### **3.2. Requisitos de Interfaz**

*   **UI-01: Interfaz de Usuario (Layout)**
    *   La interfaz deberá seguir el diseño previsualizado: un fondo con gradiente morado, un área de filtros a la izquierda y una cuadrícula (grid) de tarjetas de tours a la derecha.
*   **UI-02: API Externa (Viator)**
    *   El sistema interactuará con el endpoint `POST /partner/products/search` de la API de Viator.
    *   Las peticiones deberán incluir el header `exp-api-key` para la autenticación.

#### **3.3. Requisitos No Funcionales**

*   **RNF-01: Rendimiento**
    *   La carga inicial de la aplicación deberá ser rápida. El uso de un CDN para Tailwind CSS y la carga asíncrona de datos contribuyen a este objetivo.
*   **RNF-02: Usabilidad**
    *   La aplicación debe ser intuitiva y fácil de usar en dispositivos de escritorio y móviles (diseño responsive).
*   **RNF-03: Mantenibilidad**
    *   El código está estructurado en componentes React reutilizables (`AttractionCard`, `CategoryFilter`, etc.) para facilitar futuras modificaciones.
*   **RNF-04: Portabilidad e Integración**
    *   La aplicación es independiente de la plataforma y puede ser embebida en cualquier sitio web que soporte iFrames.

---

### **4. Arquitectura y Diseño del Sistema**

El sistema sigue una arquitectura desacoplada:

1.  **Frontend (Borí Shop App):** Una SPA construida con React y TypeScript. Es responsable de toda la lógica de presentación, interacción del usuario y comunicación con la API. No tiene un backend propio.
2.  **Hosting (GitHub Pages):** Sirve los archivos estáticos (HTML, CSS, JS, imágenes) de la aplicación React. La rama `gh-pages` del repositorio contiene una copia exacta de los archivos fuente de la rama `main`.
3.  **Sitio Contenedor (Wix):** El sitio `vistapelicano.com` contiene una página (`/bori-shop`) con un elemento iFrame que apunta a la URL de GitHub Pages (`https://cracvision.github.io/bori-shop/`).

**Flujo de Datos:**
1.  El usuario visita `vistapelicano.com/bori-shop`.
2.  El iFrame carga la aplicación React desde GitHub Pages.
3.  La app React (ejecutándose en el navegador del usuario) realiza una petición a la API de Viator a través del proxy CORS.
4.  La API devuelve los datos del tour.
5.  React renderiza los datos en la interfaz de usuario.

---

### **5. Pila Tecnológica (Tech Stack)**

*   **Lenguaje Principal:** TypeScript
*   **Framework Frontend:** React
*   **Estilos:** Tailwind CSS (cargado vía CDN)
*   **Gestor de Paquetes:** npm
*   **Control de Versiones:** Git
*   **Repositorio y Hosting:** GitHub / GitHub Pages
*   **Plataforma de Integración:** Wix

---

### **6. Proceso de Despliegue**

El despliegue se realiza de forma manual para asegurar la integridad de la rama de producción (`gh-pages`). El proceso es el siguiente:

1.  Realizar y confirmar todos los cambios de código en la rama `main`.
2.  Cambiar localmente a la rama `gh-pages` (`git checkout gh-pages`).
3.  Reemplazar todo el contenido de la rama `gh-pages` con el contenido actual de la rama `main` (`git checkout main -- .`).
4.  Confirmar los nuevos archivos (`git add .` y `git commit`).
5.  Subir la rama `gh-pages` actualizada a GitHub (`git push origin gh-pages`).

**Nota:** El método de `npm run build` y `gh-pages -d dist` fue descartado debido a que la aplicación fue diseñada para ejecutarse directamente desde sus archivos fuente sin un paso de compilación, utilizando `importmaps`.