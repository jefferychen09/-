#
# Setup script for Tencent Survey MCP Skill (PowerShell version)
#
# Features:
#   1. Check if mcporter has tencent-survey configured (with valid Authorization)
#   2. If not configured or token invalid, display authorization URL
#   3. Poll and wait for user to complete authorization, auto-save token to mcporter
#   4. Friendly error messages for timeout, expired, and other error scenarios
#
# Usage (for AI Agent):
#   Step 1: Check status (returns immediately, non-blocking)
#     powershell -ExecutionPolicy Bypass -File setup.ps1 wj_check_and_start_auth
#     Output:
#       READY                  -> Service ready, proceed with user task
#       NONCE:<nonce>          -> nonce value (output before AUTH_REQUIRED)
#       AUTH_REQUIRED:<url>    -> Show auth link to user, then run step 2
#       ERROR:*                -> Report error to user
#
#   Step 2: Wait for authorization (only when AUTH_REQUIRED, blocks up to ~300s)
#     powershell -ExecutionPolicy Bypass -File setup.ps1 wj_wait_auth
#     Output:
#       TOKEN_READY:ok         -> Auth success, token saved, proceed with user task
#       AUTH_TIMEOUT           -> Tell user: auth timed out, please retry
#       ERROR:*                -> Report error to user
#

param(
    [Parameter(Position = 0)]
    [string]$Command
)

# -- Global Configuration --
$script:WJ_API_BASE = if ($env:WJ_API_BASE_URL) { $env:WJ_API_BASE_URL } else { "https://wj.qq.com" }
$script:WJ_AUTH_PAGE = if ($env:WJ_AUTH_PAGE_URL) { $env:WJ_AUTH_PAGE_URL } else { "https://wj.qq.com/oauth/authorize" }

# Extract extra query params from WJ_AUTH_PAGE_URL
$script:WJ_EXTRA_QUERY = ""
if ($script:WJ_AUTH_PAGE -match '\?(.+)$') {
    $script:WJ_EXTRA_QUERY = $Matches[1]
}

# Build API URLs
$script:WJ_MCP_URL = "$($script:WJ_API_BASE)/api/v2/mcp"
$script:WJ_TOKEN_POLL_URL = "$($script:WJ_API_BASE)/api/v2/account/tokens/device-auth/poll"
if ($script:WJ_EXTRA_QUERY) {
    $script:WJ_MCP_URL = "$($script:WJ_MCP_URL)?$($script:WJ_EXTRA_QUERY)"
    $script:WJ_TOKEN_POLL_URL = "$($script:WJ_TOKEN_POLL_URL)?$($script:WJ_EXTRA_QUERY)"
}
$script:WJ_SERVICE_NAME = "tencent-survey"

# Poll parameters: every 2s, max 150 times (~300s)
$script:WJ_POLL_INTERVAL = 2
$script:WJ_POLL_MAX = 150

# Temp directory
$script:WJ_TMP_DIR = Join-Path $env:TEMP ".wj_auth_$($env:USERNAME)"
if (-not (Test-Path $script:WJ_TMP_DIR)) {
    New-Item -ItemType Directory -Path $script:WJ_TMP_DIR -Force | Out-Null
}

$script:WJ_CODE_FILE = Join-Path $script:WJ_TMP_DIR "code"
$script:WJ_TOKEN_FILE = Join-Path $script:WJ_TMP_DIR "token"
$script:WJ_URL_FILE = Join-Path $script:WJ_TMP_DIR "url"
$script:WJ_NONCE_FILE = Join-Path $script:WJ_TMP_DIR "nonce"

# -- Safe Write Function (reject symlinks) --
function Write-SafeFile {
    param([string]$FilePath, [string]$Content)
    $item = Get-Item $FilePath -ErrorAction SilentlyContinue
    if ($item -and $item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
        Write-Error "ERROR:security - Symlink detected, refusing to write: $FilePath"
        return $false
    }
    Set-Content -Path $FilePath -Value $Content -NoNewline -Encoding UTF8
    return $true
}

