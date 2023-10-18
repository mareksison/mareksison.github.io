import { Dayjs } from 'dayjs';

export interface CheckIn {
    id: number,
    userId: number,
    hrs: number,
    tag: string,
    checkinText: string,
    checkinDate: Dayjs,
    timestamp: Dayjs
  }
  
export interface CheckInAPIResponse {
    results: CheckIn[]
  }