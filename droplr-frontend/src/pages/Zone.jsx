import React, { useState } from "react";

export const Zone = () => {
  const [file, setFile] = useState(null);
  const [localFiles, setLocalFiles] = useState([
    { name: "Lecture_5_Notes.pdf", distance: "120m" },
    { name: "Assignment_2.docx", distance: "95m" },
  ]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-6 py-10 flex items-center justify-center'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full'>
        <div className='bg-[#1e293b] border border-gray-700 rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-white transition-all'>
          <h2 className='text-2xl font-bold mb-4 tracking-wide text-center'>
            Drop a File
          </h2>
          <input
            type='file'
            onChange={(e) => setFile(e.target.files[0])}
            className='w-full bg-[#0f172a] text-white file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:cursor-pointer file:mr-4 rounded-md p-2 border border-gray-600 mb-3'
          />
          {file && (
            <p className='text-green-400 text-sm mb-3 text-center'>
              {file.name} selected
            </p>
          )}
          <button
            onClick={() => alert("File uploaded (simulate)")}
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 w-full text-center'
          >
            Upload File
          </button>
        </div>

        <div className='bg-[#1e293b] border border-gray-700 rounded-2xl p-6 shadow-lg text-white'>
          <h2 className='text-2xl font-bold mb-4 tracking-wide'>
            Nearby Files (within 150m)
          </h2>
          {localFiles.length === 0 ? (
            <p className='text-gray-400 text-sm'>No files found nearby.</p>
          ) : (
            <ul className='space-y-3'>
              {localFiles.map((f, idx) => (
                <li
                  key={idx}
                  className='flex justify-between items-center bg-[#0f172a] p-3 rounded-lg border border-gray-600 hover:bg-[#17263c] transition'
                >
                  <span className='text-white font-medium'>{f.name}</span>
                  <span className='text-sm text-blue-400'>{f.distance}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
