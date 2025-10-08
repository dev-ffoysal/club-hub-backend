import { Schema, model } from 'mongoose';
import { IAchievement, AchievementModel } from './achievement.interface'; 

const achievementSchema = new Schema<IAchievement, AchievementModel>({
  club: { type: Schema.Types.ObjectId, ref: 'User' },
  images: { type: [String], default: [] },
  title: { type: String, required: true },
  description: { type: String, required: true },
  subTitle: { type: String, required: true },
  date: { type: Date, required: true },
  teams: { type: [Schema.Types.ObjectId], ref: 'User' },
  subDescription: { type: String, required: true },
  tags: { type: [String], default: [] },
  event: { type: String , ref: 'Event' },
  organizedBy: {
    name: { type: String, required: true },
    image: { type: String,  },
    title: { type: String,  },
    description: { type: String, },
    email: { type: String,  },
    phone: { type: String,  },
    website: { type: String,  },
   
  },
}, {
  timestamps: true
});

export const Achievement = model<IAchievement, AchievementModel>('Achievement', achievementSchema);
