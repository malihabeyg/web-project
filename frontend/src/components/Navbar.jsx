import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav>
      <span>{user?.email}</span>
    </nav>
  );
};

export default Navbar;
