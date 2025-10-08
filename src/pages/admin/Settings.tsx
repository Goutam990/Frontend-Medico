import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { settingsApi } from '../../services/api';
import { Clock, Save } from 'lucide-react';
import type { WorkingHours } from '../../types';
import Swal from 'sweetalert2';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function Settings() {
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsApi.getWorkingHours();
      setWorkingHours(response.data);
    } catch (error) {
      console.error('Error loading settings:', error);
      setWorkingHours(
        daysOfWeek.map((day) => ({
          day,
          isAvailable: false,
          startTime: '09:00',
          endTime: '17:00',
          slotDuration: 30,
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDay = (index: number) => {
    const updated = [...workingHours];
    updated[index].isAvailable = !updated[index].isAvailable;
    setWorkingHours(updated);
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const updated = [...workingHours];
    updated[index][field] = value;
    setWorkingHours(updated);
  };

  const handleSlotDurationChange = (index: number, value: number) => {
    const updated = [...workingHours];
    updated[index].slotDuration = value;
    setWorkingHours(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await settingsApi.updateWorkingHours(workingHours);
      Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Your working hours have been updated successfully',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: error.response?.data?.message || 'Failed to save settings',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your working hours and availability</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Working Hours</h2>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Set your availability for patient bookings
            </p>
          </div>

          <div className="p-6 space-y-6">
            {workingHours.map((dayConfig, index) => (
              <div key={dayConfig.day} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dayConfig.isAvailable}
                      onChange={() => handleToggleDay(index)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-lg font-semibold text-gray-900">
                      {dayConfig.day}
                    </span>
                  </label>
                  {!dayConfig.isAvailable && (
                    <span className="text-sm text-red-600 font-medium">Unavailable</span>
                  )}
                </div>

                {dayConfig.isAvailable && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={dayConfig.startTime}
                        onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={dayConfig.endTime}
                        onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slot Duration (minutes)
                      </label>
                      <select
                        value={dayConfig.slotDuration}
                        onChange={(e) =>
                          handleSlotDurationChange(index, parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Important Notes:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Changes to working hours will affect new patient bookings immediately</li>
            <li>Existing bookings will not be affected by these changes</li>
            <li>Patients can only book appointments during your available hours</li>
            <li>Slot duration determines the time intervals for appointments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
