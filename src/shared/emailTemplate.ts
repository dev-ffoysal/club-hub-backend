import { IApplication } from '../app/modules/application/application.interface'
import { ICreateAccount, IResetPassword, IApplicationSubmission } from '../interfaces/emailTemplate'

const createAccount = (values: ICreateAccount) => {
  console.log(values, 'values')
  const data = {
    to: values.email,
    subject: `Verify your account, ${values.name}`,
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <img src="https://res.cloudinary.com/dmvht7o8m/image/upload/v1737711309/download_bjkj2g.png" alt="Logo" style="width: 150px; height: auto;">
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px;">
            <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">Email Verification</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">Your verification code is:</p>
            <div style="background-color: #f0f0f0; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; color: #4a4a4a;">${values.otp}</span>
            </div>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">This code will expire in 5 minutes. If you didn't request this code, please ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px; text-align: center; color: #999999; font-size: 14px;">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
  `,
  }
  return data
}

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: `Reset your password, ${values.name}`,
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <img src="https://res.cloudinary.com/dmvht7o8m/image/upload/v1737711309/download_bjkj2g.png" alt="Logo" style="width: 150px; height: auto;">
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px;">
            <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">Password Reset</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">Your password reset code is:</p>
            <div style="background-color: #f0f0f0; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; color: #4a4a4a;">${values.otp}</span>
            </div>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">This code will expire in 5 minutes. If you didn't request this code, please ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px; text-align: center; color: #999999; font-size: 14px;">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
  `,
  }
  return data
}

