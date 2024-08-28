import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminNavBar() {
  return (
    <div className="bg-gray-300 text-gray-900 font-bold p-4 shadow-md">
      <nav className="flex justify-around">
        <Link
          to="/admin-projects"
          className="text-lg hover:text-orange-500 transition duration-300"
        >
          Projects
        </Link>
        <Link
          to="/blogs"
          className="text-lg hover:text-orange-500 transition duration-300"
        >
          Blogs
        </Link>
        <Link
          to="/vlogs"
          className="text-lg hover:text-orange-500 transition duration-300"
        >
          Vlogs
        </Link>
      </nav>
    </div>
  );
}
