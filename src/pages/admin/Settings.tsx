import Navbar from '../../components/Navbar';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          This feature is currently not supported by the backend API.
        </p>
      </div>
    </div>
  );
}