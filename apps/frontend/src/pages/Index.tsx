
import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import DashboardWithNavigation from "@/components/DashboardWithNavigation";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'login'| 'dashboard'>('login');

  const handleLoginSuccess = () => {
    setCurrentStep('dashboard');
  };

  const handleQuestionnaireComplete = () => {
    setCurrentStep('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {currentStep === 'dashboard' && <DashboardWithNavigation />}
    </div>
  );
};

export default Index;
