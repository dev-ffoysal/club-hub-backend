import { Request, Response } from 'express';
import { AchievementServices } from './achievement.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { achievementFilterables } from './achievement.constants';
import { paginationFields } from '../../../interfaces/pagination';

const createAchievement = catchAsync(async (req: Request, res: Response) => {
  const achievementData = req.body;
if (achievementData.images.length > 0) {
  const lastImage = achievementData.images.pop(); // removes and returns last element
  achievementData.organizedBy.image = lastImage;
}
  const result = await AchievementServices.createAchievement(
    req.user!,
    achievementData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Achievement created successfully',
    data: result,
  });
});

const updateAchievement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const achievementData = req.body;

  const result = await AchievementServices.updateAchievement(
    req.user!,
    id,
    achievementData
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Achievement updated successfully',
    data: result,
  });
});

const getSingleAchievement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AchievementServices.getSingleAchievement(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Achievement retrieved successfully',
    data: result,
  });
});

const getAllAchievements = catchAsync(async (req: Request, res: Response) => {

  const pagination = pick(req.query, paginationFields);

  const result = await AchievementServices.getAllAchievements(
    req.user!,
    pagination
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Achievements retrieved successfully',
    data: result,
  });
});

const deleteAchievement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AchievementServices.deleteAchievement(req.user!, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Achievement deleted successfully',
    data: result,
  });
});

const getAchievementByClub = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AchievementServices.getAchievementByClub(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Achievements retrieved successfully',
    data: result,
  });
});

export const AchievementController = {
  createAchievement,
  updateAchievement,
  getSingleAchievement,
  getAllAchievements,
  deleteAchievement,
  getAchievementByClub,
};