const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

// Let's use PowerShell to search within .docx and .pptx files in Downloads
// PowerShell has simple ways or we can unzip them.
// Let's run a PowerShell command instead, it's easier and faster!
