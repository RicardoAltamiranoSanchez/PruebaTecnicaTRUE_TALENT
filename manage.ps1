param (
    [string]$Command
)

switch ($Command) {
    "build" {
        Write-Host "Construyendo contenedores..." -ForegroundColor Cyan
        docker compose build
    }
    "up" {
        Write-Host "Levantando servicios..." -ForegroundColor Green
        docker compose up -d
    }
    "down" {
        Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
        docker compose down
    }
    "logs" {
        Write-Host "Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Cyan
        docker compose logs -f
    }
    "clean" {
        Write-Host "Limpiando todo (incluyendo volumenes)..." -ForegroundColor Red
        docker compose down -v
    }
    "restart-rpa" {
        Write-Host "Reiniciando RPA..." -ForegroundColor Magenta
        docker compose up -d --build --force-recreate rpa
    }
    "help" {
        Write-Host "Comandos disponibles para True Talent:" -ForegroundColor Green
        Write-Host "  .\manage.ps1 build        - Construye los contenedores"
        Write-Host "  .\manage.ps1 up           - Levanta los servicios en segundo plano"
        Write-Host "  .\manage.ps1 down         - Detiene y elimina los contenedores"
        Write-Host "  .\manage.ps1 logs         - Muestra los logs en tiempo real"
        Write-Host "  .\manage.ps1 clean        - Detiene y elimina volumenes (borra datos)"
        Write-Host "  .\manage.ps1 restart-rpa  - Reinicia solo el servicio RPA"
    }
    Default {
        Write-Host "Comando no reconocido. Usa 'help' para ver opciones." -ForegroundColor Yellow
        Write-Host "Ejemplo: .\manage.ps1 up"
    }
}
