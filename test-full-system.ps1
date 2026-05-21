# System Comprehensive Test Script
Write-Host "=== Gas Generator Parts Procurement Management System - Full Test ===" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"
$headers = @{"Content-Type" = "application/json"}

# Test results collection
$testResults = @()

# 1. Login Test
Write-Host "`n[1] Login Test..." -ForegroundColor Yellow
try {
    $loginBody = @{username = "admin"; password = "admin123"} | ConvertTo-Json
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    if ($loginResponse.success) {
        $token = $loginResponse.data.token
        $headers["Authorization"] = "Bearer $token"
        $testResults += @{Module="Auth"; Test="Login"; Status="PASS"; Details="Token obtained successfully"}
        Write-Host "PASS: Login successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Auth"; Test="Login"; Status="FAIL"; Details=$loginResponse.message}
        Write-Host "FAIL: Login failed: $($loginResponse.message)" -ForegroundColor Red
    }
} catch {
    $testResults += @{Module="Auth"; Test="Login"; Status="FAIL"; Details=$_.Exception.Message}
    Write-Host "FAIL: Login request failed: $_" -ForegroundColor Red
}

# 2. Supplier Management Module Test
Write-Host "`n[2] Supplier Management Tests..." -ForegroundColor Yellow

# 2.1 Get Supplier List
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/suppliers?page=1&pageSize=5" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Supplier"; Test="GetList"; Status="PASS"; Details="Total: $($response.data.total) records"}
        Write-Host "PASS: Get supplier list successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Supplier"; Test="GetList"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Supplier"; Test="GetList"; Status="FAIL"; Details=$_.Exception.Message}
}

# 2.2 Get Supplier Detail
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/suppliers/1" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Supplier"; Test="GetDetail"; Status="PASS"; Details="Supplier: $($response.data.name)"}
        Write-Host "PASS: Get supplier detail successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Supplier"; Test="GetDetail"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Supplier"; Test="GetDetail"; Status="FAIL"; Details=$_.Exception.Message}
}

# 2.3 Supplier Tags Test
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/supplier-tags/supplier/1" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Supplier"; Test="Tags"; Status="PASS"; Details="$($response.data.Count) tags found"}
        Write-Host "PASS: Supplier tags management successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Supplier"; Test="Tags"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Supplier"; Test="Tags"; Status="FAIL"; Details=$_.Exception.Message}
}

# 3. Material Management Module Test
Write-Host "`n[3] Material Management Tests..." -ForegroundColor Yellow

# 3.1 Get Material List
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/materials?page=1&pageSize=5" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Material"; Test="GetList"; Status="PASS"; Details="Total: $($response.data.total) records"}
        Write-Host "PASS: Get material list successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Material"; Test="GetList"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Material"; Test="GetList"; Status="FAIL"; Details=$_.Exception.Message}
}

# 3.2 Drawing Management Test
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/material-drawings/material/1" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Material"; Test="Drawings"; Status="PASS"; Details="$($response.data.Count) drawings found"}
        Write-Host "PASS: Material drawings management successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Material"; Test="Drawings"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Material"; Test="Drawings"; Status="FAIL"; Details=$_.Exception.Message}
}

# 4. Category Management Module Test
Write-Host "`n[4] Category Management Tests..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/categories/tree" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Category"; Test="Tree"; Status="PASS"; Details="Success"}
        Write-Host "PASS: Get category tree successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Category"; Test="Tree"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Category"; Test="Tree"; Status="FAIL"; Details=$_.Exception.Message}
}

# 5. Pricing Management Module Test
Write-Host "`n[5] Pricing Management Tests..." -ForegroundColor Yellow

# 5.1 Get Pricing List
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/pricing?page=1&pageSize=5" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Pricing"; Test="GetList"; Status="PASS"; Details="Total: $($response.data.total) records"}
        Write-Host "PASS: Get pricing list successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Pricing"; Test="GetList"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Pricing"; Test="GetList"; Status="FAIL"; Details=$_.Exception.Message}
}

