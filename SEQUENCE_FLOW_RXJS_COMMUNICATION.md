# RxJS Communication Pattern - Sequence Flow
## Maps ↔️ Insights Microfrontend Communication

This document explains the RxJS-based communication pattern used for sharing data between the Maps and Insights microfrontends when a user clicks on favorites from the candidate list.

---

## 🎯 Architecture Overview

The application uses a **Singleton Communication Service** with RxJS Subjects to enable real-time, reactive data sharing between microfrontends:

- **BehaviorSubject**: Stores and broadcasts the current state (favorites list, selected candidate)
- **Subject**: Acts as a message bus for event-driven communication
- **Global Window Object**: Ensures single instance across microfrontends

---

## 📊 Sequence Flow Diagram

```mermaid
User->MapsList:Click ★ on candidate
note over CommService:Singleton Pattern via\nwindow.__MICROFRONTEND_COMMUNICATION__
MapsList->CommService:getCommunicationService()
MapsList<--CommService:Return singleton instance
MapsList->CommService:addFavoriteCandidate(candidate, 'maps')
note over CommService:Check if already favorite
CommService->FavSubject:Get current value (.value property)
CommService<--FavSubject:Current favorites array
note over CommService:If not duplicate, proceed with update
CommService->FavSubject:next([...currentFavorites, newCandidate])
FavSubject->MapsList:Emit updated favorites[] array
FavSubject->InsightsDash:Emit updated favorites[] array
note over InsightsDash:React useEffect detects change\nvia subscription
InsightsDash->InsightsDash:setFavorites(newFavorites)
InsightsDash->InsightsDash:Update UI with new data
CommService->MsgSubject:sendMessage('FAVORITE_ADDED', candidate, 'maps')
note over MsgSubject:Broadcast event to all subscribers\nfor analytics/logging
MsgSubject->MapsList:Emit message event
MsgSubject->InsightsDash:Emit message event
MapsList->CommService:sendMessage('FAVORITE_ANALYTICS', {...}, 'maps')
CommService->MsgSubject:next(analytics message)
note over MsgSubject:Optional analytics tracking
note over InsightsDash:Dashboard now displays\nupdated favorites list
```

---

## 🔄 RxJS Subjects Interaction & Working

### 1. **Singleton Communication Service**

```typescript
class MicrofrontendCommunicationService {
  private static instance: MicrofrontendCommunicationService;
  
  // Subjects for data sharing
  private globalMessageSubject = new Subject<MicrofrontendMessage>();
  private favoriteCandidatesSubject = new BehaviorSubject<Feature[]>([]);
  private selectedCandidateSubject = new BehaviorSubject<Feature | null>(null);
  
  static getInstance() {
    // Check global window object first
    if (window.__MICROFRONTEND_COMMUNICATION__) {
      return window.__MICROFRONTEND_COMMUNICATION__;
    }
    // Create new instance and store globally
    this.instance = new MicrofrontendCommunicationService();
    window.__MICROFRONTEND_COMMUNICATION__ = this.instance;
    return this.instance;
  }
}
```

**Why Singleton?**
- Ensures both Maps and Insights use the **same instance**
- Prevents data duplication or sync issues
- Shares memory across Module Federation microfrontends

---

### 2. **BehaviorSubject for State Management**

```typescript
private favoriteCandidatesSubject = new BehaviorSubject<Feature[]>([]);
```

**Key Characteristics:**
- **Stores current value**: Always has a value (starts with `[]`)
- **Emits immediately**: New subscribers get current state instantly
- **Replays last value**: No data loss when components mount late

**Working:**
```typescript
// Maps: Add favorite
addFavoriteCandidate(candidate: Feature) {
  const current = this.favoriteCandidatesSubject.value; // Get current state
  const updated = [...current, candidate]; // Immutable update
  this.favoriteCandidatesSubject.next(updated); // Emit new state
}

// Maps & Insights: Subscribe to updates
favoriteCandidates$.subscribe(favorites => {
  console.log('Received:', favorites); // Automatically receives updates
});
```

---

### 3. **Subject for Event Bus**

```typescript
private globalMessageSubject = new Subject<MicrofrontendMessage>();
```

**Key Characteristics:**
- **No initial value**: Doesn't store state
- **Multicast**: Broadcasts to all subscribers
- **Hot Observable**: Doesn't replay past events

**Working:**
```typescript
// Send event
sendMessage(type: string, payload: unknown, source: string) {
  this.globalMessageSubject.next({
    type,      // 'FAVORITE_ADDED', 'CANDIDATE_SELECTED'
    payload,   // Data object
    source,    // 'maps' or 'insights'
    timestamp: Date.now()
  });
}

// Listen to events
messages$.subscribe(msg => {
  if (msg.type === 'FAVORITE_ADDED') {
    console.log('New favorite from:', msg.source);
  }
});
```

---

## 📋 Detailed Flow Steps

### **Step 1: User Interaction**
```
User clicks ★ (star) icon on a candidate in Maps/LocationList
```

### **Step 2: Maps Component Handler**
```typescript
const handleAddToFavorites = (candidate: Feature) => {
  const communication = getCommunicationService(); // Get singleton
  communication.addFavoriteCandidate(candidate, 'maps');
};
```

### **Step 3: Communication Service Processes**
```typescript
addFavoriteCandidate(candidate: Feature, source = 'maps') {
  // 1. Get current favorites from BehaviorSubject
  const currentFavorites = this.favoriteCandidatesSubject.value;
  
  // 2. Check for duplicates
  const isAlreadyFavorite = currentFavorites.some(
    fav => fav.properties.id === candidate.properties.id
  );
  
  if (!isAlreadyFavorite) {
    // 3. Create new array (immutable)
    const newFavorites = [...currentFavorites, candidate];
    
    // 4. Emit to BehaviorSubject (updates all subscribers)
    this.favoriteCandidatesSubject.next(newFavorites);
    
    // 5. Send event message for tracking
    this.sendMessage('FAVORITE_ADDED', candidate, source);
  }
}
```

