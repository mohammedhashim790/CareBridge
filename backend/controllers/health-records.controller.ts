import type { Request, Response } from 'express';
import HealthRecords from '../models/health-records.model.ts';

// GET /api/health-records/my/all
export const getAllMyHealthRecords = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const records = await HealthRecords.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'My health records successfully fetched!',
      data: records,
    });
  } catch (error) {
    console.error('Error fetching health records:', error);
    
    return res.status(500).json({ 
      message: 'Error fetching my health records',
      error: error instanceof Error ? error.message : error,
    });
  }
}

// GET /api/health-records/my/today
export const getMyHealthRecordsForToday = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  try {
    const todayRecords = await HealthRecords.find({
      userId,
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    }).sort({ createdAt: -1 });

    if (todayRecords.length === 0) {
      return res.status(204).send();
    }

    return res.status(200).json({
      message: 'My health records for today successfully fetched!',
      data: todayRecords[0],
    });
  } catch (error) {
    console.error('Error fetching today\'s health records:', error);

    return res.status(500).json({ 
      message: 'Error creating health records',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// GET /api/health-records/my/blood
export const getMyBloodCountHistory = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const records = await HealthRecords.find({ 
      userId,
      bloodCount: { $exists: true }
    })
    .sort({ createdAt: 1 })
    .select('bloodCount createdAt')
    .limit(20);
    
    const chartData = records.map(record => {
      const createdDate = new Date(record.createdAt);
      return {
        // Swap the field names
        date: createdDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }), // Ex) 27 July 2025
        month: createdDate.toLocaleDateString('en-US', { month: 'long' }), // Ex) July (for x-axis)
        redBloodCells: record.bloodCount?.redBloodCells,
        whiteBloodCells: record.bloodCount?.whiteBloodCells,
      };
    });
    
    return res.status(200).json({
      message: 'Blood count history successfully fetched!',
      data: chartData,
    });
  } catch (error) {
    console.error('Error fetching blood count history:', error);

    return res.status(500).json({ 
      message: 'Error fetching blood count history',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// POST /api/health-records/my
export const createMyHealthRecords = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  try {
    // Check if a record for today already exists
    const existing = await HealthRecords.findOne({
      userId,
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    if (existing) {
      return res.status(409).json({
        message: 'Health record for today already exists.',
        data: existing,
      });
    }

    const { steps, sleep, operations, bloodCount } = req.body;

    const newRecord = new HealthRecords({
      userId,
      steps,
      sleep,
      operations,
      bloodCount,
    });

    await newRecord.save();

    return res.status(201).json({
      message: 'Health records successfully created!',
      data: newRecord,
    });
  } catch (error) {
    console.error('Error creating health record:', error);

    return res.status(500).json({ 
      message: 'Error creating health records',
      error: error instanceof Error ? error.message : error,
    });
  }
}

// DELTE /api/health-records/my/today
export const deleteMyHealthRecordForToday = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  try {
    const deleted = await HealthRecords.findOneAndDelete({
      userId,
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    if (!deleted) {
      return res.status(404).json({
        message: 'No health record found for today to delete.',
      });
    }

    return res.status(200).json({
      message: 'Today’s health record deleted successfully.',
      data: deleted,
    });
  } catch (error) {
    console.error('Error deleting today’s health record:', error);
    return res.status(500).json({
      message: 'Error deleting today’s health record.',
      error: error instanceof Error ? error.message : error,
    });
  }
};