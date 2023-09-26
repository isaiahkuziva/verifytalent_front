import React from 'react';

const Employees = ({ count }) => {
  return (
    <div className="dashboard-item bodies-collected">
      <h3>Employees</h3>
      <p>
        Count: <span>{count}</span> 
        </p>
    </div>
  );
};

export default Employees;