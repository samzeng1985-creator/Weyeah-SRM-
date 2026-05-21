$headers = @{'Authorization'='Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsIm5iZiI6MTc3OTQ1MDYzOCwiZXhwIjoxNzc5NTM3MDM4fQ.WrCw7i8cRjwFpW7KZ0Z0k5YH8D6H6K8J7K0L3L0L5Y0'}

Write-Host "Testing contract-templates API..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/contract-templates?page=1&pageSize=5" -Headers $headers -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $reader.BaseStream.Position = 0
    $responseBody = $reader.ReadToEnd()
    Write-Host "Error Body: $responseBody"
}

Write-Host "`nTesting supplier-evaluations API..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/supplier-evaluations/supplier/1" -Headers $headers -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $reader.BaseStream.Position = 0
    $responseBody = $reader.ReadToEnd()
    Write-Host "Error Body: $responseBody"
}