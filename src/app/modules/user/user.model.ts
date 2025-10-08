import { Schema, model } from 'mongoose'
import { IUser, UserModel } from './user.interface'
import {  MEMBERSHIP_STATUS, USER_ROLES, USER_STATUS } from '../../../enum/user'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'
import config from '../../../config'
import bcrypt from 'bcrypt'

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
    },
    lastName: {
      type: String,
    },
    profile: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    status: {
      type: String,
      enum: [USER_STATUS.ACTIVE, USER_STATUS.RESTRICTED, USER_STATUS.DELETED],
      default: USER_STATUS.ACTIVE,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: USER_ROLES.MEMBER,
    },
    appId: {
      type: String,
    },
    deviceToken: {
      type: String,
    },
    studentId: {
      type: String,
    },
    gender: {
      type: String,
    },
    interestedIn: {
      type: [String],
      default:undefined
    },
    bloodGroup: {
      type: String,
    },
    description: {
      type: String,
    },
    department: {
      type: String,
    },
    year: {
      type: String,
    },
    semester: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    clubs: {
      type: [{
        club: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
        },
          status: {
            type: String,
          enum: [MEMBERSHIP_STATUS.PENDING, MEMBERSHIP_STATUS.APPROVED, MEMBERSHIP_STATUS.REJECTED],
        }
      }],
    },
    // Club related fields
    categories: {
      type: [String],
      default: undefined
    },
    clubName: {
      type: String,
    },
    clubTitle: {
      type: String,
    },
    clubPurpose: {
      type: String,
    },
    clubGoal: {
      type: String,
    },
    clubRegistrationNumber: {
      type: String,

    },
    university: {
      type: String,
    },
    applierEmail: {
      type: String,
    },
    clubPhone: {
      type: String,
    },
    clubFoundedAt: {
      type: Date,
    },
    clubCovers: {
      type: [String],
      default: undefined
    },
    clubDescription: {
      type: String,
    },
    clubCommittee: {
      type: Schema.Types.ObjectId,
      ref: 'Committe',
    },
    feeCollectionMethod: {
      type: String,
      enum: ['online', 'offline'],
    },
    partnersWith: {
      type: [{
        title: String,
        image: String,
      }],
      default: undefined
    },
    establishedYear: {
      type: String,
    },
    membersCount: {
      type: Number,
    },
    clubWorkingAreas: {
      type: [String],
      default: undefined
    },
    appliedDescription: {
      type: String,
    },
    template: {
      type: String,
    },
    colorScheme: {
      type: {
        primary: String,
        secondary: String,
        accent: String,
        background: String,
      },
    },
    slug: {
      type: String,
    },
    followersCount: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    ratingCount: {
      type: Number,
    },

    // location: {
     //   type: {
     //     type: String,
     //     default: 'Point',
     //     enum: ['Point'],
     //   },
     //   coordinates: {
     //     type: [Number],
     //     default: [0.0, 0.0], // [longitude, latitude]
     //   },
     // },
    socialLinks: {
      type: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
        youtube: String,
        website: String,
      },
    },
    //registration related info
    clubRegistrationEnabled: {
      type: Boolean,

    },
    clubRegistrationFees: {
      type: Number,
    },
    clubRegistrationStartsAt: {
      type: Date,
    },
    clubRegistrationEndsAt: {
      type: Date,
    },
    authentication: {
      _id: false,
      select: false,
      type: {
        restrictionLeftAt: {
          type: Date,
          default: null,
        },
        resetPassword: {
          type: Boolean,
          default: false,
        },
        wrongLoginAttempts: {
          type: Number,
          default: 0,
        },
        passwordChangedAt: {
          type: Date,
          default: null,
        },
        oneTimeCode: {
          type: String,
          default: null,
        },
        latestRequestAt: {
          type: Date,
          default: null,
        },
        expiresAt: {
          type: Date,
          default: null,
        },
        requestCount: {
          type: Number,
          default: 0,
        },
       
      },
    },
  },
  {
    timestamps: true,
  },
)

// userSchema.index({ location: '2dsphere' })

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword)
}

userSchema.pre<IUser>('save', async function (next) {
  //find the user by email
  const isExist = await User.findOne({
    email: this.email,
    status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.RESTRICTED] },
  })
  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'An account with this email already exists',
    )
  }

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

export const User = model<IUser, UserModel>('User', userSchema)
