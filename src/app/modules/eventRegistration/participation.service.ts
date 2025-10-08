import { EventRegistration } from './eventRegistration.model';
import { PARTICIPATION_STATUS } from './eventRegistration.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';


class ParticipationService {
  // Mark single participant
  async markSingleParticipation(registrationId: string, participated: boolean) {
    const registration = await EventRegistration.findById(registrationId);
    
    if (!registration) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Registration not found');
    }

    return await registration.markParticipation(participated);
  }

  // Mark multiple participants
  async markBulkParticipation(registrationIds: string[], participated: boolean) {
    const result = await EventRegistration.markBulkParticipation(registrationIds, participated);
    
    if (result.matchedCount === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No registrations found');
    }

    return {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      status: participated ? PARTICIPATION_STATUS.PARTICIPATED : PARTICIPATION_STATUS.NOT_PARTICIPATED
    };
  }

  // Get participation statistics for an event
  async getParticipationStats(eventId: string) {
    const stats = await EventRegistration.getParticipationStats(eventId);
    
    const result = {
      total: 0,
      participated: 0,
      notParticipated: 0
    };

    stats.forEach((stat: any) => {
      result.total += stat.count;
      if (stat._id === PARTICIPATION_STATUS.PARTICIPATED) {
        result.participated = stat.count;
      } else {
        result.notParticipated = stat.count;
      }
    });

    return result;
  }

  // Get participants for an event with optional filtering
  async getEventParticipants(eventId: string, participationStatus?: PARTICIPATION_STATUS) {
    const filter: any = { event: eventId };
    
    if (participationStatus) {
      filter.participationStatus = participationStatus;
    }

    return await EventRegistration.find(filter)
      .populate('user', 'name email phone')
      .populate('event', 'title startDate')
      .sort({ participatedAt: -1, createdAt: -1 });
  }
}

export default new ParticipationService();