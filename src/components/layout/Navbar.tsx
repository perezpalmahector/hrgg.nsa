import { Link } from "react-router-dom";

import { Container } from "@/components/ui/Container";
import { navigation } from "@/config/navigation";

import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  return (
    <nav className="navbar">
      <Container className="flex h-[76px] items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label="Ir al inicio"
        >
          <img
            src="/images/parish/nsa_40x40.jpg"
            alt="Nuestra Señora de los Ángeles"
            className="navbar-logo-image"
          />

          <div className="hidden sm:block">
            <p className="navbar-title">
              Parroquia de Nuestra Señora de los Ángeles
            </p>

            <p className="navbar-subtitle">
              Mineral de la Reforma, Hidalgo
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="navbar-link"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <MobileMenu />
      </Container>
    </nav>
  );
}
