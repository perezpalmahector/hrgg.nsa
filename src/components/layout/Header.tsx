import { HeaderTopBar } from "./HeaderTopBar";
import { Navbar } from "./Navbar";

export function Header() {
  return (
    <header className="relative z-50 bg-white">
      <HeaderTopBar />
      <Navbar />
    </header>
  );
}
