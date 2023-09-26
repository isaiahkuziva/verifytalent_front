import React from 'react';

const Departments = ({ count }) => {
  return (
    <div className="dashboard-item bodies-collected">
      <h3>Departments</h3>
      <p>
        Count: <span>{count}</span> 
        </p>
    </div>
  );
};

export default Departments;