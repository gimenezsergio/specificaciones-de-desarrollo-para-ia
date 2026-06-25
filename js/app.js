const STORAGE_KEY = 'projectspec_pro_v1';

const DOCS = [
  ['agents', 'AGENTS.md'],
  ['product', 'PRODUCT.md'],
  ['requirements', 'REQUIREMENTS.md'],
  ['userStories', 'USER_STORIES.md'],
  ['acceptance', 'ACCEPTANCE_CRITERIA.md'],
  ['architecture', 'ARCHITECTURE.md'],
  ['domainModel', 'DOMAIN_MODEL.md'],
  ['database', 'DATABASE.md'],
  ['openapi', 'openapi.json'],
  ['testing', 'TESTING.md'],
  ['roadmap', 'ROADMAP.md'],
  ['decisions', 'DECISIONS.md'],
  ['risks', 'RISKS.md'],
  ['glossary', 'GLOSSARY.md']
];

const STEPS = [
  {
    id: 'general', title: 'Información General', desc: 'Identidad, tipo de producto y objetivo.', fields: [
      f('name', 'Nombre del proyecto', 'text', 'Ej. ProjectSpec', true),
      f('projectType', 'Tipo de aplicación', 'select', '', true, ['SaaS', 'Dashboard interno', 'E-commerce', 'Marketplace', 'App educativa', 'Sistema de gestión', 'Landing + formulario', 'API / Backend', 'Otro']),
      f('description', 'Descripción corta', 'textarea', '¿Qué es y qué hace en 2-3 líneas?', true),
      f('objective', 'Objetivo principal', 'textarea', '¿Qué resultado concreto debe lograr?', true),
      f('successMetrics', 'Métricas de éxito', 'textarea', 'Ej. Reducir tiempo de carga de requerimientos 50%, generar specs completas en menos de 30 min.', false)
    ]
  },
  {
    id: 'product', title: 'Producto', desc: 'Problema, usuarios, valor y límites.', fields: [
      f('targetAudience', 'Público objetivo', 'textarea', 'Quién usa la app, contexto, nivel técnico, frecuencia de uso.', true),
      f('problem', 'Problema que resuelve', 'textarea', 'Dolor actual, costo de no resolverlo, proceso actual.', true),
      f('valueProposition', 'Propuesta de valor', 'textarea', 'Por qué esta solución es mejor o más práctica.', true),
      f('mvpScope', 'Alcance del MVP', 'textarea', 'Qué SÍ entra en la primera versión.', true),
      f('outOfScope', 'Fuera de alcance', 'textarea', 'Qué NO se hará todavía.', false),
      f('businessRules', 'Reglas de negocio críticas', 'textarea', 'Reglas inviolables del dominio.', true)
    ]
  },
  {
    id: 'requirements', title: 'Requerimientos', desc: 'Roles, funcionalidades y condiciones de aceptación.', fields: [
      f('rolesMatrix', 'Matriz de permisos por rol', 'textarea', 'Admin: CRUD total. Operador: sólo crear movimientos.', true),
      f('functionalReqs', 'Requerimientos funcionales', 'textarea', 'F1: El usuario puede crear... F2: El sistema permite...', true),
      f('nonFunctionalReqs', 'Requerimientos no funcionales', 'textarea', 'Performance, seguridad, disponibilidad, accesibilidad, escalabilidad.', false),
      f('useCases', 'Casos de uso principales', 'textarea', 'Caso 1: Registrar salida. Actor, pasos, alternativas, errores.', true),
      f('acceptanceCriteria', 'Criterios de aceptación', 'textarea', 'Dado/Cuando/Entonces o checklist verificable.', false)
    ]
  },
  {
    id: 'ui', title: 'UX/UI', desc: 'Interfaz, navegación y experiencia.', fields: [
      f('designSystem', 'Sistema de diseño / referencia', 'text', 'Ej. Bootstrap, Tailwind, Apple HIG', false, ['Bootstrap', 'Tailwind CSS', 'Material Design', 'Apple HIG', 'Shadcn UI', 'Minimalista propio']),
      f('theme', 'Tema y estilo visual', 'text', 'Ej. Minimalista, claro, alto contraste.', false, ['Modo claro', 'Modo oscuro', 'Mobile first', 'Minimalista monocromático', 'Dashboard con tarjetas']),
      f('mainScreens', 'Pantallas principales', 'textarea', 'Ej. Login, dashboard, listado, detalle, formulario, configuración.', true),
      f('mainFlows', 'Flujos principales', 'textarea', 'Ej. Crear proyecto → completar spec → revisar calidad → exportar.', false)
    ]
  },
  {
    id: 'architecture', title: 'Arquitectura', desc: 'Stack, patrón, auth, deploy y estructura.', fields: [
      f('pattern', 'Patrón arquitectónico', 'text', 'Ej. Monolito modular MVC', true, ['Monolito modular', 'MVC', 'Hexagonal', 'Serverless', 'JAMstack', 'Microservicios']),
      f('stackDefinitive', 'Stack tecnológico definitivo', 'textarea', 'Frontend, backend, DB, ORM, estilos, testing.', true, ['HTML, CSS y JS Vanilla', 'Flask + SQLite', 'Node + Express + MySQL', 'React + Vite', 'Next.js + Prisma']),
      f('authProvider', 'Autenticación y sesiones', 'text', 'Ej. JWT HTTP-only cookies, Supabase Auth, OAuth2.', false, ['JWT custom', 'Session cookies', 'Supabase Auth', 'Firebase Auth', 'Clerk', 'OAuth2']),
      f('deployment', 'Estrategia de despliegue', 'textarea', 'Vercel, VPS, Docker, Render, CI/CD.', false),
      f('folderStructure', 'Estructura de directorios', 'textarea', 'src/\n ├── components/\n ├── services/\n └── ...', false)
    ]
  },
  {
    id: 'domain', title: 'Modelo de Dominio', desc: 'Entidades, relaciones, estados y eventos.', fields: [
      f('entities', 'Entidades principales', 'textarea', 'Ej. User, Project, Requirement, Document, Export.', true),
      f('relationships', 'Relaciones entre entidades', 'textarea', 'Ej. Un Project tiene muchos Requirement.', false),
      f('states', 'Estados importantes', 'textarea', 'Ej. draft, ready_for_review, approved, exported.', false),
      f('domainEvents', 'Eventos de dominio', 'textarea', 'Ej. SpecCompleted, DocumentExported.', false)
    ]
  },
  {
    id: 'database', title: 'Base de Datos', desc: 'Motor, esquema y reglas de persistencia.', fields: [
      f('dbType', 'Motor de base de datos', 'text', 'Ej. PostgreSQL, MySQL, SQLite.', false, ['PostgreSQL', 'MySQL 8', 'SQLite', 'MongoDB', 'Redis']),
      f('schemaDetails', 'Esquema detallado', 'textarea', 'Prisma, SQL o descripción de tablas/colecciones.', false),
      f('dataSensitivity', 'Datos sensibles', 'textarea', 'Qué datos requieren protección, cifrado, anonimización o control de acceso.', false)
    ]
  },
  {
    id: 'api', title: 'API', desc: 'Endpoints, contratos y errores.', fields: [
      f('apiStyle', 'Estilo de API', 'text', 'REST, GraphQL, RPC, Server Actions.', false, ['REST', 'GraphQL', 'RPC', 'Server Actions', 'Sin API externa']),
      f('openapiJson', 'OpenAPI JSON', 'textarea', 'Pegá o generá una especificación OpenAPI válida.', false),
      f('errorModel', 'Modelo de errores', 'textarea', 'Ej. RFC 7807, códigos HTTP, mensajes consistentes.', false)
    ]
  },
  {
    id: 'testing', title: 'Testing', desc: 'Pruebas, coverage y definición de terminado.', fields: [
      f('framework', 'Framework de testing', 'text', 'Ej. Vitest, PyTest, Playwright.', false, ['Vitest', 'Jest', 'PyTest', 'Playwright', 'Cypress']),
      f('conventions', 'Convenciones de tests', 'textarea', 'Dónde van los tests, nomenclatura, mocks.', false),
      f('definitionOfDone', 'Definition of Done', 'textarea', 'Qué condiciones debe cumplir una tarea para estar lista.', true)
    ]
  },
  {
    id: 'planning', title: 'Roadmap y Decisiones', desc: 'Plan de evolución, riesgos y decisiones técnicas.', fields: [
      f('roadmap', 'Roadmap', 'textarea', 'MVP, V2, V3. Qué entra en cada etapa.', false),
      f('decisions', 'Decisiones tomadas', 'textarea', 'ADR simples: decisión, contexto, consecuencia.', false),
      f('risks', 'Riesgos y supuestos', 'textarea', 'Riesgos técnicos, de producto, de UX y de negocio.', false)
    ]
  },
  {
    id: 'agentRules', title: 'Reglas para Agentes IA', desc: 'Instrucciones para Claude Code, OpenCode, Cursor, Copilot y similares.', fields: [
      f('codingStyles', 'Estilos de codificación', 'textarea', 'Convenciones de nombres, arquitectura, patrones permitidos.', true, ['Clean Code', 'SOLID', 'Tipado estricto', 'PEP 8', 'Airbnb JS Style Guide']),
      f('behaviorRules', 'Reglas técnicas de comportamiento', 'textarea', 'Qué puede y no puede hacer el agente.', true, ['No instalar dependencias sin justificar', 'Validar inputs', 'OWASP Top 10', 'Errores centralizados', 'Tests antes de finalizar']),
      f('forbiddenActions', 'Acciones prohibidas', 'textarea', 'Ej. No borrar archivos sin permiso. No cambiar stack. No exponer secretos.', false)
    ]
  },
  {
    id: 'glossary', title: 'Glosario', desc: 'Lenguaje del dominio y términos prohibidos.', fields: [
      f('terms', 'Términos de dominio', 'textarea', '- Requerimiento: Requirement\n- Especificación: Spec', false),
      f('forbiddenTerms', 'Términos a evitar', 'textarea', 'Palabras ambiguas o traducciones que no deben usarse.', false)
    ]
  }
];

