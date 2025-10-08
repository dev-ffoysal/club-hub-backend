# Complete Meeting Module Testing Guide

## Overview
This guide provides step-by-step instructions for testing the entire video meeting module using both Postman for API testing and the HTML client for WebRTC functionality.

## Prerequisites

### 1. Server Setup
```bash
# Start the server
npm start
# or
node dist/server.js
```

### 2. Required Tools
- **Postman** - For API testing
- **Modern Web Browser** - Chrome/Firefox/Safari for WebRTC testing
- **Multiple Browser Windows/Tabs** - To simulate multiple participants

## Part 1: API Testing with Postman

### Step 1: Import Postman Collection
1. Open Postman
2. Click "Import" button
3. Select the `Meeting_API_Postman_Collection.json` file
4. The collection will be imported with all endpoints and variables

### Step 2: Authentication Setup

#### Option A: If you have existing authentication
1. Run the "Login User" request in the Authentication folder
2. Update the request body with valid credentials:
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```
3. The JWT token will be automatically saved to collection variables

#### Option B: If no authentication system exists
1. Set the `jwt_token` collection variable manually:
   - Click on the collection name
   - Go to "Variables" tab
   - Set `jwt_token` to any test value (e.g., "test-token")
   - Update your authentication middleware to accept this token

### Step 3: Complete API Testing Workflow

#### 3.1 Create a Meeting
1. Run "Create Meeting" request
2. The meeting ID and code will be automatically saved
3. Verify response contains meeting details

#### 3.2 Test Meeting Operations
Run these requests in order:
1. **Get Meeting by Code** - Verify meeting exists
2. **Join Meeting** - Test guest joining
3. **Get Meeting Details** - Check participant list
4. **Update Meeting** - Modify meeting settings
5. **Start Meeting** - Change status to active
6. **Get Meeting Stats** - View meeting statistics
7. **End Meeting** - Change status to ended
8. **Delete Meeting** - Clean up (optional)

#### 3.3 Test Additional Endpoints
- **List All Meetings** - Admin functionality
- **Get My Meetings** - User's meeting list
- **Test Socket Connection** - Verify Socket.IO endpoint

## Part 2: WebRTC and Socket.IO Testing

### Step 1: Access the Meeting Client
1. Open browser and navigate to: `http://localhost:5000/meeting/meeting.html`
2. You should see the meeting interface with:
   - Token input field
   - Meeting code input
   - Join meeting button
   - Video/audio controls

### Step 2: Authentication Token Setup

#### Option A: Using JWT Token from Postman
1. Copy the JWT token from Postman collection variables
2. Paste it in the "Authentication Token" field
3. This token will be used for Socket.IO authentication

#### Option B: Testing Without Authentication
1. Leave the token field empty
2. The socket will connect as an unauthenticated user
3. Some features may be limited based on your authentication setup

### Step 3: Single User Testing

#### 3.1 Join a Meeting
1. Enter a meeting code (from Postman testing)
2. Click "Join Meeting"
3. Allow camera/microphone permissions when prompted
4. Verify:
   - Socket connection established
   - Local video stream appears
   - Meeting controls are functional

#### 3.2 Test Media Controls
1. **Toggle Camera** - Video should turn on/off
2. **Toggle Microphone** - Audio should mute/unmute
3. **Screen Share** - Should request screen sharing permission
4. **Leave Meeting** - Should disconnect and clean up

### Step 4: Multi-User Testing

#### 4.1 Setup Multiple Participants
1. Open 2-3 browser windows/tabs
2. Navigate to the meeting client in each
3. Use the same meeting code for all participants
4. Join the meeting from each window

#### 4.2 Test WebRTC Functionality
1. **Video Streaming**:
   - Verify each participant can see others' video
   - Test video quality and synchronization
   - Toggle cameras and verify changes propagate

2. **Audio Communication**:
   - Test speaking from one participant
   - Verify audio is heard by others
   - Test mute/unmute functionality

3. **Screen Sharing**:
   - Start screen share from one participant
   - Verify others can see the shared screen
   - Test stopping screen share

#### 4.3 Test Chat Functionality
1. Send messages from different participants
2. Verify messages appear for all users
3. Test message timestamps and sender identification

#### 4.4 Test Meeting Controls
1. **Start Meeting** (host only):
   - Verify meeting status changes
   - Check if restrictions are applied

