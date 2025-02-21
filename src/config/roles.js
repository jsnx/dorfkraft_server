const allRoles = {
  user: ['getRegions', 'getTrips'],
  admin: [
    'getUsers',
    'manageUsers',
    'getRegions',
    'manageRegions',
    'manageVillages',
    'getVillages',
    'manageVehicles',
    'getVehicles',
    'manageDrivers',
    'getDrivers',
    'manageProducts',
    'getProducts',
    'getTrips',
    'manageTrips',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
