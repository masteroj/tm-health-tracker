import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusPill from '../components/StatusPill';
import DateTimeField from '../components/DateTimeField';
import { useData } from '../DataContext';
import { colors, radius, space, shadow } from '../theme';
import { classifyBP, fromKg, toKg, fmtDateTime } from '../logic';

export default function HistoryScreen() {
  const { data, updateEntry, deleteEntry } = useData();
  const [tab, setTab] = useState('bp');
  const [editing, setEditing] = useState(null); // {kind, orig, s, d, wt, when}
  const unit = data.unit;

  const list = [...(tab === 'bp' ? data.bp : data.wt)].sort((a, b) => b.t - a.t);

  const openEdit = (r) => {
    if (tab === 'bp') {
      setEditing({ kind: 'bp', orig: r.t, s: String(r.s), d: String(r.d), when: new Date(r.t) });
    } else {
      setEditing({ kind: 'wt', orig: r.t, wt: fromKg(r.kg, unit).toFixed(1), when: new Date(r.t) });
    }
  };

  const confirmDelete = (kind, t) =>
    Alert.alert('Delete reading?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEntry(kind, t) },
    ]);

  const saveEdit = () => {
    const e = editing;
    if (e.kind === 'bp') {
      const s = +e.s, d = +e.d;
      if (!s || !d) return Alert.alert('Missing values', 'Enter both systolic and diastolic.');
      if (s < 40 || s > 300 || d < 20 || d > 200) return Alert.alert('Out of range', 'Please check the values.');
      updateEntry('bp', e.orig, { s, d, t: e.when.getTime() });
    } else {
      const v = parseFloat(e.wt);
      if (!v) return Alert.alert('Missing value', 'Enter a weight.');
      const kg = toKg(v, unit);
      if (kg < 20 || kg > 400) return Alert.alert('Out of range', 'Please check the value.');
      updateEntry('wt', e.orig, { kg, t: e.when.getTime() });
    }
    setEditing(null);
  };

  const renderItem = ({ item: r }) => {
    let main, pill;
    if (tab === 'bp') {
      const c = classifyBP(r.s, r.d);
      main = `${r.s}/${r.d} mmHg`;
      pill = <StatusPill label={c.label} color={c.color} soft={c.soft} style={{ marginTop: 4 }} />;
    } else {
      main = `${fromKg(r.kg, unit).toFixed(1)} ${unit}`;
    }
    return (
      <View style={styles.entry}>
        <View style={{ flex: 1 }}>
          <Text style={styles.entryValue}>{main}</Text>
          <Text style={styles.entryDate}>{fmtDateTime(r.t)}</Text>
          {pill}
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(r)}>
          <Ionicons name="create-outline" size={22} color={colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => confirmDelete(tab, r.t)}>
          <Ionicons name="trash-outline" size={20} color={colors.high} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.tabs}>
        {[['bp', 'Blood Pressure'], ['wt', 'Weight']].map(([k, label]) => (
          <TouchableOpacity key={k} style={[styles.tab, tab === k && styles.tabOn]} onPress={() => setTab(k)}>
            <Text style={[styles.tabTxt, tab === k && styles.tabTxtOn]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={list}
        keyExtractor={(r) => String(r.t)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>No readings yet.</Text>}
      />

      <Modal visible={!!editing} transparent animationType="slide" onRequestClose={() => setEditing(null)}>
        <View style={styles.overlay}>
          <View style={[styles.modal, shadow]}>
            <Text style={styles.modalTitle}>{editing?.kind === 'bp' ? 'Edit blood pressure' : 'Edit weight'}</Text>
            {editing?.kind === 'bp' ? (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Systolic</Text>
                  <TextInput style={styles.input} value={editing.s} keyboardType="number-pad"
                    onChangeText={(t) => setEditing({ ...editing, s: t })} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Diastolic</Text>
                  <TextInput style={styles.input} value={editing.d} keyboardType="number-pad"
                    onChangeText={(t) => setEditing({ ...editing, d: t })} />
                </View>
              </View>
            ) : editing ? (
              <View>
                <Text style={styles.fieldLabel}>Weight ({unit})</Text>
                <TextInput style={styles.input} value={editing.wt} keyboardType="decimal-pad"
                  onChangeText={(t) => setEditing({ ...editing, wt: t })} />
              </View>
            ) : null}
            {editing ? (
              <View style={{ marginTop: space.md }}>
                <DateTimeField value={editing.when} onChange={(d) => setEditing({ ...editing, when: d })} />
              </View>
            ) : null}
            <TouchableOpacity style={styles.primary} onPress={saveEdit}>
              <Text style={styles.primaryTxt}>Save changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghost} onPress={() => setEditing(null)}>
              <Text style={styles.ghostTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  tabs: { flexDirection: 'row', gap: space.sm, padding: space.md, paddingBottom: 0 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.card },
  tabOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabTxt: { fontSize: 13, fontWeight: '700', color: colors.muted },
  tabTxtOn: { color: colors.white },
  listContent: { padding: space.md },
  entry: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, padding: space.md, marginBottom: space.sm, ...shadow,
  },
  entryValue: { fontSize: 16, fontWeight: '700', color: colors.text },
  entryDate: { fontSize: 12, color: colors.muted, marginTop: 2 },
  iconBtn: { padding: 8, marginLeft: 2 },
  empty: { textAlign: 'center', color: colors.muted, fontSize: 14, marginTop: 40 },
  overlay: { flex: 1, backgroundColor: 'rgba(26,37,48,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.card, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: space.lg },
  modalTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: space.md },
  row: { flexDirection: 'row', gap: space.sm },
  fieldLabel: { fontSize: 13, color: colors.muted, marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 13, fontSize: 16, color: colors.text, backgroundColor: '#FBFCFE' },
  primary: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 15, alignItems: 'center', marginTop: space.md },
  primaryTxt: { color: colors.white, fontSize: 16, fontWeight: '700' },
  ghost: { paddingVertical: 13, alignItems: 'center', marginTop: 4 },
  ghostTxt: { color: colors.primary, fontSize: 15, fontWeight: '600' },
});
