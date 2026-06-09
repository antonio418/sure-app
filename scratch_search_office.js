const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function searchOfficeFiles() {
  const downloadsDir = 'C:\\Users\\anton_mn7up\\Downloads';
  const files = fs.readdirSync(downloadsDir).filter(f => f.endsWith('.docx') || f.endsWith('.pptx'));
  
  console.log(`Checking ${files.length} Office files for "cruzada"...`);
  
  for (const file of files) {
    const filePath = path.join(downloadsDir, file);
    // Escape single quotes for PowerShell
    const psPath = filePath.replace(/'/g, "''");
    
    let psCommand = '';
    if (file.endsWith('.docx')) {
      psCommand = `
        $word = New-Object -ComObject Word.Application
        $word.Visible = $false
        $doc = $word.Documents.Open('${psPath}', $false, $true)
        $text = $doc.Content.Text
        $doc.Close()
        $word.Quit()
        if ($text -like '*cruzada*') { Write-Output "MATCH" }
      `;
    } else if (file.endsWith('.pptx')) {
      psCommand = `
        $ppt = New-Object -ComObject PowerPoint.Application
        $pres = $ppt.Presentations.Open('${psPath}', [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
        $match = $false
        foreach ($slide in $pres.Slides) {
            foreach ($shape in $slide.Shapes) {
                if ($shape.HasTextFrame -and $shape.TextFrame.HasText) {
                    if ($shape.TextFrame.TextRange.Text -like '*cruzada*') {
                        $match = $true
                    }
                }
            }
        }
        $pres.Close()
        $ppt.Quit()
        if ($match) { Write-Output "MATCH" }
      `;
    }
    
    try {
      const output = execSync(`powershell -Command "${psCommand.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' }).trim();
      if (output.includes('MATCH')) {
        console.log(`🎯 FOUND MATCH IN: ${file}`);
      }
    } catch (err) {
      // Ignore errors (e.g. PowerPoint/Word not openable)
    }
  }
  console.log("Office search complete.");
}

searchOfficeFiles();
