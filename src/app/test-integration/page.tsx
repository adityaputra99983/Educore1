'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const APITestPage = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAPIs = async () => {
      try {
        const response = await fetch('/api/integration-test');
        const data = await response.json();
        setTestResults(data);
      } catch (error) {
        console.error('API test failed:', error);
        setTestResults({
          success: false,
          error: 'Failed to connect to API',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    };

    testAPIs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Testing API Connections...</h2>
          <p className="text-gray-600 mt-2">Please wait while we verify all connections to the SIMAKA system</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SIMAKA API Integration Test</h1>
            <p className="text-gray-600">Verifying all API connections to the SIMAKA system</p>
          </div>

          {testResults?.success ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">All APIs Connected Successfully!</h2>
              <p className="text-gray-600 mb-8">
                The NOAH attendance system is properly integrated with the SIMAKA system.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">Available API Endpoints:</h3>
                <ul className="space-y-3">
                  {testResults.endpoints && Object.entries(testResults.endpoints).map(([name, path]) => (
                    <li key={name} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="font-medium text-gray-900 capitalize">{name}:</span>
                      <span className="text-gray-600 ml-2 font-mono">{path as string}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  <strong>Test Timestamp:</strong> {testResults.timestamp}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">API Connection Failed</h2>
              <p className="text-gray-600 mb-4">
                There was an issue connecting to the SIMAKA system.
              </p>
              <div className="bg-red-50 rounded-xl p-6 text-left max-w-2xl mx-auto">
                <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                <p className="text-red-700 mb-2"><strong>Error:</strong> {testResults?.error}</p>
                <p className="text-red-700"><strong>Message:</strong> {testResults?.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APITestPage;