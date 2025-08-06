import React from 'react';
import Icon from '../icons/Icon';

function TestIconsPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">Customizable Icons with BaseIcon</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-gray-800 rounded-xl shadow-lg">
        {/* Home Icon - Default fill (currentColor from text-blue-400), custom size */}
        <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md text-blue-400">
          <Icon iconName="account_circle" size="6" className="mb-2" />
          <p className="text-lg">Home Icon size 6 (Large, Blue)</p>
        </div>
        {/* Home Icon - Default fill (currentColor from text-blue-400), custom size */}
        <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md">
          <Icon iconName="add_task"  className="mb-2" />
          <p className="text-lg">Home Icon size 8 (Large, Blue)</p>
        </div>
        {/* Home Icon - Default fill (currentColor from text-blue-400), custom size */}
        <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md">
          <Icon iconName="add_task"  className="mb-2" />
          <p className="text-lg">Home Icon size 12 (Large, Blue)</p>
        </div>
        {/* Home Icon - Default fill (currentColor from text-blue-400), custom size */}
        <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md">
          <Icon iconName="add_task"  size="16" className="mb-2" />
          <p className="text-lg">Home Icon size 16 (Large, Blue)</p>
        </div>
        {/* Right Arrow Icon - Default fill, custom size */}
        <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md">
          <Icon iconName="add_task"  size="8" className="mb-2" />
          <p className="text-lg">Right Icon (Medium, Green)</p>
        </div>

        {/* Cross Icon - Default fill, custom size */}
        <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md">
          <Icon iconName="add_task"  size="32px" className="mb-2" />
          <p className="text-lg">Cross Icon (Medium-Large, Red)</p>
        </div>

        {/* Home Icon - Custom fill (overrides currentColor), custom stroke */}
        <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md">
          <Icon
            iconName="add_task"
            fill="#FFD700" // Gold fill
            stroke="#8B4513" // SaddleBrown stroke
            strokeWidth="50" // Thicker stroke
            className="w-16 h-16 mb-2"
          />
          <p className="text-lg">Home Icon (Gold Fill, Brown Stroke)</p>
        </div>

        {/* Right Arrow Icon - Custom stroke, no fill */}
        <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md">
          <Icon
            iconName="add_task"
            fill="none" // No fill
            stroke="cyan"
            strokeWidth="80"
            
            className="mb-2"
          />
          <p className="text-lg">Right Icon (Cyan Stroke, No Fill)</p>
        </div>

        {/* Cross Icon - Custom size, default fill from Tailwind text-teal-400 */}
        <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md">
          <Icon iconName="add_task" className="w-20 h-20 text-teal-400 mb-2" />
          <p className="text-lg">Cross Icon (Very Large, Teal)</p>
        </div>

        {/* Example of an icon not found */}
        <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md">
          <Icon iconName="nonExistentIcon" color="gray-500" size="8" className="mb-2" />
          <p className="text-lg">Non-existent Icon (Check Console)</p>
        </div>

      </div>
    </div>
  );
}

export default TestIconsPage;