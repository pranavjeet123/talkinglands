# TalkingLands

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A modern micro-frontend application built with Nx workspace and module federation architecture.

This monorepo contains multiple applications implementing a distributed micro-frontend system with real-time inter-application communication using RxJS observables.

## Architecture Overview

### Technology Stack
- **Nx Workspace 22.0.3** for monorepo management and build orchestration
- **Module Federation** (@module-federation/enhanced) for micro-frontend runtime integration
- **Rspack** as the primary build tool for micro-frontend applications (Shell, Maps, Insights)
- **Vite** as the build tool for standalone TalkingLands application (React Router SPA)
- **React 19.0.0** with TypeScript for component development
- **RxJS 7.8.2** for reactive state management and inter-microfrontend communication
- **Tailwind CSS** for utility-first styling
- **Leaflet.js** for geospatial data visualization

### Repository Structure
```
apps/
├── shell/                 # Module federation host application
├── shell-e2e/            # E2E tests for shell
├── maps/                  # Maps microfrontend (remote)
├── maps-e2e/             # E2E tests for maps
├── insights/              # Analytics microfrontend (remote)
├── insights-e2e/         # E2E tests for insights
├── talkinglands/          # Standalone React Router application
└── talkinglands-e2e/     # E2E tests for talkinglands
```

### Micro-Frontend Applications

#### Shell Application
- **Type**: Module Federation Host
- **Runtime**: Rspack dev server
- **Purpose**: Orchestrates and serves remote microfrontends at build time
- **Routes**: `/maps`, `/insights`, `/`

#### Maps Microfrontend
- **Type**: Module Federation Remote
- **Build Tool**: Rspack with Module Federation support
- **Exposed Module**: `./Module`
- **Features**: 
  - Interactive Leaflet.js maps with candidate location markers
  - Real-time favorites management with RxJS state synchronization
  - GeoJSON data processing and visualization
  - Touch-optimized responsive interface

#### Insights Microfrontend
- **Type**: Module Federation Remote
- **Build Tool**: Rspack with Module Federation support  
- **Exposed Module**: `./Module`
- **Features**:
  - Real-time analytics dashboard consuming Maps application state
  - Favorites aggregation and statistical analysis
  - Live activity feed with timestamp tracking
  - Currency formatting for rent data (INR)

#### TalkingLands Application
- **Type**: Standalone React application with React Router
- **Build Tool**: Vite (optimized for React Router SPA development)
- **Purpose**: Independent application demonstrating traditional SPA architecture
- **Rationale**: Uses Vite for simplified configuration and excellent React Router integration

## Inter-Microfrontend Communication System

### RxJS-Based Communication Architecture
The application implements a sophisticated real-time communication system using RxJS observables for cross-microfrontend state synchronization.

#### Technical Implementation
```typescript
// Communication Service (Singleton Pattern)
class MicrofrontendCommunicationService {
  private favoriteCandidatesSubject = new BehaviorSubject<Feature[]>([]);
  private selectedCandidateSubject = new BehaviorSubject<Feature | null>(null);
  private globalMessageSubject = new Subject<MicrofrontendMessage>();
}

// Global Window Integration
window.__MICROFRONTEND_COMMUNICATION__ = serviceInstance;
```

#### Data Flow Architecture
```
Maps Microfrontend
    ↓ User Actions (add/remove favorites)
    ↓ BehaviorSubject.next()
Global RxJS State (Window Object)
    ↓ Observable subscriptions
    ↓ Real-time updates
Insights Microfrontend
    ↓ Dashboard updates, analytics
```

#### Communication Features
- **Bidirectional State Sync**: Changes in either microfrontend instantly reflect across applications
- **Type Safety**: Full TypeScript interfaces for all message payloads and state objects
- **Memory Management**: Automatic subscription cleanup on component unmount
- **Singleton Pattern**: Single source of truth for global communication state
- **Message Types**: Structured message system with type discrimination

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/tutorials/react-monorepo-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created.

## Development Workflow

### Build System Configuration
- **Rspack**: Primary build tool for micro-frontend applications (Shell, Maps, Insights)
  - Optimized for Module Federation architecture
  - 5-10x faster build performance compared to Webpack
  - Native TypeScript support with hot module replacement
