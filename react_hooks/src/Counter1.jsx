import React, { useState, useEffect } from "react";

export default function Counter1() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div style={{ padding: 20 }}>
      <h2>React Hooks Demo</h2>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </div>
  );
}
