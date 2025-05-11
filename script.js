// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Hiring calculator
document.getElementById('calculateBtn')?.addEventListener('click', function() {
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const budget = parseInt(document.getElementById('budget').value) || 0;
    
    if (hours > 0 && budget > 0) {
        const totalCost = hours * budget * 1.21; // VAT included
        document.getElementById('totalCost').textContent = totalCost.toFixed(2);
        const result = document.getElementById('calculationResult');
        result.style.display = 'block';
        
        // Animation
        result.style.animation = 'none';
        setTimeout(() => {
            result.style.animation = 'fadeIn 0.5s ease-out';
        }, 10);
    } else {
        showAlert('Please enter valid values for hours and budget.');
    }
});

// ID number validation (Spanish format)
document.getElementById('hiringForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const idNumber = document.getElementById('id-number').value.toUpperCase();
    const idRegex = /^[XYZ]?\d{7,8}[A-Z]$/;
    
    if (!idRegex.test(idNumber)) {
        showAlert('Please enter a valid Spanish ID or foreigner ID number.');
        return;
    }
    
    // Simulate form submission
    showAlert('Request sent successfully. We will contact you shortly.', 'success');
    this.reset();
    document.getElementById('calculationResult').style.display = 'none';
});

// Show alert message
function showAlert(message, type = 'error') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300);
    }, 3000);
}

// Chatbot functionality
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const quickQuestions = document.querySelectorAll('.quick-question');

// Predefined chatbot responses
const botResponses = {
    "legal": "To set up a business in Spain you need: 1) Negative name certificate, 2) Incorporation deed before notary, 3) Registration in Mercantile Registry, 4) Registration with Tax Agency and Social Security. Costs range between €600-1200 depending on company type.",
    "hiring": "Our professionals are hired by hour or day, with no additional costs. Minimum rate is €15/hour + VAT. You can calculate total cost in our hiring form.",
    "costs": "Approximate costs: Freelancer (€60-150), LLC (€600-1200), Corporation (€3000+). Includes notary, registry, accounting and administrative procedures.",
    "tax": "Basic tax obligations: Quarterly VAT, Quarterly/Monthly Income Tax, Annual Corporation Tax and informative statements. Depends on your activity and legal form.",
    "default": "Understood. A specialized advisor will contact you shortly to personally address your query."
};

// Show/hide chatbot
chatbotBtn?.addEventListener('click', function() {
    chatbotWindow.classList.toggle('active');
    this.classList.toggle('active');
});

chatbotClose?.addEventListener('click', function() {
    chatbotWindow.classList.remove('active');
    chatbotBtn.classList.remove('active');
});

// Send message on Enter key
chatbotInput?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Send message on button click
chatbotSend?.addEventListener('click', sendMessage);

// Quick questions
quickQuestions.forEach(question => {
    question.addEventListener('click', function() {
        const questionType = this.getAttribute('data-question');
        addUserMessage(this.textContent);
        setTimeout(() => {
            addBotMessage(botResponses[questionType]);
        }, 500);
    });
});

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
        addUserMessage(message);
        chatbotInput.value = '';
        
        setTimeout(() => {
            // Find predefined response or use default
            let response = botResponses.default;
            for (const [key, value] of Object.entries(botResponses)) {
                if (message.toLowerCase().includes(key)) {
                    response = value;
                    break;
                }
            }
            addBotMessage(response);
        }, 1000);
    }
}

function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    scrollChatToBottom();
}

function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    scrollChatToBottom();
}

function scrollChatToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Save chat history to localStorage
window.addEventListener('beforeunload', function() {
    if (chatbotMessages) {
        const messages = document.querySelectorAll('.chatbot-messages .message');
        const chatHistory = Array.from(messages).map(msg => ({
            text: msg.textContent,
            type: msg.classList.contains('user-message') ? 'user' : 'bot'
        }));
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
});

// On page load
document.addEventListener('DOMContentLoaded', function() {
    // Current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Load chat history if exists
    if (chatbotMessages) {
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        if (chatHistory.length > 0) {
            chatHistory.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`;
                messageDiv.textContent = msg.text;
                chatbotMessages.appendChild(messageDiv);
            });
            scrollChatToBottom();
        }
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Lazy loading animation for cards
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});