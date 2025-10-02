import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { patientApi } from '../../services/api';
import { Users, Search, MoreVertical, Eye, Ban, CheckCircle } from 'lucide-react';
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
      setPatients(response.data.data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBlock = async (patient: User) => {
    const action = patient.isBlocked ? 'unblock' : 'block';
    const result = await Swal.fire({
      icon: 'warning',
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Patient`,
      text: `Are you sure you want to ${action} ${patient.firstName} ${patient.lastName}?`,
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: patient.isBlocked ? '#10B981' : '#EF4444',
    });

    if (result.isConfirmed) {
      try {
        await patientApi.toggleBlock(patient.id);
        Swal.fire({
          icon: 'success',
          title: `Patient ${action}ed`,
          text: `${patient.firstName} ${patient.lastName} has been ${action}ed successfully`,
          timer: 2000,
          showConfirmButton: false,
        });
        loadPatients();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Operation Failed',
          text: error.response?.data?.message || `Failed to ${action} patient`,
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>DOB</th>
                    <th>Status</th>
                    <th>Registered On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{`${patient.firstName} ${patient.lastName}`}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phone}</td>
                      <td>{new Date(patient.dob).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            patient.isBlocked
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {patient.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
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
                            onClick={() => handleToggleBlock(patient)}
                            className={`p-2 rounded-lg transition ${
                              patient.isBlocked
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                            title={patient.isBlocked ? 'Unblock' : 'Block'}
                          >
                            {patient.isBlocked ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Ban className="h-4 w-4" />
                            )}
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Patient Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                {selectedPatient.profilePic ? (
                  <img
                    src={selectedPatient.profilePic}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-10 w-10 text-blue-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedPatient.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{selectedPatient.phone}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">
                    {new Date(selectedPatient.dob).toLocaleDateString()}
                  </p>
                </div>

                {selectedPatient.gender && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="text-gray-900">{selectedPatient.gender}</p>
                  </div>
                )}

                {selectedPatient.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{selectedPatient.address}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedPatient.isBlocked
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {selectedPatient.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Registered On</p>
                  <p className="text-gray-900">
                    {new Date(selectedPatient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-4">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleToggleBlock(selectedPatient);
                  setShowProfileModal(false);
                }}
                className={`px-6 py-2 rounded-lg text-white transition ${
                  selectedPatient.isBlocked
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {selectedPatient.isBlocked ? 'Unblock Patient' : 'Block Patient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
