import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Question = {
  id: string;
  text: string;
};

type Section = {
  title: string;
  questions: Question[];
};

const examinationSections: Section[] = [
  {
    title: "1° Amarás al Señor tu Dios con todo tu corazón, con toda tu alma y fuerzas",
    questions: [
      {
        id: "fe1",
        text: "¿He dudado de mi Fe Católica?",
      },
      {
        id: "fe2",
        text: "¿He murmurado contra el Señor cuando he tenido alguna desgracia?",
      },
      {
        id: "fe3",
        text: "¿He olvidado mi oración personal con Dios todos los días?",
      },
      {
        id: "fe4",
        text: "¿He practicado la superstición o espiritismo, o magia o hechicería?",
      },
      {
        id: "fe5",
        text: "¿He puesto mi fe en amuletos, limpias, supersticiones, horóscopos, etc.?",
      },
      {
        id: "fe6",
        text: "¿He dudado del Amor de Dios?",
      },
    ],
  },
  {
    title: "2° No tomarás en falso el nombre del Señor tu Dios",
    questions: [
      {
        id: "nombre1",
        text: "¿He hecho algún juramento o promesa a Dios y no lo he cumplido?",
      },
      {
        id: "nombre2",
        text: "¿He pronunciado el nombre de Dios sin respeto o poco reverente?",
      },
      {
        id: "nombre3",
        text: "¿He injuriado y abusado contra la Iglesia, y los hombres de Dios, la Virgen María, los Santos?",
      },
    ],
  },
  {
    title: "3° Santificar el día del Señor y las fiestas de guardar",
    questions: [
      {
        id: "misa1",
        text: "¿He faltado a Misa los domingos o fiestas de guardar?",
      },
      {
        id: "misa2",
        text: "¿He venido a Misa por cumplir, sin ganas y distrayéndome?",
      },
    ],
  },
  {
    title: "4° Honrarás a tu padre y a tu madre",
    questions: [
      {
        id: "padres1",
        text: "¿He desobedecido a mis padres o superiores?",
      },
      {
        id: "padres2",
        text: "¿Obedezco de mala gana?",
      },
      {
        id: "padres3",
        text: "¿He entristecido con mi conducta a mis padres o superiores?",
      },
      {
        id: "padres4",
        text: "¿He amenazado o maltratado de palabra o de obra, o les he deseado algún mal?",
      },
      {
        id: "padres5",
        text: "¿He dejado de ayudarles en sus necesidades espirituales o materiales?",
      },
      {
        id: "padres6",
        text: "¿He sido altanero o ingrato con mis padres, abuelos o hermanos?",
      },
    ],
  },
  {
    title: "5° No matarás",
    questions: [
      {
        id: "mataras1",
        text: "¿Tengo enemistad, odio o rencor hacia alguien? ¿He negado la reconciliación?",
      },
      {
        id: "mataras2",
        text: "¿He deseado un mal grave al prójimo? ¿Me he alegrado de los males ajenos?",
      },
      {
        id: "mataras3",
        text: "¿Me he dejado dominar por la envidia?",
      },
      {
        id: "mataras4",
        text: "¿Me he dejado llevar por la ira? ¿He causado con ello daño a otras personas?",
      },
      {
        id: "mataras5",
        text: "¿Me he burlado, criticado, molestado o ridiculizado a otros?",
      },
    ],
  },
  {
    title: "6° No cometerás actos impuros",
    questions: [
      {
        id: "impureza1",
        text: "¿Me he visto de modo inapropiado, induciendo a otros a la impureza?",
      },
      {
        id: "impureza2",
        text: "¿Me he entretenido con miradas, sensaciones y pensamientos impuros?",
      },
      {
        id: "impureza3",
        text: "¿He visto pornografía y la he promovido? ¿He realizado masturbación?",
      },
      {
        id: "impureza4",
        text: "¿He tenido relaciones sexuales fuera del matrimonio?",
      },
      {
        id: "impureza5",
        text: "¿He violado, es decir, agredir con violencia la intimidad sexual de una persona?",
      },
    ],
  },
  {
    title: "7° No robarás",
    questions: [
      {
        id: "robaras1",
        text: "¿He robado algún objeto o dinero? ¿No he regresado lo robado?",
      },
      {
        id: "robaras2",
        text: "¿He cooperado con otros en algún robo o hurto?",
      },
      {
        id: "robaras3",
        text: "¿He engañado cobrando más de lo debido?",
      },
      {
        id: "robaras4",
        text: "¿He sido perezoso en el cumplimiento de mis deberes?",
      },
    ],
  },
  {
    title: "8° No levantarás falsos testimonios",
    questions: [
      {
        id: "testimonio1",
        text: "¿He dicho mentiras? ¿He reparado el daño que haya podido seguirse?",
      },
      {
        id: "testimonio2",
        text: "¿He participado en chismes, críticas o difamaciones? ¿He revelado secretos?",
      },
    ],
  },
  {
    title: "9° No consentirás pensamientos ni deseos impuros",
    questions: [
      {
        id: "deseos1",
        text: "¿He degradado el amor humano confundiéndolo con el egoísmo y con el placer?",
      },
      {
        id: "deseos2",
        text: "¿He sido infiel? ¿He usado preservativos o anticonceptivos?",
      },
    ],
  },
  {
    title: "10° No codiciarás los bienes ajenos",
    questions: [
      {
        id: "codicia1",
        text: "¿He codiciado los bienes ajenos? ¿Tengo envidia de los demás?",
      },
      {
        id: "codicia2",
        text: "¿Deseo el fracaso a los demás? ¿No me gusta prestar, ni ayudar?",
      },
    ],
  },
];

function PreparationBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-1 sm:px-4">
      <h2 className="border-b border-[#00a8c6]/30 pb-3 text-xl font-bold text-slate-900">
        {title}
      </h2>

      <div className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function ConfessionGuide() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* ENCABEZADO */}
      <section className="bg-[#00a8c6]">
        <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white"
          >
            <ArrowLeft size={17} />
            Volver a Servicios parroquiales
          </Link>

          <div className="mt-7">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              Sacramento de la Reconciliación
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Guía para una Buena Confesión
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90 sm:text-base">
              Una ayuda para prepararte adecuadamente para recibir
              el sacramento de la Reconciliación.
            </p>

          </div>
        </div>
      </section>


      {/* CONTENIDO PRINCIPAL */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-12">

        {/* PREPARACIÓN */}
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">

          <PreparationBlock title="Oración antes de la confesión">
            <p>
              Pide a Dios que te ayude a confesarte bien mientras
              esperas tu turno.
            </p>

            <blockquote className="mt-5 border-l-4 border-[#00a8c6] pl-5 italic text-slate-700">
              Ven, Espíritu Santo. Ilumina mi mente para que sepa
              los pecados que debo confesar, y concédeme la gracia
              de confesarlos plena, humildemente y con un corazón
              contrito. Por favor ayúdame a resolver esto con firmeza
              para no volver a cometerlos. Amén.
            </blockquote>
          </PreparationBlock>


          <PreparationBlock title="Preparándose bien">
            <p>
              Después de orar pidiendo la ayuda de Dios para hacer
              una buena Confesión, busca cooperar con Su gracia
              examinando tu conciencia.
            </p>

            <p className="mt-4">
              Al examinar tu conciencia, recuerda lo siguiente:
              cantidad y tipo, y distingue entre pecados mortales
              y veniales.
            </p>
          </PreparationBlock>


          <PreparationBlock title="Acto de contrición">
            <blockquote className="border-l-4 border-[#00a8c6] pl-5 italic text-slate-700">
              Señor Jesucristo, Hijo del Dios vivo, ten piedad de mí,
              soy pecador. Dios mío, me arrepiento de todo corazón de
              mis pecados. Con tu ayuda, pretendo hacer penitencia,
              no pecar más y evitar todo lo que me lleve a pecar.
            </blockquote>
          </PreparationBlock>

        </div>


        {/* SEPARADOR */}
        <div className="my-12 border-t border-slate-200" />


        {/* EXAMEN DE CONCIENCIA */}
        <section>

          <div className="mb-8">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00a8c6]">
              Reflexión personal
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Examen de Conciencia
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Lee cada pregunta con calma y responde sinceramente
              en tu interior. Este examen busca ayudarte a reconocer
              aquello que necesitas presentar ante Dios.
            </p>

          </div>


          {/* CATEGORÍAS */}
          <div className="grid gap-6 lg:grid-cols-2">

            {examinationSections.map((section) => (

              <fieldset
                key={section.title}
                className="border-t-4 border-[#00a8c6] bg-white shadow-sm"
              >

                <legend className="px-5 pt-5 text-xl font-bold text-slate-900">
                  {section.title}
                </legend>

                <div className="mt-2">

                  {section.questions.map((question) => (

                    <div
                      key={question.id}
                      className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-slate-100 px-5 py-4"
                    >

                      <label
                        htmlFor={`${question.id}-si`}
                        className="text-sm leading-6 text-slate-700 sm:text-base"
                      >
                        {question.text}
                      </label>

                      <div className="flex shrink-0 gap-2">

                        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500">
                          <input
                            id={`${question.id}-si`}
                            type="radio"
                            name={question.id}
                            value="si"
                            className="accent-[#00a8c6]"
                          />
                          Sí
                        </label>

                        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500">
                          <input
                            id={`${question.id}-no`}
                            type="radio"
                            name={question.id}
                            value="no"
                            className="accent-[#00a8c6]"
                          />
                          No
                        </label>

                      </div>

                    </div>

                  ))}

                </div>

              </fieldset>

            ))}

          </div>

        </section>


        {/* REGRESAR */}
        <div className="mt-12 border-t border-slate-200 pt-8 text-center">

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00a8c6] hover:text-[#008da5] hover:underline"
          >
            <ArrowLeft size={17} />
            Volver a Servicios parroquiales
          </Link>

        </div>

      </section>

    </main>
  );
}