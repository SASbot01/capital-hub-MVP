# 🚀 CapitalHub MVP - Marketplace de Talento Comercial

<div align="center">

![CapitalHub](https://img.shields.io/badge/CapitalHub-MVP%20v1.0-black?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)
![Status](https://img.shields.io/badge/Status-Funcional-success?style=flat-square)

**Plataforma SaaS B2B que conecta talento comercial de alto nivel con empresas**

[🚀 Inicio Rápido](#-inicio-rápido) • [📋 Características](#-características) • [🔐 Credenciales](#-credenciales-de-prueba) • [📡 API](#-api-endpoints)

</div>

---

## 🎯 ¿Qué es CapitalHub?

**CapitalHub** es un marketplace que conecta:

| Actor | Descripción |
|-------|-------------|
| 🧑‍💼 **Comercial (Rep)** | Setters, Closers y SDRs que buscan oportunidades de trabajo |
| 🏢 **Empresa (Company)** | Empresas que publican ofertas y contratan talento comercial |

### Flujo Principal

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│    Empresa      │         │    Publica      │         │    Comercial    │
│   se registra   │────────▶│    ofertas      │◀────────│    aplica       │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                            ┌────────▼────────┐
                            │   Entrevista    │
                            │   y contrato    │
                            └─────────────────┘
```

---

## 🚀 Inicio Rápido

### Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo

### Levantar el proyecto

```bash
# 1. Clonar el repositorio
git clone https://github.com/SASbot01/Capitalhub-mvp.git
cd Capitalhub-mvp

# 2. Levantar con Docker
cd deploy
docker-compose up -d --build

# 3. Esperar ~2-3 minutos la primera vez

# 4. Acceder a http://localhost
```

### URLs de acceso

| Servicio | URL |
|----------|-----|
| 🌐 **Frontend** | http://localhost |
| 📦 **MinIO Console** | http://localhost:9001 |
| 🗄️ **MySQL** | localhost:3306 |

---

## 🔐 Credenciales de Prueba

### Aplicación (http://localhost)

| Rol | Email | Contraseña |
|-----|-------|------------|
| 👤 Comercial | `rep@demo.com` | `test123` |
| 🏢 Empresa | `demo@company.com` | `test123` |
| 🧪 Test | `test@test.com` | `test123` |

### MinIO (http://localhost:9001)
- **Usuario:** `minioadmin`
- **Contraseña:** `minioadmin`

### MySQL
- **Host:** `localhost:3306`
- **Database:** `capitalhub`
- **Usuario:** `root`
- **Contraseña:** `admin`

---

## ✨ Características

### ✅ Para Comerciales (Rep)
- Registro y login con JWT
- Dashboard con métricas personales
- Explorar ofertas de trabajo activas
- Aplicar a ofertas con un clic
- Seguimiento de aplicaciones
- Perfil profesional editable
- Configuración de cuenta

### ✅ Para Empresas (Company)
- Registro y login con JWT
- Dashboard con KPIs de contratación
- Crear y gestionar ofertas de trabajo
- Ver y filtrar candidatos
- Gestionar aplicaciones (Entrevista, Contratar, Descartar)
- Perfil de empresa editable

### ✅ Funcionalidades Generales
- Autenticación JWT segura
- Recuperación de contraseña
- Rutas protegidas por roles
- API RESTful completa
- Despliegue con Docker

---

## 🛠 Stack Tecnológico

### Backend
| Tecnología | Versión |
|------------|---------|
| Java | 21 |
| Spring Boot | 3.2.2 |
| Spring Security | 6 (JWT) |
| JPA/Hibernate | - |
| Flyway | Migraciones |
| MySQL | 8.0 |
| MinIO | Almacenamiento |

### Frontend
| Tecnología | Versión |
|------------|---------|
| React | 18 |
| TypeScript | 5 |
| Vite | 5 |
| Tailwind CSS | 3 |
| React Router | 6 |

### Infraestructura
| Tecnología | Uso |
|------------|-----|
| Docker | Contenedores |
| Docker Compose | Orquestación |
| Nginx | Servidor web |

---

## 📁 Estructura del Proyecto

```
capitalhub/
├── backend/                      # API Spring Boot
│   ├── src/main/java/com/capitalhub/
│   │   ├── applications/         # Gestión de aplicaciones
│   │   ├── auth/                 # Autenticación JWT
│   │   ├── company/              # Módulo empresas
│   │   ├── config/               # Configuraciones
│   │   ├── dashboard/            # Estadísticas
│   │   ├── jobs/                 # Ofertas de trabajo
│   │   ├── media/                # Subida de archivos
│   │   └── rep/                  # Módulo comerciales
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/         # Scripts SQL Flyway
│
├── frontend/                     # App React
│   ├── src/
│   │   ├── api/                  # Cliente HTTP
│   │   ├── components/           # Componentes UI
│   │   ├── context/              # AuthContext
│   │   ├── hooks/                # useFetch
│   │   ├── layouts/              # Layouts
│   │   ├── pages/                # Páginas
│   │   └── routes.tsx
│   └── package.json
│
├── deploy/                       # Docker
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
│
└── README.md
```

---

## 📡 API Endpoints

### Autenticación (`/api/auth`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/signup/rep` | Registro comercial |
| POST | `/auth/signup/company` | Registro empresa |
| POST | `/auth/forgot-password` | Solicitar reset |
| POST | `/auth/reset-password` | Cambiar contraseña |

### Comerciales (`/api/rep`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/rep/me` | Mi perfil |
| PUT | `/rep/me` | Actualizar perfil |
| GET | `/rep/dashboard/stats` | Estadísticas |
| GET | `/rep/jobs` | Ofertas disponibles |
| POST | `/rep/jobs/{id}/apply` | Aplicar a oferta |
| GET | `/rep/applications` | Mis aplicaciones |

### Empresas (`/api/company`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/company/me` | Mi perfil |
| PUT | `/company/me` | Actualizar perfil |
| GET | `/company/dashboard/stats` | KPIs |
| GET | `/company/jobs` | Mis ofertas |
| POST | `/company/jobs` | Crear oferta |
| PATCH | `/company/jobs/{id}/status` | Cambiar estado |
| GET | `/company/applications` | Aplicaciones |
| PATCH | `/company/applications/{id}/status` | Gestionar candidato |

---

## 💻 Desarrollo Local (sin Docker)

### Backend
```bash
cd backend
# Requisitos: Java 21, Maven, MySQL en localhost:3306
mvn spring-boot:run
# Disponible en http://localhost:8081
```

### Frontend
```bash
cd frontend
echo "VITE_API_BASE_URL=http://localhost:8081" > .env
npm install
npm run dev
# Disponible en http://localhost:5173
```

---

## 🐳 Comandos Docker

```bash
cd deploy

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar servicio
docker-compose restart backend

# Reconstruir
docker-compose build --no-cache backend
docker-compose up -d backend

# Parar todo
docker-compose down

# Limpiar todo (¡borra datos!)
docker-compose down -v --rmi all
```

---

## 📄 Licencia

Proyecto privado - Todos los derechos reservados © 2025

---

<div align="center">

**Desarrollado con ❤️ para CapitalHub**

🚀 MVP Completado y Funcional

</div>
