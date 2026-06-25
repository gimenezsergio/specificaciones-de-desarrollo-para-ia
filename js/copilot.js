let copilotChatHistory = [];
let copilotIsThinking = false;
let copilotIsListening = false;
let copilotRecognition = null;

const COPILOT_SYSTEM_INSTRUCTION = `Eres "ProjectSpec Copiloto", un consultor de software principal y experto en Spec-Driven Development. Tu trabajo es guiar al usuario en una entrevista interactiva para completar su especificación técnica del proyecto.
El formulario tiene 12 secciones:
- general: name, projectType, description, objective, successMetrics
- product: targetAudience, problem, valueProposition, mvpScope, outOfScope, businessRules
- requirements: rolesMatrix, functionalReqs, nonFunctionalReqs, useCases, acceptanceCriteria
- ui: designSystem, theme, mainScreens, mainFlows
- architecture: pattern, stackDefinitive, authProvider, deployment, folderStructure
- domain: entities, relationships, states, domainEvents
- database: dbType, schemaDetails, dataSensitivity
- api: apiStyle, openapiJson, errorModel
- testing: framework, conventions, definitionOfDone
- planning: roadmap, decisions, risks
- agentRules: codingStyles, behaviorRules, forbiddenActions
- glossary: terms, forbiddenTerms

Reglas:
1. Haz preguntas claras, amigables y concisas en español.
2. No abrumes al usuario. Haz una pregunta a la vez (por ejemplo, empieza preguntando el nombre y tipo de proyecto).
3. A medida que el usuario te dé información, utiliza la función \`updateFields\` para rellenar los campos correspondientes. Si el usuario te da información que aplica a varios campos, actualízalos a la vez.
4. Sé conversacional. Explica brevemente qué campos has actualizado en tu respuesta de texto (ej. "¡Perfecto! Ya configuré el nombre como '...' y la descripción como '...'").
5. Si el usuario responde con voz, sé tolerante a errores de transcripción comunes.`;

const COPILOT_TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'updateFields',
        description: 'Actualiza campos específicos en el formulario de especificaciones del proyecto.',
        parameters: {
          type: 'OBJECT',
          properties: {
            fields: {
              type: 'ARRAY',
              description: 'Lista de campos a actualizar.',
              items: {
                type: 'OBJECT',
                properties: {
                  step: { type: 'STRING', description: 'ID del paso/pestaña.' },
                  field: { type: 'STRING', description: 'Nombre del campo dentro del paso.' },
                  value: { type: 'STRING', description: 'Nuevo valor textual para el campo.' }
                },
                required: ['step', 'field', 'value']
              }
            }
          },
          required: ['fields']
        }
      }
    ]
  }
];

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  copilotRecognition = new SpeechRecognition();
  copilotRecognition.lang = 'es-ES';
  copilotRecognition.continuous = true;
  copilotRecognition.interimResults = false;
  copilotRecognition.maxAlternatives = 1;

  copilotRecognition.onstart = () => {
    copilotIsListening = true;
    const micBtn = document.getElementById('copilotMicBtn');
    if (micBtn) {
      micBtn.classList.add('active');
      micBtn.innerText = '🛑';
    }
  };

  copilotRecognition.onend = () => {
    copilotIsListening = false;
    const micBtn = document.getElementById('copilotMicBtn');
    if (micBtn) {
      micBtn.classList.remove('active');
      micBtn.innerText = '🎙️';
    }
  };

  copilotRecognition.onresult = (event) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + ' ';
      }
    }
    const input = document.getElementById('copilotInput');
    if (input && finalTranscript) {
      input.value = (input.value ? input.value.trim() + ' ' : '') + finalTranscript.trim();
    }
  };

  copilotRecognition.onerror = (e) => {
    console.error('Speech recognition error:', e);
    copilotIsListening = false;
    const micBtn = document.getElementById('copilotMicBtn');
    if (micBtn) {
      micBtn.classList.remove('active');
      micBtn.innerText = '🎙️';
    }
    if (e.error === 'not-allowed') {
      alert('Error de micrófono: Acceso denegado. Por favor, concede permisos de micrófono a la página en tu navegador.');
    } else if (e.error === 'no-speech') {
      console.warn('Speech recognition: No speech detected.');
    } else {
      alert('Error en el dictado por voz: ' + e.error);
    }
  };
}

