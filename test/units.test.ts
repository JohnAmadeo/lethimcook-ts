import { describe, it, expect } from 'vitest';
import {
  UnitType,
  BASE_UNITS,
  CONVERSIONS,
  UNIT_TYPES,
  normalizeUnit,
  getUnitType,
} from '../src/units';

describe('UnitType enum', () => {
  it('should define all unit types', () => {
    expect(UnitType.VOLUME).toBe('volume');
    expect(UnitType.WEIGHT).toBe('weight');
    expect(UnitType.TEMPERATURE).toBe('temperature');
    expect(UnitType.COUNT).toBe('count');
  });
});

describe('BASE_UNITS', () => {
  it('should have base units for each type', () => {
    expect(BASE_UNITS[UnitType.VOLUME]).toBe('ml');
    expect(BASE_UNITS[UnitType.WEIGHT]).toBe('g');
    expect(BASE_UNITS[UnitType.TEMPERATURE]).toBe('celsius');
    expect(BASE_UNITS[UnitType.COUNT]).toBe('count');
  });
});

describe('CONVERSIONS', () => {
  it('should have volume conversions', () => {
    expect(CONVERSIONS.tsp).toBe(4.92892);
    expect(CONVERSIONS.tbsp).toBe(14.7868);
    expect(CONVERSIONS.cup).toBe(236.588);
    expect(CONVERSIONS.ml).toBe(1.0);
    expect(CONVERSIONS.l).toBe(1000.0);
  });

  it('should have weight conversions', () => {
    expect(CONVERSIONS.oz).toBe(28.3495);
    expect(CONVERSIONS.lb).toBe(453.592);
    expect(CONVERSIONS.g).toBe(1.0);
    expect(CONVERSIONS.kg).toBe(1000.0);
  });

  it('should have count conversions', () => {
    expect(CONVERSIONS.count).toBe(1.0);
    expect(CONVERSIONS.item).toBe(1.0);
    expect(CONVERSIONS.piece).toBe(1.0);
  });

  it('should have unit aliases with same conversion factors', () => {
    expect(CONVERSIONS.teaspoon).toBe(CONVERSIONS.tsp);
    expect(CONVERSIONS.teaspoons).toBe(CONVERSIONS.tsp);
    expect(CONVERSIONS.tablespoon).toBe(CONVERSIONS.tbsp);
    expect(CONVERSIONS.pound).toBe(CONVERSIONS.lb);
    expect(CONVERSIONS.lbs).toBe(CONVERSIONS.lb);
  });
});

describe('UNIT_TYPES', () => {
  it('should map volume units to VOLUME type', () => {
    expect(UNIT_TYPES.tsp).toBe(UnitType.VOLUME);
    expect(UNIT_TYPES.cup).toBe(UnitType.VOLUME);
    expect(UNIT_TYPES.ml).toBe(UnitType.VOLUME);
    expect(UNIT_TYPES.l).toBe(UnitType.VOLUME);
    expect(UNIT_TYPES.gallon).toBe(UnitType.VOLUME);
  });

  it('should map weight units to WEIGHT type', () => {
    expect(UNIT_TYPES.oz).toBe(UnitType.WEIGHT);
    expect(UNIT_TYPES.lb).toBe(UnitType.WEIGHT);
    expect(UNIT_TYPES.g).toBe(UnitType.WEIGHT);
    expect(UNIT_TYPES.kg).toBe(UnitType.WEIGHT);
  });

  it('should map temperature units to TEMPERATURE type', () => {
    expect(UNIT_TYPES.celsius).toBe(UnitType.TEMPERATURE);
    expect(UNIT_TYPES.c).toBe(UnitType.TEMPERATURE);
    expect(UNIT_TYPES.fahrenheit).toBe(UnitType.TEMPERATURE);
    expect(UNIT_TYPES.f).toBe(UnitType.TEMPERATURE);
    expect(UNIT_TYPES.kelvin).toBe(UnitType.TEMPERATURE);
    expect(UNIT_TYPES.k).toBe(UnitType.TEMPERATURE);
  });

  it('should map count units to COUNT type', () => {
    expect(UNIT_TYPES.count).toBe(UnitType.COUNT);
    expect(UNIT_TYPES.item).toBe(UnitType.COUNT);
    expect(UNIT_TYPES.piece).toBe(UnitType.COUNT);
  });

  it('should have unit aliases mapping to same type', () => {
    expect(UNIT_TYPES.teaspoon).toBe(UNIT_TYPES.tsp);
    expect(UNIT_TYPES.teaspoons).toBe(UNIT_TYPES.tsp);
    expect(UNIT_TYPES.tablespoon).toBe(UNIT_TYPES.tbsp);
    expect(UNIT_TYPES.pound).toBe(UNIT_TYPES.lb);
    expect(UNIT_TYPES.lbs).toBe(UNIT_TYPES.lb);
    expect(UNIT_TYPES.ounce).toBe(UNIT_TYPES.oz);
  });
});

