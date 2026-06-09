$path = 'C:\Users\NaveenNew\habit-tracker-animated\src\components\ContactPage.jsx'
$content = Get-Content -LiteralPath $path -Raw
$crlf = "`r`n"
$old = "              <a href=""#"" className=""social-node"">${crlf}                <strong>YT</strong>${crlf}                <em>YouTube</em>${crlf}              </a>${crlf}            </div>"
$new = "              <a href=""#"" className=""social-node"">${crlf}                <strong>YT</strong>${crlf}                <em>YouTube</em>${crlf}              </a>${crlf}              <a href=""#"" className=""social-node"">${crlf}                <strong>FB</strong>${crlf}                <em>Facebook</em>${crlf}              </a>${crlf}            </div>"
$result = $content.Replace($old, $new)
Set-Content -LiteralPath $path -Value $result -NoNewline
