# Advertisement Module

The Advertisement Module provides comprehensive functionality for managing advertisements in the club management system. Super admins can create, manage, and track various types of advertisements including club events and external promotions.

## Features

### Advertisement Types
- **Club Events**: Promote events organized by clubs
- **External**: General external advertisements
- **Government**: Government agency promotions
- **Company**: Corporate advertisements
- **Contest**: Contest and competition promotions
- **Initiative**: Special initiatives and programs

### Advertisement Management
- Create, update, and delete advertisements
- Set campaign start and end dates
- Manage advertisement status (draft, active, paused, expired, deleted)
- Priority-based positioning
- Target audience specification
- University and department targeting

### Performance Tracking
- Impression tracking
- Click tracking
- Click-through rate (CTR) calculation
- Budget management
- Cost-per-click tracking
- Comprehensive analytics

### Media Support
- Image uploads
- Banner images
- Video content
- External links
- Call-to-action buttons

## API Endpoints

### Admin Endpoints (Super Admin Only)

#### Get All Advertisements
```
GET /api/advertisement/admin
```
Query Parameters:
- `page`: Page number
- `limit`: Items per page
- `searchTerm`: Search in title, description, etc.
- `type`: Filter by advertisement type
- `status`: Filter by status
- `club`: Filter by club ID
- `startDate`: Filter by start date
- `endDate`: Filter by end date

#### Get Single Advertisement
```
GET /api/advertisement/admin/:id
```

#### Create Advertisement
```
POST /api/advertisement/admin
```
Body:
```json
{
  "title": "Summer Tech Conference 2024",
  "description": "Join us for the biggest tech conference of the year",
  "type": "club_event",
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-06-30T23:59:59Z",
  "club": "club_id_here",
  "image": "https://example.com/image.jpg",
  "externalLink": "https://conference.example.com",
  "callToAction": "Register Now",
  "priority": 10,
  "position": "banner",
  "targetAudience": ["students", "faculty"],
  "universities": ["university_id_here"],
  "departments": ["Computer Science", "Engineering"],
  "budget": 1000,
  "costPerClick": 0.50
}
```

#### Update Advertisement
```
PATCH /api/advertisement/admin/:id
```

#### Delete Advertisement
```
DELETE /api/advertisement/admin/:id
```

#### Get Advertisement Statistics
```
GET /api/advertisement/admin/:id/stats
```
Response:
```json
{
  "id": "ad_id",
  "title": "Summer Tech Conference 2024",
  "impressions": 1500,
  "clicks": 75,
  "ctr": 5.0,
  "totalCost": 37.50,
  "budget": 1000,
  "remainingBudget": 962.50,
  "status": "active",
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-06-30T23:59:59Z"
}
```

### Public Endpoints

#### Get Active Advertisements
```
GET /api/advertisement/active?limit=10
```

#### Get Advertisements by Position
```
GET /api/advertisement/position/:position?limit=5
```
Positions: `banner`, `sidebar`, `feed`, `popup`

#### Get Club Advertisements
```
GET /api/advertisement/club/:clubId?limit=10
```

#### Track Impression
```
POST /api/advertisement/:id/impression
```

#### Track Click
```
POST /api/advertisement/:id/click
```

## Database Schema

### Advertisement Model
```typescript
interface IAdvertisement {
  _id: ObjectId;
  title: string;
  description: string;
  type: ADVERTISEMENT_TYPE;
  status: ADVERTISEMENT_STATUS;
  
  // Campaign dates
  startDate: Date;
  endDate: Date;
  
  // Media assets
  image?: string;
  banner?: string;
  video?: string;
  
  // Links and actions
  externalLink?: string;
  callToAction?: string;
  
  // Club-related fields
  club?: ObjectId;
  event?: ObjectId;
  
  // External advertiser info
  advertiserName?: string;
  advertiserEmail?: string;
  advertiserPhone?: string;
  advertiserWebsite?: string;
  
  // Targeting
  targetAudience?: string[];
  universities?: ObjectId[];
  departments?: string[];
  
  // Performance tracking
  impressions: number;
  clicks: number;
  budget?: number;
  costPerClick?: number;
  
  // Priority and positioning
  priority: number;
  position?: string;
  
  // Management
  createdBy: ObjectId;
  approvedBy?: ObjectId;
  approvedAt?: Date;
  
  // Metadata
  tags?: string[];
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Enums

#### Advertisement Types
```typescript
enum ADVERTISEMENT_TYPE {
  CLUB_EVENT = 'club_event',
  EXTERNAL = 'external',
  GOVERNMENT = 'government',
  COMPANY = 'company',
  CONTEST = 'contest',
  INITIATIVE = 'initiative'
}
```

#### Advertisement Status
```typescript
enum ADVERTISEMENT_STATUS {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  DELETED = 'deleted'
}
```

## Usage Examples

### Creating a Club Event Advertisement
```javascript
const clubEventAd = {
  title: "Annual Tech Fest 2024",
  description: "Join us for workshops, competitions, and networking",
  type: "club_event",
  startDate: "2024-03-01T00:00:00Z",
  endDate: "2024-03-15T23:59:59Z",
  club: "65f1234567890abcdef12345",
  image: "https://example.com/techfest-banner.jpg",
  callToAction: "Register Now",
  priority: 15,
  position: "banner",
  targetAudience: ["students"],
  departments: ["Computer Science", "Information Technology"]
};
```

### Creating an External Advertisement
```javascript
const externalAd = {
  title: "Government Scholarship Program",
  description: "Apply for merit-based scholarships for undergraduate students",
  type: "government",
  startDate: "2024-01-01T00:00:00Z",
  endDate: "2024-12-31T23:59:59Z",
  advertiserName: "Ministry of Education",
  advertiserEmail: "scholarships@education.gov",
  externalLink: "https://scholarships.gov/apply",
  callToAction: "Apply Now",
  priority: 20,
  position: "sidebar",
  targetAudience: ["students"],
  budget: 5000,
  costPerClick: 1.00
};
```

## Integration with Other Modules

### User Module Integration
- Links to club users for club event advertisements
- Creator and approver tracking
- Role-based access control

### Event Module Integration
- Can link advertisements to specific events
- Automatic promotion of club events

### University Module Integration
- Target specific universities
- University-based filtering

## Performance Considerations

### Database Indexes
- Status and date range index for active ad queries
- Type and status index for filtering
- Club and status index for club-specific ads
- Priority and creation date index for sorting
- University index for targeting

### Caching Recommendations
- Cache active advertisements by position
- Cache advertisement statistics
- Implement Redis caching for frequently accessed ads

### Rate Limiting
- Implement rate limiting on tracking endpoints
- Prevent spam clicks and impressions

## Security Features

### Access Control
- Only super admins can manage advertisements
- Public endpoints for displaying and tracking
- Input validation and sanitization

### Data Protection
- Sensitive advertiser information protected
- Audit trail for all changes
- Soft delete for data retention

## Monitoring and Analytics

### Key Metrics
- Total impressions and clicks
- Click-through rates (CTR)
- Cost per click and total costs
- Budget utilization
- Advertisement performance by position

### Reporting
- Daily, weekly, and monthly reports
- Performance comparison between ad types
- ROI analysis for paid advertisements

## Future Enhancements

### Planned Features
- A/B testing for advertisements
- Automated bidding for ad positions
- Geographic targeting
- Time-based targeting
- Advanced analytics dashboard
- Integration with external ad networks
- Mobile app push notification ads
- Email newsletter advertisements

### API Versioning
- Current version: v1
- Backward compatibility maintained
- Deprecation notices for old endpoints