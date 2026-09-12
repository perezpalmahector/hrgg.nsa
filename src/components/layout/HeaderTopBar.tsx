import { Container } from "@/components/ui/Container";

export function HeaderTopBar() {
  return (
    <div className="border-b border-[#e7dfd1] bg-[#f7f3eb]">
      <Container className="flex h-9 items-center justify-between text-xs">
        <p className="font-medium text-[#5c5448]">
          Parroquia de Nuestra Señora de los Ángeles
        </p>

        <p className="font-medium text-[#756c5e]">
          Mineral de la Reforma, Hidalgo
        </p>
      </Container>
    </div>
  );
}
