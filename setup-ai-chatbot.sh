#!/bin/bash

# ============================================================================
# Script de despliegue automático para Firebase Cloud Functions
# Uso: bash setup-ai-chatbot.sh
# ============================================================================

set -e

echo "🚀 Iniciando configuración del chatbot con IA..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si Node.js está instalado
echo "${BLUE}[1/5]${NC} Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "${RED}✗ Node.js no está instalado${NC}"
    echo "Descárgalo desde: https://nodejs.org/"
    exit 1
fi
echo "${GREEN}✓ Node.js v$(node -v)${NC}"
echo ""

# Verificar si Firebase CLI está instalado
echo "${BLUE}[2/5]${NC} Verificando Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    echo "${YELLOW}⚠ Firebase CLI no está instalado${NC}"
    echo "Instalando: npm install -g firebase-tools"
    npm install -g firebase-tools
fi
echo "${GREEN}✓ Firebase CLI v$(firebase --version)${NC}"
echo ""

# Instalar dependencias de functions
echo "${BLUE}[3/5]${NC} Instalando dependencias de Cloud Functions..."
cd functions
npm install
echo "${GREEN}✓ Dependencias instaladas${NC}"
cd ..
echo ""

# Verificar si .env existe
echo "${BLUE}[4/5]${NC} Verificando configuración de API key..."
if [ ! -f "functions/.env" ]; then
    echo "${YELLOW}⚠ Archivo .env no encontrado${NC}"
    echo "Copia el template: cp functions/.env.example functions/.env"
    echo "Luego edita con tu API key de Google Gemini"
    exit 1
fi
echo "${GREEN}✓ Archivo .env configurado${NC}"
echo ""

# Deploy a Firebase
echo "${BLUE}[5/5]${NC} Desplegando Cloud Functions a Firebase..."
firebase login --no-localhost 2>/dev/null || true
firebase deploy --only functions
echo ""

echo "${GREEN}✓ ¡Despliegue completado con éxito!${NC}"
echo ""
echo "📊 Próximos pasos:"
echo "  1. Recarga tu sitio web (Ctrl+F5)"
echo "  2. Prueba el chatbot escribiendo un mensaje"
echo "  3. Visualiza logs: firebase functions:log"
echo ""
echo "📚 Documentación:"
echo "  - Despliegue: ./DEPLOYMENT_GUIDE.md"
echo "  - Cambios: ./CHATBOT_AI_CHANGES.md"
echo "  - Técnico: ./functions/README.md"
echo ""
