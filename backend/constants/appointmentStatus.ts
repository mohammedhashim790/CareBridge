export const AppointmentStatusList = ['scheduled', 'completed', 'cancelled'] as const;

export type AppointmentStatus = typeof AppointmentStatusList[number];