# -- Cleanup Function --
function Clear-WjTemp {
    if (Test-Path $script:WJ_TMP_DIR) {
        Remove-Item -Recurse -Force $script:WJ_TMP_DIR -ErrorAction SilentlyContinue
    }
    New-Item -ItemType Directory -Path $script:WJ_TMP_DIR -Force | Out-Null
}

# -- Resolve mcporter invocation mode --
# Mode: "node" (call via node + JS entry), "direct" (call mcporter command directly), "" (not found)
$script:MCPORTER_MODE = ""
$script:MCPORTER_JS = ""

function Invoke-McPorter {
    # Call mcporter with fallback: prefer node+JS, fallback to direct command
    param([Parameter(ValueFromRemainingArguments)]$Args_)

    if ($script:MCPORTER_MODE -eq "node" -and $script:MCPORTER_JS) {
        # Preferred: call via node to avoid .ps1 shim PATH bug
        $argList = @($script:MCPORTER_JS) + $Args_
        & node @argList 2>$null
        return
    }

    if ($script:MCPORTER_MODE -eq "direct") {
        # Fallback: call mcporter command directly (may work if PATH is correct)
        & mcporter @Args_ 2>$null
        return
    }

    return $null
}

# -- Search common paths for mcporter cli.js --
function Find-McPorterJs {
    # Search common npm global install locations on Windows
    $candidates = @()

    # From npm prefix -g
    $npmPrefix = $null
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        $npmPrefix = (npm prefix -g 2>$null)
    }
    if ($npmPrefix) {
        $candidates += Join-Path $npmPrefix "node_modules\mcporter\dist\cli.js"
        $candidates += Join-Path $npmPrefix "lib\node_modules\mcporter\dist\cli.js"
    }

    # Common Windows paths
    $candidates += Join-Path $env:APPDATA "npm\node_modules\mcporter\dist\cli.js"
    if ($env:NVM_HOME) {
        # nvm-windows: current node version symlink
        $candidates += Join-Path $env:NVM_HOME "..\npm\node_modules\mcporter\dist\cli.js"
    }
    if ($env:LOCALAPPDATA) {
        $candidates += Join-Path $env:LOCALAPPDATA "npm\node_modules\mcporter\dist\cli.js"
    }
    # fnm / volta / nvm typical paths
    if ($env:FNM_MULTISHELL_PATH) {
        $candidates += Join-Path $env:FNM_MULTISHELL_PATH "node_modules\mcporter\dist\cli.js"
    }
    if ($env:VOLTA_HOME) {
        $candidates += Join-Path $env:VOLTA_HOME "tools\image\packages\mcporter\lib\node_modules\mcporter\dist\cli.js"
    }
    # User profile based
    $candidates += Join-Path $env:USERPROFILE "AppData\Roaming\npm\node_modules\mcporter\dist\cli.js"
    $candidates += Join-Path $env:USERPROFILE ".npm-global\lib\node_modules\mcporter\dist\cli.js"

    # From mcporter command shim location
    $cmd = Get-Command mcporter -ErrorAction SilentlyContinue
    if ($cmd) {
        $mcpDir = Split-Path $cmd.Source -Parent
        $candidates += Join-Path $mcpDir "node_modules\mcporter\dist\cli.js"
    }

    # Deduplicate and test
    $candidates | Select-Object -Unique | ForEach-Object {
        if (Test-Path $_) {
            return $_
        }
    }
    return $null
}

