import { Request, Response, NextFunction } from 'express'

import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'

import { UserServices } from './user.service'
import { IUser } from './user.interface'
import pick from '../../../shared/pick'
import { userFilterableFields, userSearchableFields } from './user.constants'
import { paginationFields } from '../../../interfaces/pagination'
import { JwtPayload } from 'jsonwebtoken'



const updateMemberProfile = catchAsync(async (req: Request, res: Response) => {
  const { images, covers, ...userData } = req.body
  console.log(images, covers,userData)
  if(images?.length>0){
    userData.profile = images[0]
  }

  const result = await UserServices.updateMemberProfile(req.user!, userData)
  sendResponse<String>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  })
})

const updateClubProfileInformation = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body)
  const { images, covers, ...userData } = req.body
  if(images?.length>0){
    userData.profile = images[0]
  }
  if(covers?.length>0){
    userData.clubCovers = covers
  }
  const result = await UserServices.updateClubProfileInformation(req.user!, userData)
  sendResponse<String>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  })
})

const getAllClubs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)
  const userId = (req.user as JwtPayload)?.authId
  const result = await UserServices.getAllClubs(filters, paginationOptions, userId)
  sendResponse<IUser[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users fetched successfully',  
    data: result.data,
    meta: result.meta,
  })
})

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as JwtPayload)?.authId

  const result = await UserServices.getSingleUser(req.params.id, userId)
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  })
})


const fillUserProfileInformation = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const {covers, images, ...rest} = req.body;
  rest.clubCovers = covers.length ? covers : [];
  rest.profile = images.length ? images : [];
  const result = await UserServices.fillUserProfileInformation(user!, rest);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User profile information filled successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)
  const result = await UserServices.getAllUsers(req.user!, filters, paginationOptions)
  sendResponse<IUser[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users fetched successfully',
    data: result.data,
    meta: result.meta,
  })
})

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getUserProfile(req.user!)
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User profile fetched successfully',
    data: result,
  })
})

export const UserController = {

  updateMemberProfile,
  getAllClubs,
  getSingleUser,
  fillUserProfileInformation,
  getAllUsers,
  getUserProfile,
  updateClubProfileInformation,
}
