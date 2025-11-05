import { describe, it, expect } from 'vitest';
import { UnitType, BASE_UNITS, CONVERSIONS, UNIT_TYPES, normalize_unit, get_unit_type } from '../src/units';

describe('units module', () => {
  describe('UnitType enum', () => {
    it('should have all four unit types', () => {
      expect(UnitType.VOLUME).toBe('volume');
      expect(UnitType.WEIGHT).toBe('weight');
      expect(UnitType.TEMPERATURE).toBe('temperature');
      expect(UnitType.COUNT).toBe('count');
    });
  });

  describe('BASE_UNITS', () => {
    it('should have base unit for each type', () => {
      expect(BASE_UNITS[UnitType.VOLUME]).toBe('ml');
      expect(BASE_UNITS[UnitType.WEIGHT]).toBe('g');
      expect(BASE_UNITS[UnitType.TEMPERATURE]).toBe('celsius');
      expect(BASE_UNITS[UnitType.COUNT]).toBe('count');
    });
  });

  describe('CONVERSIONS', () => {
    it('should have conversion factors for volume units', () => {
      expect(CONVERSIONS['tsp']).toBe(4.92892);
      expect(CONVERSIONS['tbsp']).toBe(14.7868);
      expect(CONVERSIONS['cup']).toBe(236.588);
      expect(CONVERSIONS['ml']).toBe(1.0);
      expect(CONVERSIONS['l']).toBe(1000.0);
    });

    it('should have conversion factors for weight units', () => {
      expect(CONVERSIONS['oz']).toBe(28.3495);
      expect(CONVERSIONS['lb']).toBe(453.592);
      expect(CONVERSIONS['g']).toBe(1.0);
      expect(CONVERSIONS['kg']).toBe(1000.0);
    });

    it('should have conversion factors for count units', () => {
      expect(CONVERSIONS['count']).toBe(1.0);
      expect(CONVERSIONS['item']).toBe(1.0);
      expect(CONVERSIONS['piece']).toBe(1.0);
    });
  });

  describe('UNIT_TYPES', () => {
    it('should map volume units correctly', () => {
      expect(UNIT_TYPES['cup']).toBe(UnitType.VOLUME);
      expect(UNIT_TYPES['ml']).toBe(UnitType.VOLUME);
      expect(UNIT_TYPES['gallon']).toBe(UnitType.VOLUME);
    });

    it('should map weight units correctly', () => {
      expect(UNIT_TYPES['oz']).toBe(UnitType.WEIGHT);
      expect(UNIT_TYPES['g']).toBe(UnitType.WEIGHT);
      expect(UNIT_TYPES['lb']).toBe(UnitType.WEIGHT);
    });

    it('should map temperature units correctly', () => {
      expect(UNIT_TYPES['fahrenheit']).toBe(UnitType.TEMPERATURE);
      expect(UNIT_TYPES['celsius']).toBe(UnitType.TEMPERATURE);
      expect(UNIT_TYPES['kelvin']).toBe(UnitType.TEMPERATURE);
    });

    it('should map count units correctly', () => {
      expect(UNIT_TYPES['count']).toBe(UnitType.COUNT);
      expect(UNIT_TYPES['item']).toBe(UnitType.COUNT);
    });
  });

  describe('normalize_unit', () => {
    it('should convert to lowercase', () => {
      expect(normalize_unit('CUP')).toBe('cup');
      expect(normalize_unit('Cup')).toBe('cup');
    });

    it('should strip whitespace', () => {
      expect(normalize_unit('  cup  ')).toBe('cup');
      expect(normalize_unit(' tsp ')).toBe('tsp');
    });

    it('should handle both lowercase and whitespace', () => {
      expect(normalize_unit('  CUP  ')).toBe('cup');
    });
  });

  describe('get_unit_type', () => {
    it('should return correct type for valid units', () => {
      expect(get_unit_type('cup')).toBe(UnitType.VOLUME);
      expect(get_unit_type('oz')).toBe(UnitType.WEIGHT);
      expect(get_unit_type('fahrenheit')).toBe(UnitType.TEMPERATURE);
      expect(get_unit_type('count')).toBe(UnitType.COUNT);
    });

    it('should normalize before checking', () => {
      expect(get_unit_type('CUP')).toBe(UnitType.VOLUME);
      expect(get_unit_type('  cup  ')).toBe(UnitType.VOLUME);
    });

    it('should throw error for unknown units', () => {
      expect(() => get_unit_type('unknown')).toThrow('Unknown unit: unknown');
      expect(() => get_unit_type('xyz')).toThrow('Unknown unit: xyz');
    });
  });
});
