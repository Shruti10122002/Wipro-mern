import React from 'react';

const StatsCard = React.memo(({ title, value }) => {
  console.log(`${title} re-rendered`);
  return (
    <div className="card m-2 p-2">
      <h5>{title}</h5>
      <p>{value}</p>
    </div>
  );
});

export default StatsCard;
