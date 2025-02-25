import { useState } from 'react';
// import UserTeamsPage from './UserTeamsPage';
// import TeamManagement from './TeamManagement';

const TeamsDashboard = () => {
  const [activeTab, setActiveTab] = useState('myTeams');
  // const currentUserId = 'user123';

  return (
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

          <button>
            <a href="/mainmenu" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Create Team
            </a>
          </button>
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
                Create New Team
              </button>
            </nav>
          </div>

          {/* Placeholder for content */}
          <div className="bg-white p-6 rounded-lg shadow">
            {activeTab === 'myTeams' ? (
              <p>My Teams content will go here</p>
            ) : (
              <p>Create Team content will go here</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamsDashboard;