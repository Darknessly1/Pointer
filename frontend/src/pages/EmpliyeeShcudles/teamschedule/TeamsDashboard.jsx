/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import Mainmenu from './Mainmenu';


const TeamsDashboard = () => {
  const [activeTab, setActiveTab] = useState('myTeams');

  const [isPopupVisible, setPopupVisible] = useState(false);

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:9000/api/team/getTeams');

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setTeams(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  return (
    <>
      <div className="flex justify-center">
        <a
          href='/schedulestable'
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium text-lg rounded-lg hover:rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out hover:from-blue-gray-300 hover:to-blue-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          Try The Individual Schedule
        </a>
      </div >
      <div className="flex justify-center items-center p-4">
        <div className='flex flex-col bg-gray-200 rounded-3xl max-w-screen-lg w-full mx-auto shadow-lg'>
          <header className="shadow bg-white rounded-t-3xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-bold text-gray-900">Teams Dashboard</h1>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('myTeams')}
                  className={`${activeTab === 'myTeams'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  My Teams
                </button>
                <button
                  onClick={() => setActiveTab('createTeam')}
                  className={`${activeTab === 'createTeam'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Test
                </button>
              </nav>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              {activeTab === 'myTeams' ? (
                <>
                  {loading ? (
                    <p className="text-gray-500 text-center">Loading teams...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px] max-h-[400px] overflow-y-auto">
                      {teams.length > 0 ? (
                        teams.map((team) => (
                          <div key={team._id} className="bg-blue-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-blue-800">{team.teamsName}</h3>
                            <p className="text-gray-600">Leader: {team.teamsLeadersName}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 col-span-3 text-center">No teams found</p>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => setPopupVisible(true)}
                    className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
                  >
                    + Create Team
                  </button>
                </>
              ) : (
                <p className="text-gray-500">Create Team content will go here</p>
              )}
            </div>

          </main>
        </div>
      </div>
      {isPopupVisible && (
        <Mainmenu
          setPopupVisible={setPopupVisible}
        />
      )}
    </>

  );
};

export default TeamsDashboard;