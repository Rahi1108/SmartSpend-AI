# SmartSpend AI - AI-First SaaS for Personal Finance

<div align="center">
  <img src="https://img.shields.io/badge/React-19.2.4-blue.svg" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-blue.svg" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-8.0.3-yellow.svg" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2.2-blue.svg" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Supabase-2.101.1-green.svg" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Claude_3-0.82.0-orange.svg" alt="Claude 3"/>
  <img src="https://img.shields.io/badge/Gemini_AI-0.24.1-red.svg" alt="Gemini AI"/>
</div>

<br/>

<div align="center">
  <h3>🚀 AI-First Personal Finance Management Platform</h3>
  <p><strong>Revolutionizing personal finance with cutting-edge AI, voice-first input, and predictive analytics</strong></p>
</div>

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🎯 Problem Statement](#-problem-statement)
- [🧠 AI Capabilities](#-ai-capabilities)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Getting Started](#-getting-started)
- [🔧 Environment Setup](#-environment-setup)
- [🎮 Demo Account](#-demo-account)
- [📱 Screenshots](#-screenshots)
- [🏗️ Project Structure](#️-project-structure)
- [🧭 Application Pages](#-application-pages)
- [💾 Data Management](#-data-management)
- [📊 Dashboard Features](#-dashboard-features)
- [💰 Financial Management](#-financial-management)
- [🎯 Goals & Budgets](#-goals--budgets)
- [📈 Reports & Analytics](#-reports--analytics)
- [📱 Mobile Support](#-mobile-support)
- [🔧 Development](#-development)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

### 🤖 AI-Powered Smart Input
- **Natural Language Processing** - Parse expenses from plain English ("coffee at starbucks $5.50 yesterday")
- **Voice Input** - Hands-free expense tracking with speech recognition
- **Auto-Classification** - AI automatically categorizes transactions, budgets, and goals
- **Unified Interface** - Single input field for all financial data types

### 📊 Intelligent Dashboard
- **Real-time Balance** - Live account balance with income/expense tracking
- **AI Insights Panel** - Personalized spending analysis and recommendations
- **Interactive Charts** - Visual spending trends and category breakdowns
- **Recent Activity** - Latest transactions and financial activity

### 💰 Financial Management
- **Transaction Tracking** - Smart expense and income management
- **Budget Intelligence** - AI-suggested budget allocations with alerts
- **Goals Tracking** - Savings goals with progress visualization
- **Category Management** - Organized spending by customizable categories

### 📈 Reports & Analytics
- **Spending Analysis** - Detailed expense breakdowns by category and time
- **Trend Visualization** - Charts showing spending patterns over time
- **Budget Performance** - Track budget adherence and overspending alerts
- **Export Capabilities** - Generate financial reports

### 🔐 Secure & Private
- **Supabase Backend** - Enterprise-grade database with Row Level Security
- **User Authentication** - Secure login and user management
- **Data Privacy** - Your financial data is encrypted and never shared
- **Multi-tenant Architecture** - Isolated data for each user

---

## 🎯 Problem Statement

Traditional finance apps are dumb data collectors. They show you what you spent, but they don't understand WHY you spent it or HOW to spend better. Users are overwhelmed with manual data entry and get no actionable insights.

**The AI Gap:** Most "AI" finance apps just use basic categorization. SmartSpend AI is the first truly AI-first finance SaaS that understands context, learns from behavior, and provides intelligent financial guidance.

---

## 🧠 AI Capabilities

### AI Models & Services
- **Google Gemini 1.5 Flash** - Advanced language model for natural language processing
- **Anthropic Claude 3** - Context-aware financial analysis (future integration)
- **Ollama (Local AI)** - Privacy-focused local AI processing with Mistral model
- **Custom AI Algorithms** - Proprietary financial pattern recognition

### Smart Input Processing
- **Intent Classification** - Automatically detects if input is transaction, budget, or goal
- **Entity Extraction** - Parses amounts, dates, categories, and descriptions
- **Context Understanding** - Considers time, location, and spending patterns
- **Confidence Scoring** - Provides accuracy ratings for AI classifications

### Voice & Speech Features
- **Speech Recognition** - Real-time voice-to-text conversion
- **Natural Language** - Understands conversational financial input
- **Multi-language Support** - Voice input in multiple languages
- **Noise Filtering** - Improved accuracy in various environments

### Behavioral Intelligence
- **Pattern Recognition** - Identifies spending habits and trends
- **Predictive Analytics** - Forecasts future spending based on history
- **Personalized Recommendations** - Tailored financial advice
- **Anomaly Detection** - Flags unusual spending patterns

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 19.2.4** - Latest concurrent features for smooth UX
- **TypeScript 5.9.3** - Full type safety and developer experience
- **Vite 8.0.1** - Lightning-fast build tool and dev server

### UI/UX Framework
- **Tailwind CSS 4.2.2** - Utility-first CSS framework
- **Framer Motion 12.38.0** - Smooth animations and transitions
- **Headless UI 2.2.9** - Accessible UI components
- **Heroicons 2.2.0** - Beautiful hand-crafted SVG icons
- **Lucide React 1.7.0** - Modern icon library

### State Management
- **Zustand 5.0.12** - Lightweight state management
- **React Query 5.96.1** - Server state management with caching
- **Optimistic Updates** - Instant UI feedback

### Backend & Database
- **Supabase 2.101.1** - Firebase alternative with PostgreSQL
- **PostgreSQL** - Robust relational database
- **Row Level Security** - Multi-tenant data isolation
- **Real-time Subscriptions** - Live data synchronization

### AI & ML Services
- **Google Generative AI 0.24.1** - Gemini AI integration
- **Anthropic SDK 0.82.0** - Claude 3 integration
- **Ollama** - Local AI model serving
- **Custom AI Services** - Proprietary financial AI models

### Form & Validation
- **React Hook Form 7.72.0** - Performant forms with easy validation
- **Zod 4.3.6** - TypeScript-first schema validation
- **Hookform Resolvers 5.2.2** - Schema validation integration

### Development Tools
- **ESLint 9.39.4** - Code linting and formatting
- **TypeScript ESLint 8.57.0** - TypeScript-specific linting
- **PostCSS 8.5.8** - CSS processing
- **Autoprefixer 10.4.27** - CSS vendor prefixing

### Additional Libraries
- **Date-fns 4.1.0** - Modern JavaScript date utility library
- **React Hot Toast 2.6.0** - Beautiful toast notifications
- **Sonner 2.0.7** - Toast notification library
- **React Router DOM 7.14.0** - Declarative routing
- **Recharts 3.8.1** - Composable charting library

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **Supabase Account** - For backend services
- **Google AI API Key** - For Gemini AI (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahi1108/SmartSpend-AI.git
   cd SmartSpend-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys (see Environment Setup below)
   ```

4. **Start Ollama (for local AI - optional)**
   ```bash
   # In a separate terminal
   ollama serve
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production
```bash
npm run build
npm run preview
```

### Development Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Ollama Configuration (Local AI)
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=mistral

# Gemini AI Configuration (Cloud AI)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
VITE_APP_NAME=SmartSpend AI
VITE_APP_URL=http://localhost:5173
```

### API Keys Setup

1. **Google Gemini AI**
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add to `VITE_GEMINI_API_KEY`

2. **Supabase**
   - Create project at [Supabase](https://supabase.com)
   - Copy URL and anon key to environment variables

3. **Ollama (Optional)**
   - Install [Ollama](https://ollama.ai)
   - Pull models: `ollama pull mistral`

---

## 🎮 Demo Account

Use these credentials to explore the application:

**Demo User:**
- **Email:** `demo@example.com`
- **Password:** `demo123`

The demo account comes pre-loaded with sample financial data including:
- **Transactions:** Various income and expense entries across different categories
- **Budgets:** Monthly budget allocations for different spending categories
- **Goals:** Savings goals with progress tracking
- **AI Insights:** Pre-generated spending analysis and recommendations

### 🚀 Try These AI Features:
1. **Smart Input:** Click the sparkle icon (✨) and try typing:
   - "coffee at starbucks $5.50 yesterday"
   - "save $5000 for vacation by December"
   - "budget $200 for groceries this month"

2. **Voice Input:** Click the microphone icon and speak naturally about your finances

3. **AI Insights:** View personalized spending analysis and predictions

4. **Interactive Charts:** Explore spending patterns and category breakdowns

---

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=SmartSpend+AI+Dashboard)

### AI Smart Input
![Smart Input](https://via.placeholder.com/800x600/10B981/FFFFFF?text=AI+Smart+Input)

### Transaction Management
![Transactions](https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Transaction+Management)

### Budget Tracking
![Budgets](https://via.placeholder.com/800x600/EF4444/FFFFFF?text=Budget+Tracking)

---

## 🏗️ Project Structure

```
SmartSpend-AI/
├── public/                          # Static assets
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── ai/                     # AI-related components
│   │   ├── budgets/                # Budget components
│   │   ├── common/                 # Shared components
│   │   ├── dashboard/              # Dashboard components
│   │   ├── goals/                  # Goals components
│   │   ├── layout/                 # Layout components
│   │   └── transactions/           # Transaction components
│   ├── constants/                  # Application constants
│   │   ├── categories.ts           # Transaction categories
│   │   └── config.ts               # App configuration
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAI.ts               # AI functionality hooks
│   │   ├── useAuth.ts             # Authentication hooks
│   │   ├── useBudgets.ts          # Budget management hooks
│   │   ├── useEnhancedAI.ts       # Enhanced AI hooks
│   │   ├── useGoals.ts            # Goals management hooks
│   │   ├── useSmartInput.ts       # Smart input hooks
│   │   ├── useTransactions.ts     # Transaction hooks
│   │   └── useVoiceInput.ts       # Voice input hooks
│   ├── pages/                     # Page components
│   │   ├── auth/                  # Authentication pages
│   │   ├── BudgetsPage.tsx        # Budgets management page
│   │   ├── Dashboard.tsx          # Main dashboard
│   │   ├── GoalsPage.tsx          # Goals management page
│   │   ├── LandingPage.tsx        # Landing page
│   │   ├── NotFoundPage.tsx       # 404 page
│   │   ├── PersonalInformationPage.tsx # User profile page
│   │   ├── ReportsPage.tsx        # Reports and analytics
│   │   ├── SettingsPage.tsx       # Settings page
│   │   └── TransactionsPage.tsx   # Transactions management
│   ├── services/                  # Business logic and API calls
│   │   ├── ai.ts                  # AI service functions
│   │   ├── budgets.ts             # Budget services
│   │   ├── email.ts               # Email services
│   │   ├── enhancedAI.ts          # Enhanced AI services
│   │   ├── goals.ts               # Goals services
│   │   ├── insights.ts            # Insights services
│   │   ├── localStorage.ts        # Local storage utilities
│   │   ├── notificationManager.ts # Notification management
│   │   ├── notifications.ts       # Notification services
│   │   ├── ollama.ts              # Ollama AI services
│   │   ├── smartInput.ts          # Smart input services
│   │   ├── supabase.ts            # Supabase client
│   │   ├── supabaseBudgets.ts     # Supabase budget operations
│   │   ├── supabaseGoals.ts       # Supabase goals operations
│   │   ├── supabaseTransactions.ts # Supabase transaction operations
│   │   ├── transactions.ts        # Transaction services
│   │   ├── inMemoryBudgets.ts     # In-memory budget storage
│   │   ├── inMemoryGoals.ts       # In-memory goals storage
│   │   └── inMemoryTransactions.ts # In-memory transaction storage
│   ├── stores/                    # State management
│   │   ├── authStore.ts           # Authentication state
│   │   ├── transactionStore.ts    # Transaction state
│   │   └── uiStore.ts             # UI state
│   ├── types/                     # TypeScript type definitions
│   │   ├── ai.ts                  # AI-related types
│   │   ├── budget.ts              # Budget types
│   │   ├── database.ts            # Database types
│   │   ├── goal.ts                # Goal types
│   │   └── transaction.ts         # Transaction types
│   ├── utils/                     # Utility functions
│   │   ├── categoryUtils.ts       # Category utilities
│   │   ├── dateUtils.ts           # Date utilities
│   │   ├── formatters.ts          # Data formatters
│   │   └── validators.ts          # Validation utilities
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # App styles
│   ├── index.css                  # Global styles
│   ├── main.tsx                   # App entry point
│   └── vite-env.d.ts              # Vite environment types
├── .env.local                     # Environment variables
├── .gitignore                     # Git ignore rules
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── postcss.config.js              # PostCSS configuration
├── README.md                      # Project documentation
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.app.json              # TypeScript app config
├── tsconfig.json                  # TypeScript config
├── tsconfig.node.json             # TypeScript node config
└── vite.config.ts                 # Vite configuration
```

---

## 🔮 AI Features

### Natural Language Processing
- **Smart Input Classification** - Automatically detect transaction, budget, or goal
- **Context Understanding** - Parse complex financial descriptions
- **Multi-language Support** - Handle various input formats
- **Error Correction** - Suggest corrections for ambiguous inputs

### Voice Input
- **Speech Recognition** - Hands-free expense tracking
- **Real-time Processing** - Instant voice-to-text conversion
- **Noise Filtering** - Improved accuracy in various environments
- **Multi-language Support** - Voice input in multiple languages

### Behavioral Analytics
- **Spending Pattern Recognition** - Identify habits and trends
- **Predictive Modeling** - Forecast future spending
- **Personalized Recommendations** - Tailored financial advice
- **Anomaly Detection** - Flag unusual spending patterns

### Intelligent Categorization
- **Machine Learning** - Improve accuracy over time
- **Context Awareness** - Consider time, location, and amount
- **Custom Categories** - Learn user-defined categories
- **Auto-suggestions** - Recommend categories based on history

---

## 🧭 Application Pages

### 📊 Dashboard
- **Overview Cards** - Balance, recent transactions, budget status
- **AI Insights Panel** - Personalized spending analysis and recommendations
- **Spending Charts** - Interactive visualizations of financial data
- **Quick Actions** - Fast access to add transactions, budgets, or goals

### 💰 Transactions
- **Transaction List** - View all income and expenses
- **Smart Filtering** - Filter by category, date, amount, or type
- **Manual Entry** - Add transactions with detailed forms
- **Bulk Operations** - Edit or delete multiple transactions

### 🎯 Budgets
- **Budget Overview** - Current budget status and progress
- **Category Budgets** - Set spending limits by category
- **AI Suggestions** - Smart budget recommendations
- **Alert System** - Notifications for budget limits

### 🏆 Goals
- **Goals Dashboard** - Track progress on savings goals
- **Goal Creation** - Set new savings targets with AI assistance
- **Progress Visualization** - Charts showing goal completion
- **Milestone Tracking** - Celebrate goal achievements

### 📈 Reports
- **Financial Reports** - Comprehensive spending analysis
- **Category Breakdown** - Detailed expense analysis by category
- **Trend Analysis** - Historical spending patterns
- **Export Options** - Download reports in various formats

### ⚙️ Settings
- **Profile Management** - Update personal information
- **App Preferences** - Customize app behavior
- **Data Management** - Export or delete your data
- **Notification Settings** - Configure alerts and reminders

---

## 💰 Financial Management

### Transaction Management
- **Smart Entry** - AI-powered transaction input
- **Categorization** - Automatic and manual categorization
- **Search & Filter** - Advanced transaction filtering
- **Bulk Operations** - Batch transaction management
- **Recurring Transactions** - Automated recurring entries
- **Attachments** - Receipt and document storage

### Budget Intelligence
- **AI-Suggested Budgets** - Smart budget allocation
- **Category-based Budgets** - Per-category spending limits
- **Budget Periods** - Daily, weekly, monthly budgets
- **Budget Alerts** - Spending threshold notifications
- **Budget Analytics** - Budget performance tracking
- **Budget Adjustments** - AI-recommended modifications

### Multi-currency Support
- **Currency Conversion** - Real-time exchange rates
- **Base Currency** - Primary currency configuration
- **Currency History** - Historical exchange rate tracking
- **Export Reports** - Multi-currency financial reports

---

## 🎯 Goals & Budgets

### Savings Goals
- **Goal Creation** - AI-assisted goal setting
- **Progress Tracking** - Visual progress indicators
- **Deadline Management** - Goal completion timelines
- **Priority Levels** - Goal importance ranking
- **Milestone Celebrations** - Achievement notifications
- **Goal Analytics** - Goal performance insights

### Budget Management
- **Smart Budgeting** - AI-optimized budget creation
- **Category Allocation** - Per-category budget distribution
- **Budget Monitoring** - Real-time budget tracking
- **Overspending Alerts** - Budget limit notifications
- **Budget Adjustments** - Dynamic budget modifications
- **Historical Analysis** - Budget performance trends

---

## 📈 Reports & Analytics

### Financial Reports
- **Income Reports** - Revenue analysis and trends
- **Expense Reports** - Spending analysis by category
- **Budget Reports** - Budget performance summaries
- **Goal Reports** - Savings goal progress reports
- **Tax Reports** - Tax-ready financial summaries
- **Custom Reports** - User-defined report generation

### Data Visualization
- **Interactive Charts** - Drill-down chart interactions
- **Trend Analysis** - Historical data trends
- **Comparative Analysis** - Period-over-period comparisons
- **Forecasting** - Predictive data visualization
- **Export Options** - Chart and data export capabilities

### Advanced Analytics
- **Spending Patterns** - Behavioral spending analysis
- **Category Insights** - Deep category analysis
- **Time-based Analysis** - Seasonal and temporal trends
- **Peer Comparison** - Anonymous spending comparisons
- **AI Insights** - Machine learning-driven insights

---

## � Data Management

### Supabase Integration
- **Real-time Database** - PostgreSQL with real-time subscriptions
- **Row Level Security** - Multi-tenant data isolation
- **Automatic Backups** - Secure cloud data storage
- **API Integration** - RESTful API for data operations

### Data Persistence
- **Cloud Storage** - All data stored securely in Supabase
- **Offline Support** - Local caching for offline functionality
- **Data Synchronization** - Automatic sync when online
- **Backup & Recovery** - Automatic data backups

### Privacy & Security
- **End-to-end Encryption** - Data encrypted in transit and at rest
- **User Isolation** - Complete data separation between users
- **Secure Authentication** - JWT-based authentication
- **Audit Logging** - Track all data access and modifications

### Data Export
- **JSON Export** - Export all financial data
- **CSV Reports** - Generate spreadsheet-compatible reports
- **PDF Reports** - Professional financial statements
- **Data Portability** - Easy migration to other services

---

## 📱 Mobile Support

### Responsive Design
- **Mobile-First** - Optimized for mobile devices
- **Tablet Support** - Full tablet compatibility
- **Desktop Enhancement** - Desktop-specific features
- **Touch Interactions** - Touch-optimized UI elements
- **Gesture Support** - Swipe and gesture interactions

### Progressive Web App
- **PWA Ready** - Installable web application
- **Offline Support** - Basic offline functionality
- **Push Notifications** - Mobile push notifications
- **App-like Experience** - Native app feel on mobile

---

## 🔧 Development

### Code Quality
- **TypeScript** - 100% type coverage
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting (future)
- **Husky** - Git hooks for quality checks
- **Testing** - Unit and integration tests (future)

### Development Tools
- **Hot Reload** - Instant development feedback
- **Error Boundaries** - Graceful error handling
- **Development Logging** - Comprehensive logging
- **Performance Monitoring** - Development performance tracking
- **Debug Tools** - Browser dev tools integration

### API Integration
- **RESTful APIs** - Clean API design
- **GraphQL Support** - Flexible data fetching (future)
- **WebSocket** - Real-time data synchronization
- **Caching** - Intelligent data caching
- **Error Handling** - Robust error management

---

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Options
- **Vercel** - Recommended for React apps
- **Netlify** - Alternative deployment platform
- **Railway** - Full-stack deployment
- **Docker** - Containerized deployment
- **AWS/GCP** - Cloud platform deployment

### Environment Configuration
- **Production Environment** - Production-specific settings
- **Staging Environment** - Pre-production testing
- **Development Environment** - Local development setup
- **CI/CD Pipeline** - Automated deployment pipeline

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google AI** for Gemini AI models
- **Anthropic** for Claude 3 API
- **Supabase** for the amazing backend platform
- **Ollama** for local AI capabilities
- **React Team** for the incredible React framework
- **Vercel** for hosting and deployment

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/Rahi1108/SmartSpend-AI/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Rahi1108/SmartSpend-AI/discussions)
- **Email:** support@smartspend.ai

---

<div align="center">
  <p><strong>Built with ❤️ using cutting-edge AI and modern web technologies</strong></p>
  <p><em>Transforming personal finance management with artificial intelligence</em></p>
</div>
```