# -- Check if mcporter is installed (with graceful fallback) --
function Test-McPorter {
    # Strategy:
    #   1. Try to find mcporter JS entry for node invocation (preferred)
    #   2. Fall back to direct mcporter command
    #   3. If not found, install and retry
    #   4. Scan filesystem as last resort

    $hasNode = [bool](Get-Command node -ErrorAction SilentlyContinue)
    $hasNpm = [bool](Get-Command npm -ErrorAction SilentlyContinue)

    # Step 1: Try to find mcporter JS entry point (preferred mode)
    if ($hasNode) {
        $jsPath = Find-McPorterJs
        if ($jsPath) {
            $script:MCPORTER_JS = $jsPath
            $script:MCPORTER_MODE = "node"
            return $true
        }
    }

    # Step 2: Fallback - use mcporter command directly (works when .ps1 shim is fine)
    $cmd = Get-Command mcporter -ErrorAction SilentlyContinue
    if ($cmd) {
        try {
            $testOutput = & mcporter --version 2>$null
            if ($LASTEXITCODE -eq 0 -or $testOutput) {
                $script:MCPORTER_MODE = "direct"
                return $true
            }
        }
        catch {}

        # Direct call failed but command exists - still set direct mode as last resort
        $script:MCPORTER_MODE = "direct"
        return $true
    }

    # Step 3: mcporter not found, try to install
    if (-not $hasNpm) {
        Write-Output "ERROR:no_npm"
        return $false
    }
    if (-not $hasNode) {
        Write-Output "ERROR:no_node"
        return $false
    }

    Write-Host "WARNING: mcporter not found, installing..."
    npm install -g mcporter 2>&1 | Select-Object -Last 3

    # After install, try to find JS entry again
    $jsPath = Find-McPorterJs
    if ($jsPath) {
        $script:MCPORTER_JS = $jsPath
        $script:MCPORTER_MODE = "node"
        Write-Host "mcporter installed successfully (node mode)"
        return $true
    }

    # After install, try direct mode as fallback
    $cmd = Get-Command mcporter -ErrorAction SilentlyContinue
    if ($cmd) {
        $script:MCPORTER_MODE = "direct"
        Write-Host "mcporter installed successfully (direct mode)"
        return $true
    }

    Write-Output "ERROR:mcporter_not_found"
    return $false
}

# -- Check system dependencies --
# Note: jq is NOT required for PowerShell version (uses ConvertFrom-Json instead)
function Test-Dependencies {
    $missing = @()
    if (-not (Get-Command curl.exe -ErrorAction SilentlyContinue)) {
        # On Windows 10+, curl.exe is built-in; check explicitly for .exe to avoid PS alias
        $missing += "curl.exe (usually built-in on Windows 10+)"
    }
    if ($missing.Count -gt 0) {
        Write-Output "ERROR:missing_dependencies - Missing required dependencies: $($missing -join ', ')"
        return $false
    }
    return $true
}

# -- JSON field extraction --
function Get-JsonField {
    param([string]$Json, [string]$Key)
    try {
        $obj = $Json | ConvertFrom-Json -ErrorAction Stop
        $val = $obj.$Key
        if ($null -eq $val) { return "" }
        return [string]$val
    }
    catch { return "" }
}

function Get-JsonDataField {
    param([string]$Json, [string]$Key)
    try {
        $obj = $Json | ConvertFrom-Json -ErrorAction Stop
        $val = $obj.data.$Key
        if ($null -eq $val) { return "" }
        return [string]$val
    }
    catch { return "" }
}

# -- Locate mcporter.json config file --
function Get-McPorterConfigPath {
    # mcporter stores config at ~/.mcporter/mcporter.json (home scope)
    $candidates = @(
        (Join-Path $env:USERPROFILE ".mcporter\mcporter.json"),
        (Join-Path $env:HOME ".mcporter\mcporter.json"),
        (Join-Path $env:APPDATA "mcporter\mcporter.json")
    )
    foreach ($p in $candidates) {
        if ($p -and (Test-Path $p)) {
            return $p
        }
    }
    return $null
}

# -- Get current token by reading mcporter.json directly --
function Get-WjToken {
    # Method 1: Read mcporter.json file directly (no command needed)
    $configPath = Get-McPorterConfigPath
    if ($configPath) {
        try {
            $json = Get-Content $configPath -Raw -Encoding UTF8 | ConvertFrom-Json
            # mcporter.json structure: { "services": { "tencent-survey": { "headers": { "Authorization": "Bearer wjpt_xxx" } } } }
            $svc = $json.services.$($script:WJ_SERVICE_NAME)
            if ($svc -and $svc.headers -and $svc.headers.Authorization) {
                return $svc.headers.Authorization.Trim()
            }
            # Alternative structure: headers as array of "Key=Value"
            if ($svc -and $svc.headers -is [array]) {
                foreach ($h in $svc.headers) {
                    if ($h -match '(?i)^Authorization[=:]\s*(.+)$') {
                        return $Matches[1].Trim()
                    }
                }
            }
        }
        catch {}
    }

    # Method 2: Fallback to mcporter command
    try {
        $output = Invoke-McPorter config get $script:WJ_SERVICE_NAME
        if (-not $output) { return "" }
        $match = ($output | Select-String -Pattern '(?i)Authorization:\s*(.+)$')
        if ($match) {
            return $match.Matches[0].Groups[1].Value.Trim()
        }
        return ""
    }
    catch { return "" }
}

