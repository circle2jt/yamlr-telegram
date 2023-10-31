import assert from 'assert'
import { type Telegraf } from 'telegraf'
import { type InputFile } from 'telegraf/typings/core/types/typegram'
import { type ExtraSticker } from 'telegraf/typings/telegram-types'
import { FileRemote } from 'ymlr/src/libs/file-remote'
import { type SendStickerProps } from './send-sticker.props'
import { SendAbstract } from './send.abstract'

/** |**  ymlr-telegram'sendSticker
  Send a photo in telegram
  @example
  ```yaml
    - ymlr-telegram'sendSticker:
        token: ${BOT_TOKEN}
        chatID: ${TELEGRAM_CHAT_ID}
        # chatIDs:
        #  - ${TELEGRAM_CHAT_ID_1}
        #  - ${TELEGRAM_CHAT_ID_2}
        sticker: http://.../image.jpg             # "file" is a character, path of local file or a URL
        caption: This is a image caption          # File caption
  ```

  Reuse bot in the ymlr-telegram
  ```yaml
    - ymlr-telegram:
        token: ${BOT_TOKEN}
        runs:
          - ymlr-telegram'sendSticker:
              chatID: ${TELEGRAM_CHAT_ID}
              sticker: /tmp/image.jpg             # "file" is a character, path of local file or a URL
              caption: This is a image caption    # File caption
  ```
*/
export class SendSticker extends SendAbstract {
  sticker: string = ''

  private get source() {
    assert(this.sticker, '"sticker" is required')
    const fileRemote = new FileRemote(this.sticker, this.proxy.scene)
    let file: InputFile | string
    if (fileRemote.isRemote) {
      file = { url: fileRemote.uri }
    } else if (fileRemote.existed) {
      file = { source: fileRemote.uri }
    } else {
      file = this.sticker
    }
    return file
  }

  constructor({ sticker, ...props }: SendStickerProps) {
    super(props as any)
    Object.assign(this, { sticker })
  }

  async send(bot: Telegraf, opts: ExtraSticker) {
    this.logger.debug(`⇢┆${this.chatIDs}┆⇢ \t%s`, this.sticker)

    const rs = await Promise.all(this.chatIDs.map(async chatID => await bot.telegram.sendSticker(chatID, this.source, opts)))
    return rs as any
  }
}
