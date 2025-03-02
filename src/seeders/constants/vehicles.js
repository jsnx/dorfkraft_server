const VEHICLES = [
  {
    registrationNumber: 'MOL-B-1001',
    model: 'Mercedes-Benz Sprinter',
    capacity: {
      weight: 1200,
      volume: 14,
    },
    fuelConsumption: 9.5,
    maintenanceSchedule: {
      lastService: '2024-03-01',
      nextService: '2024-06-01',
      serviceIntervalKm: 20000,
    },
  },
  {
    registrationNumber: 'MOL-B-1002',
    model: 'VW Crafter',
    capacity: {
      weight: 1000,
      volume: 11.5,
    },
    fuelConsumption: 8.5,
    maintenanceSchedule: {
      lastService: '2024-02-15',
      nextService: '2024-05-15',
      serviceIntervalKm: 20000,
    },
  },
  {
    registrationNumber: 'MOL-B-1003',
    model: 'Ford Transit',
    capacity: {
      weight: 800,
      volume: 9.5,
    },
    fuelConsumption: 7.8,
    maintenanceSchedule: {
      lastService: '2024-02-01',
      nextService: '2024-05-01',
      serviceIntervalKm: 15000,
    },
  },
  {
    registrationNumber: 'MOL-B-1004',
    model: 'Mercedes-Benz Vito',
    capacity: {
      weight: 600,
      volume: 6.5,
    },
    fuelConsumption: 7.2,
    maintenanceSchedule: {
      lastService: '2024-03-15',
      nextService: '2024-06-15',
      serviceIntervalKm: 15000,
    },
  },
  {
    registrationNumber: 'MOL-B-1005',
    model: 'Fiat Ducato',
    capacity: {
      weight: 900,
      volume: 10,
    },
    fuelConsumption: 8.0,
    maintenanceSchedule: {
      lastService: '2024-01-15',
      nextService: '2024-04-15',
      serviceIntervalKm: 15000,
    },
  },
  {
    registrationNumber: 'MOL-B-1006',
    model: 'Iveco Daily',
    capacity: {
      weight: 1400,
      volume: 16,
    },
    fuelConsumption: 10.5,
    maintenanceSchedule: {
      lastService: '2024-03-10',
      nextService: '2024-06-10',
      serviceIntervalKm: 25000,
    },
  },
];

module.exports = {
  VEHICLES,
}; 