const EXAMPLES = {
  inventory: {
    general: { name: 'InventarioPro', projectType: 'Sistema de gestión', description: 'Sistema de gestión de inventario en tiempo real para centros logísticos.', objective: 'Garantizar control exacto de existencias, trazabilidad por usuario y alertas de reabastecimiento.', successMetrics: 'Reducir errores de stock un 70%. Registrar movimientos en menos de 30 segundos. Mantener trazabilidad completa.' },
    product: { targetAudience: 'Operarios de almacén y gerentes logísticos.', problem: 'Registros manuales propensos a errores, falta de visibilidad del stock y pérdida de trazabilidad.', valueProposition: 'Control de stock simple, auditable y seguro.', mvpScope: 'Login, productos, movimientos, roles, dashboard básico y exportación CSV.', outOfScope: 'Integración con ERP, app mobile nativa, analítica avanzada.', businessRules: 'El stock nunca puede ser negativo. Todo movimiento requiere usuario. Los productos se desactivan, no se eliminan.' },
    requirements: { rolesMatrix: 'Admin: CRUD total. Operador: crear movimientos y ver productos. Auditor: sólo lectura.', functionalReqs: 'F1: Login seguro.\nF2: CRUD de productos.\nF3: Registrar entradas/salidas.\nF4: Reporte de movimientos.', nonFunctionalReqs: 'NF1: Respuesta menor a 300ms en operaciones comunes.\nNF2: Auditoría completa.', useCases: 'Caso: Registrar salida. Actor: Operador. Pasos: seleccionar producto, ingresar cantidad, validar stock, confirmar, registrar movimiento.', acceptanceCriteria: 'Dado un producto con stock 10, cuando el operador retira 3, entonces el stock final debe ser 7 y debe existir un movimiento OUT.' },
    ui: { designSystem: 'Bootstrap', theme: 'Minimalista, modo claro, dashboard con tarjetas.', mainScreens: 'Login, Dashboard, Productos, Movimientos, Usuarios, Reportes.', mainFlows: 'Login → Dashboard → Crear movimiento → Confirmar → Ver stock actualizado.' },
    architecture: { pattern: 'Monolito modular MVC', stackDefinitive: 'Frontend: React + Vite. Backend: Node + Express. DB: MySQL. ORM: Prisma.', authProvider: 'JWT en HTTP-only cookies', deployment: 'Backend en Render, Frontend en Vercel, DB MySQL gestionada.', folderStructure: 'src/\n├── controllers/\n├── services/\n├── repositories/\n├── routes/\n└── middlewares/' },
    domain: { entities: 'User, Product, Movement, Category, AuditLog', relationships: 'User crea muchos Movement. Product tiene muchos Movement. Category tiene muchos Product.', states: 'Product: active/inactive. Movement: confirmed/cancelled.', domainEvents: 'MovementCreated, StockUpdated, ProductDeactivated' },
    database: { dbType: 'MySQL 8', schemaDetails: 'User(id,email,passwordHash,role)\nProduct(id,sku,name,currentStock,minStock,isActive)\nMovement(id,productId,userId,type,quantity,createdAt)', dataSensitivity: 'Contraseñas hasheadas, logs de auditoría, IDs de usuario.' },
    api: { apiStyle: 'REST', openapiJson: '', errorModel: 'Errores JSON con code, message y details. 400 validación, 401 auth, 403 permisos, 404 no encontrado.' },
    testing: { framework: 'Vitest + Supertest + Playwright', conventions: 'Tests en __tests__. Nombres *.spec.ts. Coverage mínimo 80% en services.', definitionOfDone: 'Código implementado, validado, con tests, sin errores de lint, documentación actualizada.' },
    planning: { roadmap: 'MVP: auth, productos, movimientos.\nV2: reportes y alertas.\nV3: integración ERP.', decisions: 'Usar monolito modular para reducir complejidad inicial. Usar MySQL por disponibilidad del equipo.', risks: 'Riesgo de concurrencia en movimientos. Riesgo de roles mal definidos.' },
    agentRules: { codingStyles: 'Usar camelCase en JS/TS. Separar controllers, services y repositories. No lógica de negocio en rutas.', behaviorRules: 'Usar transacciones en movimientos de stock. Validar inputs. Manejar errores centralizados. No devolver stack al cliente.', forbiddenActions: 'No cambiar stack sin justificar. No borrar migraciones. No exponer secrets.' },
    glossary: { terms: 'Stock: existencias actuales\nMovement: movimiento de stock\nOperator: usuario operativo', forbiddenTerms: 'Depósito como Store. Usar Warehouse si corresponde.' }
  }
};

