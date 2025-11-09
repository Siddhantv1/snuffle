import React, { useState, useCallback } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { Transition } from '@headlessui/react';

import { NotificationContext } from '../context/NotificationContext';

// This is the visual "toast" component
function Notification({ show, message, type, onClose }) {
  const isSuccess = type === 'success';

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 z-50 flex items-start px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={show}
          as={React.Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-2 ring-amber-500 ring-opacity-5 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {isSuccess ? (
                    <CheckCircle className="h-6 w-6 text-green-500" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    {isSuccess ? 'Success!' : 'Error'}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    type="button"
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 cursor-pointer"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}

// This is the main provider component that does all the work.
export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, show: false }));
  }, []);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type, show: true });

    setTimeout(() => {
      hideNotification();
    }, 3000);
  }, [hideNotification]);

  const value = { showNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
}
