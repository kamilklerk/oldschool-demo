#!/bin/bash

# Skrypt deploy dla oldschooldj.pl
# Użycie: ./deploy.sh "opis zmiany"

REPO_DIR="/Users/kamil/Desktop/oldschool-demo"

if [ -z "$1" ]; then
  echo "Podaj opis zmiany, np: ./deploy.sh \"zmiana formularza\""
  exit 1
fi

cd "$REPO_DIR"
git add index.html css/styles.css js/tracking.js js/form.js js/main.js
git commit -m "$1"
git push

echo ""
echo "✅ Gotowe! Zmiany są na GitHubie."
