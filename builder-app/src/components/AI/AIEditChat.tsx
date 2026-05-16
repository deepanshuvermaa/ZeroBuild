import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Send,
  ChevronRight,
  ChevronLeft,
  Zap,
  User as UserIcon,
  Search,
  Palette,
  Layout,
  Type,
  PlusCircle,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { useBuilderStore } from '@/store/builderStore';
import { useHistoryStore } from '@/store/historyStore';
import { useAuthStore } from '@/store/authStore';
import { ai as aiAPI } from '@/utils/api';

interface AIEditChatProps {
  projectId?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const GENERAL_QUICK_ACTIONS = [
  { label: 'Generate SEO metadata', icon: Globe, action: 'seo' },
  { label: 'Make the page more modern', icon: Sparkles, action: 'style' },
  { label: 'Change color scheme to dark mode', icon: Palette, action: 'style' },
  { label: 'Add a pricing section', icon: PlusCircle, action: 'add' },
];

const SECTION_QUICK_ACTIONS = [
  { label: 'Make this section more modern', icon: Layout, action: 'edit' },
  { label: 'Rewrite the copy', icon: Type, action: 'rewrite' },
  { label: 'Change the layout', icon: Layout, action: 'edit' },
  { label: 'Make colors bolder', icon: Palette, action: 'edit' },
];

function generateMsgId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const AIEditChat: React.FC<AIEditChatProps> = ({ projectId }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateMsgId(),
      role: 'assistant',
      content:
        'Hi! I can help you edit your website. Select a section to make targeted changes, or ask me anything about your page.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { config, selectedSectionId, updateSection, updateSEO } = useBuilderStore();
  const { recordState } = useHistoryStore();
  const { user, updateCredits } = useAuthStore();

  const creditsRemaining = user?.ai_credits_remaining ?? 0;

  const selectedSection = selectedSectionId
    ? config.sections.find((s) => s.id === selectedSectionId)
    : null;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const addMessage = useCallback(
    (role: ChatMessage['role'], content: string) => {
      const msg: ChatMessage = {
        id: generateMsgId(),
        role,
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, msg]);
      return msg;
    },
    []
  );

  const handleSend = useCallback(
    async (text: string, actionType?: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      addMessage('user', trimmed);
      setInputValue('');
      setIsThinking(true);

      try {
        // Determine which API to call
        const isSeoRequest =
          actionType === 'seo' ||
          trimmed.toLowerCase().includes('seo') ||
          trimmed.toLowerCase().includes('metadata');

        if (isSeoRequest) {
          const result = await aiAPI.seo(config);
          recordState(config);
          updateSEO(result.seo);
          updateCredits(creditsRemaining - 2);
          addMessage('assistant', 'I\'ve updated the SEO metadata for your page, including the title, description, and keywords.');
          addMessage('system', 'Updated SEO metadata (-2 credits)');
        } else if (selectedSection && projectId) {
          // Section-specific edit
          const isRewrite =
            actionType === 'rewrite' ||
            trimmed.toLowerCase().includes('rewrite') ||
            trimmed.toLowerCase().includes('copy');

          if (isRewrite) {
            const result = await aiAPI.rewriteCopy(
              selectedSection.type,
              selectedSection.props,
              trimmed
            );
            recordState(config);
            updateSection(selectedSectionId!, result.props);
            updateCredits(creditsRemaining - 1);
            addMessage(
              'assistant',
              `Done! I've rewritten the copy for the ${selectedSection.type.replace('Section', '')} section.`
            );
            addMessage('system', `Updated ${selectedSection.type} copy (-1 credit)`);
          } else {
            const result = await aiAPI.edit({
              projectId,
              sectionId: selectedSectionId!,
              instruction: trimmed,
              currentConfig: config,
            });
            recordState(config);
            updateSection(selectedSectionId!, result.props);
            updateCredits(creditsRemaining - 1);
            addMessage(
              'assistant',
              `I've updated the ${selectedSection.type.replace('Section', '')} section based on your instructions.`
            );
            addMessage('system', `Edited ${selectedSection.type} (-1 credit)`);
          }
        } else if (projectId) {
          // No section selected - try rewrite on first content section or generic edit
          const firstContentSection = config.sections.find(
            (s) => s.type !== 'FloatingWhatsApp'
          );
          if (firstContentSection) {
            const result = await aiAPI.edit({
              projectId,
              sectionId: firstContentSection.id,
              instruction: trimmed,
              currentConfig: config,
            });
            recordState(config);
            updateSection(firstContentSection.id, result.props);
            updateCredits(creditsRemaining - 1);
            addMessage(
              'assistant',
              `I've applied your changes to the ${firstContentSection.type.replace('Section', '')} section. Select a specific section for more targeted edits.`
            );
            addMessage('system', `Edited ${firstContentSection.type} (-1 credit)`);
          } else {
            addMessage(
              'assistant',
              'Your page doesn\'t have any sections yet. Try generating a website first, or add sections manually.'
            );
          }
        } else {
          addMessage(
            'assistant',
            'Please save your project first so I can make edits. A project ID is required for AI editing.'
          );
        }
      } catch (err: any) {
        addMessage(
          'assistant',
          `Something went wrong: ${err.message || 'Unknown error'}. Please try again.`
        );
      } finally {
        setIsThinking(false);
      }
    },
    [
      isThinking,
      addMessage,
      config,
      selectedSection,
      selectedSectionId,
      projectId,
      recordState,
      updateSection,
      updateSEO,
      updateCredits,
      creditsRemaining,
    ]
  );

