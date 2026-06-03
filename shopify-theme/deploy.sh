#!/usr/bin/env bash
# Déploie les 4 assets Liquid de l'embed produit sur le thème Shopify principal (publié).
# Pré-requis : token Admin avec scope write_themes.
# Usage : SHOPIFY_SHOP_URL=... SHOPIFY_ACCESS_TOKEN=... bash shopify-theme/deploy.sh
set -euo pipefail

API="2024-01"
SHOP="${SHOPIFY_SHOP_URL:?SHOPIFY_SHOP_URL manquant}"
TOKEN="${SHOPIFY_ACCESS_TOKEN:?SHOPIFY_ACCESS_TOKEN manquant}"
ROOT="$(cd "$(dirname "$0")" && pwd)"

base="https://${SHOP}/admin/api/${API}"
hdr=(-H "X-Shopify-Access-Token: ${TOKEN}" -H "Content-Type: application/json")

# 1. Trouver le thème principal (role=main)
echo "→ Recherche du thème principal…"
theme_id="$(curl -s "${base}/themes.json" "${hdr[@]}" \
  | python3 -c "import sys,json;[print(t['id']) for t in json.load(sys.stdin)['themes'] if t['role']=='main']")"
[ -n "$theme_id" ] || { echo "✗ Aucun thème role=main trouvé"; exit 1; }
echo "  thème principal: ${theme_id}"

# 2. Pousser chaque asset (clé = chemin relatif depuis shopify-theme/)
push() {
  local key="$1" file="$2"
  echo "→ PUT ${key}"
  python3 - "$key" "$file" <<'PY' > /tmp/sinoa_asset.json
import json,sys
key, path = sys.argv[1], sys.argv[2]
print(json.dumps({"asset": {"key": key, "value": open(path, encoding="utf-8").read()}}))
PY
  code="$(curl -s -o /tmp/sinoa_resp.json -w "%{http_code}" -X PUT \
    "${base}/themes/${theme_id}/assets.json" "${hdr[@]}" --data-binary @/tmp/sinoa_asset.json)"
  if [ "$code" = "200" ] || [ "$code" = "201" ]; then echo "  ✓ ${code}"; else echo "  ✗ ${code}"; cat /tmp/sinoa_resp.json; exit 1; fi
}

push "layout/theme.embed.liquid"            "${ROOT}/layout/theme.embed.liquid"
push "templates/product.embed.liquid"       "${ROOT}/templates/product.embed.liquid"
push "sections/sinoa-product-embed.liquid"  "${ROOT}/sections/sinoa-product-embed.liquid"
push "snippets/sinoa-react-bridge.liquid"   "${ROOT}/snippets/sinoa-react-bridge.liquid"

echo "✓ Déploiement terminé sur le thème ${theme_id}."
