export interface Abono {
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
  valor: number;
  retencionPorcentaje: number;
  periodo: string;
}

export function calcularTotales(data: CuentaCobro) {
  const totalAbonado = data.abonos.reduce((sum, a) => sum + (a.monto || 0), 0);
  const baseRetencion = data.valorContrato > 0 ? data.valorContrato : data.valor;
  const valorRetencion = Math.round(baseRetencion * (data.retencionPorcentaje / 100));
  const valorNeto = data.valor - valorRetencion;
  const saldoPendiente = data.valorContrato > 0
    ? data.valorContrato - totalAbonado - valorRetencion
    : data.valor - valorRetencion;
  return { totalAbonado, saldoPendiente, valorRetencion, valorNeto };
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
  valor: 0,
  retencionPorcentaje: 0,
  periodo: "",
};
