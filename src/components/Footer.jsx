export const Footer = () => {
  return (
    <footer className='py-8 bg-white border-t border-gray-100 text-center text-gray-400 text-sm'>
      &copy; {new Date().getFullYear()} Droplr. Made with ❤️ by{" "}
      <a
        href='https://github.com/AboubakarAris'
        className='text-blue-600 hover:text-blue-700'
      >
        Abou Bakar
      </a>
      . All rights reserved.
    </footer>
  );
};
