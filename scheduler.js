const { spawn } = require('child_process');
const path = require('path');

function getLocalTime() {
  return new Date();
}

function start() {
  const now = getLocalTime();
  console.log(`[Scheduler] Current system time (Lithuania time): ${now.toString()}`);
  
  // Set target to today at 6:00 AM
  const target = new Date(now);
  target.setHours(6, 0, 0, 0);
  
  // If it's already past 6:00 AM, set it for tomorrow at 6:00 AM
  if (now.getTime() >= target.getTime()) {
    console.log(`[Scheduler] Target time of 6:00 AM is already in the past. Scheduling for tomorrow.`);
    target.setDate(target.getDate() + 1);
  }
  
  const msToWait = target.getTime() - now.getTime();
  const hours = (msToWait / (1000 * 60 * 60)).toFixed(2);
  const minutes = (msToWait / (1000 * 60)).toFixed(1);
  
  console.log(`[Scheduler] Target time: ${target.toString()}`);
  console.log(`[Scheduler] Waiting for ${msToWait} ms (~${minutes} minutes / ${hours} hours) before starting...`);
  
  // Write a status log file that we can check
  fs_write_status(`Status: Waiting. Target: ${target.toString()}. Remaining: ${hours} hours.`);

  setTimeout(() => {
    console.log(`[Scheduler] It is 6:00 AM! Starting the email campaign...`);
    fs_write_status(`Status: Running campaign since ${new Date().toString()}`);
    
    // Spawn powershell to execute run_campaign_no_sleep.ps1
    const ps = spawn('powershell.exe', [
      '-ExecutionPolicy', 'Bypass',
      '-File', path.resolve(__dirname, 'run_campaign_no_sleep.ps1')
    ], { stdio: 'inherit', cwd: __dirname });
    
    ps.on('close', (code) => {
      console.log(`[Scheduler] Email sending process finished with code: ${code}`);
      fs_write_status(`Status: Finished. Code: ${code} at ${new Date().toString()}`);
    });
  }, msToWait);
}

function fs_write_status(msg) {
  try {
    const fs = require('fs');
    fs.writeFileSync(path.resolve(__dirname, 'scheduler_status.txt'), msg, 'utf8');
  } catch (err) {
    console.error("Failed to write status file:", err);
  }
}

start();
