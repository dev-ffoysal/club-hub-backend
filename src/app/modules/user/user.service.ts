import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IUser, IUserFilterables } from './user.interface'
import { User } from './user.model'

import { USER_ROLES, USER_STATUS } from '../../../enum/user'

import { JwtPayload } from 'jsonwebtoken'
import { logger } from '../../../shared/logger'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { userSearchableFields } from './user.constants'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { Follow } from '../follow/follow.model'
import { Types } from 'mongoose'



const updateMemberProfile = async (user: JwtPayload, payload: Partial<IUser>) => {
  // console.log(first)
  const updatedProfile = await User.findOneAndUpdate(
    { _id: user.authId, status: { $nin: [USER_STATUS.DELETED] } },
    {
      $set: payload,
    },
    { new: true },
  )

  if (!updatedProfile) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update profile.')
  }

  return 'Profile updated successfully.'
}


const updateClubProfileInformation = async (user: JwtPayload, payload: Partial<IUser>) => {
  const updatedProfile = await User.findOneAndUpdate(
    { _id: user.authId, status: { $nin: [USER_STATUS.DELETED] } },
    {
      $set: payload,
    },
    { new: true },
  )

  if (!updatedProfile) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update profile.')
  }

  return 'Profile updated successfully.'
}

const createAdmin = async (): Promise<Partial<IUser> | null> => {
  const admin = {
    email: 'admin@gmail.com',
    firstName: 'admin',
    password: '123123123',
    role: USER_ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
    verified: true,
    authentication: {
      oneTimeCode: null,
      restrictionLeftAt: null,
      expiresAt: null,
      latestRequestAt: new Date(),
    },
  }

  const isAdminExist = await User.findOne({
    email: admin.email,
    status: { $nin: [USER_STATUS.DELETED] },
  })

  if (isAdminExist) {
    logger.log('info', 'Admin account already exist, skipping creation.🦥')
    return isAdminExist
  }
  const result = await User.create([admin])
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create admin')
  }
  return result[0]
}

const getAllClubs = async( filters:IUserFilterables, pagination:IPaginationOptions,userId?:string)=>{
  const {page,skip, limit, sortBy, sortOrder} = paginationHelper.calculatePagination(pagination)
  const {searchTerm, clubWorkingAreas, ...filterData} = filters

  const andConditions = []
  if(searchTerm){
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  if(clubWorkingAreas){
    andConditions.push({
      clubWorkingAreas: {
        $in: clubWorkingAreas,
      },
    })
  }
  

  if(Object.keys(filterData).length){
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  andConditions.push({
    role: USER_ROLES.CLUB,
  })

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {}

  const [users,total] = await Promise.all([
    User.find(whereConditions).sort({[sortBy]: sortOrder}).skip(skip).limit(limit).populate('university').lean(),
    User.countDocuments(whereConditions),
  ])

  const isFollowing = await Follow.find({
    club: {
      $in: users.map(user => user._id),
    },
    user: userId,
  })

  users.forEach(user => {
  
    user.isFollowing = isFollowing.some(follow => follow.club.toString() === user._id.toString())
  })
  console.log(isFollowing)
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: users,
  }

}


const getAllUsers = async(user:JwtPayload, filters:IUserFilterables, pagination:IPaginationOptions)=>{
  const {page,skip, limit, sortBy, sortOrder} = paginationHelper.calculatePagination(pagination)
  const {searchTerm, clubWorkingAreas, ...filterData} = filters

  const andConditions = []
  if(searchTerm){
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  if(clubWorkingAreas){
    andConditions.push({
      clubWorkingAreas: {
        $in: clubWorkingAreas,
      },
    })
  }


  

  if(Object.keys(filterData).length){
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }


  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {}

  const [users,total] = await Promise.all([
    User.find(whereConditions).sort({[sortBy]: sortOrder}).skip(skip).limit(limit).lean(),
    User.countDocuments(whereConditions),
  ])

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: users,
  }

}

const getSingleUser = async (id: string, userId?:string) => {
  const user = await User.findById(id).populate({
    path: 'clubCommittee',
    select: 'club members',
   
  }).populate({
    path:'clubCommittee.club',
    select:'clubName clubTitle clubPurpose clubGoal clubRegistration university',
  })
  .populate({
    path:'clubCommittee.members',
    select:'member position note',
    populate:{
      path:'member',
      select:'firstName lastName email profile',
    }
  }).lean()


  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'The requested user does not exist.')
  }
  if(user?.status === USER_STATUS.DELETED){
    throw new ApiError(StatusCodes.NOT_FOUND, 'The requested user does not exist.')
  }
  
  //now check if the user following the club
  console.log(user._id, userId)
  const isFollowing = await Follow.countDocuments({
    club: new Types.ObjectId(user._id),

    user: new Types.ObjectId(userId),
  })

  console.log(isFollowing)

  user.isFollowing = isFollowing > 0

  return user
}

const fillUserProfileInformation = async (user: JwtPayload, payload: Partial<IUser>) => {
  const updatedProfile = await User.findOneAndUpdate(
    { _id: user.authId, status: { $nin: [USER_STATUS.DELETED] } },
    {
      $set: payload,
    },
    { new: true },
  )

  if (!updatedProfile) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update profile.')
  }

  return 'Profile updated successfully.'
}

const getUserProfile = async (user: JwtPayload) => {
  const profile = await User.findOne({ _id: user.authId, status: { $nin: [USER_STATUS.DELETED] } }).populate({
    path: 'clubs.club',
    select: 'clubName clubTitle clubPurpose clubGoal clubRegistration university',
  }).populate({
    path: 'clubs.role',
    select: 'title',
  }).populate({
    path: 'categories',
    select: 'title slug',
  }).lean()
  if (!profile) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get profile.')
  }
  return profile
}




export const UserServices = {  updateMemberProfile, createAdmin, getAllClubs, getAllUsers, getSingleUser,fillUserProfileInformation,getUserProfile,updateClubProfileInformation }
