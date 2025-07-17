import React from "react";
import MainLayout from "../../components/layout/MainLayout";

const Notifications: React.FC = () => {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">Centre de notifications (simulation).</p>
      </div>
    </MainLayout>
  );
};

export default Notifications; 