# LeaguePage Component

## Overview
The LeaguePage component is a React Native implementation of the "Ligler" (Leagues) page, converted from the Figma design. It provides a comprehensive interface for users to discover, join, and create leagues.

## Features

### 1. Tab Navigation
- **Keşfet (Discover)**: Browse available leagues to join
- **Liglerım (My Leagues)**: View leagues the user has already joined
- **Oluştur (Create)**: Create new leagues using credits or tickets

### 2. League Discovery
- Display available leagues with detailed information
- Show league categories, participant counts, and rewards
- Join leagues with credit costs
- View league details

### 3. My Leagues
- Display joined leagues with current ranking
- View leaderboards for each league
- Track performance and standings

### 4. League Creation
- Create leagues using credits (5,000 credits)
- Purchase league tickets for premium features
- Configure league settings:
  - League name
  - Categories (Sports, Technology, Crypto, Politics, Economy, Entertainment)
  - Privacy settings (Private/Public)
  - Maximum participants
  - Duration
  - Entry fee

### 5. Modals
- **Credit Purchase Modal**: Confirm league creation with credits
- **Ticket Purchase Modal**: Buy league tickets with different packages
- **League Configuration Modal**: Set up league parameters
- **Join League Modal**: Confirm joining a league
- **Leaderboard Modal**: View rankings and scores

## Props

```typescript
interface LeaguePageProps {
  showHeader?: boolean;        // Show/hide the main header
  onNavigate?: (page: string) => void;  // Navigation callback
}
```

## Usage

```typescript
import { LeaguePage } from './components/LeaguePage';

// Basic usage
<LeaguePage />

// With custom navigation
<LeaguePage 
  showHeader={false} 
  onNavigate={(page) => console.log('Navigate to:', page)} 
/>
```

## Design Features

### Colors
- Primary: `#432870` (Purple)
- Secondary: `#B29EFD` (Light Purple)
- Background: `#F2F3F5` (Light Gray)
- Text: `#202020` (Dark Gray)

### Styling
- Rounded corners (16-24px radius)
- Shadow effects for depth
- Gradient backgrounds for buttons
- Responsive design for mobile

### Icons
- Uses @expo/vector-icons for consistent iconography
- Emoji icons for categories and features
- Custom medal icons for leaderboards

## Data Structure

### League Object
```typescript
interface League {
  id: number;
  name: string;
  description: string;
  category: string;
  participants: number;
  maxParticipants: number;
  prize: string;
  endDate: string;
  isJoined: boolean;
  position?: number;
  creator: string;
  joinCost?: number;
}
```

### Leaderboard User
```typescript
interface LeaderboardUser {
  rank: number;
  username: string;
  points: number;
  avatar: string;
  isCurrentUser?: boolean;
}
```

## Dependencies
- React Native core components
- @expo/vector-icons for icons
- React hooks for state management

## Notes
- Component is fully responsive and follows mobile design patterns
- All text is in Turkish as per the original design
- Supports both light and dark theme compatibility
- Includes proper TypeScript types for type safety 