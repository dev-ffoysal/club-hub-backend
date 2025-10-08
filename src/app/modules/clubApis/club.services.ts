import { JwtPayload } from "jsonwebtoken";
import QRCode from 'qrcode';
import { PaymentMode } from "../../../enum/payment";
import { Event } from "../event/event.model";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { User } from "../user/user.model";
import mongoose from "mongoose";

const getClubJoiningUrl = async (user:JwtPayload, PaymentMode:PaymentMode) => {

    const club = await User.findById(new mongoose.Types.ObjectId(user.authId)).lean();
    if(!club){
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Sorry something went wrong, please try again later."
      );
    }

  const {_id:clubId,clubName} = club;
  const slug = clubName?.trim().replace(/\s+/g, "-").toLowerCase();

  const url = `http://localhost:3000/clubs/join?clubId=${clubId}&slug=${slug}`;
  //also generate and return qr code using qrcode library
  const qrCode = await QRCode.toDataURL(url);
  return {
    url,
    qrCode,
  }

}



const generateEventJoiningUrl = async (
  user: JwtPayload,
  eventId: string,
  type: "meet" | "registration" | "both"
) => {
  const event = await Event.findById(eventId).lean();
  if (!event) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "The event you are trying to join does not exist."
    );
  }

  if (event.createdBy?.toString() !== user.authId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to join this event."
    );
  }

  const { title, registrationFee, isOnline, meetingLink } = event;

  // create slug safely (replace multiple spaces & trim)
  const slug = title.trim().replace(/\s+/g, "-").toLowerCase();

  let registrationUrl = "";
  let meetUrl = "";

  // Assume frontend routes look like: /event/:id/:slug/join
  if (type === "registration" || type === "both") {
    registrationUrl = `http://localhost:3000/event/${eventId}/register`;
  }

  if ((type === "meet" || type === "both") && isOnline && meetingLink) {
    meetUrl = meetingLink.startsWith("http")
      ? meetingLink
      : `http://${meetingLink}`;
  }

  // Generate QR codes if needed
  const registrationQr = registrationUrl
    ? await QRCode.toDataURL(registrationUrl)
    : null;
  const meetQr = meetUrl ? await QRCode.toDataURL(meetUrl) : null;

  return {
    eventId,
    slug,
    type,
    registration: registrationUrl
      ? { url: registrationUrl, qr: registrationQr, fee: registrationFee }
      : null,
    meeting: meetUrl ? { url: meetUrl, qr: meetQr } : null,
  };
};

export default generateEventJoiningUrl;





export const ClubServices = {
  getClubJoiningUrl,
  generateEventJoiningUrl,
}
