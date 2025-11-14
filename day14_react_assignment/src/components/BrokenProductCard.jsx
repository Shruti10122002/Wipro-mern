import React, { useState } from 'react';

const BrokenProductCard = () => {
  const [crash, setCrash] = useState(false);

  if (crash) throw new Error("Simulated component crash!");

  return (
    <div className="card p-2 m-2">
      <h5>Product Card</h5>
      <button className="btn btn-danger" onClick={() => setCrash(true)}>Cause Error</button>
    </div>
  );
};

export default BrokenProductCard;
