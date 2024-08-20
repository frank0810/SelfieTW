import React, { useEffect } from 'react';
import { useTimeMachine } from '../TimeMachineContext';

const TimeMachineTest = () => {
  const { virtualTime } = useTimeMachine();

  useEffect(() => {
    console.log(virtualTime);
  }, [virtualTime]); // La dipendenza è virtualTime, cioè lo fa ogni volta che cambia virtualTime

  
  return (
    <div>
      <p>Adesso è il {virtualTime.toLocaleDateString()} ore {virtualTime.toLocaleTimeString()}</p>
    </div>
  );
};

export default TimeMachineTest;