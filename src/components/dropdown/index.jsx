import { ClickAwayListener } from "@mui/base";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Dropdown = ({
  placeholder,
  onChange,
  list = [],
  className,
  iconClassName,
  menuClassName,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(placeholder);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const getValue = (value) => {
    onChange(value);
    handleClickAway();
    setSelected(value);
  };

  const getValue2 = (value) => {
    handleClickAway();
    setSelected("Unselected");
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={`relative capitalize ${className}`}>
        <div
          onClick={handleClick}
          className={`flex cursor-pointer items-center justify-between px-4 py-2`}
        >
          <span className="line-clamp-1">{selected}</span>
          <div className={iconClassName}>
            {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </div>
        </div>

        {/* menu */}
        {open && (
          <div
            className={`absolute left-0 right-0 top-[110%] z-10 overflow-hidden rounded-xl bg-white text-color-gray drop-shadow-lg ${menuClassName}`}
          >
            {list.map((data, i) => {
              if (data === null)
                return (
                  <p
                    key={i}
                    onClick={() => getValue2(data)}
                    className={`cursor-pointer px-4 py-3 text-sm duration-500 ease-in-out hover:bg-color-fill-muted`}
                  >
                    Unselect
                  </p>
                );

              return (
                <p
                  key={i}
                  onClick={() => getValue(data)}
                  className={`cursor-pointer px-4 py-3 text-sm duration-500 ease-in-out hover:bg-color-fill-muted`}
                >
                  {data}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default Dropdown;
