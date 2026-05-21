# 测试供应商标签系统
Write-Host "=== 测试供应商标签系统 ===" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"
$loginUrl = "$baseUrl/auth/login"
$headers = @{"Content-Type" = "application/json"}

# 1. 登录获取token
Write-Host "`n[1] 登录获取Token..." -ForegroundColor Yellow
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -ContentType "application/json"
    if ($loginResponse.success) {
        $token = $loginResponse.data.token
        Write-Host "✓ 登录成功" -ForegroundColor Green
        $headers["Authorization"] = "Bearer $token"
    } else {
        Write-Host "✗ 登录失败: $($loginResponse.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ 登录请求失败: $_" -ForegroundColor Red
    exit 1
}

# 2. 获取供应商列表
Write-Host "`n[2] 获取供应商列表..." -ForegroundColor Yellow
try {
    $suppliersResponse = Invoke-RestMethod -Uri "$baseUrl/suppliers?page=1&pageSize=1" -Method Get -Headers $headers
    if ($suppliersResponse.success -and $suppliersResponse.data.list.Count -gt 0) {
        $supplierId = $suppliersResponse.data.list[0].id
        Write-Host "✓ 找到供应商 ID: $supplierId" -ForegroundColor Green
    } else {
        Write-Host "✗ 未找到供应商，请先创建供应商" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ 获取供应商列表失败: $_" -ForegroundColor Red
    exit 1
}

# 3. 测试创建标签
Write-Host "`n[3] 测试创建标签..." -ForegroundColor Yellow
$tagBody = @{
    supplierId = $supplierId
    tagName = "测试标签"
    tagColor = "#3B82F6"
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/supplier-tags" -Method Post -Body $tagBody -Headers $headers -ContentType "application/json"
    if ($createResponse.success) {
        $tagId = $createResponse.data
        Write-Host "✓ 标签创建成功 ID: $tagId" -ForegroundColor Green
    } else {
        Write-Host "✗ 标签创建失败: $($createResponse.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ 创建标签请求失败: $_" -ForegroundColor Red
    exit 1
}

# 4. 测试获取标签列表
Write-Host "`n[4] 测试获取供应商标签列表..." -ForegroundColor Yellow
try {
    $tagsResponse = Invoke-RestMethod -Uri "$baseUrl/supplier-tags/supplier/$supplierId" -Method Get -Headers $headers
    if ($tagsResponse.success) {
        $tags = $tagsResponse.data
        Write-Host "✓ 获取标签列表成功，共 $($tags.Count) 个标签" -ForegroundColor Green
        $tags | ForEach-Object {
            Write-Host "  - $($_.tagName) (颜色: $($_.tagColor))" -ForegroundColor Cyan
        }
    } else {
        Write-Host "✗ 获取标签列表失败: $($tagsResponse.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ 获取标签列表请求失败: $_" -ForegroundColor Red
    exit 1
}

# 5. 测试批量创建标签
Write-Host "`n[5] 测试批量创建标签..." -ForegroundColor Yellow
$batchTags = @(
    @{ supplierId = $supplierId; tagName = "重要"; tagColor = "#EF4444" },
    @{ supplierId = $supplierId; tagName = "优先"; tagColor = "#22C55E" }
) | ConvertTo-Json

try {
    $batchResponse = Invoke-RestMethod -Uri "$baseUrl/supplier-tags/batch" -Method Post -Body $batchTags -Headers $headers -ContentType "application/json"
    if ($batchResponse.success) {
        Write-Host "✓ 批量标签创建成功" -ForegroundColor Green
    } else {
        Write-Host "✗ 批量标签创建失败: $($batchResponse.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ 批量创建标签请求失败: $_" -ForegroundColor Red
}

# 6. 再次获取标签列表
Write-Host "`n[6] 验证标签列表..." -ForegroundColor Yellow
try {
    $tagsResponse = Invoke-RestMethod -Uri "$baseUrl/supplier-tags/supplier/$supplierId" -Method Get -Headers $headers
    if ($tagsResponse.success) {
        $tags = $tagsResponse.data
        Write-Host "✓ 当前共有 $($tags.Count) 个标签" -ForegroundColor Green
        $tags | ForEach-Object {
            Write-Host "  - $($_.tagName) (ID: $($_.id), 颜色: $($_.tagColor))" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "✗ 获取标签列表失败: $_" -ForegroundColor Red
}

# 7. 测试删除标签
Write-Host "`n[7] 测试删除标签..." -ForegroundColor Yellow
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/supplier-tags/$tagId" -Method Delete -Headers $headers
    if ($deleteResponse.success) {
        Write-Host "✓ 标签删除成功" -ForegroundColor Green
    } else {
        Write-Host "✗ 标签删除失败: $($deleteResponse.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ 删除标签请求失败: $_" -ForegroundColor Red
}

Write-Host "`n=== 测试完成 ===" -ForegroundColor Cyan
