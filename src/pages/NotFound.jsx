import { Link } from "react-router-dom";

const NotFound = () => (
  <div className='min-h-[80vh] flex flex-col items-center justify-center bg-[#f7f8fa] text-[#222] text-center p-8'>
    <h1 className='text-7xl font-bold m-0'>404</h1>
    <h2 className='text-2xl font-medium mt-4 mb-2'>Oops! Page not found.</h2>
    <p className='text-base mb-8 text-[#555]'>
      The page you are looking for does not exist or has been moved.
    </p>
    <Link
      to='/'
      className='inline-flex items-center bg-[#1976d2] text-white px-6 py-3 rounded font-semibold text-base shadow-md transition-colors hover:bg-[#1251a3] no-underline'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        height='24'
        width='24'
        fill='currentColor'
        className='mr-2'
        viewBox='0 0 24 24'
      >
        <path d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' />
      </svg>
      Go to Home
    </Link>
  </div>
);

export default NotFound;
