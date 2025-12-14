// src/layouts/AuthLayout.tsx

import { Hotel, Link } from "lucide-react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Hotel className="h-12 w-12 text-indigo-600" />
            <span className="text-3xl font-bold text-gray-900">Phoenix Hotels</span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Outlet />
        </div>
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export { AuthLayout };