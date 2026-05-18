import os

dir_path = os.path.join("public", "presentacion")
os.makedirs(dir_path, exist_ok=True)

slides = [
r'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SURE Ecosystem - Autonomous B2B Sales</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; overflow: hidden; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
    .slide-container { width: 1280px; height: 720px; position: relative; overflow: hidden; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); transform-origin: center center; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
    .grid-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px); background-size: 40px 40px; z-index: 1; }
    .floating-particles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }
    .particle { position: absolute; width: 4px; height: 4px; background: rgba(59, 130, 246, 0.4); border-radius: 50%; animation: float 15s infinite linear; }
    @keyframes float { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-100vh) translateX(100px); opacity: 0; } }
    .main-content { position: relative; z-index: 10; width: 100%; height: 100%; display: flex; flex-direction: column; padding: 60px 80px; }
    .logo-container { display: flex; align-items: center; gap: 16px; margin-bottom: 40px; }
    .logo-icon { width: 52px; height: 52px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 26px; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3); }
    .logo-text { font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .hero-section { display: flex; align-items: flex-start; justify-content: space-between; flex: 1; }
    .left-content { flex: 1; max-width: 580px; }
    .title { font-size: 64px; font-weight: 800; color: white; line-height: 1.05; margin-bottom: 24px; letter-spacing: -1.5px; }
    .title .highlight { color: #3b82f6; }
    .subtitle { font-size: 19px; color: #94a3b8; margin-bottom: 32px; line-height: 1.6; }
    .features { display: flex; gap: 12px; margin-bottom: 32px; }
    .feature-item { display: flex; flex-direction: column; gap: 8px; padding: 16px; background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; color: #e2e8f0; font-size: 14px; font-weight: 600; width: 130px; }
    .feature-icon { color: #3b82f6; font-size: 16px; }
    .cta-button { display: inline-flex; align-items: center; gap: 12px; padding: 16px 32px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border: none; border-radius: 12px; color: white; font-size: 18px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); margin-bottom: 40px; }
    .right-visual { flex: 1; display: flex; align-items: center; justify-content: center; margin-top: -20px; }
    .robot-container { position: relative; width: 440px; height: 440px; }
    .robot-avatar { width: 100%; height: 100%; background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0) 70%); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(59, 130, 246, 0.2); }
    .robot-face { font-size: 200px; color: #3b82f6; filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.6)); }
    .control-panel { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); width: 320px; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 16px; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6); z-index: 25; }
    .panel-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .panel-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
    .panel-value { font-size: 16px; font-weight: 800; color: #3b82f6; }
    .status-indicator { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e; }
    .floating-icons { position: absolute; top: 60px; right: 10px; display: flex; flex-direction: column; gap: 16px; }
    .floating-icon { width: 48px; height: 48px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
    .bottom-bar { position: absolute; bottom: 0; left: 0; width: 100%; height: 8px; background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%); }
    .stats-bar { display: flex; gap: 64px; padding-top: 32px; border-top: 1px solid rgba(59, 130, 246, 0.2); width: 100%; margin-top: auto; }
    .stat-item { display: flex; flex-direction: column; gap: 4px; }
    .stat-value { font-size: 32px; font-weight: 800; color: white; }
    .stat-label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; }
</style>
</head>
<body>
<div class="slide-container" id="slide-container">
<div class="grid-bg"></div>
<div class="floating-particles" id="particles"></div>
<div class="main-content">
<div class="logo-container">
<div class="logo-icon"><i class="fas fa-robot"></i></div>
<div class="logo-text">SURE</div>
</div>
<div class="hero-section">
<div class="left-content">
<h1 class="title">SURE <span class="highlight">Ecosystem</span>:<br/>Autonomous B2B Sales</h1>
<p class="subtitle">How to capture, educate, and convert corporate clients on autopilot. Our AI-powered system finds prospects, communicates with them, and resolves DNS issues without human intervention.</p>
<div class="features">
<div class="feature-item"><i class="fas fa-check-circle feature-icon"></i><span>100% Autonomous</span></div>
<div class="feature-item"><i class="fas fa-bolt feature-icon"></i><span>Zero Manual Effort</span></div>
<div class="feature-item"><i class="fas fa-infinity feature-icon"></i><span>Infinite Scale</span></div>
</div>
<button class="cta-button"><span>Explore the Ecosystem</span><i class="fas fa-arrow-right"></i></button>
<div class="stats-bar">
<div class="stat-item"><div class="stat-value">$0</div><div class="stat-label">Operating Cost</div></div>
<div class="stat-item"><div class="stat-value">24/7</div><div class="stat-label">AI Monitoring</div></div>
<div class="stat-item"><div class="stat-value">100%</div><div class="stat-label">Automation</div></div>
</div>
</div>
<div class="right-visual">
<div class="robot-container">
<div class="robot-avatar"><div class="robot-face"><i class="fas fa-robot"></i></div></div>
<div class="control-panel">
<div class="panel-item"><div class="panel-label">Status</div><div class="panel-value" style="display: flex; align-items: center; gap: 8px;"><div class="status-indicator"></div><span>Active</span></div></div>
<div class="panel-item"><div class="panel-label">Leads</div><div class="panel-value">2,847</div></div>
<div class="panel-item"><div class="panel-label">Conv. Rate</div><div class="panel-value">18%</div></div>
</div>
<div class="floating-icons">
<div class="floating-icon"><i class="fas fa-envelope"></i></div>
<div class="floating-icon"><i class="fas fa-globe"></i></div>
<div class="floating-icon"><i class="fas fa-shield-alt"></i></div>
</div>
</div>
</div>
</div>
</div>
<div class="bottom-bar"></div>
</div>
<script>
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
</script>
NAV_SCRIPT
</body>
</html>''',

# Slide 2
r'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Paso 1: Cazando Oportunidades</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
    body { margin: 0; padding: 0; overflow: hidden; background: #0f172a; font-family: 'Open Sans', sans-serif; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
    p { margin: 0; }
    .slide-container { width: 1280px; height: 720px; position: relative; overflow: hidden; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); transform-origin: center center; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
    @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.6; } 100% { transform: scale(1); opacity: 1; } }
</style>
</head>
<body>
<div class="slide-container" id="slide-container">
<div data-object="true" data-object-type="shape" style="position: absolute; top: 0; left: 0; width: 1280px; height: 720px; background-image: linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px); background-size: 40px 40px; z-index: 1;"></div>
<div data-object="true" data-object-type="shape" style="position: absolute; top: 714px; left: 0; width: 1280px; height: 6px; background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%); z-index: 1;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 80px; top: 50px; width: 1120px; z-index: 10;">
<p style="font-family: 'Montserrat', sans-serif; display: flex; align-items: center; gap: 16px;">
<span style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 700; display: inline-block; flex-shrink: 0;">PASO 1</span>
<span style="font-size: 42px; font-weight: 800; color: white; letter-spacing: -0.5px;">1. Cazando Oportunidades en la Web</span>
</p>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 80px; top: 130px; width: 620px; z-index: 10;">
<p style="font-size: 16px; color: #94a3b8; font-style: italic; line-height: 1.6; border-left: 4px solid #3b82f6; padding-left: 16px; background: rgba(59,130,246,0.05); padding-top: 16px; padding-bottom: 16px; padding-right: 16px; border-radius: 0 8px 8px 0;">
<span style="color: #60a5fa; font-weight: 600;"><i class="fas fa-microphone-alt"></i> Voz en off:</span> "Todo comienza con el Agente Alfredo. Él rastrea la web 24/7, identifica empresas que están perdiendo dinero por correos rebotados y extrae la información de contacto de sus directivos."
        </p>
</div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 80px; top: 270px; width: 620px; height: 410px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); z-index: 1;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 300px; width: 556px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 20px;">
<div style="width: 72px; height: 72px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; flex-shrink: 0;">
<i class="fas fa-robot"></i>
</div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 700; color: white; margin-bottom: 4px;">Agente Alfredo</p>
<p style="font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Nuestra IA de Prospección</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 400px; width: 556px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 16px; padding: 14px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-search"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Escaneo Continuo</p>
<p style="font-size: 14px; color: #94a3b8; line-height: 1.4;">Escanea internet de forma proactiva buscando perfiles de directores y CEOs.</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 485px; width: 556px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 16px; padding: 14px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-shield-alt"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Extracción y Evaluación</p>
<p style="font-size: 14px; color: #94a3b8; line-height: 1.4;">Extrae correos, dominios y evalúa si la empresa sufre de "Spoofing" o correos rebotados.</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 570px; width: 556px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 16px; padding: 14px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-database"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Inyección Automática</p>
<p style="font-size: 14px; color: #94a3b8; line-height: 1.4;">Inyecta automáticamente a los prospectos aprobados en nuestra base de datos.</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 800px; top: 100px; width: 400px; height: 400px; z-index: 5;">
<div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
<div style="position: absolute; width: 380px; height: 380px; border: 2px solid rgba(59, 130, 246, 0.2); border-radius: 50%;"></div>
<div style="position: absolute; width: 260px; height: 260px; border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 50%;"></div>
<div style="position: absolute; width: 140px; height: 140px; border: 2px solid rgba(59, 130, 246, 0.4); border-radius: 50%;"></div>
<div style="position: absolute; width: 20px; height: 20px; background: rgba(59, 130, 246, 0.8); border-radius: 50%; box-shadow: 0 0 15px #3b82f6;"></div>
<div style="position: absolute; width: 190px; height: 2px; background: linear-gradient(90deg, #3b82f6 0%, transparent 100%); transform-origin: left center; left: 50%; top: 50%; animation: rotate 6s linear infinite;"></div>
<div style="position: absolute; top: 25%; left: 70%; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: #0f172a; border-radius: 50%; border: 1px solid #3b82f6; color: #60a5fa; font-size: 14px; animation: pulse 2s infinite;"><i class="fab fa-linkedin-in"></i></div>
<div style="position: absolute; top: 65%; left: 30%; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: #0f172a; border-radius: 50%; border: 1px solid #3b82f6; color: #60a5fa; font-size: 14px; animation: pulse 2.5s infinite; animation-delay: 0.5s;"><i class="fas fa-building"></i></div>
<div style="position: absolute; top: 48%; left: 80%; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: #0f172a; border-radius: 50%; border: 1px solid #3b82f6; color: #60a5fa; font-size: 14px; animation: pulse 3s infinite; animation-delay: 1s;"><i class="fab fa-linkedin-in"></i></div>
<div style="position: absolute; top: 20%; left: 35%; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: #0f172a; border-radius: 50%; border: 1px solid #3b82f6; color: #60a5fa; font-size: 14px; animation: pulse 2s infinite; animation-delay: 1.5s;"><i class="fas fa-envelope"></i></div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 840px; top: 510px; width: 320px; z-index: 10;">
<div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
<p style="font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 700; color: white;">Prospectos Identificados</p>
</div>
<div style="display: flex; flex-direction: column; gap: 14px;">
<div style="display: flex; align-items: center; gap: 12px;"><div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div><p style="font-size: 14px; color: #cbd5e1;">Perfiles LinkedIn Analizados</p></div>
<div style="display: flex; align-items: center; gap: 12px;"><div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div><p style="font-size: 14px; color: #cbd5e1;">Dominios Evaluados (Spoofing)</p></div>
<div style="display: flex; align-items: center; gap: 12px;"><div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div><p style="font-size: 14px; color: #cbd5e1;">Correos Extraídos</p></div>
</div>
</div>
</div>
</div>
NAV_SCRIPT
</body>
</html>''',

# Slide 3
r'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Paso 2: Contacto Inteligente y Secuencial</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
    body { margin: 0; padding: 0; overflow: hidden; background: #0f172a; font-family: 'Open Sans', sans-serif; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
    p { margin: 0; }
    .slide-container { width: 1280px; height: 720px; position: relative; overflow: hidden; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); transform-origin: center center; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
</style>
</head>
<body>
<div class="slide-container" id="slide-container">
<div data-object="true" data-object-type="shape" style="position: absolute; top: 0; left: 0; width: 1280px; height: 720px; background-image: linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px); background-size: 40px 40px; z-index: 1;"></div>
<div data-object="true" data-object-type="shape" style="position: absolute; top: 714px; left: 0; width: 1280px; height: 6px; background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%); z-index: 1;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 80px; top: 50px; width: 1120px; height: 63px; z-index: 10;">
<p style="font-family: 'Montserrat', sans-serif; display: flex; align-items: center; gap: 16px;">
<span style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 700; display: inline-block; flex-shrink: 0;">PASO 2</span>
<span style="font-size: 42px; font-weight: 800; color: white; letter-spacing: -0.5px;">2. Contacto Inteligente y Secuencial</span>
</p>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 80px; top: 130px; width: 620px; height: 105px; z-index: 10;">
<p style="font-size: 16px; color: #94a3b8; font-style: italic; line-height: 1.5; border-left: 4px solid #3b82f6; padding-left: 16px; background: rgba(59,130,246,0.05); padding-top: 12px; padding-bottom: 12px; padding-right: 16px; border-radius: 0 8px 8px 0;">
<span style="color: #60a5fa; font-weight: 600;"><i class="fas fa-microphone-alt"></i> Voz en off:</span> "Una vez capturado el prospecto, nuestro Motor de Goteo toma el control. Envía correos personalizados y estratégicamente espaciados en el tiempo para convencer al cliente de que su dominio está en peligro."
        </p>
</div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 80px; top: 250px; width: 620px; height: 430px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); z-index: 1;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 280px; width: 556px; height: 80px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 20px;">
<div style="width: 72px; height: 72px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; flex-shrink: 0;"><i class="fas fa-envelope-open-text"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 700; color: white; margin-bottom: 4px;">Motor de Goteo</p>
<p style="font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Sistema de Contacto Secuencial</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 375px; width: 556px; height: 80px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 16px; padding: 12px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-clock"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Cron Job en la Nube</p>
<p style="font-size: 13px; color: #94a3b8; line-height: 1.3;">Despierta la plataforma cada 5 minutos para verificar nuevos prospectos.</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 465px; width: 556px; height: 80px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 16px; padding: 12px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-envelope"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Primer Correo de Advertencia</p>
<p style="font-size: 13px; color: #94a3b8; line-height: 1.3;">Envía primer correo advirtiendo del problema de seguridad del dominio.</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 555px; width: 556px; height: 80px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 16px; padding: 12px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-redo"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Seguimiento Automático</p>
<p style="font-size: 13px; color: #94a3b8; line-height: 1.3;">Correos de seguimiento a los 3 y 7 días si no hay respuesta.</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 750px; top: 250px; width: 450px; height: 430px; z-index: 5;">
<div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
<div style="position: absolute; left: 0; top: 0; width: 110px; height: 110px; background: rgba(15, 23, 42, 0.9); border: 2px solid #3b82f6; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);">
<div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; margin-bottom: 4px;"><i class="fas fa-envelope"></i></div>
<p style="font-size: 11px; color: white; font-weight: 600; text-align: center;">Día 0<br/><span style="color: #94a3b8; font-size: 10px;">Contacto inicial</span></p>
</div>
<div style="position: absolute; left: 110px; top: 55px; width: 40px; height: 2px; background: rgba(59, 130, 246, 0.5);">
<div style="position: absolute; right: -6px; top: -4px; width: 0; height: 0; border-left: 8px solid #3b82f6; border-top: 4px solid transparent; border-bottom: 4px solid transparent;"></div>
</div>
<div style="position: absolute; left: 115px; top: 45px; width: 30px; height: 30px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); display: flex; align-items: center; justify-content: center;"><span style="font-size: 9px; color: #3b82f6;">5m</span></div>
<div style="position: absolute; left: 150px; top: 0; width: 110px; height: 110px; background: rgba(15, 23, 42, 0.9); border: 2px solid #3b82f6; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);">
<div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; margin-bottom: 4px;"><i class="fas fa-envelope-open"></i></div>
<p style="font-size: 11px; color: white; font-weight: 600; text-align: center;">Día 3<br/><span style="color: #94a3b8; font-size: 10px;">Seguimiento</span></p>
</div>
<div style="position: absolute; left: 260px; top: 55px; width: 40px; height: 2px; background: rgba(59, 130, 246, 0.5);">
<div style="position: absolute; right: -6px; top: -4px; width: 0; height: 0; border-left: 8px solid #3b82f6; border-top: 4px solid transparent; border-bottom: 4px solid transparent;"></div>
</div>
<div style="position: absolute; left: 265px; top: 45px; width: 30px; height: 30px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); display: flex; align-items: center; justify-content: center;"><span style="font-size: 9px; color: #3b82f6;">3d</span></div>
<div style="position: absolute; left: 300px; top: 0; width: 110px; height: 110px; background: rgba(15, 23, 42, 0.9); border: 2px solid #3b82f6; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);">
<div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; margin-bottom: 4px;"><i class="fas fa-envelope-open-text"></i></div>
<p style="font-size: 11px; color: white; font-weight: 600; text-align: center;">Día 7<br/><span style="color: #94a3b8; font-size: 10px;">Final</span></p>
</div>
<div style="position: absolute; bottom: 80px; left: 0; right: 0; display: flex; justify-content: space-between; padding: 0 20px;">
<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 10px; height: 10px; background: #3b82f6; border-radius: 50%;"></div><span style="font-size: 12px; color: #94a3b8;">Inicio</span></div>
<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 10px; height: 10px; background: #3b82f6; border-radius: 50%;"></div><span style="font-size: 12px; color: #94a3b8;">Seguimiento</span></div>
<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 10px; height: 10px; background: #3b82f6; border-radius: 50%;"></div><span style="font-size: 12px; color: #94a3b8;">Final</span></div>
</div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 750px; top: 680px; width: 450px; height: 20px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 20px;">
<div style="flex: 1; display: flex; align-items: center; gap: 8px;"><div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div><span style="font-size: 12px; color: #94a3b8;">Texto generado por IA (Gemini)</span></div>
<div style="flex: 1; display: flex; align-items: center; gap: 8px;"><div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div><span style="font-size: 12px; color: #94a3b8;">Personalización automática</span></div>
</div>
</div>
</div>
NAV_SCRIPT
</body>
</html>''',

# Slide 4
r'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Paso 3: La Página de Aterrizaje Multilingüe</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
    body { margin: 0; padding: 0; overflow: hidden; background: #0f172a; font-family: 'Open Sans', sans-serif; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
    p { margin: 0; }
    .slide-container { width: 1280px; height: 720px; position: relative; overflow: hidden; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); transform-origin: center center; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
</style>
</head>
<body>
<div class="slide-container" id="slide-container">
<div data-object="true" data-object-type="shape" style="position: absolute; top: 0; left: 0; width: 1280px; height: 720px; background-image: linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px); background-size: 40px 40px; z-index: 1;"></div>
<div data-object="true" data-object-type="shape" style="position: absolute; top: 714px; left: 0; width: 1280px; height: 6px; background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%); z-index: 1;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 80px; top: 50px; width: 1120px; height: 60px; z-index: 10;">
<p style="font-family: 'Montserrat', sans-serif; display: flex; align-items: center; gap: 16px;">
<span style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 700; display: inline-block; flex-shrink: 0;">PASO 3</span>
<span style="font-size: 42px; font-weight: 800; color: white; letter-spacing: -0.5px;">3. La Página de Aterrizaje Multilingüe</span>
</p>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 80px; top: 130px; width: 620px; height: 90px; z-index: 10;">
<p style="font-size: 16px; color: #94a3b8; font-style: italic; line-height: 1.5; border-left: 4px solid #3b82f6; padding-left: 16px; background: rgba(59,130,246,0.05); padding-top: 12px; padding-bottom: 12px; padding-right: 16px; border-radius: 0 8px 8px 0;">
<span style="color: #60a5fa; font-weight: 600;"><i class="fas fa-microphone-alt"></i> Voz en off:</span> "Cuando el cliente hace clic, llega a nuestra plataforma de ventas en su idioma nativo. Aquí comprende el riesgo y procede a pagar un ticket de $15 dólares a través de Stripe para solucionar su problema."
</p>
</div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 80px; top: 250px; width: 620px; height: 425px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); z-index: 1;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 275px; width: 556px; height: 380px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
<div style="width: 72px; height: 72px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; flex-shrink: 0;"><i class="fas fa-globe"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 700; color: white; margin-bottom: 4px;">Landing Page Multilingüe</p>
<p style="font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">9 idiomas disponibles</p>
</div>
</div>
<div style="display: flex; align-items: center; gap: 16px; padding: 10px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1); margin-bottom: 10px;">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-mouse-pointer"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Clic → Landing Page</p>
<p style="font-size: 14px; color: #94a3b8; line-height: 1.25;">El prospecto hace clic en el correo y llega a nuestra página de ventas.</p>
</div>
</div>
<div style="display: flex; align-items: center; gap: 16px; padding: 10px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1); margin-bottom: 10px;">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-language"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Adaptación Automática</p>
<p style="font-size: 14px; color: #94a3b8; line-height: 1.25;">La página se adapta automáticamente a uno de los 9 idiomas disponibles.</p>
</div>
</div>
<div style="display: flex; align-items: center; gap: 16px; padding: 10px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-dollar-sign"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Pago Único $15</p>
<p style="font-size: 14px; color: #94a3b8; line-height: 1.25;">Auditoría DNS via Stripe - Servicio B2B exclusivo.</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 750px; top: 120px; width: 450px; height: 555px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 20px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); z-index: 10; box-sizing: border-box;">
<div style="display: flex; flex-direction: column; height: 100%;">
<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
<div><p style="font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 700; color: white;">Página de Ventas</p><p style="font-size: 14px; color: #94a3b8;">Auditoría DNS</p></div>
<div style="display: flex; align-items: center; gap: 8px;"><span style="background: rgba(59, 130, 246, 0.2); color: #3b82f6; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">$15 USD</span></div>
</div>
<div style="flex: 1; background: rgba(30, 41, 59, 0.8); border-radius: 12px; padding: 16px; border: 1px solid rgba(59, 130, 246, 0.1); display: flex; flex-direction: column; gap: 12px;">
<div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid rgba(59, 130, 246, 0.1);">
<div style="display: flex; align-items: center; gap: 12px;">
<div style="width: 36px; height: 36px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;"><i class="fas fa-shield-alt"></i></div>
<div><p style="font-size: 14px; color: white; font-weight: 600;">DNS Security</p><p style="font-size: 12px; color: #94a3b8;">Protección completa</p></div>
</div>
<div style="display: flex; gap: 8px;">
<span style="background: rgba(59, 130, 246, 0.2); color: #3b82f6; padding: 4px 8px; border-radius: 4px; font-size: 11px;">ES</span>
<span style="background: rgba(59, 130, 246, 0.1); color: #94a3b8; padding: 4px 8px; border-radius: 4px; font-size: 11px;">EN</span>
</div>
</div>
<div style="display: flex; flex-direction: column; gap: 10px;">
<div style="background: rgba(59, 130, 246, 0.05); border-radius: 8px; padding: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
<i class="fas fa-check-circle" style="color: #3b82f6; font-size: 18px;"></i>
<div><p style="font-size: 14px; color: white; font-weight: 600;">Auditoría DNS Completa</p><p style="font-size: 12px; color: #94a3b8;">Verificación de registros SPF/DMARC</p></div>
</div>
<div style="display: flex; gap: 8px; margin-top: 4px;">
<div style="flex: 1; background: rgba(59, 130, 246, 0.1); border-radius: 4px; padding: 6px; text-align: center;"><p style="font-size: 11px; color: #94a3b8;">Dominio</p><p style="font-size: 13px; color: white; font-weight: 600;">ejemplo.com</p></div>
<div style="flex: 1; background: rgba(59, 130, 246, 0.1); border-radius: 4px; padding: 6px; text-align: center;"><p style="font-size: 11px; color: #94a3b8;">Estado</p><p style="font-size: 13px; color: #3b82f6; font-weight: 600;">Activo</p></div>
</div>
</div>
<div style="background: rgba(59, 130, 246, 0.1); border-radius: 8px; padding: 12px; border: 1px solid rgba(59, 130, 246, 0.2);">
<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
<div><p style="font-size: 14px; color: white; font-weight: 600;">Pagar $15 USD</p><p style="font-size: 12px; color: #94a3b8;">Auditoría completa</p></div>
<div style="display: flex; align-items: center; gap: 6px;"><i class="fab fa-cc-visa" style="color: #3b82f6; font-size: 20px;"></i><i class="fab fa-cc-mastercard" style="color: #3b82f6; font-size: 20px;"></i></div>
</div>
<button style="width: 100%; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; border-radius: 8px; padding: 10px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;"><i class="fas fa-lock"></i><span>Pagar con Stripe</span></button>
</div>
</div>
</div>
</div>
</div>
</div>
NAV_SCRIPT
</body>
</html>''',

# Slide 5
r'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Paso 4: Interacción Fricción Cero</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
    body { margin: 0; padding: 0; overflow: hidden; background: #0f172a; font-family: 'Open Sans', sans-serif; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
    p { margin: 0; }
    .slide-container { width: 1280px; height: 720px; position: relative; overflow: hidden; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); transform-origin: center center; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
</style>
</head>
<body>
<div class="slide-container" id="slide-container">
<div data-object="true" data-object-type="shape" style="position: absolute; top: 0; left: 0; width: 1280px; height: 720px; background-image: linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px); background-size: 40px 40px; z-index: 1;"></div>
<div data-object="true" data-object-type="shape" style="position: absolute; top: 714px; left: 0; width: 1280px; height: 6px; background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%); z-index: 1;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 80px; top: 50px; width: 1120px; height: 60px; z-index: 10;">
<p style="font-family: 'Montserrat', sans-serif; display: flex; align-items: center; gap: 16px;">
<span style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 700; display: inline-block; flex-shrink: 0;">PASO 4</span>
<span style="font-size: 42px; font-weight: 800; color: white; letter-spacing: -0.5px;">4. Interacción "Fricción Cero"</span>
</p>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 80px; top: 130px; width: 620px; height: 110px; z-index: 10;">
<p style="font-size: 16px; color: #94a3b8; font-style: italic; line-height: 1.5; border-left: 4px solid #3b82f6; padding-left: 16px; background: rgba(59,130,246,0.05); padding-top: 12px; padding-bottom: 12px; padding-right: 16px; border-radius: 0 8px 8px 0;">
<span style="color: #60a5fa; font-weight: 600;"><i class="fas fa-microphone-alt"></i> Voz en off:</span> "Sabemos que los dueños de negocios no son técnicos. Por eso, en el Portal VIP solo tienen que presionar Ctrl+V para pegar una foto de su pantalla. La plataforma hace el resto."
        </p>
</div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 80px; top: 305px; width: 620px; height: 385px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); z-index: 1;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 335px; width: 556px; height: 70px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 20px;">
<div style="width: 64px; height: 64px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; flex-shrink: 0;"><i class="fas fa-user-shield"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 24px; font-weight: 700; color: white; margin-bottom: 4px;">Portal de Soporte VIP</p>
<p style="font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Interacción totalmente simplificada</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 415px; width: 556px; height: 265px; z-index: 10;">
<div style="display: flex; flex-direction: column; gap: 10px;">
<div style="display: flex; align-items: center; gap: 16px; padding: 10px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 38px; height: 38px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 16px; flex-shrink: 0;"><i class="fas fa-sign-in-alt"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 600; color: white; margin-bottom: 2px;">Redirección Automática</p>
<p style="font-size: 13px; color: #94a3b8; line-height: 1.3;">Tras el pago, el cliente es redirigido inmediatamente al Portal de Soporte VIP.</p>
</div>
</div>
<div style="display: flex; align-items: center; gap: 16px; padding: 10px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 38px; height: 38px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 16px; flex-shrink: 0;"><i class="fas fa-brain"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 600; color: white; margin-bottom: 2px;">Cero Complejidad</p>
<p style="font-size: 13px; color: #94a3b8; line-height: 1.3;">No se requieren conocimientos técnicos ni navegar por configuraciones.</p>
</div>
</div>
<div style="display: flex; align-items: center; gap: 16px; padding: 10px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 38px; height: 38px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 16px; flex-shrink: 0;"><i class="fas fa-paste"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 600; color: white; margin-bottom: 2px;">Solo Escribe y Pega</p>
<p style="font-size: 13px; color: #94a3b8; line-height: 1.3;">El cliente escribe su dominio y pega (Ctrl+V) captura de su proveedor.</p>
</div>
</div>
</div>
</div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 760px; top: 305px; width: 440px; height: 385px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); z-index: 5;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 780px; top: 330px; width: 400px; height: 340px; z-index: 10;">
<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;">
<div style="display: flex; align-items: center; gap: 12px; justify-content: center;">
<i class="fas fa-keyboard" style="font-size: 24px; color: #3b82f6;"></i>
<p style="font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; color: white; margin: 0;">Atajos de Teclado</p>
</div>
<div style="background: rgba(59, 130, 246, 0.1); border-radius: 12px; padding: 16px; width: 100%; box-sizing: border-box;">
<div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 12px;">
<div style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; gap: 8px;"><i class="fas fa-print" style="font-size: 12px; color: #60a5fa;"></i><p style="margin: 0; font-size: 12px; color: white; font-weight: 600;">Print Screen</p></div>
<div style="background: transparent; padding: 8px 2px;"><p style="margin: 0; font-size: 14px; color: #94a3b8; font-weight: bold;">+</p></div>
<div style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center;"><p style="margin: 0; font-size: 12px; color: white; font-weight: 600;">Ctrl</p></div>
<div style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center;"><p style="margin: 0; font-size: 12px; color: white; font-weight: 600;">V</p></div>
</div>
<div style="text-align: center;">
<p style="font-size: 13px; color: #94a3b8; margin: 0 0 4px 0;">Paso 1: Copiar, Paso 2: <span style="color: #3b82f6; font-weight: 600;">Ctrl+V</span> para pegar</p>
<p style="font-size: 11px; color: #60a5fa; margin: 0;">Screenshot de proveedor</p>
</div>
</div>
<div style="background: rgba(59, 130, 246, 0.1); border-radius: 12px; padding: 14px; width: 100%; display: flex; align-items: center; gap: 12px; box-sizing: border-box;">
<div style="width: 36px; height: 36px; background: rgba(59, 130, 246, 0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-check-circle"></i></div>
<div>
<p style="font-size: 14px; font-weight: 600; color: white; margin: 0 0 2px 0;">Listo para pegar</p>
<p style="font-size: 12px; color: #94a3b8; margin: 0;">Sistema a la espera de la imagen</p>
</div>
</div>
</div>
</div>
</div>
NAV_SCRIPT
</body>
</html>''',

# Slide 6
r'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Paso 5: Magia Pura</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
    body { margin: 0; padding: 0; overflow: hidden; background: #0f172a; font-family: 'Open Sans', sans-serif; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
    p { margin: 0; }
    .slide-container { width: 1280px; height: 720px; position: relative; overflow: hidden; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); transform-origin: center center; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
</style>
</head>
<body>
<div class="slide-container" id="slide-container">
<div data-object="true" data-object-type="shape" style="position: absolute; top: 0; left: 0; width: 1280px; height: 720px; background-image: linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px); background-size: 40px 40px; z-index: 1;"></div>
<div data-object="true" data-object-type="shape" style="position: absolute; top: 714px; left: 0; width: 1280px; height: 6px; background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%); z-index: 1;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 80px; top: 50px; width: 1120px; height: 60px; z-index: 10;">
<p style="font-family: 'Montserrat', sans-serif; display: flex; align-items: center; gap: 16px;">
<span style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 700; display: inline-block; flex-shrink: 0;">PASO 5</span>
<span style="font-size: 42px; font-weight: 800; color: white; letter-spacing: -0.5px;">5. Magia Pura: Solución a Medida</span>
</p>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 80px; top: 130px; width: 620px; height: 110px; z-index: 10;">
<p style="font-size: 16px; color: #94a3b8; font-style: italic; line-height: 1.5; border-left: 4px solid #3b82f6; padding-left: 16px; background: rgba(59,130,246,0.05); padding-top: 14px; padding-bottom: 14px; padding-right: 16px; border-radius: 0 8px 8px 0;">
<span style="color: #60a5fa; font-weight: 600;"><i class="fas fa-microphone-alt"></i> Voz en off:</span> "Nuestra IA visual reconoce la plataforma que usa el cliente, deduce qué debe hacer y le da instrucciones a prueba de tontos. El cliente repara su dominio y nosotros hemos entregado un valor masivo sin gastar un solo segundo en soporte humano."
    </p>
</div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 80px; top: 270px; width: 620px; height: 420px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); z-index: 1;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 300px; width: 556px; height: 80px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 20px;">
<div style="width: 72px; height: 72px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; flex-shrink: 0;"><i class="fas fa-eye"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 700; color: white; margin-bottom: 4px;">Gemini Vision</p>
<p style="font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">IA de Análisis Forense</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 400px; width: 556px; height: 80px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 16px; padding: 12px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-search"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Identificación Visual</p>
<p style="font-size: 14px; color: #94a3b8; line-height: 1.3;">Analiza la captura de pantalla e identifica al instante el proveedor.</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 490px; width: 556px; height: 80px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 16px; padding: 12px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-chalkboard-teacher"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Instrucciones Simples</p>
<p style="font-size: 14px; color: #94a3b8; line-height: 1.3;">Le explica al cliente "como si tuviera 5 años" exactamente dónde debe hacer clic.</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 112px; top: 580px; width: 556px; height: 95px; z-index: 10;">
<div style="display: flex; align-items: center; gap: 16px; padding: 12px 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
<div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 18px; flex-shrink: 0;"><i class="fas fa-code"></i></div>
<div>
<p style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 600; color: white; margin-bottom: 2px;">Generación de Códigos y Resolución</p>
<p style="font-size: 14px; color: #94a3b8; line-height: 1.3;">Crea los códigos exactos (SPF y DMARC) solucionando el problema en minutos.</p>
</div>
</div>
</div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 820px; top: 200px; width: 368px; height: 248px; background: rgba(15, 23, 42, 0.8); border: 2px solid rgba(59, 130, 246, 0.4); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 2;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 820px; top: 200px; width: 368px; height: 40px; background: rgba(59, 130, 246, 0.1); border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px 12px 0 0; z-index: 3;">
<div style="display: flex; gap: 8px; padding: 14px;">
<div style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></div>
<div style="width: 12px; height: 12px; border-radius: 50%; background: #eab308;"></div>
<div style="width: 12px; height: 12px; border-radius: 50%; background: #22c55e;"></div>
</div>
</div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 840px; top: 260px; width: 320px; height: 120px; z-index: 3;">
<p style="color: #94a3b8; font-size: 15px; font-weight: 600;"><i class="fas fa-globe"></i> panel.proveedor-dns.com</p>
<div style="margin-top: 24px; display: flex; flex-direction: column; gap: 14px;">
<div style="width: 100%; height: 10px; background: rgba(59, 130, 246, 0.15); border-radius: 4px;"></div>
<div style="width: 85%; height: 10px; background: rgba(59, 130, 246, 0.15); border-radius: 4px;"></div>
<div style="width: 60%; height: 10px; background: rgba(59, 130, 246, 0.15); border-radius: 4px;"></div>
</div>
</div>
<div data-object="true" data-object-type="icon" style="position: absolute; left: 770px; top: 140px; width: 80px; height: 80px; z-index: 5;">
<i class="fas fa-robot" style="font-size: 64px; color: #60a5fa; text-shadow: 0 0 20px rgba(59,130,246,0.8);"></i>
</div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 720px; top: 250px; width: 120px; height: 120px; border: 4px solid #3b82f6; border-radius: 50%; background: rgba(59, 130, 246, 0.15); box-shadow: 0 0 30px rgba(59, 130, 246, 0.4); z-index: 6;"></div>
<div data-object="true" data-object-type="shape" style="position: absolute; left: 810px; top: 340px; width: 40px; height: 8px; background: #3b82f6; border-radius: 4px; transform: rotate(45deg); z-index: 5;"></div>
<div data-object="true" data-object-type="textbox" style="position: absolute; left: 820px; top: 480px; width: 420px; height: 180px; background: rgba(0, 0, 0, 0.6); border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); z-index: 10;">
<p style="font-family: 'Courier New', monospace; color: #10b981; font-size: 15px; font-weight: 600; margin-bottom: 12px;">// Códigos Generados por IA</p>
<p style="font-family: 'Courier New', monospace; color: #60a5fa; font-size: 14px; line-height: 1.6; word-break: break-all;">v=spf1 include:_spf.google.com ~all<br/><br/>v=DMARC1; p=quarantine; rua=mailto:soporte@</p>
</div>
<div data-object="true" data-object-type="icon" style="position: absolute; left: 880px; top: 400px; width: 40px; height: 40px; z-index: 5;">
<i class="fas fa-arrow-down" style="font-size: 32px; color: #3b82f6; opacity: 0.7;"></i>
</div>
</div>
NAV_SCRIPT
</body>
</html>''',

