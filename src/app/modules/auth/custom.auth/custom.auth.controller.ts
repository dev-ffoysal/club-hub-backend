import { Request, Response } from 'express'
import catchAsync from '../../../../shared/catchAsync'
import { CustomAuthServices } from './custom.auth.service'
import sendResponse from '../../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'
import { setCookies } from '../common'

const customLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body

  const result = await CustomAuthServices.customLogin(loginData)
  const {status, message, accessToken, refreshToken, role} = result

  //set both accessToken and refreshToken to cookies
 if(accessToken){
  
    res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  })
 }
 if(refreshToken){
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  })
 }
 if(role){
  res.cookie('role', role, {
    httpOnly: false,
    secure: false,
    sameSite: 'none',
  })
}
  sendResponse(res, {
    statusCode: status,
    success: true,
    message: message,
    data: {accessToken, refreshToken, role},
  })
})

const adminLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body

  const result = await CustomAuthServices.adminLogin(loginData)
  const {status, message, accessToken, refreshToken, role} = result

  //set both accessToken and refreshToken to cookies
  if(accessToken){
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
  }
  if(refreshToken){
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
  }
  if(role){
    res.cookie('role', role, {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
    })
  }

  sendResponse(res, {
    statusCode: status,
    success: true,
    message: message,
    data: {accessToken, refreshToken, role},
  })
})

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, phone } = req.body
  const result = await CustomAuthServices.forgetPassword(email.toLowerCase().trim(), phone)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `An OTP has been sent to your ${email || phone}. Please verify your email.`,
    data: result,
  })
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization
  const { ...resetData } = req.body
  const result = await CustomAuthServices.resetPassword(token!, resetData)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: false,
    message: 'Password reset successfully, please login now.',
    data: result,
  })
})

const verifyAccount = catchAsync(async (req: Request, res: Response) => {
  const { oneTimeCode, phone, email } = req.body

  const result = await CustomAuthServices.verifyAccount(email, oneTimeCode)
  const {status, message, accessToken, refreshToken, role, token} = result
  //set both accessToken and refreshToken to cookies
 if(accessToken){
    setCookies('accessToken', accessToken, res, true, 'none')
 }
 if(refreshToken){
  setCookies('refreshToken', refreshToken, res, true, 'none')
 }
 
 if(role){
  setCookies('role', role, res, false, 'none')
 }
  sendResponse(res, {
    statusCode: status,
    success: true,
    message: message,
    data: {accessToken, refreshToken, role, token},
  })
})

const getRefreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies
  const result = await CustomAuthServices.getRefreshToken(refreshToken)
  
  // Set the new accessToken in cookies
  if(result.accessToken){
    setCookies('accessToken', result.accessToken, res, true, 'none')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Token refreshed successfully',
    data: result,
  })
})

const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, phone } = req.body
  const result = await CustomAuthServices.resendOtp(email)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `An OTP has been sent to your ${email || phone}. Please verify your email.`,
  })
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body
  const result = await CustomAuthServices.changePassword(
    req.user!,
    currentPassword,
    newPassword,
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  })
})

const createMemberprofile = catchAsync(async (req: Request, res: Response) => {


  const { images,...userData } = req.body
  userData.profile = images?.length > 0 ? images[0] : ''
  const result = await CustomAuthServices.createMemberprofile(userData)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Account created successfully, please verify your account now.',
    data: result,
  })
})
const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const {password} = req.body
  const result = await CustomAuthServices.deleteAccount(user!, password)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Account deleted successfully',
    data: result,
  })
})


const socialLogin = catchAsync(async (req: Request, res: Response) => {
  const { appId, deviceToken } = req.body
  const result = await CustomAuthServices.socialLogin(appId, deviceToken)
  const {status, message, accessToken, refreshToken, role} = result

  //set both accessToken and refreshToken to cookies
  if(accessToken){
    setCookies('accessToken', accessToken, res, true, 'none')
  }
  if(refreshToken){
    setCookies('refreshToken', refreshToken, res, true, 'none')
  }
  if(role){
    setCookies('role', role, res, false, 'none')
  }

  sendResponse(res, {
    statusCode: status,
    success: true,
    message: message,
    data: {accessToken, refreshToken, role},
  })
})


const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const result = await CustomAuthServices.getUserProfile(user!)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User profile fetched successfully',
    data: result,
  })
})



export const CustomAuthController = {
  forgetPassword,
  resetPassword,
  verifyAccount,
  customLogin,
  getRefreshToken,
  resendOtp,
  changePassword,
  createMemberprofile,
  deleteAccount,
  adminLogin,
  socialLogin,
  getUserProfile,
}
