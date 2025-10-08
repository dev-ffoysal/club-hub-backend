import mongoose from 'mongoose';
import config from '../config';
import { User } from '../app/modules/user/user.model';
import { University } from '../app/modules/university/university.model';
import { Category } from '../app/modules/category/category.model';
import { Tag } from '../app/modules/tag/tag.model';
import { Event } from '../app/modules/event/event.model';
import { EventRegistration } from '../app/modules/eventRegistration/eventRegistration.model';
import { Advertisement } from '../app/modules/advertisement/advertisement.model';
import { Application } from '../app/modules/application/application.model';
import { Chat } from '../app/modules/chat/chat.model';
import { Message } from '../app/modules/message/message.model';
import { Committe } from '../app/modules/committe/committe.model';
import { Engagement } from '../app/modules/engagement/engagement.model';
import { Follow } from '../app/modules/follow/follow.model';
import { Notification } from '../app/modules/notifications/notifications.model';
import { Public, Faq } from '../app/modules/public/public.model';
import { Review } from '../app/modules/review/review.model';
import { Token } from '../app/modules/token/token.model';
import { USER_ROLES, USER_STATUS, APPLICATION_STATUS } from '../enum/user';
import { EVENT_TYPE } from '../enum/event';
import { ADVERTISEMENT_TYPE, ADVERTISEMENT_STATUS } from '../app/modules/advertisement/advertisement.interface';
import { REGISTRATION_STATUS, PAYMENT_STATUS, PAYMENT_METHOD, USER_TYPE } from '../app/modules/eventRegistration/eventRegistration.interface';
import bcrypt from 'bcrypt';

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Clear all collections
// const clearDatabase = async () => {
//   console.log('🧹 Clearing existing data...');
  
//   const collections = [
//     User, University, Category, Tag, Event, EventRegistration,
//     Advertisement, Application, Chat, Message, Committe,
//     Engagement, Follow, Notification, Public, Faq, Review, Token
//   ];

//   for (const collection of collections) {
//     await collection.deleteMany({});
//   }
  
//   console.log('✅ Database cleared successfully');
// };

// Seed Universities
const seedUniversities = async () => {
  console.log('🏫 Seeding universities...');
  
  const universities = [
    {
      name: 'University of Dhaka',
      logo: 'https://example.com/du-logo.png',
      description: 'The oldest university in Bangladesh, established in 1921.'
    },
    {
      name: 'Bangladesh University of Engineering and Technology',
      logo: 'https://example.com/buet-logo.png',
      description: 'Premier engineering university in Bangladesh.'
    },
    {
      name: 'Dhaka University of Engineering & Technology',
      logo: 'https://example.com/duet-logo.png',
      description: 'Leading technical university in Gazipur.'
    },
    {
      name: 'North South University',
      logo: 'https://example.com/nsu-logo.png',
      description: 'Private university known for quality education.'
    },
    {
      name: 'BRAC University',
      logo: 'https://example.com/bracu-logo.png',
      description: 'Leading private university in Bangladesh.'
    }
  ];

  const createdUniversities = await University.insertMany(universities);
  console.log(`✅ Created ${createdUniversities.length} universities`);
  return createdUniversities;
};

// Seed Categories
const seedCategories = async () => {
  console.log('📂 Seeding categories...');
  
  const categories = [
    {
      title: 'Technology',
      slug: 'technology',
      image: 'https://example.com/tech-category.jpg'
    },
    {
      title: 'Sports',
      slug: 'sports',
      image: 'https://example.com/sports-category.jpg'
    },
    {
      title: 'Cultural',
      slug: 'cultural',
      image: 'https://example.com/cultural-category.jpg'
    },
    {
      title: 'Academic',
      slug: 'academic',
      image: 'https://example.com/academic-category.jpg'
    },
    {
      title: 'Social Service',
      slug: 'social-service',
      image: 'https://example.com/social-category.jpg'
    }
  ];

  const createdCategories = await Category.insertMany(categories);
  console.log(`✅ Created ${createdCategories.length} categories`);
  return createdCategories;
};

