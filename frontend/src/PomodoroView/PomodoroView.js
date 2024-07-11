import React, { useState, useEffect } from 'react';
import PomodoroStandard from'../PomodoroStandard/PomodoroStandard';
import Timers from '../Timers/Timers';

const PomodoroView = () => {
   const [cicles, setCicles] = useState(0);
 
   const handleFormSubmit = (cicles) => { //prende il numero di cili da PomodoroStandard
     setCicles(cicles);
   };
 
   return (
     <div>
       <PomodoroStandard onSubmit={handleFormSubmit} />
     </div>
   );
 };
 
 export default PomodoroView;