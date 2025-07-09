
export default function hasPermi(value) {

  const rolesString = uni.getStorageSync('userInfo').Modules;

  if (!rolesString) return false;

  const roles = rolesString.split(',');

  return roles.includes(value);
}
