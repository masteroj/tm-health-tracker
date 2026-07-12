import React, { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import DateTimeField from '../components/DateTimeField';
import { useData } from '../DataContext';
import { colors, radius, space } from '../theme';
import { classifyBP, toKg } from '../logic';

function Field({ label, children }) {
  return (
    <View style={{ flex: 1, marginBottom: space.md }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

export default function LogScreen() {
  const { data, addBP, addWeight, setUnit } = useData();
  const unit = data.unit;

  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');
  const [wt, setWt] = useState('');
  const [when, setWhen] = useState(new Date());

  const preview = sys && dia ? classifyBP(+sys, +dia) : null;

  const saveBP = () => {
    const s = +sys, d = +dia;
    if (!s || !d) return Alert.alert('Missing values', 'Enter both systolic and diastolic.');
    if (s < 40 || s > 300 || d < 20 || d > 200) return Alert.alert('Out of range', 'Please check the values.');
    addBP(s, d, when.getTime());
    setSys(''); setDia('');
    Alert.alert('Saved', `Blood pressure recorded (${classifyBP(s, d).label}).`);
  };

  const saveWeight = () => {
    const v = parseFloat(wt);
    if (!v) return Alert.alert('Missing value', 'Enter a weight.');
    const kg = toKg(v, unit);
    if (kg < 20 || kg > 400) return Alert.alert('Out of range', 'Please check the value.');
    addWeight(kg, when.getTime());
    setWt('');
    Alert.alert('Saved', 'Weight recorded.');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card title="Blood Pressure">
          <View style={styles.row}>
            <Field label="Systolic (mmHg)">
              <TextInput style={styles.input} value={sys} onChangeText={setSys} keyboardType="number-pad" placeholder="120" placeholderTextColor={colors.muted} />
            </Field>
            <Field label="Diastolic (mmHg)">
              <TextInput style={styles.input} value={dia} onChangeText={setDia} keyboardType="number-pad" placeholder="80" placeholderTextColor={colors.muted} />
            </Field>
          </View>
          {preview ? (
            <StatusPill label={`Reads as: ${preview.label}`} color={preview.color} soft={preview.soft} style={{ marginBottom: space.sm }} />
          ) : null}
          <TouchableOpacity style={styles.primary} onPress={saveBP}>
            <Text style={styles.primaryTxt}>Save Reading</Text>
          </TouchableOpacity>
        </Card>

        <Card title="Weight">
          <View style={styles.toggle}>
            {['kg', 'lb'].map((u) => (
              <TouchableOpacity key={u} style={[styles.toggleBtn, unit === u && styles.toggleBtnOn]} onPress={() => setUnit(u)}>
                <Text style={[styles.toggleTxt, unit === u && styles.toggleTxtOn]}>
                  {u === 'kg' ? 'Kilograms (kg)' : 'Pounds (lb)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Field label={`Weight (${unit})`}>
            <TextInput style={styles.input} value={wt} onChangeText={setWt} keyboardType="decimal-pad" placeholder={unit === 'kg' ? '70.0' : '154.0'} placeholderTextColor={colors.muted} />
          </Field>
          <TouchableOpacity style={styles.primary} onPress={saveWeight}>
            <Text style={styles.primaryTxt}>Save Weight</Text>
          </TouchableOpacity>
        </Card>

        <Card title="Entry date & time">
          <DateTimeField value={when} onChange={setWhen} />
          <Text style={styles.hint}>New readings are saved against this date and time (defaults to now).</Text>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md },
  row: { flexDirection: 'row', gap: space.sm },
  fieldLabel: { fontSize: 13, color: colors.muted, marginBottom: 6, fontWeight: '500' },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    paddingVertical: 12, paddingHorizontal: 13, fontSize: 16, color: colors.text, backgroundColor: '#FBFCFE',
  },
  primary: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 15, alignItems: 'center', marginTop: 2 },
  primaryTxt: { color: colors.white, fontSize: 16, fontWeight: '700' },
  toggle: { flexDirection: 'row', backgroundColor: '#EAF0F6', borderRadius: radius.sm, padding: 3, marginBottom: space.md },
  toggleBtn: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  toggleBtnOn: { backgroundColor: colors.white },
  toggleTxt: { fontSize: 14, fontWeight: '600', color: colors.muted },
  toggleTxtOn: { color: colors.primary },
  hint: { fontSize: 12, color: colors.muted, marginTop: 8, lineHeight: 17 },
});
