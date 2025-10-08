# Database Seeding Guide

This guide explains how to use the database seeding functionality to populate your database with initial data for development and testing purposes.

## Overview

The seed database file (`src/database/seed.ts`) creates comprehensive initial data for all models in the project, including:

- **Users** with role-based data (Super Admin, Admin, Club, Member, Guest)
- **Universities** with sample institutions
- **Events** with complete event information
- **Advertisements** with type-specific data
- **Applications** with different statuses
- **Event Registrations** with various user types and payment statuses
- **Categories** for organizing events and clubs
- **Tags** for content categorization
- **Public Content** for essential platform pages
- **FAQs** for user support
- **Chats** and **Messages** for communication
- **Committees** for club organization
- **Follows** and **Engagements** for user interactions
- **Notifications** for user updates

## Quick Start

### Prerequisites

1. Ensure your MongoDB database is running
2. Set up your environment variables (especially `DATABASE_URL`)
3. Install all dependencies: `npm install` or `yarn install`

### Running the Seed

```bash
# Using npm
npm run seed

# Using yarn
yarn seed

# Direct execution
ts-node src/database/seed.ts
```

## Seeded Data Details

### 1. Universities (3 records)
- University of Dhaka
- Bangladesh University of Engineering and Technology (BUET)
- Dhaka University of Engineering & Technology (DUET)

### 2. Users (7 records with role-based fields)

#### Super Admin
- **Email**: `superadmin@example.com`
- **Password**: `password123`
- **Role**: `super_admin`
- **Features**: Full system access

#### Admin
- **Email**: `admin@example.com`
- **Password**: `password123`
- **Role**: `admin`
- **Features**: Administrative privileges

#### Club Users (2 records)
1. **Tech Innovation Club**
   - **Email**: `techclub@example.com`
   - **Password**: `password123`
   - **Role**: `club`
   - **Club-specific fields**: clubName, clubTitle, clubPurpose, clubGoal, clubRegistration, university, clubPhone, clubJoiningFees, clubFoundedAt, clubCover, clubDescription, clubWorkingAreas, template, colorScheme, slug, followersCount, rating, ratingCount

2. **Cultural Heritage Society**
   - **Email**: `culturalclub@example.com`
   - **Password**: `password123`
   - **Role**: `club`
   - **Club-specific fields**: Similar structure with cultural focus

#### Member Users (2 records)
1. **John Doe**
   - **Email**: `john.doe@example.com`
   - **Password**: `password123`
   - **Role**: `member`
   - **Member-specific fields**: studentId, bloodGroup, department, year, semester, phone, address, description

2. **Jane Smith**
   - **Email**: `jane.smith@example.com`
   - **Password**: `password123`
   - **Role**: `member`
   - **Member-specific fields**: Similar structure with different data

#### Guest User
- **Email**: `guest@example.com`
- **Password**: `password123`
- **Role**: `guest`
- **Features**: Limited access

### 3. Events (2 records)

#### Tech Innovation Summit 2024
- **Type**: `conference`
- **Created by**: Tech Innovation Club
- **Features**: Complete event data including host, prizes, guests, benefits, requirements, rules, eligibility, instructions, sponsors, FAQs
- **Registration**: Paid event (500 BDT)

#### Cultural Festival 2024
- **Type**: `festival`
- **Created by**: Cultural Heritage Society
- **Features**: Free cultural event with comprehensive details

### 4. Advertisements (3 records with type-specific data)

#### Club Event Advertisement
- **Type**: `club_event`
- **Purpose**: Promoting Tech Innovation Summit
- **Club-specific fields**: club, event references

#### External Company Advertisement
- **Type**: `company`
- **Purpose**: Software Developer Internship Program
- **Company-specific fields**: advertiserName, advertiserEmail, advertiserPhone, advertiserWebsite

#### Government Initiative Advertisement
- **Type**: `government`
- **Purpose**: Digital Bangladesh Skills Development Program
- **Government-specific fields**: Ministry information and program details

### 5. Applications (3 records)
- **Pending**: Robotics Innovation Club application
- **Approved**: Environmental Awareness Society application
- **Rejected**: Business Innovation Hub application

### 6. Event Registrations (4 records with different scenarios)

