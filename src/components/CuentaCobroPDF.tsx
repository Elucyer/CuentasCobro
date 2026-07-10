"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CuentaCobro } from "@/types/cuenta-cobro";
import { calcularTotales } from "@/types/cuenta-cobro";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    color: "#1a1a1a",
  },
  titulo: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  subtitulo: {
    fontSize: 10,
    textAlign: "center",
    color: "#555555",
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    marginBottom: 16,
  },
  fila: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontFamily: "Helvetica-Bold",
    width: 160,
    color: "#333333",
  },
  valor: {
    flex: 1,
    color: "#1a1a1a",
  },
  seccion: {
    marginBottom: 16,
  },
  seccionTitulo: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    textTransform: "uppercase",
    backgroundColor: "#f0f0f0",
    padding: 4,
    marginBottom: 8,
  },
  cajaValor: {
    borderWidth: 1,
    borderColor: "#1a1a1a",
    padding: 10,
    marginTop: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  valorLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  valorMonto: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: "#1a1a1a",
  },
  tablaAbonos: {
    marginTop: 8,
    marginBottom: 4,
  },
  filaAbono: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  filaTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    marginTop: 2,
  },
  filaSaldo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    marginTop: 2,
  },
  firmaArea: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  firma: {
    width: "40%",
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    paddingTop: 6,
    textAlign: "center",
  },
  firmaLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  firmaValor: {
    fontSize: 9,
    color: "#555555",
  },
  nota: {
    marginTop: 20,
    fontSize: 8,
    color: "#777777",
    textAlign: "center",
  },
});

function formatCOP(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);
}

function formatFecha(fecha: string): string {
  const [year, month, day] = fecha.split("-");
  const meses = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre",
  ];
  return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
}

export default function CuentaCobroPDF({ data }: { data: CuentaCobro }) {
  const { valorCuenta, totalAbonado, saldoPendiente, valorRetencion } = calcularTotales(data);
  const tieneContrato = data.valorContrato > 0;
  const tieneAbonos = data.abonos.length > 0;
  const tieneRetencion = data.retencionPorcentaje > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.titulo}>Cuenta de Cobro</Text>
        <Text style={styles.subtitulo}>No. {data.numero}</Text>
        <View style={styles.divider} />

        <View style={styles.seccion}>
          <View style={styles.fila}>
            <Text style={styles.label}>Ciudad:</Text>
            <Text style={styles.valor}>{data.ciudad}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.valor}>{formatFecha(data.fecha)}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.label}>Período:</Text>
            <Text style={styles.valor}>{data.periodo}</Text>
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Señores</Text>
          <View style={styles.fila}>
            <Text style={styles.label}>Empresa / Persona:</Text>
            <Text style={styles.valor}>{data.beneficiarioNombre}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.label}>NIT / C.C.:</Text>
            <Text style={styles.valor}>{data.beneficiarioNit}</Text>
          </View>
          {data.beneficiarioCargo && (
            <View style={styles.fila}>
              <Text style={styles.label}>Atención:</Text>
              <Text style={styles.valor}>{data.beneficiarioCargo}</Text>
            </View>
          )}
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Concepto</Text>
          <Text style={{ lineHeight: 1.5 }}>{data.concepto}</Text>
          <View style={styles.tablaAbonos}>
            {data.conceptos.map((concepto, i) => (
              <View key={i} style={styles.filaAbono}>
                <Text style={{ flex: 1, paddingRight: 12, lineHeight: 1.4 }}>
                  {concepto.descripcion || `Concepto ${i + 1}`}
                </Text>
                <Text style={{ width: 80, textAlign: "right" }}>{formatCOP(concepto.monto)}</Text>
              </View>
            ))}
            {data.conceptos.length > 1 && (
              <View style={styles.filaTotal}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Valor total de esta cuenta</Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>{formatCOP(valorCuenta)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Desglose financiero si hay contrato, abonos o retención */}
        {(tieneContrato || tieneAbonos || tieneRetencion) && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Desglose de pagos</Text>
            <View style={styles.tablaAbonos}>
              {tieneContrato && (
                <View style={styles.filaAbono}>
                  <Text>Valor total del contrato</Text>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>{formatCOP(data.valorContrato)}</Text>
                </View>
              )}
              {tieneAbonos && data.abonos.map((abono, i) => (
                <View key={i} style={styles.filaAbono}>
                  <Text style={{ flex: 1, paddingRight: 12, lineHeight: 1.4, color: "#555555" }}>
                    {abono.descripcion || `Abono ${i + 1}`}
                  </Text>
                  <Text style={{ width: 90, textAlign: "right", color: "#555555" }}>
                    − {formatCOP(abono.monto)}
                  </Text>
                </View>
              ))}
              <View style={styles.filaAbono}>
                <Text style={{ color: "#555555" }}>Esta cuenta de cobro</Text>
                <Text style={{ color: "#555555" }}>− {formatCOP(valorCuenta)}</Text>
              </View>
              {tieneRetencion && (
                <View style={styles.filaAbono}>
                  <Text style={{ flex: 1, paddingRight: 12, color: "#555555" }}>
                    Retención en la fuente ({data.retencionPorcentaje}% sobre {tieneContrato ? "contrato" : "valor"})
                  </Text>
                  <Text style={{ width: 90, textAlign: "right", color: "#555555" }}>
                    − {formatCOP(valorRetencion)}
                  </Text>
                </View>
              )}
              <View style={styles.filaSaldo}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Saldo pendiente</Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>{formatCOP(saldoPendiente)}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.cajaValor}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.valorLabel}>VALOR A PAGAR</Text>
            <Text style={styles.valorMonto}>{formatCOP(saldoPendiente)}</Text>
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Datos para pago</Text>
          <View style={styles.fila}>
            <Text style={styles.label}>Banco:</Text>
            <Text style={styles.valor}>{data.prestadorBanco}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.label}>Tipo de cuenta:</Text>
            <Text style={styles.valor}>{data.prestadorTipoCuenta}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.label}>Número de cuenta:</Text>
            <Text style={styles.valor}>{data.prestadorCuentaBancaria}</Text>
          </View>
        </View>

        <View style={styles.firmaArea}>
          <View style={styles.firma}>
            <Text>{"\n\n\n"}</Text>
            <Text style={styles.firmaLabel}>{data.prestadorNombre}</Text>
            <Text style={styles.firmaValor}>C.C. {data.prestadorIdentificacion}</Text>
            {data.prestadorTelefono && (
              <Text style={styles.firmaValor}>Tel: {data.prestadorTelefono}</Text>
            )}
            {data.prestadorEmail && (
              <Text style={styles.firmaValor}>{data.prestadorEmail}</Text>
            )}
          </View>
        </View>

        <Text style={styles.nota}>
          Documento generado electrónicamente — no requiere firma húmeda
        </Text>
      </Page>
    </Document>
  );
}
