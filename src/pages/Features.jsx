const Features = () => (
  <section className='bg-white py-20 border-t border-gray-100'>
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
            Files are automatically deleted after 20 minutes for your privacy
            and security.
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
);

export default Features;