// Seed Tags
const seedTags = async () => {
  console.log('🏷️ Seeding tags...');
  
  const tags = [
    { title: 'Programming' },
    { title: 'Web Development' },
    { title: 'Mobile App' },
    { title: 'AI/ML' },
    { title: 'Football' },
    { title: 'Cricket' },
    { title: 'Basketball' },
    { title: 'Music' },
    { title: 'Dance' },
    { title: 'Drama' },
    { title: 'Research' },
    { title: 'Innovation' },
    { title: 'Startup' },
    { title: 'Networking' },
    { title: 'Leadership' }
  ];

  const createdTags = await Tag.insertMany(tags);
  console.log(`✅ Created ${createdTags.length} tags`);
  return createdTags;
};

// Seed Users
const seedUsers = async (universities: any[]) => {
  console.log('👥 Seeding users...');
  
  const hashedPassword = await bcrypt.hash('password123', Number(config.bcrypt_salt_rounds));
  
  const users = [
    // Super Admin
    {
      name: 'Super',
      lastName: 'Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: USER_ROLES.SUPER_ADMIN,
      status: USER_STATUS.ACTIVE,
      verified: true,
      phone: '+8801700000001',
      department: 'Administration'
    },
    // Regular Admin
    {
      name: 'John',
      lastName: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: USER_ROLES.ADMIN,
      status: USER_STATUS.ACTIVE,
      verified: true,
      phone: '+8801700000002',
      department: 'Computer Science'
    },
    // Club Users
    {
      name: 'Tech',
      lastName: 'Club',
      email: 'techclub@example.com',
      password: hashedPassword,
      role: USER_ROLES.CLUB,
      status: USER_STATUS.ACTIVE,
      verified: true,
      clubName: 'Tech Innovation Club',
      clubTitle: 'Leading Technology Club',
      clubPurpose: 'Promote technology and innovation among students',
      clubGoal: 'Create tech-savvy graduates',
      university: universities[0].name,
      clubPhone: '+8801700000003',
      clubJoiningFees: '500',
      clubFoundedAt: new Date('2020-01-15'),
      clubDescription: 'A club dedicated to technology and innovation',
      clubWorkingAreas: ['Web Development', 'Mobile Apps', 'AI/ML'],
      followersCount: 150,
      rating: 4.5,
      ratingCount: 30
    },
    {
      name: 'Sports',
      lastName: 'Club',
      email: 'sportsclub@example.com',
      password: hashedPassword,
      role: USER_ROLES.CLUB,
      status: USER_STATUS.ACTIVE,
      verified: true,
      clubName: 'University Sports Club',
      clubTitle: 'Premier Sports Club',
      clubPurpose: 'Promote sports and physical fitness',
      clubGoal: 'Develop athletic talents',
      university: universities[1].name,
      clubPhone: '+8801700000004',
      clubJoiningFees: '300',
      clubFoundedAt: new Date('2019-03-20'),
      clubDescription: 'A club for all sports enthusiasts',
      clubWorkingAreas: ['Football', 'Cricket', 'Basketball'],
      followersCount: 200,
      rating: 4.2,
      ratingCount: 45
    },
    // Regular Members
    {
      name: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      password: hashedPassword,
      role: USER_ROLES.MEMBER,
      status: USER_STATUS.ACTIVE,
      verified: true,
      studentId: 'CSE-2021-001',
      department: 'Computer Science',
      year: '3rd',
      semester: '6th',
      phone: '+8801700000005',
      bloodGroup: 'A+',
      address: 'Dhaka, Bangladesh'
    },
    {
      name: 'Bob',
      lastName: 'Smith',
      email: 'bob@example.com',
      password: hashedPassword,
      role: USER_ROLES.MEMBER,
      status: USER_STATUS.ACTIVE,
      verified: true,
      studentId: 'EEE-2020-015',
      department: 'Electrical Engineering',
      year: '4th',
      semester: '8th',
      phone: '+8801700000006',
      bloodGroup: 'B+',
      address: 'Chittagong, Bangladesh'
    },
    {
      name: 'Carol',
      lastName: 'Davis',
      email: 'carol@example.com',
      password: hashedPassword,
      role: USER_ROLES.MEMBER,
      status: USER_STATUS.ACTIVE,
      verified: true,
      studentId: 'BBA-2021-025',
      department: 'Business Administration',
      year: '2nd',
      semester: '4th',
      phone: '+8801700000007',
      bloodGroup: 'O+',
      address: 'Sylhet, Bangladesh'
    },
    {
      name: 'David',
      lastName: 'Wilson',
      email: 'david@example.com',
      password: hashedPassword,
      role: USER_ROLES.MEMBER,
      status: USER_STATUS.ACTIVE,
      verified: true,
      studentId: 'ME-2019-008',
      department: 'Mechanical Engineering',
      year: '4th',
      semester: '7th',
      phone: '+8801700000008',
      bloodGroup: 'AB+',
      address: 'Rajshahi, Bangladesh'
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
};

// Seed Events
const seedEvents = async (users: any[]) => {
  console.log('📅 Seeding events...');
  
  const clubUsers = users.filter(user => user.role === USER_ROLES.CLUB);
  
  const events = [
    {
      createdBy: clubUsers[0]._id,
      collaboratedWith: [users[4]._id, users[5]._id],
      title: 'Tech Innovation Summit 2024',
      slogan: 'Innovate, Create, Inspire',
      description: 'A comprehensive summit focusing on latest technology trends, innovation, and startup ecosystem.',
      startDate: new Date('2024-03-15T09:00:00Z'),
      endDate: new Date('2024-03-15T17:00:00Z'),
      time: '9:00 AM - 5:00 PM',
      images: ['https://example.com/tech-summit-1.jpg', 'https://example.com/tech-summit-2.jpg'],
      location: 'University Auditorium',
      isOnline: false,
      isFixedSeat: true,
      registrationFee: 500,
      maxParticipants: 200,
      currentParticipants: 45,
      registrationDeadline: new Date('2024-03-10T23:59:59Z'),
      isPublic: true,
      commentsEnabled: true,
      followersCount: 75,
      type: EVENT_TYPE.CONFERENCE,
      rules: [{
        title: 'Registration Required',
        description: 'All participants must register before the deadline',
        criteria: ['Valid student ID', 'Payment confirmation']
      }],
      eligibility: [{
        title: 'Student Eligibility',
        description: 'Open to all university students',
        criteria: ['Current student status', 'Valid university ID']
      }],
      instructions: [{
        title: 'Event Day Instructions',
        description: 'Guidelines for the event day',
        criteria: ['Arrive 30 minutes early', 'Bring student ID', 'Follow dress code']
      }],
      sponsors: [{
        title: 'TechCorp Bangladesh',
        image: 'https://example.com/techcorp-logo.png',
        website: 'https://techcorp.com.bd',
        sponsorType: 'Gold Sponsor'
      }],
      faqs: [{
        question: 'What should I bring to the event?',
        answer: 'Please bring your student ID and registration confirmation.'
      }]
    },
    {
      createdBy: clubUsers[1]._id,
      title: 'Inter-University Football Championship',
      slogan: 'Play Hard, Win Fair',
      description: 'Annual football championship bringing together teams from different universities.',
      startDate: new Date('2024-04-20T08:00:00Z'),
      endDate: new Date('2024-04-22T18:00:00Z'),
      time: '8:00 AM - 6:00 PM',
      images: ['https://example.com/football-1.jpg'],
      location: 'University Sports Complex',
      isOnline: false,
      isFixedSeat: false,
      registrationFee: 200,
      maxParticipants: 500,
      currentParticipants: 120,
      registrationDeadline: new Date('2024-04-15T23:59:59Z'),
      isPublic: true,
      commentsEnabled: true,
      followersCount: 200,
      type: EVENT_TYPE.COMPETITION,
      rules: [{
        title: 'Team Registration',
        description: 'Teams must register with complete squad',
        criteria: ['11 players + 5 substitutes', 'Valid university affiliation']
      }],
      eligibility: [{
        title: 'Player Eligibility',
        description: 'Only current university students can participate',
        criteria: ['Current student status', 'Age limit: 18-25 years']
      }],
      faqs: [{
        question: 'What is the registration fee?',
        answer: 'Registration fee is 200 BDT per team.'
      }]
    },
    {
      createdBy: users[1]._id, // Admin created event
      title: 'Web Development Workshop',
      slogan: 'Build the Future Web',
      description: 'Hands-on workshop covering modern web development technologies including React, Node.js, and MongoDB.',
      startDate: new Date('2024-05-10T14:00:00Z'),
      endDate: new Date('2024-05-10T18:00:00Z'),
      time: '2:00 PM - 6:00 PM',
      images: ['https://example.com/webdev-workshop.jpg'],
      location: 'Computer Lab 1',
      isOnline: true,
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      isFixedSeat: true,
      registrationFee: 0,
      maxParticipants: 50,
      currentParticipants: 25,
      registrationDeadline: new Date('2024-05-08T23:59:59Z'),
      isPublic: true,
      commentsEnabled: true,
      followersCount: 40,
      type: EVENT_TYPE.WORKSHOP,
      faqs: [{
        question: 'Do I need prior programming experience?',
        answer: 'Basic HTML/CSS knowledge is recommended but not mandatory.'
      }]
    }
  ];

  const createdEvents = await Event.insertMany(events);
  console.log(`✅ Created ${createdEvents.length} events`);
  return createdEvents;
};

// Seed Event Registrations
const seedEventRegistrations = async (events: any[], users: any[]) => {
  console.log('📝 Seeding event registrations...');
  
  const memberUsers = users.filter(user => user.role === USER_ROLES.MEMBER);
  
  const registrations = [
    // Registered user registrations
    {
      event: events[0]._id,
      user: memberUsers[0]._id,
      userType: USER_TYPE.REGISTERED,
      registrationCode: 'REG-001-2024',
      registrationStatus: REGISTRATION_STATUS.CONFIRMED,
      paymentInfo: {
        method: PAYMENT_METHOD.AMARPAY,
        transactionId: 'TXN-001-2024',
        amount: 500,
        currency: 'BDT',
        processedAt: new Date()
      },
      paymentStatus: PAYMENT_STATUS.COMPLETED,
      registeredAt: new Date(),
      confirmedAt: new Date()
    },
    {
      event: events[0]._id,
      user: memberUsers[1]._id,
      userType: USER_TYPE.REGISTERED,
      registrationCode: 'REG-002-2024',
      registrationStatus: REGISTRATION_STATUS.CONFIRMED,
      paymentInfo: {
        method: PAYMENT_METHOD.AMARPAY,
        transactionId: 'TXN-002-2024',
        amount: 500,
        currency: 'BDT',
        processedAt: new Date()
      },
      paymentStatus: PAYMENT_STATUS.COMPLETED,
      registeredAt: new Date(),
      confirmedAt: new Date()
    },
    // Public user registration
    {
      event: events[1]._id,
      publicUserInfo: {
        name: 'John Public',
        email: 'johnpublic@example.com',
        phone: '+8801700000099',
        studentId: 'PUB-2024-001'
      },
      userType: USER_TYPE.PUBLIC,
      registrationCode: 'REG-003-2024',
      registrationStatus: REGISTRATION_STATUS.CONFIRMED,
      paymentInfo: {
        method: PAYMENT_METHOD.AMARPAY,
        transactionId: 'TXN-003-2024',
        amount: 200,
        currency: 'BDT',
        processedAt: new Date()
      },
      paymentStatus: PAYMENT_STATUS.COMPLETED,
      registeredAt: new Date(),
      confirmedAt: new Date()
    },
    // Free event registration
    {
      event: events[2]._id,
      user: memberUsers[2]._id,
      userType: USER_TYPE.REGISTERED,
      registrationCode: 'REG-004-2024',
      registrationStatus: REGISTRATION_STATUS.CONFIRMED,
      paymentStatus: PAYMENT_STATUS.PENDING,
      registeredAt: new Date(),
      confirmedAt: new Date()
    }
  ];

  const createdRegistrations = await EventRegistration.insertMany(registrations);
  console.log(`✅ Created ${createdRegistrations.length} event registrations`);
  return createdRegistrations;
};

// Seed Applications
const seedApplications = async (universities: any[]) => {
  console.log('📋 Seeding applications...');
  
  const applications = [
    {
      clubName: 'Photography Club',
      university: universities[0]._id,
      clubPurpose: 'Promote photography and visual arts among students',
      description: 'A club dedicated to photography enthusiasts who want to learn and share their passion for capturing moments.',
      clubPhone: '+8801700000010',
      clubEmail: 'photoclub@example.com',
      status: APPLICATION_STATUS.PENDING,
      applicantName: 'Sarah Photography',
      applicantEmail: 'sarah@example.com'
    },
    {
      clubName: 'Debate Society',
      university: universities[1]._id,
      clubPurpose: 'Enhance public speaking and critical thinking skills',
      description: 'A society focused on developing debate skills, public speaking, and critical analysis among students.',
      clubPhone: '+8801700000011',
      clubEmail: 'debate@example.com',
      status: APPLICATION_STATUS.APPROVED,
      applicantName: 'Michael Debate',
      applicantEmail: 'michael@example.com'
    },
    {
      clubName: 'Environmental Club',
      university: universities[2]._id,
      clubPurpose: 'Promote environmental awareness and sustainability',
      description: 'A club working towards environmental conservation and sustainability initiatives.',
      clubPhone: '+8801700000012',
      clubEmail: 'envclub@example.com',
      status: APPLICATION_STATUS.REJECTED,
      applicantName: 'Green Initiative',
      applicantEmail: 'green@example.com'
    }
  ];

  const createdApplications = await Application.insertMany(applications);
  console.log(`✅ Created ${createdApplications.length} applications`);
  return createdApplications;
};

// Seed Advertisements
const seedAdvertisements = async (users: any[], events: any[], universities: any[]) => {
  console.log('📢 Seeding advertisements...');
  
  const clubUsers = users.filter(user => user.role === USER_ROLES.CLUB);
  const adminUser = users.find(user => user.role === USER_ROLES.SUPER_ADMIN);
  
  const advertisements = [
    {
      title: 'Join Tech Innovation Summit 2024',
      description: 'Don\'t miss the biggest tech event of the year! Register now for exclusive workshops and networking opportunities.',
      type: ADVERTISEMENT_TYPE.CLUB_EVENT,
      status: ADVERTISEMENT_STATUS.ACTIVE,
      startDate: new Date('2024-02-01T00:00:00Z'),
      endDate: new Date('2024-03-14T23:59:59Z'),
      image: 'https://example.com/tech-summit-ad.jpg',
      banner: 'https://example.com/tech-summit-banner.jpg',
      externalLink: 'https://techsummit2024.com',
      callToAction: 'Register Now',
      club: clubUsers[0]._id,
      event: events[0]._id,
      targetAudience: ['students', 'tech enthusiasts'],
      universities: [universities[0]._id, universities[1]._id],
      departments: ['Computer Science', 'Software Engineering'],
      impressions: 1500,
      clicks: 75,
      budget: 5000,
      costPerClick: 2.5,
      priority: 10,
      position: 'banner',
      createdBy: adminUser._id,
      approvedBy: adminUser._id,
      approvedAt: new Date(),
      tags: ['technology', 'innovation', 'summit']
    },
    {
      title: 'Football Championship 2024',
      description: 'Inter-university football championship is here! Form your teams and compete for the ultimate trophy.',
      type: ADVERTISEMENT_TYPE.CLUB_EVENT,
      status: ADVERTISEMENT_STATUS.ACTIVE,
      startDate: new Date('2024-03-01T00:00:00Z'),
      endDate: new Date('2024-04-19T23:59:59Z'),
      image: 'https://example.com/football-ad.jpg',
      callToAction: 'Register Team',
      club: clubUsers[1]._id,
      event: events[1]._id,
      targetAudience: ['students', 'sports enthusiasts'],
      universities: universities.map(u => u._id),
      impressions: 2000,
      clicks: 120,
      priority: 8,
      position: 'feed',
      createdBy: adminUser._id,
      approvedBy: adminUser._id,
      approvedAt: new Date(),
      tags: ['sports', 'football', 'competition']
    },
    {
      title: 'Learn Web Development - Free Workshop',
      description: 'Master modern web development technologies in this comprehensive hands-on workshop.',
      type: ADVERTISEMENT_TYPE.EXTERNAL,
      status: ADVERTISEMENT_STATUS.ACTIVE,
      startDate: new Date('2024-04-01T00:00:00Z'),
      endDate: new Date('2024-05-09T23:59:59Z'),
      image: 'https://example.com/webdev-ad.jpg',
      externalLink: 'https://webdevworkshop.com',
      callToAction: 'Join Workshop',
      advertiserName: 'CodeAcademy BD',
      advertiserEmail: 'info@codeacademy.bd',
      advertiserPhone: '+8801700000020',
      advertiserWebsite: 'https://codeacademy.bd',
      targetAudience: ['students', 'developers'],
      departments: ['Computer Science', 'Information Technology'],
      impressions: 800,
      clicks: 45,
      budget: 3000,
      costPerClick: 1.5,
      priority: 6,
      position: 'sidebar',
      createdBy: adminUser._id,
      approvedBy: adminUser._id,
      approvedAt: new Date(),
      tags: ['programming', 'web development', 'workshop']
    }
  ];

  const createdAdvertisements = await Advertisement.insertMany(advertisements);
  console.log(`✅ Created ${createdAdvertisements.length} advertisements`);
  return createdAdvertisements;
};

// Seed Public Content
const seedPublicContent = async () => {
  console.log('📄 Seeding public content...');
  
  const publicContent = [
    {
      content: 'This privacy policy explains how we collect, use, and protect your personal information when you use our club management platform.',
      type: 'privacy-policy'
    },
    {
      content: 'By using our platform, you agree to these terms and conditions. Please read them carefully before proceeding.',
      type: 'terms-and-condition'
    },
    {
      content: 'Contact us at support@clubmanagement.com or call +880-1700-000-000 for any assistance.',
      type: 'contact'
    },
    {
      content: 'We are a comprehensive club management platform designed to help universities and students organize and participate in various club activities.',
      type: 'about'
    }
  ];

  const faqs = [
    {
      question: 'How do I register for an event?',
      answer: 'You can register for events by clicking the "Register" button on the event page and following the payment process if required.'
    },
    {
      question: 'Can I cancel my event registration?',
      answer: 'Yes, you can cancel your registration up to 24 hours before the event start time. Refunds will be processed according to our refund policy.'
    },
    {
      question: 'How do I create a club?',
      answer: 'To create a club, submit an application through the "Apply for Club" section. Your application will be reviewed by administrators.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept payments through AmarPay, which supports various payment methods including mobile banking, cards, and net banking.'
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.'
    }
  ];

  const createdPublicContent = await Public.insertMany(publicContent);
  const createdFaqs = await Faq.insertMany(faqs);
  
  console.log(`✅ Created ${createdPublicContent.length} public content items`);
  console.log(`✅ Created ${createdFaqs.length} FAQs`);
  
  return { publicContent: createdPublicContent, faqs: createdFaqs };
};

// Seed additional data (follows, engagements, reviews, etc.)
const seedAdditionalData = async (users: any[], events: any[]) => {
  console.log('🔗 Seeding additional data...');
  
  const memberUsers = users.filter(user => user.role === USER_ROLES.MEMBER);
  const clubUsers = users.filter(user => user.role === USER_ROLES.CLUB);
  
  // Follows
  const follows = [
    {
      user: memberUsers[0]._id,
      event: events[0]._id
    },
    {
      user: memberUsers[1]._id,
      event: events[0]._id
    },
    {
      user: memberUsers[2]._id,
      event: events[1]._id
    }
  ];

  // Engagements (likes/votes)
  const engagements = [
    {
      user: memberUsers[0]._id,
      event: events[0]._id,
      voteType: 'upvote'
    },
    {
      user: memberUsers[1]._id,
      event: events[0]._id,
      voteType: 'upvote'
    },
    {
      user: memberUsers[2]._id,
      event: events[1]._id,
      voteType: 'downvote'
    }
  ];

  // Reviews
  const reviews = [
    {
      reviewer: memberUsers[0]._id,
      reviewee: clubUsers[0]._id,
      rating: 5,
      review: 'Excellent club with great events and management. Highly recommended!'
    },
    {
      reviewer: memberUsers[1]._id,
      reviewee: clubUsers[0]._id,
      rating: 4,
      review: 'Good club activities and well-organized events.'
    },
    {
      reviewer: memberUsers[2]._id,
      reviewee: clubUsers[1]._id,
      rating: 4,
      review: 'Great sports club with excellent facilities.'
    }
  ];

  // Notifications
  const notifications = [
    {
      to: memberUsers[0]._id,
      from: clubUsers[0]._id,
      title: 'Event Registration Confirmed',
      body: 'Your registration for Tech Innovation Summit 2024 has been confirmed.',
      isRead: false
    },
    {
      to: memberUsers[1]._id,
      from: clubUsers[0]._id,
      title: 'New Event Announcement',
      body: 'Check out our latest event: Web Development Workshop.',
      isRead: true
    }
  ];

  // Committee members
  const committees = [
    {
      club: clubUsers[0]._id,
      year: '2024',
      members: [
        {
          member: memberUsers[0]._id,
          position: 'President',
          note: 'Leading the tech initiatives'
        },
        {
          member: memberUsers[1]._id,
          position: 'Vice President',
          note: 'Supporting club activities'
        }
      ]
    },
    {
      club: clubUsers[1]._id,
      year: '2024',
      members: [
        {
          member: memberUsers[2]._id,
          position: 'Captain',
          note: 'Leading the sports team'
        }
      ]
    }
  ];

  // Chats
  const chats = [
    {
      participants: [memberUsers[0]._id, memberUsers[1]._id],
      isGroupChat: false
    },
    {
      participants: [clubUsers[0]._id, memberUsers[0]._id, memberUsers[1]._id],
      club: clubUsers[0]._id,
      isGroupChat: true
    }
  ];

  const createdFollows = await Follow.insertMany(follows);
  const createdEngagements = await Engagement.insertMany(engagements);
  const createdReviews = await Review.insertMany(reviews);
  // const createdNotifications = await Notification.insertMany(notifications);
  // const createdCommittees = await Committe.insertMany(committees);
  // const createdChats = await Chat.insertMany(chats);

  // Messages
  // const messages = [
  //   {
  //     chat: createdChats[0]._id,
  //     sender: memberUsers[0]._id,
  //     message: 'Hey! How are you doing?'
  //   },
  //   {
  //     chat: createdChats[0]._id,
  //     sender: memberUsers[1]._id,
  //     message: 'I\'m good! Thanks for asking. Are you joining the tech summit?'
  //   },
  //   {
  //     chat: createdChats[1]._id,
  //     sender: clubUsers[0]._id,
  //     message: 'Welcome to our club group chat! Feel free to ask any questions.'
  //   }
  // ];

  // const createdMessages = await Message.insertMany(messages);

  console.log(`✅ Created ${createdFollows.length} follows`);
  console.log(`✅ Created ${createdEngagements.length} engagements`);
  console.log(`✅ Created ${createdReviews.length} reviews`);
  // console.log(`✅ Created ${createdNotifications.length} notifications`);
  // console.log(`✅ Created ${createdCommittees.length} committees`);
  // console.log(`✅ Created ${createdChats.length} chats`);
  // console.log(`✅ Created ${createdMessages.length} messages`);
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    // await clearDatabase();
    
    // Seed in order due to dependencies
    const universities = await seedUniversities();
    const categories = await seedCategories();
    const tags = await seedTags();
    const users = await seedUsers(universities);
    const events = await seedEvents(users);
    const eventRegistrations = await seedEventRegistrations(events, users);
    const applications = await seedApplications(universities);
    const advertisements = await seedAdvertisements(users, events, universities);
    const publicContent = await seedPublicContent();
    await seedAdditionalData(users, events);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${universities.length} Universities`);
    console.log(`   • ${categories.length} Categories`);
    console.log(`   • ${tags.length} Tags`);
    console.log(`   • ${users.length} Users (including clubs)`);
    console.log(`   • ${events.length} Events`);
    console.log(`   • ${eventRegistrations.length} Event Registrations`);
    console.log(`   • ${applications.length} Applications`);
    console.log(`   • ${advertisements.length} Advertisements`);
    console.log(`   • ${publicContent.publicContent.length} Public Content Items`);
    console.log(`   • ${publicContent.faqs.length} FAQs`);
    console.log('   • Additional data: follows, engagements, reviews, notifications, committees, chats, messages');
    
    console.log('\n🔐 Default Login Credentials:');
    console.log('   Super Admin: superadmin@example.com / password123');
    console.log('   Admin: admin@example.com / password123');
    console.log('   Tech Club: techclub@example.com / password123');
    console.log('   Sports Club: sportsclub@example.com / password123');
    console.log('   Member: alice@example.com / password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;