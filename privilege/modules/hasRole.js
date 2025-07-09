
export default function hasRole(value) {
  
  const rolesString = uni.getStorageSync('userInfo').Role;

  if (!rolesString) return false;

  const roles = rolesString.split(',');

  return roles.includes(value);
}
