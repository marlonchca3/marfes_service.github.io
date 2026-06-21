# Firebase Cloud Functions para Marfes Service Chatbot

Este directorio contiene las Cloud Functions de Firebase para el chatbot con IA de Marfes Service.

## Características

- **Chatbot con IA**: Utiliza Google Gemini API para respuestas inteligentes
- **Contexto de empresa**: El chatbot tiene información sobre servicios, productos y contacto
- **Fallback automático**: Si hay error en la Cloud Function, usa respuestas locales
- **Respuestas en español**: Todas las respuestas son naturales y en español

## Requisitos previos

1. **Node.js 20+** instalado en tu máquina
2. **Firebase CLI** instalado:
   ```bash
   npm install -g firebase-tools
   ```
3. **Cuenta de Google Cloud** con proyecto Firebase configurado
4. **API key de Google Gemini** (gratuito)

## Instalación

### 1. Obtener API key de Google Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Haz clic en "Create API key"
3. Copia tu API key
4. Crea un archivo `.env` en el directorio `functions/`:
   ```bash
   cp .env.example .env
   ```
5. Pega tu API key en el archivo `.env`:
   ```
   GEMINI_API_KEY=tu_clave_aqui
   ```

### 2. Instalar dependencias

```bash
cd functions
npm install
```

### 3. Inicializar Firebase (si es la primera vez)

```bash
firebase login
firebase init
```

Selecciona:
- `Firestore`
- `Functions`
- Tu proyecto Firebase (`marfes-263ee`)

### 4. Desplegar las Cloud Functions

```bash
firebase deploy --only functions
```

## Estructura

```
functions/
├── .env.example          # Variables de entorno (ejemplo)
├── .gitignore           # Archivos a ignorar en Git
├── package.json         # Dependencias del proyecto
└── index.js            # Funciones principales
```

## Funciones disponibles

### `chatbotResponse` (Callable Function)

Función que recibe un mensaje del usuario y retorna una respuesta con IA.

**Input:**
```javascript
{
  message: "¿Qué servicios ofrecen?"
}
```

**Output:**
```javascript
{
  success: true,
  message: "Respuesta generada por IA...",
  timestamp: "2024-06-14T10:30:00.000Z"
}
```

### `healthCheck` (HTTP Function)

Función para verificar que las Cloud Functions están en funcionamiento.

**Endpoint:** `https://[REGION]-marfes-263ee.cloudfunctions.net/healthCheck`

## Troubleshooting

### Error: "API key not found"
- Verifica que el archivo `.env` existe y tiene la API key correcta
- Reinicia el servidor de desarrollo: `firebase emulate:start --only functions`

### Error: "Function not found"
- Asegúrate de haber ejecutado `firebase deploy --only functions`
- Verifica que el proyecto en firebase.json coincide con tu proyecto Firebase

### El chatbot sigue usando respuestas locales
- Revisa los logs de Cloud Functions en Firebase Console
- Verifica que tu API key de Gemini es válida
- Asegúrate de que tu proyecto Firebase tiene habilitadas las Cloud Functions

## Variables de entorno

| Variable | Descripción | Valor |
|----------|-------------|-------|
| `GEMINI_API_KEY` | API key para Google Generative AI | Tu clave de [aistudio.google.com](https://aistudio.google.com) |

## Costo

- **Google Gemini API**: Gratuito para uso estándar (1 millón de tokens al mes)
- **Firebase Cloud Functions**: Gratuito para los primeros 2 millones de invocaciones/mes

## Documentación adicional

- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Google Generative AI SDK](https://ai.google.dev/tutorials/nodejs_quickstart)
- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)

## Notas importantes

⚠️ **Seguridad:**
- Nunca hagas commit de tu archivo `.env` con la API key real
- Usa Firebase Console para manejar variables de entorno en producción
- La API key debe estar protegida como se muestra en `.env.example`

✅ **Recomendaciones:**
- Monitorea el uso de tu API key en Google Cloud Console
- Implementa rate limiting si esperas alto tráfico
- Revisa logs de Cloud Functions regularmente
