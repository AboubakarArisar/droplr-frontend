import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [locationMethod, setLocationMethod] = useState(null);
  const navigate = useNavigate();

  const calculateAverageLocation = (locations) => {
    if (locations.length === 0) return null;

    const avgLat =
      locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
    const avgLng =
      locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;

    return { latitude: avgLat, longitude: avgLng };
  };

  const getLocation = async () => {
    setLoading(true);
    setError(null);
    setLocationHistory([]);

    try {
      const gpsLocation = await getGPSLocation();
      if (gpsLocation) {
        setLocationMethod("GPS");
        setLocation(gpsLocation.location);
        setAccuracy(gpsLocation.accuracy);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log("GPS failed, trying fallback methods...");
    }

    try {
      const networkLocation = await getNetworkLocation();
      if (networkLocation) {
        setLocationMethod("Network");
        setLocation(networkLocation);
        setAccuracy(1000);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log("Network location failed...");
    }

    setError(
      "Unable to detect location automatically. Please enable location access or try again."
    );
    setLoading(false);
  };

  const getGPSLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      };

      const locationReadings = [];
      let watchId = null;
      let timeoutId = null;

      const processLocation = (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (accuracy <= 50) {
          locationReadings.push({ latitude, longitude, accuracy });

          if (locationReadings.length >= 3) {
            const avgLocation = calculateAverageLocation(locationReadings);
            const avgAccuracy =
              locationReadings.reduce((sum, loc) => sum + loc.accuracy, 0) /
              locationReadings.length;

            if (navigator.geolocation.clearWatch) {
              navigator.geolocation.clearWatch(watchId);
            }
            if (timeoutId) clearTimeout(timeoutId);

            resolve({
              location: avgLocation,
              accuracy: avgAccuracy,
            });
          }
        }
      };

      const handleError = (error) => {
        if (navigator.geolocation.clearWatch) {
          navigator.geolocation.clearWatch(watchId);
        }
        if (timeoutId) clearTimeout(timeoutId);
        reject(error);
      };

      watchId = navigator.geolocation.watchPosition(
        processLocation,
        handleError,
        options
      );

      timeoutId = setTimeout(() => {
        if (locationReadings.length > 0) {
          const avgLocation = calculateAverageLocation(locationReadings);
          const avgAccuracy =
            locationReadings.reduce((sum, loc) => sum + loc.accuracy, 0) /
            locationReadings.length;

          if (navigator.geolocation.clearWatch) {
            navigator.geolocation.clearWatch(watchId);
          }

          resolve({
            location: avgLocation,
            accuracy: avgAccuracy,
          });
        } else {
          if (navigator.geolocation.clearWatch) {
            navigator.geolocation.clearWatch(watchId);
          }
          reject(new Error("GPS timeout"));
        }
      }, 15000);
    });
  };

  const getNetworkLocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      if (data.latitude && data.longitude) {
        return {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        };
      }
    } catch (err) {
      console.error("Network location error:", err);
    }
    return null;
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleRetry = () => {
    getLocation();
  };

  const handleProceed = () => {
    if (!location) return;

    setNavigating(true);
    navigate("/zone", {
      state: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: accuracy,
        method: locationMethod,
      },
    });
  };

  const getAccuracyColor = (acc) => {
    if (acc <= 10) return "text-green-400";
    if (acc <= 50) return "text-yellow-400";
    if (acc <= 100) return "text-orange-400";
    return "text-red-400";
  };

  const getAccuracyText = (acc) => {
    if (acc <= 10) return "Excellent";
    if (acc <= 50) return "Good";
    if (acc <= 100) return "Fair";
    return "Poor";
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white'>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiMyNTYzZWIiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-10"></div>

      <div className='relative min-h-screen flex items-center justify-center px-4 py-12'>
        <div className='max-w-4xl w-full'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600'>
              Welcome to Droplr
            </h1>
            <p className='text-gray-400 text-lg max-w-2xl mx-auto'>
              Share files with people nearby. Your files are automatically
              deleted after 20 minutes.
            </p>
          </div>

          <div className='bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-700 overflow-hidden'>
            <div className='p-8 md:p-12'>
              <div className='mb-8'>
                {loading ? (
                  <div className='text-center space-y-4'>
                    <div className='flex items-center justify-center'>
                      <svg
                        className='animate-spin h-12 w-12 text-blue-400'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                    </div>
                    <div className='space-y-2'>
                      <p className='text-lg font-medium text-white'>
                        Detecting your location...
                      </p>
                      <p className='text-sm text-gray-400'>
                        Getting high-accuracy GPS position
                      </p>
                    </div>
                  </div>
                ) : error ? (
                  <div className='text-center space-y-4'>
                    <div className='flex items-center justify-center'>
                      <svg
                        className='h-12 w-12 text-red-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                        />
                      </svg>
                    </div>
                    <p className='text-red-400'>{error}</p>
                    <button
                      onClick={handleRetry}
                      className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors'
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className='text-center space-y-4'>
                    <div className='flex items-center justify-center'>
                      <svg
                        className='h-12 w-12 text-green-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                    <div className='space-y-2'>
                      <h2 className='text-xl font-semibold text-green-400'>
                        Location Detected
                      </h2>
                      <div className='flex justify-center space-x-4 text-sm text-gray-400'>
                        <div className='bg-[#0f172a] px-3 py-2 rounded-lg'>
                          <span className='text-gray-500'>Latitude</span>
                          <p className='text-white font-medium'>
                            {location.latitude.toFixed(6)}
                          </p>
                        </div>
                        <div className='bg-[#0f172a] px-3 py-2 rounded-lg'>
                          <span className='text-gray-500'>Longitude</span>
                          <p className='text-white font-medium'>
                            {location.longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>
                      <div className='bg-[#0f172a] px-3 py-2 rounded-lg inline-block'>
                        <span className='text-gray-500'>
                          Method: {locationMethod}
                        </span>
                        <p
                          className={`font-medium ${getAccuracyColor(
                            accuracy
                          )}`}
                        >
                          Accuracy: {getAccuracyText(accuracy)} (
                          {accuracy.toFixed(0)}m)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {location && !error && (
                <div className='text-center space-y-4'>
                  <button
                    onClick={handleProceed}
                    disabled={navigating}
                    className={`group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 px-8 py-4 rounded-xl text-white font-medium shadow-lg flex items-center justify-center mx-auto ${
                      navigating ? "cursor-wait" : "cursor-pointer"
                    }`}
                  >
                    <span className='absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity'></span>
                    {navigating ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        <span>Navigating to Drop Zone...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className='h-5 w-5 mr-2'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M13 7l5 5m0 0l-5 5m5-5H6'
                          />
                        </svg>
                        <span>Proceed to Drop Zone</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className='bg-[#0f172a] p-8 border-t border-gray-700'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='text-center'>
                  <div className='bg-blue-500/10 p-3 rounded-lg inline-block mb-3'>
                    <svg
                      className='h-6 w-6 text-blue-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                      />
                    </svg>
                  </div>
                  <h3 className='font-medium text-white mb-1'>
                    Secure Sharing
                  </h3>
                  <p className='text-sm text-gray-400'>
                    Files are automatically deleted after 20 minutes
                  </p>
                </div>
                <div className='text-center'>
                  <div className='bg-blue-500/10 p-3 rounded-lg inline-block mb-3'>
                    <svg
                      className='h-6 w-6 text-blue-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                  </div>
                  <h3 className='font-medium text-white mb-1'>
                    Location Based
                  </h3>
                  <p className='text-sm text-gray-400'>
                    Share files with people within 200m radius
                  </p>
                </div>
                <div className='text-center'>
                  <div className='bg-blue-500/10 p-3 rounded-lg inline-block mb-3'>
                    <svg
                      className='h-6 w-6 text-blue-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                      />
                    </svg>
                  </div>
                  <h3 className='font-medium text-white mb-1'>Easy Download</h3>
                  <p className='text-sm text-gray-400'>
                    One-click download for all shared files
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
