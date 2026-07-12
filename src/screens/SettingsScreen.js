import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import { useData } from '../DataContext';
import { colors, radius, space } from '../theme';
import { RETAIN_DAYS } from '../storage';
import { buildReportHTML } from '../report';

export default function SettingsScreen() {
  const { data, setUnit, markReported, clearAll } = useData();
  const [busy, setBusy] = useState(false);
  const unit = data.unit;
  const total = data.bp.length + data.wt.length;

  const exportPDF = async () => {
    if (!total) return Alert.alert('No data', 'Add some readings first.');
    try {
      setBusy(true);
      const html = buildReportHTML(data, RETAIN_DAYS);
      const { uri } = await Print.printToFileAsync({ html });
      markReported();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Health Report' });
      } else {
        Alert.alert('Report ready', `Saved to:\n${uri}`);
      }
    } catch (e) {
      Alert.alert('Export failed', String(e.message || e));
    } finally {
      setBusy(false);
    }
  };

  const confirmClear = () =>
    Alert.alert('Clear all data?', 'This permanently deletes every reading on this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete all', style: 'destructive', onPress: clearAll },
    ]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card title="Default weight unit">
        <View style={styles.toggle}>
          {['kg', 'lb'].map((u) => (
            <TouchableOpacity key={u} style={[styles.toggleBtn, unit === u && styles.toggleBtnOn]} onPress={() => setUnit(u)}>
              <Text style={[styles.toggleTxt, unit === u && styles.toggleTxtOn]}>
                {u === 'kg' ? 'Kilograms (kg)' : 'Pounds (lb)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card title="Export">
        <TouchableOpacity style={styles.action} onPress={exportPDF} disabled={busy}>
          {busy ? <ActivityIndicator color={colors.primary} /> : <Ionicons name="document-text-outline" size={22} color={colors.primary} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Save {RETAIN_DAYS}-day PDF report</Text>
            <Text style={styles.actionSub}>Summary + full readings, ready to share or print</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </TouchableOpacity>
      </Card>

      <Card title="Storage">
        <Row label="Readings stored" value={`${total}`} />
        <Row label="Blood pressure" value={`${data.bp.length}`} />
        <Row label="Weight" value={`${data.wt.length}`} />
        <Row label="Auto-cleanup" value={`Older than ${RETAIN_DAYS} days`} last />
        <Text style={styles.note}>
          Readings older than {RETAIN_DAYS} days are removed automatically to keep the app fast.
          Save a PDF report first to keep a permanent record.
        </Text>
      </Card>

      <Card title="Data">
        <TouchableOpacity style={styles.action} onPress={confirmClear}>
          <Ionicons name="trash-outline" size={22} color={colors.high} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { color: colors.high }]}>Clear all data</Text>
            <Text style={styles.actionSub}>Delete every reading on this device</Text>
          </View>
        </TouchableOpacity>
      </Card>

      <Text style={styles.footer}>Trend Micro · Active Lifestyle Program{'\n'}Data is stored privately on this device only.</Text>
    </ScrollView>
  );
}

function Row({ label, value, last }) {
  return (
    <View style={[styles.entry, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.entryLabel}>{label}</Text>
      <Text style={styles.entryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md },
  toggle: { flexDirection: 'row', backgroundColor: '#EAF0F6', borderRadius: radius.sm, padding: 3 },
  toggleBtn: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  toggleBtnOn: { backgroundColor: colors.white },
  toggleTxt: { fontSize: 14, fontWeight: '600', color: colors.muted },
  toggleTxtOn: { color: colors.primary },
  action: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 6 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  actionSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  entry: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  entryLabel: { fontSize: 13, color: colors.muted },
  entryValue: { fontSize: 15, fontWeight: '700', color: colors.text },
  note: { fontSize: 12, color: colors.muted, marginTop: 10, lineHeight: 17 },
  footer: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: space.sm, lineHeight: 18 },
});
