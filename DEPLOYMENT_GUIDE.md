# 🚀 Guía de Despliegue: Chatbot con IA para Marfes Service

Esta guía te ayudará a desplegar las Cloud Functions de Firebase con IA (Google Gemini) para tu chatbot.

## ⚡ Resumen rápido

Tu chatbot ahora tiene **IA integrada** que:
- ✨ Responde preguntas inteligentes sobre servicios y productos
- 🎯 Comprende contexto sobre Marfes Service
- 🇪🇸 Responde siempre en español natural
- 🔄 Vuelve a respuestas locales si hay error

## 📋 Pasos de instalación

### Paso 1: Instalar Firebase CLI

```bash
# En tu terminal (macOS/Linux)
npm install -g firebase-tools

# O si usas Homebrew (macOS)
brew install firebase-tools
```

### Paso 2: Obtener Google Gemini API Key (GRATUITO)

1. Abre [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Haz clic en el botón rojo "Create API key"
3. Copia tu clave (empieza con "AIza...")
4. **NO compartas esta clave públicamente**

### Paso 3: Configurar archivo .env

En la carpeta `functions/`, crea un archivo llamado `.env`:

```bash
cd functions
nano .env
```

Pega esto (reemplaza con tu clave real):
```
GEMINI_API_KEY=AIzaXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX
```

Guarda presionando `Ctrl+X` → `Y` → `Enter`

### Paso 4: Instalar dependencias

```bash
# Estando en la carpeta functions/
npm install
```

Esto instalará:
- `firebase-admin` (4.5 MB)
- `firebase-functions` (6.2 MB)
- `google-generative-ai` (200 KB)

### Paso 5: Login en Firebase

```bash
firebase login
```

Te abrirá navegador para autorizar. Completa el login.

### Paso 6: Desplegar las Functions

```bash
firebase deploy --only functions
```

**Esperado:**
```
✓ Deploy complete!

Function URL (chatbotResponse): 
  https://us-central1-marfes-263ee.cloudfunctions.net/chatbotResponse

Function URL (healthCheck):
  https://us-central1-marfes-263ee.cloudfunctions.net/healthCheck
```

## ✅ Verificar que funciona

### Opción 1: Desde Firebase Console

1. Abre [Firebase Console](https://console.firebase.google.com)
2. Selecciona `marfes-263ee`
3. Ve a "Functions" en el menú izquierdo
4. Deberías ver `chatbotResponse` y `healthCheck` listadas
5. Ambas con estado "✓ OK"

### Opción 2: Desde tu sitio

1. Abre tu sitio en navegador
2. Haz clic en el botón "💬 Chat"
3. Escribe un mensaje (ej: "¿Qué servicios ofrecen?")
4. Deberías ver "Escribiendo... 💭" por 1-2 segundos
5. Luego la respuesta de IA

### Opción 3: Test rápido

```bash
curl https://us-central1-marfes-263ee.cloudfunctions.net/healthCheck
```

Deberías recibir:
```json
{"status":"ok","message":"Marfes Service Cloud Functions is running"}
```

## 🛠️ Troubleshooting

### Problema: "Permission denied" durante deploy
**Solución:**
```bash
firebase logout
firebase login
firebase deploy --only functions
```

### Problema: "API key error"
**Causa:** El archivo `.env` no está siendo leído

**Solución:**
```bash
# Verifica que el archivo existe
ls -la functions/.env

# Redeploy
firebase deploy --only functions
```

### Problema: El chatbot sigue usando respuestas locales
**Causa:** Probablemente la API key es inválida

**Solución:**
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nueva API key
3. Reemplaza en `functions/.env`
4. Ejecuta `firebase deploy --only functions` de nuevo

### Problema: Mensajes de error extraños
**Solución:**
```bash
# Mira los logs en tiempo real
firebase functions:log

# O en Firebase Console:
# Functions > chatbotResponse > Logs
```

## 📊 Monitoreo

### Ver logs en tiempo real:
```bash
firebase functions:log
```

### Ver uso de tu API key:
1. Abre [Google Cloud Console](https://console.cloud.google.com)
2. Selecciona tu proyecto
3. Ve a "APIs & Services" > "Credentials"
4. Busca tu API key
5. Haz clic para ver estadísticas

## 💰 Costo esperado

| Servicio | Plan | Costo |
|----------|------|-------|
| Google Gemini API | Free | $0 (primeros 1M tokens/mes) |
| Firebase Functions | Free | $0 (primeros 2M invocaciones/mes) |
| **Total** | | **GRATIS** 🎉 |

## 🔐 Seguridad

⚠️ **IMPORTANTE:**

```bash
# ✅ CORRECTO - El archivo .env está en .gitignore
cat .gitignore | grep ".env"

# ❌ NUNCA hagas esto:
git add functions/.env
git commit -m "Add API key" 
git push
```

Tu API key es **privada**. Nunca la compartas o subas a GitHub.

## 📚 Estructura de archivos

```
marfes_service.github.io/
├── functions/
│   ├── .env                 ← Tu API key (privado)
│   ├── .env.example         ← Plantilla (sin clave real)
│   ├── .gitignore          ← Evita subir .env
│   ├── package.json        ← Dependencias
│   ├── index.js            ← Cloud Functions
│   └── README.md           ← Documentación
├── script.js               ← Frontend (actualizado ✅)
├── index.html
├── styles.css
├── firebase.json           ← Config (actualizado ✅)
└── ...
```

## 🎯 Próximos pasos

1. ✅ Deploy realizado
2. ✅ Chatbot funcionando con IA
3. 📊 Monitorea los logs regularmente
4. 💡 Puedes personalizar el contexto en `functions/index.js` (línea ~13)

## 📞 Soporte

Si algo no funciona:

1. Revisa los logs: `firebase functions:log`
2. Verifica tu API key en [aistudio.google.com](https://aistudio.google.com)
3. Consulta la documentación: `functions/README.md`

---

**¡Tu chatbot con IA está listo! 🎉**

Ahora tus clientes pueden hacer preguntas y recibir respuestas inteligentes sobre Marfes Service.