# Slide 7
r'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>El Futuro de las Ventas Autónomas</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; overflow: hidden; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
    .slide-container { width: 1280px; height: 720px; position: relative; overflow: hidden; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); transform-origin: center center; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
    .grid-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px); background-size: 40px 40px; z-index: 1; }
    .main-content { position: relative; z-index: 10; width: 100%; height: 100%; display: flex; flex-direction: column; padding: 50px 70px; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
    .title-section { display: flex; flex-direction: column; gap: 8px; }
    .title { font-size: 52px; font-weight: 800; color: white; letter-spacing: -1px; line-height: 1.1; }
    .title .highlight { background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { font-size: 18px; color: #94a3b8; max-width: 700px; line-height: 1.4; }
    .content-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 40px; margin-top: 10px; }
    .left-panel { display: flex; flex-direction: column; gap: 36px; }
    .stats-card { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 24px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); height: 520px; }
    .stats-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .stats-title { font-size: 22px; font-weight: 700; color: white; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .stat-item { background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 16px; padding: 20px 12px; text-align: center; display: flex; flex-direction: column; justify-content: center; min-height: 140px; }
    .stat-value { font-size: 32px; font-weight: 800; color: white; margin-bottom: 8px; }
    .stat-label { font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; line-height: 1.2; }
    .stat-highlight { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border: none; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3); }
    .stat-highlight .stat-value, .stat-highlight .stat-label { color: white; }
    .right-panel { display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 520px; padding-bottom: 10px; }
    .visual-container { position: relative; width: 100%; height: 380px; display: flex; align-items: center; justify-content: center; }
    .gear-animation { position: relative; width: 300px; height: 300px; display: flex; align-items: center; justify-content: center; }
    .gear-icon { font-size: 140px; color: #fbbf24; animation: gearRotate 10s linear infinite; filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.6)); z-index: 2; }
    .gear-icon-secondary { font-size: 100px; color: #f59e0b; animation: gearRotateReverse 8s linear infinite; filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.4)); position: absolute; right: -30px; bottom: -30px; }
    @keyframes gearRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes gearRotateReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
    .success-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%; }
    .metric-item { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; font-size: 14px; font-weight: 500; color: #e2e8f0; }
    .metric-icon { color: #60a5fa; font-size: 16px; }
    .status-bar { position: absolute; bottom: 0; left: 0; width: 100%; height: 8px; background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%); }
    .key-benefits { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
    .benefit-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; }
    .benefit-icon { width: 32px; height: 32px; background: rgba(59, 130, 246, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #60a5fa; font-size: 14px; }
    .benefit-text { flex: 1; font-size: 14px; color: #e2e8f0; font-weight: 500; }
    .benefit-value { font-size: 14px; color: #60a5fa; font-weight: 600; }
</style>
</head>
<body>
<div class="slide-container" id="slide-container">
<div class="grid-bg"></div>
<div class="main-content">
<div class="header">
<div class="title-section">
<div class="title">El <span class="highlight">Futuro</span> de las Ventas Autónomas</div>
<div class="subtitle">Una máquina de hacer dinero en piloto automático - desde la captación hasta la resolución</div>
</div>
<div class="logo-container">
<div class="logo-icon" style="width: 56px; height: 56px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);"><i class="fas fa-robot"></i></div>
</div>
</div>
<div class="content-grid">
<div class="left-panel">
<div class="stats-card">
<div class="stats-header">
<div class="stats-title">Métricas de Rendimiento</div>
<div style="display: flex; align-items: center; gap: 10px;"><div class="status-indicator" style="width: 10px; height: 10px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e;"></div><span style="font-size: 16px; color: #94a3b8; font-weight: 500;">Sistema Activo</span></div>
</div>
<div class="stats-grid">
<div class="stat-item stat-highlight"><div class="stat-value">$0</div><div class="stat-label">Costo Operativo</div></div>
<div class="stat-item"><div class="stat-value">0</div><div class="stat-label">Esfuerzo Manual</div></div>
<div class="stat-item"><div class="stat-value">∞</div><div class="stat-label">Escalabilidad</div></div>
</div>
<div class="key-benefits">
<div class="benefit-item"><div class="benefit-icon"><i class="fas fa-check"></i></div><div class="benefit-text">100% Automatizado</div><div class="benefit-value">Sin intervención</div></div>
<div class="benefit-item"><div class="benefit-icon"><i class="fas fa-infinity"></i></div><div class="benefit-text">Escalabilidad Infinita</div><div class="benefit-value">Sin límites</div></div>
<div class="benefit-item"><div class="benefit-icon"><i class="fas fa-clock"></i></div><div class="benefit-text">Operación 24/7</div><div class="benefit-value">Sin descanso</div></div>
</div>
</div>
</div>
<div class="right-panel">
<div class="visual-container">
<div class="gear-animation"><i class="fas fa-cog gear-icon"></i><i class="fas fa-cog gear-icon-secondary"></i></div>
<div style="position: absolute; top: 20px; right: 20px; text-align: right;"><div style="font-size: 14px; color: #94a3b8; margin-bottom: 4px;">Procesamiento</div><div style="font-size: 24px; font-weight: 700; color: white;">100%</div></div>
</div>
<div class="success-metrics">
<div class="metric-item"><i class="fas fa-check-circle metric-icon"></i><span>Automatización</span></div>
<div class="metric-item"><i class="fas fa-infinity metric-icon"></i><span>Escalabilidad</span></div>
<div class="metric-item"><i class="fas fa-clock metric-icon"></i><span>Disponibilidad</span></div>
</div>
</div>
</div>
</div>
<div class="status-bar"></div>
</div>
NAV_SCRIPT
</body>
</html>'''
]

for i, html in enumerate(slides):
    page_num = i + 1
    prev_page = f"'{page_num - 1}.html'" if page_num > 1 else "null"
    next_page = f"'{page_num + 1}.html'" if page_num < 7 else "null"
    
    nav_script = f"""
<script>
    function resizeSlide() {{
        const slide = document.getElementById('slide-container');
        if (!slide) return;
        const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
        slide.style.transform = 'scale(' + scale + ')';
    }}
    window.addEventListener('resize', resizeSlide);
    resizeSlide();

    document.addEventListener('keydown', function(e) {{
        if (e.key === 'ArrowRight' && {next_page} !== null) window.location.href = {next_page};
        if (e.key === 'ArrowLeft' && {prev_page} !== null) window.location.href = {prev_page};
    }});
</script>
<div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; gap: 10px;">
    """
    
    if page_num > 1:
        nav_script += f"""<button onclick="window.location.href={prev_page}" style="background: rgba(255,255,255,0.1); color: #94a3b8; border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold;"><i class="fas fa-arrow-left"></i> Anterior</button>"""
    if page_num < 7:
        nav_script += f"""<button onclick="window.location.href={next_page}" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold;">Siguiente <i class="fas fa-arrow-right"></i></button>"""
        
    nav_script += "\n</div>"
    
    final_html = html.replace('NAV_SCRIPT', nav_script)
    with open(os.path.join(dir_path, f"{page_num}.html"), "w", encoding="utf-8") as f:
        f.write(final_html)

print("HTML slides successfully generated in public/presentacion/")
