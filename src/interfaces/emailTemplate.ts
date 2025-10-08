export type ICreateAccount = {
  name: string
  email: string
  otp: string
}

export type IResetPassword = {
  name: string
  email: string
  otp: string
}


export type IEmailOrPhoneVerification = {
  name: string
  email?: string
  phone?: string
  type: 'createAccount' | 'resetPassword'
}

export type IApplicationSubmission = {
  applicantName: string
  applicantEmail: string
  clubName: string
  university: string
  clubPurpose: string
  description: string
  clubPhone: string
  clubEmail: string
  submissionDate: string
  applicationId: string
}