export interface Abono {
  descripcion: string;
  monto: number;
}

export interface Concepto {
  descripcion: string;
  monto: number;
}

export interface CuentaCobro {
  numero: string;
  ciudad: string;
  fecha: string;

  prestadorNombre: string;
  prestadorIdentificacion: string;
  prestadorDireccion: string;
  prestadorTelefono: string;
  prestadorEmail: string;
  prestadorCuentaBancaria: string;
  prestadorBanco: string;
  prestadorTipoCuenta: string;

  beneficiarioNombre: string;
  beneficiarioNit: string;
  beneficiarioCargo: string;

  concepto: string;
  valorContrato: number;
  abonos: Abono[];
  conceptos: Concepto[];
  retencionPorcentaje: number;
  periodo: string;
}

export function calcularTotales(data: CuentaCobro) {
  const valorCuenta = data.conceptos.reduce((sum, c) => sum + (c.monto || 0), 0);
  const totalAbonado = data.abonos.reduce((sum, a) => sum + (a.monto || 0), 0);
  const baseRetencion = data.valorContrato > 0 ? data.valorContrato : valorCuenta;
  const valorRetencion = Math.round(baseRetencion * (data.retencionPorcentaje / 100));
  const valorNeto = valorCuenta - valorRetencion;
  const saldoPendiente = data.valorContrato > 0
    ? data.valorContrato - totalAbonado - valorRetencion
    : valorCuenta - valorRetencion;
  return { valorCuenta, totalAbonado, saldoPendiente, valorRetencion, valorNeto };
}

export const cuentaCobroVacia: CuentaCobro = {
  numero: "001",
  ciudad: "",
  fecha: new Date().toISOString().split("T")[0],

  prestadorNombre: "",
  prestadorIdentificacion: "",
  prestadorDireccion: "",
  prestadorTelefono: "",
  prestadorEmail: "",
  prestadorCuentaBancaria: "",
  prestadorBanco: "",
  prestadorTipoCuenta: "Ahorros",

  beneficiarioNombre: "",
  beneficiarioNit: "",
  beneficiarioCargo: "",

  concepto: "",
  valorContrato: 0,
  abonos: [],
  conceptos: [{ descripcion: "", monto: 0 }],
  retencionPorcentaje: 0,
  periodo: "",
};