function toggleListening() {
  if (!copilotRecognition) {
    alert('El dictado por voz no está soportado en este navegador. Te recomendamos usar Google Chrome.');
    return;
  }
  if (copilotIsListening) {
    copilotRecognition.stop();
  } else {
    copilotRecognition.start();
  }
}

async function sendCopilotMessage(userText) {
  if (!userText.trim()) return;

  // Add user message to history
  copilotChatHistory.push({
    role: 'user',
    parts: [{ text: userText }]
  });

  copilotIsThinking = true;
  updateCopilotUI();

  try {
    await callGeminiAPI();
  } catch (error) {
    console.error('Error in Copilot call:', error);
    copilotChatHistory.push({
      role: 'model',
      parts: [{ text: `⚠️ Error de conexión: ${error.message}. Asegúrate de que server.py esté en ejecución y que hayas cargado tu API Key en el archivo .env.` }]
    });
  } finally {
    copilotIsThinking = false;
    updateCopilotUI();
  }
}

async function callGeminiAPI() {
  // Format request body
  const contents = copilotChatHistory.map(h => ({
    role: h.role,
    parts: h.parts
  }));

  const payload = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: COPILOT_SYSTEM_INSTRUCTION }]
    },
    tools: COPILOT_TOOLS
  };

  const response = await fetch('/api/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errMsg = (errorJson.error && typeof errorJson.error === 'object')
      ? (errorJson.error.message || JSON.stringify(errorJson.error))
      : (errorJson.error || `HTTP ${response.status}`);
    throw new Error(errMsg);
  }

  const result = await response.json();
  const candidate = result.candidates?.[0];
  const modelMessage = candidate?.content;

  if (!modelMessage) {
    throw new Error('Respuesta inválida del modelo Gemini');
  }

  // Push model message to history
  copilotChatHistory.push({
    role: 'model',
    parts: modelMessage.parts
  });

  // Check if model wants to call a function
  const functionCalls = modelMessage.parts.filter(p => p.functionCall);
  if (functionCalls.length > 0) {
    const responseParts = [];
    for (const call of functionCalls) {
      if (call.functionCall.name === 'updateFields') {
        const args = call.functionCall.args;
        const updatedInfo = executeUpdateFields(args.fields);
        
        responseParts.push({
          functionResponse: {
            name: 'updateFields',
            response: { status: 'success', updated: updatedInfo }
          }
        });
      }
    }

    if (responseParts.length > 0) {
      // Add all function responses in a single message to match Gemini's parallel tool response structure
      copilotChatHistory.push({
        role: 'user',
        parts: responseParts
      });

      // A single recursive call to Gemini to let it produce the text reply matching the tools execution
      await callGeminiAPI();
    }
  }
}

function executeUpdateFields(fieldsToUpdate) {
  const updatedLogs = [];
  if (!Array.isArray(fieldsToUpdate)) return updatedLogs;

  fieldsToUpdate.forEach(item => {
    const { step, field, value } = item;
    // Check if step and field exist
    const stepConfig = STEPS.find(s => s.id === step);
    if (stepConfig) {
      const fieldConfig = stepConfig.fields.find(f => f.name === field);
      if (fieldConfig) {
        if (!state.data[step]) state.data[step] = {};
        state.data[step][field] = value;
        updatedLogs.push(`${step}.${field}`);
      }
    }
  });

  save();
  return updatedLogs;
}

