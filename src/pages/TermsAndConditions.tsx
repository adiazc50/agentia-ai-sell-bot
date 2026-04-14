import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Términos y Condiciones - Agent IA SAS" description="Términos y Condiciones de Uso de Agent IA SAS (SoyAgentia)." />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">Términos y Condiciones de Uso</h1>
          <p className="text-muted-foreground mb-8">Última actualización: 9 de marzo de 2026</p>

          <div className="prose prose-invert max-w-none space-y-8 text-foreground/90">
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. IDENTIFICACIÓN DEL PRESTADOR</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Razón Social:</strong> AGENT IA SAS<br />
                <strong className="text-foreground">NIT:</strong> 901.976.734-4<br />
                <strong className="text-foreground">Domicilio:</strong> República de Colombia<br />
                <strong className="text-foreground">Correo electrónico:</strong> contacto@soyagentia.com<br />
                <strong className="text-foreground">Sitio web:</strong> www.soyagentia.com<br /><br />
                AGENT IA SAS (en adelante "Agent IA", "la Plataforma", "nosotros" o "el Prestador") es una sociedad comercial constituida conforme a las leyes de la República de Colombia, dedicada al desarrollo y comercialización de soluciones de inteligencia artificial aplicadas a servicios de mensajería, particularmente a través de la plataforma WhatsApp Business API de Meta Platforms, Inc.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. OBJETO Y ACEPTACIÓN</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Los presentes Términos y Condiciones (en adelante "T&C") regulan el acceso, uso y contratación de los servicios ofrecidos por Agent IA a través de su plataforma web y cualquier aplicación o herramienta asociada (en adelante "los Servicios").<br /><br />
                Al registrarse, acceder o utilizar los Servicios, el Usuario manifiesta su aceptación plena, expresa e incondicional de los presentes T&C, de la Política de Privacidad y Tratamiento de Datos Personales, y de cualquier documento complementario vigente. Si el Usuario no está de acuerdo con alguna disposición, deberá abstenerse de utilizar los Servicios.<br /><br />
                Agent IA se reserva el derecho de modificar los presentes T&C en cualquier momento. Las modificaciones serán notificadas al Usuario por correo electrónico o mediante aviso en la Plataforma con un mínimo de quince (15) días calendario de anticipación. El uso continuado de los Servicios tras la entrada en vigor de las modificaciones constituirá la aceptación tácita de las mismas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. DEFINICIONES</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">"Usuario":</strong> Toda persona natural o jurídica que se registre y utilice los Servicios de Agent IA.<br />
                <strong className="text-foreground">"Agente de IA":</strong> Software basado en inteligencia artificial configurado para interactuar con los clientes del Usuario a través de WhatsApp.<br />
                <strong className="text-foreground">"Conversación":</strong> Cada interacción iniciada por el Agente de IA o por un cliente del Usuario a través de la plataforma.<br />
                <strong className="text-foreground">"Datos del Cliente Final":</strong> Información personal o comercial de los clientes del Usuario que es procesada por el Agente de IA durante las interacciones.<br />
                <strong className="text-foreground">"Meta":</strong> Meta Platforms, Inc. y sus subsidiarias, propietaria de WhatsApp Business API.<br />
                <strong className="text-foreground">"Plan":</strong> El paquete de servicios contratado por el Usuario según la oferta comercial vigente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. REQUISITOS DE REGISTRO Y USO</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                4.1. Para utilizar los Servicios, el Usuario debe ser mayor de edad conforme a la legislación aplicable y contar con capacidad legal para celebrar contratos vinculantes.<br /><br />
                4.2. El Usuario se compromete a proporcionar información veraz, completa y actualizada durante el proceso de registro. La falsedad u omisión de datos facultará a Agent IA para suspender o cancelar la cuenta sin previo aviso y sin derecho a reembolso.<br /><br />
                4.3. El Usuario es el único responsable de la confidencialidad de sus credenciales de acceso. Cualquier actividad realizada desde su cuenta se presumirá ejecutada por el Usuario titular.<br /><br />
                4.4. El Usuario declara que cuenta con una línea de WhatsApp Business activa y que cumple con los requisitos técnicos necesarios para la integración con la API de WhatsApp Business de Meta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. DESCRIPCIÓN DE LOS SERVICIOS</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                5.1. Agent IA proporciona agentes de inteligencia artificial que operan a través de la API de WhatsApp Business para automatizar la atención al cliente, gestión de leads, envío de campañas masivas, notificación de pagos, captura de datos y demás funcionalidades descritas en la Plataforma.<br /><br />
                5.2. Los Servicios se prestan conforme al Plan contratado por el Usuario, el cual define el número de conversaciones mensuales, usuarios incluidos y funcionalidades disponibles.<br /><br />
                5.3. Agent IA no garantiza resultados comerciales específicos derivados del uso de los Servicios. La efectividad del Agente de IA depende de múltiples factores, incluyendo la calidad del entrenamiento proporcionado por el Usuario, el contenido configurado y las condiciones del mercado.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. CUMPLIMIENTO DE POLÍTICAS DE META (WHATSAPP)</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                6.1. El Usuario reconoce y acepta que el uso de los Servicios está sujeto al cumplimiento de las políticas, términos de servicio y directrices de uso de Meta Platforms, Inc., incluyendo pero no limitado a:<br /><br />
                • <strong className="text-foreground">Política de Comercio de WhatsApp Business</strong><br />
                • <strong className="text-foreground">Política de Mensajería de WhatsApp Business</strong><br />
                • <strong className="text-foreground">Términos de Servicio de WhatsApp Business</strong><br />
                • <strong className="text-foreground">Política de Datos de WhatsApp Business</strong><br /><br />
                6.2. El Usuario es el ÚNICO responsable de garantizar que el contenido de sus mensajes, plantillas, campañas y cualquier comunicación enviada a través del Agente de IA cumpla con las políticas de Meta. Agent IA NO será responsable por la suspensión, restricción o cancelación de la cuenta de WhatsApp Business del Usuario por parte de Meta debido al incumplimiento de sus políticas.<br /><br />
                6.3. El Usuario se compromete a no utilizar los Servicios para enviar contenido que viole las políticas de Meta, incluyendo pero no limitado a: spam, contenido engañoso, contenido discriminatorio, promoción de productos o servicios prohibidos, suplantación de identidad o cualquier actividad que infrinja derechos de terceros.<br /><br />
                6.4. El Usuario acepta que Meta puede modificar sus políticas en cualquier momento y se compromete a mantenerse actualizado y cumplir con dichas modificaciones. Agent IA no asumirá responsabilidad alguna por cambios en las políticas de Meta que afecten la operación del Agente de IA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. CUMPLIMIENTO DE POLÍTICAS DE TIKTOK</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                7.1. El Usuario reconoce y acepta que el uso de las funcionalidades de integración con TikTok está sujeto al cumplimiento de las políticas, términos de servicio y directrices de uso de TikTok (ByteDance Ltd.), incluyendo pero no limitado a:<br /><br />
                • <strong className="text-foreground">Términos de Servicio para Desarrolladores de TikTok</strong><br />
                • <strong className="text-foreground">Política de Privacidad de TikTok</strong><br />
                • <strong className="text-foreground">Directrices de Uso de la API de TikTok for Business</strong><br />
                • <strong className="text-foreground">Política de Datos de TikTok para Desarrolladores</strong><br /><br />
                7.2. Agent IA utiliza la API de TikTok for Business exclusivamente para:<br />
                • Permitir al Usuario gestionar mensajes directos de su cuenta de TikTok Business<br />
                • Automatizar respuestas a mensajes directos mediante el Agente de IA<br />
                • Centralizar la gestión de conversaciones de múltiples plataformas (WhatsApp, Instagram, TikTok)<br /><br />
                7.3. El Usuario es el ÚNICO responsable del contenido enviado a través de la integración con TikTok. Agent IA NO será responsable por la suspensión o restricción de la cuenta de TikTok del Usuario por incumplimiento de las políticas de TikTok.<br /><br />
                7.4. Agent IA no almacena, vende ni comparte datos obtenidos a través de TikTok con terceros no autorizados. Los datos se utilizan exclusivamente para la prestación de los Servicios descritos en estos Términos.<br /><br />
                7.5. El Usuario puede revocar el acceso de Agent IA a su cuenta de TikTok en cualquier momento desde la configuración de la Plataforma o desde la configuración de aplicaciones de TikTok.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. TRATAMIENTO DE DATOS PERSONALES</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                7.1. <strong className="text-foreground">Marco Legal:</strong> El tratamiento de datos personales se rige por la Ley 1581 de 2012 (Ley de Habeas Data), el Decreto 1377 de 2013 y demás normatividad colombiana aplicable en materia de protección de datos personales.<br /><br />
                7.2. <strong className="text-foreground">Responsable del Tratamiento:</strong> Respecto a los datos del Usuario, AGENT IA SAS actúa como Responsable del Tratamiento. Respecto a los Datos del Cliente Final, el Usuario actúa como Responsable del Tratamiento y AGENT IA SAS como Encargado del Tratamiento.<br /><br />
                7.3. <strong className="text-foreground">Obligaciones del Usuario como Responsable:</strong><br />
                • Obtener la autorización previa, expresa e informada de sus Clientes Finales para el tratamiento de sus datos personales a través del Agente de IA, conforme al artículo 9 de la Ley 1581 de 2012.<br />
                • Informar a sus Clientes Finales sobre la finalidad del tratamiento, los derechos que les asisten como titulares (acceso, actualización, rectificación, supresión), y la identidad del Responsable del Tratamiento.<br />
                • Implementar una política de privacidad propia que cumpla con la normatividad vigente.<br />
                • Garantizar que los datos recopilados sean tratados conforme a la autorización otorgada y a las finalidades informadas.<br />
                • Atender las solicitudes de consulta y reclamos de los titulares de los datos dentro de los plazos legales establecidos.<br /><br />
                7.4. <strong className="text-foreground">Autorización para compartir datos con terceros:</strong> El Usuario autoriza expresamente a AGENT IA SAS a compartir los datos del Usuario y los Datos del Cliente Final con los siguientes terceros, en la medida necesaria para la prestación de los Servicios:<br />
                • Meta Platforms, Inc. (para la integración con WhatsApp Business API)<br />
                • Proveedores de infraestructura en la nube (para almacenamiento y procesamiento)<br />
                • Proveedores de inteligencia artificial (para el funcionamiento del Agente de IA)<br />
                • Pasarelas de pago (para el procesamiento de transacciones)<br />
                • Proveedores de facturación electrónica<br /><br />
                7.5. El Usuario declara y garantiza que cuenta con todas las autorizaciones necesarias de sus Clientes Finales para permitir el tratamiento y transferencia de datos conforme a lo dispuesto en esta cláusula. El incumplimiento de esta obligación será responsabilidad exclusiva del Usuario, quien mantendrá indemne a AGENT IA SAS frente a cualquier reclamación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. OBLIGACIONES DEL USUARIO</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                El Usuario se obliga a:<br /><br />
                a) Utilizar los Servicios conforme a la ley, la moral, el orden público y los presentes T&C.<br />
                b) No utilizar los Servicios para fines ilícitos, fraudulentos, engañosos o que puedan causar daño a terceros.<br />
                c) No intentar acceder a áreas restringidas de la Plataforma, vulnerar sistemas de seguridad o realizar ingeniería inversa.<br />
                d) Mantener actualizado el contenido y entrenamiento de su Agente de IA para garantizar respuestas precisas y conformes a su oferta comercial.<br />
                e) No revender, sublicenciar o transferir los Servicios a terceros sin autorización previa y por escrito de Agent IA.<br />
                f) Cumplir con todas las normas tributarias, laborales, de protección al consumidor y demás legislación aplicable a su actividad comercial.<br />
                g) Responder por el contenido, exactitud y legalidad de la información proporcionada al Agente de IA y transmitida a sus Clientes Finales.<br />
                h) Mantener vigente y en buen estado su cuenta de WhatsApp Business y cumplir con los requisitos técnicos de la integración.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. PLANES, PRECIOS Y FACTURACIÓN</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                9.1. Los precios y características de cada Plan están detallados en la sección de precios de la Plataforma y pueden ser modificados por Agent IA con previo aviso de treinta (30) días calendario.<br /><br />
                9.2. El pago de los Servicios se realiza de forma anticipada, conforme al ciclo de facturación seleccionado (mensual o anual). La falta de pago dentro de los cinco (5) días calendario siguientes al vencimiento facultará a Agent IA para suspender los Servicios sin previo aviso.<br /><br />
                9.3. Los pagos realizados no son reembolsables, salvo disposición legal en contrario. En caso de cancelación anticipada, el Usuario podrá utilizar los Servicios hasta el final del período ya facturado.<br /><br />
                9.4. Las conversaciones no consumidas durante un período de facturación NO se acumulan para períodos posteriores.<br /><br />
                9.5. Agent IA emitirá factura electrónica conforme a la normatividad tributaria colombiana vigente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. PROPIEDAD INTELECTUAL</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                10.1. Todos los derechos de propiedad intelectual sobre la Plataforma, el software, los algoritmos de inteligencia artificial, la marca "Agent IA", el diseño, el código fuente y cualquier material relacionado son propiedad exclusiva de AGENT IA SAS o de sus licenciantes.<br /><br />
                10.2. La contratación de los Servicios no otorga al Usuario ningún derecho de propiedad intelectual sobre los mismos, sino únicamente una licencia de uso limitada, no exclusiva, intransferible y revocable para la duración del Plan contratado.<br /><br />
                10.3. El contenido proporcionado por el Usuario para el entrenamiento del Agente de IA permanecerá como propiedad del Usuario. Sin embargo, el Usuario otorga a Agent IA una licencia no exclusiva para utilizar dicho contenido con el fin exclusivo de prestar los Servicios contratados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. LIMITACIÓN DE RESPONSABILIDAD</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                11.1. Agent IA NO será responsable por:<br /><br />
                a) Daños directos, indirectos, incidentales, especiales, consecuenciales o punitivos derivados del uso o la imposibilidad de uso de los Servicios.<br />
                b) Pérdidas comerciales, de ingresos, de datos, de reputación o de oportunidades de negocio del Usuario.<br />
                c) Errores, inexactitudes u omisiones en las respuestas proporcionadas por el Agente de IA, ya que estas dependen del entrenamiento y la información suministrada por el Usuario.<br />
                d) Interrupciones del servicio causadas por fallos en la infraestructura de Meta, proveedores de telecomunicaciones o eventos de fuerza mayor.<br />
                e) La suspensión o cancelación de la cuenta de WhatsApp Business del Usuario por parte de Meta.<br />
                f) El uso indebido o ilegal que el Usuario haga de los Servicios.<br />
                g) Las reclamaciones de Clientes Finales derivadas de las interacciones con el Agente de IA.<br /><br />
                11.2. En cualquier caso, la responsabilidad total acumulada de Agent IA frente al Usuario no excederá el monto efectivamente pagado por el Usuario durante los tres (3) meses inmediatamente anteriores al evento que origine la reclamación.<br /><br />
                11.3. El Usuario acepta que los Servicios de inteligencia artificial son probabilísticos por naturaleza y que no se garantiza la exactitud, completitud o idoneidad de las respuestas generadas por el Agente de IA en el 100% de los casos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">13. INDEMNIZACIÓN</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                El Usuario se compromete a indemnizar, defender y mantener indemne a AGENT IA SAS, sus directores, empleados, contratistas y afiliados, frente a cualquier reclamación, demanda, responsabilidad, daño, pérdida, costo o gasto (incluyendo honorarios de abogados) que surjan de o estén relacionados con:<br /><br />
                a) El incumplimiento de los presentes T&C por parte del Usuario.<br />
                b) El incumplimiento de las políticas de Meta por parte del Usuario.<br />
                c) El tratamiento ilegal o no autorizado de datos personales de Clientes Finales.<br />
                d) Reclamaciones de terceros derivadas del contenido, productos o servicios del Usuario promocionados o gestionados a través del Agente de IA.<br />
                e) El uso negligente, indebido o ilegal de los Servicios.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">14. SUSPENSIÓN Y TERMINACIÓN</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                13.1. Agent IA podrá suspender o terminar el acceso a los Servicios, sin previo aviso y sin derecho a reembolso, en los siguientes casos:<br /><br />
                a) Incumplimiento de los presentes T&C o de las políticas de Meta.<br />
                b) Uso fraudulento, ilegal o abusivo de los Servicios.<br />
                c) Falta de pago conforme a lo establecido en la cláusula 9.<br />
                d) Solicitud de autoridades judiciales o administrativas competentes.<br />
                e) Actividad que ponga en riesgo la seguridad o estabilidad de la Plataforma.<br /><br />
                13.2. El Usuario podrá cancelar su suscripción en cualquier momento. La cancelación será efectiva al final del período de facturación vigente. No se otorgarán reembolsos por períodos parciales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">15. NIVEL DE SERVICIO (SLA)</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                14.1. Agent IA se esforzará por mantener una disponibilidad del servicio del 99.9% mensual, excluyendo ventanas de mantenimiento programado y eventos de fuerza mayor.<br /><br />
                14.2. Las ventanas de mantenimiento programado serán notificadas con al menos 24 horas de anticipación.<br /><br />
                14.3. El SLA no aplica cuando la interrupción sea causada por: (a) fallos en la API de WhatsApp o servicios de Meta; (b) problemas de conectividad del Usuario; (c) eventos de fuerza mayor; o (d) incumplimiento de los T&C por parte del Usuario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">16. CONFIDENCIALIDAD</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ambas partes se comprometen a mantener la confidencialidad de toda información comercial, técnica o de cualquier otra naturaleza que sea compartida en el marco de la relación contractual. Esta obligación subsistirá por un período de dos (2) años después de la terminación de la relación contractual.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">17. FUERZA MAYOR Y CASO FORTUITO</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ninguna de las partes será responsable por el incumplimiento de sus obligaciones cuando dicho incumplimiento sea causado por eventos de fuerza mayor o caso fortuito, según lo definido en el artículo 64 del Código Civil colombiano. Estos eventos incluyen, sin limitarse a: desastres naturales, pandemias, conflictos armados, actos de terrorismo, fallos masivos en infraestructura de telecomunicaciones, modificaciones legislativas o regulatorias imprevistas, y decisiones de Meta que afecten la operación de la API de WhatsApp Business.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">18. PROTECCIÓN AL CONSUMIDOR</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                El Usuario que contrate los Servicios en su calidad de consumidor conforme a la Ley 1480 de 2011 (Estatuto del Consumidor) gozará de las garantías y derechos previstos en dicha normatividad. El derecho de retracto podrá ejercerse dentro de los cinco (5) días hábiles siguientes a la contratación, siempre que no se haya iniciado la prestación efectiva del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">19. RESOLUCIÓN DE CONFLICTOS</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                18.1. Las partes procurarán resolver cualquier controversia de manera amistosa mediante negociación directa durante un plazo de treinta (30) días calendario.<br /><br />
                18.2. De no alcanzarse un acuerdo, las controversias serán sometidas a la jurisdicción de los jueces y tribunales competentes de la República de Colombia, renunciando las partes a cualquier otro fuero que pudiera corresponderles.<br /><br />
                18.3. La legislación aplicable será la de la República de Colombia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">20. DISPOSICIONES GENERALES</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                19.1. <strong className="text-foreground">Cesión:</strong> El Usuario no podrá ceder sus derechos u obligaciones derivados de los presentes T&C sin el consentimiento previo y por escrito de Agent IA. Agent IA podrá ceder libremente sus derechos y obligaciones.<br /><br />
                19.2. <strong className="text-foreground">Divisibilidad:</strong> Si alguna disposición de los presentes T&C fuera declarada nula o inaplicable, las disposiciones restantes mantendrán plena vigencia y efecto.<br /><br />
                19.3. <strong className="text-foreground">Integridad:</strong> Los presentes T&C, junto con la Política de Privacidad, constituyen la totalidad del acuerdo entre las partes y sustituyen cualquier acuerdo anterior, ya sea verbal o escrito.<br /><br />
                19.4. <strong className="text-foreground">No renuncia:</strong> La falta de ejercicio de cualquier derecho previsto en los presentes T&C no constituirá una renuncia al mismo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">21. CONTACTO</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Para cualquier consulta, reclamación o solicitud relacionada con los presentes T&C, el Usuario podrá comunicarse a través de:<br /><br />
                <strong className="text-foreground">Correo electrónico:</strong> contacto@soyagentia.com<br />
                <strong className="text-foreground">Sitio web:</strong> www.soyagentia.com
              </p>
            </section>

            <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                Al registrarse y utilizar los Servicios de Agent IA, el Usuario declara haber leído, comprendido y aceptado íntegramente los presentes Términos y Condiciones.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