- **Vite**: Build tool for TalkingLands standalone application
  - Optimized for React Router SPA development
  - Lightning-fast development server with HMR
  - Simpler configuration for traditional single-page applications
- **TypeScript**: Strict mode enabled with incremental compilation across all applications
- **Module Federation**: Static remotes served at build time for micro-frontend integration

## Build Tool Strategy

The project strategically uses **two different build tools** optimized for different architectural patterns:

### Rspack for Micro-Frontend Applications
**Applications**: Shell (Host), Maps (Remote), Insights (Remote)

**Why Rspack:**
- ✅ **Module Federation Support**: Native integration for micro-frontend architecture
- ✅ **Performance**: 5-10x faster builds than Webpack (Rust-based implementation)
- ✅ **Webpack Compatibility**: Drop-in replacement with existing ecosystem support
- ✅ **Enterprise Scale**: Optimized for complex, distributed frontend systems

### Vite for Standalone Application
**Application**: TalkingLands (React Router SPA)

**Why Vite:**
- ✅ **React Router Optimization**: Built-in React Router dev plugin support
- ✅ **Development Speed**: Lightning-fast HMR for standalone development
- ✅ **Simplified Configuration**: Perfect for traditional SPA without micro-frontend complexity
- ✅ **Architectural Flexibility**: Demonstrates build tool choice freedom within monorepo

This dual-build-tool approach showcases the **flexibility of Nx workspace** to support different technologies for different architectural patterns within the same monorepo.

### Development Servers

Start the shell application (module federation host):
```sh
npx nx serve shell
```

Start individual microfrontends for isolated development:
```sh
npx nx serve maps     # Maps microfrontend
npx nx serve insights # Insights microfrontend
```

Start the standalone React Router application:
```sh
npx nx serve talkinglands
```

### Production Builds

Generate optimized production bundles:
```sh
# Micro-frontend applications (using Rspack)
npx nx build shell      # Module federation host
npx nx build maps       # Maps microfrontend  
npx nx build insights   # Insights microfrontend

# Standalone application (using Vite)
npx nx build talkinglands # Standalone React Router SPA
```

### Testing and Quality Assurance

Execute E2E tests for all applications:
```sh
npx nx e2e shell-e2e
npx nx e2e maps-e2e  
npx nx e2e insights-e2e
npx nx e2e talkinglands-e2e
```


## Data Architecture

### Mock Data Structure
- **Location**: `/public/mock-data.json`
- **Format**: GeoJSON FeatureCollection specification
- **Content**: 
  - Points of Interest (POI): cafes, offices, transit stations, universities, malls, residential areas
  - Candidate locations with estimated rent data in INR
  - Geographic coordinates for map visualization


## Development Tools and Workspace Management

### Nx Workspace Features
- **Computation Caching**: Intelligent build and test caching for improved performance
- **Task Dependencies**: Automated dependency graph execution
- **Code Sharing**: Shared TypeScript configurations and build tools
- **Parallel Execution**: Concurrent build and test execution across applications

### Code Quality and Standards  
- **ESLint**: Configured with React and TypeScript rules across all applications
- **Prettier**: Consistent code formatting with shared configuration
- **TypeScript**: Strict mode compilation with incremental builds
- **Playwright**: End-to-end testing framework for all applications

### Project Structure Standards
Each application follows a consistent structure:
```
apps/{application}/
├── src/
│   ├── app/                 # React components and application logic
│   │   ├── components/      # Reusable UI components  
│   │   └── services/        # Business logic and API services
│   ├── types/               # TypeScript type definitions
│   └── styles.css           # Tailwind CSS imports
├── public/                  # Static assets
├── rspack.config.ts         # Build configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Application-specific dependencies
```

## Contributors

**Pranavjeet Mishra** - Solution Architect &  Developer  
Contact: pranavjeet.m@gmail.com  
LinkedIn: [linkedin.com/in/pranavjeet](https://linkedin.com/in/pranavjeet)

## Reference Documentation

- [Nx Documentation](https://nx.dev) - Nx workspace and tooling documentation  
- [Module Federation Documentation](https://module-federation.github.io/) - Micro-frontend architecture patterns
