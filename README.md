# 🧙‍♂️ HXBIT — The Ultimate Life RPG Platform 🎮

Welcome to **HXBIT** — a comprehensive, gamified platform that transforms real-life activities into an engaging RPG experience. Track your progress, earn XP, compete with friends, and become the best version of yourself through systematic personal development.

---

## 🌟 Features Overview

### 🎮 Core Gamification System
- **XP & Leveling**: Earn experience points from tasks, competitions, internships, and personal development
- **Character Stats**: 13 different attributes including Strength, Agility, Intelligence, Charisma, Leadership, and more
- **Level Progression**: Visual progress bars, animated XP counters, and level-up celebrations
- **Achievement System**: Unlock badges and share milestones with your network
- **Stat Point Allocation**: Spend earned points to upgrade your real-life attributes

### 🧰 Activity & Task Management
- **Dynamic Task Creation**: Create, complete, and track tasks across multiple life areas
- **Extracurricular Activities**: Organize tasks under different activity categories
- **Required Tasks**: Set mandatory tasks with XP penalties for missed deadlines
- **Due Date Tracking**: Visual indicators for overdue and upcoming tasks
- **Quick Task Templates**: Pre-built task suggestions for different development areas

### 💼 Professional Development
- **Competition Tracker**: Log competitive achievements, placements, and victories
- **Internship Management**: Track professional experience, skills gained, and career progression
- **Career Excellence**: Dedicated section for professional development tasks
- **Strategic Learning**: Systematic skill acquisition and knowledge tracking

### 🏋️ Personal Development Areas
- **Physical Development**: Fitness, nutrition, and body optimization tracking
- **Mental Performance**: Cognitive enhancement, learning, and focus improvement
- **Social Mastery**: Communication skills, networking, and relationship building
- **Character Stats**: RPG-style attribute system with real-world benefits

### 📅 Schedule & Planning
- **Smart Scheduling**: Plan your day with integrated task and activity scheduling
- **Schedule Templates**: Pre-built routines for morning, study, and evening schedules
- **Event Management**: Link tasks and internships to calendar events
- **Time Tracking**: Monitor duration and productivity across different activities

### 👥 Social & Community Features
- **Profile System**: Customizable profiles with display names, bios, and profile pictures
- **Follow System**: Connect with other players and build your network
- **Social Feed**: Share achievements, level-ups, and progress updates
- **Global Leaderboards**: Compete on XP, level, and task completion rankings
- **Discovery**: Find and connect with other players through search
- **Privacy Controls**: Manage who can see your stats and activities

### 🔒 Security & Privacy
- **Row-Level Security**: Database-level security ensuring users only access their own data
- **Privacy Levels**: Public, friends-only, and private visibility options
- **Secure Authentication**: Email/password authentication with Supabase
- **Data Protection**: Enterprise-grade security for all user information

---

## 🛠️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for responsive, modern styling
- **Lucide React** for consistent iconography
- **React Hot Toast** for user notifications
- **Vite** for fast development and building

### Backend & Database
- **Supabase** for authentication, database, and real-time features
- **PostgreSQL** with advanced features like RLS and triggers
- **Real-time subscriptions** for live updates
- **Edge functions** for serverless backend logic

### Design System
- **Dark Theme**: Black backgrounds with blue accent colors
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Modern UI**: Glassmorphism effects, smooth animations, and micro-interactions
- **Accessibility**: WCAG compliant with proper contrast ratios

---

## 🎨 Design Philosophy

HXBIT follows a **dark, ultra-modern aesthetic** inspired by premium SaaS platforms:

- **Color Palette**: Black backgrounds, blue primary colors, with gold, purple, green, and orange accents
- **Typography**: Inter font family for consistent, readable text
- **Layout**: Card-based design with proper spacing and visual hierarchy
- **Animations**: Subtle transitions and hover effects for enhanced UX
- **Responsiveness**: Fluid layouts that work across all device sizes

---

## 📊 Database Schema

### Core Tables
- **users**: Player profiles with level and XP tracking
- **user_profiles**: Extended profile information and privacy settings
- **user_stats**: RPG-style character attributes and stat points
- **extracurriculars**: Activity categories for organizing tasks
- **tasks**: Individual objectives with XP rewards and completion tracking

### Professional Development
- **competitions**: Competitive achievements and placements
- **internships**: Professional experience and skill tracking
- **schedule_events**: Calendar integration and time management

