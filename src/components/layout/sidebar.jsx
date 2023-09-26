import React, { useState } from "react";

// assets
// import { logoImage } from "../../assets";

// react-icons
import { HiMenuAlt2 } from "react-icons/hi";
import { IoMdArrowDropright } from "react-icons/io";

// react router dom imports
import { useLocation, useNavigate } from "react-router-dom";

// helpers imports
import { useSelector } from "react-redux";
import {
  COMPANY_NAME,
  handleDarkThemeStyling,
  sidebarPageList,
} from "../../helpers/constants";

// sidebar links with their icons
const MenuLink = ({ name, route, accordionId, list, icon, shrinkBar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTheme = useSelector((state) => state.theme.value);

  // for showing sublinks
  const [showList, setShowList] = useState(
    location?.pathname?.includes(accordionId)
  );

  // for showing current link on the sidebar
  const activeRoute = location.pathname === route;

  // for opening accordion of the sublinks
  const activeAccordion = location?.pathname?.includes(accordionId);

  // change the current page
  const handleLink = () => {
    if (list) setShowList((prev) => !prev);
    else navigate(route);
  };

  return (
    <div className={`group capitalize`}>
      <div
        onClick={handleLink}
        className={`relative mb-1 flex cursor-pointer
          items-center rounded-l-full py-3 pl-3 pr-5  ${
            activeRoute || activeAccordion
              ? `text-skin-inverted ${handleDarkThemeStyling(
                  currentTheme,
                  "bg-skin-fill",
                  "bg-skin-fill-muted"
                )}`
              : `hover:text-white`
          }`}
      >
        {/* link icon */}
        <div className={`mr-4 text-2xl duration-200 ease-in`}>{icon}</div>

        {!shrinkBar && (
          <>
            {/*link name */}
            <p className={`flex-1 duration-200 ease-in`}>{name}</p>

            {/* only show arrows if no list */}
            {list && (
              <IoMdArrowDropright
                className={`text-2xl duration-500 ease-in-out ${
                  showList && "rotate-90"
                }`}
              />
            )}
          </>
        )}

        {/* corner styles */}
        {(activeRoute || activeAccordion) && (
          <>
            <div
              className={`absolute -top-5 right-0 h-5 w-5 bg-skin-fill after:absolute after:inset-0
                      after:rounded-br-full after:content-[''] ${handleDarkThemeStyling(
                        currentTheme,
                        "after:bg-custom-gradient",
                        "after:bg-skin-fill-inverted"
                      )}`}
            />
            <div
              className={`absolute -bottom-5 right-0 h-5 w-5 bg-skin-fill after:absolute after:inset-0
                      after:rounded-tr-full after:content-[''] ${handleDarkThemeStyling(
                        currentTheme,
                        "after:bg-custom-gradient",
                        "after:bg-skin-fill-inverted"
                      )}`}
            />
          </>
        )}
      </div>

      {/* sub menu list if available*/}
      {list && !shrinkBar && (
        <div
          className={`ml-12 overflow-hidden ${
            showList ? "open-linklist" : "close-linklist" //classes from index.css
          }`}
        >
          {list.map((data, i) => {
            const activeSubLink = location.pathname === data.route;
            return (
              <p
                className={`cursor-pointer px-1 py-2  text-sm duration-300 ease-in hover:text-white ${
                  activeSubLink && `text-white`
                }`}
                key={i}
                onClick={() => navigate(data.route)}
              >
                {data.name}
              </p>
            );
          })}
        </div>
      )}

      {/* show the list on hover on min sidebar (it's like tooltip)*/}
      {list && shrinkBar && (
        <div
          className={`absolute left-[77px] z-10 hidden min-w-[140px] -translate-y-10
             rounded-xl px-4 py-2 shadow-xl group-hover:block ${handleDarkThemeStyling(
               currentTheme,
               "bg-custom-gradient",
               "bg-skin-fill-inverted"
             )}`}
        >
          <div className="">
            {list.map((data, i) => {
              const activeSubLink = location.pathname === data.route;
              return (
                <p
                  className={`cursor-pointer px-1 py-2  text-sm duration-300 ease-in hover:text-white ${
                    activeSubLink && `text-white`
                  }`}
                  key={i}
                  onClick={() => navigate(data.route)}
                >
                  {data.name}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ currentTheme, shrinkBar, setShrinkBar }) => {
  const splitCompanyName = COMPANY_NAME.split(" ");

  return (
    <section
      className={`h-full 
    ${handleDarkThemeStyling(
      currentTheme,
      "bg-custom-gradient text-skin-muted",
      "bg-skin-fill-inverted"
    )}
      ${
        shrinkBar ? "min-sidebar-animation" : "sidebar-animation" //classes from index.css
      }`}
    >
      <div className={`my-5 ml-5 grid h-full grid-rows-[auto_1fr_auto]`}>
        {/* ========== top section ============ */}
        <section
          className={`mr-5 flex gap-1 items-center justify-between pb-14`}
        >
          {/* logo */}
          <div
            className={`flex items-center justify-center rounded-lg border-[2px] p-1`}
          >
            <div
              // src={logoImage}
              // alt="logo"
              className="h-8 w-8 rounded-full bg-black"
            />
          </div>

          {!shrinkBar && (
            <>
              {/* company name */}
              <div
                className={`flex flex-wrap justify-center line-clamp-1 gap-x-1 text-center text-xl font-semibold ${handleDarkThemeStyling(
                  currentTheme,
                  "text-white",
                  ""
                )}`}
              >
                {splitCompanyName.map((data, i) => {
                  return (
                    <span
                      key={i}
                      className={`${handleDarkThemeStyling(
                        currentTheme,
                        "first-letter:text-skin-inverted",
                        "first-letter:text-white"
                      )}`}
                    >
                      {data}
                    </span>
                  );
                })}
              </div>

              {/* expand button */}
              <HiMenuAlt2
                className={`cursor-pointer text-3xl duration-300 ease-in hover:text-white`}
                onClick={() => setShrinkBar(true)}
              />
            </>
          )}
        </section>

        {/* ==============  menu list ============= */}
        <section className={`overflow-y-auto pt-5 scrollbar-none`}>
          <div>
            {sidebarPageList.map((item, i) => {
              return <MenuLink {...item} key={i} shrinkBar={shrinkBar} />;
            })}
          </div>
        </section>

        {/*=========== copyright =========== */}
        {!shrinkBar && (
          <section
            className={`mb-20 mt-12 ${handleDarkThemeStyling(
              currentTheme,
              "text-white",
              ""
            )}`}
          >
            <h4 className={`text-lg font-semibold`}>{COMPANY_NAME}</h4>
            <p className={``}>© All Rights Reserved</p>
          </section>
        )}
      </div>
    </section>
  );
};

export default Sidebar;
