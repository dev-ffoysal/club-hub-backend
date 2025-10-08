export const meetingSearchableFields = [
  'title',
  'description',
  'meetingCode'
];

export const meetingFilterableFields = [
  'searchTerm',
  'host',
  'status',
  'isPublic',
  'startDate',
  'endDate'
];

export const meetingPopulateFields = [
  {
    path: 'host',
    select: 'name email avatar'
  },
  {
    path: 'participants.user',
    select: 'name email avatar'
  }
];

// WebRTC Configuration
export const WEBRTC_CONFIG = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'stun:stun1.l.google.com:19302'
    }
    // Add TURN servers for production
    // {
    //   urls: 'turn:your-turn-server.com:3478',
    //   username: 'username',
    //   credential: 'password'
    // }
  ]
};

// Socket.IO Events
export const SOCKET_EVENTS = {
  // Room events
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  ROOM_JOINED: 'room-joined',
  ROOM_LEFT: 'room-left',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  
  // WebRTC signaling
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice-candidate',
  
  // Media controls
  TOGGLE_AUDIO: 'toggle-audio',
  TOGGLE_VIDEO: 'toggle-video',
  TOGGLE_SCREEN_SHARE: 'toggle-screen-share',
  MEDIA_STATE_CHANGED: 'media-state-changed',
  
  // Meeting controls
  START_MEETING: 'start-meeting',
  END_MEETING: 'end-meeting',
  MEETING_STARTED: 'meeting-started',
  MEETING_ENDED: 'meeting-ended',
  KICK_PARTICIPANT: 'kick-participant',
  
  // Chat events
  SEND_MESSAGE: 'send-message',
  RECEIVE_MESSAGE: 'receive-message',
  MESSAGE_RECEIVED: 'message-received',
  
  // Error events
  ERROR: 'error',
  CONNECTION_ERROR: 'connection-error'
};

// Meeting limits
export const MEETING_LIMITS = {
  MAX_PARTICIPANTS: 500,
  DEFAULT_MAX_PARTICIPANTS: 50,
  MAX_DURATION_HOURS: 24,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
  MEETING_CODE_LENGTH: 8
};

// Default meeting settings
export const DEFAULT_MEETING_SETTINGS = {
  muteOnJoin: true,
  videoOnJoin: false,
  allowParticipantScreenShare: true,
  allowParticipantChat: true,
  waitingRoom: false,
  chatEnabled: true,
  screenShareEnabled: true,
  allowGuests: true,
  isPublic: false
};