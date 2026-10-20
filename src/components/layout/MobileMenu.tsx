
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  Link,
  useLocation,
} from "react-router-dom";

import { navigation } from "@/config/navigation";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    return (
      location.pathname === href ||
      (href !== "/" &&
        location.pathname.startsWith(`${href}/`))
    );
  };

  return (
    <div className="mobile-menu-wrapper">
      {/* BOTÓN DEL MENÚ */}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        className="mobile-menu-button"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <Menu size={24} />
        )}
      </button>

      {/* PANEL DE NAVEGACIÓN */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="mobile-menu-panel"
        >
          <nav aria-label="Navegación principal">
            <ul>
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={closeMenu}
                      className={`mobile-menu-link ${active
                          ? "mobile-menu-link-active"
                          : ""
                        }`}
                      aria-current={
                        active ? "page" : undefined
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default MobileMenu;
