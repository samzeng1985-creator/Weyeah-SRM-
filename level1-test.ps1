$body = @{
    code = "PRC-TEST-001"
    supplierId = 1
    materialId = 1
    price = 5000
    currency = "CNY"
    unit = "PCS"
    minOrderQty = 1
    effectiveDate = "2026-05-21"
    status = "DRAFT"
    remark = "LEVEL1 Test"
}
$json = $body | ConvertTo-Json
Write-Host "Creating LEVEL1 pricing (5000 CNY x 1 = 5000 CNY)..."
$resp = Invoke-RestMethod -Uri "http://localhost:8080/api/pricing" -Method Post -Body $json -ContentType "application/json"
Write-Host "Create result: ID=$($resp.data.id), Status=$($resp.data.status)"
Write-Host ""
Write-Host "Submitting for approval..."
$l1id = $resp.data.id
$resp2 = Invoke-RestMethod -Uri "http://localhost:8080/api/pricing/$l1id/submit" -Method Post -ContentType "application/json"
Write-Host "Submit result: ApprovalLevel=$($resp2.data.approvalLevel)"
Write-Host ""
Write-Host "Manager approval..."
$resp3 = Invoke-RestMethod -Uri "http://localhost:8080/api/pricing/$l1id/approve" -Method Post -ContentType "application/json"
Write-Host "Approval result: $($resp3.message)"
Write-Host ""
Write-Host "LEVEL1 TEST COMPLETE!"
