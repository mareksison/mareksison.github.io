import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import CheckInObject from './CheckInObject';

export default function CheckInChart() {
  const { checkInsArray } = useSelector((state: RootState) => state.checkIn);

  /**
   * 
   * @param s - string to check if arr already has the subject
   * @param arr
   * @param x 
   * @return the index where the string is found or -1 if it can't be found
   */
  const compareCheckInsArr = (s, arr, x = 0) => {
    return s == arr[x].subject ? x : (x+1 >= arr.length ? -1 : compareCheckInsArr(s, arr, x+1));
  }

  /**
   * 
   * @param arr 
   * @param x 
   * @returns 
   */
  const createChartArr = (arr:CheckInObject[] = [], x = 0) => {
    const i = arr.length <= 0 ? -1 : compareCheckInsArr(checkInsArray[x].subject, arr);
    if (i >= 0) {
      arr[i].hours += checkInsArray[x].hours;
    } else {
      arr.push({...checkInsArray[x], notes: ""});
    }
    return x+1 >= checkInsArray.length ? arr : createChartArr(arr, x+1);
  };

  const checkInsChartData = React.useMemo(() => {
    return createChartArr();
  }, [checkInsArray]);

  return (
    <BarChart
      series={[
        { data: checkInsChartData.map(checkIn => checkIn.hours) },
      ]}
      height={290}
      xAxis={[{ data: checkInsChartData.map(checkIn => checkIn.subject), scaleType: 'band' }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
}
