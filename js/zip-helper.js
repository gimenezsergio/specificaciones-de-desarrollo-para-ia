function safeFileName(name) {
  return String(name || 'ProjectSpec').trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_') || 'ProjectSpec';
}

function downloadBlob(blob, fileName) {
  console.log('[ProjectSpec] downloadBlob()', { fileName, size: blob?.size, type: blob?.type });
  if (!blob || !blob.size) { throw new Error('Blob vacío o inválido'); }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.rel = 'noopener';
  a.style.position = 'fixed';
  a.style.left = '-9999px';
  a.style.top = '-9999px';
  document.body.appendChild(a);
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
  a.dispatchEvent(event);
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 4000);
  return true;
}

function collectFiles() {
  const projectName = safeFileName(state.data.general?.name || 'ProjectSpec');
  const base = `${projectName}_Docs/`;
  const files = {};
  DOCS.forEach(([k, l]) => {
    files[base + l] = md[k](state.data);
  });
  files[base + 'README.md'] = `# ${state.data.general?.name || 'ProjectSpec'}

Documentación generada con ProjectSpec Pro.

## Calidad
- Completitud: ${completion().percent}%
- Alertas: ${qualityIssues().length}
`;
  return { projectName, files };
}

function exportZip() {
  console.log('[ProjectSpec] exportZip iniciado');
  try {
    const { projectName, files } = collectFiles();
    console.log('[ProjectSpec] archivos a exportar:', Object.keys(files));
    const blob = createZipBlob(files);
    console.log('[ProjectSpec] ZIP generado:', blob, 'size:', blob.size);
    downloadBlob(blob, `${projectName}_ProjectSpec_Pro.zip`);
    setTimeout(() => alert('Exportación iniciada. Si el ZIP no aparece en Descargas, usá “Exportar MD”.'), 50);
  } catch (error) {
    console.error('[ProjectSpec] Error exportando ZIP:', error);
    try {
      exportAsSingleMarkdown();
      alert('No se pudo exportar ZIP. Se descargó un Markdown único como respaldo.');
    } catch (e) {
      console.error('[ProjectSpec] También falló la exportación alternativa:', e);
      alert('No se pudo exportar. Revisá la consola del navegador.');
    }
  }
}

function exportAsSingleMarkdown() {
  const { projectName, files } = collectFiles();
  const content = Object.entries(files).map(([name, text]) => `# FILE: ${name}\n\n${text}`).join('\n\n---\n\n');
  downloadBlob(new Blob([content], { type: 'text/markdown;charset=utf-8' }), `${projectName}_ProjectSpec_DOCUMENTOS.md`);
}

function createZipBlob(files) {
  const encoder = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  const now = new Date();
  const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (Math.floor(now.getSeconds() / 2))) & 0xffff;
  const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const local = concatBytes(u32(0x04034b50), u16(20), u16(0), u16(0), u16(dosTime), u16(dosDate), u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), nameBytes, data);
    chunks.push(local);
    central.push({ nameBytes, crc, size: data.length, offset });
    offset += local.length;
  }

  let centralSize = 0;
  for (const f of central) {
    const c = concatBytes(u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(dosTime), u16(dosDate), u32(f.crc), u32(f.size), u32(f.size), u16(f.nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(f.offset), f.nameBytes);
    chunks.push(c);
    centralSize += c.length;
  }

  const endRecord = concatBytes(u32(0x06054b50), u16(0), u16(0), u16(central.length), u16(central.length), u32(centralSize), u32(offset), u16(0));
  chunks.push(endRecord);
  return new Blob(chunks, { type: 'application/zip' });
}

function concatBytes(...arrays) {
  const total = arrays.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const a of arrays) {
    out.set(a, pos);
    pos += a.length;
  }
  return out;
}

function u16(n) {
  const b = new Uint8Array(2);
  new DataView(b.buffer).setUint16(0, n, true);
  return b;
}

function u32(n) {
  const b = new Uint8Array(4);
  new DataView(b.buffer).setUint32(0, n >>> 0, true);
  return b;
}

let CRC_TABLE = null;
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
}

function crc32(data) {
  if (!CRC_TABLE) CRC_TABLE = makeCrcTable();
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}
