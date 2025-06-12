export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
      <p className="mb-4">
        En FluentBlocks, valoramos y respetamos tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestra plataforma.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Información que recopilamos</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Tu nombre y correo electrónico cuando inicias sesión con Google, Facebook u otros proveedores.</li>
        <li>Tu foto de perfil pública (si la autorizas).</li>
        <li>Tu progreso y actividad dentro de la plataforma.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Uso de la información</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Para personalizar tu experiencia y mostrar tu progreso.</li>
        <li>Para mejorar la plataforma y ofrecerte nuevas funcionalidades.</li>
        <li>No compartimos tu información personal con terceros, salvo requerimiento legal.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Seguridad</h2>
      <p className="mb-4">
        Implementamos medidas de seguridad para proteger tu información. Sin embargo, ningún sistema es 100% seguro.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Tus derechos</h2>
      <p className="mb-4">
        Puedes solicitar la eliminación de tu cuenta y datos personales en cualquier momento escribiendo a <a href="mailto:soporte@fluentblocks.com" className="text-blue-600 underline">soporte@fluentblocks.com</a>.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. Cambios en la política</h2>
      <p className="mb-4">
        Nos reservamos el derecho de modificar esta política. Notificaremos los cambios importantes en la plataforma.
      </p>
      <p className="text-sm text-gray-500 mt-8">Última actualización: Junio 2025</p>
    </main>
  );
} 