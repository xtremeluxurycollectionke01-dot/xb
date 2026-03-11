// app/messaging/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, Phone, Video, Smile, Paperclip, Send, Check, CheckCheck, MessageCircle, X } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'me' | 'other';
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
  typing?: boolean;
  messages: Message[];
}

export default function MessagingPage() {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [messageInput, setMessageInput] = useState('');
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=1FB84F&color=fff',
      lastMessage: 'Thank you for the quick delivery!',
      lastMessageTime: new Date('2024-03-10T10:30:00'),
      unreadCount: 2,
      online: true,
      messages: [
        {
          id: '1',
          content: 'Hi, I need help with my lab equipment order',
          timestamp: new Date('2024-03-10T09:00:00'),
          sender: 'me',
          status: 'read',
          type: 'text'
        },
        {
          id: '2',
          content: 'Of course! What seems to be the issue?',
          timestamp: new Date('2024-03-10T09:05:00'),
          sender: 'other',
          status: 'read',
          type: 'text'
        },
        {
          id: '3',
          content: 'Thank you for the quick delivery!',
          timestamp: new Date('2024-03-10T10:30:00'),
          sender: 'other',
          status: 'read',
          type: 'text'
        }
      ]
    },
    {
      id: '2',
      name: 'Tech Support Team',
      avatar: 'https://ui-avatars.com/api/?name=Tech+Support&background=14963F&color=fff',
      lastMessage: 'Your ticket #12345 has been resolved',
      lastMessageTime: new Date('2024-03-09T16:20:00'),
      unreadCount: 0,
      online: false,
      messages: [
        {
          id: '4',
          content: 'Your ticket #12345 has been resolved',
          timestamp: new Date('2024-03-09T16:20:00'),
          sender: 'other',
          status: 'read',
          type: 'text'
        }
      ]
    },
    {
      id: '3',
      name: 'Mike from Procurement',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Procurement&background=0E6F2F&color=fff',
      lastMessage: 'The glassware quote is ready',
      lastMessageTime: new Date('2024-03-08T14:15:00'),
      unreadCount: 1,
      online: true,
      typing: true,
      messages: [
        {
          id: '5',
          content: 'The glassware quote is ready',
          timestamp: new Date('2024-03-08T14:15:00'),
          sender: 'other',
          status: 'read',
          type: 'text'
        }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const currentChat = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      timestamp: new Date(),
      sender: 'me',
      status: 'sent',
      type: 'text'
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChat 
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: messageInput,
              lastMessageTime: new Date()
            }
          : chat
      )
    );

    setMessageInput('');
    
    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! Our team will get back to you shortly.",
        timestamp: new Date(),
        sender: 'other',
        status: 'delivered',
        type: 'text'
      };

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChat 
            ? {
                ...chat,
                messages: [...chat.messages, replyMessage],
                lastMessage: "Thanks for your message! Our team will get back to you shortly.",
                lastMessageTime: new Date()
              }
            : chat
        )
      );
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch(status) {
      case 'sent':
        return <Check size={16} className="text-[var(--card-border)]" />;
      case 'delivered':
        return <CheckCheck size={16} className="text-[var(--card-border)]" />;
      case 'read':
        return <CheckCheck size={16} className="text-[var(--brand-500)]" />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="min-h-screen w-full bg-[var(--soft-gray)] dark:bg-[var(--brand-900)] flex items-center justify-center p-4 md:p-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--brand-500)] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--brand-500)] opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl h-[90vh] md:h-[85vh] bg-[var(--white)] dark:bg-[var(--brand-800)] rounded-3xl shadow-2xl border border-[var(--card-border)] dark:border-[var(--brand-700)] overflow-hidden">
        
        {/* Messaging Interface */}
        <div className="relative h-full flex">
          
          {/* Chats Sidebar */}
          <div className="relative w-full md:w-96 border-r border-[var(--card-border)] dark:border-[var(--brand-700)] flex flex-col bg-[var(--white)] dark:bg-[var(--brand-800)]">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-[var(--card-border)] dark:border-[var(--brand-700)] bg-[var(--white)] dark:bg-[var(--brand-800)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)]">Messages</h2>
                {/* Close button for mobile */}
                <button
                  onClick={handleClose}
                  className="md:hidden p-2 hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-700)] rounded-full transition-all duration-300"
                  aria-label="Close messages"
                >
                  <X size={20} className="text-[var(--dark-text)] dark:text-[var(--light-text)]" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--card-border)]" size={20} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-[var(--soft-gray)] dark:bg-[var(--brand-900)] border border-[var(--card-border)] dark:border-[var(--brand-700)] rounded-lg text-[var(--dark-text)] dark:text-[var(--light-text)] placeholder-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                />
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto bg-[var(--white)] dark:bg-[var(--brand-800)]">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-700)] transition-all duration-300 border-b border-[var(--card-border)] dark:border-[var(--brand-700)] ${
                    selectedChat === chat.id ? 'bg-[var(--soft-gray)] dark:bg-[var(--brand-700)]' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <NextImage
                      src={chat.avatar}
                      alt={chat.name}
                      width={48}
                      height={48}
                      className="rounded-full ring-2 ring-[var(--card-border)] dark:ring-[var(--brand-700)]"
                    />
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--brand-500)] border-2 border-[var(--white)] dark:border-[var(--brand-800)] rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-[var(--card-border)] whitespace-nowrap ml-2">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-[var(--card-border)] truncate">
                        {chat.typing ? (
                          <span className="text-[var(--brand-500)]">Typing...</span>
                        ) : (
                          chat.lastMessage
                        )}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="ml-2 bg-[var(--brand-500)] text-[var(--white)] text-xs font-bold px-2 py-1 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {currentChat ? (
            <div className="relative flex-1 flex flex-col bg-[var(--soft-gray)] dark:bg-[var(--brand-900)]">
              {/* Chat Header */}
              <div className="p-4 border-b border-[var(--card-border)] dark:border-[var(--brand-700)] flex items-center justify-between bg-[var(--white)] dark:bg-[var(--brand-800)]">
                <div className="flex items-center gap-3">
                  <NextImage
                    src={currentChat.avatar}
                    alt={currentChat.name}
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-[var(--card-border)] dark:ring-[var(--brand-700)]"
                  />
                  <div>
                    <h3 className="font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                      {currentChat.name}
                    </h3>
                    <p className="text-xs text-[var(--card-border)]">
                      {currentChat.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-700)] rounded-full transition-all duration-300">
                    <Phone size={20} className="text-[var(--dark-text)] dark:text-[var(--light-text)]" />
                  </button>
                  <button className="p-2 hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-700)] rounded-full transition-all duration-300">
                    <Video size={20} className="text-[var(--dark-text)] dark:text-[var(--light-text)]" />
                  </button>
                  <button className="p-2 hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-700)] rounded-full transition-all duration-300">
                    <MoreVertical size={20} className="text-[var(--dark-text)] dark:text-[var(--light-text)]" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-700)] rounded-full transition-all duration-300 ml-1 border-l border-[var(--card-border)] dark:border-[var(--brand-700)] pl-3"
                    aria-label="Close messages"
                  >
                    <X size={20} className="text-[var(--dark-text)] dark:text-[var(--light-text)]" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--soft-gray)] dark:bg-[var(--brand-900)]">
                {currentChat.messages.map((message, index) => {
                  const showDate = index === 0 || 
                    formatDate(message.timestamp) !== formatDate(currentChat.messages[index - 1].timestamp);
                  
                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="px-3 py-1 bg-[var(--white)] dark:bg-[var(--brand-800)] text-xs text-[var(--card-border)] rounded-full border border-[var(--card-border)] dark:border-[var(--brand-700)]">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      
                      <div className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${message.sender === 'me' ? 'order-2' : ''}`}>
                          {message.type === 'text' && (
                            <div
                              className={`p-3 rounded-2xl ${
                                message.sender === 'me'
                                  ? 'bg-[var(--brand-500)] text-[var(--white)] rounded-br-none shadow-lg shadow-[var(--brand-500)]/20'
                                  : 'bg-[var(--white)] dark:bg-[var(--brand-800)] text-[var(--dark-text)] dark:text-[var(--light-text)] rounded-bl-none border border-[var(--card-border)] dark:border-[var(--brand-700)]'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                          )}
                          
                          <div className={`flex items-center gap-1 mt-1 text-xs ${
                            message.sender === 'me' ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className="text-[var(--card-border)]">
                              {formatTime(message.timestamp)}
                            </span>
                            {message.sender === 'me' && getMessageStatusIcon(message.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[var(--card-border)] dark:border-[var(--brand-700)] bg-[var(--white)] dark:bg-[var(--brand-800)]">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-700)] rounded-full transition-all duration-300"
                  >
                    <Paperclip size={20} className="text-[var(--dark-text)] dark:text-[var(--light-text)]" />
                  </button>
                  
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-[var(--soft-gray)] dark:bg-[var(--brand-900)] border border-[var(--card-border)] dark:border-[var(--brand-700)] rounded-lg text-[var(--dark-text)] dark:text-[var(--light-text)] placeholder-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                  />
                  
                  <button className="p-2 hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-700)] rounded-full transition-all duration-300">
                    <Smile size={20} className="text-[var(--dark-text)] dark:text-[var(--light-text)]" />
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-[var(--white)] rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--brand-500)]/30"
                  >
                    <Send size={20} />
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                />
              </div>
            </div>
          ) : (
            <div className="relative flex-1 flex items-center justify-center bg-[var(--soft-gray)] dark:bg-[var(--brand-900)]">
              <div className="text-center">
                <div className="w-20 h-20 bg-[var(--brand-500)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={40} className="text-[var(--brand-500)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-2">
                  Select a conversation
                </h3>
                <p className="text-[var(--card-border)]">
                  Choose a chat to start messaging
                </p>
                
                {/* Close button for empty state */}
                <button
                  onClick={handleClose}
                  className="mt-6 px-6 py-2 bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-[var(--white)] rounded-lg transition-all duration-300 shadow-lg shadow-[var(--brand-500)]/30"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}