import officeparser from 'officeparser';

console.log("Static methods:", Object.getOwnPropertyNames(officeparser));
console.log("Prototype methods:", Object.getOwnPropertyNames(officeparser.prototype));

// Let's also try to parse a file if we can
try {
    const docxPath = 'C:\\Users\\anton_mn7up\\Downloads\\Documents\\01_RFQ_American_Elements.docx';
    const buffer = await officeparser.parseUndefinedAsync(docxPath);
    console.log("parseUndefinedAsync returned length:", buffer.length);
} catch (e) {
    console.log("parseUndefinedAsync failed:", e.message);
}

try {
    const docxPath = 'C:\\Users\\anton_mn7up\\Downloads\\Documents\\01_RFQ_American_Elements.docx';
    const ast = await officeparser.parseOffice(docxPath);
    console.log("parseOffice returned AST:", ast);
} catch (e) {
    console.log("parseOffice failed:", e.message);
}
