import { Link, useLocation } from "react-router-dom";

import { Container } from "@/components/ui/Container";
import { navigation } from "@/config/navigation";

import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Container className="flex h-full min-w-0 items-center gap-6">
        {/* Marca de la parroquia */}
        <Link
          to="/"
          className="navbar-brand flex-none lg:w-[330px] xl:w-[390px]"
          aria-label="Ir al inicio"
        >
          <img
            src="/images/parish/nsa_small.jpg"
            alt="Nuestra Señora de los Ángeles"
            className="navbar-logo-image shrink-0"
          />

          <div className="navbar-brand-text min-w-0">
            <p className="navbar-title leading-tight">
              Parroquia de Nuestra Señora de los Ángeles
            </p>

            <p className="navbar-subtitle">
              Mineral de la Reforma · Hidalgo
            </p>
          </div>
        </Link>

        {/* Menú escritorio */}
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-0.5 lg:flex">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/" &&
                location.pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`navbar-link whitespace-nowrap ${
                  isActive ? "navbar-link-active" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Menú móvil */}
        <div className="ml-auto shrink-0 lg:hidden">
          <MobileMenu />
        </div>
      </Container>
    </nav>
  );
}