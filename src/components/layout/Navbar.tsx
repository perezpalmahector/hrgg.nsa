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
              Mineral de la Reforma · Hidalgo · México
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
                className={`navbar-link whitespace-nowrap ${isActive ? "navbar-link-active" : ""
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Redes sociales */}
        <div
          className="hidden items-center gap-2 lg:flex"
          style={{
            flexShrink: 0,
            marginLeft: "8px",
            paddingLeft: "12px",
            borderLeft: "1px solid #dbe3e8",
          }}
        >
          {/* Facebook */}
          <a
            href="https://www.facebook.com/groups/parroquianuestrasenoradelosangelesmr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook de la parroquia"
            title="Facebook"
            style={{
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              color: "#ffffff",
              backgroundColor: "#1877F2",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M14 8H17V4H14C10.686 4 9 5.686 9 9V12H6V16H9V24H13V16H16L17 12H13V9C13 8.448 13.448 8 14 8Z"
                fill="white"
              />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/parroquiansangeles?utm_source=qr&igsh=MWNucjVoZnBzemxudw=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de la parroquia"
            title="Instagram"
            style={{
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              color: "#ffffff",
              background:
                "linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="white"
                strokeWidth="2"
              />

              <circle
                cx="12"
                cy="12"
                r="4"
                stroke="white"
                strokeWidth="2"
              />

              <circle
                cx="17.5"
                cy="6.5"
                r="1.2"
                fill="white"
              />
            </svg>
          </a>
        </div>

        {/* Menú móvil */}
        <div className="ml-auto shrink-0 lg:hidden">
          <MobileMenu />
        </div>
      </Container>
    </nav>
  );
}