2. **End Meeting** (host only):
   - Verify all participants are disconnected
   - Check meeting status update

## Part 3: Socket.IO Event Testing

### Real-time Event Monitoring
Open browser developer tools (F12) and monitor console for Socket.IO events:

#### Connection Events
- `connect` - Socket connected successfully
- `disconnect` - Socket disconnected
- `connect_error` - Connection failed (check authentication)

#### Meeting Events
- `room-joined` - Successfully joined meeting room
- `room-left` - Left meeting room
- `user-joined` - Another user joined
- `user-left` - Another user left
- `meeting-started` - Meeting status changed to active
- `meeting-ended` - Meeting ended by host

#### WebRTC Signaling Events
- `offer` - WebRTC offer received
- `answer` - WebRTC answer received
- `ice-candidate` - ICE candidate received

#### Media Events
- `media-state-changed` - Participant's media state updated
- `screen-share-started` - Screen sharing started
- `screen-share-stopped` - Screen sharing stopped

#### Chat Events
- `message-received` - New chat message
- `typing-start` - User started typing
- `typing-stop` - User stopped typing

## Part 4: Error Testing and Troubleshooting

### Common Issues and Solutions

#### 1. "API not found" Error
**Problem**: Cannot access `http://localhost:5000/meeting/meeting.html`
**Solution**: 
- Ensure server is running on port 5000
- Verify static file serving is configured in `app.ts`
- Check that the meeting module routes are properly registered

#### 2. Socket Connection Failed
**Problem**: Socket.IO connection fails with authentication error
**Solutions**:
- Verify JWT token is valid and not expired
- Check token format in authentication header
- Ensure authentication middleware is properly configured
- Test with empty token field for guest access

#### 3. WebRTC Connection Issues
**Problem**: Video/audio not working between participants
**Solutions**:
- Check browser permissions for camera/microphone
- Verify STUN/TURN server configuration
- Test on same network first, then different networks
- Check firewall settings

#### 4. Media Stream Errors
**Problem**: Camera or microphone access denied
**Solutions**:
- Grant browser permissions for media access
- Use HTTPS for production (required for media access)
- Check if other applications are using the camera

### Testing Checklist

#### API Testing ✓
- [ ] Authentication works
- [ ] Meeting creation successful
- [ ] Meeting retrieval by code
- [ ] Guest joining functionality
- [ ] Meeting updates
- [ ] Meeting start/end operations
- [ ] Meeting deletion
- [ ] Statistics retrieval

#### WebRTC Testing ✓
- [ ] Socket.IO connection established
- [ ] Meeting room joining
- [ ] Local media stream capture
- [ ] Peer-to-peer connection establishment
- [ ] Video streaming between participants
- [ ] Audio communication
- [ ] Screen sharing functionality
- [ ] Media controls (mute/unmute, camera on/off)

#### Real-time Features ✓
- [ ] Chat messaging
- [ ] Participant join/leave notifications
- [ ] Meeting status updates
- [ ] Media state synchronization
- [ ] Proper cleanup on disconnect

## Part 5: Performance and Load Testing

### Browser Performance
1. Monitor CPU and memory usage during video calls
2. Test with multiple participants (5-10 users)
3. Check video quality degradation with more participants
4. Monitor network bandwidth usage

### Server Performance
1. Use Postman's collection runner for API load testing
2. Monitor server memory and CPU during multiple connections
3. Test concurrent Socket.IO connections
4. Check database performance with multiple meetings

## Security Testing

### Authentication Testing
1. Test with invalid JWT tokens
2. Verify unauthorized access is blocked
3. Test token expiration handling
4. Check guest access limitations

### Data Validation
1. Test with malformed meeting codes
2. Send invalid data in API requests
3. Test XSS prevention in chat messages
4. Verify input sanitization

## Production Deployment Testing

### HTTPS Requirements
1. WebRTC requires HTTPS in production
2. Update Socket.IO configuration for secure connections
3. Test with valid SSL certificates
4. Verify CORS settings for production domains

### Environment Variables
1. Test with production database connections
2. Verify STUN/TURN server configurations
3. Check JWT secret keys
4. Validate API rate limiting

This comprehensive testing guide ensures all aspects of the meeting module are thoroughly validated before deployment.