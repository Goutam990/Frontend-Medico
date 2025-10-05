import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { patientApi } from '../../services/api';
import { Eye, Trash2 } from 'lucide-react';
import type { User } from '../../types';
import Swal from 'sweetalert2';
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';

export default function Patients() {
  const [patients, setPatients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (patients.length > 0 && tableRef.current && !dataTableRef.current) {
      dataTableRef.current = new DataTable(tableRef.current, {
        pageLength: 10,
        ordering: true,
        searching: true,
        responsive: true,
      });
    }

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [patients]);

  const loadPatients = async () => {
    try {
      const response = await patientApi.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (patient: User) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Patient',
      text: `Are you sure you want to delete ${patient.username}? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
    });

    if (result.isConfirmed) {
      try {
        await patientApi.delete(patient.id);
        Swal.fire({
          icon: 'success',
          title: 'Patient Deleted',
          text: `${patient.username} has been deleted successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
        loadPatients();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Operation Failed',
          text: error.response?.data?.message || 'Failed to delete patient.',
        });
      }
    }
  };

  const handleViewProfile = (patient: User) => {
    setSelectedPatient(patient);
    setShowProfileModal(true);
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

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="mt-2 text-gray-600">View and manage all registered patients</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table ref={tableRef} className="display w-full">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.username}</td>
                      <td>{patient.email}</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewProfile(patient)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(patient)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Patient"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showProfileModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Patient Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-lg text-gray-900">{selectedPatient.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg text-gray-900">{selectedPatient.email}</p>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}