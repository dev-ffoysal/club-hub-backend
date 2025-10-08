import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IAdvertisementFilterables, IAdvertisement, ADVERTISEMENT_STATUS } from './advertisement.interface';
import { Advertisement } from './advertisement.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { advertisementSearchableFields } from './advertisement.constants';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import { USER_ROLES } from '../../../enum/user';

const createAdvertisement = async (
  user: JwtPayload,
  payload: IAdvertisement
): Promise<IAdvertisement> => {
  // Only super admins can create advertisements
  if (user.role !== USER_ROLES.SUPER_ADMIN) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only super admins can create advertisements'
    );
  }

  // Validate dates
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);
  
  if (startDate >= endDate) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'End date must be after start date'
    );
  }

  // If club is specified, validate it exists and is a club
  if (payload.club) {
    const club = await User.findById(payload.club);
    if (!club || club.role !== USER_ROLES.CLUB) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Invalid club specified'
      );
    }
  }

  // Set the creator
  payload.createdBy = new Types.ObjectId(user.userId);
  
  // Auto-approve if created by super admin
  payload.approvedBy = new Types.ObjectId(user.userId);
  payload.approvedAt = new Date();

  const result = await Advertisement.create(payload);
  return result;
};

const getAllAdvertisements = async (
  user: JwtPayload,
  filters: IAdvertisementFilterables,
  paginationOptions: IPaginationOptions
) => {
  // Only super admins can view all advertisements
  if (user.role !== USER_ROLES.SUPER_ADMIN) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only super admins can view all advertisements'
    );
  }

  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search term condition
  if (searchTerm) {
    andConditions.push({
      $or: advertisementSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filter conditions
  Object.entries(filterData).forEach(([field, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (field === 'startDate' || field === 'endDate') {
        andConditions.push({ [field]: new Date(value as string) });
      } else if (field === 'universities' || field === 'departments' || field === 'tags') {
        andConditions.push({ [field]: { $in: Array.isArray(value) ? value : [value] } });
      } else {
        andConditions.push({ [field]: value });
      }
    }
  });

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  } else {
    sortConditions.priority = -1;
    sortConditions.createdAt = -1;
  }

  const result = await Advertisement.find(whereConditions)
    .populate('createdBy', 'name email')
    .populate('approvedBy', 'name email')
    .populate('club', 'name clubName email')
    .populate('universities', 'name')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Advertisement.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleAdvertisement = async (
  user: JwtPayload,
  id: string
): Promise<IAdvertisement | null> => {
  // Only super admins can view individual advertisements
  if (user.role !== USER_ROLES.SUPER_ADMIN) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only super admins can view advertisements'
    );
  }

  const result = await Advertisement.findById(id)
    .populate('createdBy', 'name email')
    .populate('approvedBy', 'name email')
    .populate('club', 'name clubName email')
    .populate('universities', 'name');

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Advertisement not found');
  }

  return result;
};

const updateAdvertisement = async (
  user: JwtPayload,
  id: string,
  payload: Partial<IAdvertisement>
): Promise<IAdvertisement | null> => {
  // Only super admins can update advertisements
  if (user.role !== USER_ROLES.SUPER_ADMIN) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only super admins can update advertisements'
    );
  }

  const advertisement = await Advertisement.findById(id);
  if (!advertisement) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Advertisement not found');
  }

  // Validate dates if provided
  if (payload.startDate || payload.endDate) {
    const startDate = new Date(payload.startDate || advertisement.startDate);
    const endDate = new Date(payload.endDate || advertisement.endDate);
    
    if (startDate >= endDate) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'End date must be after start date'
      );
    }
  }

  // If club is being updated, validate it
  if (payload.club) {
    const club = await User.findById(payload.club);
    if (!club || club.role !== USER_ROLES.CLUB) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Invalid club specified'
      );
    }
  }

  const result = await Advertisement.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('createdBy', 'name email')
    .populate('approvedBy', 'name email')
    .populate('club', 'name clubName email')
    .populate('universities', 'name');

  return result;
};

const deleteAdvertisement = async (
  user: JwtPayload,
  id: string
): Promise<IAdvertisement | null> => {
  // Only super admins can delete advertisements
  if (user.role !== USER_ROLES.SUPER_ADMIN) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only super admins can delete advertisements'
    );
  }

  const advertisement = await Advertisement.findById(id);
  if (!advertisement) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Advertisement not found');
  }

  // Soft delete by updating status
  const result = await Advertisement.findByIdAndUpdate(
    id,
    { status: ADVERTISEMENT_STATUS.DELETED },
    { new: true }
  );

  return result;
};

// Public methods for displaying ads
const getActiveAdvertisements = async (
  position?: string,
  limit: number = 10
): Promise<IAdvertisement[]> => {
  const now = new Date();
  const query: any = {
    status: ADVERTISEMENT_STATUS.ACTIVE,
    startDate: { $lte: now },
    endDate: { $gte: now }
  };

  if (position) {
    query.position = position;
  }

  const result = await Advertisement.find(query)
    .populate('club', 'name clubName profile')
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .select('-createdBy -approvedBy -notes -budget -costPerClick');

  return result;
};

const getAdvertisementsByPosition = async (
  position: string,
  limit: number = 5
): Promise<IAdvertisement[]> => {
  return getActiveAdvertisements(position, limit);
};

const trackImpression = async (id: string): Promise<void> => {
  const advertisement = await Advertisement.findById(id);
  if (!advertisement) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Advertisement not found');
  }

  if (advertisement.status === ADVERTISEMENT_STATUS.ACTIVE) {
    await Advertisement.findByIdAndUpdate(advertisement._id, { $inc: { impressions: 1 } });
  }
};

const trackClick = async (id: string): Promise<void> => {
  const advertisement = await Advertisement.findById(id);
  if (!advertisement) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Advertisement not found');
  }

  if (advertisement.status === ADVERTISEMENT_STATUS.ACTIVE) {
    await Advertisement.findByIdAndUpdate(advertisement._id, { $inc: { clicks: 1 } });
  }
};

const getAdvertisementStats = async (
  user: JwtPayload,
  id: string
): Promise<any> => {
  // Only super admins can view stats
  if (user.role !== USER_ROLES.SUPER_ADMIN) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only super admins can view advertisement statistics'
    );
  }

  const advertisement = await Advertisement.findById(id);
  if (!advertisement) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Advertisement not found');
  }

  const ctr = advertisement.impressions > 0 
    ? (advertisement.clicks / advertisement.impressions) * 100 
    : 0;

  const totalCost = advertisement.costPerClick 
    ? advertisement.clicks * advertisement.costPerClick 
    : 0;

  return {
    id: advertisement._id,
    title: advertisement.title,
    impressions: advertisement.impressions,
    clicks: advertisement.clicks,
    ctr: parseFloat(ctr.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    budget: advertisement.budget || 0,
    remainingBudget: advertisement.budget ? advertisement.budget - totalCost : null,
    status: advertisement.status,
    startDate: advertisement.startDate,
    endDate: advertisement.endDate
  };
};

export const AdvertisementServices = {
  createAdvertisement,
  getAllAdvertisements,
  getSingleAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getActiveAdvertisements,
  getAdvertisementsByPosition,
  trackImpression,
  trackClick,
  getAdvertisementStats
};