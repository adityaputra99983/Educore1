'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login submission
    console.log('Logging in...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold mb-2">SMP Islam Namira</h1>
          <p className="text-gray-400">Modern Islamic Education</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="py-4 px-8 bg-emerald-600 text-white text-center">
            <h2 className="text-xl font-semibold">Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
            >
              Sign In
            </motion.button>

            <div className="mt-6 text-center">
              <a href="#" className="text-emerald-400 hover:text-emerald-300 text-sm">
                Forgot your password?
              </a>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>© 2023 SMP Islam Namira. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}
