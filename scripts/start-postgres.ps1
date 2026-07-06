# Запуск КотУслуг с PostgreSQL
$ErrorActionPreference = "Stop"
$env:Path += ";C:\Program Files\Docker\Docker\resources\bin"

Write-Host "1. Проверка Docker..." -ForegroundColor Cyan
docker info | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker engine не запущен. Открой Docker Desktop из меню Пуск и дождись 'Engine running'." -ForegroundColor Yellow
    Write-Host "После этого запусти этот скрипт снова." -ForegroundColor Yellow
    exit 1
}

Write-Host "2. Поднятие PostgreSQL..." -ForegroundColor Cyan
Set-Location $PSScriptRoot
docker compose up -d
docker compose ps

Write-Host "3. Ожидание готовности БД..." -ForegroundColor Cyan
1..20 | ForEach-Object {
    $healthy = docker inspect --format='{{.State.Health.Status}}' kotouslugi-postgres 2>$null
    if ($healthy -eq 'healthy') { return }
    Start-Sleep -Seconds 3
}

Write-Host "4. Запуск бэкенда..." -ForegroundColor Cyan
$env:JAVA_HOME = "C:\Program Files\ojdkbuild\java-17-openjdk-17.0.3.0.6-1"
$mvn = Join-Path $PSScriptRoot ".tools\apache-maven-3.9.6\bin\mvn.cmd"
if (-not (Test-Path $mvn)) { $mvn = "mvn" }

& $mvn -q install -DskipTests -pl kotouslugi-api -am
Set-Location kotouslugi-api
& $mvn spring-boot:run
