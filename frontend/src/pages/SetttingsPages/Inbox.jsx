import ComposeEmail from "./ComposeEmail";
import EmailList from "./EmailList";

const Inbox = () => {
    const userId = localStorage.getItem('authToken');

    if (!userId) {
        console.error("Token is missing or invalid");
        return;
    }

    if (!userId) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-lg text-gray-700">Please log in to access the email system.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="space-y-10">
                <ComposeEmail />
                <EmailList />
            </div>
        </div>
    );  
};

export default Inbox;