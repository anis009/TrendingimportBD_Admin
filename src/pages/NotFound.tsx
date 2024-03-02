import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Oops!</h1>
      <p className="text-xl mt-4 text-gray-600">
        The page you're looking for could not be found.
      </p>
      <Link to="/" className="mt-6 text-blue-500 hover:text-blue-700">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
