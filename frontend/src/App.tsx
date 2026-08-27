import React, { useState } from 'react';
import { Bot, Send, Upload, FileText, Lock, Mail, ChevronRight } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello! Upload a document and ask me anything about it.' }]);
  const [input, setInput] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsAuthenticating(false);
    }, 1200);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Based on the uploaded document, I found relevant information regarding your query. The text indicates that...' }]);
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 transition-all">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900/50 mb-4 text-indigo-400">
              <Bot size={32} />
            </div>
            <h1 className="text-3xl font-black text-indigo-400 mb-2">AI Doc Intel</h1>
            <p className="text-slate-400">Employer & Investor Demo Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Demo Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Mail size={18} /></div>
                <input type="email" value="admin@demo.com" readOnly className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Demo Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Lock size={18} /></div>
                <input type="password" value="password123" readOnly className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none cursor-not-allowed" />
              </div>
            </div>
            <button type="submit" disabled={isAuthenticating} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center">
              {isAuthenticating ? 'Authenticating...' : 'Sign In Securely'}
            </button>
            <p className="text-xs text-center text-slate-500 mt-4">Credentials are pre-filled for demo purposes.</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xl mb-8">
          <Bot /> <span>AI Doc Intel</span>
        </div>
        <div className="flex-1">
          <button className="w-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 border-dashed rounded-lg p-4 flex flex-col items-center justify-center hover:bg-indigo-600/30 transition-colors">
            <Upload size={24} className="mb-2" />
            <span className="text-sm font-medium">Upload PDF</span>
          </button>
          <div className="mt-8 space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Documents</h3>
            <div className="flex items-center space-x-2 p-2 rounded bg-slate-800 text-sm border border-slate-700 text-slate-300">
              <FileText size={16} className="text-indigo-400" /> <span className="truncate">Q3_Financial_Report.pdf</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-slate-800/50 text-sm text-slate-400 cursor-pointer transition-colors">
              <FileText size={16} /> <span className="truncate">Employee_Handbook.pdf</span>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">admin@demo.com</span>
            <button onClick={() => setIsAuthenticated(false)} className="text-xs text-slate-400 hover:text-white">Logout</button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === 'assistant' ? 'bg-indigo-900/30 border border-indigo-700/50' : 'bg-slate-800 border border-slate-700'}>
              <div className="max-w-[80%] p-4 rounded-2xl">
                {msg.content}
                {msg.role === 'assistant' && idx > 0 && (
                   <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-400">
                     <span className="font-semibold text-slate-300">Source:</span> Q3_Financial_Report.pdf (Page 12)
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question about the document..." className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-4 text-white outline-none focus:border-indigo-500 transition-colors" />
            <button type="submit" className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors">
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
