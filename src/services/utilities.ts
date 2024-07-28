export function getId(length = 12) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  // Add the current time in milliseconds
  const timestamp = Date.now().toString(36);

  // Generate random characters
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  // Concatenate timestamp and random characters
  return timestamp + result;
}
