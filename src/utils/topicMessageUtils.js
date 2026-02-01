export const getMessagePayload = (message) => {
    return JSON.parse(JSON.parse(message.value.toString()).payload);
}