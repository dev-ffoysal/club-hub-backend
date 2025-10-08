
import { UserRoutes } from '../app/modules/user/user.route'
import { AuthRoutes } from '../app/modules/auth/auth.route'
import express, { Router } from 'express'
import { NotificationRoutes } from '../app/modules/notifications/notifications.route'
import { PublicRoutes } from '../app/modules/public/public.route'
import { EventRoutes } from '../app/modules/event/event.route'
import { ApplicationRoutes } from '../app/modules/application/application.route'
import { CommitteRoutes } from '../app/modules/committe/committe.route'
import { ChatRoutes } from '../app/modules/chat/chat.route'
import { MessageRoutes } from '../app/modules/message/message.route'
import { EngagementRoutes } from '../app/modules/engagement/engagement.route'
import { FollowRoutes } from '../app/modules/follow/follow.route'
import { UniversityRoutes } from '../app/modules/university/university.route'
import { TagRoutes } from '../app/modules/tag/tag.route'
import { CategoryRoutes } from '../app/modules/category/category.route'
import { AdvertisementRoutes } from '../app/modules/advertisement/advertisement.route'
import { EventRegistrationRoutes } from '../app/modules/eventRegistration/eventRegistration.route'
import { ClubRoutes } from '../app/modules/clubApis/club.route'
import { PaymentRoutes } from '../app/modules/payment/payment.route'
import { ClubregistrationRoutes } from '../app/modules/clubregistration/clubregistration.route'
import { AchievementRoutes } from '../app/modules/achievement/achievement.route'
import { MeetingRoutes } from '../app/modules/meeting/meeting.routes'


const router = express.Router()

const apiRoutes: { path: string; route: Router }[] = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },


  { path: '/notifications', route: NotificationRoutes },
  { path: '/club', route: ClubRoutes },

  { path: '/public', route: PublicRoutes },
  { path: '/event', route: EventRoutes },
  { path: '/application', route: ApplicationRoutes },
  { path: '/committe', route: CommitteRoutes },
  { path: '/chat', route: ChatRoutes },
  { path: '/message', route: MessageRoutes },
  { path: '/engagement', route: EngagementRoutes },
  { path: '/follow', route: FollowRoutes },
  { path: '/university', route: UniversityRoutes },
  { path: '/tag', route: TagRoutes },
  { path: '/category', route: CategoryRoutes },
  { path: '/advertisement', route: AdvertisementRoutes },
  { path: '/event-registration', route: EventRegistrationRoutes },
  { path: '/payment', route: PaymentRoutes },
  { path: '/club-registration', route: ClubregistrationRoutes },
  { path: '/achievement', route: AchievementRoutes },
  { path: '/meeting', route: MeetingRoutes }]

apiRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
