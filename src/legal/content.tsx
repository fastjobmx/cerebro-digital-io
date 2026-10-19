import type { ReactNode } from 'react'
import { LEGAL, SITE } from '../config/site'

/*
 * Textos legales base para Colombia. Son una plantilla sólida y coherente con el
 * funcionamiento real del sitio, pero se recomienda la revisión de un abogado
 * antes de publicarlos. Los datos del responsable se editan en LEGAL (config/site.ts).
 */

export interface LegalSection {
  id: string
  title: string
  body: ReactNode
}

export interface LegalDoc {
  slug: 'terminos' | 'privacidad' | 'cookies'
  eyebrow: string
  title: string
  intro: string
  sections: LegalSection[]
}

const Mail = () => (
  <a href={`mailto:${LEGAL.email}`} className="text-white underline underline-offset-2 hover:text-cyan">
    {LEGAL.email}
  </a>
)

const Owner = () => (
  <>
    <strong className="text-white">{LEGAL.owner}</strong>, identificado con {LEGAL.idType} {LEGAL.idNumber}, con domicilio en {LEGAL.address},{' '}
    {LEGAL.city}
  </>
)

/* ------------------------------------------------------------------ */
export const TERMINOS: LegalDoc = {
  slug: 'terminos',
  eyebrow: 'Legal',
  title: 'Términos y condiciones',
  intro: `Estas condiciones regulan el acceso y uso del sitio web de ${SITE.name}, de su asistente virtual y de los canales de contacto que se ofrecen en él.`,
  sections: [
    {
      id: 'identificacion',
      title: '1. Identificación del titular',
      body: (
        <>
          <p>
            El sitio es operado por <Owner /> (en adelante, «{SITE.name}» o «nosotros»). Contacto: <Mail /> · {LEGAL.phone}.
          </p>
        </>
      ),
    },
    {
      id: 'aceptacion',
      title: '2. Aceptación',
      body: (
        <p>
          Al navegar por el sitio, usar el asistente virtual o enviar el formulario de contacto, usted acepta estos términos. Si no está de acuerdo con
          ellos, le pedimos no utilizar el sitio.
        </p>
      ),
    },
    {
      id: 'objeto',
      title: '3. Objeto del sitio',
      body: (
        <>
          <p>
            El sitio presenta información sobre nuestros servicios de inteligencia artificial, automatización e integración de sistemas para empresas
            («Cerebro Digital»), y permite solicitar información o una demostración.
          </p>
          <p>
            La información publicada es de carácter general y comercial. No constituye una oferta vinculante: el alcance, los precios, los plazos y las
            condiciones de cada servicio se definen en una propuesta o contrato escrito independiente.
          </p>
        </>
      ),
    },
    {
      id: 'asistente',
      title: '4. Asistente virtual',
      body: (
        <>
          <p>
            El asistente («Cerebro Digital») es una herramienta automatizada que responde preguntas frecuentes y ayuda a registrar solicitudes de
            contacto. Sus respuestas son orientativas, pueden contener imprecisiones y no reemplazan la asesoría de nuestro equipo ni una propuesta
            formal.
          </p>
          <p>
            Los ejemplos, cifras y escenarios mostrados en el sitio y en el asistente son <strong className="text-white">demostrativos</strong> y no
            representan resultados garantizados.
          </p>
          <p>No ingrese en el asistente información sensible (datos de salud, financieros, contraseñas u otros datos de terceros).</p>
        </>
      ),
    },
    {
      id: 'uso',
      title: '5. Uso adecuado',
      body: (
        <>
          <p>Usted se compromete a no:</p>
          <ul>
            <li>Usar el sitio o el asistente con fines ilícitos, fraudulentos o que vulneren derechos de terceros.</li>
            <li>Enviar información falsa o de otra persona sin su autorización.</li>
            <li>Intentar acceder sin autorización a sistemas, alterar el funcionamiento del sitio o automatizar envíos masivos (spam).</li>
            <li>Introducir código malicioso o realizar actividades que afecten la disponibilidad del servicio.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'propiedad',
      title: '6. Propiedad intelectual',
      body: (
        <p>
          La marca {SITE.name}, su logotipo, los textos, diseños, animaciones, código y demás contenidos del sitio son de nuestra titularidad o se usan
          con autorización, y están protegidos por las normas de derechos de autor y propiedad industrial. No se permite su reproducción, distribución
          o modificación sin autorización previa y escrita.
        </p>
      ),
    },
    {
      id: 'datos',
      title: '7. Datos personales',
      body: (
        <p>
          El tratamiento de los datos que usted nos entregue se rige por nuestra{' '}
          <a href="/privacidad/" className="text-white underline underline-offset-2 hover:text-cyan">
            Política de privacidad y tratamiento de datos
          </a>
          , conforme a la Ley 1581 de 2012 y sus decretos reglamentarios.
        </p>
      ),
    },
    {
      id: 'responsabilidad',
      title: '8. Limitación de responsabilidad',
      body: (
        <>
          <p>
            Procuramos que el sitio funcione de forma continua y que su información sea exacta, pero no garantizamos la ausencia de interrupciones,
            errores o desactualizaciones. En la medida permitida por la ley, no respondemos por daños derivados del uso de la información general del
            sitio o de las respuestas automáticas del asistente.
          </p>
          <p>
            El sitio puede contener enlaces a servicios de terceros (por ejemplo, WhatsApp o el correo electrónico). No somos responsables de sus
            contenidos ni de sus políticas.
          </p>
        </>
      ),
    },
    {
      id: 'consumidor',
      title: '9. Derechos del consumidor y comercio electrónico',
      body: (
        <p>
          Nada en estos términos limita los derechos que le otorgan la Ley 1480 de 2011 (Estatuto del Consumidor) y la Ley 527 de 1999 (comercio
          electrónico), cuando resulten aplicables. Las comunicaciones electrónicas que intercambiemos tienen plena validez.
        </p>
      ),
    },
    {
      id: 'cambios',
      title: '10. Modificaciones',
      body: (
        <p>
          Podemos actualizar estos términos en cualquier momento. La versión vigente es la publicada en esta página, con su fecha de actualización.
        </p>
      ),
    },
    {
      id: 'ley',
      title: '11. Ley aplicable y contacto',
      body: (
        <p>
          Estos términos se rigen por las leyes de la República de Colombia. Para cualquier inquietud, escríbanos a <Mail /> o al WhatsApp{' '}
          {LEGAL.phone}.
        </p>
      ),
    },
  ],
}

/* ------------------------------------------------------------------ */
export const PRIVACIDAD: LegalDoc = {
  slug: 'privacidad',
  eyebrow: 'Ley 1581 de 2012',
  title: 'Política de privacidad y tratamiento de datos personales',
  intro:
    'Explicamos qué datos recogemos, para qué los usamos, con quién los compartimos y cómo puede ejercer sus derechos como titular, de acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015).',
  sections: [
    {
      id: 'responsable',
      title: '1. Responsable del tratamiento',
      body: (
        <ul>
          <li>
            Responsable: <Owner />.
          </li>
          <li>
            Correo para asuntos de datos personales: <Mail />
          </li>
          <li>Teléfono / WhatsApp: {LEGAL.phone}</li>
        </ul>
      ),
    },
    {
      id: 'datos',
      title: '2. Datos que recogemos',
      body: (
        <>
          <p>Solo recogemos los datos que usted nos entrega voluntariamente a través del formulario de contacto o del asistente virtual:</p>
          <ul>
            <li>Nombre, empresa y, si lo indica, el sector de su empresa.</li>
            <li>Correo electrónico y, de forma opcional, número de WhatsApp.</li>
            <li>La descripción del proceso que desea automatizar y el mensaje que escriba.</li>
            <li>El contenido de su conversación con el asistente, mientras está abierta su sesión del navegador.</li>
          </ul>
          <p>
            No solicitamos datos sensibles ni datos de menores de edad. Le pedimos no incluirlos en los mensajes. No usamos cookies publicitarias ni
            herramientas de rastreo de terceros.
          </p>
        </>
      ),
    },
    {
      id: 'finalidades',
      title: '3. Finalidades',
      body: (
        <>
          <p>Sus datos se tratan exclusivamente para:</p>
          <ul>
            <li>Responder su solicitud, contactarle y agendar una demostración o diagnóstico.</li>
            <li>Preparar una propuesta comercial relacionada con nuestros servicios.</li>
            <li>Dar seguimiento a la relación comercial que usted haya iniciado.</li>
            <li>Cumplir obligaciones legales.</li>
          </ul>
          <p>No vendemos ni cedemos sus datos a terceros para fines propios de ellos.</p>
        </>
      ),
    },
    {
      id: 'autorizacion',
      title: '4. Autorización',
      body: (
        <p>
          Antes de enviar sus datos, le pedimos su autorización previa, expresa e informada: en el formulario, marcando la casilla correspondiente; en
          el asistente, confirmando el envío con «Sí, enviar» después de ver el aviso de privacidad. Conservamos registro de la fecha de la
          autorización.
        </p>
      ),
    },
    {
      id: 'encargados',
      title: '5. Encargados y transferencia internacional',
      body: (
        <>
          <p>Para operar el sitio nos apoyamos en proveedores que pueden tratar datos por nuestra cuenta, algunos con servidores fuera de Colombia:</p>
          <ul>
            <li>
              <strong className="text-white">FormSubmit</strong> (formsubmit.co): reenvía a nuestro correo las solicitudes del formulario y del asistente.
            </li>
            <li>
              <strong className="text-white">Google (Gmail)</strong>: buzón donde recibimos y gestionamos las solicitudes.
            </li>
            <li>
              <strong className="text-white">Proveedor de alojamiento web</strong>: aloja el sitio y registra datos técnicos de conexión (como la
              dirección IP) por seguridad.
            </li>
            <li>
              <strong className="text-white">Google Fonts</strong>: sirve las tipografías del sitio, para lo cual su navegador se conecta a servidores de
              Google.
            </li>
            <li>
              <strong className="text-white">WhatsApp (Meta)</strong>: solo si usted decide escribirnos por ese canal.
            </li>
          </ul>
          <p>
            Al autorizar el tratamiento, usted acepta que sus datos puedan ser transferidos o transmitidos a estos proveedores, quienes cuentan con
            medidas de seguridad acordes con los estándares internacionales.
          </p>
        </>
      ),
    },
    {
      id: 'derechos',
      title: '6. Sus derechos',
      body: (
        <>
          <p>Como titular, usted puede en cualquier momento:</p>
          <ul>
            <li>Conocer, actualizar y rectificar sus datos.</li>
            <li>Solicitar prueba de la autorización otorgada.</li>
            <li>Ser informado sobre el uso que hemos dado a sus datos.</li>
            <li>Revocar la autorización y/o solicitar la supresión de sus datos, cuando no exista un deber legal o contractual de conservarlos.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC), después de haber agotado el trámite de consulta o reclamo ante nosotros.</li>
            <li>Acceder gratuitamente a sus datos.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'procedimiento',
      title: '7. Consultas y reclamos',
      body: (
        <>
          <p>
            Escriba a <Mail /> indicando su nombre, documento de identidad, la solicitud concreta y un medio de respuesta.
          </p>
          <ul>
            <li>
              <strong className="text-white">Consultas:</strong> se responden en máximo diez (10) días hábiles, prorrogables por cinco (5) días hábiles
              más, informándole el motivo.
            </li>
            <li>
              <strong className="text-white">Reclamos</strong> (corrección, actualización, supresión o revocatoria): se atienden en máximo quince (15)
              días hábiles, prorrogables por ocho (8) días hábiles más, informándole el motivo.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'conservacion',
      title: '8. Conservación y seguridad',
      body: (
        <p>
          Conservamos sus datos mientras sean necesarios para las finalidades descritas o mientras exista una relación comercial, y luego los
          eliminamos, salvo obligación legal de conservarlos. Aplicamos medidas técnicas y administrativas razonables para protegerlos contra acceso no
          autorizado, pérdida o alteración.
        </p>
      ),
    },
    {
      id: 'navegador',
      title: '9. Datos guardados en su navegador',
      body: (
        <p>
          Para que el asistente recuerde su conversación y el sitio recuerde sus preferencias, se guardan datos en el almacenamiento de su propio
          navegador (no en nuestros servidores). Puede borrarlos en cualquier momento desde la configuración del navegador. Más detalles en la{' '}
          <a href="/cookies/" className="text-white underline underline-offset-2 hover:text-cyan">
            Política de cookies
          </a>
          .
        </p>
      ),
    },
    {
      id: 'vigencia',
      title: '10. Vigencia y cambios',
      body: (
        <p>
          Esta política rige desde su fecha de publicación. Cualquier cambio sustancial se comunicará en esta misma página. Las bases de datos estarán
          vigentes mientras se mantengan las finalidades del tratamiento.
        </p>
      ),
    },
  ],
}

/* ------------------------------------------------------------------ */
const ROWS: [string, string, string, string][] = [
  ['cdio-visited', 'Sesión', 'Evita repetir la animación de carga en la misma visita.', 'Necesaria'],
  ['cerebro-chat', 'Sesión', 'Guarda la conversación con el asistente mientras la pestaña está abierta.', 'Necesaria'],
  ['cerebro-leads', 'Persistente', 'Copia de respaldo local de la solicitud que usted envía, por si falla la conexión.', 'Necesaria'],
  ['cerebro-cookies', 'Persistente', 'Recuerda su elección sobre este aviso de cookies.', 'Necesaria'],
]

export const COOKIES: LegalDoc = {
  slug: 'cookies',
  eyebrow: 'Transparencia',
  title: 'Política de cookies',
  intro: 'Le explicamos qué información guarda este sitio en su navegador y cómo puede gestionarla.',
  sections: [
    {
      id: 'que-son',
      title: '1. ¿Qué son las cookies?',
      body: (
        <p>
          Las cookies y tecnologías similares (como el almacenamiento local del navegador) son pequeños archivos o registros que un sitio guarda en su
          dispositivo para funcionar correctamente o recordar preferencias.
        </p>
      ),
    },
    {
      id: 'cuales',
      title: '2. ¿Qué usamos?',
      body: (
        <>
          <p>
            Este sitio <strong className="text-white">no utiliza cookies publicitarias ni de analítica de terceros</strong>. Solo usa almacenamiento
            técnico necesario:
          </p>
          <div className="not-prose -mx-1 overflow-x-auto">
            <table className="w-full min-w-[560px] border-separate border-spacing-0 text-left text-[13.5px]">
              <thead>
                <tr className="text-white/50">
                  {['Nombre', 'Duración', 'Finalidad', 'Tipo'].map((h) => (
                    <th key={h} className="border-b border-white/10 px-3 py-3 font-mono text-[10.5px] font-normal uppercase tracking-[0.2em]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r[0]}>
                    <td className="border-b border-white/[0.06] px-3 py-3 font-mono text-[12.5px] text-cyan">{r[0]}</td>
                    <td className="border-b border-white/[0.06] px-3 py-3 text-white/70">{r[1]}</td>
                    <td className="border-b border-white/[0.06] px-3 py-3 text-white/70">{r[2]}</td>
                    <td className="border-b border-white/[0.06] px-3 py-3 text-white/70">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: 'terceros',
      title: '3. Servicios de terceros',
      body: (
        <p>
          Las tipografías se cargan desde Google Fonts, lo que implica una conexión de su navegador a servidores de Google. Si usa el botón de WhatsApp,
          se aplicarán las políticas de WhatsApp (Meta). Ninguno de estos servicios instala cookies publicitarias a través de nuestro sitio.
        </p>
      ),
    },
    {
      id: 'gestion',
      title: '4. Cómo gestionarlas',
      body: (
        <>
          <p>
            Puede cambiar su elección cuando quiera desde «Preferencias de cookies» en el pie de página, o borrar estos datos desde la configuración de
            su navegador (Chrome, Safari, Firefox o Edge, en el apartado de privacidad). Si los borra, el sitio seguirá funcionando, pero olvidará la
            conversación del asistente y sus preferencias.
          </p>
          <p>
            Si en el futuro incorporamos herramientas de analítica, solo se activarán si usted pulsa «Aceptar» y actualizaremos esta política.
          </p>
        </>
      ),
    },
    {
      id: 'contacto',
      title: '5. Contacto',
      body: (
        <p>
          Para cualquier duda sobre esta política, escríbanos a <Mail />.
        </p>
      ),
    },
  ],
}

export const DOCS = { terminos: TERMINOS, privacidad: PRIVACIDAD, cookies: COOKIES }
