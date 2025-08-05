# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build the production application
- `npm run deploy` - Deploy to Firebase hosting (production)
- `npm run deploy:hosting` - Deploy to Firebase hosting only
- `firebase emulators:start` - Start Firebase emulators locally (after running build)
- `firebase deploy --only hosting` - Deploy hosting only
- `firebase hosting:channel:deploy CHANNEL_ID` - Deploy to specific channel (auto-deleted after 7 days)

## Architecture Overview

This is a SvelteKit application that serves as a frontend for Safe Harbor protocol agreements. The app displays protocols that have adopted Safe Harbor agreements and their associated bounty/security information.

### Core Data Flow
1. **Firebase Integration**: The app connects to Firestore to fetch protocol and agreement data
2. **API Layer**: `/api/v1/agreements/+server.ts` provides the main data endpoint that:
   - Fetches protocols from Firestore `protocols` collection
   - Enriches each protocol with SafeHarbor agreement details via document references
   - Filters to only show protocols with valid SafeHarbor content
   - Sorts by TVL (Total Value Locked)
3. **External Data**: Fetches TVL data from DeFiLlama API (`api.llama.fi/v2/chains`)

### Key Type System
- **Protocol**: Main entity representing DeFi protocols with TVL, category, contact details
- **SafeHarborAgreement**: Union type supporting multiple versions:
  - `seal-1` (V1): Basic agreement with EVM chain support
  - `seal-2` (V2): Enhanced with CAIP-2/CAIP-10 chain/transaction IDs  
  - `immunefi-1`: Integration with Immunefi bounty platform
- Each version has corresponding `AgreementDetails` types with version-specific fields

### Component Structure
- **Safe Harbor Components**: Located in `src/lib/components/safe-harbor/`
  - Version-specific renderers for different agreement types
  - Asset scope and bounty terms display components
  - Recovery address management
- **Shared Components**: Generic UI components (cards, navigation, etc.)

### Deployment
- Uses Firebase Hosting with SvelteKit adapter-auto
- GitHub Actions handle automatic deployments on push to main
- Firebase config is publicly visible (normal for client-side Firebase apps)
- Local development requires building first, then using Firebase emulators

### Data Sources
- **Firestore**: Protocol metadata and SafeHarbor agreement documents
- **DeFiLlama**: Real-time TVL data for protocol ranking
- Document references in Firestore link protocols to their specific agreement details