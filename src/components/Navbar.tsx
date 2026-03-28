import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, LogOut, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/i18n/LanguageContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Sahayak AI" className="h-9 w-9" />
          <span className="text-base font-bold text-foreground">
            Sahayak <span className="text-gradient-primary">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSelector />

          {/* User Menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
            >
              <UserCircle size={20} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-card rounded-2xl shadow-elevated border border-border overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <Phone size={14} className="text-primary" />
                    {user || "+91 XXXXX XXXXX"}
                  </div>
                </div>
                <button
                  onClick={async () => { await logout(); setMenuOpen(false); navigate("/"); }}
                  className="w-full text-left px-4 py-3 text-sm text-destructive font-medium hover:bg-destructive/5 transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} />
                  {t("nav.logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
