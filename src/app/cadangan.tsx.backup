'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { School, User, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap, Globe } from 'lucide-react';

const ModernLoginDashboard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would redirect to the dashboard here
      console.log('Login attempted with:', { username, password });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 50 - 25, 0],
              scale: [1, Math.random() * 0.5 + 0.8, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12">
        {/* Left side - Branding and Features */}
        <motion.div 
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg">
              <School className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">NOAH<span className="text-cyan-300">SMP</span></h1>
          </motion.div>

          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Sistem Manajemen <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Edukasi</span> Modern
          </h2>

          <p className="text-xl text-purple-100 mb-10 max-w-2xl">
            Platform terdepan untuk manajemen data siswa, absensi, jadwal, dan laporan dengan teknologi mutakhir dan antarmuka futuristik.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <Shield className="w-6 h-6" />, title: "Keamanan", desc: "Data terlindungi" },
              { icon: <Zap className="w-6 h-6" />, title: "Cepat", desc: "Akses real-time" },
              { icon: <Globe className="w-6 h-6" />, title: "Modern", desc: "UI futuristik" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20"
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-cyan-300 mb-3">{feature.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                <p className="text-purple-200 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
              Mulai Sekarang
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-bold border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Pelajari Lebih Lanjut
            </motion.button>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-10">
              <motion.div
                className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-6"
                whileHover={{ rotate: 10 }}
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-2">Selamat Datang</h3>
              <p className="text-purple-200">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-purple-100 mb-2 font-medium">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-purple-300" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-lg"
                    placeholder="Masukkan username Anda"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-100 mb-2 font-medium">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-lg"
                    placeholder="Masukkan password Anda"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-purple-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-purple-300" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-cyan-500 focus:ring-cyan-400 border-purple-300 rounded bg-white/10"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-purple-100">
                    Ingat saya
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-cyan-300 hover:text-cyan-200">
                    Lupa password?
                  </a>
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-purple-200">
                Belum punya akun?{' '}
                <a href="#" className="font-medium text-cyan-300 hover:text-cyan-200">
                  Daftar sekarang
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-purple-200 text-sm">
            <p>© 2025 NOAHSMP. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernLoginDashboard;