import React, { useState, useEffect } from 'react';
import { Shield, Timer, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { verifyCredentials, verifyOTP, updateLastLoginTime, getLastLoginTime } from './db/NASCMinteli.db';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

function Notification({ message, type, onClose }: NotificationProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2700); // Start exit animation slightly before onClose

    const closeTimer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div className={`notification-banner ${isExiting ? 'notification-exit' : ''}`}>
      <div className={`notification-content ${type}`}>
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <XCircle className="w-5 h-5" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'login' | 'otp' | 'welcome'>('login');
  const [timer, setTimer] = useState(60);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [lastLogin, setLastLogin] = useState('');

  useEffect(() => {
    let interval: number;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = verifyCredentials(username, password);
    if (user) {
      setStep('otp');
      showNotification('Login successful. Please enter OTP.', 'success');
    } else {
      showNotification('Invalid username or password', 'error');
    }
  };

  const handleOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const user = verifyOTP(username, otp);
    if (user) {
      const previousLogin = getLastLoginTime(username);
      setLastLogin(previousLogin || '');
      updateLastLoginTime(username);
      setStep('welcome');
      showNotification('Welcome back!', 'success');
    } else {
      showNotification('Invalid OTP code', 'error');
    }
  };

  const handleResendOTP = () => {
    setTimer(60);
    showNotification('OTP code has been resent', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="w-full max-w-md">
        {step === 'login' && (
          <div className="glass-morphism rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col items-center justify-center mb-8">
              <Shield className="w-16 h-16 text-gray-900 mb-4" strokeWidth={1.5} />
              <h1 className="text-2xl font-medium text-gray-900">NASCM Intelligent System</h1>
              <p className="text-gray-500 mt-2">Please sign in to continue</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-style"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-style"
                  required
                />
              </div>
              <button type="submit" className="button-style">
                Continue
              </button>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <div className="glass-morphism rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col items-center justify-center mb-8">
              <Shield className="w-16 h-16 text-gray-900 mb-4" strokeWidth={1.5} />
              <h1 className="text-2xl font-medium text-gray-900">Verify OTP</h1>
              <p className="text-gray-500 mt-2">Enter the 6-digit code</p>
            </div>
            <form onSubmit={handleOTPVerify} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="input-style text-center text-2xl tracking-widest"
                  required
                  placeholder="••••••"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Timer className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  <span>{timer} seconds</span>
                </div>
                {timer === 0 && (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-gray-900 hover:text-gray-700"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <button type="submit" className="button-style">
                Verify
              </button>
            </form>
          </div>
        )}

        {step === 'welcome' && (
          <div className="glass-morphism rounded-2xl p-8 shadow-lg text-center">
            <Shield className="w-20 h-20 text-gray-900 mx-auto mb-6" strokeWidth={1.5} />
            <h1 className="text-3xl font-medium text-gray-900 mb-2">Welcome to NASCM</h1>
            <p className="text-gray-500">Last login: {lastLogin}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;