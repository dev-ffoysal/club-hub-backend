import { z } from 'zod'
import { USER_ROLES } from '../../../enum/user'
import { profile } from 'console'

const createUserZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }).min(6),
    name: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    studentId: z.string().optional(),
    bloodGroup: z.string().optional(),
    description: z.string().optional(),
    department: z.string().optional(),
    year: z.string().optional(),
    semester: z.string().optional(),
    role: z.enum(
      [
        USER_ROLES.ADMIN,
        USER_ROLES.MEMBER,
        USER_ROLES.GUEST,
        USER_ROLES.CLUB,
      ],
      {
        message: 'Role must be one of admin, user, guest',
      },
    ),
  }),
})

const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    image: z.array(z.string()).optional(),
  }),
})


// Member Profile Update Schema
const memberProfileFillZodSchema = z.object({
  body: z.object({
    club:z.string({required_error:'Club Id is required'}),
    university:z.string({required_error:'University is required'}),
    name: z.string({ required_error: 'Name is required' }).min(1),
    lastName: z.string().optional(),
    email: z.string({required_error:"Email is required."}).email(),
    phone: z.string({required_error:"Phone is required."}),
    images: z.array(z.string()).optional(),
    gender: z.string({required_error:"Gender is required."}),
    address: z.string({required_error:"Address is required."}),
    department: z.string({required_error:"Department is required."}),
    year: z.string({required_error:"Year is required."}),
    semester: z.string({required_error:"Semester is required."}),
    studentId: z.string({required_error:"Student id is required."}),
    bloodGroup: z.string({required_error:"Blood group is required."}),
    description: z.string({required_error:"Description is required."})
  }),
})

// Club Profile Update Schema
const clubProfileUpdateFillZodSchema = z.object({
  body: z.object({
    clubTitle: z.string({required_error:"Club title is required."}).min(1),
    clubGoal: z.string({required_error:"Club goal is required."}).min(1),
    clubJoiningFees: z.string({required_error:"Club joining fees is required."}),
    clubPhone: z.string({required_error:"Club phone is required."}),
    clubDescription: z.string({required_error:"Club description is required."}),
    images: z.array(z.string({required_error:"Club cover is required."})),
    covers: z.array(z.string({required_error:"Club cover is required."})),
    clubFoundedAt: z.date({required_error:"Club founded at is required."}),
    clubWorkingAreas: z.array(z.string({required_error:"Club working area is required."})),
    establishedYear: z.string({required_error:"Established year is required."}),
    socialLinks: z.object({
      facebook: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      instagram: z.string().optional(),
      youtube: z.string().optional(),
    }),

  }),
})

const optionalString = z.string().optional()

const updateMemberProfileZodSchema = z.object({
  body: z.object({
    university: optionalString,
    name: optionalString,
    lastName: z.string().optional(),
    phone: optionalString,
    images: z.array(z.string()).optional(),
    gender: optionalString,
    address: optionalString,
    department: optionalString,
    interestedIn:z.array(z.string()).optional(),
    year: optionalString,
    semester: optionalString,
    studentId: optionalString,
    bloodGroup: optionalString,
    description: optionalString,
  }),
})

const updateClubProfileInformationZodSchema = z.object({
  body: z.object({
    categories: z.array(z.string()).optional(),
    clubName: optionalString, 
    clubTitle: optionalString,
    clubPurpose: optionalString,
    clubGoal: optionalString,
    clubJoiningFees: optionalString,
    clubPhone: optionalString,
    clubDescription: optionalString,
    images: z.array(z.string()).optional(),
    covers: z.array(z.string()).optional(),
    clubFoundedAt: z.coerce.date().optional(),
    clubWorkingAreas: z.array(z.string()).optional(),
    establishedYear: z.string().optional(),
    socialLinks: z
      .object({
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        instagram: z.string().optional(),
        youtube: z.string().optional(),
      })
      .partial() // all inside optional
      .optional(),
  }),
})

export const UserValidations = { createUserZodSchema, updateUserZodSchema, memberProfileFillZodSchema, clubProfileUpdateFillZodSchema, updateMemberProfileZodSchema, updateClubProfileInformationZodSchema }
