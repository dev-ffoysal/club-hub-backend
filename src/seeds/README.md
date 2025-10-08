# Database Seeding

This directory contains scripts to populate the database with dummy data for development and testing purposes.

## Files

- `index.ts` - Main seeding script that populates all collections

## Usage

### Running the Seed Script

```bash
# From the project root directory
npm run seed

# Or run directly with ts-node
npx ts-node src/seeds/index.ts
```

### What Gets Seeded

The seed script creates dummy data for all collections:

1. **Universities** (5 items)
   - University of Dhaka
   - BUET
   - DUET
   - North South University
   - BRAC University

2. **Categories** (5 items)
   - Technology, Sports, Cultural, Academic, Social Service

3. **Tags** (15 items)
   - Programming, Web Development, AI/ML, Sports, Music, etc.

4. **Users** (8 items)
   - 1 Super Admin
   - 1 Admin
   - 2 Club accounts (Tech Club, Sports Club)
   - 4 Member accounts

5. **Events** (3 items)
   - Tech Innovation Summit 2024
   - Inter-University Football Championship
   - Web Development Workshop

6. **Event Registrations** (4 items)
   - Mix of registered users and public registrations
   - Different payment statuses

7. **Applications** (3 items)
   - Club applications with different statuses

8. **Advertisements** (3 items)
   - Event promotions and external ads

9. **Public Content**
   - Privacy policy, terms, contact info, about
   - 5 FAQ items

10. **Additional Data**
    - Follows, Engagements, Reviews
    - Notifications, Committees
    - Chats and Messages

## Default Login Credentials

After seeding, you can use these credentials to test different user roles:

- **Super Admin**: `superadmin@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`
- **Tech Club**: `techclub@example.com` / `password123`
- **Sports Club**: `sportsclub@example.com` / `password123`
- **Member**: `alice@example.com` / `password123`

## Important Notes

1. **Environment**: Make sure your `.env` file is properly configured with database connection details
2. **Database**: The script will **clear all existing data** before seeding
3. **Dependencies**: Ensure all required packages are installed (`npm install`)
4. **TypeScript**: The script uses TypeScript, so ts-node is required

## Customization

To modify the seed data:

1. Edit the respective seed functions in `index.ts`
2. Add new collections by creating new seed functions
3. Update the main `seedDatabase()` function to include new seeders

## Troubleshooting

- **Connection Error**: Check your database URL in `.env`
- **Import Errors**: Ensure all model files exist and are properly exported
- **Type Errors**: Verify that enum values match those defined in your constants
- **Permission Errors**: Make sure the database user has write permissions

## Development Workflow

1. Set up your development database
2. Run the seed script to populate with test data
3. Develop and test your features
4. Re-run seeding when you need fresh data

```bash
# Quick reset and reseed
npm run seed
```