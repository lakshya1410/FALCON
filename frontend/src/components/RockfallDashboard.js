import React, { useState } from 'react';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MapSection from './MapSection';

const RockfallDashboard = () => {
  const [activeTab, setActiveTab] = useState('Command Center');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex h-screen pt-24">
        {/* Left Sidebar */}
        <div className="w-80 bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-r border-orange-500/20 overflow-y-auto backdrop-blur-sm">
          <LeftSidebar />
        </div>

        {/* Main Map Section */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 relative">
          <MapSection />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-l border-orange-500/20 overflow-y-auto backdrop-blur-sm">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default RockfallDashboard;
