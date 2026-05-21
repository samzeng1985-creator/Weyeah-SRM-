Write-Host "=== 开始测试定价审批流程 ===" -ForegroundColor Cyan
$baseUrl = "http://localhost:8080/api/pricing"

Write-Host "1. 获取现有定价列表" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl?page=1&pageSize=20" -Method Get -Headers @{"Content-Type"="application/json"}
    Write-Host "   成功获取到 $($resp.data.list.Count) 条记录" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "2. 创建LEVEL1测试定价（5000元 × 1件 = 5000元）" -ForegroundColor Yellow
$newPricing1 = @{
    code="PRC-TEST-001"
    supplierId=1
    materialId=1
    price=5000
    currency="CNY"
    unit="件"
    minOrderQty=1
    effectiveDate="2026-05-21"
    status="DRAFT"
    remark="LEVEL1测试"
}
try {
    $resp = Invoke-RestMethod -Uri $baseUrl -Method Post -Body ($newPricing1 | ConvertTo-Json) -ContentType "application/json"
    $script:pricingId1 = $resp.data.id
    Write-Host "   成功创建，ID: $pricingId1" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "3. 提交审批LEVEL1" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/$pricingId1/submit" -Method Post
    Write-Host "   成功提交，审批等级: $($resp.data.approvalLevel)" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "4. 采购经理审批LEVEL1" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/$pricingId1/approve" -Method Post
    Write-Host "   审批成功！定价已生效!" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "5. 创建LEVEL2测试定价（30000元 × 4件 = 120000元）" -ForegroundColor Yellow
$newPricing2 = @{
    code="PRC-TEST-002"
    supplierId=1
    materialId=2
    price=30000
    currency="CNY"
    unit="套"
    minOrderQty=4
    effectiveDate="2026-05-21"
    status="DRAFT"
    remark="LEVEL2测试"
}
try {
    $resp = Invoke-RestMethod -Uri $baseUrl -Method Post -Body ($newPricing2 | ConvertTo-Json) -ContentType "application/json"
    $script:pricingId2 = $resp.data.id
    Write-Host "   成功创建，ID: $pricingId2" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "6. 提交审批LEVEL2" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/$pricingId2/submit" -Method Post
    Write-Host "   成功提交，审批等级: $($resp.data.approvalLevel)" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "7. 采购经理审批LEVEL2 → 财务待审核" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/$pricingId2/approve" -Method Post
    Write-Host "   审批成功！状态变为待财务审核!" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "8. 财务审核LEVEL2" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/$pricingId2/finance-approve" -Method Post
    Write-Host "   财务审核成功！定价已生效!" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "9. 创建LEVEL3测试定价（200000元 × 3件 = 600000元）" -ForegroundColor Yellow
$newPricing3 = @{
    code="PRC-TEST-003"
    supplierId=1
    materialId=1
    price=200000
    currency="CNY"
    unit="件"
    minOrderQty=3
    effectiveDate="2026-05-21"
    status="DRAFT"
    remark="LEVEL3测试"
}
try {
    $resp = Invoke-RestMethod -Uri $baseUrl -Method Post -Body ($newPricing3 | ConvertTo-Json) -ContentType "application/json"
    $script:pricingId3 = $resp.data.id
    Write-Host "   成功创建，ID: $pricingId3" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "10. 提交审批LEVEL3" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/$pricingId3/submit" -Method Post
    Write-Host "   成功提交，审批等级: $($resp.data.approvalLevel)" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "11. 采购经理审批LEVEL3 → 财务待审核" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/$pricingId3/approve" -Method Post
    Write-Host "   审批成功！状态变为待财务审核!" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "12. 财务审核LEVEL3 → 总监待审批" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/$pricingId3/finance-approve" -Method Post
    Write-Host "   财务审核成功！状态变为待总监审批!" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "13. 总监审批LEVEL3" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/$pricingId3/director-approve" -Method Post
    Write-Host "   总监审批成功！定价已生效!" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "14. 测试驳回功能" -ForegroundColor Yellow
$newPricing4 = @{
    code="PRC-TEST-004"
    supplierId=2
    materialId=3
    price=5000
    currency="CNY"
    unit="套"
    minOrderQty=1
    effectiveDate="2026-05-21"
    status="DRAFT"
    remark="驳回测试"
}
try {
    $resp = Invoke-RestMethod -Uri $baseUrl -Method Post -Body ($newPricing4 | ConvertTo-Json) -ContentType "application/json"
    $script:pricingId4 = $resp.data.id
    Write-Host "   成功创建，ID: $pricingId4" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "15. 提交审批，然后驳回" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/$pricingId4/submit" -Method Post | Out-Null
    $resp = Invoke-RestMethod -Uri "$baseUrl/$pricingId4/reject" -Method Post -Body (@{reason="测试驳回"} | ConvertTo-Json) -ContentType "application/json"
    Write-Host "   驳回成功！状态已返回草稿!" -ForegroundColor Green
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "16. 查看最终定价列表" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl?page=1&pageSize=20" -Method Get
    Write-Host "   === 最终列表 ==="
    $resp.data.list | ForEach-Object {
        $total = $_.price * $_.minOrderQty
        Write-Host "   ID: $($_.id), 编号: $($_.code), 状态: $($_.status), 金额: ¥$total"
    }
} catch {
    Write-Host "   失败: $_" -ForegroundColor Red
}

Write-Host "`n=== 所有测试完成! ===" -ForegroundColor Cyan
