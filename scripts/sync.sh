#!/usr/bin/env bash
# ------------------------------------------------------------------
#  Ignis Vestae · sincronizzazione con GitHub
#
#  Da lanciare PRIMA di aprire Godot (e va benissimo anche dopo aver
#  lavorato). Fa tre cose, in ordine:
#    1. se hai modifiche locali, ti chiede se salvarle (commit);
#    2. scarica gli aggiornamenti dalla repo e si riallinea;
#    3. pusha su GitHub gli eventuali commit tuoi non ancora inviati.
#
#  Uso:  ./scripts/sync.sh
# ------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "— Ignis Vestae · branch: $BRANCH"

# 1) modifiche locali non ancora salvate?
if ! git diff --quiet || ! git diff --cached --quiet \
   || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  echo
  echo "Hai modifiche locali non salvate:"
  git status --short
  echo
  read -rp "Le salvo in un commit? [S/n] " risposta
  if [[ ! "${risposta:-s}" =~ ^[nN] ]]; then
    read -rp "Descrizione (invio = \"Lavoro dall'editor Godot\"): " msg
    if [ -z "$msg" ]; then msg="Lavoro dall'editor Godot"; fi
    git add -A
    git commit -m "$msg"
  else
    echo "Ok: restano in sospeso, l'aggiornamento le preserva (autostash)."
  fi
fi

# 2) scarica e riallinea; --autostash protegge le modifiche in sospeso
echo "— Scarico gli aggiornamenti da GitHub…"
if ! git pull --rebase --autostash origin "$BRANCH"; then
  echo
  echo "✗ CONFLITTO: le stesse righe sono state cambiate qui e su GitHub."
  echo "  Non toccare nulla e chiedi a Claude di aiutarti a risolverlo"
  echo "  (oppure: git rebase --abort per annullare e tornare com'eri)."
  exit 1
fi

# 3) pusha i commit locali non ancora su GitHub
if [ -n "$(git log --oneline @{u}..HEAD 2>/dev/null)" ]; then
  echo "— Invio i tuoi commit a GitHub…"
  git push origin "$BRANCH"
fi

echo "✔ Tutto allineato. Puoi aprire Godot."