function renderCopilotView() {
  const c = completion();
  const historyHtml = copilotChatHistory.filter(msg => {
    // Only display user text and model text to the user, hide function calls/responses in the chat bubble UI
    const textPart = msg.parts?.[0]?.text;
    return textPart && (msg.role === 'user' || msg.role === 'model');
  }).map(msg => {
    const isUser = msg.role === 'user';
    const text = msg.parts[0].text;
    return `
      <div class="chat-bubble-wrapper ${isUser ? 'user' : 'model'}">
        <div class="chat-bubble">
          <strong>${isUser ? 'Tú' : 'Copiloto'}</strong>
          <p>${esc(text).replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `;
  }).join('');

  const defaultWelcome = copilotChatHistory.length === 0 ? `
    <div class="chat-welcome">
      <h3>👋 ¡Hola! Soy tu Copiloto IA</h3>
      <p>Estoy listo para ayudarte a armar las especificaciones de tu proyecto. Cuéntame sobre tu idea en español, o pulsa el botón de micrófono para hablarme de forma natural.</p>
    </div>
  ` : '';

  return `
    <div class="copilot-container">
      <div class="copilot-header">
        <div>
          <h2>Entrevista con Copiloto IA</h2>
          <span class="secure-badge">🛡️ Conexión segura mediante Servidor Proxy Python</span>
        </div>
        <button class="btn btn-secondary" data-action="step" data-index="0">Volver al Wizard</button>
      </div>

      <div class="copilot-layout">
        <div class="copilot-chat-pane">
          <div class="chat-history" id="chatHistoryContainer">
            ${defaultWelcome}
            ${historyHtml}
            ${copilotIsThinking ? `
              <div class="chat-bubble-wrapper model">
                <div class="chat-bubble thinking">
                  <span>Pensando...</span>
                  <div class="dot-loader"></div>
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="chat-input-area">
            <button class="btn btn-secondary mic-btn ${copilotIsListening ? 'active' : ''}" id="copilotMicBtn" title="Dictado por voz">
              ${copilotIsListening ? '🛑' : '🎙️'}
            </button>
            <input type="text" class="input" id="copilotInput" placeholder="Describe tu proyecto, ideas o detalles aquí..." />
            <button class="btn btn-primary" id="copilotSendBtn">Enviar</button>
          </div>
        </div>

        <aside class="copilot-status-pane">
          ${renderQualityPanel(c)}
          <div class="flat-card" style="margin-top: 18px">
            <h3>Progreso por sección</h3>
            <div style="margin-top:12px; display:grid; gap:8px">
              ${STEPS.map((s, i) => {
                const done = stepDone(i);
                return `
                  <div style="display:flex; justify-content:space-between; font-size:12px">
                    <span style="color: ${done ? '#111' : '#666'}">${i+1}. ${esc(s.title)}</span>
                    <span style="color: ${done ? 'var(--color-ok)' : '#aaa'}">${done ? '✓ Listo' : 'Incompleto'}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
}

function updateCopilotUI() {
  if (state.view !== 'copilot') return;
  const contentSection = document.querySelector('.content');
  if (contentSection) {
    // Determine scroll position before re-rendering
    const chatContainer = document.getElementById('chatHistoryContainer');
    const shouldScroll = chatContainer ? (chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 100) : true;
    
    // Render the view
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.innerHTML = renderSidebar();
    
    const stepper = document.querySelector('.mobile-stepper');
    if (stepper) stepper.innerHTML = renderMobileStepper();

    // Replace copilot section content
    const copilotWrapper = document.getElementById('copilotWrapper');
    if (copilotWrapper) {
      copilotWrapper.innerHTML = renderCopilotView();
    } else {
      contentSection.innerHTML = `<div id="copilotWrapper">${renderCopilotView()}</div>`;
    }

    // Scroll to bottom
    const newChatContainer = document.getElementById('chatHistoryContainer');
    if (newChatContainer && shouldScroll) {
      newChatContainer.scrollTop = newChatContainer.scrollHeight;
    }

    // Bind event listeners specific to chat pane
    bindCopilotEvents();
  }
}

function bindCopilotEvents() {
  const sendBtn = document.getElementById('copilotSendBtn');
  const input = document.getElementById('copilotInput');
  const micBtn = document.getElementById('copilotMicBtn');

  if (sendBtn && input) {
    const handleSend = () => {
      const text = input.value;
      input.value = '';
      if (copilotIsListening && copilotRecognition) {
        copilotRecognition.stop();
      }
      sendCopilotMessage(text);
    };

    sendBtn.onclick = handleSend;
    input.onkeydown = (e) => {
      if (e.key === 'Enter') handleSend();
    };
  }

  if (micBtn) {
    micBtn.onclick = toggleListening;
  }
}

// Initialize speech recognition on load
initSpeechRecognition();
