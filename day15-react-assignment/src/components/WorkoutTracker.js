import { useState, useEffect, useRef } from "react";

export default function WorkoutTracker() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  const toggleTimer = () => setIsActive(prev => !prev);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  return (
    <div>
      <h2>Workout Timer: {seconds}s</h2>
      <button onClick={toggleTimer}>{isActive ? "Stop" : "Start"}</button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}
