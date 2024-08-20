import React, { createContext, useContext, useState, useEffect } from 'react';

// Crea il contesto
const TimeMachineContext = createContext();

// Hook personalizzato per accedere al contesto
export const useTimeMachine = () => useContext(TimeMachineContext);

// Provider del contesto
export const TimeMachineProvider = ({ children }) => {
  const [virtualTime, setVirtualTime] = useState(new Date());
  const [isRealTime, setIsRealTime] = useState(true);

  const travelInTime = (newDate) => {
    setIsRealTime(false);
    setVirtualTime(newDate);
  };

  const resetToRealTime = () => {
    setIsRealTime(true);
    setVirtualTime(new Date());
  };

  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setVirtualTime(new Date());
      }, 1000); // Aggiornamento ogni secondo
      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  return (
    <TimeMachineContext.Provider value={{ virtualTime, travelInTime, resetToRealTime }}>
      {children}
    </TimeMachineContext.Provider>
  );
};