### **Step 4: BehaviorSubject Broadcasts**
```typescript
// Both Maps and Insights have subscriptions:

// In Maps/LocationList.tsx:
useEffect(() => {
  const subscription = communication.favoriteCandidates$.subscribe(
    (favorites) => setFavorites(favorites) // Update local state
  );
  return () => subscription.unsubscribe();
}, []);

// In Insights/FavoritesDashboard.tsx:
useEffect(() => {
  const subscription = communication.favoriteCandidates$.subscribe(
    (favorites) => {
      console.log('📊 Received favorites:', favorites.length);
      setFavorites(favorites); // Update dashboard
    }
  );
  return () => subscription.unsubscribe();
}, []);
```

### **Step 5: React Re-renders**
- Maps: Updates star icon to filled state
- Insights: Adds new card to favorites dashboard
- Both: Reflect the same data instantly

---

## 🧪 Subject Types Comparison

| Feature | BehaviorSubject | Subject | ReplaySubject |
|---------|----------------|---------|---------------|
| **Initial Value** | Required | None | None |
| **Current Value** | `.value` property | ❌ | ❌ |
| **Late Subscribers** | Get current value | Get nothing | Get buffered values |
| **Use Case** | State management | Event bus | Historical events |
| **Example** | Favorites list | Click events | Message history |

**In this app:**
- ✅ `favoriteCandidatesSubject`: **BehaviorSubject** (needs current state)
- ✅ `selectedCandidateSubject`: **BehaviorSubject** (needs current selection)
- ✅ `globalMessageSubject`: **Subject** (events don't need replay)

---

## 🔐 Key Design Patterns

### 1. **Singleton via Window Object**
```typescript
if (window.__MICROFRONTEND_COMMUNICATION__) {
  return window.__MICROFRONTEND_COMMUNICATION__;
}
```
Ensures Module Federation apps share the same instance.

### 2. **Immutable State Updates**
```typescript
const newFavorites = [...currentFavorites, candidate]; // ✅ Good
currentFavorites.push(candidate); // ❌ Bad (mutates)
```
Prevents bugs and enables proper React re-renders.

### 3. **Source Tracking**
```typescript
addFavoriteCandidate(candidate, 'maps'); // Track origin
```
Helps debug and prevent infinite loops.

### 4. **Subscription Cleanup**
```typescript
useEffect(() => {
  const sub = communication.favoriteCandidates$.subscribe(...);
  return () => sub.unsubscribe(); // Prevent memory leaks
}, []);
```

---

## 📡 Message Types

| Message Type | Payload | Triggered By | Subscribers |
|--------------|---------|--------------|-------------|
| `FAVORITE_ADDED` | `Feature` object | Maps | Both apps |
| `FAVORITE_REMOVED` | `{ candidateId }` | Maps/Insights | Both apps |
| `FAVORITES_SET` | `Feature[]` array | Initial load | Both apps |
| `CANDIDATE_SELECTED` | `Feature \| null` | Map click | Both apps |
| `FAVORITE_ANALYTICS` | Analytics data | Maps | Optional trackers |

---

## 🎨 Real-World Example Flow

```
1. User clicks ★ on "Candidate #123" in Maps
   └─> MapsList.handleAddToFavorites()

2. Communication Service receives request
   └─> addFavoriteCandidate(candidate#123, 'maps')

3. BehaviorSubject checks current state
   └─> Current: [candidate#456, candidate#789]
   └─> New: [candidate#456, candidate#789, candidate#123]

4. BehaviorSubject emits new array
   └─> Maps subscription: Updates UI (★ → ⭐)
   └─> Insights subscription: Adds new card to dashboard

5. Subject broadcasts event message
   └─> Type: 'FAVORITE_ADDED'
   └─> Payload: candidate#123 details
   └─> Source: 'maps'
   └─> Timestamp: 1700000000000

6. Both UIs now show 3 favorites in sync! ✅
```

---

## 🔧 Testing the Communication

### Manual Test
1. Open Maps microfrontend
2. Click favorite on 3 candidates
3. Switch to Insights microfrontend
4. Verify all 3 appear in dashboard
5. Remove 1 from Insights
6. Switch back to Maps
7. Verify star icon updated

### Console Logs
```
🗺️ [Maps] Adding favorite: candidate-123 from: maps
🗺️ [Maps] Favorites updated. Total: 3
📊 [Insights] Received favorites update: 3
```

---

## 🚀 Benefits of This Pattern

✅ **Decoupled**: Apps don't directly reference each other  
✅ **Reactive**: Automatic updates without polling  
✅ **Type-Safe**: TypeScript interfaces for all messages  
✅ **Scalable**: Easy to add new microfrontends  
✅ **Testable**: Can mock communication service  
✅ **Real-time**: Instant synchronization across apps  

---

## 📚 Reference

- **Files:**
  - `apps/maps/src/services/communication.ts`
  - `apps/insights/src/services/communication.ts`
  - `apps/maps/src/app/components/LocationList.tsx`
  - `apps/insights/src/app/components/FavoritesDashboard.tsx`

- **RxJS Docs:**
  - [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject)
  - [Subject](https://rxjs.dev/api/index/class/Subject)
  - [Observable](https://rxjs.dev/guide/observable)

---

*Generated: November 21, 2025*
