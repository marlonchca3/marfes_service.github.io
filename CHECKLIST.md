# ✅ Checklist de implementación: Chatbot con IA

Sigue estos pasos para desplegar el chatbot con IA en tu sitio Marfes Service.

## Paso 0️⃣: Preparación (15 min)

- [ ] Tener terminal/command prompt abierto
- [ ] Navegador web listo
- [ ] Conexión a Internet activa
- [ ] Leer [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) (opcional pero recomendado)

---

## Paso 1️⃣: Instalar Firebase CLI (5 min)

**Windows:**
```bash
npm install -g firebase-tools
```

**macOS/Linux:**
```bash
# Opción A: npm
npm install -g firebase-tools

# Opción B: Homebrew (macOS)
brew install firebase-tools
```

**Verificar:**
```bash
firebase --version
```

- [ ] Firebase CLI instalado y verificado

---

## Paso 2️⃣: Obtener Google Gemini API Key (3 min) 🔑

1. Abre en navegador: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Haz clic en botón rojo **"Create API key"**
3. Selecciona proyecto (si te pregunta)
4. **Copia tu clave** (empieza con `AIza...`)
5. Pega en un documento temporal (necesitarás en paso siguiente)

```
Mi API key: [PEGA_AQUI_TU_API_KEY]
```

⚠️ **IMPORTANTE:** No compartas esta clave públicamente

- [ ] API key obtenida y guardada temporalmente

---

## Paso 3️⃣: Configurar archivo .env (2 min)

**Windows (Command Prompt):**
```bash
cd functions
copy .env.example .env
notepad .env
```

**macOS/Linux:**
```bash
cd functions
cp .env.example .env
nano .env
```

**En el editor:**
1. Busca la línea: `GEMINI_API_KEY=your_gemini_api_key_here`
2. Reemplaza `your_gemini_api_key_here` con tu API key
3. **NO AÑADAS comillas** - quedaría así:
   ```
   GEMINI_API_KEY=AIzaXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX
   ```
4. Guarda: `Ctrl+X` → `Y` → `Enter` (nano) o `Ctrl+S` (notepad)

**Verificar:**
```bash
cat .env
# Deberías ver tu API key
```

- [ ] Archivo .env creado y configurado

---

## Paso 4️⃣: Instalar dependencias (2 min)

```bash
# Estando en carpeta functions/
npm install
```

Deberías ver:
```
added 156 packages
```

- [ ] Dependencias instaladas exitosamente

---

## Paso 5️⃣: Autenticar con Firebase (3 min)

```bash
firebase login
```

Se abrirá navegador para autorizar. Completa el proceso.

Verificar:
```bash
firebase projects:list
# Deberías ver: marfes-263ee
```

- [ ] Autenticación exitosa con Firebase

---

## Paso 6️⃣: Desplegar Cloud Functions (5 min) 🚀

```bash
# Vuelve a raíz del proyecto si estás en functions/
cd ..

# Despliega
firebase deploy --only functions
```

**Esperado:**
```
✓ Deploy complete!

Function URL (chatbotResponse): 
  https://us-central1-marfes-263ee.cloudfunctions.net/chatbotResponse
```

- [ ] Deploy completado exitosamente

---

## Paso 7️⃣: Verificar funcionamiento (2 min) ✅

### Opción A: Desde tu sitio web

1. Abre tu sitio: [https://marfes-service.com](https://marfes-service.com)
2. Haz clic en **"💬 Chat"**
3. Escribe: `¿Qué servicios ofrecen?`
4. Deberías ver: `Escribiendo... 💭` (1-2 seg)
5. Luego: Respuesta con IA

### Opción B: Desde Firebase Console

1. Abre: [https://console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona `marfes-263ee`
3. Ve a **"Functions"** en menú izquierdo
4. Deberías ver dos funciones con estado ✓:
   - `chatbotResponse`
   - `healthCheck`

### Opción C: Desde terminal

```bash
firebase functions:log
# Deberías ver logs de invocaciones
```

- [ ] Funcionamiento verificado

---

## Paso 8️⃣: Monitoreo continuo (opcional)

Ver logs en tiempo real:
```bash
firebase functions:log
```

O en Firebase Console:
1. Functions → chatbotResponse → Logs tab

- [ ] Monitoreo configurado (opcional)

---

## 🎉 ¡Completado!

Tu chatbot con IA está funcionando. Ahora:

✅ Los usuarios pueden hacer preguntas al chatbot
✅ Reciben respuestas inteligentes con contexto de Marfes Service
✅ El sistema vuelve a respuestas locales si hay error
✅ Todo funciona de forma segura

---

## ⚠️ Si algo falla

1. **Error: "firebase: command not found"**
   - Reinstala Firebase CLI: `npm install -g firebase-tools`

2. **Error: "Permission denied"**
   - Haz logout/login: 
   ```bash
   firebase logout
   firebase login
   firebase deploy --only functions
   ```

3. **Error: "API key error"**
   - Verifica que `functions/.env` tiene la clave correcta
   - Crea nueva clave en [aistudio.google.com](https://aistudio.google.com)

4. **El chatbot usa respuestas locales**
   - Revisa logs: `firebase functions:log`
   - Verifica API key es válida

5. **Más ayuda**
   - Lee: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - Lee: [functions/README.md](./functions/README.md)

---

## 📞 Contacto

Si necesitas ayuda con:
- **Google Gemini API**: [https://ai.google.dev](https://ai.google.dev)
- **Firebase Functions**: [https://firebase.google.com/docs/functions](https://firebase.google.com/docs/functions)
- **Marfes Service**: +51 960 129 839

---

**Tiempo total estimado: 40 minutos** ⏱️

¡Buena suerte! 🚀
