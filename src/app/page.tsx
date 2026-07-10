"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import FormularioCuentaCobro from "@/components/FormularioCuentaCobro";
import { cuentaCobroVacia, calcularTotales, type CuentaCobro } from "@/types/cuenta-cobro";

const PDFSection = dynamic(() => import("@/components/PDFSection"), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-blue-100 text-blue-400 font-semibold py-3 px-4 rounded-xl text-center text-sm">
      Cargando generador PDF...
    </div>
  ),
});

function formatCOP(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);
}

export default function Home() {
  const [data, setData] = useState<CuentaCobro>(cuentaCobroVacia);
  const { valorCuenta, totalAbonado, saldoPendiente, valorRetencion, valorNeto } = calcularTotales(data);
  const tieneAbonos = data.abonos.length > 0;
  const tieneContrato = data.valorContrato > 0;
  const tieneRetencion = data.retencionPorcentaje > 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Cuenta de Cobro</h1>
        <p className="text-gray-500 mt-1">Completa el formulario y descarga tu PDF</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FormularioCuentaCobro data={data} onChange={setData} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Resumen
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">No.</span>
                  <span className="font-medium">{data.numero}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha</span>
                  <span className="font-medium">{data.fecha || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Prestador</span>
                  <span className="font-medium truncate ml-2 text-right">
                    {data.prestadorNombre || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Beneficiario</span>
                  <span className="font-medium truncate ml-2 text-right">
                    {data.beneficiarioNombre || "—"}
                  </span>
                </div>
                {tieneContrato && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contrato</span>
                    <span className="font-medium">{formatCOP(data.valorContrato)}</span>
                  </div>
                )}
                {tieneAbonos && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Abonado</span>
                    <span className="font-medium text-amber-600">− {formatCOP(totalAbonado)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Esta cuenta</span>
                  <span className="font-medium">{formatCOP(valorCuenta)}</span>
                </div>
                {tieneRetencion && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Retención ({data.retencionPorcentaje}%)</span>
                    <span className="font-medium text-red-500">− {formatCOP(valorRetencion)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-700">Neto a recibir</span>
                  <span className="font-bold text-lg text-green-600">
                    {formatCOP(tieneRetencion ? valorNeto : valorCuenta)}
                  </span>
                </div>
                {tieneContrato && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Saldo pendiente</span>
                    <span className={`font-medium ${saldoPendiente < 0 ? "text-red-500" : "text-gray-500"}`}>
                      {formatCOP(saldoPendiente)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <PDFSection data={data} />

            <button
              onClick={() => setData(cuentaCobroVacia)}
              className="w-full text-gray-400 hover:text-gray-600 text-sm py-1 transition-colors"
            >
              Limpiar formulario
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
