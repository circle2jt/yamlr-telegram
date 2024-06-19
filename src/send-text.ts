import { type Telegraf } from 'telegraf'
import { type ExtraEditMessageText } from 'telegraf/typings/telegram-types'
import { type SendTextProps } from './send-text.props'
import { SendAbstract } from './send.abstract'

/** |**  ymlr-telegram'send
  Send/Edit/Reply a message in telegram
  @example
  ```yaml
    - ymlr-telegram'send:
        token: ${BOT_TOKEN}
        chatID: ${TELEGRAM_CHAT_ID}
        # chatIDs:
        #  - ${TELEGRAM_CHAT_ID_1}
        #  - ${TELEGRAM_CHAT_ID_2}
        text: Hi there
        opts:
          parse_mode: MarkdownV2  # Send text with markdown format
          reply_markup:
            inline_keyboard:
              - - text: Button 1
                  callback_data: ACTION_1
                - text: Button 2
                  callback_data: ACTION_2
  ```

  Reuse bot in the ymlr-telegram
  ```yaml
    - ymlr-telegram:
        token: ${BOT_TOKEN}
        runs:
          - ymlr-telegram'send:
              chatID: ${TELEGRAM_CHAT_ID}
              text: Hi there
              vars:
                messageID: ${this.result.message_id}
  ```

  Edit a message
  ```yaml
    - ymlr-telegram'send:
        token: ${BOT_TOKEN}
        editMessageID: ${ $vars.messageID }        # Message ID to edit
        chatID: ${TELEGRAM_CHAT_ID}
        text: Hi again
  ```

  Remove a message
  ```yaml
    - ymlr-telegram'send:
        token: ${BOT_TOKEN}
        removeMessageID: ${ $vars.messageID }      # Message ID to remove
        chatID: ${TELEGRAM_CHAT_ID}
  ```

  Reply a message
  ```yaml
    - ymlr-telegram'send:
        token: ${BOT_TOKEN}
        replyMessageID: ${ $vars.messageID }       # Message ID to reply
        chatID: ${TELEGRAM_CHAT_ID}
        text: Hi again
  ```
*/
export class SendText extends SendAbstract {
  text?: string
  editMessageID?: number

  constructor({ text, removeMessageID, editMessageID, ...props }: SendTextProps) {
    super(props as any)
    Object.assign(this, { text, removeMessageID, editMessageID })
  }

  async send(bot: Telegraf, opts: ExtraEditMessageText) {
    this.logger.debug(`⇢┆${this.chatIDs}┆⇢ \t%s`, this.text)

    const result = {} as any
    if (this.editMessageID) {
      result.edit = await Promise.all(this.chatIDs.map(async chatID => {
        const rs = await bot.telegram.editMessageText(chatID, this.editMessageID, undefined, this.text || '', opts)
        await this.autoPin(bot, chatID, this.editMessageID)
        return rs
      }))
    } else if (this.text) {
      result.send = await Promise.all(this.chatIDs.map(async chatID => {
        const rs = await bot.telegram.sendMessage(chatID, this.text || '', opts)
        await this.autoPin(bot, chatID, rs.message_id)
        return rs
      }))
    }
    return result
  }
}
