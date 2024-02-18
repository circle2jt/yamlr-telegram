import assert from 'assert'
import { Telegraf } from 'telegraf'
import { type ElementProxy } from 'ymlr/src/components/element-proxy'
import { type Element } from 'ymlr/src/components/element.interface'
import { Bot } from './bot'
import { type PinProps } from './pin.props'

/** |**  ymlr-telegram'send
  Send/Edit/Reply a message in telegram
  @example
  ```yaml
    - ymlr-telegram'unpin:
        token: ${BOT_TOKEN}
        chatID: ${TELEGRAM_CHAT_ID}
        messageID: ${ $vars.messageID } # message is not specific then unpin all message in the chat
  ```
*/
export class UnPin implements Element {
  readonly proxy!: ElementProxy<this>

  chatID!: string | number
  messageID?: number
  token?: string
  telegraf?: Telegraf

  get logger() {
    return this.proxy.logger
  }

  constructor(props: PinProps) {
    Object.assign(this, props)
  }

  async exec() {
    assert(this.chatID)
    if (this.token) {
      this.telegraf = new Telegraf(this.token)
    } else {
      this.telegraf = this.proxy.getParentByClassName<Bot>(Bot)?.element?.telegraf
    }
    assert(this.telegraf, 'Could found "ymlr-telegram" or "token"')
    const rs = await this.handle()
    return rs
  }

  protected async handle() {
    if (this.messageID) {
      this.logger.debug(`unpin ${this.messageID} in ${this.chatID}`)
      const rs = await this.telegraf?.telegram.unpinChatMessage(this.chatID, this.messageID)
      return rs
    }
    this.logger.debug(`unpin all messages in ${this.chatID}`)
    const rs = await this.telegraf?.telegram.unpinAllChatMessages(this.chatID)
    return rs
  }

  dispose() { }
}
