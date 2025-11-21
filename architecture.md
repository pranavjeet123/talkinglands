# TalkingLands Architecture Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture Principles](#architecture-principles)
- [System Architecture](#system-architecture)
- [Technology Stack Decisions](#technology-stack-decisions)
- [Data Flow Architecture](#data-flow-architecture)
- [Communication Patterns](#communication-patterns)
- [Build & Deployment Strategy](#build--deployment-strategy)
- [Performance Optimizations](#performance-optimizations)
- [Scalability Considerations](#scalability-considerations)
- [Development Workflow](#development-workflow)
- [Security Considerations](#security-considerations)
- [Monitoring & Observability](#monitoring--observability)
- [Future Roadmap](#future-roadmap)

---

## Project Overview

**TalkingLands** is an enterprise-grade micro-frontend application designed for real estate analytics and geographical data visualization. The system implements a distributed frontend architecture using Module Federation, enabling independent development, deployment, and scaling of individual application components.

### Core Business Value
- **Real Estate Analytics**: Comprehensive location-based analytics for property evaluation
- **Interactive Visualization**: Rich geographical data presentation using modern mapping libraries
- **Real-time Collaboration**: Cross-application state synchronization for multi-user scenarios
- **Scalable Architecture**: Enterprise-ready system supporting multiple development teams

---

## Architecture Principles

### 1. **Micro-Frontend First**
- Each application domain is represented as an independent microfrontend
- Applications can be developed, tested, and deployed independently
- Technology stack decisions are decentralized to individual teams

### 2. **Event-Driven Communication**
- Reactive programming patterns using RxJS observables
- Loose coupling between microfrontends through event-based messaging
- Type-safe communication contracts across application boundaries

### 3. **Performance by Design**
- Modern build tools (Rspack) for optimal compilation performance
- Lazy loading and code splitting for reduced initial bundle sizes
- Intelligent caching strategies at build and runtime levels

### 4. **Developer Experience Priority**
- Hot module replacement for rapid development cycles
- Shared tooling and configuration across all applications
- Comprehensive testing strategies for each application layer

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Shell Application                        │
│                   (Module Federation Host)                     │
│                       Port: 4200                               │
└─────────────────────┬───────────────────┬───────────────────────┘
                      │                   │
        ┌─────────────▼─────────────┐   ┌─▼─────────────────────────┐
        │    Maps Microfrontend     │   │  Insights Microfrontend   │
        │       Port: 4201          │   │       Port: 4202          │
        │                           │   │                           │
        │ ┌───────────────────────┐ │   │ ┌───────────────────────┐ │
        │ │   Leaflet.js Maps     │ │   │ │  Analytics Dashboard  │ │
        │ │   GeoJSON Processing  │ │   │ │  Real-time Charts     │ │
        │ │   Location Markers    │ │   │ │  Currency Formatting  │ │
        │ └───────────────────────┘ │   │ └───────────────────────┘ │
        └─────────────┬─────────────┘   └─┬─────────────────────────┘
                      │                   │
                      └─────────┬─────────┘
                                │
        ┌─────────────────────────▼─────────────────────────┐
        │         Global Communication Layer               │
        │              (RxJS Observables)                  │
        │                                                  │
        │  ┌─────────────────┐  ┌─────────────────────────┐ │
        │  │ BehaviorSubject │  │   Message Bus Service   │ │
        │  │ State Streams   │  │   (Window.__GLOBAL__)   │ │
        │  └─────────────────┘  └─────────────────────────┘ │
        └──────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  Standalone Applications                        │
├─────────────────────────────────────────────────────────────────┤
│              TalkingLands (React Router SPA)                   │
│                       Port: 4200                               │
│                     (Vite Build Tool)                          │
└─────────────────────────────────────────────────────────────────┘
```

### Application Boundaries

#### 1. Shell Application (Host)
- **Responsibility**: Orchestrate and serve remote microfrontends
- **Technology**: React 19, Rspack, Module Federation
- **Port**: 4200
- **Routes**: 
  - `/` → Shell home/navigation
  - `/maps` → Maps microfrontend
  - `/insights` → Insights microfrontend

#### 2. Maps Microfrontend (Remote)
- **Responsibility**: Interactive geographical visualization
- **Technology**: React 19, Leaflet.js, TypeScript
- **Port**: 4201
- **Exposed Module**: `./Module`
- **Features**:
  - Interactive map rendering
  - GeoJSON data visualization
  - Location marker management
  - Real-time favorites synchronization

#### 3. Insights Microfrontend (Remote)
- **Responsibility**: Analytics dashboard and data insights
- **Technology**: React 19, TypeScript, RxJS
- **Port**: 4202
- **Exposed Module**: `./Module`
- **Features**:
  - Real-time analytics dashboard
  - Favorites aggregation
  - Statistical calculations
  - Currency formatting (INR)

#### 4. TalkingLands Standalone
- **Responsibility**: Independent SPA demonstrating traditional architecture
- **Technology**: React 19, React Router, Vite (intentionally different build tool)
- **Port**: 4200 (separate from shell)
- **Purpose**: Architectural comparison and standalone deployment option
- **Build Tool Rationale**: Uses Vite to demonstrate build tool flexibility and React Router integration

---

## Technology Stack Decisions

### Build Tools: Rspack as Primary, Vite for Standalone

#### **Primary Decision: Rspack for Micro-Frontend Applications**

**Applications using Rspack:**
- Shell Application (Host)
- Maps Microfrontend (Remote)
- Insights Microfrontend (Remote)

**Applications using Vite:**
- TalkingLands Standalone (React Router SPA)

**Justification for Rspack:**
```
Performance Metrics:
- Build Speed: 5-10x faster than Webpack
- Memory Usage: 30-50% lower memory consumption
- HMR Performance: Sub-100ms hot reloads
- Bundle Size: Comparable output with better tree shaking
```

**Implementation:**
```typescript
// rspack.config.ts
export default {
  plugins: [
    new NxAppRspackPlugin({
      tsConfig: './tsconfig.app.json',
      optimization: process.env['NODE_ENV'] === 'production',
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
    }),
    new NxReactRspackPlugin(),
    new NxModuleFederationPlugin({ config }, { dts: false }),
  ],
};
```

**Trade-offs Analysis:**

**Rspack (Micro-frontends):**
- ✅ **Pros**: Superior performance, Module Federation support, Webpack compatibility
- ✅ **Module Federation**: Native support for micro-frontend architecture
- ⚠️ **Cons**: Smaller ecosystem, newer technology with evolving documentation
- 🎯 **Risk Mitigation**: Webpack fallback configuration maintained for critical deployments

**Vite (Standalone App):**
- ✅ **Pros**: Excellent React Router integration, simpler configuration, fast dev server
- ✅ **Use Case**: Perfect for traditional SPA without micro-frontend complexity
- ⚠️ **Cons**: No Module Federation support (not needed for standalone app)
- 🎯 **Strategic Value**: Demonstrates architectural flexibility within monorepo

### Monorepo Management: Nx Workspace

#### **Decision: Nx for Build Orchestration**

**Benefits:**
- **Computation Caching**: Reduces build times by 60-80% in CI/CD
- **Task Dependencies**: Automatic dependency resolution and parallel execution
- **Code Sharing**: Shared TypeScript configurations and utility libraries
- **Affected Commands**: Only build/test changed applications

**Configuration:**
```json
{
  "namedInputs": {
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)"
    ]
  },
  "plugins": [
    "@nx/react/router-plugin",
    "@nx/module-federation",
    "@nx/rspack"
  ]
}
```

### State Management: RxJS vs Redux/Zustand

#### **Decision: RxJS for Inter-Microfrontend Communication**

**Rationale:**
- **Cross-Framework Compatibility**: Works independently of React state management
- **Reactive Programming**: Natural fit for real-time data streams
- **Memory Management**: Automatic subscription cleanup
- **Type Safety**: Full TypeScript integration

**Implementation Pattern:**
```typescript
class MicrofrontendCommunicationService {
  private static instance: MicrofrontendCommunicationService;
  private favoriteCandidatesSubject = new BehaviorSubject<Feature[]>([]);
  private globalMessageSubject = new Subject<MicrofrontendMessage>();
  
  static getInstance(): MicrofrontendCommunicationService {
    if (typeof window !== 'undefined' && 
        (window as any).__MICROFRONTEND_COMMUNICATION__) {
      return (window as any).__MICROFRONTEND_COMMUNICATION__;
    }
    // Create new instance
  }
}
```

### Frontend Framework: React 19

#### **Decision: React 19 with TypeScript**

**Advantages:**
- **Concurrent Features**: Improved rendering performance
- **Server Components**: Future-ready for SSR implementation
- **Automatic Batching**: Optimized state updates
- **Developer Tools**: Excellent debugging and profiling

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true,
    "incremental": true
  }
}
```

---

## Data Flow Architecture

### Communication Flow Diagram

![RxJS Communication Pattern - Maps and Insights Interaction](https://github.com/pranavjeet123/talkinglands/blob/main/public/download.png)

### State Management Layers

#### 1. Local Component State
- React hooks for UI-specific state
- Component-level form state and validation
- Temporary UI states (loading, error handling)

#### 2. Application State
- Application-specific business logic
- Route-level state management
- Local storage persistence

#### 3. Global Cross-App State
- RxJS BehaviorSubjects for shared state
- Event-driven communication between microfrontends
- Type-safe message contracts

```typescript
// State Layer Definitions
interface LocalState {
  // Component-specific state
  isLoading: boolean;
  selectedTab: string;
  formData: FormFields;
}

interface ApplicationState {
  // App-specific business state
  currentUser: User;
  mapViewport: MapBounds;
  filterSettings: FilterConfig;
}

interface GlobalState {
  // Cross-app shared state
  favoriteCandidates: Feature[];
  selectedCandidate: Feature | null;
  globalMessages: MicrofrontendMessage[];
}
```

---

## Communication Patterns

### Inter-Microfrontend Communication

#### 1. **Pub/Sub Pattern with RxJS**

**Implementation:**
```typescript
// Message Types
type MessageType = 
  | 'FAVORITE_ADDED'
  | 'FAVORITE_REMOVED' 
  | 'CANDIDATE_SELECTED'
  | 'VIEWPORT_CHANGED';

interface MicrofrontendMessage {
  type: MessageType;
  payload: unknown;
  source: string;
  timestamp: number;
}

// Publisher (Maps App)
const communication = getCommunicationService();
communication.addFavoriteCandidate(candidate, 'maps');

// Subscriber (Insights App)
useEffect(() => {
  const subscription = communication.favoriteCandidates$.subscribe(
    (favorites) => setFavorites(favorites)
  );
  return () => subscription.unsubscribe();
}, []);
```

#### 2. **Global Window Integration**

**Singleton Service Registration:**
```typescript
declare global {
  interface Window {
    __MICROFRONTEND_COMMUNICATION__: MicrofrontendCommunicationService;
  }
}

// Service Registration
if (typeof window !== 'undefined') {
  window.__MICROFRONTEND_COMMUNICATION__ = serviceInstance;
}
```

### API Communication Patterns

#### 1. **Mock Data Service Pattern**
```typescript
// Data fetching abstraction
class DataService {
  static async getCandidateLocations(): Promise<FeatureCollection> {
    const response = await fetch('/mock-data.json');
    return response.json();
  }
}
```

#### 2. **Future API Integration Ready**
```typescript
// Environment-based service selection
const dataService = process.env.NODE_ENV === 'production' 
  ? new ProductionDataService()
  : new MockDataService();
```

---

## Build & Deployment Strategy

### Development Environment

#### Local Development Setup
```bash
# Start all services in development mode
npm run dev:all

# Individual service development
npx nx serve shell      # Shell app (host)
npx nx serve maps       # Maps microfrontend
npx nx serve insights   # Insights microfrontend
npx nx serve talkinglands # Standalone app
```

#### Module Federation Configuration
```typescript
// Shell (Host) Configuration
const config: ModuleFederationConfig = {
  name: 'shell',
  remotes: [
    ['maps', 'http://localhost:4201'],
    ['insights', 'http://localhost:4202']
  ],
};

// Remote Configuration (Maps/Insights)
const config: ModuleFederationConfig = {
  name: 'maps', // or 'insights'
  exposes: {
    './Module': './src/remote-entry.ts',
  },
};
```

### Production Deployment

#### Build Strategy
```bash
# Production builds with optimization
npx nx build shell --prod
npx nx build maps --prod  
npx nx build insights --prod
npx nx build talkinglands --prod
```

#### Container Deployment Pattern
```dockerfile
# Multi-stage build for each microfrontend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

#### CDN Deployment Strategy
```
Production URLs:
- Shell: https://cdn.talkinglands.com/shell/
- Maps: https://cdn.talkinglands.com/maps/
- Insights: https://cdn.talkinglands.com/insights/
```

---

## Performance Optimizations

### Build Performance

#### 1. **Rspack Optimizations**
- **Parallel Compilation**: Multi-core utilization for faster builds
- **Incremental Builds**: Only recompile changed modules
- **Tree Shaking**: Dead code elimination in production builds

#### 2. **Nx Computation Caching**
```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test", "e2e"]
      }
    }
  }
}
```

### Runtime Performance

#### 1. **Code Splitting Strategy**
```typescript
// Dynamic imports for route-based splitting
const MapsApp = React.lazy(() => import('maps/Module'));
const InsightsApp = React.lazy(() => import('insights/Module'));

// Component-level splitting
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

#### 2. **Bundle Optimization**
- **Module Federation**: Shared dependencies across microfrontends
- **Dynamic Imports**: Lazy loading of non-critical features
- **Asset Optimization**: Image compression and lazy loading

#### 3. **Memory Management**
```typescript
// RxJS subscription cleanup
useEffect(() => {
  const subscriptions = [
    communication.favoriteCandidates$.subscribe(setFavorites),
    communication.selectedCandidate$.subscribe(setSelected)
  ];
  
  return () => {
    subscriptions.forEach(sub => sub.unsubscribe());
  };
}, []);
```

### Monitoring Metrics

#### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Time to Interactive**: < 3.5s

---

## Scalability Considerations

### Horizontal Scaling

#### 1. **Microfrontend Expansion**
```
Current Architecture:
Shell → [Maps, Insights]

Future Expansion:
Shell → [Maps, Insights, Analytics, Reports, Admin, UserSettings]
```

#### 2. **Team Scaling Strategy**
- **Domain-Driven Development**: Each microfrontend owned by a dedicated team
- **Independent Deployment**: Teams can deploy without coordination
- **Technology Flexibility**: Teams choose optimal tools for their domain

### Vertical Scaling

#### 1. **Feature Enhancement Within Apps**
- **Maps**: 3D visualization, real-time tracking, advanced filters
- **Insights**: Machine learning analytics, predictive modeling
- **New Domains**: Authentication, notifications, reporting

#### 2. **Infrastructure Scaling**
```yaml
# Kubernetes deployment scaling
apiVersion: apps/v1
kind: Deployment
metadata:
  name: maps-microfrontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: maps
  template:
    spec:
      containers:
      - name: maps
        image: talkinglands/maps:latest
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### Data Scaling

#### 1. **API Gateway Integration**
```typescript
// Microservice integration ready
class ApiService {
  private baseUrl = process.env.REACT_APP_API_BASE_URL;
  
  async getCandidateLocations(params: LocationQuery) {
    return fetch(`${this.baseUrl}/locations`, {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }
}
```

#### 2. **State Management Scaling**
```typescript
// Redux Toolkit integration for complex state
const store = configureStore({
  reducer: {
    maps: mapsReducer,
    insights: insightsReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
```

---

## Development Workflow

### Development Modes

#### 1. **Isolated Development**
```bash
# Develop individual microfrontend in isolation
npx nx serve maps
# Access at http://localhost:4201
```

#### 2. **Integrated Development**
```bash
# Run shell with all remotes
npx nx serve shell
# Automatically proxies to remote apps
```

#### 3. **Hybrid Development**
```bash
# Run shell with some local, some remote
MAPS_REMOTE_URL=https://staging.talkinglands.com/maps npx nx serve shell
```

### Testing Strategy

#### 1. **Unit Testing**
```typescript
// Jest configuration for each app
export default {
  displayName: 'maps',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': '@swc/jest',
  },
};
```

#### 2. **Integration Testing**
```typescript
// Cross-microfrontend integration tests
describe('Maps-Insights Integration', () => {
  it('should sync favorites across apps', async () => {
    const { getByTestId } = render(<ShellApp />);
    
    // Add favorite in Maps
    fireEvent.click(getByTestId('add-favorite-btn'));
    
    // Verify update in Insights
    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('1');
    });
  });
});
```

#### 3. **E2E Testing with Playwright**
```typescript
test('full user workflow', async ({ page }) => {
  await page.goto('http://localhost:4200');
  
  // Navigate to maps
  await page.click('[data-testid="maps-nav"]');
  
  // Add location to favorites
  await page.click('[data-testid="location-marker"]');
  await page.click('[data-testid="add-favorite"]');
  
  // Navigate to insights
  await page.click('[data-testid="insights-nav"]');
  
  // Verify favorite appears in dashboard
  await expect(page.locator('[data-testid="favorites-list"]')).toContainText('Location Name');
});
```

### Code Quality Standards

#### 1. **ESLint Configuration**
```json
{
  "extends": [
    "@nx/eslint-plugin-nx/recommended",
    "@nx/react",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@nx/enforce-module-boundaries": [
      "error",
      {
        "enforceBuildableLibDependency": true,
        "allowCircularSelfDependency": true
      }
    ]
  }
}
```

#### 2. **Pre-commit Hooks**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

---

## Security Considerations

### Microfrontend Security

#### 1. **Content Security Policy**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               connect-src 'self' http://localhost:4201 http://localhost:4202;">
```

#### 2. **Cross-Origin Resource Sharing**
```typescript
// Rspack dev server configuration
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
  },
}
```

### Data Security

#### 1. **Type Safety**
```typescript
// Strict TypeScript interfaces for all communication
interface SecureMessage {
  readonly type: MessageType;
  readonly payload: unknown;
  readonly source: string;
  readonly timestamp: number;
}
```

#### 2. **Input Validation**
```typescript
// Runtime type checking for external data
function validateFeature(data: unknown): data is Feature {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    data.type === 'Feature'
  );
}
```

---

## Monitoring & Observability

### Performance Monitoring

#### 1. **Core Web Vitals Tracking**
```typescript
// Performance observer for metrics collection
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'navigation') {
      console.log('Navigation timing:', entry);
    }
  });
});
observer.observe({ entryTypes: ['navigation', 'paint'] });
```

#### 2. **Error Boundary Implementation**
```typescript
class MicrofrontendErrorBoundary extends React.Component {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Microfrontend Error:', error, errorInfo);
    // Send to monitoring service
  }
}
```

### Application Metrics

#### 1. **Custom Metrics Collection**
```typescript
// Business metrics tracking
const metrics = {
  favoriteActions: 0,
  mapInteractions: 0,
  dashboardViews: 0
};

function trackFavoriteAction() {
  metrics.favoriteActions++;
  // Send to analytics service
}
```

#### 2. **Real-time Monitoring Dashboard**
```typescript
// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    memory: process.memoryUsage(),
  });
});
```

---

## Space for enhancement

#### 1. **Platform Evolution**
- Multi-tenant architecture
- Plugin ecosystem for third-party integrations
- Advanced AI/ML analytics
- Real-time collaboration features

#### 2. **Technology Upgrades**
- Migration to newer React features (Server Components)
- GraphQL integration for efficient data fetching
- WebAssembly modules for compute-intensive operations

---

## Conclusion

The TalkingLands architecture represents a modern, scalable approach to enterprise frontend development. By leveraging micro-frontend patterns, reactive programming, and cutting-edge build tools, the system provides:

- **Developer Productivity**: Fast build times, hot reloading, and isolated development
- **Scalability**: Independent deployment and team scaling capabilities
- **Performance**: Optimized bundle sizes and runtime performance
- **Maintainability**: Clear separation of concerns and type safety
- **Future-Ready**: Extensible architecture supporting emerging technologies

This architecture positions TalkingLands for long-term success while providing immediate value through its comprehensive real estate analytics capabilities.

---

**Document Version**: 1.0  
**Last Updated**: November 19, 2025  
**Author**: Pranavjeet Mishra  
