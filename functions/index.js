import functions from "firebase-functions";
import admin from "firebase-admin";
import axios from "axios";

// Initialize Firebase Admin
admin.initializeApp();

// Constants
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Company context for the chatbot
const COMPANY_CONTEXT = `Eres un asistente amable y profesional para Marfes Service, una empresa especializada en mantenimiento, reparación y venta de equipos médicos.

Información de la empresa:
- Servicios: Mantenimiento preventivo, reparación especializada y venta de equipos médicos para clínicas, consultorios y centros de salud
- Contacto: WhatsApp +51 960 129 839, teléfono +51 960 129 839, email contacto@marfesservice.com
- Horario: Respuesta técnica disponible, puedes coordinar según necesidad
- Especialidad: Equipos biomédicos, diagnóstico ágil, ingeniería orientada al entorno clínico
- Productos disponibles: Máquina de Anestesia, Lámpara Quirúrgica LED, y otros equipos médicos

Responde de forma concisa, natural y amable en español. Si el usuario pregunta algo no relacionado con la empresa, sugiere que se comunique directamente con el equipo de Marfes Service. Siempre proporciona información verificada sobre los servicios y no hagas promesas que la empresa no pueda cumplir.`;

/**
 * Cloud Function: chatbotResponse
 * Callable function that receives a user message and returns an AI-powered response
 */
export const chatbotResponse = functions.https.onCall(async (data, context) => {
  try {
    const userMessage = data.message;

    if (!userMessage || typeof userMessage !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "El mensaje del usuario es requerido"
      );
    }

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY no está configurado");
      throw new functions.https.HttpsError(
        "internal",
        "Error de configuración del servidor"
      );
    }

    // Call Google Gemini API
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${COMPANY_CONTEXT}\n\nPregunta del usuario: ${userMessage}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      },
      {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract AI response
    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No pude procesar tu consulta. Por favor, intenta de nuevo.";

    return {
      success: true,
      message: aiResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error en chatbotResponse:", error.message);

    // Return user-friendly error message
    if (error.response?.status === 429) {
      return {
        success: false,
        message: "Por favor, espera un momento antes de enviar otro mensaje.",
        error: "RATE_LIMIT",
      };
    }

    if (error.message.includes("API key")) {
      return {
        success: false,
        message:
          "Lo sentimos, el servicio de IA no está disponible en este momento. Por favor, contáctanos directamente por WhatsApp al +51 960 129 839.",
        error: "API_KEY_ERROR",
      };
    }

    return {
      success: false,
      message:
        "Lo sentimos, ocurrió un error. Por favor, intenta nuevamente o escríbenos por WhatsApp.",
      error: "UNKNOWN_ERROR",
    };
  }
});

/**
 * Cloud Function: healthCheck
 * Simple endpoint to verify the function is running
 */
export const healthCheck = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204);
    return;
  }

  res.json({
    status: "ok",
    message: "Marfes Service Cloud Functions is running",
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!GEMINI_API_KEY,
  });
});
