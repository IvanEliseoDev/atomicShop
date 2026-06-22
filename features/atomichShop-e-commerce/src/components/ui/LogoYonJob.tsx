import logoatomicshop from "../../../public/logoatomicshop.png";
import { useNavigate } from "react-router";

export const LogoYonJob = ({ className = "w-39 h-24" }) => {
  const navigate = useNavigate();
  
  return (
    <img
      src={logoatomicshop}
      alt="logoYonJobs"
      // Combinamos las clases fijas con la prop dinámica
      className={`object-contain cursor-pointer transition-transform duration-300 hover:scale-105 ${className}`}
      onClick={() => navigate("/")}
    />
  );
};