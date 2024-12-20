import assert from 'assert'
import { type Telegraf } from 'telegraf'
import { type ExtraPhoto } from 'telegraf/typings/telegram-types'
import { FileRemote } from 'ymlr/src/libs/file-remote'
import { type SendPhotoProps } from './send-photo.props'
import { SendAbstract } from './send.abstract'

/** |**  ymlr-telegram'sendPhoto
  Send a photo in telegram
  @example
  ```yaml
    - ymlr-telegram'sendPhoto:
        token: ${BOT_TOKEN}
        chatID: ${TELEGRAM_CHAT_ID}
        # chatIDs:
        #  - ${TELEGRAM_CHAT_ID_1}
        #  - ${TELEGRAM_CHAT_ID_2}
        file: http://.../image.jpg                # "file" is a path of local file or a URL
        caption: This is a image caption          # File caption
        filename: image.jpg                       # File name
  ```

  Reuse bot in the ymlr-telegram
  ```yaml
    - ymlr-telegram:
        token: ${BOT_TOKEN}
        runs:
          - ymlr-telegram'sendPhoto:
              chatID: ${TELEGRAM_CHAT_ID}
              file: /tmp/image.jpg                # "file" is a path of local file or a URL
              caption: This is a image caption    # File caption
              filename: image.jpg                 # File name
  ```
*/
export class SendPhoto extends SendAbstract {
  file: string | Buffer | ReadableStream = ''
  caption?: string
  filename?: string

  protected get source(): any {
    assert(this.file, '"file" is required')
    const media = this.file
    const itemData = {} as any
    if (this.filename) {
      itemData.filename = this.filename
    }
    if ((media instanceof Buffer) || (media instanceof ReadableStream)) {
      itemData.source = media
    } else if (typeof media === 'string') {
      const fileRemote = new FileRemote(media, this.proxy)
      if (fileRemote.isRemote) {
        itemData.url = fileRemote.uri
      } else {
        itemData.source = fileRemote.uri
      }
    } else {
      throw new Error('"file" is not valid')
    }
    return itemData
  }

  constructor({ file, caption, filename, ...props }: SendPhotoProps) {
    super(props as any)
    Object.assign(this, { file, caption, filename })
  }

  async send(bot: Telegraf, opts: ExtraPhoto) {
    this.logger.debug(`⇢┆${this.chatIDs}┆⇢ \t%s`, this.file)
    const rs = await Promise.all(this.chatIDs.map(async chatID => {
      const rs = await bot.telegram.sendPhoto(chatID, this.source, {
        caption: this.caption,
        ...opts
      })
      await this.autoPin(bot, chatID, rs.message_id)
      return rs
    }))
    return rs as any
  }
}
