import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => (
  <div className="h-[80vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-9xl font-bold text-glass-border">404</h1>
    <p className="text-2xl text-text-secondary mt-4">Looks like this page spent its budget.</p>
    <Link to="/" className="btn-gradient mt-8">Back to Dashboard</Link>
  </div>
);