# -- Save token to mcporter config --
function Save-WjToken {
    param([string]$Token)
    if (-not $Token) { return $false }

    Invoke-McPorter config add $script:WJ_SERVICE_NAME $script:WJ_MCP_URL `
        --header "Authorization=Bearer $Token" `
        --transport http `
        --scope home | Out-Null

    # Verify by reading config file directly
    $savedToken = Get-WjToken
    if ($savedToken -match "Bearer") {
        return $true
    }
    return $false
}

# -- Check tencent-survey service status --
# Returns: 0 = ready, 1 = not registered, 2 = token empty
function Get-WjServiceStatus {
    # Method 1: Check mcporter.json directly (fastest, no command needed)
    $configPath = Get-McPorterConfigPath
    if ($configPath) {
        try {
            $json = Get-Content $configPath -Raw -Encoding UTF8 | ConvertFrom-Json
            $svc = $json.services.$($script:WJ_SERVICE_NAME)
            if ($svc) {
                $token = Get-WjToken
                if ($token) { return 0 }
                return 2
            }
        }
        catch {}
    }

    # Method 2: Fallback to mcporter command
    $listOutput = Invoke-McPorter list
    if (-not $listOutput -or -not ($listOutput -match $script:WJ_SERVICE_NAME)) {
        return 1
    }
    $token = Get-WjToken
    if (-not $token) {
        return 2
    }
    return 0
}

# -- Generate authorization URL --
function New-WjAuthUrl {
    $initUrl = "$($script:WJ_API_BASE)/api/v2/account/tokens/device-auth/init"
    if ($script:WJ_EXTRA_QUERY) {
        $initUrl = "$initUrl`?$($script:WJ_EXTRA_QUERY)"
    }

    try {
        $response = curl.exe -s -f -X POST $initUrl 2>$null
        if (-not $response) {
            Write-Output "ERROR:init_request_failed - Cannot connect to server $initUrl"
            return $null
        }
    }
    catch {
        Write-Output "ERROR:init_request_failed - Cannot connect to server $initUrl"
        return $null
    }

    $respCode = Get-JsonField -Json $response -Key "code"
    if ($respCode.ToUpper() -ne "OK") {
        Write-Output "ERROR:init_failed - Server returned error: $respCode"
        return $null
    }

    $code = Get-JsonDataField -Json $response -Key "code"
    $nonce = Get-JsonDataField -Json $response -Key "nonce"

    # Validate code format (hex, 16-64 chars)
    if ($code -notmatch '^[0-9a-f]{16,64}$') {
        Write-Output "ERROR:invalid_code - Server returned invalid code format: $code"
        return $null
    }
    if (-not $nonce) {
        Write-Output "ERROR:invalid_nonce - Server did not return nonce"
        return $null
    }

    Write-SafeFile -FilePath $script:WJ_CODE_FILE -Content $code | Out-Null
    Write-SafeFile -FilePath $script:WJ_NONCE_FILE -Content $nonce | Out-Null

    # Build auth URL
    $sep = "?"
    if ($script:WJ_AUTH_PAGE -match '\?') { $sep = "&" }
    return "$($script:WJ_AUTH_PAGE)${sep}code=${code}&nonce=${nonce}"
}

