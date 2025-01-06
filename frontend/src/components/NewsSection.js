import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const NewsSection = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="border-b pb-3 mb-6">
        <h2 className="text-2xl font-bold">News Categories</h2>
        <div className="flex gap-4 mt-4">
          <NavLink
            to="/news/all"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 font-semibold' : ''
              }`
            }
          >
            All News
          </NavLink>
          <NavLink
            to="/news/company"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 font-semibold' : ''
              }`
            }
          >
            Company News
          </NavLink>
          <NavLink
            to="/news/market"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 font-semibold' : ''
              }`
            }
          >
            Stock Market News
          </NavLink>
          <NavLink
            to="/news/corporate"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 font-semibold' : ''
              }`
            }
          >
            Corporate News
          </NavLink>
        </div>
      </div>

      {/* Display the child route content */}
      <Outlet />
    </div>
  );
};

export default NewsSection;
