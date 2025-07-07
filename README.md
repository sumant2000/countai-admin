# CountAI Admin Dashboard

A comprehensive admin dashboard for the CountAI system that provides real-time monitoring and management capabilities.

## Features

### 🔐 Worker Authentication
- **LocalStorage-based authentication**: Simple worker identification system
- **Persistent sessions**: Worker credentials stored locally for seamless access
- **Worker management**: Track individual worker activity and performance

### 📊 Dashboard Features
- **Daily photo count**: Real-time count of photos taken today
- **Total cumulative count**: Complete history since system launch
- **Error rate tracking**: Percentage of model failures and processing errors
- **Model usage analytics**: Visual charts showing API call frequency for each of the 5 models:
  - Round Type
  - Plate Type
  - ND Press
  - Baseboard
  - Aluminum Stairs

### 🖼️ Photo Gallery Features
- **Advanced filtering**: Filter by date range, model type, worker ID, and status
- **Worker identification**: Track which worker took each photo
- **Photo metadata display**: 
  - Worker ID and timestamp
  - Model used for processing
  - Count results and confidence scores
  - File size, resolution, and location data
- **Detailed photo view**: Click any photo to see comprehensive metadata
- **Real-time updates**: Auto-refresh capabilities with manual refresh option

### 📈 Data Export
- **CSV export functionality**: Export all collected data with complete metadata
- **Filtered exports**: Export only the data matching current filter criteria
- **Comprehensive data**: Includes worker ID, timestamps, model usage, count results, confidence scores, and metadata

## Technical Implementation

### Data Structure
- **Azure Database Integration**: Designed to query the same database storing user-submitted data
- **Real-time analytics**: Live dashboard updates every 30 seconds
- **Efficient filtering**: Client-side filtering for responsive user experience

### Authentication System
- **No complex authentication required**: Simple worker ID input system
- **LocalStorage persistence**: Worker credentials maintained across sessions
- **Logout functionality**: Easy worker switching capabilities

### Export Format
CSV exports include the following fields:
- Photo ID
- Worker ID  
- Timestamp (Unix)
- Date Time (Human readable)
- Model Used
- Count Result
- Confidence Score
- Status (Success/Error)
- Error Reason (if applicable)
- File Size (bytes)
- Resolution
- Location

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Usage
1. Open http://localhost:3000 in your browser
2. Enter your worker ID when prompted (this will be stored locally)
3. Navigate between Dashboard and Photo Gallery using the sidebar
4. Use filters in the Photo Gallery to find specific photos
5. Export data using the CSV export button

## Project Structure
```
components/
├── admin-layout.tsx       # Main layout with navigation
├── dashboard.tsx          # Dashboard with analytics
├── photo-gallery.tsx     # Photo gallery with filters
├── worker-auth.tsx        # Authentication component
└── ui/                    # Reusable UI components

lib/
├── types.ts              # TypeScript type definitions
├── services.ts           # Data services and LocalStorage management
└── utils.ts              # Utility functions
```

## Configuration

### Database Integration
To connect to your Azure database, modify the `DataService` class in `lib/services.ts`:

```typescript
// Replace mock data methods with actual Azure DB calls
static async getPhotos(): Promise<PhotoData[]> {
  // Your Azure DB query implementation
}
```

### Environment Variables
Create a `.env.local` file for environment-specific configuration:
```env
AZURE_DB_CONNECTION_STRING=your_connection_string
API_BASE_URL=your_api_url
```

## Features in Detail

### Dashboard Analytics
- **Real-time metrics**: Live updates of system performance
- **Visual charts**: Interactive bar charts showing model usage
- **Error monitoring**: Immediate visibility into processing failures
- **Performance tracking**: Historical data trends and comparisons

### Photo Management
- **Bulk operations**: Export multiple photos' data at once
- **Search capabilities**: Find photos by multiple criteria
- **Metadata enrichment**: Complete information about each photo and its processing
- **Error diagnostics**: Detailed error information for failed processing

### Worker Tracking
- **Individual accountability**: Track which worker performed which actions
- **Performance metrics**: Monitor worker productivity and accuracy
- **Session management**: Seamless login/logout functionality
- **Activity logging**: Complete audit trail of worker actions

## Technology Stack
- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts for data visualization
- **State Management**: React hooks for local state
- **Data Storage**: LocalStorage for authentication, Azure DB for photo data
- **TypeScript**: Full type safety throughout the application

## Future Enhancements
- Real-time notifications for errors
- Advanced analytics and reporting
- Worker performance comparisons
- Automated data backup and archiving
- Mobile responsive optimizations
- Advanced search and filtering options
