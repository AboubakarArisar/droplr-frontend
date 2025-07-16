const How = () => (
  <section className='py-20 bg-gray-50'>
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
              We use your device's location to connect you with people nearby.
              Your privacy is always protected.
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
              Drop your files or pick up files from others within your area. No
              account needed.
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
);

export default How;
