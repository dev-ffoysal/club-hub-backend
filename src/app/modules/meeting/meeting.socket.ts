import { Server as SocketIOServer, Socket } from 'socket.io';
import { meetingService } from './meeting.service';
import { SOCKET_EVENTS } from './meeting.constants';
import { ISignalingMessage, IRoomParticipant } from './meeting.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';


// In-memory storage for active rooms and participants
const activeRooms = new Map<string, Map<string, IRoomParticipant>>();
const socketToRoom = new Map<string, string>();
const socketToParticipant = new Map<string, IRoomParticipant>();

export class MeetingSocketHandler {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Join room event
      socket.on(SOCKET_EVENTS.JOIN_ROOM, async (data: {
        meetingCode: string;
        userId?: string;
        guestName?: string;
        mediaSettings: {
          camera: boolean;
          microphone: boolean;
        };
      }) => {
        try {
          await this.handleJoinRoom(socket, data);
        } catch (error) {
          socket.emit(SOCKET_EVENTS.ERROR, {
            message: error instanceof Error ? error.message : 'Failed to join room'
          });
        }
      });

      // Leave room event
      socket.on(SOCKET_EVENTS.LEAVE_ROOM, () => {
        this.handleLeaveRoom(socket);
      });

      // WebRTC signaling events
      socket.on(SOCKET_EVENTS.OFFER, (data: ISignalingMessage) => {
        this.handleWebRTCSignaling(socket, SOCKET_EVENTS.OFFER, data);
      });

      socket.on(SOCKET_EVENTS.ANSWER, (data: ISignalingMessage) => {
        this.handleWebRTCSignaling(socket, SOCKET_EVENTS.ANSWER, data);
      });

      socket.on(SOCKET_EVENTS.ICE_CANDIDATE, (data: ISignalingMessage) => {
        this.handleWebRTCSignaling(socket, SOCKET_EVENTS.ICE_CANDIDATE, data);
      });

      // Media control events
      socket.on(SOCKET_EVENTS.TOGGLE_VIDEO, (data: { enabled: boolean }) => {
        this.handleMediaToggle(socket, 'camera', data.enabled);
      });

      socket.on(SOCKET_EVENTS.TOGGLE_AUDIO, (data: { enabled: boolean }) => {
        this.handleMediaToggle(socket, 'microphone', data.enabled);
      });

      socket.on(SOCKET_EVENTS.TOGGLE_SCREEN_SHARE, (data: { enabled: boolean }) => {
        this.handleMediaToggle(socket, 'screenShare', data.enabled);
      });

      // Meeting control events
      socket.on(SOCKET_EVENTS.START_MEETING, async (data: { meetingId: string }) => {
        try {
          await this.handleStartMeeting(socket, data.meetingId);
        } catch (error) {
          socket.emit(SOCKET_EVENTS.ERROR, {
            message: error instanceof Error ? error.message : 'Failed to start meeting'
          });
        }
      });

      socket.on(SOCKET_EVENTS.END_MEETING, async (data: { meetingId: string }) => {
        try {
          await this.handleEndMeeting(socket, data.meetingId);
        } catch (error) {
          socket.emit(SOCKET_EVENTS.ERROR, {
            message: error instanceof Error ? error.message : 'Failed to end meeting'
          });
        }
      });

      // Chat events
      socket.on(SOCKET_EVENTS.SEND_MESSAGE, (data: {
        message: string;
        timestamp: Date;
      }) => {
        this.handleChatMessage(socket, data);
      });