describe('normalizeUnit', () => {
  it('should convert to lowercase', () => {
    expect(normalizeUnit('CUP')).toBe('cup');
    expect(normalizeUnit('ML')).toBe('ml');
    expect(normalizeUnit('GRAM')).toBe('gram');
  });

  it('should trim whitespace', () => {
    expect(normalizeUnit('  cup  ')).toBe('cup');
    expect(normalizeUnit('  fl oz  ')).toBe('fl oz');
  });

  it('should handle mixed case and whitespace', () => {
    expect(normalizeUnit('  CUP  ')).toBe('cup');
    expect(normalizeUnit('  FL OZ  ')).toBe('fl oz');
  });
});

describe('getUnitType', () => {
  it('should return correct type for volume units', () => {
    expect(getUnitType('cup')).toBe(UnitType.VOLUME);
    expect(getUnitType('ml')).toBe(UnitType.VOLUME);
    expect(getUnitType('tsp')).toBe(UnitType.VOLUME);
  });

  it('should return correct type for weight units', () => {
    expect(getUnitType('g')).toBe(UnitType.WEIGHT);
    expect(getUnitType('oz')).toBe(UnitType.WEIGHT);
    expect(getUnitType('lb')).toBe(UnitType.WEIGHT);
  });

  it('should return correct type for temperature units', () => {
    expect(getUnitType('celsius')).toBe(UnitType.TEMPERATURE);
    expect(getUnitType('fahrenheit')).toBe(UnitType.TEMPERATURE);
    expect(getUnitType('kelvin')).toBe(UnitType.TEMPERATURE);
  });

  it('should return correct type for count units', () => {
    expect(getUnitType('count')).toBe(UnitType.COUNT);
    expect(getUnitType('item')).toBe(UnitType.COUNT);
    expect(getUnitType('piece')).toBe(UnitType.COUNT);
  });

  it('should be case-insensitive', () => {
    expect(getUnitType('CUP')).toBe(UnitType.VOLUME);
    expect(getUnitType('ML')).toBe(UnitType.VOLUME);
    expect(getUnitType('GRAM')).toBe(UnitType.WEIGHT);
  });

  it('should handle whitespace', () => {
    expect(getUnitType('  cup  ')).toBe(UnitType.VOLUME);
    expect(getUnitType('  fl oz  ')).toBe(UnitType.VOLUME);
  });

  it('should throw error for unknown unit', () => {
    expect(() => getUnitType('blorg')).toThrow('Unknown unit: blorg');
    expect(() => getUnitType('unknown')).toThrow('Unknown unit: unknown');
  });

  it('should work with unit aliases', () => {
    expect(getUnitType('tsp')).toBe(getUnitType('teaspoon'));
    expect(getUnitType('tbsp')).toBe(getUnitType('tablespoon'));
    expect(getUnitType('lb')).toBe(getUnitType('lbs'));
    expect(getUnitType('pound')).toBe(getUnitType('lb'));
  });
});
