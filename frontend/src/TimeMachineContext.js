import React, { createContext, useContext, useState, useEffect, useRef } from 'react'; 

const TimeMachineContext = createContext();

//per accedere al contesto
export const useTimeMachine = () => useContext(TimeMachineContext);

export const TimeMachineProvider = ({ children }) => {
  const [virtualTime, setVirtualTime] = useState(new Date());
  const [isRealTime, setIsRealTime] = useState(true);
  const [offset, setOffset] = useState(0); //differenza tra tempo reale e tempo virtuale
  const intervalRef = useRef(null); // Per memorizzare il riferimento all'intervallo

  // Funzione per calcolare l'ora virtuale aggiornata
  const updateVirtualTime = () => {
    setVirtualTime(new Date(Date.now() + offset)); //il tempo virtuale lo calcolo facendo ADESSO+OFFSET, 
                                                   //  così, quando cambia ADESSO, cambio anche il virtuale (serve per far scorrere il tempo)
  };
  
  const travelInTime = (newDate) => {
    setIsRealTime(false);
    const newOffset = newDate.getTime() - Date.now(); //calcolo l'offset
    setOffset(newOffset);
  };


  const resetToRealTime = () => {
    setIsRealTime(true);
    setOffset(0); 
    setVirtualTime(new Date()); 
  };

  useEffect(() => { //eseguito ogni qual volta cambia isRealTime oppure cambio l'offset
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isRealTime) {
      intervalRef.current = setInterval(() => {
        setVirtualTime(new Date());
      }, 1000); //aggiorno ogni secondo
    } else {
      //aggiorna ogni secondo, ma con l'offset
      intervalRef.current = setInterval(updateVirtualTime, 1000);
    }

    return () => clearInterval(intervalRef.current); //quando smonto
  }, [isRealTime, offset]);

  return (
    <TimeMachineContext.Provider value={{ virtualTime, travelInTime, resetToRealTime }}>
      {children}
    </TimeMachineContext.Provider>
  );
};