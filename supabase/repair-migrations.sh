#!/bin/bash
# Dashboard'dan manuel çalıştırdığın migration'ları (001-052) "uygulandı" olarak işaretler.
# Böylece bir sonraki "npx supabase db push" sadece 053 ve sonrasını çalıştırır.
#
# Kullanım: ./supabase/repair-migrations.sh
# Önce: npx supabase login ve npx supabase link (proje bağlı olmalı)

set -e
cd "$(dirname "$0")/.."

# Supabase CLI version = dosya adındaki sayı öneki (001, 002, ... 052)
VERSIONS=(
  001 002 003 004 005 006 007 008 009 010
  011 012 013 014 015 016 017 018 019 020
  021 022 023 024 025 026 027 028 029 030
  031 032 033 034 035 036 037 038 039 040
  041 042 043 044 045 046 047 048 049 050
  051 052
)

echo "001-052 migration'ları 'applied' olarak işaretleniyor (linked proje)..."
npx supabase migration repair --status applied "${VERSIONS[@]}"
echo "Tamamlandı. Artık 'npx supabase db push' sadece 053 ve sonrasını çalıştıracak."
