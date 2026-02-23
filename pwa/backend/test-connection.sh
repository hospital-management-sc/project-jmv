#!/bin/bash
# Script para probar conexión a Supabase

echo "🔍 Probando conexión a Supabase..."
echo ""

# La URL que estás usando (pooling)
POOLING_URL="postgresql://postgres.diradvnscqucofzknzyl:dAQuwR%2F4DtjE6ia@aws-1-us-east-2.pooler.supabase.com:6543/postgres"

echo "❌ URL actual (pooling - puerto 6543):"
echo "$POOLING_URL"
echo ""

# La URL que deberías usar (direct)
DIRECT_URL="postgresql://postgres.diradvnscqucofzknzyl:dAQuwR%2F4DtjE6ia@aws-1-us-east-2.postgresql.net:5432/postgres"

echo "✅ URL recomendada (direct - puerto 5432):"
echo "$DIRECT_URL"
echo ""

echo "⚠️  IMPORTANTE:"
echo "- Pooling (6543): Para backend en Render (producción)"
echo "- Direct (5432): Para Prisma local (desarrollo)"
