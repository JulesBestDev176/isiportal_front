import React from "react";
import TableauDeBord from "../../components/dashboard/TableauDeBord";
import MainLayout from "../../components/layout/MainLayout";

const TableauDeBordPage: React.FC = () => {
  return (
    <MainLayout>
      <TableauDeBord />
    </MainLayout>
  );
};

export default TableauDeBordPage; 