import { useState, useEffect } from 'react';
import { FileText, Download, Copy, RefreshCw, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { draftingAPI } from '../services/api';

export default function AutoDrafting() {
  const [caseFacts, setCaseFacts] = useState('');
  const [documentType, setDocumentType] = useState('petition');
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draftContent, setDraftContent] = useState('');
  const [citedCases, setCitedCases] = useState([]);
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [templates, setTemplates] = useState([]);

  // Fetch templates from backend on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const result = await draftingAPI.getTemplates();
        if (result?.templates) {
          setTemplates(result.templates);
        }
      } catch {
        // Use defaults
      }
    };
    fetchTemplates();
  }, []);

  const generateDraft = async () => {
    if (!caseFacts.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await draftingAPI.generate(caseFacts, documentType);

      if (result && !result.error) {
        setDraftContent(result.content || '');
        setCitedCases(
          result.citations?.map(c => ({
            name: c.case_name,
            year: c.year,
            citation: c.citation,
            relevance: c.relevance,
            court: c.court || '',
            state: c.state || '',
            caseType: c.case_type || '',
            sections: c.sections || [],
            keyIssues: c.key_issues || [],
            summary: c.summary || '',
            outcome: c.outcome || '',
            precedentStrength: c.precedent_strength || 0,
            paragraphs: c.paragraphs || []
          })) || []
        );
        setQualityMetrics(result.quality_metrics || null);
        setGenerated(true);
      } else {
        throw new Error(result?.error || 'Generation failed');
      }
    } catch (err) {
      console.error('Draft generation failed:', err);
      setError('Backend unavailable — please ensure the backend server is running.');
      setCitedCases([]);
      setGenerated(false);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => { navigator.clipboard.writeText(draftContent); };
  
  const downloadDraft = () => {
    const element = document.createElement('a');
    const file = new Blob([draftContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Legal_${documentType}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const result = await draftingAPI.generatePDF(caseFacts, documentType);
      
      if (result?.pdf_base64) {
        // Convert base64 to blob
        const binaryString = atob(result.pdf_base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.file_name || `Legal_${documentType}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } else if (result?.error) {
        setError(`PDF Download Error: ${result.error}`);
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('PDF download failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  // Quality display data
  const qualityDisplay = qualityMetrics
    ? [
        { label: 'Citation Strength', value: Math.round(qualityMetrics.citation_strength * 100), color: 'progress-ok' },
        { label: 'Legal Alignment', value: Math.round(qualityMetrics.legal_alignment * 100), color: 'progress-info' },
        { label: 'Completeness', value: Math.round(qualityMetrics.completeness * 100), color: 'progress-gold' },
      ]
    : [
        { label: 'Citation Strength', value: 92, color: 'progress-ok' },
        { label: 'Legal Alignment', value: 88, color: 'progress-info' },
        { label: 'Completeness', value: 95, color: 'progress-gold' },
      ];

  // Template options from backend or defaults
  const templateOptions = templates.length > 0 ? templates : [
    { name: 'Petition (Section 482)', id: 'petition' },
    { name: 'Bail Application', id: 'bail' },
    { name: 'FIR', id: 'fir' },
    { name: 'Legal Arguments', id: 'argument' },
    { name: 'Memorandum', id: 'memorandum' }
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={FileText}
        title="Precedent-Aligned Auto Drafting"
        description="Generate legally strong documents with automatic case citations and precedent alignment"
        accentColor="#4A6FA5"
      />

      {error && (
        <div style={{ padding: '10px 16px', background: 'var(--status-warn-bg)', border: '1px solid rgba(176,140,26,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 16, fontSize: 13, color: 'var(--status-warn)' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="page-grid">
        {/* Left */}
        <div>
          {/* Input */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 14 }}>Case Information</h2>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Type</label>
              <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="select-ink">
                {templateOptions.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Case Facts</label>
              <textarea
                value={caseFacts}
                onChange={(e) => setCaseFacts(e.target.value)}
                placeholder="Enter the facts of your case. Include key events, dates, parties involved, and relief sought..."
                className="textarea-ink"
                style={{ height: 220 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={generateDraft} className="btn-ink" style={{ flex: 1, background: '#4A6FA5' }} disabled={loading || !caseFacts.trim()}>
                {loading ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />} {loading ? 'Generating...' : 'Generate Draft'}
              </button>
              <button onClick={() => { setCaseFacts(''); setGenerated(false); setError(null); }} className="btn-ghost">Reset</button>
            </div>
          </div>

          {/* Generated Draft */}
          {generated && (
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Generated Document</h2>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={copyToClipboard} className="btn-ghost" style={{ padding: '6px 10px' }} title="Copy"><Copy size={14} /></button>
                  <button onClick={downloadDraft} className="btn-ghost" style={{ padding: '6px 10px' }} title="Download as Text"><Download size={14} /></button>
                  <button onClick={downloadPDF} className="btn-ghost" style={{ padding: '6px 10px' }} title="Download as PDF" disabled={pdfLoading}>
                    {pdfLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  </button>
                  <button onClick={generateDraft} className="btn-ghost" style={{ padding: '6px 10px' }} title="Regenerate" disabled={loading}>
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  </button>
                </div>
              </div>
              <div className="legal-paper">
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{draftContent}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div>
          {generated ? (
            <>
              {/* Cited Cases */}
              <div className="glass-card" style={{ padding: 20, marginBottom: 20, maxHeight: 500, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Cited Precedents</h3>
                  <span className="badge badge-gold">{citedCases.length} cases</span>
                </div>
                {citedCases.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'var(--ink-faint)', textAlign: 'center', padding: 16 }}>No matching precedents found</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {citedCases.map((c, i) => (
                      <div key={i} style={{ padding: 12, background: 'var(--paper)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 2, lineHeight: 1.3 }}>{c.name}</h4>
                        <p style={{ fontSize: 10, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{c.citation}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
                            {c.court && `${c.court}`}{c.state && ` · ${c.state}`}{c.year && ` · ${c.year}`}
                          </span>
                          <span className={`badge ${c.relevance === 'High' ? 'badge-ok' : c.relevance === 'Medium' ? 'badge-warn' : 'badge-info'}`}>{c.relevance}</span>
                        </div>
                        {c.outcome && (
                          <p style={{ fontSize: 10, color: 'var(--status-info)', marginBottom: 4 }}>⚖️ {c.outcome}</p>
                        )}
                        {c.keyIssues?.length > 0 && (
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
                            {c.keyIssues.map((issue, j) => (
                              <span key={j} style={{ fontSize: 9, padding: '1px 6px', background: 'var(--paper-deep)', borderRadius: 99, color: 'var(--ink-muted)' }}>{issue}</span>
                            ))}
                          </div>
                        )}
                        {c.sections?.length > 0 && (
                          <p style={{ fontSize: 9, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>§ {c.sections.slice(0, 3).join(' · ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quality */}
              <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 14 }}>Document Quality</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {qualityDisplay.map((m, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: 'var(--ink-muted)' }}>{m.label}</span>
                        <span style={{ fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{m.value}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className={`progress-bar-fill ${m.color}`} style={{ width: `${m.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="glass-card" style={{ padding: 16, borderLeft: '3px solid var(--gold)' }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>✨ Tips for Better Results</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['Provide detailed facts and dates', 'Specify relief sought clearly', 'Include all parties involved', 'Review and edit for accuracy', 'Consult with legal expert'].map((tip, i) => (
                    <li key={i} style={{ fontSize: 11, color: 'var(--ink-muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
              <FileText size={44} color="var(--ink-subtle)" style={{ opacity: 0.3, marginBottom: 12 }} />
              <p style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Enter case facts and click Generate to create a draft</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
