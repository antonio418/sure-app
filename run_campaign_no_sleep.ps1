$signature = @'
[System.Runtime.InteropServices.DllImport("kernel32.dll", CharSet = System.Runtime.InteropServices.CharSet.Auto, SetLastError = true)]
public static extern uint SetThreadExecutionState(uint esFlags);
'@
$type = Add-Type -MemberDefinition $signature -Name "Win32Sleep" -Namespace "Win32" -PassThru

# ES_CONTINUOUS = 0x80000000
# ES_SYSTEM_REQUIRED = 0x00000001
$ES_CONTINUOUS = [Convert]::ToUInt32("80000000", 16)
$ES_SYSTEM_REQUIRED = [uint32]1

# Prevent sleep
$type::SetThreadExecutionState($ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED)

Write-Host "Iniciando envío de correos. Se ha bloqueado la suspensión automática del PC..." -ForegroundColor Green

# Run node script
node send_drip_batch.mjs

# Restore sleep settings
$type::SetThreadExecutionState($ES_CONTINUOUS)
Write-Host "Envío completado. Se ha restablecido la suspensión automática del PC." -ForegroundColor Green
