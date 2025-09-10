# 🎌 Student Buddy - Personalized Study Planner

A sophisticated study planning application that combines Japanese learning techniques with modern task management. Built with React and designed to create adaptive learning schedules based on spaced repetition, Pomodoro method, and active recall techniques.

## ✨ Features

### 🎯 Smart Study Planning
- **Japanese Technique Integration**: Spaced Repetition (間隔反復), Pomodoro (ポモドーロ), Active Recall (能動想起)
- **Adaptive Scheduling**: ML-inspired algorithms that adjust based on complexity and deadlines
- **Trello-like Task Management**: Organize topics and subtopics with complexity levels
- **Progress Tracking**: Real-time analytics and completion tracking

### 📊 Key Capabilities
- **Topic & Subtopic Organization**: Break down subjects into manageable components
- **Complexity-based Planning**: Easy (簡単), Medium (普通), Hard (難しい) difficulty levels
- **Deadline-driven Scheduling**: Automatic session distribution based on target dates
- **Multi-technique Support**: Choose optimal study methods for different subjects
- **Progress Analytics**: Visual dashboards and performance tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser with ES6+ support

### Installation Options

#### Option 1: React Development Environment
```bash
# Create new React app
npx create-react-app student-buddy
cd student-buddy

# Install dependencies
npm install lucide-react

# Replace src/App.js with the Student Buddy component
# Copy the component code from the artifact into src/App.js

# Start development server
npm start
```

#### Option 2: Next.js Implementation
```bash
# Create Next.js app
npx create-next-app@latest student-buddy
cd student-buddy

# Install dependencies
npm install lucide-react

# Create component in pages/index.js or app/page.js
npm run dev
```

#### Option 3: Standalone HTML (Quick Demo)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Buddy</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        // Paste the Student Buddy component code here
        ReactDOM.render(<StudentBuddyPlanner />, document.getElementById('root'));
    </script>
</body>
</html>
```

## 🏗️ Architecture & Implementation

### Core Components Structure

```
src/
├── components/
│   ├── StudentBuddyPlanner.jsx    # Main application
│   ├── Dashboard/
│   │   ├── DashboardTab.jsx       # Overview & today's sessions
│   │   ├── ProgressStats.jsx      # Statistics cards
│   │   └── SessionCard.jsx        # Individual session component
│   ├── Tasks/
│   │   ├── TasksTab.jsx           # Topic creation & management
│   │   ├── TaskForm.jsx           # New task input form
│   │   └── TaskList.jsx           # Display existing tasks
│   ├── StudyPlan/
│   │   ├── StudyPlanTab.jsx       # Calendar view of sessions
│   │   ├── SessionSchedule.jsx    # Daily session groups
│   │   └── SessionItem.jsx        # Individual session item
│   ├── Progress/
│   │   ├── ProgressTab.jsx        # Analytics dashboard
│   │   └── TechniqueChart.jsx     # Progress by technique
│   └── Profile/
│       ├── ProfileTab.jsx         # User settings
│       └── TechniqueInfo.jsx      # Japanese technique descriptions
├── hooks/
│   ├── useStudyPlan.js           # Study plan generation logic
│   ├── useProgress.js            # Progress calculation hooks
│   └── useLocalStorage.js        # Persistence layer
├── utils/
│   ├── studyTechniques.js        # Japanese technique configurations
│   ├── planGenerator.js          # ML-inspired scheduling algorithms
│   └── dateHelpers.js            # Date manipulation utilities
└── styles/
    └── globals.css               # Additional styling
