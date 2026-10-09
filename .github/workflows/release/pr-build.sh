#!/usr/bin/env bash

set -euo pipefail

echo "Construindo imagem Docker"
docker build -t teste .