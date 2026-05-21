$baseUrl = "http://localhost:8080/api/pricing"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   定价审批流程自动化测试" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 辅助函数
function Test-API {
    param($name, $url, $method, $body = $null)
    Write-Host "  [API] $name" -ForegroundColor Gray
    try {
        if ($body) {
            $json = $body | ConvertTo-Json -Compress
            $script:resp = Invoke-RestMethod -Uri $url -Method $method -Body $json -ContentType "application/json"
        } else {
            $script:resp = Invoke-RestMethod -Uri $url -Method $method -ContentType "application/json"
        }
        if ($script:resp.success) {
            Write-Host "    ✓ 成功" -ForegroundColor Green
            return $true
        } else {
            Write-Host "    ✗ 失败: $($script:resp.message)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "    ✗ 异常: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "`n[测试1] LEVEL1审批流程 (≤10万元)" -ForegroundColor Yellow
Write-Host "  创建定价: 5000元 × 1件 = 5000元" -ForegroundColor Gray
$l1 = @{code="PRC-L1-001";supplierId=1;materialId=1;price=5000;currency="CNY";unit="件";minOrderQty=1;effectiveDate="2026-05-21";status="DRAFT";remark="LEVEL1测试"}
if (Test-API "创建定价" $baseUrl "POST" $l1) {
    $l1Id = $script:resp.data.id
    Write-Host "    ID: $l1Id" -ForegroundColor Cyan
    Test-API "提交审批" "$baseUrl/$l1Id/submit" "POST"
    Write-Host "    审批等级: $($script:resp.data.approvalLevel)" -ForegroundColor Cyan
    Test-API "采购经理审批" "$baseUrl/$l1Id/approve" "POST"
}

Write-Host "`n[测试2] LEVEL2审批流程 (10-50万元)" -ForegroundColor Yellow
Write-Host "  创建定价: 30000元 × 4件 = 120000元" -ForegroundColor Gray
$l2 = @{code="PRC-L2-001";supplierId=1;materialId=2;price=30000;currency="CNY";unit="套";minOrderQty=4;effectiveDate="2026-05-21";status="DRAFT";remark="LEVEL2测试"}
if (Test-API "创建定价" $baseUrl "POST" $l2) {
    $l2Id = $script:resp.data.id
    Write-Host "    ID: $l2Id" -ForegroundColor Cyan
    Test-API "提交审批" "$baseUrl/$l2Id/submit" "POST"
    Write-Host "    审批等级: $($script:resp.data.approvalLevel)" -ForegroundColor Cyan
    Test-API "采购经理审批" "$baseUrl/$l2Id/approve" "POST"
    Test-API "财务审核" "$baseUrl/$l2Id/finance-approve" "POST"
}

Write-Host "`n[测试3] LEVEL3审批流程 (>50万元)" -ForegroundColor Yellow
Write-Host "  创建定价: 200000元 × 3件 = 600000元" -ForegroundColor Gray
$l3 = @{code="PRC-L3-001";supplierId=1;materialId=1;price=200000;currency="CNY";unit="件";minOrderQty=3;effectiveDate="2026-05-21";status="DRAFT";remark="LEVEL3测试"}
if (Test-API "创建定价" $baseUrl "POST" $l3) {
    $l3Id = $script:resp.data.id
    Write-Host "    ID: $l3Id" -ForegroundColor Cyan
    Test-API "提交审批" "$baseUrl/$l3Id/submit" "POST"
    Write-Host "    审批等级: $($script:resp.data.approvalLevel)" -ForegroundColor Cyan
    Test-API "采购经理审批" "$baseUrl/$l3Id/approve" "POST"
    Test-API "财务审核" "$baseUrl/$l3Id/finance-approve" "POST"
    Test-API "总监审批" "$baseUrl/$l3Id/director-approve" "POST"
}

Write-Host "`n[测试4] 驳回功能测试" -ForegroundColor Yellow
Write-Host "  创建定价: 5000元 × 1件" -ForegroundColor Gray
$l4 = @{code="PRC-REJECT-001";supplierId=2;materialId=3;price=5000;currency="CNY";unit="套";minOrderQty=1;effectiveDate="2026-05-21";status="DRAFT";remark="驳回测试"}
if (Test-API "创建定价" $baseUrl "POST" $l4) {
    $l4Id = $script:resp.data.id
    Write-Host "    ID: $l4Id" -ForegroundColor Cyan
    Test-API "提交审批" "$baseUrl/$l4Id/submit" "POST"
    $rejectBody = @{reason="测试驳回原因：价格需重新评估"}
    Test-API "驳回" "$baseUrl/$l4Id/reject" "POST" $rejectBody
}

Write-Host "`n[测试5] 终止功能测试" -ForegroundColor Yellow
Write-Host "  选择已有的已生效定价" -ForegroundColor Gray
Test-API "查询定价列表" "$baseUrl?page=1&pageSize=20" "GET"
$activeItem = $script:resp.data.list | Where-Object { $_.status -eq "ACTIVE" } | Select-Object -First 1
if ($activeItem) {
    Write-Host "    找到已生效定价: ID=$($activeItem.id), 编号=$($activeItem.code)" -ForegroundColor Cyan
    Test-API "终止定价" "$baseUrl/$($activeItem.id)/terminate" "POST"
}

Write-Host "`n[验证] 最终定价列表" -ForegroundColor Yellow
Test-API "获取最新列表" "$baseUrl?page=1&pageSize=20" "GET"
Write-Host "`n  定价列表:" -ForegroundColor Cyan
$script:resp.data.list | ForEach-Object {
    $total = $_.price * $_.minOrderQty
    $statusName = switch($_.status) {
        "DRAFT" { "草稿" }
        "PENDING" { "待审批" }
        "FINANCE_PENDING" { "待财务审核" }
        "DIRECTOR_PENDING" { "待总监审批" }
        "ACTIVE" { "已生效" }
        "EXPIRED" { "已过期" }
        default { $_.status }
    }
    Write-Host "    $($_.code) | ¥$($_.price) × $($_.minOrderQty) = ¥$total | $statusName"
}

Write-Host "`n======================================" -ForegroundColor Cyan
Write-Host "   测试完成!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
