import assert from 'assert'
import { type Telegraf } from 'telegraf'
import { type ExtraPhoto } from 'telegraf/typings/telegram-types'
import { FileRemote } from 'ymlr/src/libs/file-remote'
import { type SendMediaGroupProps } from './send-media-group.props'
import { SendAbstract } from './send.abstract'

/** |**  ymlr-telegram'sendMediaGroup
  Send a photo in telegram
  @example
  ```yaml
    - ymlr-telegram'sendMediaGroup:
        token: ${BOT_TOKEN}
        chatID: ${TELEGRAM_CHAT_ID}
        # chatIDs:
        #  - ${TELEGRAM_CHAT_ID_1}
        #  - ${TELEGRAM_CHAT_ID_2}
        data:
          - media: http://.../image1.jpg               # "file" is a path of local file or a URL
            caption: This is a image caption           # File caption
            type: photo                                # File type must in [ photo, document, audio, video ]
            filename: image.jpg                        # File name
          - media: http://.../image2.jpg
            caption: This is a image caption
            type: photo
  ```

  Reuse bot in the ymlr-telegram
  ```yaml
    - ymlr-telegram:
        token: ${BOT_TOKEN}
        runs:
          - ymlr-telegram'sendMediaGroup:
              chatID: ${TELEGRAM_CHAT_ID}
              data:
                - media: http://.../image.jpg                # "file" is a path of local file or a URL
                  caption: This is a image caption           # File caption
                  type: photo                                # File type must in [ photo, document, audio, video ]
                  filename: image.jpg                        # File name
  ```
*/
export class SendMediaGroup extends SendAbstract {
  data = [] as Array<{
    type: 'photo' | 'audio' | 'document' | 'video'
    media: string | Buffer
    caption?: string
    title?: string
    filename?: string
  }>

  constructor({ data, ...props }: SendMediaGroupProps) {
    super(props as any)
    Object.assign(this, { data })
  }

  async exec() {
    assert(this.data?.length, '"data" is required')
    assert(this.data.every(m => m.type && m.media), '"type" and "media" are required')
    return await super.exec()
  }

  async send(bot: Telegraf, opts: ExtraPhoto) {
    this.logger.debug(`⇢┆${this.chatIDs}┆⇢ \t%j`, this.data)
    const data = this.data.map(item => {
      const { media, filename, ...itemData } = item as any
      if ((media instanceof Buffer) || (media instanceof ReadableStream)) {
        itemData.media = { source: media }
      } else if (typeof media === 'string') {
        const fileRemote = new FileRemote(media, this.proxy.scene)
        itemData.media = fileRemote.isRemote ? { url: fileRemote.uri } : { source: fileRemote.uri }
      } else {
        throw new Error('"media" is not valid')
      }
      if (filename) {
        itemData.media.filename = filename
      }
      return itemData
    }) as any
    const rs = await Promise.all(this.chatIDs.map(async chatID => {
      const rs = await bot.telegram.sendMediaGroup(chatID, data, {
        ...opts
      })
      await Promise.all(rs.map(async media => { await this.autoPin(bot, chatID, media.message_id) }))
      return rs
    }))
    return rs as any
  }
}
