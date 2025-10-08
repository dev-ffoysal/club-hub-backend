export { EventRegistration } from './eventRegistration.model';
export { EventRegistrationController } from './eventRegistration.controller';
export { EventRegistrationService } from './eventRegistration.service';
export { EventRegistrationRoutes } from './eventRegistration.route';
export { EventRegistrationValidations } from './eventRegistration.validation';
export * from './eventRegistration.interface';

// Participation exports (integrated with registration)
export { ParticipationController } from './participation.controller';
export { ParticipationRoutes } from './participation.route';
export { ParticipationValidation } from './participation.validation';
export { default as ParticipationService } from './participation.service';