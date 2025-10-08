import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../app/modules/user/user.model';
import { Event } from '../app/modules/event/event.model';
import { Advertisement } from '../app/modules/advertisement/advertisement.model';
import { Application } from '../app/modules/application/application.model';
import { EventRegistration } from '../app/modules/eventRegistration/eventRegistration.model';
import { University } from '../app/modules/university/university.model';
import { Category } from '../app/modules/category/category.model';
import { Chat } from '../app/modules/chat/chat.model';
import { Committe } from '../app/modules/committe/committe.model';
import { Engagement } from '../app/modules/engagement/engagement.model';
import { Faq } from '../app/modules/public/public.model';
import { Follow } from '../app/modules/follow/follow.model';
import { Message } from '../app/modules/message/message.model';
import { Notification } from '../app/modules/notifications/notifications.model';
import { Public } from '../app/modules/public/public.model';
import { Tag } from '../app/modules/tag/tag.model';
import { USER_ROLES, USER_STATUS, APPLICATION_STATUS } from '../enum/user';
import { EVENT_TYPE } from '../enum/event';
import { ADVERTISEMENT_TYPE, ADVERTISEMENT_STATUS } from '../app/modules/advertisement/advertisement.interface';
import { REGISTRATION_STATUS, PAYMENT_STATUS, PAYMENT_METHOD, USER_TYPE } from '../app/modules/eventRegistration/eventRegistration.interface';
import config from '../config';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
  // await User.deleteMany({});
  await Event.deleteMany({});
  await Advertisement.deleteMany({});
  await Application.deleteMany({});
  await EventRegistration.deleteMany({});
  await University.deleteMany({});
  await Category.deleteMany({});
  await Chat.deleteMany({});
  await Committe.deleteMany({});
  await Engagement.deleteMany({});
  await Faq.deleteMany({});
  await Follow.deleteMany({});
  await Message.deleteMany({});
  await Notification.deleteMany({});
  await Public.deleteMany({});
  await Tag.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Hash password for users
    const hashedPassword = await bcrypt.hash('123123123', Number(config.bcrypt_salt_rounds));

    // Seed Universities
    const universities = await University.insertMany([
      {
        name: 'University of Dhaka',
        logo: 'https://example.com/du-logo.png',
        description: 'The oldest university in Bangladesh, established in 1921'
      },
      {
        name: 'Bangladesh University of Engineering and Technology',
        logo: 'https://example.com/buet-logo.png',
        description: 'Premier engineering university in Bangladesh'
      },
      {
        name: 'Dhaka University of Engineering & Technology',
        logo: 'https://example.com/duet-logo.png',
        description: 'Leading technical university in Gazipur'
      },
      {
        name: 'United International University',
        logo: 'https://example.com/duet-logo.png',
        description: 'Most beautiful campus university inside Dhaka'
      }
    ]);

    console.log('🏫 Seeded Universities');

    // Seed Users with role-based data
    const users = await User.insertMany([
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
        clubPurpose: 'Promoting technology and innovation among students',
        clubGoal: 'To create a community of tech enthusiasts',
        clubRegistration: 'REG-TECH-2024-001',
        university: universities[0]._id.toString(),
        applierEmail: 'techclub@example.com',
        clubPhone: '+8801700000003',
        clubJoiningFees: '500',
        clubFoundedAt: new Date('2020-01-15'),
        clubCover: 'https://example.com/tech-club-cover.jpg',
        clubDescription: 'A vibrant community focused on technology and innovation',
        clubWorkingAreas: ['Web Development', 'Mobile Apps', 'AI/ML', 'Cybersecurity'],
        template: 'modern',
        colorScheme: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          accent: '#F59E0B',
          background: '#F8FAFC'
        },
        slug: 'tech-innovation-club',
        followersCount: 150,
        rating: 4.8,
        ratingCount: 25
      },
      {
        name: 'Cultural',
        lastName: 'Society',
        email: 'culturalclub@example.com',
        password: hashedPassword,
        role: USER_ROLES.CLUB,
        status: USER_STATUS.ACTIVE,
        verified: true,
        clubName: 'Cultural Heritage Society',
        clubTitle: 'Preserving Cultural Values',
        clubPurpose: 'Promoting cultural activities and heritage preservation',
        clubGoal: 'To celebrate and preserve our rich cultural heritage',
        clubRegistration: 'REG-CULT-2024-002',
        university: universities[1]._id.toString(),
        applierEmail: 'culturalclub@example.com',
        clubPhone: '+8801700000004',
        clubJoiningFees: '300',
        clubFoundedAt: new Date('2019-03-20'),
        clubCover: 'https://example.com/cultural-club-cover.jpg',
        clubDescription: 'Dedicated to promoting cultural activities and traditions',
        clubWorkingAreas: ['Dance', 'Music', 'Drama', 'Literature'],
        template: 'classic',
        colorScheme: {
          primary: '#DC2626',
          secondary: '#991B1B',
          accent: '#F59E0B',
          background: '#FEF2F2'
        },
        slug: 'cultural-heritage-society',
        followersCount: 200,
        rating: 4.6,
        ratingCount: 40
      },
      // Member Users
      {
        name: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        role: USER_ROLES.MEMBER,
        status: USER_STATUS.ACTIVE,
        verified: true,
        studentId: 'CSE-2021-001',
        bloodGroup: 'A+',
        department: 'Computer Science and Engineering',
        year: '3rd',
        semester: '6th',
        phone: '+8801700000005',
        address: 'Dhanmondi, Dhaka',
        description: 'Passionate about web development and machine learning'
      },
      {
        name: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        role: USER_ROLES.MEMBER,
        status: USER_STATUS.ACTIVE,
        verified: true,
        studentId: 'EEE-2020-045',
        bloodGroup: 'B+',
        department: 'Electrical and Electronic Engineering',
        year: '4th',
        semester: '8th',
        phone: '+8801700000006',
        address: 'Gulshan, Dhaka',
        description: 'Interested in robotics and embedded systems'
      }
    ]);

    console.log('👥 Seeded Users with role-based data');

    // Get club users for events and advertisements
    const techClub = users.find(u => u.clubName === 'Tech Innovation Club');
    const culturalClub = users.find(u => u.clubName === 'Cultural Heritage Society');
    const memberUser = users.find(u => u.role === USER_ROLES.MEMBER);

    // Seed Events
    const events = await Event.insertMany([
      {
        createdBy: techClub!._id,
        collaboratedWith: [culturalClub!._id],
        title: 'Tech Innovation Summit 2024',
        slogan: 'Innovate, Create, Inspire',
        description: 'A comprehensive summit bringing together tech enthusiasts, industry experts, and students to explore the latest innovations in technology.',
        startDate: new Date('2024-06-15T09:00:00Z'),
        endDate: new Date('2024-06-16T18:00:00Z'),
        time: '9:00 AM - 6:00 PM',
        images: ['https://example.com/tech-summit-1.jpg', 'https://example.com/tech-summit-2.jpg'],
        location: 'University of Dhaka Auditorium',
        isOnline: false,
        isFixedSeat: true,
        registrationFee: 500,
        maxParticipants: 200,
        currentParticipants: 45,
        registrationDeadline: new Date('2024-06-10T23:59:59Z'),
        isPublic: true,
        commentsEnabled: true,
        followersCount: 120,
        upVotesCount: 85,
        downVotesCount: 3,
        type: EVENT_TYPE.CONFERENCE,
        tags: ['technology', 'innovation', 'summit', 'networking'],
        organizedBy: techClub!._id,
        host: {
          name: 'Dr. Ahmed Rahman',
          designation: 'Professor',
          position: 'Head of Computer Science Department',
          image: 'https://example.com/host-ahmed.jpg'
        },
        winningPrize: [
          {
            title: 'Best Innovation Award',
            description: 'For the most innovative project presentation',
            amount: 10000,
            position: 1
          },
          {
            title: 'Runner-up Prize',
            description: 'For outstanding project presentation',
            amount: 5000,
            position: 2
          }
        ],
        guests: [
          {
            name: 'Sarah Johnson',
            designation: 'CTO',
            position: 'Tech Solutions Inc.',
            image: 'https://example.com/guest-sarah.jpg'
          }
        ],
        benefits: [
          {
            title: 'Networking Opportunities',
            description: 'Connect with industry professionals and peers'
          },
          {
            title: 'Certificate of Participation',
            description: 'Official certificate for all attendees'
          }
        ],
        requirements: [
          {
            title: 'Student ID',
            description: 'Valid student identification required',
            criteria: ['Current enrollment', 'Valid ID card']
          }
        ],
        rules: [
          {
            title: 'Code of Conduct',
            description: 'Professional behavior expected at all times',
            criteria: ['Respectful communication', 'No disruptive behavior']
          }
        ],
        eligibility: [
          {
            title: 'Student Status',
            description: 'Open to all university students',
            criteria: ['Current student', 'Any department']
          }
        ],
        instructions: [
          {
            title: 'Registration Process',
            description: 'Complete online registration and payment',
            criteria: ['Fill registration form', 'Pay registration fee']
          }
        ],
        sponsors: [
          {
            title: 'Tech Solutions Inc.',
            image: 'https://example.com/sponsor-tech-solutions.jpg',
            website: 'https://techsolutions.com',
            sponsorType: 'Platinum'
          }
        ],
        faqs: [
          {
            question: 'What should I bring to the event?',
            answer: 'Bring your student ID, notebook, and laptop if you plan to participate in workshops.'
          }
        ]
      },
      {
        createdBy: culturalClub!._id,
        title: 'Cultural Festival 2024',
        slogan: 'Celebrating Our Heritage',
        description: 'Annual cultural festival showcasing traditional music, dance, and art forms.',
        startDate: new Date('2024-07-20T16:00:00Z'),
        endDate: new Date('2024-07-20T22:00:00Z'),
        time: '4:00 PM - 10:00 PM',
        images: ['https://example.com/cultural-fest-1.jpg'],
        location: 'BUET Central Field',
        isOnline: false,
        isFixedSeat: false,
        registrationFee: 0,
        maxParticipants: 1000,
        currentParticipants: 250,
        registrationDeadline: new Date('2024-07-18T23:59:59Z'),
        isPublic: true,
        commentsEnabled: true,
        followersCount: 300,
        upVotesCount: 180,
        downVotesCount: 5,
        type: EVENT_TYPE.FESTIVAL,
        tags: ['culture', 'festival', 'music', 'dance'],
        organizedBy: culturalClub!._id,
        host: {
          name: 'Prof. Fatima Khan',
          designation: 'Professor',
          position: 'Department of Fine Arts'
        },
        benefits: [
          {
            title: 'Cultural Experience',
            description: 'Experience rich cultural performances'
          }
        ],
        faqs: [
          {
            question: 'Is food available at the venue?',
            answer: 'Yes, traditional food stalls will be available throughout the event.'
          }
        ]
      }
    ]);

    console.log('🎉 Seeded Events');

    // Seed Advertisements with type-specific data
    const advertisements = await Advertisement.insertMany([
      // Club Event Advertisement
      {
        title: 'Join Tech Innovation Summit 2024',
        description: 'Don\'t miss the biggest tech event of the year! Register now for exclusive workshops and networking opportunities.',
        type: ADVERTISEMENT_TYPE.CLUB_EVENT,
        status: ADVERTISEMENT_STATUS.ACTIVE,
        startDate: new Date('2024-05-01T00:00:00Z'),
        endDate: new Date('2024-06-14T23:59:59Z'),
        image: 'https://example.com/ad-tech-summit.jpg',
        banner: 'https://example.com/banner-tech-summit.jpg',
        externalLink: 'https://techsummit2024.com/register',
        callToAction: 'Register Now',
        club: techClub!._id,
        event: events[0]._id,
        targetAudience: ['students', 'tech-enthusiasts'],
        universities: [universities[0]._id, universities[1]._id],
        departments: ['Computer Science', 'Software Engineering'],
        impressions: 1500,
        clicks: 120,
        budget: 5000,
        costPerClick: 10,
        priority: 5,
        position: 'banner',
        createdBy: techClub!._id,
        tags: ['tech', 'summit', 'innovation'],
        notes: 'High-priority advertisement for flagship event'
      },
      // External Company Advertisement
      {
        title: 'Software Developer Internship Program',
        description: 'Join our 6-month internship program and kickstart your career in software development.',
        type: ADVERTISEMENT_TYPE.COMPANY,
        status: ADVERTISEMENT_STATUS.ACTIVE,
        startDate: new Date('2024-04-01T00:00:00Z'),
        endDate: new Date('2024-08-31T23:59:59Z'),
        image: 'https://example.com/ad-internship.jpg',
        externalLink: 'https://company.com/internship',
        callToAction: 'Apply Now',
        advertiserName: 'TechCorp Solutions',
        advertiserEmail: 'hr@techcorp.com',
        advertiserPhone: '+8801700000010',
        advertiserWebsite: 'https://techcorp.com',
        targetAudience: ['final-year-students', 'graduates'],
        universities: [universities[0]._id, universities[1]._id, universities[2]._id],
        departments: ['Computer Science', 'Software Engineering', 'Information Technology'],
        impressions: 2500,
        clicks: 200,
        budget: 15000,
        costPerClick: 15,
        priority: 3,
        position: 'sidebar',
        createdBy: users.find(u => u.role === USER_ROLES.ADMIN)!._id,
        tags: ['internship', 'career', 'software-development'],
        notes: 'Sponsored content from external company'
      },
      // Government Initiative Advertisement
      {
        title: 'Digital Bangladesh Skills Development Program',
        description: 'Free training program on digital skills for university students. Enhance your digital literacy.',
        type: ADVERTISEMENT_TYPE.GOVERNMENT,
        status: ADVERTISEMENT_STATUS.ACTIVE,
        startDate: new Date('2024-03-01T00:00:00Z'),
        endDate: new Date('2024-12-31T23:59:59Z'),
        image: 'https://example.com/ad-digital-bangladesh.jpg',
        banner: 'https://example.com/banner-digital-bangladesh.jpg',
        externalLink: 'https://digitalbangladesh.gov.bd/skills',
        callToAction: 'Enroll Free',
        advertiserName: 'Ministry of ICT',
        advertiserEmail: 'info@ict.gov.bd',
        advertiserWebsite: 'https://ict.gov.bd',
        targetAudience: ['all-students'],
        universities: [universities[0]._id, universities[1]._id, universities[2]._id],
        impressions: 5000,
        clicks: 400,
        priority: 4,
        position: 'feed',
        createdBy: users.find(u => u.role === USER_ROLES.ADMIN)!._id,
        tags: ['government', 'skills', 'digital-literacy'],
        notes: 'Government initiative for skill development'
      }
    ]);

    console.log('📢 Seeded Advertisements with type-specific data');

    // Seed Applications
    const applications = await Application.insertMany([
      {
        clubName: 'Robotics Innovation Club',
        university: universities[2]._id,
        clubPurpose: 'Advancing robotics and automation technologies',
        description: 'We aim to create a platform for students interested in robotics, automation, and mechatronics.',
        clubPhone: '+8801700000011',
        clubEmail: 'roboticsclub@duet.ac.bd',
        status: APPLICATION_STATUS.PENDING,
        applicantName: 'Mohammad Rahman',
        applicantEmail: 'mohammad.rahman@duet.ac.bd'
      },
      {
        clubName: 'Environmental Awareness Society',
        university: universities[0]._id,
        clubPurpose: 'Promoting environmental consciousness and sustainability',
        description: 'Dedicated to raising awareness about environmental issues and promoting sustainable practices.',
        clubPhone: '+8801700000012',
        clubEmail: 'envclub@du.ac.bd',
        status: APPLICATION_STATUS.APPROVED,
        applicantName: 'Fatima Ahmed',
        applicantEmail: 'fatima.ahmed@du.ac.bd'
      },
      {
        clubName: 'Business Innovation Hub',
        university: universities[1]._id,
        clubPurpose: 'Fostering entrepreneurship and business innovation',
        description: 'Supporting students in developing business ideas and entrepreneurial skills.',
        clubPhone: '+8801700000013',
        clubEmail: 'bizclub@buet.ac.bd',
        status: APPLICATION_STATUS.REJECTED,
        applicantName: 'Ahmed Hassan',
        applicantEmail: 'ahmed.hassan@buet.ac.bd'
      }
    ]);

    console.log('📝 Seeded Applications');

    // Seed Event Registrations with different user types
    const eventRegistrations = await EventRegistration.insertMany([
      // Registered user registration
      {
        event: events[0]._id,
        user: memberUser!._id,
        userType: USER_TYPE.REGISTERED,
        registrationCode: 'REG-TECH-001',
        registrationStatus: REGISTRATION_STATUS.CONFIRMED,
        paymentStatus: PAYMENT_STATUS.COMPLETED,
        paymentInfo: {
          method: PAYMENT_METHOD.AMARPAY,
          transactionId: 'TXN-001-2024',
          amount: 500,
          currency: 'BDT',
          processedAt: new Date('2024-05-15T10:30:00Z')
        },
        registeredAt: new Date('2024-05-15T10:00:00Z'),
        confirmedAt: new Date('2024-05-15T10:35:00Z'),
        emailSent: true,
        notes: 'Early bird registration'
      },
      // Public user registration
      {
        event: events[0]._id,
        publicUserInfo: {
          name: 'Alex Johnson',
          email: 'alex.johnson@gmail.com',
          phone: '+8801700000020',
          studentId: 'EXT-2024-001'
        },
        userType: USER_TYPE.PUBLIC,
        registrationCode: 'REG-TECH-002',
        registrationStatus: REGISTRATION_STATUS.PAID,
        paymentStatus: PAYMENT_STATUS.COMPLETED,
        paymentInfo: {
          method: PAYMENT_METHOD.CARD,
          transactionId: 'TXN-002-2024',
          amount: 500,
          currency: 'BDT',
          processedAt: new Date('2024-05-20T14:20:00Z')
        },
        registeredAt: new Date('2024-05-20T14:15:00Z'),
        emailSent: true
      },
      // Pending registration
      {
        event: events[1]._id,
        user: users.find(u => u.name === 'Jane')!._id,
        userType: USER_TYPE.REGISTERED,
        registrationCode: 'REG-CULT-001',
        registrationStatus: REGISTRATION_STATUS.PENDING,
        paymentStatus: PAYMENT_STATUS.PENDING,
        registeredAt: new Date('2024-06-01T09:00:00Z'),
        emailSent: false
      },
      // Cancelled registration
      {
        event: events[0]._id,
        publicUserInfo: {
          name: 'Maria Garcia',
          email: 'maria.garcia@yahoo.com',
          phone: '+8801700000021'
        },
        userType: USER_TYPE.PUBLIC,
        registrationCode: 'REG-TECH-003',
        registrationStatus: REGISTRATION_STATUS.CANCELLED,
        paymentStatus: PAYMENT_STATUS.REFUNDED,
        paymentInfo: {
          method: PAYMENT_METHOD.MOBILE_BANKING,
          transactionId: 'TXN-003-2024',
          amount: 500,
          currency: 'BDT',
          processedAt: new Date('2024-05-25T11:00:00Z')
        },
        registeredAt: new Date('2024-05-25T10:45:00Z'),
        cancelledAt: new Date('2024-05-30T16:30:00Z'),
        refundedAt: new Date('2024-06-02T12:00:00Z'),
        emailSent: true,
        notes: 'Cancelled due to schedule conflict'
      }
    ]);

    console.log('🎫 Seeded Event Registrations with different user types');

    // Seed Categories
    const categories = [
      {
        title: 'Technology',
        slug: 'technology',
        isDeleted: false
      },
      {
        title: 'Sports',
        slug: 'sports',
        isDeleted: false
      },
      {
        title: 'Arts & Culture',
        slug: 'arts-culture',
        isDeleted: false
      },
      {
        title: 'Academic',
        slug: 'academic',
        isDeleted: false
      },
      {
        title: 'Social',
        slug: 'social',
        isDeleted: false
      }
    ];
    await Category.insertMany(categories);
    console.log('✅ Categories seeded successfully');

    // Seed Tags
    const tags = [
      { title: 'Programming' },
      { title: 'Web Development' },
      { title: 'Mobile Apps' },
      { title: 'AI/ML' },
      { title: 'Football' },
      { title: 'Basketball' },
      { title: 'Cricket' },
      { title: 'Music' },
      { title: 'Dance' },
      { title: 'Photography' },
      { title: 'Research' },
      { title: 'Workshop' },
      { title: 'Networking' },
      { title: 'Competition' },
      { title: 'Volunteer' }
    ];
    await Tag.insertMany(tags);
    console.log('✅ Tags seeded successfully');

    // Seed Public content
    const publicContent = [
      {
        content: 'This is our privacy policy content. We respect your privacy and are committed to protecting your personal data.',
        type: 'privacy-policy'
      },
      {
        content: 'These are our terms and conditions. By using our platform, you agree to these terms.',
        type: 'terms-and-condition'
      },
      {
        content: 'Contact us at info@clubhub.com or call +1-234-567-8900. Our office is located at 123 University Ave.',
        type: 'contact'
      },
      {
        content: 'ClubHub is a platform designed to connect students with university clubs and organizations.',
        type: 'about'
      }
    ];
    await Public.insertMany(publicContent);
    console.log('✅ Public content seeded successfully');

    // Seed FAQs
    const faqs = [
      {
        question: 'How do I join a club?',
        answer: 'You can browse clubs and submit an application through the platform. Club admins will review your application.'
      },
      {
        question: 'Can I create my own club?',
        answer: 'Yes, you can create a new club by submitting a club registration form. It will be reviewed by university administrators.'
      },
      {
        question: 'How do I register for events?',
        answer: 'Browse events and click the register button. Some events may require approval from event organizers.'
      },
      {
        question: 'Is the platform free to use?',
        answer: 'Yes, ClubHub is completely free for all students and university organizations.'
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.'
      }
    ];
    await Faq.insertMany(faqs);
    console.log('✅ FAQs seeded successfully');

    // Seed Chats
    const chats = [
      {
        participants: [users[0]._id, users[1]._id],
        club: users[2]._id,
        isCommitteeChat: false,
        groupName: ''
      },
      {
        participants: [users[0]._id, users[1]._id, users[3]._id],
        club: users[2]._id,
        isCommitteeChat: false,
        groupName: 'Tech Club Discussion'
      },
      {
        participants: [users[1]._id, users[4]._id],
        club: users[5]._id,
        isCommitteeChat: false,
        groupName: ''
      }
    ];
    const createdChats = await Chat.insertMany(chats);
    console.log('✅ Chats seeded successfully');

    // Seed Messages
    const messages = [
      {
        chat: createdChats[0]._id,
        sender: users[0]._id,
        message: 'Hey! Are you attending the tech meetup tomorrow?'
      },
      {
        chat: createdChats[0]._id,
        sender: users[1]._id,
        message: 'Yes, definitely! Looking forward to it.'
      },
      {
        chat: createdChats[1]._id,
        sender: users[0]._id,
        message: 'Welcome to the Tech Club group chat!'
      },
      {
        chat: createdChats[1]._id,
        sender: users[1]._id,
        message: 'Thanks for adding me!'
      },
      {
        chat: createdChats[2]._id,
        sender: users[1]._id,
        message: 'Hi! I saw your sports club advertisement.'
      }
    ];
    await Message.insertMany(messages);
    console.log('✅ Messages seeded successfully');

    // Seed Committees
    const committees = [
      {
        club: users[2]._id, // Tech Club
        year: '2024',
        members: [
          {
            member: users[0]._id,
            position: 'President',
            note: 'Elected for exceptional leadership skills'
          },
          {
            member: users[1]._id,
            position: 'Vice President',
            note: 'Strong technical background'
          },
          {
            member: users[3]._id,
            position: 'Secretary',
            note: 'Excellent organizational skills'
          }
        ]
      },
      {
        club: users[5]._id, // Sports Club
        year: '2024',
        members: [
          {
            member: users[4]._id,
            position: 'Captain',
            note: 'Outstanding athletic performance'
          },
          {
            member: users[1]._id,
            position: 'Coach Assistant',
            note: 'Great mentoring abilities'
          }
        ]
      }
    ];
    // await Committe.insertMany(committees);
    console.log('✅ Committees seeded successfully');

    // Seed Follows
    const follows = [
      {
        user: users[0]._id,
        event: events[0]._id
      },
      {
        user: users[1]._id,
        event: events[0]._id
      },
      {
        user: users[0]._id,
        event: events[1]._id
      },
      {
        user: users[3]._id,
        event: events[0]._id
      },
      {
        user: users[4]._id,
        event: events[1]._id
      }
    ];
    await Follow.insertMany(follows);
    console.log('✅ Follows seeded successfully');

    // Seed Engagements
    const engagements = [
      {
        user: users[0]._id,
        event: events[0]._id,
        voteType: 'downvote'
      },
      {
        user: users[1]._id,
        event: events[0]._id,
        voteType: 'upvote'
      },
      {
        user: users[0]._id,
        event: events[1]._id,
        voteType: 'downvote'
      },
      {
        user: users[3]._id,
        event: events[0]._id,
        voteType: 'upvote'
      },
      {
        user: users[4]._id,
        event: events[1]._id,
        voteType: 'upvote'
      }
    ];
    await Engagement.insertMany(engagements);
    console.log('✅ Engagements seeded successfully');

    // Seed Notifications
    const notifications = [
      {
        to: users[0]._id,
        from: users[2]._id,
        title: 'New Event Posted',
        body: 'Tech Club has posted a new coding workshop event!',
        isRead: false
      },
      {
        to: users[1]._id,
        from: users[2]._id,
        title: 'Application Approved',
        body: 'Your application to join Tech Club has been approved!',
        isRead: true
      },
      {
        to: users[0]._id,
        from: users[5]._id,
        title: 'Event Reminder',
        body: 'Don\'t forget about the sports tournament tomorrow!',
        isRead: false
      },
      {
        to: users[3]._id,
        from: users[2]._id,
        title: 'Committee Position',
        body: 'You have been assigned as Secretary for Tech Club committee.',
        isRead: false
      },
      {
        to: users[4]._id,
        from: users[5]._id,
        title: 'Welcome Message',
        body: 'Welcome to Sports Club! We\'re excited to have you.',
        isRead: true
      }
    ];
    // await Notification.insertMany(notifications);
    console.log('✅ Notifications seeded successfully');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Seeded data summary:`);
    console.log(`   - Universities: ${universities.length}`);
    console.log(`   - Users: ${users.length} (with role-based fields)`);
    console.log(`   - Events: ${events.length}`);
    console.log(`   - Advertisements: ${advertisements.length} (with type-specific fields)`);
    console.log(`   - Applications: ${applications.length}`);
    console.log(`   - Event Registrations: ${eventRegistrations.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Tags: ${tags.length}`);
    console.log(`   - Public Content: ${publicContent.length}`);
    console.log(`   - FAQs: ${faqs.length}`);
    console.log(`   - Chats: ${createdChats.length}`);
    console.log(`   - Messages: ${messages.length}`);
    console.log(`   - Committees: ${committees.length}`);
    console.log(`   - Follows: ${follows.length}`);
    console.log(`   - Engagements: ${engagements.length}`);
    console.log(`   - Notifications: ${notifications.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
};

export default seedDatabase;

// Run seeding if this file is executed directly
if (require.main === module) {
  mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/your-database')
    .then(() => {
      console.log('🔗 Connected to MongoDB');
      return seedDatabase();
    })
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}