const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Read the prompt file or extract it
const alfredoPromptContent = fs.readFileSync(path.join(__dirname, '../src/lib/agents/alfredo.ts'), 'utf8');
const alfredoPromptMatch = alfredoPromptContent.match(/export const ALFREDO_PROMPT = `([\s\S]*?)`;/);
const ALFREDO_PROMPT = alfredoPromptMatch ? alfredoPromptMatch[1] : '';

const searchPrompt = `Busca prospectos comerciales corporativos en la web. El objetivo principal de nuestro proyecto es: "Búsqueda de proveedores y cotizaciones para 11,371 medidores inteligentes ANSI AMI para el proyecto CNEL EP Ecuador.".
ESTRICTO: Entrega exactamente 20 empresas.

ESTRICTO: EVITA COMPLETAMENTE las siguientes empresas y sitios web que ya tenemos registrados en nuestra base de datos (no los repitas bajo ninguna circunstancia):
- Nombres de empresa a evitar: shenzhen topband co., ltd., ningbo deye inverter technology co., ltd., zhejiang risesun electrical co., ltd., ningbo deye technology co., ltd., shenzhen techrise electronics co., ltd., huneed technologies co., ltd., ningbo sanxing smart electric co., ltd., ls electric co., ltd., holley technology ltd., zhejiang yongtailong electronic co., ltd. (ytl), kepid amstech, clou global (midea group), ningbo ketai electric co., ltd., sichuan huaming power equipment co., ltd., xj group corporation, nanjing nari group corporation, changzhou huawei electronic co., ltd., zhejiang tetras electric co., ltd., hangzhou zhongyi electrical co., ltd., ningbo sanhuan smart technology co., ltd., zhejiang ruxing electrical appliance co., ltd., zhejiang yidian technology co., ltd., ningbo foton electrical co., ltd., zhejiang yuhong electric co., ltd., guangdong l&n meter co., ltd., wenzhou huapu electric co., ltd., zhejiang yongsheng technology co., ltd., shenzhen longruan technology co., ltd., zhejiang tonly electronics co., ltd., shanghai yongji electric co., ltd., zhejiang chuanglian electric co., ltd., hyosung heavy industries, kepco kdn co., ltd., posco ict, shenzhen inhemeter co., ltd., hexing electrical co., ltd., wasion group, hangzhou lihua technology co., ltd., beijing sifang automation co., ltd., hangzhou xinyuan smart meter co., ltd., ningbo kaflon smart meter co., ltd., hangzhou fuxin technology co., ltd., shanghai electric power transmission & distribution co., ltd., chongqing fuling electric power industrial co., ltd., hangzhou l&z technology co., ltd., hangzhou zgsm technology co., ltd., zhejiang supcon technology co., ltd., shenzhen suneng technology co., ltd., shenzhen kaifa technology co., ltd., hangzhou xizi unite electric co., ltd., ningbo eastron electronic co., ltd., zhejiang huineng electric co., ltd., xiamen zishan electronic co., ltd., hangzhou century co., ltd., hangzhou dongdian electric co., ltd., shenzhen star instrument co., ltd., zhejiang longsheng instrument co., ltd., zhejiang rifa digital meter co., ltd., zhejiang huayu electrical apparatus co., ltd., nuri flex co., ltd., zhejiang yongtai electric co., ltd., shenzhen goldcard smart group co., ltd., ningbo tech-long meter co., ltd., guangdong weiye electric co., ltd., hangzhou sanlin electronic co., ltd., p&c tech co., ltd., metron co., ltd., zhejiang chint instrument & meter co., ltd., omnisystem co., ltd., jiangsu linyang energy co., ltd., hangzhou luge electrical technology co., ltd.
- Sitios web/dominios a evitar: topband-e.com, deyeinverter.com, risesun.cn, deye.com, techrise.com.cn, huneed.com, lselectric.com, holley.cn, nbketai.com, huaming.com, xjgc.com/en/, nari.com.cn/en/, huawei-meter.com/, tetras.cn/, zy-electric.com/, sanhuan.com.cn/, ruxing.com.cn/, yidiantech.com/, foton-electric.com/, yuhong-electric.com/, ln-meter.com/, huapuelectric.com/, yongshengtech.com/, longruan.com/, tonly.com.cn/, yongjielectric.com/, cl-electric.com/, hyosungheavyindustries.com/en/, kepcokdn.com/en/, poscoict.com/eng/index.do, hexing.com, wasion.com, lihua-tech.com, sifang.com, xinyuan-meter.com, kaflonmeter.com, fuxin-tech.com, setd.com.cn, cqsdfd.com, lzmeter.com, zgsm-china.com, supcon.com, sunengtech.com, kaifa.cn, xiziunite.com, eastrongroup.com, huineng.com, xmzs.com, century-cn.com, ddelectric.com.cn, star-instrument.com, longsheng-meter.com, rifa-meter.com, huayuelectric.com, nuriflex.com, yongtaielectric.com, goldcard.com.cn, techlongmeter.com, weiyeelectric.com, sanlin-meter.com, pnctech.co.kr, metron.co.kr, chint.com, linyang.com, luge-electric.com
Ten en cuenta las siguientes restricciones y contexto adicional (Geografía, perfil, etc.): "Buscar empresas de China y Corea del sur".`;

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  console.log("Calling Gemini with full ALFREDO_PROMPT system instruction...");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: searchPrompt,
      config: {
        systemInstruction: ALFREDO_PROMPT,
        temperature: 0.1,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'text/plain'
      }
    });

    console.log("Response candidate:");
    console.log(JSON.stringify(response.candidates?.[0], null, 2));
    console.log("Text:", response.text);
  } catch (err) {
    console.error("Error during execution:", err.message || err);
  }
}

test();
