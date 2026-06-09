$file = 'src\components\CoachPage.jsx'
$content = Get-Content $file -Raw

# Fix the broken line - remove the literal backtick-n between the two useState lines
$content = $content -replace "useState\(null\);``n  const \[showMobileSidebar, setShowMobileSidebar\] = useState\(false\);", "useState(null);`n  const [showMobileSidebar, setShowMobileSidebar] = useState(false);"

Set-Content $file $content -NoNewline
Write-Host "Fixed"
