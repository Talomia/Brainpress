'use client';

import { useState, useEffect, useRef } from 'react';
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
  const { showToast, activeAgent } = useNotifications();
  const initialized = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Singleton Initialization: Prevents toast spam and redundant plugin registration
  useEffect(() => {
    if (initialized.current) return;
    
    const initEcosystem = async () => {
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
      showToast('Intelligence Ecosystem Synchronized', 'success');
      initialized.current = true;
    };
    
    initEcosystem();
  }, [showToast]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

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
      let currentOutput = "";
      const streamText = async (text: string, isThinking = false) => {
        for (let i = 0; i < text.length; i += 8) {
          currentOutput += text.substring(i, i + 8);
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'assistant') {
              return [...prev.slice(0, -1), { role: 'assistant', content: currentOutput }];
            }
            return [...prev, { role: 'assistant', content: currentOutput }];
          });
          await new Promise(r => setTimeout(r, 15));
        }
      };

      await streamText(`[Neural Hook: ${activeAgent.name}] Reasoning... `, true);

      const result = await runIntelligenceLoop(currentInput, { 
        metadata: { attachments: currentAttachments } 
      });
      
      const finalResponse = result.messages[result.messages.length - 1].content;
      currentOutput = ""; // Reset for final response
      await streamText(finalResponse);

    } catch (e) {
      showToast('Neural Loop Interrupted', 'error');
      setMessages(prev => [...prev, { role: 'assistant', content: '[Error] Intelligence synthesis failed. Please verify neural hooks.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 180px)', 
      width: '100%', 
      maxWidth: '1000px', 
      margin: '0 auto', 
      overflow: 'hidden',
      border: `1px solid ${activeAgent.styles.accentColor}33`,
      boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${activeAgent.styles.glowColor.replace('0.4', '0.1')}` 
    }}>
      {/* Messages Feed */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          padding: '2.5rem', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem',
          scrollBehavior: 'smooth' 
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#444', marginTop: '15%' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{activeAgent.icon}</div>
            <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontWeight: 800 }}>{activeAgent.name}</h2>
            <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto', opacity: 0.6 }}>{activeAgent.description}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className="fade-in" style={{ 
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            padding: '1.4rem 2rem',
            borderRadius: m.role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
            background: m.role === 'user' ? activeAgent.styles.accentColor : 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
            color: m.role === 'user' ? '#000' : '#ddd',
            lineHeight: '1.7',
            fontSize: '1rem',
            fontWeight: m.role === 'user' ? 600 : 400,
            whiteSpace: 'pre-wrap',
            boxShadow: m.role === 'user' ? `0 10px 25px ${activeAgent.styles.glowColor}` : 'none'
          }}>
            {m.content}
          </div>
        ))}
        {loading && messages[messages.length-1]?.role !== 'assistant' && (
          <div style={{ alignSelf: 'flex-start', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', width: '70%', border: '1px solid #111' }}>
            <div className="skeleton" style={{ height: '1.2rem', width: '90%', marginBottom: '1rem' }}></div>
            <div className="skeleton" style={{ height: '1.2rem', width: '60%' }}></div>
          </div>
        )}
      </div>

      {/* Robust Input Terminal */}
      <div style={{ 
        padding: '2.5rem', 
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        background: 'rgba(0,0,0,0.4)' 
      }}>
        {attachments.length > 0 && (
          <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
            {attachments.map((a, i) => (
              <span key={i} style={{ 
                background: activeAgent.styles.accentColor, 
                color: '#000',
                padding: '0.4rem 0.8rem', 
                borderRadius: '6px', 
                fontSize: '0.75rem',
                fontWeight: 800 
              }}>
                ATTACHMENT: {a.name}
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          <button 
            title="Attach Data Source"
            onClick={() => setAttachments(prev => [...prev, { name: 'neural-context.png', type: 'image' }])}
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid #222', 
              color: 'white', 
              width: '50px',
              height: '50px',
              borderRadius: '12px', 
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.2rem',
              transition: 'all 0.2s' 
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >📎</button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Instruct ${activeAgent.name}...`}
            style={{ 
              flex: 1, 
              background: 'rgba(0,0,0,0.5)', 
              border: '1px solid #222', 
              borderRadius: '12px', 
              padding: '1.2rem 1.5rem', 
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = activeAgent.styles.accentColor}
            onBlur={(e) => e.currentTarget.style.borderColor = '#222'}
          />
          <button 
            className="btn-primary" 
            onClick={handleSend} 
            disabled={loading} 
            style={{ 
              padding: '0 2.5rem', 
              height: '50px',
              borderRadius: '12px',
              background: activeAgent.styles.accentColor,
              color: '#000',
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: loading ? 'none' : `0 0 20px ${activeAgent.styles.glowColor}` 
            }}
          >
            {loading ? 'SYNTHESIZING' : 'EXECUTE'}
          </button>
        </div>
      </div>
    </div>
  );
}
