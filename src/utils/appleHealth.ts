import { UserWeightDataType } from '../providers/AppProvider/AppProvider.constants';

const WEIGHT_LOINC = new Set(['3141-9', '29463-7']);
const WEIGHT_HK_TYPES = new Set(['HKQuantityTypeIdentifierBodyMass']);

function localName(el: Element) {
  return el.localName;
}

function child(el: Element, name: string) {
  return Array.from(el.children).find((node) => localName(node) === name) ?? null;
}

function childText(el: Element, name: string) {
  return child(el, name)?.textContent?.trim() ?? '';
}

export function parseHl7Date(value: string): number | null {
  const match = value.trim().match(/^(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?([+-]\d{4}|Z)?/);
  if (!match) {
    return null;
  }

  const [, year, month, day, hour = '00', minute = '00', second = '00', zone] = match;
  let iso = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  if (zone === 'Z') {
    iso += 'Z';
  } else if (zone) {
    iso += `${zone.slice(0, 3)}:${zone.slice(3)}`;
  }

  const timestamp = Date.parse(iso);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function toKilograms(value: number, unit: string) {
  const normalized = unit.toLowerCase();
  if (normalized === 'kg' || normalized === 'kgs') {
    return value;
  }
  if (normalized === 'g' || normalized === 'gram' || normalized === 'grams') {
    return value / 1000;
  }
  if (normalized === 'lb' || normalized === 'lbs' || normalized === '[lb_av]') {
    return value * 0.45359237;
  }
  return null;
}

function isWeightObservation(observation: Element) {
  const code = child(observation, 'code');
  const text = child(observation, 'text');
  const loinc = code?.getAttribute('code') ?? '';
  const displayName = (code?.getAttribute('displayName') ?? '').toLowerCase();
  const hkType = text ? childText(text, 'type') : '';

  return (
    WEIGHT_LOINC.has(loinc) ||
    WEIGHT_HK_TYPES.has(hkType) ||
    displayName.includes('body weight') ||
    displayName.includes('body mass')
  );
}

export function observationToWeight(observation: Element): UserWeightDataType | null {
  if (!isWeightObservation(observation)) {
    return null;
  }

  const text = child(observation, 'text');
  const pq = Array.from(observation.children).find(
    (node) => localName(node) === 'value' && node.getAttribute('value')
  );
  const rawValue = pq?.getAttribute('value') || (text ? childText(text, 'value') : '');
  const unit = pq?.getAttribute('unit') || (text ? childText(text, 'unit') : '') || 'kg';
  const weight = toKilograms(Number(rawValue), unit);
  if (!weight || !Number.isFinite(weight) || weight < 10 || weight > 300) {
    return null;
  }

  const effectiveTime = child(observation, 'effectiveTime');
  const low = effectiveTime ? child(effectiveTime, 'low')?.getAttribute('value') : null;
  const high = effectiveTime ? child(effectiveTime, 'high')?.getAttribute('value') : null;
  const timestamp = parseHl7Date(low || high || '');
  if (timestamp === null) {
    return null;
  }

  return {
    t: timestamp,
    w: Number(weight.toFixed(2)),
  };
}

export function collectObservations(doc: Document) {
  return Array.from(doc.getElementsByTagNameNS('*', 'observation'));
}
