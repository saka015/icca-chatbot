import React from 'react';
import Portal from './Portal';

const OptionsMenu = ({ isOpen, onClose, onDownload, onSave, position }) => {
  if (!isOpen) return null;
  
  return (
    <Portal>
      <div 
        className="fixed bg-white rounded-md shadow-lg py-1 z-[9999] options-menu"
        style={{
          top: position?.top || '80px',
          right: position?.right || '20px',
          width: '200px'
        }}
      >
        <button
          onClick={onDownload}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Download Transcript
        </button>
        <button
          onClick={onSave}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Save Chat
        </button>
      </div>
    </Portal>
  );
};

export default OptionsMenu; 