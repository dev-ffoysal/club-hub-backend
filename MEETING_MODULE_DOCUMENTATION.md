# Meeting Module Documentation

## Overview

This document provides comprehensive instructions for running and testing all features of the video meeting module. The module includes WebRTC-based video conferencing, real-time chat, screen sharing, and meeting management capabilities.

## Prerequisites

### System Requirements
- Node.js (v16 or higher)
- MongoDB (running instance)
- Redis (for session management)
- Modern web browser with WebRTC support (Chrome, Firefox, Safari, Edge)

### Environment Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/your-database
   
   # Redis
   REDIS_URL=redis://localhost:6379
   
   # Server
   PORT=3000
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES_IN=7d
   ```

## Starting the Application

### Development Mode
```bash
# Start the server with hot reload
npm run dev

# Or using yarn
yarn dev
```

### Production Mode
```bash
# Build and start
npm run build
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Meeting Management

#### 1. Create Meeting
```http
POST /api/meetings
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "title": "Team Standup",
  "description": "Daily team standup meeting",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "maxParticipants": 10,
  "isPublic": false,
  "allowGuests": true,
  "password": "optional-password",
  "settings": {
    "muteOnJoin": false,
    "videoOnJoin": true,
    "allowParticipantScreenShare": true,
    "allowParticipantChat": true
  }
}
```

#### 2. Get Meeting Details
```http
GET /api/meetings/:meetingId
Authorization: Bearer <your-jwt-token>
```

#### 3. Join Meeting by Code
```http
POST /api/meetings/join
Content-Type: application/json

{
  "meetingCode": "MEET-20240115-ABC123",
  "password": "optional-password",
  "guestName": "John Doe" // Required if not authenticated
}
```

#### 4. Update Meeting
```http
PUT /api/meetings/:meetingId
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "title": "Updated Meeting Title",
  "description": "Updated description"
}
```

#### 5. Delete Meeting
```http
DELETE /api/meetings/:meetingId
Authorization: Bearer <your-jwt-token>
```

#### 6. List Meetings
```http
GET /api/meetings?page=1&limit=10&status=active&searchTerm=standup
Authorization: Bearer <your-jwt-token>
```

## Testing Meeting Features

### 1. Basic Meeting Flow

#### Step 1: Create a Meeting
```bash
# Using curl
curl -X POST http://localhost:3000/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Meeting",
    "description": "Testing meeting functionality",
    "isPublic": true,
    "allowGuests": true
  }'
```

#### Step 2: Access Meeting Client
Open your browser and navigate to:
```
http://localhost:3000/src/app/modules/meeting/meeting.html
```

#### Step 3: Join Meeting
1. Enter the meeting code from the API response
2. Provide your name (if joining as guest)
3. Click "Join Meeting"

### 2. WebRTC Video/Audio Testing

#### Test Camera and Microphone
1. **Grant Permissions**: Browser will prompt for camera/microphone access
2. **Video Preview**: You should see your video feed in the local video element
3. **Audio Test**: Speak and check if audio levels are detected

#### Test Multiple Participants
1. Open multiple browser tabs/windows
2. Join the same meeting with different names
3. Verify:
   - Each participant sees others' video feeds
   - Audio from all participants is audible
   - Participant list updates in real-time

### 3. Media Controls Testing

#### Toggle Video
```javascript
// In browser console
socket.emit('toggle-video', { roomId: 'MEET-20240115-ABC123' });
```

#### Toggle Audio
```javascript
// In browser console
socket.emit('toggle-audio', { roomId: 'MEET-20240115-ABC123' });
```

#### Screen Share
1. Click "Share Screen" button
2. Select screen/window to share
3. Verify other participants can see the shared screen
4. Click "Stop Sharing" to end screen share

### 4. Chat Functionality Testing

#### Send Message
```javascript
// In browser console
socket.emit('send-message', {
  roomId: 'MEET-20240115-ABC123',
  message: 'Hello everyone!',
  type: 'text'
});
```

#### Test Chat UI
1. Type message in chat input
2. Press Enter or click Send
3. Verify message appears in chat for all participants
4. Test with multiple participants sending messages simultaneously

### 5. Meeting Controls Testing

#### Start Meeting (Host Only)
```javascript
socket.emit('start-meeting', { roomId: 'MEET-20240115-ABC123' });
```

#### End Meeting (Host Only)
```javascript
socket.emit('end-meeting', { roomId: 'MEET-20240115-ABC123' });
```

#### Leave Meeting
```javascript
socket.emit('leave-room', { roomId: 'MEET-20240115-ABC123' });
```

## Socket.IO Events Reference

### Client to Server Events

