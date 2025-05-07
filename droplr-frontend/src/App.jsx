import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      console.log("in geolocation");
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLoading(false);
        },
        (err) => {
          setError("Please allow location access to use this feature.");
          setLoading(false);
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  const handleProceed = () => {
    if (!location) return;
    
    setNavigating(true);
    navigate("/zone", { 
      state: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-4'>
      <div className='bg-[#1e293b] p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-700'>
        <h1 className='text-2xl font-bold text-center mb-6 tracking-wide text-white'>
          Welcome to Droplr
        </h1>

        {loading ? (
          <div className='text-center text-gray-400'>
            <div className="flex items-center justify-center mb-4">
              <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p>Detecting your location...</p>
          </div>
        ) : error ? (
          <div className='text-center text-red-400'>
            <p>{error}</p>
          </div>
        ) : (
          <div className='text-center text-green-400 space-y-1'>
            <h2 className='text-lg font-semibold'>Location Access Granted</h2>
            <p className='text-sm'>Latitude: {location.latitude}</p>
            <p className='text-sm'>Longitude: {location.longitude}</p>
          </div>
        )}

        {location && !error && (
          <div className='mt-6 text-center'>
            <button
              onClick={handleProceed}
              disabled={navigating}
              className={`bg-blue-600 hover:bg-blue-700 transition duration-200 px-6 py-2 rounded-lg text-white font-medium shadow-lg flex items-center justify-center mx-auto ${
                navigating ? 'cursor-wait' : 'cursor-pointer'
              }`}
            >
              {navigating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Navigating...
                </>
              ) : (
                "Proceed to Drop Zone"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
