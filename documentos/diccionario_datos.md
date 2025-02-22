# Diccionario de Datos - TRRO

## 1. Tablas Principales

### 1.1 Usuarios (usuarios)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único del usuario |
| nombre | VARCHAR(50) | Nombre del usuario |
| apellido | VARCHAR(50) | Apellido del usuario |
| email | VARCHAR(100) | Email único del usuario |
| usuario | VARCHAR(50) | Nombre de usuario único |
| password | VARCHAR(255) | Contraseña encriptada |
| fecha_nacimiento | DATE | Fecha de nacimiento |
| rol_id | INT | ID del rol asignado |

### 1.2 Reportes (reports)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único del reporte |
| tipo_id | INT | Tipo de reporte |
| latitud | DECIMAL(10,8) | Coordenada latitud |
| longitud | DECIMAL(11,8) | Coordenada longitud |
| descripcion | TEXT | Descripción del reporte |
| estado | ENUM | Estado del reporte (activo/inactivo/verificado) |
| creador_id | INT | ID del usuario creador |
| fecha_creacion | TIMESTAMP | Fecha y hora de creación |
| fecha_expiracion | TIMESTAMP | Fecha y hora de expiración |

### 1.3 Rutas Favoritas (favorite_routes)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único de la ruta |
| usuario_id | INT | ID del usuario |
| origen | VARCHAR(255) | Dirección de origen |
| destino | VARCHAR(255) | Dirección de destino |
| origen_lat | DECIMAL(10,8) | Latitud origen |
| origen_lng | DECIMAL(11,8) | Longitud origen |
| destino_lat | DECIMAL(10,8) | Latitud destino |
| destino_lng | DECIMAL(11,8) | Longitud destino |

## 2. Tablas de Referencia

### 2.1 Roles (roles)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único del rol |
| nombre | VARCHAR(50) | Nombre del rol |
| descripcion | TEXT | Descripción del rol |

### 2.2 Tipos de Reporte (report_types)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único del tipo |
| nombre | VARCHAR(100) | Nombre del tipo |
| descripcion | TEXT | Descripción del tipo |
| icono | VARCHAR(50) | Icono asociado |

## 3. Estados y Enumeraciones

### 3.1 Estados de Reporte
- activo: Reporte vigente
- inactivo: Reporte expirado
- verificado: Reporte confirmado por moderador

### 3.2 Roles de Usuario
- programador (1): Acceso total
- administrador (2): Gestión del sistema
- moderador (3): Moderación de contenido
- usuario_mayor (4): Usuario +16 años
- usuario_menor (5): Usuario -16 años

## 2. Componentes React Principales

### 2.1 Map.js
| Componente/Función | Descripción |
|-------------------|-------------|
| Map | Componente principal del mapa |
| mapRef | Referencia al elemento DOM del mapa |
| mapInstance | Instancia actual del mapa de Google |
| markersRef | Referencias a los marcadores en el mapa |
| initMap() | Inicializa el mapa de Google |
| updateMarkers() | Actualiza los marcadores de reportes |
| drawRoute() | Dibuja la ruta seleccionada en el mapa |

### 2.2 ReportCreator.js
| Componente/Función | Descripción |
|-------------------|-------------|
| ReportCreator | Componente para crear reportes |
| handleSubmit() | Maneja el envío de nuevos reportes |
| getCurrentLocation() | Obtiene ubicación actual |
| validateReport() | Valida datos del reporte |

### 2.3 FavoriteRoutes.js
| Componente/Función | Descripción |
|-------------------|-------------|
| FavoriteRoutes | Gestión de rutas favoritas |
| fetchFavoriteRoutes() | Obtiene rutas guardadas |
| handleDeleteRoute() | Elimina ruta favorita |
| handleRouteClick() | Selecciona ruta para mostrar |

## 3. Contextos y Hooks

### 3.1 AuthContext
| Función | Descripción |
|---------|-------------|
| useAuth() | Hook para acceder al contexto de autenticación |
| login() | Maneja el inicio de sesión |
| logout() | Maneja el cierre de sesión |
| checkAuth() | Verifica estado de autenticación |

### 3.2 ReportContext
| Función | Descripción |
|---------|-------------|
| useReports() | Hook para acceder a reportes |
| addReport() | Agrega nuevo reporte |
| updateReport() | Actualiza reporte existente |
| removeReport() | Elimina reporte |

## 4. Utilidades y Helpers

### 4.1 GoogleMapsLoader
| Función | Descripción |
|---------|-------------|
| loadGoogleMaps() | Carga API de Google Maps |
| initAutocomplete() | Inicializa autocompletado |
| geocodeAddress() | Convierte dirección a coordenadas |

### 4.2 Validaciones
| Función | Descripción |
|---------|-------------|
| calculateAge() | Calcula edad del usuario |
| validatePassword() | Valida requisitos de contraseña |
| validateEmail() | Valida formato de email |

## 5. Constantes y Configuraciones

### 5.1 Mapas
| Constante | Descripción |
|-----------|-------------|
| defaultLocation | Coordenadas por defecto (Rosario) |
| mapStyles | Estilos personalizados del mapa |
| zoomLevel | Nivel de zoom predeterminado |

### 5.2 Reportes
| Constante | Descripción |
|-----------|-------------|
| reportTypes | Tipos de reportes disponibles |
| reportDuration | Duración predeterminada de reportes |
| refreshInterval | Intervalo de actualización |

## 6. Middleware y Seguridad

### 6.1 Autenticación
| Función | Descripción |
|---------|-------------|
| auth | Middleware de autenticación |
| verifyToken | Verifica JWT |
| checkRole | Verifica rol de usuario |

### 6.2 Validaciones Backend
| Función | Descripción |
|---------|-------------|
| validateUserData | Valida datos de usuario |
| sanitizeInput | Limpia datos de entrada |
| validateReport | Valida datos de reporte |

## 7. Endpoints API

### 7.1 Autenticación
| Endpoint | Método | Descripción |
|----------|---------|-------------|
| /api/auth/login | POST | Inicio de sesión |
| /api/auth/register | POST | Registro de usuario |
| /api/auth/verify | GET | Verifica token |

### 7.2 Reportes
| Endpoint | Método | Descripción |
|----------|---------|-------------|
| /api/reports/active | GET | Obtiene reportes activos |
| /api/reports | POST | Crea nuevo reporte |
| /api/reports/:id | PUT | Actualiza reporte | 