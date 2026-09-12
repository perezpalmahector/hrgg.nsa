import { Link } from "react-router-dom";

import { Container } from "@/components/ui/Container";
import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-bold">
                NSA
              </div>

              <div>
                <p className="font-semibold">
                  Nuestra Señora de los Ángeles
                </p>

                <p className="text-sm text-gray-400">
                  Parroquia
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navegación
            </h2>

            <nav className="mt-4" aria-label="Navegación del pie de página">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Ubicación
            </h2>

            <address className="mt-4 not-italic text-sm leading-6 text-gray-400">
              <p>Mineral de la Reforma</p>
              <p>Hidalgo, México</p>
            </address>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} {siteConfig.shortName}. Todos los derechos
            reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
