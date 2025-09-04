import type { Request, Response, RequestHandler, NextFunction } from 'express';
import Meeting from '../models/meeting.model.ts';
import { generateVideoSDKToken } from '../utils/videosdkToken.ts';

export const scheduleMeeting = async ({
  userId,
  scheduledTime,
}: {
  userId: string;
  scheduledTime: string;
}): Promise<{ message: string; meeting: any }> => {
  try {
    const token = generateVideoSDKToken();

    const response = await fetch("https://api.videosdk.live/v2/rooms", {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("VideoSDK API error:", errorData);
      throw new Error("VideoSDK API call failed");
    }

    const data = await response.json();
    const meetingId = data.roomId;

    const meeting = new Meeting({
      userId,
        _id: meetingId,
      scheduledTime,
      token,
    });

    await meeting.save();

    return {
      message: "Meeting scheduled",
      meeting,
    };
  } catch (error) {
    console.error("Failed to schedule meeting:", error);
    throw error;
  }
};


export const getMeetingByTime: RequestHandler = async (req, res) => {
  try {
    const { time } = req.params;
    const meeting = await Meeting.findOne({ scheduledTime: new Date(time) });

    if (!meeting) {
      res.status(404).json({ message: "No meeting found for this time" });
      return;
    }

    res.json(meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching meeting" });
  }
};
