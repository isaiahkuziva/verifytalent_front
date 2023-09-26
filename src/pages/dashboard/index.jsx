import React from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Departments from "../../components/Departments";
import Employees from "../../components/Employees";
import Roles from "../../components/Roles";
import { reactSelectStyle } from "../../helpers/constants";

const animatedComponents = makeAnimated();

const Dashboard = () => {
  const currentTheme = useSelector((state) => state.theme.value);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  return (
    <>
      <div>Dashboard</div>
      <Select
        closeMenuOnSelect
        components={animatedComponents}
        options={options}
        styles={reactSelectStyle(currentTheme)}
      />
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
          <Employees count={10} />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
        <Roles count={8} />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
        <Departments count={5} />
        </div>

      </div> 
    </>
  );
};

export default Dashboard;
