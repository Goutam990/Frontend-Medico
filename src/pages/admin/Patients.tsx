import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { userApi } from '../../services/api';
import { Eye } from 'lucide-react';
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
    if (dataTableRef.current) {
      dataTableRef.current.destroy();
    }
    if (patients.length > 0 && tableRef.current) {
      dataTableRef.current = new DataTable(tableRef.current, {
        pageLength: 10,
        ordering: true,
        searching: true,
        responsive: true,
        destroy: true,
      });
    }
  }, [patients]);

  const loadPatients = async () => {
    try {
      const response = await userApi.getAll();
      const patientUsers = response.data.filter((user: User) => user.role === 'Patient');
      setPatients(patientUsers);
    } catch (error) {
      console.error('Error loading patients:', error);
      Swal.fire({
        icon: 'error',
        title: 'Loading Failed',
        text: 'Could not load patients from the server.',
      });
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Registered Patient List</h1>
          <p className="mt-2 text-gray-600">A list of all registered users with the "patient" role.</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="overflow-x-auto">
              {patients.length > 0 ? (
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
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${patient.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {patient.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button onClick={() => handleViewProfile(patient)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Profile">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No patients registered yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showProfileModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Patient Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600 transition">×</button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><p className="text-sm font-medium text-gray-500">Full Name</p><p className="text-lg text-gray-900">{`${selectedPatient.firstName} ${selectedPatient.lastName}`}</p></div>
              <div><p className="text-sm font-medium text-gray-500">Email</p><p className="text-lg text-gray-900">{selectedPatient.email}</p></div>
              <div><p className="text-sm font-medium text-gray-500">Phone</p><p className="text-lg text-gray-900">{selectedPatient.phone}</p></div>
              <div><p className="text-sm font-medium text-gray-500">Date of Birth</p><p className="text-lg text-gray-900">{new Date(selectedPatient.dob).toLocaleDateString()}</p></div>
              <div><p className="text-sm font-medium text-gray-500">Status</p><span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${selectedPatient.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{selectedPatient.isBlocked ? 'Blocked' : 'Active'}</span></div>
              <div><p className="text-sm font-medium text-gray-500">Registered On</p><p className="text-lg text-gray-900">{new Date(selectedPatient.createdAt).toLocaleDateString()}</p></div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <button onClick={() => setShowProfileModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}