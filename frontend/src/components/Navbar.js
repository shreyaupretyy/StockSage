import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return(
        <nav className="bg-navy text-white flex items-center justify-between px-6 py-4">

            <div className="flex items-center space-x-3">
                <img
                    src='/stocksage_logo.png'
                    alt = 'Logo'
                    className="w-10 h-10 rounded-full"
                />
                <div className="text-2xl font-bold">StockSage</div>
            </div>
            <ul className="flex space-x-6">
                <li className="hover:text-teal"><Link to='/'>Home</Link></li>
                <li className="hover:text-teal"><Link to='/about'>About</Link></li>
                <li className="hover:text-teal"><Link to='/news'>News</Link></li>
                <li className="hover:text-teal"><Link to='/'>Listed Stocks</Link></li>
                <li className="hover:text-teal"><Link to='/'>Prediction</Link></li>
            </ul>

            <div className="flex items-center space-x-4">
                <img
                src="/search-13-xxl.png" // Replace with your search icon path
                alt="Search Icon"
                className="w-5 h-5 text-navy"
            />
                <input
                
                type='text'
                placeholder="Search"
                className="px-3 py-1 rounded-full bg-navy text-white outline outline-2 outline-white"
                />
                <button className="bg-beige text-black px-4 py-1 rounded-full hover:bg-teal hover:text-white">
                    <Link to='/login'>Login</Link>
                </button>
                <button className="bg-beige text-black px-4 py-1 rounded-full hover:bg-teal hover:text-white">
                    <Link to='/signup'>Sign Up</Link>
                </button>

            </div>
        </nav>
    );
};

export default Navbar;