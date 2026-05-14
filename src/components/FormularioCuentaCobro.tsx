"use client";

import type { Abono, CuentaCobro } from "@/types/cuenta-cobro";
import { calcularTotales } from "@/types/cuenta-cobro";

interface Props {
  data: CuentaCobro;
  onChange: (data: CuentaCobro) => void;
}

const inputBase =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

function Campo({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  textarea,
}: {
  label: string;
  name: keyof CuentaCobro;
  value: string | number;
  onChange: (name: keyof CuentaCobro, value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          className={`${inputBase} resize-none`}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <input
          className={inputBase}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
        />
      )}
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
        {titulo}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function CampoMoneda({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
        <input
          className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          min="0"
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}

export default function FormularioCuentaCobro({ data, onChange }: Props) {
  const handle = (name: keyof CuentaCobro, value: string) => {
    const numericos: (keyof CuentaCobro)[] = ["valor", "valorContrato"];
    onChange({
      ...data,
      [name]: numericos.includes(name) ? parseFloat(value) || 0 : value,
    });
  };

  const addAbono = () => {
    onChange({ ...data, abonos: [...data.abonos, { descripcion: "", monto: 0 }] });
  };

  const updateAbono = (i: number, field: keyof Abono, value: string) => {
    const abonos = data.abonos.map((a, idx) =>
      idx === i
        ? { ...a, [field]: field === "monto" ? parseFloat(value) || 0 : value }
        : a
    );
    onChange({ ...data, abonos });
  };

  const removeAbono = (i: number) => {
    onChange({ ...data, abonos: data.abonos.filter((_, idx) => idx !== i) });
  };

  const { totalAbonado, saldoPendiente } = calcularTotales(data);
  const tieneContrato = data.valorContrato > 0;
  const tieneAbonos = data.abonos.length > 0;

  return (
    <div className="space-y-4">
      <Seccion titulo="Información general">
        <Campo label="Número" name="numero" value={data.numero} onChange={handle} required />
        <Campo label="Ciudad" name="ciudad" value={data.ciudad} onChange={handle} placeholder="Bogotá" required />
        <Campo label="Fecha" name="fecha" value={data.fecha} onChange={handle} type="date" required />
        <Campo label="Período" name="periodo" value={data.periodo} onChange={handle} placeholder="Mayo 2026" required />
      </Seccion>

      <Seccion titulo="Quién cobra (prestador de servicios)">
        <Campo label="Nombre completo" name="prestadorNombre" value={data.prestadorNombre} onChange={handle} required />
        <Campo label="Cédula / NIT" name="prestadorIdentificacion" value={data.prestadorIdentificacion} onChange={handle} required />
        <Campo label="Dirección" name="prestadorDireccion" value={data.prestadorDireccion} onChange={handle} />
        <Campo label="Teléfono" name="prestadorTelefono" value={data.prestadorTelefono} onChange={handle} type="tel" />
        <Campo label="Email" name="prestadorEmail" value={data.prestadorEmail} onChange={handle} type="email" />
      </Seccion>

      <Seccion titulo="Datos bancarios">
        <Campo label="Banco" name="prestadorBanco" value={data.prestadorBanco} onChange={handle} placeholder="Bancolombia" required />
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Tipo de cuenta <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data.prestadorTipoCuenta}
            onChange={(e) => handle("prestadorTipoCuenta", e.target.value)}
          >
            <option>Ahorros</option>
            <option>Corriente</option>
          </select>
        </div>
        <Campo label="Número de cuenta" name="prestadorCuentaBancaria" value={data.prestadorCuentaBancaria} onChange={handle} required />
      </Seccion>

      <Seccion titulo="A quién se cobra (beneficiario)">
        <Campo label="Empresa / Persona" name="beneficiarioNombre" value={data.beneficiarioNombre} onChange={handle} required />
        <Campo label="NIT / C.C." name="beneficiarioNit" value={data.beneficiarioNit} onChange={handle} required />
        <Campo label="Cargo o atención (opcional)" name="beneficiarioCargo" value={data.beneficiarioCargo} onChange={handle} />
      </Seccion>

      {/* Concepto y valor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
          Concepto y valor
        </h2>
        <div className="space-y-4">
          <Campo
            label="Descripción del servicio"
            name="concepto"
            value={data.concepto}
            onChange={handle}
            textarea
            placeholder="Prestación de servicios profesionales como desarrollador de software durante el mes de mayo de 2026..."
            required
          />

          <CampoMoneda
            label="Valor total del contrato / proyecto (opcional)"
            value={data.valorContrato}
            onChange={(v) => onChange({ ...data, valorContrato: v })}
            placeholder="10.000.000"
          />

          <CampoMoneda
            label="Valor de esta cuenta de cobro"
            value={data.valor}
            onChange={(v) => onChange({ ...data, valor: v })}
            placeholder="3.000.000"
            required
          />

          {/* Retención */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Retención en la fuente <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <div className="flex gap-2 items-center">
              <div className="relative w-32">
                <input
                  className="w-full border border-gray-300 rounded-md pl-3 pr-7 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="10"
                  value={data.retencionPorcentaje || ""}
                  onChange={(e) => onChange({ ...data, retencionPorcentaje: parseFloat(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
              </div>
              {data.retencionPorcentaje > 0 && (
                <div className="text-sm text-gray-500 flex gap-4 flex-wrap">
                  {(() => {
                    const base = data.valorContrato > 0 ? data.valorContrato : data.valor;
                    const retencion = Math.round(base * data.retencionPorcentaje / 100);
                    return (
                      <>
                        <span>
                          Retención{data.valorContrato > 0 ? " (sobre contrato)" : ""}:{" "}
                          <span className="font-semibold text-red-500">
                            − ${retencion.toLocaleString("es-CO")}
                          </span>
                        </span>
                        <span>
                          Neto a recibir:{" "}
                          <span className="font-semibold text-green-600">
                            ${(data.valor - retencion).toLocaleString("es-CO")}
                          </span>
                        </span>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Abonos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Abonos recibidos <span className="text-gray-400 font-normal normal-case">(opcional)</span>
          </h2>
          <button
            type="button"
            onClick={addAbono}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            + Agregar abono
          </button>
        </div>

        {data.abonos.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No hay abonos registrados
          </p>
        ) : (
          <div className="space-y-3">
            {data.abonos.map((abono, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    className={inputBase}
                    type="text"
                    placeholder="Descripción (ej: Anticipo inicial)"
                    value={abono.descripcion}
                    onChange={(e) => updateAbono(i, "descripcion", e.target.value)}
                  />
                </div>
                <div className="w-40 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                  <input
                    className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    min="0"
                    placeholder="1.000.000"
                    value={abono.monto || ""}
                    onChange={(e) => updateAbono(i, "monto", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAbono(i)}
                  className="mt-2 text-gray-300 hover:text-red-400 transition-colors"
                  title="Eliminar"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Resumen financiero */}
        {(tieneContrato || tieneAbonos) && (
          <div className="mt-4 border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Valor total del contrato</span>
              <span>${data.valorContrato.toLocaleString("es-CO")}</span>
            </div>
            {data.abonos.length > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Total abonado</span>
                <span className="text-amber-600">− ${totalAbonado.toLocaleString("es-CO")}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Esta cuenta de cobro</span>
              <span className="text-blue-600">− ${data.valor.toLocaleString("es-CO")}</span>
            </div>
            <div className={`flex justify-between font-bold pt-2 border-t border-gray-100 ${saldoPendiente < 0 ? "text-red-600" : "text-gray-800"}`}>
              <span>Saldo pendiente</span>
              <span>${saldoPendiente.toLocaleString("es-CO")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
