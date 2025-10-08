import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { ClubServices } from "./club.services";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import { PaymentMode, PaymentType } from "../../../enum/payment";

const getClubJoiningUrl = catchAsync(async (req:Request, res:Response) => {
  const url = await ClubServices.getClubJoiningUrl(req.user!, req.query.PaymentMode as PaymentMode);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Club joining url generated successfully',
    data: url,
  })
})

const generateEventJoiningUrl = catchAsync(async (req:Request, res:Response) => {
  const { eventId, type } = req.query as { eventId: string, type: "meet" | "registration" | "both" };
  const url = await ClubServices.generateEventJoiningUrl(req.user!, eventId, type);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Event joining url generated successfully',
    data: url,
  })
})
export const ClubControllers = {
  getClubJoiningUrl,
  generateEventJoiningUrl,
}