### Social Features
- **follows**: Player connections and networking
- **social_posts**: Achievement sharing and status updates
- **post_likes**: Social engagement tracking
- **global_leaderboards**: Ranking and competition views

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/hxbit.git
cd hxbit
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```
Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Set up the database**
Run the migration files in your Supabase SQL editor:
- `supabase/migrations/20250622203040_crystal_leaf.sql`
- `supabase/migrations/20250622204243_graceful_disk.sql`
- `supabase/migrations/20250702013448_crystal_waterfall.sql`
- `supabase/migrations/20250702014426_round_truth.sql`
- `supabase/migrations/20250703113527_calm_flower.sql`

5. **Start the development server**
```bash
npm run dev
```

---

## 🎯 Key Features in Detail

### Landing Page
- **Modern Design**: Dark theme with blue accents and gradient effects
- **Feature Showcase**: Comprehensive overview of platform capabilities
- **Social Proof**: Testimonials and usage statistics
- **Auth-Aware Navigation**: Dynamic login/dashboard buttons based on user state
- **Responsive Layout**: Optimized for all screen sizes

### Dashboard System
- **Unified Overview**: Character stats, activity progress, and quick actions
- **Modular Navigation**: Sidebar with categorized sections
- **Real-time Updates**: Live XP tracking and level progression
- **Quick Actions**: Fast access to common tasks and features

### Social Platform
- **Player Discovery**: Search and connect with other users
- **Follow System**: Build your network and track friends' progress
- **Achievement Sharing**: Celebrate milestones with your community
- **Leaderboard Competition**: Global and friends-only rankings
- **Privacy Controls**: Manage visibility of your profile and activities

### Character Development
- **13 Stat Categories**: Comprehensive attribute system covering all life areas
- **Stat Point Economy**: Earn and spend points through activity completion
- **Visual Progress**: Progress bars and level indicators for each attribute
- **Real-world Benefits**: Each stat provides tangible life improvements

---

## 🔧 Development Features

### Code Organization
- **Modular Architecture**: Clean separation of concerns across components
- **Custom Hooks**: Reusable logic for data fetching and state management
- **Type Safety**: Full TypeScript coverage for reliable development
- **Component Library**: Consistent UI components across the platform

### Performance Optimizations
- **Lazy Loading**: Code splitting for faster initial load times
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Efficient Queries**: Optimized database queries with proper indexing
- **Caching Strategy**: Smart data caching for improved performance

---

## 🎮 Usage Examples

### Creating Your First Activity
1. Navigate to the Activities tab
2. Click "Create New Activity"
3. Choose from preset templates or create custom
4. Add tasks and set XP rewards
5. Start completing tasks to earn XP and level up

### Building Your Network
1. Go to Profile & Social tab
2. Use the Discover feature to search for players
3. Follow interesting players to see their progress
4. Share your achievements on the social feed
5. Compete on the global leaderboard

### Character Development
1. Visit the Character Stats tab
2. Review your current attribute levels
3. Complete tasks to earn stat points
4. Allocate points to improve desired attributes
5. Track your progress over time

---

## 🤝 Contributing

We welcome contributions to HXBIT! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links & Contact

- **Live Demo**: [hxbit.netlify.app](https://hxbit.netlify.app)
- **GitHub**: [github.com/your-username/hxbit](https://github.com/your-username/hxbit)
- **Documentation**: [docs.hxbit.com](https://docs.hxbit.com)
- **Support**: [support@hxbit.com](mailto:support@hxbit.com)

---

## 🎉 Recent Updates

### Version 2.0.0 - Social Platform Release
- ✅ Complete social platform with follow system
- ✅ Modern landing page with auth-aware navigation
- ✅ Dark theme implementation across all pages
- ✅ Enhanced profile system with picture uploads
- ✅ Global leaderboards with follow integration
- ✅ Improved discovery and search functionality
- ✅ Real-time social feed with achievement sharing
- ✅ Mobile-responsive design improvements

### Version 1.5.0 - Character Development
- ✅ 13-attribute character stat system
- ✅ Stat point economy and allocation
- ✅ Professional development tracking
- ✅ Schedule and planning system
- ✅ Competition and internship management

### Version 1.0.0 - Core Platform
- ✅ Basic XP and leveling system
- ✅ Task and activity management
- ✅ User authentication and profiles
- ✅ Database schema and security

---

> **Transform your real-life activities into an engaging RPG experience. Level up your skills, compete with friends, and become the best version of yourself with HXBIT.**