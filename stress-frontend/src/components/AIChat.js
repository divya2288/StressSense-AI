import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AIChat.css';

function AIChat({ userId }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi there! 👋 I'm your AI wellness companion. I'm here to listen and support you. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [conversationContext, setConversationContext] = useState({
    userMood: null,
    previousTopics: [],
    stressLevel: null,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestedAction = null;

    // Greeting responses
    if (lowerMessage.match(/\b(hi|hello|hey|good morning|good evening)\b/)) {
      const greetings = [
        "Hello! 😊 It's great to hear from you. What's on your mind today?",
        "Hi there! How are you doing? I'm here to listen.",
        "Hey! Good to see you. Tell me, how has your day been?",
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Stress and anxiety
    if (lowerMessage.match(/\b(stress|stressed|anxious|anxiety|worried|worry|nervous)\b/)) {
      response = "I hear that you're feeling stressed. 😌 Stress is tough, but you're taking the right step by acknowledging it.\n\n";
      
      if (lowerMessage.includes('work') || lowerMessage.includes('job')) {
        response += "Work stress can be overwhelming. Have you tried breaking your tasks into smaller, manageable chunks?\n\n";
      } else if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('study')) {
        response += "Exam stress is common. Remember to take regular breaks and don't forget to breathe.\n\n";
      }
      
      response += "Would you like to try a breathing exercise right now? 🧘";
      suggestedAction = 'breathing';
      
      setConversationContext({ ...conversationContext, stressLevel: 'high' });
      return { text: response, action: suggestedAction };
    }

    // Depression and sadness
    if (lowerMessage.match(/\b(depressed|depression|sad|down|hopeless|worthless|suicide|kill myself)\b/)) {
      response = "I'm really concerned about how you're feeling. 💙 What you're experiencing sounds very difficult, and I want you to know that you don't have to go through this alone.\n\n";
      
      if (lowerMessage.match(/\b(suicide|kill myself|end it|not worth living)\b/)) {
        response += "⚠️ **IMMEDIATE HELP NEEDED**\n\n";
        response += "Please reach out to someone right now:\n";
        response += "• National Suicide Prevention Lifeline: 1-800-273-8255 (24/7)\n";
        response += "• Crisis Text Line: Text HOME to 741741\n";
        response += "• Emergency: Call 911\n\n";
        response += "Your life matters. These services have trained professionals who can help you through this crisis.";
      } else {
        response += "Please consider talking to:\n";
        response += "• A mental health professional\n";
        response += "• A trusted friend or family member\n";
        response += "• Crisis Helpline: 1-800-273-8255\n\n";
        response += "In the meantime, can you tell me more about what's been going on?";
      }
      
      return { text: response, action: null };
    }

    // Overwhelmed
    if (lowerMessage.match(/\b(overwhelmed|too much|can't cope|drowning|buried)\b/)) {
      response = "Feeling overwhelmed is exhausting. 😓 Let's try to tackle this together.\n\n";
      response += "Can you identify the ONE thing that's causing you the most stress right now? Sometimes naming it helps reduce its power.\n\n";
      response += "Also, remember: You don't have to do everything today. What's the most important thing you need to accomplish?";
      return { text: response, action: null };
    }

    // Sleep issues
    if (lowerMessage.match(/\b(sleep|insomnia|tired|exhausted|can't sleep|awake)\b/)) {
      response = "Sleep issues can really affect everything. 😴 Good sleep hygiene can help:\n\n";
      response += "✓ Keep a consistent sleep schedule\n";
      response += "✓ Avoid screens 1 hour before bed\n";
      response += "✓ Keep your bedroom cool and dark\n";
      response += "✓ Try relaxation techniques before bed\n";
      response += "✓ Limit caffeine after 2 PM\n\n";
      response += "Would you like to try our guided meditation to help you relax? 🎵";
      suggestedAction = 'meditation';
      return { text: response, action: suggestedAction };
    }

    // Loneliness and isolation
    if (lowerMessage.match(/\b(lonely|alone|isolated|no friends|nobody)\b/)) {
      response = "Feeling lonely is really hard, and I'm glad you're sharing this with me. 🤗\n\n";
      response += "Connection is so important for our wellbeing. Here are some gentle suggestions:\n\n";
      response += "• Join online communities around your interests\n";
      response += "• Volunteer for a cause you care about\n";
      response += "• Take a class or join a group activity\n";
      response += "• Reach out to old friends, even briefly\n\n";
      response += "Small steps can make a big difference. What's one small thing you could try this week?";
      return { text: response, action: null };
    }

    // Anger and frustration
    if (lowerMessage.match(/\b(angry|mad|frustrated|furious|irritated|annoyed)\b/)) {
      response = "It sounds like you're feeling really frustrated. 😤 Anger is a valid emotion, and it's okay to feel this way.\n\n";
      response += "Some ways to process anger healthily:\n";
      response += "• Physical exercise (walk, run, workout)\n";
      response += "• Write out your feelings\n";
      response += "• Practice deep breathing\n";
      response += "• Talk to someone you trust\n\n";
      response += "What triggered these feelings? Sometimes talking about it helps.";
      return { text: response, action: null };
    }

    // Positive emotions
    if (lowerMessage.match(/\b(good|great|happy|better|improved|awesome|wonderful|fantastic)\b/)) {
      response = "That's wonderful to hear! 🎉 I'm so glad you're feeling better.\n\n";
      response += "What helped you get to this positive place? Understanding what works for you is really valuable.\n\n";
      response += "Keep building on this momentum! 💪";
      setConversationContext({ ...conversationContext, userMood: 'positive' });
      return { text: response, action: null };
    }

    // Thank you
    if (lowerMessage.match(/\b(thank|thanks|appreciate)\b/)) {
      const thankResponses = [
        "You're very welcome! 💚 I'm here whenever you need to talk.",
        "I'm glad I could help! Remember, taking care of your mental health is a sign of strength. 💪",
        "Anytime! Your wellbeing matters. Feel free to come back whenever you need support. 🤗",
      ];
      return { text: thankResponses[Math.floor(Math.random() * thankResponses.length)], action: null };
    }

    // Ask for help or resources
    if (lowerMessage.match(/\b(help|resource|support|where|professional)\b/)) {
      response = "I'm glad you're reaching out for support! 💙\n\n";
      response += "**Professional Help:**\n";
      response += "• Find a therapist: Psychology Today (psychologytoday.com/therapists)\n";
      response += "• Online therapy: BetterHelp, Talkspace\n";
      response += "• Crisis support: 1-800-273-8255\n\n";
      response += "**Self-Help Resources:**\n";
      response += "• Our stress assessments and tools\n";
      response += "• Meditation and breathing exercises\n";
      response += "• Mental health apps: Headspace, Calm\n\n";
      response += "Would you like to explore any of our wellness tools?";
      return { text: response, action: null };
    }

    // Specific symptoms
    if (lowerMessage.match(/\b(panic|panic attack|heart racing|breathe)\b/)) {
      response = "It sounds like you might be experiencing anxiety or a panic attack. Let's try to ground you. 🌟\n\n";
      response += "**Right now, try this:**\n";
      response += "1. Find 5 things you can see\n";
      response += "2. Find 4 things you can touch\n";
      response += "3. Find 3 things you can hear\n";
      response += "4. Find 2 things you can smell\n";
      response += "5. Find 1 thing you can taste\n\n";
      response += "This is the 5-4-3-2-1 grounding technique. Let me know when you're feeling a bit calmer.";
      suggestedAction = 'breathing';
      return { text: response, action: suggestedAction };
    }

    // Productivity and motivation
    if (lowerMessage.match(/\b(unmotivated|procrastinating|lazy|no energy|can't focus)\b/)) {
      response = "Loss of motivation is really common, especially when we're stressed. 🎯\n\n";
      response += "**Try these strategies:**\n";
      response += "• Start with just 5 minutes on a task\n";
      response += "• Use the Pomodoro Technique (25 min work, 5 min break)\n";
      response += "• Set ONE small, achievable goal for today\n";
      response += "• Celebrate small wins\n";
      response += "• Check your sleep and nutrition\n\n";
      response += "What's one small thing you could accomplish today?";
      return { text: response, action: null };
    }

    // Default empathetic responses
    const defaultResponses = [
      "I hear you. Tell me more about what's going on. 👂",
      "That sounds challenging. How are you coping with this? 🤔",
      "Thanks for sharing that with me. What would help you feel better right now?",
      "I understand this is difficult. Would you like to explore some coping strategies?",
      "Your feelings are valid. Let's talk through this together. What's been the hardest part?",
    ];
    
    return { text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)], action: null };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const responseData = generateResponse(input);
      const responseText = typeof responseData === 'string' ? responseData : responseData.text;
      const action = typeof responseData === 'object' ? responseData.action : null;

      const botResponse = {
        sender: 'bot',
        text: responseText,
        timestamp: new Date(),
        action: action,
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAction = (action) => {
    if (action === 'breathing') {
      navigate('/breathing');
    } else if (action === 'meditation') {
      navigate('/meditation');
    }
  };

  const quickReplies = [
    "I'm feeling stressed 😰",
    "I need help sleeping 😴",
    "I feel overwhelmed 😓",
    "I'm doing okay 😊",
    "Show me resources 📚",
  ];

  return (
    <div className="ai-chat-page">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>

        <div className="ai-chat-container">
          <div className="chat-header">
            <div className="bot-avatar-large">🤖</div>
            <div className="bot-info">
              <h3>AI Wellness Companion</h3>
              <p className="bot-status">
                <span className="status-dot"></span>
                Always here for you
              </p>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="message-avatar">🤖</div>
                )}
                <div className="message-content">
                  <div className="message-bubble">
                    {msg.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  {msg.action && (
                    <button
                      className="action-button"
                      onClick={() => handleAction(msg.action)}
                    >
                      {msg.action === 'breathing' ? '🧘 Start Breathing Exercise' : '🎵 Play Meditation'}
                    </button>
                  )}
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="message-avatar user-avatar">😊</div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="message bot-message">
                <div className="message-avatar">🤖</div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => {
                  setInput(reply);
                  setTimeout(() => {
                    handleSend();
                  }, 100);
                }}
              >
                {reply}
              </button>
            ))}
          </div>

          <div className="chat-input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows="1"
              className="chat-input"
            />
            <button
              onClick={handleSend}
              className="send-btn"
              disabled={!input.trim()}
            >
              <span className="send-icon">📤</span>
            </button>
          </div>

          <div className="chat-disclaimer">
            ⚠️ This AI companion provides support but is not a replacement for professional mental health care. 
            For emergencies, call 1-800-273-8255 or 911.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChat;