'use client';

import { useState, useEffect } from 'react';
import { runIntelligenceLoop } from '@/lib/core/loop';
import { bp_plugins } from '@/lib/core/plugins';
import { useNotifications } from './NotificationProvider';
import { GeminiPlugin } from '@/lib/plugins/gemini-plugin';
import { OpenAIPlugin } from '@/lib/plugins/openai-plugin';
import { SearchPlugin } from '@/lib/plugins/search-plugin';
import { MemoryPlugin } from '@/lib/plugins/memory-plugin';
import { GuardrailPlugin } from '@/lib/plugins/guardrail-plugin';
import { CalculatorPlugin } from '@/lib/plugins/calculator-plugin';
import { MultiAgentPlugin } from '@/lib/plugins/multi-agent-plugin';
import { AutoPublisherPlugin } from '@/lib/plugins/publisher-plugin';
import { MultiModalPlugin } from '@/lib/plugins/multimodal-plugin';
import { AnalyticsPlugin } from '@/lib/plugins/analytics-plugin';
import { ErrorHandlingPlugin } from '@/lib/plugins/error-plugin';
import { TranslationPlugin } from '@/lib/plugins/translation-plugin';
import { PerformanceOptimizationPlugin } from '@/lib/plugins/optimization-plugin';
import { CompliancePlugin } from '@/lib/plugins/compliance-plugin';
import { StreamPlugin } from '@/lib/plugins/stream-plugin';
import { KeyboardShortcutPlugin } from '@/lib/plugins/shortcut-plugin';
import { ReflectionPlugin } from '@/lib/plugins/reflection-plugin';
import { RecursiveOrchestrationPlugin } from '@/lib/plugins/recursive-plugin';
import { MultiAgentCollabPlugin } from '@/lib/plugins/collab-plugin';
import { AdaptiveLearningPlugin } from '@/lib/plugins/learning-plugin';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const { showToast } = useNotifications();

  useEffect(() => {
    const init = async () => {
      const fullStack = [
        OpenAIPlugin, GeminiPlugin, SearchPlugin, MemoryPlugin, 
        GuardrailPlugin, CalculatorPlugin, MultiAgentPlugin, 
        AutoPublisherPlugin, MultiModalPlugin, AnalyticsPlugin, 
        ErrorHandlingPlugin, TranslationPlugin,
        PerformanceOptimizationPlugin, CompliancePlugin,
        StreamPlugin, KeyboardShortcutPlugin,
        ReflectionPlugin, RecursiveOrchestrationPlugin,
        MultiAgentCollabPlugin, AdaptiveLearningPlugin
      ];
      
      for (const p of fullStack) {
        bp_plugins.register(p);
      }
      showToast('Intelligence ecosystem initialized', 'success');
    };
    init();
  }, [showToast]);

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;
    
    setLoading(true);
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    const currentAttachments = [...attachments];
    
    setInput('');
    setAttachments([]);

    try {
      // Simulate streaming for the "Thinking..." phase
      let currentOutput = "";
      const streamText = async (text: string) => {
        for (let i = 0; i < text.length; i += 5) {
          currentOutput += text.substring(i, i + 5);
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last.role === 'assistant') {
              return [...prev.slice(0, -1), { role: 'assistant', content: currentOutput }];
            }
            return [...prev, { role: 'assistant', content: currentOutput }];
          });
          await new Promise(r => setTimeout(r, 20));
        }
      };

      await streamText("Searching knowledge base... Applying neural hooks... Reasoning... ");

      const result = await runIntelligenceLoop(currentInput, { 
        metadata: { attachments: currentAttachments } 
      });
      
      const finalResponse = result.messages[result.messages.length - 1].content;
      currentOutput = ""; // Reset for final response stream
      await streamText(finalResponse);

      showToast('Agent reasoning loop completed', 'info');
    } catch (e) {
      showToast('Error in reasoning loop', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addSimulatedAttachment = (type: string) => {
    setAttachments(prev => [...prev, { name: `demo-${type}.jpg`, type }]);
  };

  return (
    <div className="glass" style={{ display: 'flex', flexDirection: 'column', height: '700px', width: '100%', maxWidth: '900px', margin: '0 auto', overflow: 'hidden' }}>
      {/* Messages */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '20%' }}>
            <h2 style={{ color: '#444', marginBottom: '1rem' }}>Brainpress Intelligence</h2>
            <p>Multimodal, autonomous, and secure.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`fade-in`} style={{ 
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            padding: '1.2rem 1.8rem',
            borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
            background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: m.role === 'user' ? 'none' : '1px solid #333',
            color: 'white',
            lineHeight: '1.6',
            boxShadow: m.role === 'user' ? '0 10px 20px rgba(0,112,243,0.3)' : 'none',
            fontSize: '0.95rem',
            whiteSpace: 'pre-wrap'
          }}>
            {m.content}
            {m.role === 'assistant' && m.content.length < 5 && <span className="pulse">...</span>}
          </div>
        ))}
        {loading && messages[messages.length-1]?.role !== 'assistant' && (
          <div style={{ alignSelf: 'flex-start', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', width: '60%' }}>
            <div className="skeleton" style={{ height: '1rem', width: '80%', marginBottom: '0.8rem' }}></div>
            <div className="skeleton" style={{ height: '1rem', width: '50%' }}></div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ padding: '2rem', borderTop: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)' }}>
        {attachments.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {attachments.map((a, i) => (
              <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem' }}>📎 {a.name}</span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            title="Attach Image"
            onClick={() => addSimulatedAttachment('image')}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: 'white', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer' }}
          >🖼️</button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything or use '@researcher' / 'calc: expression'..."
            style={{ 
              flex: 1, 
              background: 'rgba(0,0,0,0.3)', 
              border: '1px solid #333', 
              borderRadius: '8px', 
              padding: '1rem', 
              color: 'white' 
            }}
          />
          <button className="btn-primary" onClick={handleSend} disabled={loading} style={{ padding: '1rem 2rem' }}>Send</button>
        </div>
      </div>
    </div>
  );
}