# 5.2 Get Current Price
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/pricing/current-price?supplierId=1&materialId=1" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Pricing"; Test="CurrentPrice"; Status="PASS"; Details="Price: $($response.data.currentPrice)"}
        Write-Host "PASS: Get current price successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Pricing"; Test="CurrentPrice"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Pricing"; Test="CurrentPrice"; Status="FAIL"; Details=$_.Exception.Message}
}

# 6. Contract Management Module Test
Write-Host "`n[6] Contract Management Tests..." -ForegroundColor Yellow

# 6.1 Get Contract List
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/contracts?page=1&pageSize=5" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Contract"; Test="GetList"; Status="PASS"; Details="Total: $($response.data.total) records"}
        Write-Host "PASS: Get contract list successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Contract"; Test="GetList"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Contract"; Test="GetList"; Status="FAIL"; Details=$_.Exception.Message}
}

# 6.2 Get Contract Detail
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/contracts/1" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Contract"; Test="GetDetail"; Status="PASS"; Details="Contract: $($response.data.name)"}
        Write-Host "PASS: Get contract detail successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Contract"; Test="GetDetail"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Contract"; Test="GetDetail"; Status="FAIL"; Details=$_.Exception.Message}
}

# 7. Contract Template Management Test
Write-Host "`n[7] Contract Template Management Tests..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/contract-templates?page=1&pageSize=5" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Template"; Test="GetList"; Status="PASS"; Details="Total: $($response.data.total) templates"}
        Write-Host "PASS: Get contract templates successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Template"; Test="GetList"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Template"; Test="GetList"; Status="FAIL"; Details=$_.Exception.Message}
}

# 8. Organization Module Test
Write-Host "`n[8] Organization Management Tests..." -ForegroundColor Yellow

# 8.1 Get Department List
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/departments" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Organization"; Test="Departments"; Status="PASS"; Details="$($response.data.Count) departments"}
        Write-Host "PASS: Get department list successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Organization"; Test="Departments"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Organization"; Test="Departments"; Status="FAIL"; Details=$_.Exception.Message}
}

# 8.2 Get Role List
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/roles" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Organization"; Test="Roles"; Status="PASS"; Details="$($response.data.Count) roles"}
        Write-Host "PASS: Get role list successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Organization"; Test="Roles"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Organization"; Test="Roles"; Status="FAIL"; Details=$_.Exception.Message}
}

# 9. Permission Management Test
Write-Host "`n[9] Permission Management Tests..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/roles/permissions/tree" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Permission"; Test="Tree"; Status="PASS"; Details="Success"}
        Write-Host "PASS: Get permission tree successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Permission"; Test="Tree"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Permission"; Test="Tree"; Status="FAIL"; Details=$_.Exception.Message}
}

# 10. Supplier Evaluation Test
Write-Host "`n[10] Supplier Evaluation Tests..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/supplier-evaluations/supplier/1" -Method Get -Headers $headers
    if ($response.success) {
        $testResults += @{Module="Evaluation"; Test="Records"; Status="PASS"; Details="$($response.data.Count) records"}
        Write-Host "PASS: Get supplier evaluations successful" -ForegroundColor Green
    } else {
        $testResults += @{Module="Evaluation"; Test="Records"; Status="FAIL"; Details=$response.message}
    }
} catch {
    $testResults += @{Module="Evaluation"; Test="Records"; Status="FAIL"; Details=$_.Exception.Message}
}

# Output Test Report
Write-Host "`n"
Write-Host "=== TEST REPORT SUMMARY ===" -ForegroundColor Cyan
Write-Host "=================================================="
$testResults | Format-Table Module, Test, Status, Details -AutoSize

# Statistics
$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $testResults.Count
$passRate = [math]::Round(($passed / $total) * 100, 2)

Write-Host "`nTest Statistics:"
Write-Host "  Total Tests: $total"
Write-Host "  Passed: $passed"
Write-Host "  Failed: $failed"
Write-Host "  Pass Rate: $passRate%"

if ($failed -eq 0) {
    Write-Host "`nAll tests passed! System is running normally!" -ForegroundColor Green
} else {
    Write-Host "`nSome tests failed, please check the relevant modules" -ForegroundColor Yellow
}

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Cyan
