import React from "react";

const TerminosCondiciones = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-16 font-sans text-gray-700">
      {/* Título Principal */}
      <h1 className="text-3xl font-semibold mb-6 text-black">
        Términos y Condiciones de Uso
      </h1>

      <p className="mb-8 leading-relaxed">
        Bienvenido a <strong>Atomic Shop</strong>. Al acceder y utilizar nuestro sitio web, usted acepta cumplir con los siguientes términos y condiciones. Le recomendamos leerlos detenidamente antes de realizar cualquier compra.
      </p>

      <div className="space-y-8">
        {/* Sección 1 */}
        <section>
          <h2 className="text-xl font-medium text-black mb-2">1. Generalidades</h2>
          <p>
            Este documento regula el uso de la plataforma de comercio electrónico de Atomic Shop. Nos reservamos el derecho de actualizar estos términos en cualquier momento sin previo aviso.
          </p>
        </section>

        {/* Sección 2 */}
        <section>
          <h2 className="text-xl font-medium text-black mb-2">2. Registro y Seguridad</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>El usuario es responsable de mantener la confidencialidad de su cuenta y contraseña.</li>
            <li>Toda actividad realizada bajo su cuenta será responsabilidad exclusiva del usuario.</li>
          </ul>
        </section>

        {/* Sección 3 */}
        <section>
          <h2 className="text-xl font-medium text-black mb-2">3. Propiedad de los Productos y Uso Previsto</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Uso Profesional:</strong> Los productos vendidos (reactivos, equipos de medición, material de vidrio) están destinados exclusivamente para uso en laboratorios, investigación científica e industrial.</li>
            <li><strong>Responsabilidad:</strong> Atomic Shop no se hace responsable del mal uso, manejo inadecuado o accidentes derivados del uso de los equipos por personal no capacitado.</li>
          </ul>
        </section>

        {/* Sección 4 */}
        <section>
          <h2 className="text-xl font-medium text-black mb-2">4. Precios y Pagos</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Todos los precios están expresados en USD (o la moneda local correspondiente) e incluyen los impuestos de ley, a menos que se indique lo contrario.</li>
            <li>Nos reservamos el derecho de cancelar pedidos en caso de errores tipográficos en el precio o falta de stock.</li>
          </ul>
        </section>

        {/* Sección 5 */}
        <section>
          <h2 className="text-xl font-medium text-black mb-2">5. Políticas de Envío y Entrega</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Debido a la naturaleza frágil o química de ciertos productos, el tiempo de entrega puede variar según la logística especializada requerida.</li>
            <li>Es responsabilidad del cliente verificar la integridad del paquete al momento de la recepción antes de firmar la conformidad.</li>
          </ul>
        </section>

        {/* Sección 6 */}
        <section>
          <h2 className="text-xl font-medium text-black mb-2">6. Garantías y Devoluciones</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Equipamiento:</strong> Los equipos electrónicos cuentan con la garantía de fábrica especificada por el proveedor (ej. DLAB, Hettich, Thomas Scientific).</li>
            <li><strong>Consumibles:</strong> No se aceptan devoluciones en reactivos químicos o material de vidrio una vez abierto el sello de seguridad, por razones de bioseguridad y contaminación.</li>
          </ul>
        </section>

        {/* Sección 7 */}
        <section>
          <h2 className="text-xl font-medium text-black mb-2">7. Limitación de Responsabilidad</h2>
          <p>
            Atomic Shop actúa como distribuidor de marcas internacionales. No seremos responsables por daños indirectos, incidentales o punitivos resultantes del uso de cualquier producto adquirido en nuestra tienda.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TerminosCondiciones;