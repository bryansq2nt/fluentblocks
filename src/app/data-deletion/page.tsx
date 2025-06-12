export default function DataDeletionPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Eliminación de Datos</h1>
      <p className="mb-4">
        En FluentBlocks, respetamos tu derecho a la privacidad y a la eliminación de tus datos personales. Si deseas borrar tu cuenta y toda tu información asociada, sigue estos pasos:
      </p>
      <ol className="list-decimal pl-6 mb-4">
        <li>Inicia sesión en tu cuenta de FluentBlocks.</li>
        <li>Ve a la página de <strong>Perfil de Usuario</strong>.</li>
        <li>Haz clic en el botón <span className="font-semibold">&quot;Eliminar Cuenta&quot;</span> al final de la página.</li>
        <li>Confirma la eliminación en el modal de confirmación.</li>
      </ol>
      <p className="mb-4">
        Una vez confirmada la eliminación, tu cuenta y todos tus datos personales serán eliminados de nuestra base de datos de forma permanente. También se cerrará tu sesión automáticamente.
      </p>
      <p className="mb-4">
        Si tienes algún problema o deseas solicitar la eliminación manualmente, puedes escribirnos a <a href="mailto:soporte@fluentblocks.com" className="text-blue-600 underline">soporte@fluentblocks.com</a>.
      </p>
      <p className="text-sm text-gray-500 mt-8">Última actualización: Junio 2025</p>
    </main>
  );
} 