```

### Key Implementation Details

#### 1. Study Plan Generation Algorithm

```javascript
// utils/planGenerator.js
export const generateStudyPlan = (task) => {
  const complexity = complexityLevels[task.complexity];
  const technique = studyTechniques[task.technique];
  const plan = [];
  
  const startDate = new Date();
  const deadline = new Date(task.deadline);
  const totalDays = Math.ceil((deadline - startDate) / (1000 * 60 * 60 * 24));
  
  task.subtopics.filter(sub => sub.trim()).forEach((subtopic, index) => {
    if (task.technique === 'Spaced Repetition (間隔反復)') {
      // Spaced repetition intervals: 1, 3, 7, 14, 30 days
      technique.intervals.forEach((interval, i) => {
        const sessionDate = new Date(startDate);
        sessionDate.setDate(sessionDate.getDate() + interval + (index * 2));
        
        if (sessionDate <= deadline) {
          plan.push(createSession(task, subtopic, sessionDate, i));
        }
      });
    } else {
      // Even distribution for other techniques
      for (let i = 0; i < complexity.sessions; i++) {
        const sessionDate = new Date(startDate);
        const dayOffset = Math.floor((totalDays / complexity.sessions) * i) + (index * 1);
        sessionDate.setDate(sessionDate.getDate() + dayOffset);
        
        if (sessionDate <= deadline) {
          plan.push(createSession(task, subtopic, sessionDate, i));
        }
      }
    }
  });

  return plan.sort((a, b) => new Date(a.date) - new Date(b.date));
};
```

#### 2. Japanese Study Techniques Configuration

```javascript
// utils/studyTechniques.js
export const studyTechniques = {
  'Spaced Repetition (間隔反復)': {
    intervals: [1, 3, 7, 14, 30], // days
    description: 'Review at increasing intervals for long-term retention',
    effectiveness: 0.95, // ML weight for recommendations
    bestFor: ['memorization', 'vocabulary', 'formulas']
  },
  'Pomodoro (ポモドーロ)': {
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    description: '25min focus + 5min break cycles',
    effectiveness: 0.85,
    bestFor: ['problem-solving', 'reading', 'practice']
  },
  'Active Recall (能動想起)': {
    description: 'Test yourself without looking at materials',
    effectiveness: 0.90,
    bestFor: ['comprehension', 'application', 'analysis']
  }
};
```

#### 3. Progress Tracking & Analytics

```javascript
// hooks/useProgress.js
export const useProgress = (studyPlan) => {
  return useMemo(() => {
    const total = studyPlan.length;
    const completed = studyPlan.filter(s => s.completed).length;
    const today = new Date().toISOString().split('T')[0];
    const todayTotal = studyPlan.filter(s => s.date === today).length;
    const todayCompleted = studyPlan.filter(s => s.date === today && s.completed).length;
    
    // ML-inspired effectiveness calculation
    const techniqueEffectiveness = studyPlan.reduce((acc, session) => {
      if (session.completed && session.score) {
        const technique = session.technique;
        if (!acc[technique]) acc[technique] = { total: 0, score: 0 };
        acc[technique].total += 1;
        acc[technique].score += session.score;
      }
      return acc;
    }, {});
    
    return {
      overall: total ? Math.round((completed / total) * 100) : 0,
      today: todayTotal ? Math.round((todayCompleted / todayTotal) * 100) : 0,
      totalSessions: total,
      completedSessions: completed,
      techniqueEffectiveness
    };
  }, [studyPlan]);
};
```

## 🧠 ML-Inspired Adaptive Features

### 1. Complexity Assessment
The system uses pattern recognition to suggest optimal complexity levels:

```javascript
const assessComplexity = (topic, subtopics) => {
  // Analyze keywords for complexity indicators
  const complexityIndicators = {
    high: ['advanced', 'calculus', 'quantum', 'organic', 'theoretical'],
    medium: ['intermediate', 'algebra', 'biology', 'chemistry'],
    low: ['basic', 'introduction', 'fundamentals']
  };
  
  // ML-inspired scoring based on content analysis
  // In a full implementation, this would use NLP models
};
```

### 2. Adaptive Scheduling
Sessions are rescheduled based on performance patterns:

```javascript
const adaptiveReschedule = (completionHistory, upcomingSessions) => {
  const performancePattern = analyzePerformance(completionHistory);
  
  if (performancePattern.difficulty > 0.7) {
    // Increase session frequency for challenging topics
    return increaseFrequency(upcomingSessions);
  } else if (performancePattern.mastery > 0.9) {
    // Reduce frequency for mastered topics
    return reduceFrequency(upcomingSessions);
  }
  
  return upcomingSessions;
};
```

### 3. Technique Recommendation Engine

```javascript
const recommendTechnique = (topic, userHistory, currentPerformance) => {
  const techniqueScores = Object.entries(studyTechniques).map(([name, config]) => {
    let score = config.effectiveness;
    
    // Adjust based on user's historical performance with this technique
    if (userHistory[name]) {
      score *= (userHistory[name].successRate || 1);
    }
    
    // Adjust based on topic type
    if (config.bestFor.some(type => topic.toLowerCase().includes(type))) {
      score *= 1.2;
    }
    
    return { technique: name, score };
  });
  
  return techniqueScores.sort((a, b) => b.score - a.score)[0].technique;
};
```

## 📱 Deployment Options

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts for configuration
```

### Netlify Deployment
```bash
# Build the project
npm run build

# Drag and drop 'build' folder to Netlify
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Customization & Extensions

### Adding New Study Techniques
```javascript
// Extend studyTechniques object
const newTechniques = {
  'Feynman Technique (ファインマン技法)': {
    description: 'Explain concepts in simple terms',
    effectiveness: 0.88,
    bestFor: ['understanding', 'concepts', 'teaching']
  }
};
```

### Database Integration
For persistence beyond session storage:

```javascript
// Example with Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Save study plan
const saveStudyPlan = async (plan) => {
  const { data, error } = await supabase
    .from('study_plans')
    .insert(plan);
};
```

### API Integration
```javascript
// Connect to backend ML models
const getAdaptiveRecommendations = async (userProfile, studyHistory) => {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userProfile, studyHistory })
  });
  
  return response.json();
};
```

## 🧪 Testing

### Unit Tests
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### Example Test
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import StudentBuddyPlanner from './StudentBuddyPlanner';

test('creates study plan when task is added', () => {
  render(<StudentBuddyPlanner />);
  
  fireEvent.change(screen.getByPlaceholderText(/topic/i), {
    target: { value: 'Calculus' }
  });
  
  fireEvent.click(screen.getByText(/create study plan/i));
  
  expect(screen.getByText('Calculus')).toBeInTheDocument();
});
```

## 📊 Performance Optimization

### Code Splitting
```javascript
import { lazy, Suspense } from 'react';

const DashboardTab = lazy(() => import('./components/DashboardTab'));
const TasksTab = lazy(() => import('./components/TasksTab'));

// Wrap components in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <DashboardTab />
</Suspense>
```

### Memoization
```javascript
const MemoizedSessionCard = React.memo(({ session, onToggle }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.session.completed === nextProps.session.completed;
});
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Japanese study methodology research
- Spaced repetition algorithms from cognitive science
- Material Design principles for UX
- React community for excellent tooling

---

**Ready to revolutionize your study routine with Japanese learning techniques? Start your journey today!** 🚀
