#!/bin/bash

SOURCE="../eduvate-fe/prisma/schema.prisma"
DESTINATION="../eduvate-be/prisma/schema.prisma"
TARGET_DIR="../eduvate-be"

# Cek apakah file sumber ada
if [ -f "$SOURCE" ]; then
  cp "$SOURCE" "$DESTINATION"
  echo "✅ schema.prisma berhasil disalin ke eduvate-be"
else
  echo "❌ File $SOURCE tidak ditemukan. Pastikan path-nya benar."
  exit 1
fi

# Jalankan prisma generate di eduvate-be
echo "🚀 Menjalankan 'pnpm exec prisma generate' di $TARGET_DIR ..."
cd "$TARGET_DIR" || {
  echo "❌ Gagal masuk ke direktori $TARGET_DIR"
  exit 1
}

pnpm exec prisma generate

if [ $? -eq 0 ]; then
  echo "✅ Prisma generate berhasil dijalankan."
else
  echo "❌ Gagal menjalankan prisma generate."
  exit 1
fi
