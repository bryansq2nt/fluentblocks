export default function TermsAndConditionsPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
      <p className="mb-4">
        Bienvenido a FluentBlocks. Al utilizar nuestra plataforma, aceptas los siguientes términos y condiciones:
      </p>
      <ol className="list-decimal pl-6 mb-4">
        <li>Solo puedes usar FluentBlocks para fines educativos y personales.</li>
        <li>Debes proporcionar información real y precisa al registrarte o iniciar sesión.</li>
        <li>No está permitido el uso de la plataforma para actividades ilegales, ofensivas o que violen derechos de terceros.</li>
        <li>Nos reservamos el derecho de suspender cuentas que incumplan estos términos.</li>
        <li>Podemos actualizar estos términos en cualquier momento. Te notificaremos sobre cambios importantes.</li>
        <li>Para más información sobre el uso de tus datos, consulta nuestra <a href="/privacy-policy" className="text-blue-600 underline">Política de Privacidad</a>.</li>
      </ol>
      <p className="mb-4">
        Si tienes dudas, puedes contactarnos en <a href="mailto:soporte@fluentblocks.com" className="text-blue-600 underline">soporte@fluentblocks.com</a>.
      </p>
      <p className="text-sm text-gray-500 mt-8">Última actualización: Junio 2025</p>
    </main>
  );
} 