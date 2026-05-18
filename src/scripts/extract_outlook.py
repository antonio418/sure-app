import win32com.client
import re
import json
import os
from collections import defaultdict

# RegEx to validate and extract emails
EMAIL_REGEX = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'

def extract_domain(email):
    try:
        return email.split('@')[1].lower()
    except IndexError:
        return None

def is_valid_b2b_domain(domain):
    # Filter out generic free providers
    free_providers = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com']
    if domain in free_providers:
        return False
    return True

def extract_emails_from_outlook(limit=5000):
    print("🔄 Conectando a Outlook Desktop...")
    try:
        outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
    except Exception as e:
        print(f"❌ Error al conectar con Outlook. Asegúrate de tener Outlook instalado y abierto. Error: {e}")
        return

    # 6 is the constant for the Inbox folder. 
    # You can change this to another number or traverse folders if the inactive accounts are mapped elsewhere.
    inbox = outlook.GetDefaultFolder(6) 
    messages = inbox.Items

    print(f"📥 Escaneando hasta {limit} mensajes en la bandeja de entrada principal...")
    
    unique_leads = {}
    count = 0

    try:
        for message in messages:
            if count >= limit:
                break
            
            try:
                # Try to extract the sender
                sender = message.SenderEmailAddress
                if sender and re.match(EMAIL_REGEX, sender):
                    domain = extract_domain(sender)
                    if domain and is_valid_b2b_domain(domain):
                        unique_leads[sender] = domain
            except:
                pass # Not all items are standard emails (e.g. calendar invites)

            try:
                # Try to extract the body for other emails
                body = message.Body
                found_emails = re.findall(EMAIL_REGEX, body)
                for email in found_emails:
                    domain = extract_domain(email)
                    if domain and is_valid_b2b_domain(domain):
                        unique_leads[email] = domain
            except:
                pass
            
            count += 1
            if count % 500 == 0:
                print(f"  ...procesados {count} mensajes. Emails únicos B2B encontrados: {len(unique_leads)}")

    except Exception as e:
        print(f"⚠️ Error durante el escaneo: {e}")

    print(f"✅ Extracción completada. Total de leads B2B únicos: {len(unique_leads)}")

    # Format for Supabase
    supabase_payload = []
    for email, domain in unique_leads.items():
        supabase_payload.append({
            "email": email.lower(),
            "domain": domain
        })

    # Save to file
    output_file = 'extracted_dns_leads.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(supabase_payload, f, indent=2)

    print(f"💾 Archivo guardado: {os.path.abspath(output_file)}")
    print("🚀 Ahora puedes subir este archivo a tu tabla 'dns_leads' en Supabase.")

if __name__ == "__main__":
    extract_emails_from_outlook(limit=5000)
