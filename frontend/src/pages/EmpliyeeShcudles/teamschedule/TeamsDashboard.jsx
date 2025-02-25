import { useState } from 'react';
import Mainmenu from './Mainmenu';
// import UserTeamsPage from './UserTeamsPage';
// import TeamManagement from './TeamManagement';

const TeamsDashboard = () => {
  const [activeTab, setActiveTab] = useState('myTeams');
  // const currentUserId = 'user123';

  const [isPopupVisible, setPopupVisible] = useState(false);


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

            {/* Placeholder for content */}
            <div className="bg-white p-6 rounded-lg shadow">
              {activeTab === 'myTeams' ? (
                <>
                  <p className='mb-8'>My Teams content will go here Create one </p>
                  <a
                    onClick={() => setPopupVisible(true)}
                    className="cursor-pointer rounded-lg inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-gray-900 text-white font-medium text-lg hover:rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out hover:from-blue-gray-300 hover:to-blue-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50"
                  >
                    Create Team
                  </a>
                </>
              ) : (
                <p>Create Team content will go here</p>
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