# -- Poll for token --
function Wait-WjToken {
    param([string]$Prefix = "...")

    if (-not (Test-Path $script:WJ_CODE_FILE)) {
        Write-Output "ERROR:no_code - Authorization code not found, please run wj_check_and_start_auth first"
        return $null
    }

    $code = Get-Content $script:WJ_CODE_FILE -Raw
    $code = $code.Trim()
    if (-not $code) {
        Write-Output "ERROR:empty_code - Authorization code is empty"
        return $null
    }

    $pollSep = "?"
    if ($script:WJ_TOKEN_POLL_URL -match '\?') { $pollSep = "&" }
    $url = "$($script:WJ_TOKEN_POLL_URL)${pollSep}code=${code}"

    for ($i = 1; $i -le $script:WJ_POLL_MAX; $i++) {
        Start-Sleep -Seconds $script:WJ_POLL_INTERVAL

        try {
            $response = curl.exe -s -f -L $url 2>$null
            if (-not $response) {
                Write-Host "  $Prefix [$i/$($script:WJ_POLL_MAX)] curl request failed"
                continue
            }
        }
        catch {
            Write-Host "  $Prefix [$i/$($script:WJ_POLL_MAX)] curl request failed"
            continue
        }

        $respCode = Get-JsonField -Json $response -Key "code"
        if ($respCode.ToUpper() -ne "OK" -and $respCode) {
            Write-Host "  $Prefix [$i/$($script:WJ_POLL_MAX)] resp_code=$respCode (not Ok)"
            continue
        }

        $status = Get-JsonDataField -Json $response -Key "status"
        $token = Get-JsonDataField -Json $response -Key "token"

        switch ($status) {
            "completed" {
                Write-Host "  $Prefix [$i/$($script:WJ_POLL_MAX)] status=completed"
                if ($token) {
                    return "TOKEN_READY:$token"
                }
                Write-Host "  $Prefix [$i/$($script:WJ_POLL_MAX)] status=completed but token is empty"
                return "ERROR:empty_token"
            }
            "pending" {
                Write-Host "  $Prefix [$i/$($script:WJ_POLL_MAX)] status=pending"
                continue
            }
            default {
                Write-Host "  $Prefix [$i/$($script:WJ_POLL_MAX)] status=$status (unknown)"
                continue
            }
        }
    }

    return "AUTH_TIMEOUT"
}

# -- Main Entry A: Check status / generate auth link (non-blocking) --
function Invoke-WjCheckAndStartAuth {
    if (-not (Test-McPorter)) {
        Write-Output "ERROR:mcporter_not_found - Please install Node.js and npm first"
        return
    }

    if (-not (Test-Dependencies)) { return }

    # Only check mcporter config, no env var fallback
    $status = Get-WjServiceStatus

    if ($status -eq 0) {
        Write-Output "READY"
        return
    }

    # No valid config found, start OAuth flow
    Clear-WjTemp
    $authUrl = New-WjAuthUrl
    if (-not $authUrl) { return }

    Write-SafeFile -FilePath $script:WJ_URL_FILE -Content $authUrl | Out-Null

    # Output nonce if available
    if (Test-Path $script:WJ_NONCE_FILE) {
        $nonce = (Get-Content $script:WJ_NONCE_FILE -Raw).Trim()
        if ($nonce) {
            Write-Output "NONCE:$nonce"
        }
    }

    Write-Output "AUTH_REQUIRED:$authUrl"
}

# -- Main Entry B: Wait for authorization (blocking, up to ~300s) --
function Invoke-WjWaitAuth {
    $result = Wait-WjToken -Prefix "waiting"

    switch -Wildcard ($result) {
        "TOKEN_READY:*" {
            $token = $result.Substring("TOKEN_READY:".Length)
            if (Save-WjToken -Token $token) {
                Clear-WjTemp
                Write-Output "TOKEN_READY:ok"
            }
            else {
                Clear-WjTemp
                Write-Output "ERROR:save_token_failed"
            }
        }
        "AUTH_TIMEOUT" {
            Clear-WjTemp
            Write-Output "AUTH_TIMEOUT"
        }
        "ERROR:empty_token*" {
            Clear-WjTemp
            Write-Output "ERROR:empty_token - Authorization error, token is empty"
        }
        "ERROR:*" {
            Clear-WjTemp
            Write-Output $result
        }
    }
}