function f(name, label, type, placeholder = '', required = false, suggestions = []) {
  return { name, label, type, placeholder, required, suggestions };
}

function blankData() {
  const data = {};
  STEPS.forEach(s => {
    data[s.id] = {};
    s.fields.forEach(x => data[s.id][x.name] = '');
  });
  return data;
}

let state = { view: 'landing', step: 0, tab: 'agents', data: blankData(), errors: {} };

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved?.data) {
      const mergedData = blankData();
      for (const stepId in mergedData) {
        if (saved.data[stepId]) {
          for (const fieldName in mergedData[stepId]) {
            if (saved.data[stepId][fieldName] !== undefined) {
              mergedData[stepId][fieldName] = saved.data[stepId][fieldName];
            }
          }
        }
      }
      state = { ...state, ...saved, data: mergedData, errors: {} };
    }
  } catch (e) {
    console.warn(e);
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ view: state.view, step: state.step, tab: state.tab, data: state.data }));
}

function esc(s = '') {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

function completion() {
  let total = 0, filled = 0, required = 0, requiredFilled = 0;
  STEPS.forEach(s => s.fields.forEach(field => {
    total++;
    const v = (state.data[s.id]?.[field.name] || '').trim();
    if (v) filled++;
    if (field.required) {
      required++;
      if (v) requiredFilled++;
    }
  }));
  return {
    total,
    filled,
    required,
    requiredFilled,
    percent: Math.round((filled / total) * 100),
    requiredPercent: Math.round((requiredFilled / required) * 100)
  };
}

function validate() {
  const errors = {};
  STEPS.forEach(s => s.fields.forEach(field => {
    const v = (state.data[s.id]?.[field.name] || '').trim();
    if (field.required && !v) errors[`${s.id}.${field.name}`] = 'Campo recomendado para una spec útil.';
    if (field.name === 'openapiJson' && v) {
      try {
        JSON.parse(v);
      } catch (e) {
        errors[`${s.id}.${field.name}`] = 'El JSON no es válido.';
      }
    }
  }));
  state.errors = errors;
  return errors;
}

function qualityIssues() {
  validate();
  const d = state.data, issues = [];
  const need = (cond, msg) => { if (cond) issues.push(msg); };
  need(!d.product?.mvpScope?.trim(), 'Falta definir alcance del MVP.');
  need(!d.product?.outOfScope?.trim(), 'Falta explicitar fuera de alcance.');
  need(!d.requirements?.acceptanceCriteria?.trim(), 'Faltan criterios de aceptación verificables.');
  need(!d.domain?.entities?.trim(), 'Falta modelo de dominio con entidades.');
  need(!d.testing?.definitionOfDone?.trim(), 'Falta Definition of Done.');
  need(d.api?.apiStyle === 'REST' && !d.api?.errorModel?.trim(), 'Si usás REST, conviene definir modelo de errores.');
  return issues;
}

function stepDone(i) {
  const s = STEPS[i];
  return s.fields.filter(x => x.required).every(x => (state.data[s.id]?.[x.name] || '').trim());
}

function renderShell(inner, side = true) {
  return `<header class="header"><div class="brand" data-action="home">ProjectSpec Pro</div><div class="header-actions"><button class="btn btn-secondary secondary-small" data-action="preview">Vista previa</button><button class="btn btn-secondary" data-action="export-md">Exportar MD</button><button class="btn btn-primary" data-action="export">Exportar ZIP</button></div></header><main class="main">${side ? renderSidebar() : ''}<section class="content">${renderMobileStepper()}${inner}</section></main>`;
}

function renderSidebar() {
  return `<aside class="sidebar">${STEPS.map((s, i) => `<button class="side-item ${i === state.step && state.view === 'wizard' ? 'active' : ''} ${stepDone(i) ? 'done' : ''}" data-action="step" data-index="${i}"><span>${i + 1}. ${esc(s.title)}</span><span class="dot"></span></button>`).join('')}<button class="side-item ${state.view === 'preview' ? 'active' : ''}" data-action="preview"><span>✓ Vista previa</span><span class="dot"></span></button></aside>`;
}

function renderMobileStepper() {
  return `<div class="mobile-stepper">${STEPS.map((s, i) => `<div class="mobile-step ${i === state.step ? 'active' : ''} ${stepDone(i) ? 'done' : ''}" title="${esc(s.title)}"></div>`).join('')}</div>`;
}

function renderLanding() {
  const c = completion();
  return `<header class="header"><div class="brand">ProjectSpec Pro</div></header><main class="hero"><h1>Especificaciones vivas para desarrollo con IA.</h1><p>Guiá producto, arquitectura, requisitos y reglas para agentes. Exportá documentación lista para Claude Code, OpenCode, Cursor, Copilot y OpenClaw.</p><div class="hero-actions"><button class="btn btn-primary" data-action="start">Crear nuevo proyecto</button><button class="btn btn-secondary" data-action="example">Cargar ejemplo</button>${c.filled ? '<button class="btn btn-secondary" data-action="continue">Continuar guardado</button>' : ''}</div></main>`;
}

function renderWizard() {
  validate();
  const s = STEPS[state.step];
  const c = completion();
  return renderShell(`<div class="progress"><div class="progress-fill" style="width:${((state.step) / (STEPS.length)) * 100}%"></div></div><div class="grid two-col"><div><h2>${esc(s.title)}</h2><p>${esc(s.desc)}</p><div class="card" style="margin-top:20px">${s.fields.map(field => renderField(s, field)).join('')}<div class="footer"><button class="btn btn-secondary ${state.step === 0 ? 'hidden' : ''}" data-action="prev">Atrás</button><div></div><button class="btn btn-primary" data-action="next">${state.step === STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}</button></div></div></div><aside>${renderQualityPanel(c)}</aside></div>`);
}

function renderField(step, field) {
  const key = `${step.id}.${field.name}`, val = state.data[step.id]?.[field.name] || '', err = state.errors[key];
  let control = '';
  if (field.type === 'textarea') control = `<textarea class="textarea" data-input="1" data-step="${step.id}" data-field="${field.name}" placeholder="${esc(field.placeholder)}">${esc(val)}</textarea>`;
  else if (field.type === 'select') control = `<select class="select" data-input="1" data-step="${step.id}" data-field="${field.name}"><option value="">Seleccionar...</option>${field.suggestions.map(o => `<option ${val === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  else control = `<input class="input" data-input="1" data-step="${step.id}" data-field="${field.name}" value="${esc(val)}" placeholder="${esc(field.placeholder)}" />`;
  const chips = field.type !== 'select' && field.suggestions?.length ? `<div class="chips">${field.suggestions.map(x => `<button class="chip" data-action="chip" data-step="${step.id}" data-field="${field.name}" data-value="${esc(x)}">${esc(x)}</button>`).join('')}</div>` : '';
  return `<div class="field ${err ? 'error' : ''}"><div class="label-row"><label class="label">${esc(field.label)}</label>${field.required ? '<span class="req">recomendado</span>' : '<span class="help">opcional</span>'}</div>${control}${chips}${err ? `<div class="field-message">${esc(err)}</div>` : ''}</div>`;
}

function renderQualityPanel(c) {
  const issues = qualityIssues();
  return `<div class="card"><div class="score-wrap"><div class="score-ring" style="--score:${c.percent}%"><span>${c.percent}</span></div><div><h3>Calidad de spec</h3><p>${c.requiredFilled}/${c.required} campos clave completos.</p></div></div><ul class="score-list">${issues.slice(0, 6).map(i => `<li>• ${esc(i)}</li>`).join('') || '<li>• La especificación tiene una base sólida.</li>'}</ul><div class="notice ${issues.length ? 'warn' : 'ok'}">${issues.length ? 'La app puede exportar igual, pero estos puntos mejoran mucho el resultado para agentes IA.' : 'Lista para exportar y usar como base de desarrollo.'}</div><button class="btn btn-secondary" data-action="auto-improve" style="width:100%">Sugerir mejoras rápidas</button></div>`;
}

function renderPreview() {
  validate();
  const c = completion(), issues = qualityIssues();
  const label = DOCS.find(([k]) => k === state.tab)?.[1] || 'Documento';
  return renderShell(`<h2>Vista previa de documentos</h2><p>Exportación ampliada para Spec-Driven Development y agentes IA.</p><div class="quality-grid"><div class="metric"><strong>${c.percent}%</strong><span>Completitud general</span></div><div class="metric"><strong>${c.requiredPercent}%</strong><span>Campos clave</span></div><div class="metric"><strong>${issues.length}</strong><span>Alertas de calidad</span></div></div><div class="tabs">${DOCS.map(([k, l]) => `<button class="tab ${state.tab === k ? 'active' : ''}" data-action="tab" data-tab="${k}">${l}</button>`).join('')}</div><div class="label-row"><h3>${label}</h3><button class="btn btn-secondary" data-action="copy">Copiar</button></div><pre class="preview" id="previewText">${esc(md[state.tab](state.data))}</pre><div class="footer"><button class="btn btn-secondary" data-action="step" data-index="${state.step}">Editar</button><button class="btn btn-secondary" data-action="export-md">Exportar MD</button><button class="btn btn-primary" data-action="export">Exportar ZIP</button></div>`);
}

function render() {
  const app = document.getElementById('app');
  if (state.view === 'landing') app.innerHTML = renderLanding();
  else if (state.view === 'preview') app.innerHTML = renderPreview();
  else app.innerHTML = renderWizard();
  save();
}

document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.input) {
    state.data[t.dataset.step][t.dataset.field] = t.value;
    save();
    const aside = document.querySelector('aside');
    if (aside && state.view === 'wizard') {
      aside.innerHTML = renderQualityPanel(completion());
    }
  }
});

