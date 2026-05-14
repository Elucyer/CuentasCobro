"use client";

import { useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import CuentaCobroPDF from "@/components/CuentaCobroPDF";
import type { CuentaCobro } from "@/types/cuenta-cobro";

interface Props {
  data: CuentaCobro;
}

export default function PDFSection({ data }: Props) {
  const [preview, setPreview] = useState(false);
  const nombreArchivo = `cuenta-cobro-${data.numero}-${data.fecha}.pdf`;

  return (
    <>
      <PDFDownloadLink
        document={<CuentaCobroPDF data={data} />}
        fileName={nombreArchivo}
        className="block w-full"
      >
        {({ loading }) => (
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Generando PDF...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar PDF
              </>
            )}
          </button>
        )}
      </PDFDownloadLink>

      <button
        onClick={() => setPreview(!preview)}
        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
      >
        {preview ? "Ocultar vista previa" : "Ver vista previa"}
      </button>

      {preview && (
        <div className="mt-4 lg:mt-0">
          <div
            className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"
            style={{ height: 700 }}
          >
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              <CuentaCobroPDF data={data} />
            </PDFViewer>
          </div>
        </div>
      )}
    </>
  );
}
