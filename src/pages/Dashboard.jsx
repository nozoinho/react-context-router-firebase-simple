import { Button } from "@mui/material";
import { logout } from "../config/firebase";

const Dashboard = () => {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Dashboard (ruta protegida)</h1>
      <Button variant="container" onClick={handleLogout}>
        Logout
      </Button>
      {/* <button onClick={handleLogout}>Logout</button> */}
    </>
  );
};

export default Dashboard;
