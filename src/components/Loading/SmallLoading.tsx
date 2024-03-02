const SmallLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <svg className="animate-spin h-10 w-10 mr-2" viewBox="0 0 24 24">
        <circle className="fill-blue-500" cx="12" cy="12" r="10"></circle>
      </svg>
      <p className="text-gray-600">Loading...</p>
    </div>
  );
};

export default SmallLoading;
