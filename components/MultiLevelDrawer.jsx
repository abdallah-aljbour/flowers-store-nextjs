"use client";

import { X, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function MultiLevelDrawer({
  isOpen,
  onClose,
  levels,
  initialLevel = "main",
}) {
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [navHistory, setNavHistory] = useState([]);

  const navigateTo = (level) => {
    setNavHistory([...navHistory, currentLevel]);
    setCurrentLevel(level);
  };

  const goBack = () => {
    if (navHistory.length > 0) {
      const previousLevel = navHistory[navHistory.length - 1];
      setCurrentLevel(previousLevel);
      setNavHistory(navHistory.slice(0, -1));
    }
  };

  const resetNavigation = () => {
    setCurrentLevel(initialLevel);
    setNavHistory([]);
  };

  const handleClose = () => {
    resetNavigation();
    onClose();
  };

  if (!isOpen) return null;

  const DrawerHeader = ({ title, showBack }) => (
    <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={goBack}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-900" />
          </button>
        )}
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <button
        onClick={handleClose}
        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <X className="w-4 h-4 text-gray-900" />
      </button>
    </div>
  );

  const MenuItem = ({ icon, label, badge, onClick, showArrow = true }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3.5 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {badge !== undefined && badge !== "" && (
          <span className="bg-pandora-pink text-white px-2 py-0.5 rounded-full text-xs font-bold">
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        {showArrow && (
          <ChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
        )}
      </div>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose}>
      <div
        className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full">
          {Object.entries(levels).map(([levelKey, levelConfig]) => {
            const isActive = currentLevel === levelKey;
            const depth = levelConfig.depth || 0;

            return (
              <div
                key={levelKey}
                className={`absolute inset-0 bg-white transition-transform duration-300 ease-out ${
                  isActive
                    ? "translate-x-0"
                    : depth === 0
                    ? "-translate-x-full"
                    : "translate-x-full"
                }`}
              >
                <DrawerHeader
                  title={levelConfig.title}
                  showBack={
                    levelConfig.showBack !== false && navHistory.length > 0
                  }
                />

                <div
                  className={
                    levelConfig.scrollable !== false
                      ? "overflow-y-auto h-full pb-24"
                      : ""
                  }
                >
                  {typeof levelConfig.content === "function"
                    ? levelConfig.content({ navigateTo, goBack, MenuItem })
                    : levelConfig.content}
                </div>

                {levelConfig.footer && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
                    {typeof levelConfig.footer === "function"
                      ? levelConfig.footer({ navigateTo, goBack })
                      : levelConfig.footer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
