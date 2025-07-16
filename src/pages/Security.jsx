const Security = () => (
  <section className='py-20 bg-white border-t border-gray-100'>
    <div className='max-w-4xl mx-auto px-6 text-center'>
      <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
        Your privacy, our priority
      </h2>
      <p className='text-lg text-gray-600 mb-8'>
        Droplr never stores your files or location longer than necessary. All
        transfers are encrypted and files are deleted after 20 minutes. You stay
        in control.
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
            Files are removed from our servers after 20 minutes, automatically.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Security;
