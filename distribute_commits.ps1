# PowerShell script to distribute files across 20 commits
# with dates from 01.04.2025 to 31.07.2025

# Get list of all files to commit (excluding gitignore)
$files = git ls-files --others --exclude-standard
$modifiedFiles = git diff --name-only

# Combine file lists
$allFiles = @()
$allFiles += $files
$allFiles += $modifiedFiles
$allFiles = $allFiles | Sort-Object | Get-Unique

Write-Host "Total files to commit: $($allFiles.Count)"

# Create array of dates from 01.04.2025 to 31.07.2025 (20 dates)
$startDate = Get-Date "2025-04-01"
$endDate = Get-Date "2025-07-31"
$totalDays = ($endDate - $startDate).Days
$dateInterval = [math]::Floor($totalDays / 19) # 19 intervals for 20 dates

$commitDates = @()
for ($i = 0; $i -lt 20; $i++) {
    $commitDate = $startDate.AddDays($i * $dateInterval)
    $commitDates += $commitDate.ToString("yyyy-MM-dd")
}

Write-Host "Commit dates:"
$commitDates | ForEach-Object { Write-Host $_ }

# Divide files into 20 groups
$filesPerCommit = [math]::Ceiling($allFiles.Count / 20)
Write-Host "Files per commit: $filesPerCommit"

# Create commits
for ($i = 0; $i -lt 20; $i++) {
    $startIndex = $i * $filesPerCommit
    $endIndex = [math]::Min(($i + 1) * $filesPerCommit - 1, $allFiles.Count - 1)
    
    if ($startIndex -ge $allFiles.Count) {
        break
    }
    
    $commitFiles = $allFiles[$startIndex..$endIndex]
    $commitDate = $commitDates[$i]
    
    Write-Host ""
    Write-Host "Commit $($i + 1) ($commitDate):"
    Write-Host "Files: $($commitFiles.Count)"
    
    # Add files to staging area
    foreach ($file in $commitFiles) {
        if (Test-Path $file) {
            git add $file
            Write-Host "  + $file"
        }
    }
    
    # Create commit with specified date
    $commitMessage = "feat: add project files (commit $($i + 1)/20)"
    $env:GIT_COMMITTER_DATE = "$commitDate 12:00:00"
    $env:GIT_AUTHOR_DATE = "$commitDate 12:00:00"
    
    git commit -m $commitMessage
    
    Write-Host "Commit created: $commitMessage"
}

Write-Host ""
Write-Host "All commits created. Pushing to remote repository..."
git push origin main

Write-Host "Done! Project pushed to remote repository with 20 commits."
