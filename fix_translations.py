import re

file_path = 'src/lib/uiTranslations.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

translations = {
    'en': {
      'intake_context_title': 'Specific Instructions or Context (Optional)',
      'intake_context_sub': 'If you uploaded screenshots or blurry documents, tell the AI what to look for specifically (e.g., \\'Pay attention to the seal in the bottom corner\\', \\'The main document is from Atyrau\\', etc.)',
      'intake_context_placeholder': 'Type your instructions here...'
    },
    'es': {
      'intake_context_title': 'Instrucciones o Contexto Específico (Opcional)',
      'intake_context_sub': 'Si subiste capturas de pantalla o documentos borrosos, indica aquí a la IA qué debe buscar específicamente (Ej: \\'Presta atención al sello en la esquina inferior\\', \\'El documento principal es de Atyrau\\', etc.)',
      'intake_context_placeholder': 'Escribe tus instrucciones aquí...'
    },
    'fr': {
      'intake_context_title': 'Instructions Spécifiques ou Contexte (Optionnel)',
      'intake_context_sub': 'Si vous avez téléchargé des captures d\\'écran ou des documents flous, indiquez à l\\'IA ce qu\\'elle doit chercher (ex: \\'Faites attention au sceau dans le coin inférieur\\', \\'Le document principal vient d\\'Atyrau\\', etc.)',
      'intake_context_placeholder': 'Tapez vos instructions ici...'
    },
    'de': {
      'intake_context_title': 'Spezifische Anweisungen oder Kontext (Optional)',
      'intake_context_sub': 'Wenn Sie Screenshots oder verschwommene Dokumente hochgeladen haben, sagen Sie der KI, worauf sie achten soll (z. B. \\'Achten Sie auf das Siegel unten\\', \\'Das Hauptdokument stammt aus Atyrau\\' usw.)',
      'intake_context_placeholder': 'Geben Sie hier Ihre Anweisungen ein...'
    },
    'pt': {
      'intake_context_title': 'Instruções Específicas ou Contexto (Opcional)',
      'intake_context_sub': 'Se você carregou capturas de tela ou documentos desfocados, diga à IA o que procurar (ex: \\'Preste atenção ao selo no canto inferior\\', \\'O documento principal é de Atyrau\\', etc.)',
      'intake_context_placeholder': 'Digite suas instruções aqui...'
    },
    'zh': {
      'intake_context_title': '具体指示或背景信息（可选）',
      'intake_context_sub': '如果您上传了屏幕截图或模糊的文档，请告诉AI具体要注意什么（例如：\\'注意底角的印章\\'，\\'主要文件来自阿特劳\\'等）',
      'intake_context_placeholder': '在此输入您的指示...'
    },
    'ru': {
      'intake_context_title': 'Специфические инструкции или контекст (Необязательно)',
      'intake_context_sub': 'Если вы загрузили скриншоты или размытые документы, скажите ИИ, на что обратить внимание (например: \\'Обратите внимание на печать в нижнем углу\\', \\'Главный документ из Атырау\\' и т. д.)',
      'intake_context_placeholder': 'Введите ваши инструкции здесь...'
    },
    'ar': {
      'intake_context_title': 'تعليمات محددة أو سياق (اختياري)',
      'intake_context_sub': 'إذا قمت بتحميل لقطات شاشة أو مستندات غير واضحة، فأخبر الذكاء الاصطناعي بما يجب أن يبحث عنه (مثل: \\'انتبه للختم في الزاوية السفلية\\'، \\'المستند الرئيسي من أتيراو\\'، إلخ)',
      'intake_context_placeholder': 'اكتب تعليماتك هنا...'
    },
    'hi': {
      'intake_context_title': 'विशिष्ट निर्देश या संदर्भ (वैकल्पिक)',
      'intake_context_sub': 'यदि आपने स्क्रीनशॉट या धुंधले दस्तावेज़ अपलोड किए हैं, तो AI को बताएं कि विशेष रूप से क्या देखना है (उदा., \\'निचले कोने में मुहर पर ध्यान दें\\', \\'मुख्य दस्तावेज़ अтыराउ से है\\', आदि)',
      'intake_context_placeholder': 'अपने निर्देश यहां टाइप करें...'
    }
}

lines = content.split('\\n')
current_lang = None
new_lines = []

for line in lines:
    new_lines.append(line)
    lang_match = re.match(r'^  ([a-z]{2}): \{', line)
    if lang_match:
        current_lang = lang_match.group(1)
        
    if 'intake_lbl_lang:' in line and current_lang in translations:
        t = translations[current_lang]
        new_lines.append(f"      intake_context_title: \\"{t['intake_context_title']}\\",")
        new_lines.append(f"      intake_context_sub: \\"{t['intake_context_sub']}\\",")
        new_lines.append(f"      intake_context_placeholder: \\"{t['intake_context_placeholder']}\\",")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write('\\n'.join(new_lines))
print('Successfully updated uiTranslations.ts')