const resendOtp = (values: {
  email: string
  name: string
  otp: string

}) => {
  const data = {
    to: values.email,
    subject: `Account Verification - New Code`,
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <img src="https://res.cloudinary.com/dmvht7o8m/image/upload/v1737711309/download_bjkj2g.png" alt="Logo" style="width: 150px; height: auto;">
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px;">
            <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">New Verification Code</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">
              Hello ${values.name},<br><br>
              You requested a new verification code. Here's your new code:
            </p>
            <div style="background-color: #f0f0f0; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; color: #4a4a4a;">${values.otp}</span>
            </div>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">
              This code will expire in 5 minutes.<br>
              If you didn't request this code, please ignore this email or contact support.
            </p>
            <div style="margin-top: 30px; padding: 15px; background-color: #fff8e1; border-radius: 4px; border-left: 4px solid #ffd54f;">
              <p style="color: #666666; font-size: 14px; margin: 0;">
                For security reasons, never share this code with anyone.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px; text-align: center; color: #999999; font-size: 14px; border-top: 1px solid #eeeeee;">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
  `,
  }
  return data
}

const applicationSubmission = (values: IApplication, to:'club'|'admin'| 'applicant')=> {

  const data = {
    to: to === 'club' ? values.clubEmail : to === 'admin' ? 'foysal.fahim1047@gmail.com' : values.applicantEmail,
    subject: `Club Application Submitted Successfully - ${values.clubName}`,
    html: `
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; line-height: 1.6;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <img src="https://res.cloudinary.com/dmvht7o8m/image/upload/v1737711309/download_bjkj2g.png" alt="Club Management Platform" style="width: 120px; height: auto; margin-bottom: 20px;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">Application Submitted!</h1>
            <p style="color: #e8eaff; font-size: 16px; margin: 10px 0 0 0;">Thank you for applying to create a club</p>
          </td>
        </tr>
        
        <!-- Greeting Section -->
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 15px; font-weight: 600;">Hello ${values.applicantName}! 👋</h2>
            <p style="color: #555555; font-size: 16px; margin-bottom: 20px;">We've successfully received your club application. Your submission is now under review by our administrative team.</p>
            
            <!-- Status Badge -->
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
              <span style="color: #856404; font-weight: 600; font-size: 16px;">📋 Status: Under Review</span>
            </div>
          </td>
        </tr>
        
        <!-- Application Details -->
        <tr>
          <td style="padding: 0 30px 30px 30px;">
            <h3 style="color: #2c3e50; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">📄 Application Details</h3>
            
            <table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; width: 35%; background-color: #e9ecef;">Application ID:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529; font-family: monospace; font-size: 14px;">${values._id.toString()}</td>

              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">Club Name:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529; font-weight: 600;">${values.clubName}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">University:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529;">${values.university}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">Club Purpose:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529;">${values.clubPurpose}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">Description:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529;">${values.description}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">Club Phone:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529;">${values.clubPhone}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">Club Email:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529;">${values.clubEmail}</td>
              </tr>
              <tr>
                <td style="padding: 15px; font-weight: 600; color: #495057; background-color: #e9ecef;">Submitted On:</td>
                <td style="padding: 15px; color: #212529;">${values.createdAt?.toLocaleDateString()}</td>

              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Next Steps Section -->
        <tr>
          <td style="padding: 0 30px 30px 30px;">
            <h3 style="color: #2c3e50; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">🚀 What Happens Next?</h3>
            
            <div style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); border-radius: 10px; padding: 25px; margin-bottom: 20px;">
              <h4 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">📋 Step 1: Admin Verification</h4>
              <p style="color: #dfe6e9; margin: 0; font-size: 14px;">Our administrative team will review your application within 2-3 business days. We'll verify all the information provided and ensure it meets our club creation guidelines.</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%); border-radius: 10px; padding: 25px; margin-bottom: 20px;">
              <h4 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">✅ Step 2: Application Approval</h4>
              <p style="color: #ffeaa7; margin: 0; font-size: 14px;">Once approved, you'll receive an email notification with your club account credentials and instructions to complete your club profile.</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #55a3ff 0%, #003d82 100%); border-radius: 10px; padding: 25px; margin-bottom: 20px;">
              <h4 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">🏗️ Step 3: Complete Club Profile</h4>
              <p style="color: #dfe6e9; margin: 0; font-size: 14px;">After approval, you'll need to fill in additional information including club logo, working areas, joining fees, founding date, and other details to make your club visible to students.</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); border-radius: 10px; padding: 25px;">
              <h4 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">🌟 Step 4: Go Live!</h4>
              <p style="color: #dfe6e9; margin: 0; font-size: 14px;">Once your profile is complete, your club will be visible to all users. You can start creating events, managing members, and building your community!</p>
            </div>
          </td>
        </tr>
        
        <!-- Important Notes -->
        <tr>
          <td style="padding: 0 30px 30px 30px;">
            <div style="background-color: #fff8e1; border-left: 4px solid #ffc107; border-radius: 0 8px 8px 0; padding: 20px; margin: 20px 0;">
              <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">📌 Important Notes:</h4>
              <ul style="color: #856404; margin: 0; padding-left: 20px; font-size: 14px;">
                <li style="margin-bottom: 8px;">Keep this email for your records - you'll need the Application ID for any inquiries</li>
                <li style="margin-bottom: 8px;">We'll send updates to <strong>${values.applicantEmail}</strong></li>
                <li style="margin-bottom: 8px;">If you have questions, contact our support team with your Application ID</li>
                <li>Processing time: 2-3 business days (excluding weekends and holidays)</li>
              </ul>
            </div>
          </td>
        </tr>
        
        <!-- Contact Support -->
        <tr>
          <td style="padding: 0 30px 30px 30px; text-align: center;">
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; border: 1px solid #dee2e6;">
              <h4 style="color: #495057; margin: 0 0 10px 0;">Need Help? 🤝</h4>
              <p style="color: #6c757d; margin: 0 0 15px 0; font-size: 14px;">Our support team is here to assist you</p>
              <p style="color: #495057; margin: 0; font-size: 14px;">
                📧 Email: <a href="mailto:support@clubmanagement.com" style="color: #007bff; text-decoration: none;">support@clubmanagement.com</a><br>
                📞 Phone: <a href="tel:+8801700000000" style="color: #007bff; text-decoration: none;">+880-1700-000-000</a>
              </p>
            </div>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #2c3e50; padding: 25px 30px; text-align: center;">
            <p style="color: #bdc3c7; margin: 0 0 10px 0; font-size: 14px;">Thank you for choosing our Club Management Platform</p>
            <p style="color: #95a5a6; margin: 0; font-size: 12px;">&copy; 2024 Club Management Platform. All rights reserved.</p>
            <div style="margin-top: 15px;">
              <a href="#" style="color: #3498db; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
              <a href="#" style="color: #3498db; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
              <a href="#" style="color: #3498db; text-decoration: none; margin: 0 10px; font-size: 12px;">Contact Us</a>
            </div>
          </td>
        </tr>
      </table>
      
      <!-- Mobile Responsive Styles -->
      <style>
        @media only screen and (max-width: 600px) {
          .email-container {
            width: 100% !important;
            margin: 10px auto !important;
          }
          .email-content {
            padding: 20px !important;
          }
          .details-table td {
            display: block !important;
            width: 100% !important;
            padding: 10px !important;
            border-bottom: 1px solid #dee2e6 !important;
          }
          .step-card {
            margin-bottom: 15px !important;
            padding: 20px !important;
          }
        }
      </style>
    </body>
  `,
  }
  return data
}


const applicationStatusUpdate = (values: IApplication, to: 'club' | 'admin' | 'applicant', loginDetails?: { email: string, password: string }) => {
  const status = values?.status
  const reason = values?.rejectedReason
  const data = {
    to: to === 'club' ? values.clubEmail : to === 'admin' ? 'foysal.fahim1047@gmail.com' : values.applicantEmail,
    subject: `Club Application Status - ${values.clubName}`,
    html: `
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; line-height: 1.6;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <img src="https://res.cloudinary.com/dmvht7o8m/image/upload/v1737711309/download_bjkj2g.png" alt="Club Management Platform" style="width: 120px; height: auto; margin-bottom: 20px;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">Application Status Update</h1>
            <p style="color: #e8eaff; font-size: 16px; margin: 10px 0 0 0;">Your application status has been updated</p>
          </td>
        </tr>
        
        <!-- Greeting Section -->
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 15px; font-weight: 600;">Hello ${to === "club" ? values.clubName  : values.applicantName}! 👋</h2>
            <p style="color: #555555; font-size: 16px; margin-bottom: 20px;">
            ${to === "club" 
              ? "We've reviewed your application." 
              : `We've reviewed your application for ${values.clubName}.`
            }
          </p>
            
            <!-- Status Badge -->
            <div style="background-color: ${status === 'approved' ? '#d4edda' : '#fff3cd'}; border: 1px solid ${status === 'approved' ? '#c3e6cb' : '#ffeaa7'}; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
              <span style="color: ${status === 'approved' ? '#155724' : '#856404'}; font-weight: 600; font-size: 16px;">
                ${status === 'approved' ? '✅ Application Approved' : '❌ Application Rejected'}
              </span>
            </div>
          </td>
        </tr>
        
        <!-- Application Details -->
        <tr>
          <td style="padding: 0 30px 30px 30px;">
            <h3 style="color: #2c3e50; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">📄 Application Details</h3>
            
            <table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; width: 35%; background-color: #e9ecef;">Application ID:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529; font-family: monospace; font-size: 14px;">${values._id.toString()}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">Club Name:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529; font-weight: 600;">${values.clubName}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">University:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529;">${values.university}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">Club Purpose:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529;">${values.clubPurpose}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">Description:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529;">${values.description}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">Club Phone:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529;">${values.clubPhone}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057; background-color: #e9ecef;">Club Email:</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; color: #212529;">${values.clubEmail}</td>
              </tr>
              <tr>
                <td style="padding: 15px; font-weight: 600; color: #495057; background-color: #e9ecef;">Submitted On:</td>
                <td style="padding: 15px; color: #212529;">${values.createdAt?.toLocaleDateString()}</td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Additional Info Based on Status -->
        <tr>
          <td style="padding: 0 30px 30px 30px;">
            <h3 style="color: #2c3e50; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">🔑 Next Steps</h3>
            
            ${status === 'approved' ? `
              <div style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); border-radius: 10px; padding: 25px; margin-bottom: 20px;">
                <h4 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">🎉 Step 1: Login Credentials</h4>
                <p style="color: #dfe6e9; margin: 0; font-size: 14px;">Your application has been approved! Below are your login credentials:</p>
                <p style="color: #ffffff; font-weight: bold; font-size: 16px;">Email: ${loginDetails?.email}</p>
                <p style="color: #ffffff; font-weight: bold; font-size: 16px;">Password: ${loginDetails?.password}</p>
              </div>
            ` : `
              <div style="background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%); border-radius: 10px; padding: 25px; margin-bottom: 20px;">
                <h4 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">❌ Step 1: Application Rejected</h4>
                <p style="color: #ffeaa7; margin: 0; font-size: 14px;">Unfortunately, your application has been rejected. Reason: ${reason}</p>
                <p style="color: #ffeaa7; margin: 0; font-size: 14px;">Please feel free to <a href="#" style="color: #ffffff;">reapply</a> once the issues are resolved.</p>
              </div>
            `}
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #2c3e50; padding: 25px 30px; text-align: center;">
            <p style="color: #bdc3c7; margin: 0 0 10px 0; font-size: 14px;">Thank you for using our Club Management Platform</p>
            <p style="color: #95a5a6; margin: 0; font-size: 12px;">&copy; 2024 Club Management Platform. All rights reserved.</p>
            <div style="margin-top: 15px;">
              <a href="#" style="color: #3498db; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
              <a href="#" style="color: #3498db; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
              <a href="#" style="color: #3498db; text-decoration: none; margin: 0 10px; font-size: 12px;">Contact Us</a>
            </div>
          </td>
        </tr>
      </table>
    </body>
  `
  };
  return data;
};


export const emailTemplate = {
  createAccount,
  resetPassword,
  resendOtp,
  applicationSubmission,
  applicationStatusUpdate,
}
