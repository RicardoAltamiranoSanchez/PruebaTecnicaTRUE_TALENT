# Makefile para Prueba Técnica True Talent

.PHONY: help build up down logs clean shell-backend shell-frontend test

# Variables
DOCKER_COMPOSE = docker compose

help: ## Muestra esta ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Construye los contenedores Docker
	$(DOCKER_COMPOSE) build

up: ## Levanta todos los servicios en segundo plano
	$(DOCKER_COMPOSE) up -d

down: ## Detiene y elimina los contenedores
	$(DOCKER_COMPOSE) down

logs: ## Muestra logs de todos los servicios
	$(DOCKER_COMPOSE) logs -f

clean: ## Detiene contenedores y elimina volúmenes (¡Cuidado! Borra datos de DB)
	$(DOCKER_COMPOSE) down -v

shell-backend: ## Abre una shell en el contenedor de Backend
	$(DOCKER_COMPOSE) exec backend bash

shell-frontend: ## Abre una shell en el contenedor de Frontend
	$(DOCKER_COMPOSE) exec frontend sh

test: ## Ejecuta tests (si existen configurados)
	$(DOCKER_COMPOSE) exec backend pytest

restart-rpa: ## Reinicia y reconstruye solo el servicio RPA
	$(DOCKER_COMPOSE) up -d --build --force-recreate rpa
