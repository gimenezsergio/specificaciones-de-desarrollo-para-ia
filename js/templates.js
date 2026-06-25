const md = {
  agents: d => `# AGENTS.md\n\n## Project Context\nProyecto: ${v(d?.general?.name)}\nTipo: ${v(d?.general?.projectType)}\nDescripción: ${v(d?.general?.description)}\n\n## Tech Stack\n${v(d?.architecture?.stackDefinitive)}\n\n## Architecture Rules\n${v(d?.architecture?.pattern)}\n\n## Coding Standards\n${v(d?.agentRules?.codingStyles)}\n\n## Behavior Rules\n${v(d?.agentRules?.behaviorRules)}\n\n## Forbidden Actions\n${v(d?.agentRules?.forbiddenActions)}\n\n## Definition of Done\n${v(d?.testing?.definitionOfDone)}\n`,
  product: d => `# PRODUCT.md\n\n## Visión\n${v(d?.general?.objective)}\n\n## Métricas de éxito\n${v(d?.general?.successMetrics)}\n\n## Público objetivo\n${v(d?.product?.targetAudience)}\n\n## Problema\n${v(d?.product?.problem)}\n\n## Propuesta de valor\n${v(d?.product?.valueProposition)}\n\n## MVP Scope\n${v(d?.product?.mvpScope)}\n\n## Out of Scope\n${v(d?.product?.outOfScope)}\n\n## Reglas de negocio\n${v(d?.product?.businessRules)}\n`,
  requirements: d => `# REQUIREMENTS.md\n\n## Roles y permisos\n${v(d?.requirements?.rolesMatrix)}\n\n## Requerimientos funcionales\n${v(d?.requirements?.functionalReqs)}\n\n## Requerimientos no funcionales\n${v(d?.requirements?.nonFunctionalReqs)}\n\n## Casos de uso\n${v(d?.requirements?.useCases)}\n`,
  userStories: d => `# USER_STORIES.md\n\n> Generadas como base a partir de roles, casos de uso y alcance.\n\n${stories(d)}\n`,
  acceptance: d => `# ACCEPTANCE_CRITERIA.md\n\n${v(d?.requirements?.acceptanceCriteria)}\n\n## Checklist mínimo\n- [ ] Cada historia tiene criterio Dado/Cuando/Entonces.\n- [ ] Cada regla de negocio tiene prueba asociada.\n- [ ] Los errores principales están contemplados.\n`,
  architecture: d => `# ARCHITECTURE.md\n\n## Patrón\n${v(d?.architecture?.pattern)}\n\n## Stack\n${v(d?.architecture?.stackDefinitive)}\n\n## Autenticación\n${v(d?.architecture?.authProvider)}\n\n## Deploy\n${v(d?.architecture?.deployment)}\n\n## Estructura\n\n\`\`\`txt\n${v(d?.architecture?.folderStructure)}\n\`\`\`\n`,
  domainModel: d => `# DOMAIN_MODEL.md\n\n## Entidades\n${v(d?.domain?.entities)}\n\n## Relaciones\n${v(d?.domain?.relationships)}\n\n## Estados\n${v(d?.domain?.states)}\n\n## Eventos\n${v(d?.domain?.domainEvents)}\n\n## Diagrama Mermaid sugerido\n\n\`\`\`mermaid\nerDiagram\n${mermaid(d)}\n\`\`\`\n`,
  database: d => `# DATABASE.md\n\n## Motor\n${v(d?.database?.dbType)}\n\n## Esquema\n\n\`\`\`txt\n${v(d?.database?.schemaDetails)}\n\`\`\`\n\n## Datos sensibles\n${v(d?.database?.dataSensitivity)}\n`,
  openapi: d => d?.api?.openapiJson?.trim() || JSON.stringify({ openapi: '3.0.0', info: { title: d?.general?.name || 'ProjectSpec API', version: '0.1.0' }, paths: {} }, null, 2),
  testing: d => `# TESTING.md\n\n## Frameworks\n${v(d?.testing?.framework)}\n\n## Convenciones\n${v(d?.testing?.conventions)}\n\n## Definition of Done\n${v(d?.testing?.definitionOfDone)}\n`,
  roadmap: d => `# ROADMAP.md\n\n${v(d?.planning?.roadmap)}\n\n## Sugerencia\n- MVP: resolver el flujo principal completo.\n- V2: mejorar calidad, reportes e integraciones.\n- V3: automatización, colaboración y escalabilidad.\n`,
  decisions: d => `# DECISIONS.md\n\n${v(d?.planning?.decisions)}\n\n## Formato recomendado\n### ADR-001: Título\n- Contexto:\n- Decisión:\n- Consecuencias:\n`,
  risks: d => `# RISKS.md\n\n${v(d?.planning?.risks)}\n\n## Checklist\n- [ ] Riesgos técnicos identificados.\n- [ ] Riesgos de UX identificados.\n- [ ] Supuestos explicitados.\n`,
  glossary: d => `# GLOSSARY.md\n\n## Términos\n${v(d?.glossary?.terms)}\n\n## Términos prohibidos o ambiguos\n${v(d?.glossary?.forbiddenTerms)}\n`
};

function v(x) {
  return x?.trim() || 'No definido';
}

function stories(d) {
  const roles = (d?.requirements?.rolesMatrix || 'Usuario').split('\n').filter(Boolean).slice(0, 4);
  const flows = (d?.requirements?.useCases || d?.product?.mvpScope || 'usar el sistema').split('\n').filter(Boolean).slice(0, 5);
  return flows.map((flow, i) => `## Historia ${i + 1}\nComo usuario del sistema, quiero ${flow.replace(/^[-*\d. ]+/,'')}, para obtener valor del producto.\n\n### Criterios\n- [ ] Escenario principal definido.\n- [ ] Validaciones definidas.\n- [ ] Error esperado definido.\n`).join('\n');
}

function mermaid(d) {
  const ents = (d?.domain?.entities || 'User, Project, Requirement').split(/[\n,]/).map(x => x.trim()).filter(Boolean).slice(0, 8);
  return ents.map(e => `  ${e.replace(/\W/g, '_')} {\n    string id\n  }`).join('\n');
}
