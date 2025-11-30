import { useState } from 'react';
import BorrowerLogin from './components/BorrowerLogin';
import LenderLogin from './components/LenderLogin';
import AdminLogin from './components/AdminLogin';
import AnalystLogin from './components/AnalystLogin';
import BorrowerDashboard from './components/BorrowerDashboard';
import LenderDashboard from './components/LenderDashboard';
import AdminDashboard from './components/AdminDashboard';
import AnalystDashboard from './components/AnalystDashboard';
import { loansDatabase, paymentsDatabase } from './components/database';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loans, setLoans] = useState(loansDatabase);
  const [payments, setPayments] = useState(paymentsDatabase);

  const handleLogin = (userType, userData) => {
    setLoggedInUser({ type: userType, data: userData });
    setCurrentPage(`${userType}-dashboard`);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentPage('home');
  };

  const addNewLoan = (newLoanData) => {
    const loanId = `LN-2024-${String(loans.length + 1).padStart(3, '0')}`;
    const newLoan = {
      id: loanId,
      borrowerId: parseInt(newLoanData.borrowerId),
      lenderId: loggedInUser.data.id,
      amount: parseFloat(newLoanData.amount),
      interestRate: parseFloat(newLoanData.interestRate),
      term: parseInt(newLoanData.term),
      status: 'Active',
      purpose: newLoanData.purpose,
      startDate: new Date().toISOString().split('T')[0],
      monthlyPayment: newLoanData.monthlyPayment,
      remainingBalance: parseFloat(newLoanData.amount),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setLoans([...loans, newLoan]);
  };

  const processPayment = (paymentId) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'Completed', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', transactionId: `TXN-${Date.now()}` }
        : payment
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'home' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-blue-600 mb-2">Loan Management System</h1>
              <p className="text-gray-600">Select your login type</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setCurrentPage('borrower-login')}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
              >
                <div className="text-4xl mb-4">👤</div>
                <h2 className="text-blue-600 mb-2">Borrower Login</h2>
                <p className="text-gray-600">Access your loan applications and payments</p>
              </button>

              <button
                onClick={() => setCurrentPage('lender-login')}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-500"
              >
                <div className="text-4xl mb-4">💼</div>
                <h2 className="text-green-600 mb-2">Lender Login</h2>
                <p className="text-gray-600">Manage your loan portfolio</p>
              </button>

              <button
                onClick={() => setCurrentPage('admin-login')}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-500"
              >
                <div className="text-4xl mb-4">🔐</div>
                <h2 className="text-purple-600 mb-2">Admin Login</h2>
                <p className="text-gray-600">System administration and oversight</p>
              </button>

              <button
                onClick={() => setCurrentPage('analyst-login')}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-orange-500"
              >
                <div className="text-4xl mb-4">📊</div>
                <h2 className="text-orange-600 mb-2">Financial Analyst Login</h2>
                <p className="text-gray-600">View reports and analytics</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'borrower-login' && (
        <BorrowerLogin onLogin={handleLogin} onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'lender-login' && (
        <LenderLogin onLogin={handleLogin} onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'admin-login' && (
        <AdminLogin onLogin={handleLogin} onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'analyst-login' && (
        <AnalystLogin onLogin={handleLogin} onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'borrower-dashboard' && loggedInUser && (
        <BorrowerDashboard 
          user={loggedInUser.data} 
          onLogout={handleLogout}
          loans={loans}
          payments={payments}
          onProcessPayment={processPayment}
        />
      )}

      {currentPage === 'lender-dashboard' && loggedInUser && (
        <LenderDashboard 
          user={loggedInUser.data} 
          onLogout={handleLogout}
          loans={loans}
          onAddLoan={addNewLoan}
        />
      )}

      {currentPage === 'admin-dashboard' && loggedInUser && (
        <AdminDashboard 
          user={loggedInUser.data} 
          onLogout={handleLogout}
          loans={loans}
        />
      )}

      {currentPage === 'analyst-dashboard' && loggedInUser && (
        <AnalystDashboard 
          user={loggedInUser.data} 
          onLogout={handleLogout}
          loans={loans}
          payments={payments}
        />
      )}
    </div>
  );
}
