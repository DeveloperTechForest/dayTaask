// components/InvoicePDF.jsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    textAlign: "right",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 8,
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  col1: { width: "50%" },
  col2: { width: "25%", textAlign: "right" },
  col3: { width: "25%", textAlign: "right" },
  total: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    textAlign: "center",
    color: "#666",
    fontSize: 10,
  },
});

export default function InvoicePDF({ booking }) {
  const servicePrice = parseFloat(booking.service_price || 0);
  const addonsTotal = (booking.addons || []).reduce(
    (sum, a) => sum + parseFloat(a.addon_price || 0),
    0,
  );
  const total = parseFloat(booking.total_price || 0);
  const paid = parseFloat(booking.paid_amount || total);

  const scheduled = booking.scheduled_at
    ? new Date(booking.scheduled_at).toLocaleString("en-IN", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "N/A";

  const address = booking.address
    ? `${booking.address.street || ""}, ${booking.address.city || ""}, ${
        booking.address.state || ""
      } ${booking.address.pincode || ""}`.trim()
    : "N/A";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.subtitle}>
            Booking #{booking.booking_code || booking.id}
          </Text>
          <Text style={styles.subtitle}>
            Date: {new Date().toLocaleDateString("en-IN")}
          </Text>
        </View>

        {/* Booking Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Service:</Text>
            <Text>{booking.service_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Scheduled:</Text>
            <Text>{scheduled}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text>{address}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.col1, fontWeight: "bold" }}>
              Description
            </Text>
            <Text style={{ ...styles.col2, fontWeight: "bold" }}>Price</Text>
            <Text style={{ ...styles.col3, fontWeight: "bold" }}>Amount</Text>
          </View>

          {/* Service */}
          <View style={styles.tableRow}>
            <Text style={styles.col1}>{booking.service_name}</Text>
            <Text style={styles.col2}>
              ₹{servicePrice.toLocaleString("en-IN")}
            </Text>
            <Text style={styles.col3}>
              ₹{servicePrice.toLocaleString("en-IN")}
            </Text>
          </View>

          {/* Add-ons */}
          {(booking.addons || []).map((addon, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{addon.addon_name}</Text>
              <Text style={styles.col2}>
                ₹{parseFloat(addon.addon_price).toLocaleString("en-IN")}
              </Text>
              <Text style={styles.col3}>
                ₹{parseFloat(addon.addon_price).toLocaleString("en-IN")}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.total}>
          <Text>Total Paid: ₹{paid.toLocaleString("en-IN")}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for choosing DayTaask! • Payment ID: {booking.id}
        </Text>
      </Page>
    </Document>
  );
}
