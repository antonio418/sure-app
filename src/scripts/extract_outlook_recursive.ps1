$ErrorActionPreference = "SilentlyContinue"

Write-Host ">>> Conectando a Outlook..." -ForegroundColor Cyan
$outlook = New-Object -ComObject Outlook.Application
$namespace = $outlook.GetNamespace("MAPI")

# Diccionario para almacenar emails unicos y sus dominios
$uniqueLeads = @{}

# Filtro de dominios B2B (ignoramos correos publicos)
$freeProviders = @('gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'msn.com', 'live.com')

# Funcion recursiva para procesar carpetas y subcarpetas
function Process-Folder($folder) {
    Write-Host "[DIR] Escaneando carpeta: $($folder.Name)" -ForegroundColor Yellow
    
    $items = $folder.Items
    if ($items) {
        foreach ($item in $items) {
            # Intentar extraer el SenderEmailAddress
            try {
                if ($item.SenderEmailAddress -match '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$') {
                    $email = $item.SenderEmailAddress.ToLower()
                    $domain = $email.Split('@')[1]
                    if ($freeProviders -notcontains $domain) {
                        $uniqueLeads[$email] = $domain
                    }
                }
            } catch {}

            # Opcionalmente, se podria extraer del Body aqui, pero para miles de carpetas lo omitimos por velocidad
        }
    }

    # Procesar subcarpetas recursivamente
    if ($folder.Folders.Count -gt 0) {
        foreach ($subfolder in $folder.Folders) {
            Process-Folder -folder $subfolder
        }
    }
}

# Obtener todas las cuentas/archivos de datos anclados
$stores = $namespace.Folders
Write-Host "[INFO] Se encontraron $($stores.Count) archivos de datos/cuentas en Outlook." -ForegroundColor Cyan

foreach ($store in $stores) {
    Write-Host "======================================" -ForegroundColor Magenta
    Write-Host "[STORE] Procesando Archivo: $($store.Name)" -ForegroundColor Magenta
    Write-Host "======================================" -ForegroundColor Magenta
    foreach ($folder in $store.Folders) {
        Process-Folder -folder $folder
    }
}

Write-Host "[SUCCESS] Escaneo completado. Correos corporativos unicos encontrados: $($uniqueLeads.Count)" -ForegroundColor Green

# Convertir el diccionario a un array de objetos JSON para Supabase
$payload = @()
foreach ($key in $uniqueLeads.Keys) {
    $payload += @{
        email = $key
        domain = $uniqueLeads[$key]
    }
}

$outputFile = "$PSScriptRoot\extracted_dns_leads.json"
$payload | ConvertTo-Json -Depth 2 | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "[DONE] Archivo guardado en: $outputFile" -ForegroundColor Cyan
Write-Host "[NEXT] Ahora puedes subir 'extracted_dns_leads.json' a tu tabla 'dns_leads' en Supabase." -ForegroundColor Cyan
