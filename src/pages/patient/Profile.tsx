import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { User as UserIcon, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Your personal information</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-gray-600">{formData.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="inline h-4 w-4 mr-2" />
                  First Name
                </label>
                <p className="w-full px-4 py-2 bg-gray-100 rounded-lg">{formData.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="inline h-4 w-4 mr-2" />
                  Last Name
                </label>
                <p className="w-full px-4 py-2 bg-gray-100 rounded-lg">{formData.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email
                </label>
                <p className="w-full px-4 py-2 bg-gray-100 rounded-lg">{formData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="inline h-4 w-4 mr-2" />
                  Role
                </label>
                <p className="w-full px-4 py-2 bg-gray-100 rounded-lg">{formData.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}