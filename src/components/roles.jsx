import React from 'react';

const Roles = ({ count }) => {
  return (
    <div className="dashboard-item bodies-collected">
      <h3>Roles</h3>
      <p>
        Count: <span>{count}</span> 
        </p>
    </div>
  );
};

export default Roles;