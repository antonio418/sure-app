import os
import sys
import subprocess
import asyncio

# Ensure edge-tts is installed
try:
    import edge_tts
except ImportError:
    print("Installing high-quality Microsoft Neural TTS library (edge-tts)...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "edge-tts"])
    import edge_tts

# Default script content if file doesn't exist
DEFAULT_SCRIPT = """This is a live test of OilScam Alert. 
Look at this document from a Kazakhstan oil supplier offering three million barrels of crude oil. 
Our AI matrix immediately analyzed the PDF and found fourteen critical anomalies. 
The registered address is a residential apartment, the spec sheets contain fake chemical elements, and the seller asks for advance wire deposits before any verification. 
Before you sign any oil contract, scan it at sure forensic dot com slash oilscam. 
Protect your capital today."""

SCRIPT_FILE = "script.txt"
OUTPUT_FILE = "voiceover.mp3"

# Premium Microsoft Neural voices
VOICES = {
    "1": ("en-US-AndrewNeural", "Male - Professional / Corporate (Andrew)"),
    "2": ("en-US-AvaNeural", "Female - Natural / Engaging (Ava)"),
    "3": ("en-US-EmmaNeural", "Female - Warm / Friendly (Emma)"),
    "4": ("en-US-BrianNeural", "Male - Clear / Energetic (Brian)"),
    "5": ("en-GB-SoniaNeural", "Female - British accent (Sonia)"),
    "6": ("en-GB-RyanNeural", "Male - British accent (Ryan)")
}

async def generate_tts(text: str, voice: str, output_path: str):
    print(f"\nGenerating voiceover using voice: {voice}...")
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)
    print(f"Success! Voiceover saved to: {os.path.abspath(output_path)}")

def main():
    print("=" * 60)
    print("          SURE FORENSICS - NEURAL TEXT-TO-SPEECH GENERATOR      ")
    print("=" * 60)

    # 1. Create default script.txt if it doesn't exist
    if not os.path.exists(SCRIPT_FILE):
        with open(SCRIPT_FILE, "w", encoding="utf-8") as f:
            f.write(DEFAULT_SCRIPT.strip())
        print(f"Created a sample voiceover script at: {SCRIPT_FILE}")
    
    print(f"\n1. Open and edit the text file '{SCRIPT_FILE}' to write your custom script.")
    print("2. Choose a premium neural voice from the list below:")
    
    for key, value in VOICES.items():
        print(f"   [{key}] {value[1]}")
    
    choice = input("\nEnter your choice (1-6) [Default: 1]: ").strip()
    if not choice or choice not in VOICES:
        choice = "1"
    
    selected_voice = VOICES[choice][0]

    # Read script content
    with open(SCRIPT_FILE, "r", encoding="utf-8") as f:
        text_content = f.read().strip()
    
    if not text_content:
        print("Error: script.txt is empty! Please write some text to speak.")
        return

    # Run async generation
    asyncio.run(generate_tts(text_content, selected_voice, OUTPUT_FILE))
    
    print("\n" + "=" * 60)
    print(f"You can now play '{OUTPUT_FILE}' to hear your professional voiceover!")
    print("=" * 60)

if __name__ == "__main__":
    main()
