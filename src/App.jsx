import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
            resolve({ location: avgLocation, accuracy: avgAccuracy });
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
          resolve({ location: avgLocation, accuracy: avgAccuracy });
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
    if (acc <= 10) return "text-green-500";
    if (acc <= 50) return "text-yellow-500";
    if (acc <= 100) return "text-orange-500";
    return "text-red-500";
  };

  const getAccuracyText = (acc) => {
    if (acc <= 10) return "Excellent";
    if (acc <= 50) return "Good";
    if (acc <= 100) return "Fair";
    return "Poor";
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* <header className='w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center'>
        <div className='flex items-center space-x-2'>
          <span className='inline-block w-8 h-8 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-lg mr-2'></span>
          <span className='text-2xl font-bold text-gray-800 tracking-tight'>
            Droplr
          </span>
        </div>
        <nav className='hidden md:flex space-x-8 text-gray-600 font-medium'>
          <a href='#features' className='hover:text-blue-600 transition'>
            Features
          </a>
          <a href='#how' className='hover:text-blue-600 transition'>
            How it works
          </a>
          <a href='#security' className='hover:text-blue-600 transition'>
            Security
          </a>
        </nav>
      </header> */}

      <section className='flex-1 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-16 md:py-24'>
        <div className='flex-1 mb-12 md:mb-0 md:mr-12'>
          <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight'>
            Share files instantly{" "}
            <span className='text-blue-600'>with people nearby</span>
          </h1>
          <p className='text-lg text-gray-600 mb-8 max-w-xl'>
            Droplr is the easiest way to share files securely with anyone within
            200 meters. No sign-up, no hassle. Files are auto-deleted after 20
            minutes for your privacy.
          </p>
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <Link
              to='/zone'
              className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition'
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className='flex-1 flex items-center justify-center'>
          <div className='w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100'>
            {loading ? (
              <div className='flex flex-col items-center space-y-4'>
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
                <div className='text-center'>
                  <p className='text-lg font-semibold text-gray-800'>
                    Detecting your location...
                  </p>
                  <p className='text-sm text-gray-500'>
                    Getting high-accuracy GPS position
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className='flex flex-col items-center space-y-4'>
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
                <p className='text-red-500 text-center'>{error}</p>
                <button
                  onClick={handleRetry}
                  className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors'
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className='flex flex-col items-center space-y-4'>
                <svg
                  className='h-12 w-12 text-green-500'
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
                <h2 className='text-xl font-semibold text-green-600'>
                  Location Detected
                </h2>
                <div className='flex justify-center space-x-4 text-sm text-gray-500'>
                  <div className='bg-gray-50 px-3 py-2 rounded-lg border border-gray-200'>
                    <span className='text-gray-400'>Latitude</span>
                    <p className='text-gray-800 font-medium'>
                      {location.latitude.toFixed(6)}
                    </p>
                  </div>
                  <div className='bg-gray-50 px-3 py-2 rounded-lg border border-gray-200'>
                    <span className='text-gray-400'>Longitude</span>
                    <p className='text-gray-800 font-medium'>
                      {location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
                <div className='bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 inline-block'>
                  <span className='text-gray-400'>
                    Method: {locationMethod}
                  </span>
                  <p className={`font-medium ${getAccuracyColor(accuracy)}`}>
                    Accuracy: {getAccuracyText(accuracy)} ({accuracy.toFixed(0)}
                    m)
                  </p>
                </div>
              </div>
            )}
            {!loading &&
              location &&
              (locationMethod === "Network" || accuracy > 200) && (
                <div className='mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 text-sm'>
                  <div className='mb-2 font-semibold'>
                    Location may be inaccurate. Enter your location manually for
                    best results:
                  </div>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='number'
                      step='0.000001'
                      min='-90'
                      max='90'
                      className='border rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-blue-400'
                      placeholder='Latitude'
                      value={location.latitude}
                      onChange={(e) =>
                        setLocation({
                          ...location,
                          latitude: parseFloat(e.target.value),
                        })
                      }
                    />
                    <input
                      type='number'
                      step='0.000001'
                      min='-180'
                      max='180'
                      className='border rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-blue-400'
                      placeholder='Longitude'
                      value={location.longitude}
                      onChange={(e) =>
                        setLocation({
                          ...location,
                          longitude: parseFloat(e.target.value),
                        })
                      }
                    />
                    <button
                      className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors ml-2'
                      onClick={() => setAccuracy(10)}
                    >
                      Set Location
                    </button>
                  </div>
                  <div className='mt-2 text-xs text-gray-500'>
                    Enter latitude and longitude from Google Maps or your mobile
                    device for best accuracy.
                  </div>
                </div>
              )}
            {location && !error && (
              <div className='text-center mt-6'>
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
                        />
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
        </div>
      </section>

      <section
        id='features'
        className='bg-white py-20 border-t border-gray-100'
      >
        <div className='max-w-6xl mx-auto px-6'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12'>
            Why choose Droplr?
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-gray-50 rounded-2xl shadow p-8 flex flex-col items-center text-center border border-gray-100'>
              <div className='bg-blue-100 p-4 rounded-full mb-4'>
                <svg
                  className='h-8 w-8 text-blue-500'
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
              <h3 className='font-semibold text-lg text-gray-900 mb-2'>
                Secure Sharing
              </h3>
              <p className='text-gray-500'>
                Files are automatically deleted after 20 minutes for your
                privacy and security.
              </p>
            </div>
            <div className='bg-gray-50 rounded-2xl shadow p-8 flex flex-col items-center text-center border border-gray-100'>
              <div className='bg-blue-100 p-4 rounded-full mb-4'>
                <svg
                  className='h-8 w-8 text-blue-500'
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
              <h3 className='font-semibold text-lg text-gray-900 mb-2'>
                Location Based
              </h3>
              <p className='text-gray-500'>
                Share files with people within a 200m radius, instantly and
                securely.
              </p>
            </div>
            <div className='bg-gray-50 rounded-2xl shadow p-8 flex flex-col items-center text-center border border-gray-100'>
              <div className='bg-blue-100 p-4 rounded-full mb-4'>
                <svg
                  className='h-8 w-8 text-blue-500'
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
              <h3 className='font-semibold text-lg text-gray-900 mb-2'>
                Easy Download
              </h3>
              <p className='text-gray-500'>
                One-click download for all shared files. No sign-up required.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id='how' className='py-20 bg-gray-50'>
        <div className='max-w-4xl mx-auto px-6'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12'>
            How it works
          </h2>
          <ol className='space-y-8'>
            <li className='flex items-start space-x-4'>
              <span className='flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl'>
                1
              </span>
              <div>
                <h4 className='font-semibold text-lg text-gray-900 mb-1'>
                  Enable Location
                </h4>
                <p className='text-gray-500'>
                  We use your device's location to connect you with people
                  nearby. Your privacy is always protected.
                </p>
              </div>
            </li>
            <li className='flex items-start space-x-4'>
              <span className='flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl'>
                2
              </span>
              <div>
                <h4 className='font-semibold text-lg text-gray-900 mb-1'>
                  Share or Receive Files
                </h4>
                <p className='text-gray-500'>
                  Drop your files or pick up files from others within your area.
                  No account needed.
                </p>
              </div>
            </li>
            <li className='flex items-start space-x-4'>
              <span className='flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl'>
                3
              </span>
              <div>
                <h4 className='font-semibold text-lg text-gray-900 mb-1'>
                  Files Auto-Delete
                </h4>
                <p className='text-gray-500'>
                  All files are deleted after 20 minutes, ensuring your data is
                  never stored longer than needed.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section
        id='security'
        className='py-20 bg-white border-t border-gray-100'
      >
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
            Your privacy, our priority
          </h2>
          <p className='text-lg text-gray-600 mb-8'>
            Droplr never stores your files or location longer than necessary.
            All transfers are encrypted and files are deleted after 20 minutes.
            You stay in control.
          </p>
          <div className='flex flex-col md:flex-row items-center justify-center gap-6'>
            <div className='flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow text-left'>
              <h4 className='font-semibold text-gray-900 mb-2'>
                End-to-End Encryption
              </h4>
              <p className='text-gray-500'>
                All file transfers are encrypted for maximum security.
              </p>
            </div>
            <div className='flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow text-left'>
              <h4 className='font-semibold text-gray-900 mb-2'>Auto-Delete</h4>
              <p className='text-gray-500'>
                Files are removed from our servers after 20 minutes,
                automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id='get-started'
        className='py-20 bg-gradient-to-r from-blue-600 to-blue-500'
      >
        <div className='max-w-3xl mx-auto px-6 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
            Ready to share files instantly?
          </h2>
          <p className='text-lg text-blue-100 mb-8'>
            Get started with Droplr and experience secure, location-based file
            sharing in seconds.
          </p>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault();
              handleProceed();
            }}
            className='inline-block bg-white text-blue-700 font-semibold px-10 py-4 rounded-xl shadow-lg text-lg hover:bg-blue-50 transition'
          >
            Start Now
          </a>
        </div>
      </section>
      {/* 
      <footer className='py-8 bg-white border-t border-gray-100 text-center text-gray-400 text-sm'>
        &copy; {new Date().getFullYear()} Droplr. Made with ❤️ by{" "}
        <a
          href='https://github.com/AboubakarAris'
          className='text-blue-600 hover:text-blue-700'
        >
          Abou Bakar
        </a>
        . All rights reserved.
      </footer> */}
    </div>
  );
};

export default App;
