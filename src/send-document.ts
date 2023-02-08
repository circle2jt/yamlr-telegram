import { Telegraf } from 'telegraf'
import { ExtraDocument } from 'telegraf/typings/telegram-types'
import { SendDocumentProps } from './send-document.props'
import { SendPhoto } from './send-photo'

/** |**  ymlr-telegram'sendDocument
  Send a document file in telegram
  @example
  ```yaml
    - ymlr-telegram'sendDocument:
        token: ${BOT_TOKEN}
        chatID: ${TELEGRAM_CHAT_ID}
        # chatIDs:
        #  - ${TELEGRAM_CHAT_ID_1}
        #  - ${TELEGRAM_CHAT_ID_2}
        file: http://.../README.md                # "file" is a path of local file or a URL
        caption: This is a image caption          # File caption
  ```

  Reuse bot in the ymlr-telegram
  ```yaml
    - ymlr-telegram:
        token: ${BOT_TOKEN}
        runs:
          - ymlr-telegram'sendDocument:
              chatID: ${TELEGRAM_CHAT_ID}
              file: http://.../README.md          # "file" is a path of local file or a URL
              caption: This is a image caption    # File caption
  ```
*/
export class SendDocument extends SendPhoto {
  constructor(props: SendDocumentProps) {
    super(props)
  }

  async send(bot: Telegraf, opts: ExtraDocument) {
    this.logger.debug(`⇢┆${this.chatIDs}┆⇢ \t%s`, this.file)

    const rs = await Promise.all(this.chatIDs.map(async chatID => await bot.telegram.sendDocument(chatID, this.source, {
      caption: this.caption,
      ...opts
    })))
    return rs as any
  }
}
