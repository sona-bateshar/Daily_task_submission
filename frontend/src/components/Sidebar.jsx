import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isCollapsed, toggleSidebar, navigation, activeTab, setActiveTab }) => {
  return (
    <div
      className={`
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-background-dark 
        text-text-DEFAULT
        h-screen
        p-4
        transition-all
        duration-300
        ease-in-out
        flex
        flex-col
        shadow-card
        ${isCollapsed ? 'fixed sm:relative' : 'fixed sm:relative'}
        z-40
        ${isCollapsed ? '-translate-x-full sm:translate-x-0' : 'translate-x-0'}
        md:static md:translate-x-0
      `}
      style={{ fontFamily: 'var(--font-sans)' }} // Use custom font from theme
    >
      <div className="flex justify-between items-center mb-6">
        {!isCollapsed && (
          <h1 className="text-title font-heading text-primary-DEFAULT">App Logo</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-borderRadius-lg hover:bg-muted-light focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-text-DEFAULT"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-text-DEFAULT"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      <nav className="flex-grow">
        <ul>
          {navigation.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center
                  py-2
                  px-3
                  rounded-borderRadius-lg
                  text-text-DEFAULT
                  transition-colors
                  duration-200
                  ${isActive ? 'bg-primary-light text-white' : 'hover:bg-muted-light'}
                  ${isCollapsed ? 'justify-center' : ''}
                  font-sans text-base
                  `
                }
                onClick={() => setActiveTab(item.href)}
              >
                <item.icon className={`h-6 w-6 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Optional: User/Settings/Logout section at the bottom */}
      <div className="mt-auto pt-4 border-t border-muted-light">
        <ul>
          <li className="mb-2">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center
                py-2
                px-3
                rounded-borderRadius-lg
                text-text-DEFAULT
                transition-colors
                duration-200
                ${isActive ? 'bg-primary-light text-white' : 'hover:bg-muted-light'}
                ${isCollapsed ? 'justify-center' : ''}
                font-sans text-base
                `
              }
              onClick={() => setActiveTab('/settings')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${isCollapsed ? '' : 'mr-3'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.527.29 1.134.49 1.748.599z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {!isCollapsed && 'Settings'}
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;