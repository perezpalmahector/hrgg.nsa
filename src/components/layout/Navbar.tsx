import { Link, useLocation } from "react-router-dom";

import { Container } from "@/components/ui/Container";
import { navigation } from "@/config/navigation";

import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Container className="flex h-full items-center justify-between gap-3">
        <Link
          to="/"
          className="navbar-brand min-w-0 flex-1"
          aria-label="Ir al inicio"
        >
          <img
            src="/images/parish/nsa_40x40.jpg"
            alt="Nuestra Señora de los Ángeles"
            className="navbar-logo-image"
          />

          <div className="navbar-brand-text">
            <p className="navbar-title">
              Parroquia de Nuestra Señora de los Ángeles
            </p>

            <p className="navbar-subtitle">
              Mineral de la Reforma · Hidalgo
            </p>
          </div>
        </Link>

        <div className="hidden shrink-0 items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (
                item.href !== "/" &&
                location.pathname.startsWith(`${item.href}/`)
              );

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`navbar-link ${
                  isActive ? "navbar-link-active" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="shrink-0 lg:hidden">
          <MobileMenu />
        </div>
      </Container>
    </nav>
  );
}
