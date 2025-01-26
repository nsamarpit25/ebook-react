import { FC } from 'react';

const NoConnection: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Unable to Connect to Database
        </h1>
        <p className="text-gray-600 mb-6">
          We're having trouble connecting to our servers. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
};

export default NoConnection;
