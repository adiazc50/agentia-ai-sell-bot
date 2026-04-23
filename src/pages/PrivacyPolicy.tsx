import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Política de Privacidad - Agent IA SAS" description="Política de Privacidad y Tratamiento de Datos Personales de Agent IA SAS (SoyAgentia)." />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">Política de Privacidad y Tratamiento de Datos Personales</h1>
          <p className="text-muted-foreground mb-8">Última actualización: 9 de marzo de 2026</p>

          <div className="prose prose-invert max-w-none space-y-8 text-foreground/90">

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. RESPONSABLE DEL TRATAMIENTO</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Razón Social:</strong> AGENT IA SAS<br />
                <strong className="text-foreground">NIT:</strong> 901.976.734-4<br />
                <strong className="text-foreground">Domicilio:</strong> República de Colombia<br />
                <strong className="text-foreground">Correo electrónico del Oficial de Protección de Datos:</strong> notificaciones@induretros.com<br />
                <strong className="text-foreground">Correo de notificaciones:</strong> notificaciones@soyagentia.com<br />
                <strong className="text-foreground">Sitio web:</strong> www.soyagentia.com<br /><br />
                AGENT IA SAS (en adelante "Agent IA") es el Responsable del Tratamiento de los datos personales de los Usuarios de la Plataforma. Respecto a los datos personales de los Clientes Finales, Agent IA actúa como Encargado del Tratamiento conforme a las instrucciones del Usuario, quien ostenta la calidad de Responsable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. MARCO LEGAL</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                La presente Política se rige por:<br /><br />
                • <strong className="text-foreground">Constitución Política de Colombia</strong> — Artículo 15 (Derecho a la intimidad y habeas data)<br />
                • <strong className="text-foreground">Ley 1581 de 2012</strong> — Régimen General de Protección de Datos Personales<br />
                • <strong className="text-foreground">Decreto 1377 de 2013</strong> — Reglamentario parcial de la Ley 1581 de 2012<br />
                • <strong className="text-foreground">Decreto 1074 de 2015</strong> — Decreto Único Reglamentario del sector Comercio, Industria y Turismo (Título 26)<br />
                • <strong className="text-foreground">Ley 1266 de 2008</strong> — Habeas Data financiero (en lo aplicable)<br />
                • <strong className="text-foreground">Circular Externa 002 de 2015 de la SIC</strong> — Registro Nacional de Bases de Datos
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. DATOS PERSONALES RECOPILADOS</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">3.1. Datos del Usuario (Responsable del Tratamiento: Agent IA):</strong><br />
                • Datos de identificación: nombre completo, tipo y número de documento, NIT (para empresas)<br />
                • Datos de contacto: correo electrónico, número telefónico, dirección, ciudad<br />
                • Datos comerciales: razón social, nombre de contacto<br />
                • Datos de acceso: credenciales de autenticación (contraseña encriptada)<br />
                • Datos financieros: información de pago y facturación<br />
                • Datos de uso: registros de actividad en la Plataforma, logs de acceso, dirección IP<br /><br />
                <strong className="text-foreground">3.2. Datos del Cliente Final (Responsable del Tratamiento: el Usuario):</strong><br />
                • Número de teléfono (WhatsApp)<br />
                • Nombre (cuando es proporcionado)<br />
                • Contenido de las conversaciones con el Agente de IA<br />
                • Datos que el Cliente Final proporcione voluntariamente durante la interacción (pedidos, preferencias, consultas)<br />
                • Metadatos de la conversación (fecha, hora, duración)
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. FINALIDADES DEL TRATAMIENTO</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">4.1. Finalidades primarias (necesarias para la prestación del servicio):</strong><br />
                • Gestión del registro y autenticación de Usuarios<br />
                • Prestación de los Servicios contratados<br />
                • Procesamiento de pagos y facturación<br />
                • Soporte técnico y atención al cliente<br />
                • Funcionamiento del Agente de IA (procesamiento de conversaciones)<br />
                • Cumplimiento de obligaciones legales y regulatorias<br /><br />
                <strong className="text-foreground">4.2. Finalidades secundarias (con consentimiento del titular):</strong><br />
                • Envío de comunicaciones comerciales y promocionales<br />
                • Análisis estadísticos y de uso de la Plataforma<br />
                • Mejora de los algoritmos de inteligencia artificial<br />
                • Personalización de la experiencia del Usuario<br />
                • Realización de encuestas de satisfacción
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. AUTORIZACIÓN Y CONSENTIMIENTO</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                5.1. Al registrarse en la Plataforma, el Usuario otorga su autorización previa, expresa e informada para el tratamiento de sus datos personales conforme a las finalidades descritas en la presente Política.<br /><br />
                5.2. El Usuario, en su calidad de Responsable del Tratamiento de los datos de sus Clientes Finales, declara y garantiza que ha obtenido la autorización previa, expresa e informada de cada titular para:<br /><br />
                • La recopilación de sus datos personales mediante el Agente de IA<br />
                • El almacenamiento y procesamiento de dichos datos en la Plataforma<br />
                • La transferencia de datos a Agent IA como Encargado del Tratamiento<br />
                • El uso de inteligencia artificial para el procesamiento de sus conversaciones<br /><br />
                5.3. El Usuario debe conservar evidencia verificable de las autorizaciones obtenidas y ponerla a disposición de Agent IA o de la autoridad competente cuando sea requerida.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. TRANSFERENCIA Y TRANSMISIÓN DE DATOS</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                6.1. <strong className="text-foreground">Transferencia nacional:</strong> Agent IA podrá transferir datos personales a terceros ubicados en Colombia que actúen como Encargados del Tratamiento, previa suscripción de contratos que garanticen niveles adecuados de protección.<br /><br />
                6.2. <strong className="text-foreground">Transferencia internacional:</strong> En cumplimiento del artículo 26 de la Ley 1581 de 2012, Agent IA podrá transferir datos personales a los siguientes terceros ubicados fuera de Colombia:<br /><br />
                • <strong className="text-foreground">Meta Platforms, Inc.</strong> (Estados Unidos) — Necesaria para la integración con WhatsApp Business API<br />
                • <strong className="text-foreground">TikTok (ByteDance Ltd.)</strong> (Singapur/Estados Unidos) — Necesaria para la integración con TikTok Business API para mensajería automatizada<br />
                • <strong className="text-foreground">Meta Platforms, Inc.</strong> (EE.UU./USA) — Integración Facebook Messenger API<br />
                • <strong className="text-foreground">Proveedores de infraestructura en la nube</strong> — Para almacenamiento seguro y procesamiento de datos<br />
                • <strong className="text-foreground">Proveedores de modelos de IA</strong> — Para el funcionamiento de los algoritmos de respuesta automática<br /><br />
                6.3. En todos los casos de transferencia internacional, Agent IA se asegurará de que los países destinatarios cuenten con niveles adecuados de protección de datos o, en su defecto, se celebrarán contratos que garanticen las condiciones mínimas previstas en la legislación colombiana.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. DERECHOS DE LOS TITULARES</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Conforme a la Ley 1581 de 2012, los titulares de los datos personales tienen derecho a:<br /><br />
                a) <strong className="text-foreground">Acceso:</strong> Conocer, actualizar y rectificar sus datos personales.<br />
                b) <strong className="text-foreground">Solicitud de prueba de autorización:</strong> Solicitar prueba de la autorización otorgada para el tratamiento.<br />
                c) <strong className="text-foreground">Información sobre el uso:</strong> Ser informado sobre el uso dado a sus datos personales.<br />
                d) <strong className="text-foreground">Reclamos:</strong> Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.<br />
                e) <strong className="text-foreground">Revocatoria:</strong> Revocar la autorización y/o solicitar la supresión de sus datos cuando no se respeten las condiciones del tratamiento.<br />
                f) <strong className="text-foreground">Acceso gratuito:</strong> Acceder en forma gratuita a sus datos personales objeto de tratamiento.<br /><br />
                Para ejercer estos derechos, el titular podrá enviar su solicitud a: <strong className="text-foreground">notificaciones@induretros.com</strong><br /><br />
                Agent IA atenderá las consultas dentro de los diez (10) días hábiles siguientes a la recepción y los reclamos dentro de los quince (15) días hábiles, conforme a los artículos 14 y 15 de la Ley 1581 de 2012.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. MEDIDAS DE SEGURIDAD</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Agent IA implementa medidas técnicas, humanas y administrativas adecuadas para proteger los datos personales contra acceso no autorizado, pérdida, alteración o destrucción, incluyendo:<br /><br />
                • Encriptación de datos en tránsito (TLS/SSL) y en reposo (AES-256)<br />
                • Autenticación segura con contraseñas encriptadas mediante algoritmos de hash<br />
                • Control de acceso basado en roles (RBAC)<br />
                • Monitoreo continuo de la infraestructura<br />
                • Respaldos periódicos de la información<br />
                • Políticas de seguridad de la información para el personal<br />
                • Procedimientos de respuesta ante incidentes de seguridad
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. RETENCIÓN DE DATOS</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                9.1. Los datos personales del Usuario serán conservados durante la vigencia de la relación contractual y por un período adicional de cinco (5) años para el cumplimiento de obligaciones legales, tributarias y contables.<br /><br />
                9.2. Los Datos del Cliente Final (contenido de conversaciones) serán conservados mientras el Usuario mantenga su cuenta activa. Tras la terminación de la relación contractual, Agent IA conservará los datos por un período máximo de seis (6) meses, transcurrido el cual serán eliminados de forma segura.<br /><br />
                9.3. El Usuario podrá solicitar la eliminación anticipada de los datos de sus Clientes Finales, sujeto a las obligaciones legales de retención.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. INTEGRACIÓN CON TIKTOK</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                10.1. Agent IA integra la API de TikTok for Business para permitir a los Usuarios gestionar mensajes directos y respuestas automatizadas a través de sus cuentas de TikTok Business.<br /><br />
                <strong className="text-foreground">10.2. Datos recopilados a través de TikTok:</strong><br />
                • Información del perfil de TikTok Business del Usuario (nombre de usuario, ID de cuenta)<br />
                • Mensajes directos recibidos y enviados a través de la plataforma TikTok<br />
                • Datos de interacción de los seguidores que se comunican con el Usuario vía mensajes directos<br />
                • Tokens de acceso OAuth para la autenticación segura<br /><br />
                <strong className="text-foreground">10.3. Uso de los datos de TikTok:</strong><br />
                • Procesamiento y respuesta automatizada de mensajes directos mediante el Agente de IA<br />
                • Gestión centralizada de conversaciones de TikTok junto con otros canales (WhatsApp, Instagram, Messenger)<br />
                • Análisis de interacciones para mejorar la atención al cliente<br /><br />
                <strong className="text-foreground">10.4. Almacenamiento y retención:</strong><br />
                • Los datos de TikTok se almacenan de forma segura en nuestros servidores con encriptación en tránsito y en reposo<br />
                • Los tokens de acceso se almacenan de forma encriptada y se renuevan automáticamente<br />
                • Los datos se retienen conforme a la sección 9 de esta Política<br /><br />
                <strong className="text-foreground">10.5. Eliminación de datos:</strong><br />
                • El Usuario puede desconectar su cuenta de TikTok en cualquier momento desde la configuración de la Plataforma<br />
                • Al desconectar, los tokens de acceso se eliminan inmediatamente<br />
                • El historial de conversaciones de TikTok se puede solicitar para eliminación contactando a notificaciones@soyagentia.com<br /><br />
                10.6. Agent IA cumple con las <strong className="text-foreground">Políticas para Desarrolladores de TikTok</strong>, incluyendo las directrices de privacidad, seguridad y uso de datos de la plataforma. Agent IA no vende, comparte ni utiliza los datos obtenidos a través de TikTok para fines distintos a los descritos en esta Política.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. INTEGRACIÓN CON INSTAGRAM (META)</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                11.1. Agent IA integra la API de Instagram Graph de Meta Platforms para permitir a los Usuarios gestionar mensajes directos y respuestas automatizadas.<br /><br />
                <strong className="text-foreground">11.2. Datos recopilados a través de Instagram:</strong><br />
                • Información del perfil de Instagram Business del Usuario (nombre de usuario, ID de cuenta)<br />
                • Mensajes directos (DMs) recibidos y enviados<br />
                • Datos de interacción de los seguidores que se comunican con el Usuario vía DMs<br />
                • Tokens de acceso OAuth para la autenticación segura<br />
                • Contenido multimedia compartido en conversaciones (imágenes, videos)<br /><br />
                <strong className="text-foreground">11.3. Uso de los datos de Instagram:</strong><br />
                • Procesamiento y respuesta automatizada de mensajes directos mediante el Agente de IA<br />
                • Gestión centralizada de conversaciones de Instagram junto con otros canales (WhatsApp, TikTok, Messenger)<br />
                • Análisis de interacciones para mejorar la atención al cliente<br /><br />
                11.4. Los datos de Instagram se almacenan con encriptación en tránsito y en reposo. Los tokens de acceso se almacenan de forma encriptada y se renuevan automáticamente. Los datos se retienen conforme a la sección 9 de esta Política.<br /><br />
                11.5. El Usuario puede desconectar su cuenta de Instagram en cualquier momento desde la configuración de la Plataforma. Al desconectar, los tokens se eliminan inmediatamente.<br /><br />
                11.6. Agent IA cumple con la Política de la Plataforma de Meta para Instagram y las directrices de la API de Instagram Graph. Agent IA no vende, comparte ni utiliza los datos de Instagram para fines distintos a los descritos en esta Política.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. INTEGRACIÓN CON FACEBOOK MESSENGER (META)</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                12.1. Agent IA integra la API de Messenger Platform de Meta para permitir a los Usuarios gestionar mensajes desde su Página de Facebook y automatizar respuestas.<br /><br />
                <strong className="text-foreground">12.2. Datos recopilados a través de Messenger:</strong><br />
                • Información del perfil de la Página de Facebook del Usuario (nombre de página, ID de página)<br />
                • Mensajes recibidos y enviados a través de Messenger<br />
                • Datos de interacción de las personas que envían mensajes a la Página<br />
                • Tokens de acceso OAuth para la autenticación segura<br />
                • Contenido multimedia compartido en conversaciones (imágenes, videos, archivos)<br /><br />
                <strong className="text-foreground">12.3. Uso de los datos de Messenger:</strong><br />
                • Procesamiento y respuesta automatizada de mensajes mediante el Agente de IA<br />
                • Gestión centralizada de conversaciones de Messenger junto con otros canales (WhatsApp, Instagram, TikTok)<br />
                • Análisis de interacciones para mejorar la atención al cliente<br /><br />
                12.4. Los datos de Messenger se almacenan con encriptación en tránsito y en reposo. Los tokens de acceso se almacenan de forma encriptada y se renuevan automáticamente. Los datos se retienen conforme a la sección 9 de esta Política.<br /><br />
                12.5. El Usuario puede desconectar su Página de Facebook de la integración de Messenger en cualquier momento desde la configuración de la Plataforma. Al desconectar, los tokens se eliminan inmediatamente.<br /><br />
                12.6. Agent IA cumple con la Política de la Plataforma de Meta y las directrices de Messenger Platform. Agent IA no vende, comparte ni utiliza los datos de Messenger para fines distintos a los descritos en esta Política.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">13. INTEGRACIÓN CON GOOGLE</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">13.1.</strong> En caso de integraciones con servicios de Google (Google Business Profile, Google Analytics, u otros), Agent IA podrá recopilar:<br />
                • Información del perfil de Google Business del Usuario<br />
                • Datos de interacción con clientes a través de Google Business Messages<br />
                • Métricas y datos analíticos (cuando el Usuario autorice la integración con Google Analytics)<br />
                • Tokens de acceso OAuth<br /><br />
                <strong className="text-foreground">13.2. Uso de los datos de Google:</strong><br />
                • Gestión de comunicaciones con clientes a través de los canales de Google<br />
                • Análisis de rendimiento e interacción<br />
                • Mejora de la atención al cliente automatizada<br /><br />
                13.3. Los datos se almacenan con los mismos estándares de seguridad aplicados a todas las integraciones. El Usuario puede revocar el acceso en cualquier momento.<br /><br />
                13.4. Agent IA cumple con la Política de Datos de Google para Desarrolladores y los Requisitos de Verificación de APIs de Google.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">14. INTEGRACIÓN CON WORDPRESS</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">14.1.</strong> Agent IA ofrece un widget de chat inteligente para sitios WordPress. Los datos recopilados incluyen:<br />
                • Información del visitante del sitio web que interactúa con el chat (dirección IP anonimizada, datos de navegación)<br />
                • Contenido de las conversaciones del chat<br />
                • Datos proporcionados voluntariamente por el visitante (nombre, email, teléfono, consultas)<br />
                • Metadatos de la sesión de chat (fecha, hora, duración, páginas visitadas)<br /><br />
                <strong className="text-foreground">14.2. Uso de los datos de WordPress:</strong><br />
                • Funcionamiento del chat inteligente con IA<br />
                • Captura de leads y datos de contacto<br />
                • Análisis de interacciones para mejorar la experiencia del usuario<br /><br />
                <strong className="text-foreground">14.3.</strong> El Usuario que integre el widget de chat en su sitio WordPress es Responsable del Tratamiento de los datos de los visitantes de su sitio. El Usuario debe:<br />
                • Informar a los visitantes sobre el uso de IA en el chat<br />
                • Obtener el consentimiento necesario según la legislación aplicable<br />
                • Incluir la información del tratamiento en su política de privacidad<br />
                • Cumplir con la normatividad de cookies aplicable<br /><br />
                14.4. Agent IA actúa como Encargado del Tratamiento para los datos recopilados a través del widget de WordPress.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">15. EVALUACIÓN DE IMPACTO Y REGISTROS</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                15.1. Agent IA mantiene un registro actualizado de las bases de datos conforme a la Circular Externa 002 de 2015 de la Superintendencia de Industria y Comercio y el Registro Nacional de Bases de Datos (RNBD).<br /><br />
                15.2. Agent IA realiza evaluaciones periódicas de impacto en la protección de datos para las actividades de tratamiento que impliquen riesgos significativos para los derechos y libertades de los titulares.<br /><br />
                15.3. Agent IA implementa el principio de responsabilidad demostrada (accountability) conforme al Decreto 1377 de 2013, manteniendo evidencia de las medidas adoptadas para garantizar el cumplimiento de la normatividad de protección de datos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">16. COOKIES Y TECNOLOGÍAS DE SEGUIMIENTO</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                La Plataforma utiliza cookies y tecnologías similares para mejorar la experiencia del Usuario. Para más información sobre el uso de cookies, tipos y configuración, el Usuario puede consultar la sección correspondiente en la Plataforma. El Usuario puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">17. TRATAMIENTO DE DATOS DE MENORES</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Los Servicios de Agent IA están dirigidos exclusivamente a personas mayores de edad. Agent IA no recopila intencionalmente datos personales de menores de edad. Si Agent IA detecta que se han recopilado datos de un menor sin la autorización del representante legal, procederá a eliminarlos de inmediato conforme al artículo 7 de la Ley 1581 de 2012.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">18. INCIDENTES DE SEGURIDAD</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                En caso de un incidente de seguridad que comprometa datos personales, Agent IA:<br /><br />
                a) Notificará a la Superintendencia de Industria y Comercio (SIC) dentro de los quince (15) días hábiles siguientes al conocimiento del incidente.<br />
                b) Informará a los titulares afectados cuando el incidente represente un riesgo significativo para sus derechos y libertades.<br />
                c) Documentará el incidente, sus efectos y las medidas correctivas adoptadas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">19. MODIFICACIONES A LA POLÍTICA</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Agent IA se reserva el derecho de modificar la presente Política en cualquier momento. Las modificaciones serán notificadas al Usuario mediante correo electrónico o aviso en la Plataforma. El uso continuado de los Servicios tras la notificación de los cambios constituirá la aceptación de la Política modificada.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">20. AUTORIDAD DE SUPERVISIÓN</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                La autoridad competente para la vigilancia del cumplimiento de la normatividad de protección de datos personales en Colombia es la <strong className="text-foreground">Superintendencia de Industria y Comercio (SIC)</strong>.<br /><br />
                <strong className="text-foreground">Dirección:</strong> Carrera 13 No. 27-00, Bogotá D.C., Colombia<br />
                <strong className="text-foreground">Línea gratuita:</strong> 01 8000 910 165<br />
                <strong className="text-foreground">Sitio web:</strong> www.sic.gov.co
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">21. CONTACTO</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Para consultas, reclamos o ejercicio de derechos relacionados con el tratamiento de datos personales:<br /><br />
                <strong className="text-foreground">Oficial de Protección de Datos:</strong> AGENT IA SAS<br />
                <strong className="text-foreground">Correo electrónico:</strong> notificaciones@induretros.com<br />
                <strong className="text-foreground">Correo de notificaciones:</strong> notificaciones@soyagentia.com<br />
                <strong className="text-foreground">Correo general:</strong> contacto@soyagentia.com<br />
                <strong className="text-foreground">Sitio web:</strong> www.soyagentia.com
              </p>
            </section>

            <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                Al registrarse y utilizar los Servicios de Agent IA, el Usuario declara haber leído, comprendido y aceptado íntegramente la presente Política de Privacidad y Tratamiento de Datos Personales.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
