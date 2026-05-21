# 测试定价审批流程脚本
Write-Host "=== 开始测试定价审批流程 ===`n" -ForegroundColor Cyan

# 设置基础URL
$baseUrl = "http://localhost:8080"

# 辅助函数：发送POST请求
function Invoke-PostRequest {
    param($url, $body)
    $bodyJson = $null
    if ($body) {
        $bodyJson = $body | ConvertTo-Json
    }
    $headers = @{"Content-Type" = "application/json"}
    try {
        if ($bodyJson) {
            $response = Invoke-RestMethod -Uri $url -Method Post -Body $bodyJson -Headers $headers -TimeoutSec 10
        } else {
            $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -TimeoutSec 10
        }
        return $response
    } catch {
        Write-Host "请求失败: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 辅助函数：发送GET请求
function Invoke-GetRequest {
    param($url)
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10
        return $response
    } catch {
        Write-Host "请求失败: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 1. 先获取当前定价列表
Write-Host "1. 获取当前定价列表" -ForegroundColor Yellow
$listResponse = Invoke-GetRequest "$baseUrl/api/pricing?page=1&pageSize=20"
if ($listResponse -and $listResponse.success) {
    Write-Host "   成功！找到 $($listResponse.data.total) 条记录`n" -ForegroundColor Green
    foreach ($pricing in $listResponse.data.list) {
        Write-Host "   ID: $($pricing.id), 编号: $($pricing.code), 状态: $($pricing.status), 供应商: $($pricing.supplierName), 物料: $($pricing.materialName), 价格: $($pricing.price)"
    }
    Write-Host ""
}

# 2. 创建一个新的定价（LEVEL1: 5000 * 1 = 5000 ≤ 10万）
Write-Host "2. 创建LEVEL1测试定价（5000元/件 × 1件）" -ForegroundColor Yellow
$newPricing1 = @{
    code = "PRC-TEST-001"
    supplierId = 1
    materialId = 1
    price = 5000.00
    currency = "CNY"
    unit = "件"
    minOrderQty = 1
    effectiveDate = "2026-05-21"
    status = "DRAFT"
    remark = "LEVEL1测试数据"
}
$createResponse1 = Invoke-PostRequest "$baseUrl/api/pricing" $newPricing1
if ($createResponse1 -and $createResponse1.success) {
    $pricingId1 = $createResponse1.data.id
    Write-Host "   成功创建！定价ID: $pricingId1`n" -ForegroundColor Green
} else {
    Write-Host "   创建失败！`n" -ForegroundColor Red
    exit
}

# 3. 测试LEVEL1审批流程
Write-Host "3. 测试LEVEL1审批流程" -ForegroundColor Yellow

# 3.1 提交审批
Write-Host "   3.1 提交审批" -ForegroundColor Cyan
$submitResponse = Invoke-PostRequest "$baseUrl/api/pricing/$pricingId1/submit"
if ($submitResponse -and $submitResponse.success) {
    Write-Host "      成功！审批等级: $($submitResponse.data.approvalLevel)`n" -ForegroundColor Green
}

# 3.2 采购经理审批
Write-Host "   3.2 采购经理审批" -ForegroundColor Cyan
$approveResponse = Invoke-PostRequest "$baseUrl/api/pricing/$pricingId1/approve"
if ($approveResponse -and $approveResponse.success) {
    Write-Host "      成功！状态: 已生效`n" -ForegroundColor Green
}

# 4. 获取更新后的定价信息
Write-Host "4. 查看LEVEL1审批结果" -ForegroundColor Yellow
$detailResponse = Invoke-GetRequest "$baseUrl/api/pricing/$pricingId1"
if ($detailResponse -and $detailResponse.success) {
    $pricing = $detailResponse.data
    Write-Host "   编号: $($pricing.code), 状态: $($pricing.status)`n" -ForegroundColor Green
}

# 5. 创建LEVEL2测试定价（30000 * 1 = 30000，10-50万）
Write-Host "5. 创建LEVEL2测试定价（30000元/件 × 2件 = 60000元？等等，我算错了。让我调整一下：）" -ForegroundColor Yellow
Write-Host "   重新计算：LEVEL2是10-50万，所以需要价格×数量在10万-50万之间。" -ForegroundColor Cyan
$newPricing2 = @{
    code = "PRC-TEST-002"
    supplierId = 1
    materialId = 2
    price = 30000.00
    currency = "CNY"
    unit = "套"
    minOrderQty = 4
    effectiveDate = "2026-05-21"
    status = "DRAFT"
    remark = "LEVEL2测试数据：30000 × 4 = 120000元"
}
$createResponse2 = Invoke-PostRequest "$baseUrl/api/pricing" $newPricing2
if ($createResponse2 -and $createResponse2.success) {
    $pricingId2 = $createResponse2.data.id
    Write-Host "   成功创建！定价ID: $pricingId2`n" -ForegroundColor Green
}

# 6. 测试LEVEL2审批流程
Write-Host "6. 测试LEVEL2审批流程" -ForegroundColor Yellow

# 6.1 提交审批
Write-Host "   6.1 提交审批" -ForegroundColor Cyan
$submitResponse2 = Invoke-PostRequest "$baseUrl/api/pricing/$pricingId2/submit"
if ($submitResponse2 -and $submitResponse2.success) {
    Write-Host "      成功！审批等级: $($submitResponse2.data.approvalLevel)`n" -ForegroundColor Green
}

# 6.2 采购经理审批
Write-Host "   6.2 采购经理审批" -ForegroundColor Cyan
$approveResponse2 = Invoke-PostRequest "$baseUrl/api/pricing/$pricingId2/approve"
if ($approveResponse2 -and $approveResponse2.success) {
    Write-Host "      成功！状态: 待财务审核`n" -ForegroundColor Green
}

# 6.3 财务审核
Write-Host "   6.3 财务审核" -ForegroundColor Cyan
$financeApproveResponse = Invoke-PostRequest "$baseUrl/api/pricing/$pricingId2/finance-approve"
if ($financeApproveResponse -and $financeApproveResponse.success) {
    Write-Host "      成功！状态: 已生效`n" -ForegroundColor Green
}

# 7. 创建LEVEL3测试定价（200000 × 1 = 200000，超过50万）
Write-Host "7. 创建LEVEL3测试定价（200000元/件 × 3件 = 600000元，>50万）" -ForegroundColor Yellow
$newPricing3 = @{
    code = "PRC-TEST-003"
    supplierId = 1
    materialId = 1
    price = 200000.00
    currency = "CNY"
    unit = "件"
    minOrderQty = 3
    effectiveDate = "2026-05-21"
    status = "DRAFT"
    remark = "LEVEL3测试数据：200000 × 3 = 600000元"
}
$createResponse3 = Invoke-PostRequest "$baseUrl/api/pricing" $newPricing3
if ($createResponse3 -and $createResponse3.success) {
    $pricingId3 = $createResponse3.data.id
    Write-Host "   成功创建！定价ID: $pricingId3`n" -ForegroundColor Green
}

# 8. 测试LEVEL3审批流程
Write-Host "8. 测试LEVEL3审批流程" -ForegroundColor Yellow

# 8.1 提交审批
Write-Host "   8.1 提交审批" -ForegroundColor Cyan
$submitResponse3 = Invoke-PostRequest "$baseUrl/api/pricing/$pricingId3/submit"
if ($submitResponse3 -and $submitResponse3.success) {
    Write-Host "      成功！审批等级: $($submitResponse3.data.approvalLevel)`n" -ForegroundColor Green
}

# 8.2 采购经理审批
Write-Host "   8.2 采购经理审批" -ForegroundColor Cyan
$approveResponse3 = Invoke-PostRequest "$baseUrl/api/pricing/$pricingId3/approve"
if ($approveResponse3 -and $approveResponse3.success) {
    Write-Host "      成功！状态: 待财务审核`n" -ForegroundColor Green
}

# 8.3 财务审核
Write-Host "   8.3 财务审核" -ForegroundColor Cyan
$financeApproveResponse3 = Invoke-PostRequest "$baseUrl/api/pricing/$pricingId3/finance-approve"
if ($financeApproveResponse3 -and $financeApproveResponse3.success) {
    Write-Host "      成功！状态: 待总监审批`n" -ForegroundColor Green
}

# 8.4 总监审批
Write-Host "   8.4 总监审批" -ForegroundColor Cyan
$directorApproveResponse = Invoke-PostRequest "$baseUrl/api/pricing/$pricingId3/director-approve"
if ($directorApproveResponse -and $directorApproveResponse.success) {
    Write-Host "      成功！状态: 已生效`n" -ForegroundColor Green
}

# 9. 测试驳回功能
Write-Host "9. 测试驳回功能" -ForegroundColor Yellow
$newPricing4 = @{
    code = "PRC-TEST-004"
    supplierId = 2
    materialId = 3
    price = 5000.00
    currency = "CNY"
    unit = "套"
    minOrderQty = 1
    effectiveDate = "2026-05-21"
    status = "DRAFT"
    remark = "驳回功能测试数据"
}
$createResponse4 = Invoke-PostRequest "$baseUrl/api/pricing" $newPricing4
if ($createResponse4 -and $createResponse4.success) {
    $pricingId4 = $createResponse4.data.id
    Write-Host "   成功创建！定价ID: $pricingId4`n" -ForegroundColor Green
    
    # 提交审批
    Write-Host "   9.1 提交审批" -ForegroundColor Cyan
    Invoke-PostRequest "$baseUrl/api/pricing/$pricingId4/submit" | Out-Null
    
    # 驳回
    Write-Host "   9.2 驳回审批" -ForegroundColor Cyan
    $rejectBody = @{reason = "价格过高，需要重新评估"}
    $rejectResponse = Invoke-PostRequest "$baseUrl/api/pricing/$pricingId4/reject" $rejectBody
    if ($rejectResponse -and $rejectResponse.success) {
        Write-Host "      成功！状态已返回草稿`n" -ForegroundColor Green
    }
}

# 10. 测试终止功能
Write-Host "10. 测试终止功能" -ForegroundColor Yellow
$activePricing = $listResponse.data.list | Where-Object { $_.status -eq "ACTIVE" } | Select-Object -First 1
if ($activePricing) {
    Write-Host "   选择已生效定价: ID $($activePricing.id), $($activePricing.code)" -ForegroundColor Cyan
    $terminateResponse = Invoke-PostRequest "$baseUrl/api/pricing/$($activePricing.id)/terminate"
    if ($terminateResponse -and $terminateResponse.success) {
        Write-Host "      成功！状态已变为已过期`n" -ForegroundColor Green
    }
}

# 11. 查看最终定价列表
Write-Host "11. 查看最终定价列表" -ForegroundColor Yellow
$finalListResponse = Invoke-GetRequest "$baseUrl/api/pricing?page=1&pageSize=20"
if ($finalListResponse -and $finalListResponse.success) {
    Write-Host "   最终记录:`n" -ForegroundColor Green
    foreach ($pricing in $finalListResponse.data.list) {
        Write-Host "   ID: $($pricing.id), 编号: $($pricing.code), 状态: $($pricing.status)"
    }
    Write-Host ""
}

Write-Host "=== 测试完成 ===" -ForegroundColor Cyan
