import re
import codecs

path = r'c:\Users\anton_mn7up\Downloads\IADIRECTO\sure-app\src\lib\uiTranslations.ts'
with codecs.open(path, 'r', 'utf-8') as f:
    content = f.read()

translations = {
    'en': 'You have exceeded your subscription\'s base limit. Additional reports will be processed without interruption and billed at your discounted unit rate at the end of the billing cycle.',
    'es': 'Ha superado el límite base de su suscripción. Los reportes adicionales se procesarán sin interrupción y se facturarán a su tarifa unitaria con descuento al finalizar el ciclo.',
    'pt': 'Você ultrapassou o limite base de sua assinatura. Relatórios adicionais serão processados sem interrupção e faturados com sua taxa unitária com desconto no final do ciclo de faturamento.',
    'fr': 'Vous avez dépassé la limite de base de votre abonnement. Les rapports supplémentaires seront traités sans interruption et facturés à votre tarif unitaire préférentiel à la fin du cycle de facturation.',
    'de': 'Sie haben das Basislimit Ihres Abonnements überschritten. Zusätzliche Berichte werden ohne Unterbrechung bearbeitet und am Ende des Abrechnungszyklus zu Ihrem ermäßigten Einheitspreis in Rechnung gestellt.',
    'zh': '您已超过订阅的基本限制。其他报告将不间断地处理，并在结算周期结束时以您的折扣单价计费。',
    'ru': 'Вы превысили базовый лимит своей подписки. Дополнительные отчеты будут обрабатываться без перерывов и оплачиваться по вашей льготной цене за единицу в конце расчетного цикла.',
    'ar': 'لقد تجاوزت الحد الأساسي لاشتراكك. ستتم معالجة التقارير الإضافية دون انقطاع وسيتم فوترتها بسعر الوحدة المخفض في نهاية دورة الفوترة.',
    'hi': 'आपने अपनी सदस्यता की मूल सीमा पार कर ली है। अतिरिक्त रिपोर्टों को बिना किसी रुकावट के संसाधित किया जाएगा और बिलिंग चक्र के अंत में आपकी रियायती इकाई दर पर बिल किया जाएगा.'
}

for lang, text in translations.items():
    pattern = r'(' + lang + r':\s*\{\s*ui:\s*\{)'
    match = re.search(pattern, content)
    if match:
        insertion = f'\n      intake_overage_warn: "{text}",'
        content = content[:match.end()] + insertion + content[match.end():]

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(content)
print('Done')
