const DRIVERS = [
  {
    name: 'Hans Schmidt',
    licenseNumber: 'MOL-F-123456',
    licenseClass: 'Class C1',
    languages: ['German', 'English'],
    availability: {
      regularShift: 'MORNING',
      workDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      maxHoursPerWeek: 40,
    },
    contact: {
      phone: '+49 3346 123456',
      email: 'hans.schmidt@bakery.de',
    },
  },
  {
    name: 'Klaus Weber',
    licenseNumber: 'MOL-F-234567',
    licenseClass: 'Class C',
    languages: ['German'],
    availability: {
      regularShift: 'AFTERNOON',
      workDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      maxHoursPerWeek: 40,
    },
    contact: {
      phone: '+49 3346 234567',
      email: 'klaus.weber@bakery.de',
    },
  },
  {
    name: 'Michael Wagner',
    licenseNumber: 'MOL-F-345678',
    licenseClass: 'Class C1',
    languages: ['German', 'Polish'],
    availability: {
      regularShift: 'MORNING',
      workDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      maxHoursPerWeek: 40,
    },
    contact: {
      phone: '+49 3346 345678',
      email: 'michael.wagner@bakery.de',
    },
  },
  {
    name: 'Thomas Becker',
    licenseNumber: 'MOL-F-456789',
    licenseClass: 'Class C',
    languages: ['German'],
    availability: {
      regularShift: 'NIGHT',
      workDays: ['SUN', 'MON', 'TUE', 'WED', 'THU'],
      maxHoursPerWeek: 40,
    },
    contact: {
      phone: '+49 3346 456789',
      email: 'thomas.becker@bakery.de',
    },
  },
  {
    name: 'Stefan Hoffmann',
    licenseNumber: 'MOL-F-567890',
    licenseClass: 'Class C1',
    languages: ['German', 'English'],
    availability: {
      regularShift: 'AFTERNOON',
      workDays: ['TUE', 'WED', 'THU', 'FRI', 'SAT'],
      maxHoursPerWeek: 40,
    },
    contact: {
      phone: '+49 3346 567890',
      email: 'stefan.hoffmann@bakery.de',
    },
  },
];

module.exports = {
  DRIVERS,
}; 