#### Registered User - Confirmed
- **User Type**: `registered`
- **Status**: `confirmed`
- **Payment**: `completed` via AmarPay

#### Public User - Paid
- **User Type**: `public`
- **Status**: `paid`
- **Payment**: `completed` via Card
- **Public user fields**: name, email, phone, studentId

#### Registered User - Pending
- **User Type**: `registered`
- **Status**: `pending`
- **Payment**: `pending`

#### Public User - Cancelled
- **User Type**: `public`
- **Status**: `cancelled`
- **Payment**: `refunded` via Mobile Banking

### 7. Categories (5 records)
- **Technology**: For tech-related events and clubs
- **Sports**: For athletic activities and sports clubs
- **Arts & Culture**: For creative and cultural activities
- **Academic**: For educational and research-focused events
- **Social**: For social gatherings and networking events

### 8. Tags (15 records)
- **Technology**: Programming, Web Development, Mobile Apps, AI/ML
- **Sports**: Football, Basketball, Cricket
- **Arts**: Music, Dance, Photography
- **General**: Research, Workshop, Networking, Competition, Volunteer

### 9. Public Content (4 records)
- **Privacy Policy**: Data protection and privacy information
- **Terms and Conditions**: Platform usage terms
- **Contact**: Contact information and office details
- **About**: Platform description and mission

### 10. FAQs (5 records)
- How to join clubs
- Creating new clubs
- Event registration process
- Platform pricing (free)
- Password reset instructions

### 11. Chats (3 records)
- **Individual Chat**: Direct conversation between two users
- **Group Chat**: Multi-user conversation within a club
- **Club Chat**: Communication between club members

### 12. Messages (5 records)
- Event coordination discussions
- Welcome messages
- Club-related conversations
- Casual interactions between users

### 13. Committees (2 records)
- **Tech Club Committee**: President, Vice President, Secretary
- **Sports Club Committee**: Captain, Coach Assistant

### 14. Follows (5 records)
- Users following events they're interested in
- Mix of different users and events
- Demonstrates event engagement tracking

### 15. Engagements (5 records)
- **Likes**: Positive reactions to events
- **Dislikes**: Negative reactions to events
- Mix of engagement types across different events

### 16. Notifications (5 records)
- **Event Notifications**: New events posted
- **Application Updates**: Approval/rejection notifications
- **Reminders**: Event and activity reminders
- **Committee Updates**: Position assignments
- **Welcome Messages**: New member greetings

## Environment Variables

Ensure these environment variables are set in your `.env` file:

```env
DATABASE_URL=mongodb://localhost:27017/your-database-name
BCRYPT_SALT_ROUNDS=12
```

## Important Notes

### ⚠️ Data Clearing
The seed script **clears all existing data** before inserting new data. Use with caution in production environments.

### 🔐 Security
- All users have the same password: `password123`
- Change passwords in production
- The password is properly hashed using bcrypt

### 🔗 Relationships
- All foreign key relationships are properly established
- ObjectId references are correctly linked between models

### 📊 Data Completeness
- All required fields are populated
- Optional fields are included where relevant
- Enum values are properly used
- Nested objects and arrays are fully populated

## Customization

To customize the seed data:

1. Edit `src/database/seed.ts`
2. Modify the data objects according to your needs
3. Ensure all required fields are included
4. Maintain proper relationships between models
5. Run the seed script again

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check if MongoDB is running
   - Verify `DATABASE_URL` in environment variables

2. **Validation Errors**
   - Ensure all required fields are provided
   - Check enum values match model definitions

3. **Reference Errors**
   - Verify ObjectId references exist
   - Check model relationships

### Getting Help

If you encounter issues:
1. Check the console output for detailed error messages
2. Verify your model schemas match the seed data structure
3. Ensure all dependencies are installed
4. Check MongoDB connection and permissions

## Development Workflow

1. **Initial Setup**: Run seed after setting up the project
2. **Testing**: Use seeded data for comprehensive testing
3. **Development**: Reset data anytime during development
4. **Demo**: Use for demonstrations with realistic data

```bash
# Typical workflow
npm install
npm run seed
npm start
```

This will give you a fully populated database ready for development and testing!