document.addEventListener('click', async e => {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const a = t.dataset.action;
  if (a === 'home') { state.view = 'landing'; }
  if (a === 'start') { state.data = blankData(); state.step = 0; state.view = 'wizard'; }
  if (a === 'continue') { state.view = 'wizard'; }
  if (a === 'example') { state.data = JSON.parse(JSON.stringify(EXAMPLES.inventory)); state.step = 0; state.view = 'wizard'; }
  if (a === 'step') { state.step = Number(t.dataset.index); state.view = 'wizard'; }
  if (a === 'next') { if (state.step < STEPS.length - 1) state.step++; else state.view = 'preview'; }
  if (a === 'prev') { state.step = Math.max(0, state.step - 1); }
  if (a === 'preview') { state.view = 'preview'; }
  if (a === 'tab') { state.tab = t.dataset.tab; }
  if (a === 'chip') { const cur = state.data[t.dataset.step][t.dataset.field] || ''; state.data[t.dataset.step][t.dataset.field] = cur + (cur ? ', ' : '') + t.dataset.value; }
  if (a === 'auto-improve') { autoImprove(); }
  if (a === 'copy') {
    try {
      await navigator.clipboard.writeText(md[state.tab](state.data));
      alert('Documento copiado.');
    } catch (err) {
      console.error('Error copying:', err);
      alert('No se pudo copiar automáticamente. Por favor, selecciona el texto y cópialo.');
    }
  }
  if (a === 'export-md') { exportAsSingleMarkdown(); return; }
  if (a === 'export') { exportZip(); return; }
  render();
});

function autoImprove() {
  const d = state.data;
  if (!d.product.outOfScope) d.product.outOfScope = 'No incluye integraciones externas, pagos, app mobile nativa ni analítica avanzada en el MVP.';
  if (!d.requirements.acceptanceCriteria) d.requirements.acceptanceCriteria = 'Dado un usuario autorizado, cuando completa una acción principal, entonces el sistema valida datos, guarda cambios y muestra feedback claro.\nDado un dato inválido, cuando intenta guardar, entonces el sistema bloquea la acción y explica el error.';
  if (!d.testing.definitionOfDone) d.testing.definitionOfDone = 'Una tarea está terminada cuando cumple criterios de aceptación, tiene validaciones, manejo de errores, pruebas básicas y documentación actualizada.';
  if (!d.planning.risks) d.planning.risks = 'Riesgo de alcance demasiado amplio. Riesgo de requerimientos ambiguos. Riesgo de baja calidad si no se definen criterios verificables.';
}

load();
render();
