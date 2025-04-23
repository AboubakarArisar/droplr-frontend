import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      console.log("in geolocation");
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation(position.coords);

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

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-4'>
      <div className='bg-[#1e293b] p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-700'>
        <h1 className='text-2xl font-bold text-center mb-6 tracking-wide text-white'>
          Welcome to PindariDrop
        </h1>

        {loading ? (
          <div className='text-center text-gray-400'>
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
              onClick={() => navigate("/zone")}
              className='bg-blue-600 hover:bg-blue-700 transition duration-200 px-6 py-2 rounded-lg text-white font-medium shadow-lg'
            >
              Proceed to Drop Zone
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
