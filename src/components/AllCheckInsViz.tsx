import { useState, useEffect } from 'react';

import { BarChart } from '@mui/x-charts';

export default function AllCheckInsViz(props:any){
  const { retrievedCheckIns } = props;
  const [ state, setState ] = useState({
    labels: [''],
    series: [{data:[0]}]
  });

  const handleSeries = () => {
    let rawCollection:any = {};
    let orderedCollection:any[] = [];
    let newSeries = [];
    let newLabels = [];

    // sums of hours are now collected in rawCollection
    for ( let x = 0 ; x < retrievedCheckIns.length ; x++ ){
      if (!rawCollection[retrievedCheckIns[x].tag]){
        rawCollection[retrievedCheckIns[x].tag] = 0;
      }
      rawCollection[retrievedCheckIns[x].tag] += retrievedCheckIns[x].hrs;
    }

    // push into the array orderedCollection
    Object.keys(rawCollection).forEach(function(key, index) {
      orderedCollection.push({name:key, amount:rawCollection[key]});
    });

    // time to sort
    orderedCollection.sort(function(a, b){return b.amount - a.amount});

    // push into newSeries and newLabels
    for ( let x = 0 ; (x < 5) && (x < orderedCollection.length) ; x++ ){
      newLabels.push(orderedCollection[x].name);
      newSeries.push(orderedCollection[x].amount);
    }
    
    setState({
      labels: newLabels,
      series: [{
        data: newSeries
      }]
    });
  }

  useEffect(
    handleSeries, [retrievedCheckIns]
  );

  return (
    <BarChart
      xAxis={[
        {
          id: 'topCheckinTags',
          data: state.labels,
          scaleType: 'band',
        }
      ]}
      series={state.series}
      height={390}
      sx={{
        position: 'relative',
        left:'50%',
        top:'0%',
        transform: 'translate(-50%, 0)',
        margin: '0 1vw 5vh 5vw',
      }}
    />
  );
}