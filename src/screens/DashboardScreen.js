import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import LineChart from '../components/LineChart';
import { useData } from '../DataContext';
import { colors, radius, space, shadow } from '../theme';
import { classifyBP, fromKg, fmtWeight, fmtDate, fmtDateTime, summarize, within } from '../logic';

function RangeToggle({ value, onChange }) {
  const opts = [7, 30, 90];
  return (
    <View style={styles.seg}>
      {opts.map((r) => (
        <TouchableOpacity
          key={r}
          style={[styles.segBtn, value === r && styles.segBtnOn]}
          onPress={() => onChange(r)}
        >
          <Text style={[styles.segTxt, value === r && styles.segTxtOn]}>{r}d</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function DashboardScreen() {
  const { data } = useData();
  const [bpRange, setBpRange] = useState(30);
  const [wtRange, setWtRange] = useState(30);
  const unit = data.unit;

  const bpSorted = useMemo(() => [...data.bp].sort((a, b) => a.t - b.t), [data.bp]);
  const wtSorted = useMemo(() => [...data.wt].sort((a, b) => a.t - b.t), [data.wt]);

  const latestBP = bpSorted[bpSorted.length - 1];
  const latestWt = wtSorted[wtSorted.length - 1];
  const cls = latestBP ? classifyBP(latestBP.s, latestBP.d) : null;

  const bpData = within(data.bp, bpRange);
  const wtData = within(data.wt, wtRange);

  const b7 = within(data.bp, 7);
  const w7 = within(data.wt, 7);
  const avgS = summarize(b7, (r) => r.s);
  const avgD = summarize(b7, (r) => r.d);
  const avgW = summarize(w7, (r) => fromKg(r.kg, unit));

  let wtDelta = null;
  if (wtSorted.length > 1) {
    wtDelta = fromKg(latestWt.kg - wtSorted[wtSorted.length - 2].kg, unit);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.statRow}>
        <View style={[styles.stat, shadow]}>
          <Text style={styles.statLabel}>BLOOD PRESSURE</Text>
          <Text style={styles.statValue}>
            {latestBP ? `${latestBP.s}/${latestBP.d}` : '--'}
            <Text style={styles.statUnit}> mmHg</Text>
          </Text>
          <Text style={styles.statMeta}>{latestBP ? fmtDateTime(latestBP.t) : 'No readings yet'}</Text>
          {cls ? <StatusPill label={cls.label} color={cls.color} soft={cls.soft} style={{ marginTop: 8 }} /> : null}
        </View>
        <View style={[styles.stat, shadow]}>
          <Text style={styles.statLabel}>WEIGHT</Text>
          <Text style={styles.statValue}>
            {latestWt ? fromKg(latestWt.kg, unit).toFixed(1) : '--'}
            <Text style={styles.statUnit}> {unit}</Text>
          </Text>
          <Text style={styles.statMeta}>{latestWt ? fmtDateTime(latestWt.t) : 'No readings yet'}</Text>
          {wtDelta != null ? (
            <Text style={[styles.delta, { color: wtDelta > 0 ? colors.elevated : colors.normal }]}>
              {wtDelta > 0 ? '+' : ''}{wtDelta.toFixed(1)} {unit} vs previous
            </Text>
          ) : null}
        </View>
      </View>

      <Card title="Blood Pressure Trend">
        <RangeToggle value={bpRange} onChange={setBpRange} />
        <LineChart
          labels={bpData.map((r) => fmtDate(r.t))}
          series={[
            { color: colors.systolic, points: bpData.map((r) => r.s) },
            { color: colors.diastolic, points: bpData.map((r) => r.d) },
          ]}
        />
        <View style={styles.legend}>
          <Legend color={colors.systolic} label="Systolic" />
          <Legend color={colors.diastolic} label="Diastolic" />
        </View>
      </Card>

      <Card title="Weight Trend">
        <RangeToggle value={wtRange} onChange={setWtRange} />
        <LineChart
          labels={wtData.map((r) => fmtDate(r.t))}
          series={[{ color: colors.weight, points: wtData.map((r) => fromKg(r.kg, unit)) }]}
        />
      </Card>

      <Card title="Averages · last 7 days">
        <Row label="Avg blood pressure" value={avgS && avgD ? `${Math.round(avgS.avg)}/${Math.round(avgD.avg)} mmHg` : '--'} />
        <Row label="Avg weight" value={avgW ? `${avgW.avg.toFixed(1)} ${unit}` : '--'} last />
      </Card>
    </ScrollView>
  );
}

function Legend({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendTxt}>{label}</Text>
    </View>
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
  statRow: { flexDirection: 'row', gap: space.md, marginBottom: space.md },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: space.md },
  statLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5 },
  statValue: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 4 },
  statUnit: { fontSize: 13, fontWeight: '500', color: colors.muted },
  statMeta: { fontSize: 11, color: colors.muted, marginTop: 3 },
  delta: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  seg: { flexDirection: 'row', gap: 8, marginBottom: space.sm },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  segBtnOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  segTxt: { fontSize: 13, fontWeight: '700', color: colors.muted },
  segTxtOn: { color: colors.white },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { fontSize: 11, color: colors.muted },
  entry: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  entryLabel: { fontSize: 13, color: colors.muted },
  entryValue: { fontSize: 15, fontWeight: '700', color: colors.text },
});
