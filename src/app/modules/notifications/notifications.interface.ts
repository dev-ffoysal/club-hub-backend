import { Model, Types } from 'mongoose'

export type INotification = {
  _id: Types.ObjectId
  to: Types.ObjectId
  from?: Types.ObjectId
  title: string
  body: string
  type: 'info' | 'warning' | 'error' | 'success' | 'request'
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export type NotificationModel = Model<INotification>
