import React from 'react';

const SignInButton = () => {
    return (
        <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-200/40 via-violet-200/40 to-indigo-200/40 border border-white/50 px-3 text-sm font-medium text-gray-800 shadow-lg shadow-gray-800/5 ring-1 ring-gray-800/[.075] backdrop-blur-xl">
            <a
                href="/app/sign-in"
                className="group relative flex-none text-base sm:text-sm -ml-2 my-1 inline-flex items-center bg-clip-padding rounded-l-[20px] rounded-r-[8px] border h-8 pl-3 pr-[10px] bg-white/40 border-white/90 shadow hover:text-violet-600 hover:bg-violet-50/40 transition-colors duration-300"
                style={{ cursor: 'pointer' }}
            >
                Sign In
                <span className="absolute left-4 right-1 -bottom-[2px] h-px bg-gradient-to-r from-violet-500 via-violet-400 to-violet-500 opacity-0 scale-x-0 transition duration-300 group-hover:opacity-100 group-hover:scale-x-100"></span>
            </a>
            <a
                href="/app/sign-up"
                className="group relative flex justify-center items-center text-base sm:text-sm ml-[5px] -mr-2 my-1 h-8 pr-3 bg-gradient-to-br from-purple-600 to-indigo-500 text-white shadow-purple-800 outline-none border-0 ring-1 ring-white/10 active:ring-white/10 active:bg-purple-700 focus:outline-none p-2 rounded-lg shadow-[inset_0_0_0_1px_rgba(67,56,202,0.25)] active:shadow-[inset_0_0_0_1px_rgba(67,56,202,0.25)] rounded-r-[20px] rounded-l-[8px] transition-colors duration-300"
            >
                Get Started
            </a>
        </div>
    );
}

export default SignInButton;