      // Disconnect event
      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        this.handleLeaveRoom(socket);
      });
    });
  }

  private async handleJoinRoom(socket: Socket, data: {
    meetingCode: string;
    userId?: string;
    guestName?: string;
    mediaSettings: {
      camera: boolean;
      microphone: boolean;
    };
  }) {
    const { meetingCode, userId, guestName, mediaSettings } = data;

    // Verify meeting exists and is active
    const meeting = await meetingService.getMeetingByCode(meetingCode);
    if (!meeting) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Meeting not found');
    }

    if (meeting.status !== 'active' && meeting.status !== 'scheduled') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Meeting is not available');
    }

    // Create participant object
    const participant: IRoomParticipant = {
      socketId: socket.id,
      userId: userId || undefined,
      guestName: guestName || 'Guest',
      peerId: `peer_${socket.id}`,
      mediaSettings: {
        camera: mediaSettings.camera,
        microphone: mediaSettings.microphone,
        screenShare: false
      },
      joinedAt: new Date()
    };

    // Add to room
    if (!activeRooms.has(meetingCode)) {
      activeRooms.set(meetingCode, new Map());
    }

    const room = activeRooms.get(meetingCode)!;
    room.set(socket.id, participant);
    socketToRoom.set(socket.id, meetingCode);
    socketToParticipant.set(socket.id, participant);

    // Join socket room
    socket.join(meetingCode);

    // Get other participants in the room
    const otherParticipants = Array.from(room.values()).filter(p => p.socketId !== socket.id);

    // Notify the joining participant about existing participants
    socket.emit(SOCKET_EVENTS.ROOM_JOINED, {
      meetingCode,
      participant,
      otherParticipants
    });

    // Notify other participants about the new participant
    socket.to(meetingCode).emit(SOCKET_EVENTS.USER_JOINED, {
      participant
    });

    console.log(`Participant ${participant.guestName} joined room ${meetingCode}`);
  }

  private handleLeaveRoom(socket: Socket) {
    const meetingCode = socketToRoom.get(socket.id);
    const participant = socketToParticipant.get(socket.id);

    if (meetingCode && participant) {
      const room = activeRooms.get(meetingCode);
      if (room) {
        room.delete(socket.id);
        
        // If room is empty, remove it
        if (room.size === 0) {
          activeRooms.delete(meetingCode);
        }
      }

      // Clean up mappings
      socketToRoom.delete(socket.id);
      socketToParticipant.delete(socket.id);

      // Leave socket room
      socket.leave(meetingCode);

      // Notify other participants
      socket.to(meetingCode).emit(SOCKET_EVENTS.USER_LEFT, {
        participant
      });

      console.log(`Participant ${participant.guestName} left room ${meetingCode}`);
    }
  }

  private handleWebRTCSignaling(socket: Socket, event: string, data: ISignalingMessage) {
    const meetingCode = socketToRoom.get(socket.id);
    if (!meetingCode) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not in a room' });
      return;
    }

    // Forward signaling message to target peer
    if (data.targetSocketId) {
      socket.to(data.targetSocketId).emit(event, {
        ...data,
        fromSocketId: socket.id
      });
    } else {
      // Broadcast to all other participants in the room
      socket.to(meetingCode).emit(event, {
        ...data,
        fromSocketId: socket.id
      });
    }
  }

  private handleMediaToggle(socket: Socket, mediaType: 'camera' | 'microphone' | 'screenShare', enabled: boolean) {
    const meetingCode = socketToRoom.get(socket.id);
    const participant = socketToParticipant.get(socket.id);

    if (!meetingCode || !participant) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not in a room' });
      return;
    }

    // Update participant media settings
    participant.mediaSettings[mediaType] = enabled;

    // Notify other participants about media change
    socket.to(meetingCode).emit(SOCKET_EVENTS.MEDIA_STATE_CHANGED, {
      socketId: socket.id,
      mediaType,
      enabled
    });

    console.log(`Participant ${participant.guestName} ${enabled ? 'enabled' : 'disabled'} ${mediaType}`);
  }

  private async handleStartMeeting(socket: Socket, meetingId: string) {
    // This would typically verify the user is the host
    // For now, we'll just broadcast the meeting started event
    const meetingCode = socketToRoom.get(socket.id);
    if (meetingCode) {
      this.io.to(meetingCode).emit(SOCKET_EVENTS.MEETING_STARTED, {
        meetingId,
        startedAt: new Date()
      });
    }
  }

  private async handleEndMeeting(socket: Socket, meetingId: string) {
    const meetingCode = socketToRoom.get(socket.id);
    if (meetingCode) {
      // Notify all participants that meeting ended
      this.io.to(meetingCode).emit(SOCKET_EVENTS.MEETING_ENDED, {
        meetingId,
        endedAt: new Date()
      });

      // Remove all participants from the room
      const room = activeRooms.get(meetingCode);
      if (room) {
        const socketIds = Array.from(room.keys());
        for (const socketId of socketIds) {
          const participantSocket = this.io.sockets.sockets.get(socketId);
          if (participantSocket) {
            participantSocket.leave(meetingCode);
          }
          socketToRoom.delete(socketId);
          socketToParticipant.delete(socketId);
        }
        activeRooms.delete(meetingCode);
      }
    }
  }

  private handleChatMessage(socket: Socket, data: {
    message: string;
    timestamp: Date;
  }) {
    const meetingCode = socketToRoom.get(socket.id);
    const participant = socketToParticipant.get(socket.id);

    if (!meetingCode || !participant) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not in a room' });
      return;
    }

    // Broadcast message to all participants in the room
    this.io.to(meetingCode).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, {
      message: data.message,
      timestamp: data.timestamp,
      sender: {
        socketId: socket.id,
        name: participant.guestName,
        userId: participant.userId
      }
    });
  }

  // Utility methods
  public getRoomParticipants(meetingCode: string): IRoomParticipant[] {
    const room = activeRooms.get(meetingCode);
    return room ? Array.from(room.values()) : [];
  }

  public getRoomCount(meetingCode: string): number {
    const room = activeRooms.get(meetingCode);
    return room ? room.size : 0;
  }

  public isRoomActive(meetingCode: string): boolean {
    return activeRooms.has(meetingCode) && activeRooms.get(meetingCode)!.size > 0;
  }
}

export default MeetingSocketHandler;