| Event | Description | Payload |
|-------|-------------|----------|
| `join-room` | Join a meeting room | `{ roomId: string, userId?: string, guestName?: string }` |
| `leave-room` | Leave a meeting room | `{ roomId: string }` |
| `offer` | WebRTC offer for peer connection | `{ roomId: string, targetSocketId: string, offer: RTCSessionDescription }` |
| `answer` | WebRTC answer for peer connection | `{ roomId: string, targetSocketId: string, answer: RTCSessionDescription }` |
| `ice-candidate` | ICE candidate for WebRTC | `{ roomId: string, targetSocketId: string, candidate: RTCIceCandidate }` |
| `toggle-audio` | Toggle audio on/off | `{ roomId: string }` |
| `toggle-video` | Toggle video on/off | `{ roomId: string }` |
| `toggle-screen-share` | Toggle screen sharing | `{ roomId: string }` |
| `send-message` | Send chat message | `{ roomId: string, message: string, type: 'text' }` |
| `start-meeting` | Start meeting (host only) | `{ roomId: string }` |
| `end-meeting` | End meeting (host only) | `{ roomId: string }` |

### Server to Client Events

| Event | Description | Payload |
|-------|-------------|----------|
| `room-joined` | Successfully joined room | `{ meeting: IMeeting, participants: IRoomParticipant[] }` |
| `user-joined` | New user joined room | `{ participant: IRoomParticipant }` |
| `user-left` | User left room | `{ socketId: string, userId?: string }` |
| `offer` | Received WebRTC offer | `{ fromSocketId: string, offer: RTCSessionDescription }` |
| `answer` | Received WebRTC answer | `{ fromSocketId: string, answer: RTCSessionDescription }` |
| `ice-candidate` | Received ICE candidate | `{ fromSocketId: string, candidate: RTCIceCandidate }` |
| `media-state-changed` | Participant media state changed | `{ socketId: string, mediaSettings: IMediaSettings }` |
| `message-received` | New chat message | `{ from: string, message: string, timestamp: Date }` |
| `meeting-started` | Meeting has started | `{ meetingId: string, startedAt: Date }` |
| `meeting-ended` | Meeting has ended | `{ meetingId: string, endedAt: Date }` |
| `error` | Error occurred | `{ message: string, code?: string }` |

## Testing Scenarios

### Scenario 1: Basic Meeting Workflow
1. Create meeting via API
2. Host joins meeting
3. Participants join meeting
4. Test video/audio communication
5. Host ends meeting
6. Verify all participants are disconnected

### Scenario 2: Guest Participation
1. Create public meeting with guest access
2. Join as guest (no authentication)
3. Verify guest can participate fully
4. Test guest name display in participant list

### Scenario 3: Meeting Security
1. Create private meeting with password
2. Attempt to join without password (should fail)
3. Join with correct password (should succeed)
4. Test meeting capacity limits

### Scenario 4: Network Resilience
1. Start meeting with multiple participants
2. Simulate network disconnection for one participant
3. Verify automatic reconnection
4. Test ICE candidate exchange during poor network conditions

### Scenario 5: Screen Sharing
1. Join meeting with multiple participants
2. Start screen sharing from one participant
3. Verify others can see shared screen
4. Switch screen share between participants
5. End screen sharing

## Troubleshooting

### Common Issues

#### 1. Camera/Microphone Not Working
- Check browser permissions
- Ensure HTTPS is used (required for WebRTC)
- Verify device availability

#### 2. Connection Issues
- Check network connectivity
- Verify STUN/TURN server configuration
- Check firewall settings

#### 3. Audio Echo
- Use headphones
- Check audio settings
- Implement echo cancellation

#### 4. Video Quality Issues
- Check bandwidth
- Adjust video resolution settings
- Monitor CPU usage

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'socket.io-client:*');
```

### Server Logs
Monitor server logs for Socket.IO events:
```bash
# Enable debug mode
DEBUG=socket.io:* npm run dev
```

## Performance Considerations

### Recommended Limits
- Maximum participants per meeting: 10-15 (depending on server resources)
- Video resolution: 720p for optimal performance
- Audio bitrate: 64kbps

### Monitoring
- Monitor CPU usage during meetings
- Track memory consumption
- Monitor network bandwidth
- Log WebRTC connection statistics

## Security Best Practices

1. **Always use HTTPS** in production
2. **Implement proper authentication** for meeting access
3. **Validate all input** from clients
4. **Use secure meeting codes** with sufficient entropy
5. **Implement rate limiting** for API endpoints
6. **Monitor for suspicious activity**

## Browser Compatibility

| Browser | Video | Audio | Screen Share | Chat |
|---------|-------|-------|--------------|------|
| Chrome 80+ | ✅ | ✅ | ✅ | ✅ |
| Firefox 75+ | ✅ | ✅ | ✅ | ✅ |
| Safari 14+ | ✅ | ✅ | ✅ | ✅ |
| Edge 80+ | ✅ | ✅ | ✅ | ✅ |

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Test with different browsers/devices
4. Verify network connectivity

---

*Last updated: January 2024*