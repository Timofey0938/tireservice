export function formatPhoneNumber(phoneNumber) {
  if (phoneNumber.length === 11 && phoneNumber.startsWith('8')) {
    return phoneNumber.substring(1)
  } else if (phoneNumber.length === 12 && phoneNumber.startsWith('+7')) {
    return phoneNumber.substring(2)
  } else {
    return phoneNumber
  }
}