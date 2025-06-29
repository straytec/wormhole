import React, { useState } from 'react';
import { Layout } from '../../../components/Layout';
import { AuthForm } from '../components/AuthForm';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <AuthForm mode={mode} onToggleMode={toggleMode} />
      </div>
    </Layout>
  );
};