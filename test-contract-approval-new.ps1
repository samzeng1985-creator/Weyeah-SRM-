$baseUrl = "http://localhost:8080/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "合同审批流程测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginBody -TimeoutSec 10
    $token = $loginResponse.data.token
    Write-Host "✓ 登录成功" -ForegroundColor Green
} catch {
    Write-Host "✗ 登录失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host ""
Write-Host "步骤2: 查询草稿状态的合同..." -ForegroundColor Yellow
try {
    $contractsResponse = Invoke-RestMethod -Uri "$baseUrl/contracts?page=1&pageSize=10&status=DRAFT" -Method Get -Headers $headers -TimeoutSec 10
    $draftContracts = $contractsResponse.data.list
    
    if ($draftContracts.Count -eq 0) {
        Write-Host "没有找到草稿状态的合同，将创建一个新合同..." -ForegroundColor Yellow
        
        $newContractBody = @{
            name = "测试合同-审批流程测试"
            type = "采购合同"
            supplierId = 1
            startDate = "2026-05-21"
            endDate = "2027-05-21"
            currency = "CNY"
            paymentTerms = "预付30%，到货70%"
            amount = 150000
        } | ConvertTo-Json
        
        $createResponse = Invoke-RestMethod -Uri "$baseUrl/contracts" -Method Post -Headers $headers -Body $newContractBody -TimeoutSec 10
        $contractId = $createResponse.data
        Write-Host "✓ 新合同创建成功，ID: $contractId" -ForegroundColor Green
        
        Start-Sleep -Seconds 1
    } else {
        $contractId = $draftContracts[0].id
        Write-Host "✓ 找到草稿合同，ID: $contractId" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ 查询合同失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "步骤3: 提交审批..." -ForegroundColor Yellow
try {
    $submitResponse = Invoke-RestMethod -Uri "$baseUrl/contracts/$contractId/submit" -Method Post -Headers $headers -TimeoutSec 10
    Write-Host "✓ 提交审批成功！" -ForegroundColor Green
    Write-Host "  审批等级: $($submitResponse.data.approvalLevel)" -ForegroundColor Cyan
    Write-Host "  消息: $($submitResponse.data.message)" -ForegroundColor Cyan
    
    Start-Sleep -Seconds 1
} catch {
    Write-Host "✗ 提交审批失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "步骤4: 采购经理审批..." -ForegroundColor Yellow
try {
    $approveResponse = Invoke-RestMethod -Uri "$baseUrl/contracts/$contractId/approve" -Method Post -Headers $headers -TimeoutSec 10
    Write-Host "✓ 采购经理审批成功！" -ForegroundColor Green
    Write-Host "  消息: $($approveResponse.message)" -ForegroundColor Cyan
    
    Start-Sleep -Seconds 1
} catch {
    Write-Host "✗ 采购经理审批失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "步骤5: 财务审核..." -ForegroundColor Yellow
try {
    $financeResponse = Invoke-RestMethod -Uri "$baseUrl/contracts/$contractId/finance-approve" -Method Post -Headers $headers -TimeoutSec 10
    Write-Host "✓ 财务审核成功！" -ForegroundColor Green
    Write-Host "  消息: $($financeResponse.message)" -ForegroundColor Cyan
    
    Start-Sleep -Seconds 1
} catch {
    Write-Host "✗ 财务审核失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "步骤6: 法务审核（测试15万合同，应直接批准）..." -ForegroundColor Yellow
try {
    $legalResponse = Invoke-RestMethod -Uri "$baseUrl/contracts/$contractId/legal-approve" -Method Post -Headers $headers -TimeoutSec 10
    Write-Host "✓ 法务审核成功！" -ForegroundColor Green
    Write-Host "  消息: $($legalResponse.message)" -ForegroundColor Cyan
    
    Start-Sleep -Seconds 1
} catch {
    Write-Host "✗ 法务审核失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "步骤7: 查询合同最终状态..." -ForegroundColor Yellow
try {
    $finalContract = Invoke-RestMethod -Uri "$baseUrl/contracts/$contractId" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "✓ 查询成功！" -ForegroundColor Green
    Write-Host "  合同ID: $($finalContract.data.id)" -ForegroundColor Cyan
    Write-Host "  合同名称: $($finalContract.data.name)" -ForegroundColor Cyan
    Write-Host "  合同状态: $($finalContract.data.status)" -ForegroundColor Cyan
    Write-Host "  金额: ¥$($finalContract.data.amount)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ 查询合同状态失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
