import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Plus,
  Search,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Sparkles,
  Paperclip,
  Mic,
  ChevronDown,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { ChatMessage, ChatConversation } from '@/types/chat.types';
import { chatApi } from '@/api/chat.api';

// Mock conversations
const mockConversations: ChatConversation[] = [
  {
    id: '1',
    title: 'Dérivées et intégrales',
    subject: 'Mathématiques',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Lois du mouvement de Newton',
    subject: 'Physique',
    messages: [],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    title: 'Liaisons chimiques',
    subject: 'Chimie',
    messages: [],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
  },
];

const subjects = [
  { value: 'math', label: 'Mathématiques' },
  { value: 'physics', label: 'Physique' },
  { value: 'chemistry', label: 'Chimie' },
  { value: 'biology', label: 'Biologie' },
  { value: 'cs', label: 'Informatique' },
  { value: 'languages', label: 'Langues' },
];

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-2">
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      className="h-2 w-2 rounded-full bg-primary"
    />
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      className="h-2 w-2 rounded-full bg-primary"
    />
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      className="h-2 w-2 rounded-full bg-primary"
    />
  </div>
);

export default function ChatPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessageText = input.trim();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Send message to Laravel API
      const response = await chatApi.sendAIMessage(userMessageText, selectedSubject);
      
      const aiMessage: ChatMessage = {
        id: response.data.id.toString(),
        role: 'assistant',
        content: response.data.ai_response,
        timestamp: new Date(response.data.timestamp),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      
      // Show error message to user
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolé, j\'ai rencontré une erreur lors du traitement de votre demande. Veuillez réessayer.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied!',
      description: 'Message copied to clipboard.',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedConversations = {
    today: filteredConversations.filter(c => {
      const today = new Date();
      return c.updatedAt.toDateString() === today.toDateString();
    }),
    yesterday: filteredConversations.filter(c => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return c.updatedAt.toDateString() === yesterday.toDateString();
    }),
    older: filteredConversations.filter(c => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return c.updatedAt < yesterday;
    }),
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-4 lg:-m-8">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col border-r border-border bg-card overflow-hidden"
          >
            {/* New Chat Button */}
            <div className="p-4">
              <Button
                onClick={handleNewChat}
                className="w-full gradient-primary text-white gap-2"
              >
                <Plus className="h-4 w-4" />
                Nouvelle conversation
              </Button>
            </div>

            {/* Search */}
            <div className="px-4 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
              {groupedConversations.today.length > 0 && (
                <div className="mb-4">
                  <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Aujourd'hui</p>
                  {groupedConversations.today.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversationId(conv.id)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg p-3 text-left transition-colors',
                        activeConversationId === conv.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <div className="flex-1 truncate">
                        <p className="truncate text-sm font-medium">{conv.title}</p>
                        <p className={cn(
                          'text-xs truncate',
                          activeConversationId === conv.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {conv.subject}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {groupedConversations.yesterday.length > 0 && (
                <div className="mb-4">
                  <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Hier</p>
                  {groupedConversations.yesterday.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversationId(conv.id)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg p-3 text-left transition-colors',
                        activeConversationId === conv.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <div className="flex-1 truncate">
                        <p className="truncate text-sm font-medium">{conv.title}</p>
                        <p className={cn(
                          'text-xs truncate',
                          activeConversationId === conv.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {conv.subject}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {groupedConversations.older.length > 0 && (
                <div className="mb-4">
                  <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Cette semaine</p>
                  {groupedConversations.older.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversationId(conv.id)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg p-3 text-left transition-colors',
                        activeConversationId === conv.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <div className="flex-1 truncate">
                        <p className="truncate text-sm font-medium">{conv.title}</p>
                        <p className={cn(
                          'text-xs truncate',
                          activeConversationId === conv.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {conv.subject}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-success" />
              </div>
              <div>
                <h2 className="font-semibold">Tuteur IA</h2>
                <p className="text-xs text-muted-foreground">En ligne • Prêt à aider</p>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" />
                Effacer la conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h2 className="mt-6 text-2xl font-bold">Comment puis-je vous aider à apprendre aujourd'hui ?</h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Posez-moi n'importe quelle question sur vos matières. Je peux expliquer des concepts, résoudre des problèmes et vous aider à vous entraîner.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['Explique les dérivées', 'Qu\'est-ce que la photosynthèse ?', 'Aide avec les algorithmes'].map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    onClick={() => setInput(prompt)}
                    className="text-sm"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'group relative max-w-[80%] rounded-2xl p-4',
                        message.role === 'user'
                          ? 'gradient-primary text-white'
                          : 'glass-card'
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Message Actions */}
                      {message.role === 'assistant' && (
                        <div className="mt-3 flex items-center gap-2 border-t border-border/50 pt-3 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyMessage(message.content)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="glass-card rounded-2xl p-4">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Posez-moi une question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[60px] max-h-[200px] pr-24 resize-none"
                    rows={2}
                  />
                  <div className="absolute bottom-2 right-2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="gradient-primary text-white h-[60px] px-6"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Appuyez sur ⌘ + Entrée pour envoyer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
