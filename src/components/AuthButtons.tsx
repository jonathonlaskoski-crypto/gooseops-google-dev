import React from 'react';
import { useAuth } from './AuthProvider';

/**
 * Authentication Button Component
 *
 * Single sign-in for RetailDispense (Microsoft 365 Admin)
 * Sign in once, stay signed in forever - no more MFA prompts!
 */

export const AuthButtons: React.FC = () => {
  const {
    isRetailDispenseAuth,
    retailDispenseUser,
    loginRetailDispense,
    logoutRetailDispense,
  } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="text-sm font-semibold mb-2">M365 Admin Authentication</div>

      {/* RetailDispense Auth */}
      <div className="flex items-center gap-2">
        {isRetailDispenseAuth ? (
          <>
            <div className="flex-1">
              <div className="text-xs text-green-600 dark:text-green-400">
                ✓ Authenticated
              </div>
              <div className="text-xs text-gray-500 truncate max-w-[150px]">
                {retailDispenseUser?.username}
              </div>
            </div>
            <button
              onClick={logoutRetailDispense}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={loginRetailDispense}
            className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign in to Microsoft 365
          </button>
        )}
      </div>

      {/* Status */}
      {isRetailDispenseAuth && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
            ✓ Persistent auth active
          </div>
          <div className="text-xs text-gray-500 mt-1">
            No more sign-in prompts
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
