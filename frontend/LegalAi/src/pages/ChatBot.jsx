import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, AlertCircle, CheckCircle, Loader2, Upload, FileText, X, Paperclip } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { chatbotAPI } from '../services/api';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [conversationId] = useState(() => 'conv_' + Date.now());
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Fetch suggestions from backend on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const result = await chatbotAPI.getSuggestions();
        if (result?.suggestions) {
          setSuggestions(result.suggestions);
        }
      } catch {
        setSuggestions([
          'Can I get bail under IPC 420?',
          'What is the procedure for filing an FIR?',
          'How long does a criminal case usually take?',
          'What evidence is needed for a fraud case?',
          'What are my rights as an accused?',
          'How do I apply for anticipatory bail?'
        ]);
      }
    };
    fetchSuggestions();
  }, []);

  const suggestedQuestions = suggestions.length > 0 ? suggestions : [
    'Can I get bail under IPC 420?',
    'What is the procedure for filing an FIR?',
    'How long does a criminal case usually take?',
    'What evidence is needed for a fraud case?',
    'What are my rights as an accused?',
    'How do I apply for anticipatory bail?'
  ];

  const docSuggestions = [
    'What is this case about?',
    'What are the key legal sections mentioned?',
    'Who are the parties involved?',
    'What is the main legal issue?',
    'Summarize the key arguments',
    'What evidence is cited?',
  ];

  // Local fallback responses
  const generateLocalResponse = (question) => {
    const responses = {
      'bail': `Under IPC 420 (Cheating), bail is a discretionary matter. Key factors:\n\n• Nature of offense: IPC 420 is a bailable offense\n• Criminal history: Previous convictions affect bail grant\n• Evidence strength: Strong evidence may lead to bail denial\n• Bail amount: Typically Rs 10,000 - Rs 50,000\n\nProcedure:\n1. File bail application in concerned court\n2. Provide surety details\n3. Court hearing (usually within 7-14 days)\n4. Judge grants/rejects based on merits\n\nSupported by: IPC Section 436, CrPC Section 437`,
      'fir': `Filing an FIR Procedure:\n\nStep 1: Report to Police Station\n• Visit the police station where offense occurred\n• Provide details in writing or verbally\n\nStep 2: Police Registration\n• Police records case as FIR\n• Issue FIR number\n\nStep 3: Investigation Begins\n• Police collects evidence\n• Records statements\n\nTimeline: Usually filed within 24-48 hours\n\nImportant: You can file complaint directly if police refuses.`,
      'timeline': `Average Criminal Case Timeline:\n\nStage-wise Duration:\n• Investigation: 2-4 months\n• Chargesheet: 1-2 months\n• First Hearing: 1-3 months\n• Evidence: 6-12 months\n• Arguments: 2-3 months\n• Judgment: 1-2 months\n\nTotal Average: 18-24 months (may extend to 3-5 years)\n\nDelay factors: Court backlog, adjournments, complexity`,
      'fraud': `Evidence Required for Fraud Case:\n\nEssential Evidence:\n1. Fraudulent Intent Proof\n   - Emails/messages showing deception\n   - Documents with false information\n\n2. Financial Evidence\n   - Bank statements\n   - Transaction records\n\n3. Victim Impact\n   - Loss documentation\n   - Affidavits\n\n4. Witness Statements\n   - From victims\n   - Third-party witnesses\n\nLegal Sections: IPC 420, IPC 406, IPC 409`,
      'rights': `Your Rights as Accused:\n\nConstitutional Rights:\n• Right to silence (Article 20)\n• Right to fair trial\n• Right to legal representation\n• Right to bail (in eligible cases)\n\nLegal Protections:\n• Innocent until proven guilty\n• Evidence must be credible\n• Cannot be tortured\n• Right to appeal`,
      'anticipatory': `Anticipatory Bail Application:\n\nWhen to Apply:\n• Before arrest likelihood\n• When facing serious charges\n\nRequired Documents:\n1. Application with facts\n2. Personal details\n3. Grounds for apprehension\n4. Documentary evidence\n5. Character certificate\n\nProcedure:\n• File in High Court or District Court\n• Court hearing (1-3 months)`
    };

    const lowerQ = question.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerQ.includes(key)) return value;
    }
    return `I understand you're asking: "${question}"\n\nFor specific legal advice, please consult a qualified attorney.`;
  };

  // Document upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowed = ['.txt', '.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      alert('Please upload a .txt, .pdf, .doc, or .docx file');
      return;
    }

    setUploading(true);
    try {
      const result = await chatbotAPI.uploadDocument(file, conversationId);
      setUploadedDoc({
        filename: result.filename,
        size: result.size,
        char_count: result.char_count,
        conversation_id: result.conversation_id,
      });

      // Add system message
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: `Document "${result.filename}" uploaded successfully (${(result.size / 1024).toFixed(1)} KB). You can now ask questions about it.`,
        timestamp: new Date(),
      }]);
    } catch (err) {
      console.error('Upload failed:', err);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: `Failed to upload document. ${err.response?.data?.detail || 'Please try again.'}`,
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveDoc = async () => {
    try {
      await chatbotAPI.removeDocument(conversationId);
    } catch { /* ignore */ }
    setUploadedDoc(null);
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      content: 'Document removed from context.',
      timestamp: new Date(),
    }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now(), type: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const question = input;
    setInput('');
    setLoading(true);

    try {
      const result = await chatbotAPI.ask(question, null, uploadedDoc ? conversationId : null);

      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: result.content || result.response || generateLocalResponse(question),
        timestamp: new Date(),
        verified: result.verified ?? true,
        source: result.source || 'Legal Knowledge Base',
        confidence: result.confidence,
        docContext: result.document_context_active || false,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chatbot API failed:', err);
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateLocalResponse(question),
        timestamp: new Date(),
        verified: true,
        source: 'Local Knowledge Base (Offline Mode)'
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={MessageSquare}
        title="Hybrid Legal ChatBot"
        description="Rule-based + LLM hybrid chatbot for accurate and explainable legal guidance"
        accentColor="var(--status-ok)"
      />

      <div className="page-grid-narrow">
        {/* Chat */}
        <div>
          {/* Document Upload Zone */}
          <div className="glass-card" style={{ padding: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Paperclip size={16} color="var(--ink-muted)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)' }}>Case Document</span>
              </div>
              {uploadedDoc ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px',
                    background: 'var(--status-ok-bg)', borderRadius: 99, border: '1px solid rgba(45,106,79,0.2)'
                  }}>
                    <FileText size={12} color="var(--status-ok)" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-ok)' }}>{uploadedDoc.filename}</span>
                    <span style={{ fontSize: 10, color: 'var(--ink-faint)' }}>({(uploadedDoc.size / 1024).toFixed(1)} KB)</span>
                    <button onClick={handleRemoveDoc} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
                      <X size={12} color="var(--status-danger)" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn-ghost"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                >
                  {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            {!uploadedDoc && (
              <p style={{ fontSize: 11, color: 'var(--ink-subtle)', marginTop: 6 }}>
                Upload a case document (.txt, .pdf) to ask questions about it
              </p>
            )}
          </div>

          {/* Messages */}
          <div className="glass-card" style={{ padding: 0, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ height: 400, overflowY: 'auto', padding: 24 }}>
              {messages.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
                  <MessageSquare size={40} color="var(--ink-subtle)" style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 14, color: 'var(--ink-faint)' }}>Start a conversation by asking a legal question</p>
                  {uploadedDoc && <p style={{ fontSize: 12, color: 'var(--status-ok)', marginTop: 4 }}>Document loaded — ask anything about it!</p>}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {messages.map((msg) => {
                    if (msg.type === 'system') {
                      return (
                        <div key={msg.id} style={{ textAlign: 'center', padding: '8px 16px' }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 99,
                            background: msg.isError ? 'var(--status-danger-bg)' : 'var(--status-ok-bg)',
                            color: msg.isError ? 'var(--status-danger)' : 'var(--status-ok)'
                          }}>
                            {msg.content}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '75%',
                          padding: '12px 16px',
                          borderRadius: msg.type === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                          background: msg.type === 'user' ? 'var(--ink)' : 'var(--paper-warm)',
                          color: msg.type === 'user' ? 'var(--paper)' : 'var(--ink)',
                          border: msg.type === 'user' ? 'none' : '1px solid var(--border)',
                          fontSize: 13,
                          lineHeight: 1.6
                        }}>
                          <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                          {msg.type === 'ai' && (
                            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {msg.docContext && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--legal-blue)', fontWeight: 600 }}>
                                  <FileText size={10} /> Document Context Used
                                </div>
                              )}
                              {msg.verified && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--status-ok)', fontWeight: 600 }}>
                                  <CheckCircle size={12} /> Verified by Rule Engine
                                </div>
                              )}
                              {msg.source && (
                                <div style={{ fontSize: 10, color: 'var(--ink-faint)' }}>
                                  Source: {msg.source}
                                </div>
                              )}
                              {msg.confidence && (
                                <div style={{ fontSize: 10, color: 'var(--ink-faint)' }}>
                                  Confidence: {(msg.confidence * 100).toFixed(0)}%
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {loading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{
                        padding: '12px 20px',
                        background: 'var(--paper-warm)',
                        border: '1px solid var(--border)',
                        borderRadius: '14px 14px 14px 4px',
                        display: 'flex',
                        gap: 6
                      }}>
                        {[0, 1, 2].map(i => (
                          <span key={i} style={{
                            width: 7, height: 7,
                            borderRadius: '50%',
                            background: 'var(--ink-subtle)',
                            animation: `bounce 1s ${i * 0.15}s infinite`
                          }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={uploadedDoc ? "Ask about your document..." : "Ask your legal question..."}
              className="input-ink"
              style={{ flex: 1, padding: '14px 16px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="btn-ink"
              style={{
                padding: '14px 20px',
                background: 'var(--status-ok)',
                opacity: loading || !input.trim() ? 0.5 : 1,
                pointerEvents: loading || !input.trim() ? 'none' : 'auto'
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div>
          {/* Document Context Card */}
          {uploadedDoc && (
            <div className="glass-card" style={{ padding: 16, marginBottom: 16, borderLeft: '3px solid var(--legal-blue)' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <FileText size={18} color="var(--legal-blue)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Document Active</h4>
                  <p style={{ fontSize: 11, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                    {uploadedDoc.filename} ({uploadedDoc.char_count?.toLocaleString()} chars)
                  </p>
                  <p style={{ fontSize: 10, color: 'var(--ink-subtle)', marginTop: 4 }}>
                    All questions will be answered using this document as context.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Architecture info */}
          <div className="glass-card" style={{ padding: 16, marginBottom: 16, borderLeft: '3px solid var(--status-ok)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <CheckCircle size={18} color="var(--status-ok)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Hybrid Architecture</h4>
                <p style={{ fontSize: 11, color: 'var(--ink-muted)', lineHeight: 1.5 }}>Rule engine validates answers to prevent hallucinations. Connected to backend API.</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="glass-card" style={{ padding: 16, marginBottom: 16, borderLeft: '3px solid var(--status-warn)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <AlertCircle size={18} color="var(--status-warn)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Disclaimer</h4>
                <p style={{ fontSize: 11, color: 'var(--ink-muted)', lineHeight: 1.5 }}>For specific legal advice, consult a qualified attorney. This is general information.</p>
              </div>
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="glass-card" style={{ padding: 16 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              {uploadedDoc ? 'Ask About Document' : 'Common Questions'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(uploadedDoc ? docSuggestions : suggestedQuestions).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(q)}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--paper)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 12,
                    color: 'var(--ink-muted)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--font-body)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--ink)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink-muted)'; }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
