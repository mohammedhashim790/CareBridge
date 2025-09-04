import type { Request, Response } from 'express';
import BioMarkersSchema from '../models/bioMarkers.model.ts';

export const createBioMarkers = async (req: Request, res: Response) => {
  try {
    const item = req.body;

    item.patientId = req.user?.id;

    const existing = await BioMarkersSchema.findOne({
      patientId: item.patientId,
    }).lean();
    const bioMarker = new BioMarkersSchema(item);
    if (existing) {
      const resp = await BioMarkersSchema.findByIdAndUpdate(existing._id, item);
      res
        .status(201)
        .json({ message: 'Bio Marker created successfully', result: existing });
    } else {
      await bioMarker.save();
      res.status(201).json({
        message: 'Bio Marker created successfully',
        result: bioMarker,
      });
    }
  } catch (error) {
    console.log('Error creating Bio Marker:', error);
    res.status(500).json({ message: 'One or more fields are missing' });
  }
};

export const getBioMarkerOfByPatientId = async (
  req: Request,
  res: Response
) => {
  try {
    let id = req.user?.id;
    if (req.params.patientId) {
      id = req.params.patientId;
    }

    let bioMarker: any = await BioMarkersSchema.findOne({
      patientId: id,
    }).lean();
    res.status(200).json({ result: bioMarker ?? {} });
  } catch (error) {
    // @ts-ignore
    console.log('Error fetching Bio Markers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