# -- Script Entry Point --
switch ($Command) {
    "wj_check_and_start_auth" {
        Invoke-WjCheckAndStartAuth
    }
    "wj_wait_auth" {
        Invoke-WjWaitAuth
    }
    "setup" {
        Write-Host ""
        Write-Host "Tencent Survey MCP Skill Setup Wizard"
        Write-Host "======================================"
        Write-Host ""

        Write-Host "Checking mcporter..."
        if (-not (Test-McPorter)) {
            Write-Host "ERROR: mcporter installation failed. Please install Node.js (https://nodejs.org) first."
            exit 1
        }
        Write-Host "mcporter is ready"
        Write-Host ""

        Write-Host "Checking dependencies..."
        if (-not (Test-Dependencies)) {
            Write-Host "ERROR: Missing required dependencies"
            exit 1
        }
        Write-Host "Dependencies are ready"
        Write-Host ""

        Write-Host "Checking tencent-survey service..."
        $svcStatus = Get-WjServiceStatus

        if ($svcStatus -eq 0) {
            Write-Host "tencent-survey service is configured and running!"
            Write-Host ""
            Write-Host "Usage:"
            Write-Host "  mcporter call tencent-survey.get_survey --args '{`"survey_id`": 12345}'"
            exit 0
        }

        Write-Host "Token not configured, authorization required..."
        Write-Host ""

        Clear-WjTemp
        $authUrl = New-WjAuthUrl
        if (-not $authUrl) {
            Write-Host "ERROR: Failed to generate authorization URL"
            exit 1
        }

        $nonce = ""
        if (Test-Path $script:WJ_NONCE_FILE) {
            $nonce = (Get-Content $script:WJ_NONCE_FILE -Raw).Trim()
        }

        Write-Host "Please open the following URL in your browser to authorize:"
        Write-Host ""
        Write-Host "  $authUrl"
        Write-Host ""
        if ($nonce) {
            Write-Host "  Nonce: $nonce"
            Write-Host ""
        }
        Write-Host "Use QQ or WeChat to scan/login for authorization"
        Write-Host ""
        Write-Host "Waiting for authorization (max $($script:WJ_POLL_MAX * $script:WJ_POLL_INTERVAL)s)..."
        Write-Host ""

        $result = Wait-WjToken -Prefix "polling"

        switch -Wildcard ($result) {
            "TOKEN_READY:*" {
                $token = $result.Substring("TOKEN_READY:".Length)
                Write-Host ""
                Write-Host "Authorization successful! Saving configuration..."
                if (Save-WjToken -Token $token) {
                    Clear-WjTemp
                    Write-Host "Token saved to mcporter config"
                    Write-Host ""
                    Write-Host "Setup complete! You can now use Tencent Survey features."
                    Write-Host ""
                    Write-Host "Usage:"
                    Write-Host "  mcporter call $($script:WJ_SERVICE_NAME).get_survey --args '{`"survey_id`": 12345}'"
                    Write-Host ""
                    Write-Host "Homepage: $($script:WJ_API_BASE)"
                }
                else {
                    Write-Host "WARNING: Failed to save token to mcporter config"
                    Write-Host "Please run manually:"
                    Write-Host "  mcporter config add $($script:WJ_SERVICE_NAME) $($script:WJ_MCP_URL) --header `"Authorization=Bearer $token`" --transport http --scope home"
                }
            }
            "AUTH_TIMEOUT" {
                Write-Host ""
                Write-Host "Authorization timed out. Please re-run: .\setup.ps1 setup"
                exit 1
            }
            "ERROR:*" {
                Write-Host ""
                Write-Host "Authorization failed: $result"
                exit 1
            }
        }
    }
    default {
        Write-Host "Usage:"
        Write-Host "  .\setup.ps1 wj_check_and_start_auth   # Step 1: Check status / generate auth link"
        Write-Host "  .\setup.ps1 wj_wait_auth              # Step 2: Wait for authorization"
        Write-Host "  .\setup.ps1 setup                     # Interactive setup wizard"
    }
}
