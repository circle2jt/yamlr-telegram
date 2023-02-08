export const bot = () => require('./bot').Bot
export const stop = () => require('./stop').Stop
export const action = () => require('./action').Action
export const command = () => require('./command').Command
export const hears = () => require('./hears').Hears
export const on = () => require('./on').On
export const send = () => require('./send-text').SendText
export const sendPhoto = () => require('./send-photo').SendPhoto
export const sendDocument = () => require('./send-document').SendDocument
export const sendSticker = () => require('./send-sticker').SendSticker
export default bot
