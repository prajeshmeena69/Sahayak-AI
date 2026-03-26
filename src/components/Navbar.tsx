import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

interface NavbarProps {
  lang: "hi" | "en";
  onToggleLang: () => void;
}

const Navbar = ({ lang, onToggleLang }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Sahayak AI" className="h-10 w-10" />
          <span className="text-lg font-bold text-foreground">
            Sahayak <span className="text-gradient-primary">AI</span>
          </span>
        </Link>

        <button
          onClick={onToggleLang}
          className="px-5 py-2 rounded-full text-sm font-semibold bg-card border border-border shadow-soft text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
        >
          {lang === "hi" ? "EN" : "हिंदी"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
