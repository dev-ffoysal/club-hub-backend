import { Model, Types } from 'mongoose'
import {  MEMBERSHIP_STATUS } from '../../../enum/user'
import { ICommitte } from '../committe/committe.interface'

type IAuthentication = {
  restrictionLeftAt: Date | null
  resetPassword: boolean
  wrongLoginAttempts: number
  passwordChangedAt?: Date
  oneTimeCode: string
  latestRequestAt: Date
  expiresAt?: Date
  requestCount?: number

}

 type ClubTemplate = 'modern' | 'classic' | 'minimal' | 'vibrant' | 'academic';

 interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

 interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}
// export type Point = {
//   type: 'Point'
//   coordinates: [number, number] // [longitude, latitude]
// }


type IClub = {
  club:Types.ObjectId 
  role:string
  status: MEMBERSHIP_STATUS.PENDING | MEMBERSHIP_STATUS.APPROVED | MEMBERSHIP_STATUS.REJECTED
}

type IPartnersWith = {
  title:string,
  image:string,
}

export type IUser = {
  _id: Types.ObjectId
  name?: string
  lastName?: string
  profile?: string
  email: string
  password: string
  status: string
  verified: boolean
  role: string
  appId?: string
  deviceToken?: string
  studentId?: string
  bloodGroup?: string
  gender?: string
  description?:string
  department?:string
  year?:string
  semester?:string
  phone?: string
  address?: string
  clubs?:IClub[]
  // location: Point
  interestedIn?:string[]

  //club
  categories?:string[]
  clubName?:string
  clubTitle?:string
  clubPurpose?:string
  clubGoal?:string
  clubRegistrationNumber?:String
  university?:string
  applierEmail?:string
  clubPhone?:string
  feeCollectionMethod?:string
  clubFoundedAt?:Date
  clubCovers?:string[]
  clubDescription?:string
  clubWorkingAreas?:string[]
  appliedDescription?:string
  clubCommittee?:Types.ObjectId | ICommitte
  template?: ClubTemplate;
  colorScheme?: ColorScheme;
  slug?: string;
  followersCount?: number;
  membersCount?: number;
  rating?: number;
  ratingCount?: number;
  partnersWith?:IPartnersWith[];
  establishedYear?:string;

  socialLinks?: SocialLinks;

  //registration related info
  clubRegistrationEnabled?:boolean;
  clubRegistrationFees?:number;
  clubRegistrationStartsAt?:Date;
  clubRegistrationEndsAt?:Date;
  isFollowing?:boolean;
  authentication: IAuthentication
  createdAt: Date
  updatedAt: Date
}

export type UserModel = {
  isPasswordMatched: (
    givenPassword: string,
    savedPassword: string,
  ) => Promise<boolean>
} & Model<IUser>



export type IUserFilterables ={
  searchTerm?:string;
  role?:string;
  status?:string;
  categories?:Types.ObjectId[];
  verified?:boolean;
  clubName?:string;
  clubTitle?:string;
  clubWorkingAreas?:string;
  clubPurpose?:string;
  clubGoal?:string;
  clubRegistration?:String;
  university?:string;
  applierEmail?:string;
  clubPhone?:string;
  clubJoiningFees?:string;
  clubFoundedAt?:Date;
  clubCovers?:string[];
  clubDescription?:string;
  clubfollowers?:Types.ObjectId;
  clubCommittee?:Types.ObjectId[];
  template?: ClubTemplate;
  colorScheme?: ColorScheme;
  slug?: string;
  followersCount?: number;
  

}