  const handleQuickAction = useCallback(
    (label: string, actionType: string) => {
      handleSend(label, actionType);
    },
    [handleSend]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  const quickActions = selectedSection ? SECTION_QUICK_ACTIONS : GENERAL_QUICK_ACTIONS;

  return (
    <motion.div
      className={cn(
        'flex flex-col bg-white border-l border-gray-200 h-full transition-all',
        isCollapsed ? 'w-12' : 'w-80 lg:w-96'
      )}
      animate={{ width: isCollapsed ? 48 : undefined }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">AI Assistant</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              <Zap className="w-3 h-3" />
              {creditsRemaining}
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          aria-label={isCollapsed ? 'Expand AI panel' : 'Collapse AI panel'}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Selected section context */}
          {selectedSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 py-2 bg-blue-50 border-b border-blue-100 flex-shrink-0"
            >
              <p className="text-xs text-blue-700 font-medium">
                Editing: {selectedSection.type.replace('Section', '')} section
              </p>
            </motion.div>
          )}

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'flex gap-2',
                    msg.role === 'user' && 'justify-end',
                    msg.role === 'system' && 'justify-center'
                  )}
                >
                  {msg.role === 'system' ? (
                    <div className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                      {msg.content}
                    </div>
                  ) : (
                    <>
                      {msg.role === 'assistant' && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[80%] rounded-xl px-3 py-2 text-sm',
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p
                          className={cn(
                            'text-[10px] mt-1',
                            msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                          )}
                        >
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
                          <UserIcon className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Thinking indicator */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2"
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-xl rounded-bl-sm px-3 py-2">
                  <div className="flex items-center gap-1">
                    <motion.span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          {!isThinking && (
            <div className="px-3 py-2 border-t border-gray-100 flex-shrink-0">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                Quick actions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickActions.map(({ label, icon: Icon, action }) => (
                  <button
                    key={label}
                    onClick={() => handleQuickAction(label, action)}
                    disabled={isThinking || creditsRemaining <= 0}
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border transition-colors',
                      'bg-white border-gray-200 text-gray-600',
                      'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="px-3 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            {creditsRemaining <= 0 ? (
              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>No AI credits remaining. Upgrade your plan to continue.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    selectedSection
                      ? `Edit the ${selectedSection.type.replace('Section', '')} section...`
                      : 'Ask the AI to edit your page...'
                  }
                  disabled={isThinking}
                  className={cn(
                    'flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
                    'placeholder:text-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'disabled:bg-gray-100 disabled:cursor-not-allowed'
                  )}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSend(inputValue)}
                  disabled={!inputValue.trim() || isThinking}
                  isLoading={isThinking}
                  icon={<Send className="w-4 h-4" />}
                  aria-label="Send message"
                />
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};
