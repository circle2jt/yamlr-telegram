import assert from 'assert'
import { Telegraf } from 'telegraf'
import { type ElementProxy } from 'ymlr/src/components/element-proxy'
import { type Element } from 'ymlr/src/components/element.interface'
import { Bot } from './bot'
import { type SendProps } from './send.props'

export abstract class SendAbstract implements Element {
  ignoreEvalProps = ['telegraf', 'bot']
  proxy!: ElementProxy<this>
  protected get logger() {
    return this.proxy.logger
  }

  pin?: boolean

  telegraf?: Telegraf

  token?: string
  chatID?: string | number
  chatIDs!: Array<string | number>
  notify?: boolean
  replyMessageID?: number
  opts?: any

  type?: 'Markdown' | 'HTML'

  constructor(props: SendProps) {
    Object.assign(this, props)
  }

  async exec() {
    if (this.chatID) {
      if (!this.chatIDs) {
        this.chatIDs = []
      }
      this.chatIDs.push(this.chatID)
    }
    assert(this.chatIDs?.length)
    if (this.token) {
      this.telegraf = new Telegraf(this.token)
    } else {
      this.telegraf = this.proxy.getParentByClassName<Bot>(Bot)?.element?.telegraf
    }
    assert(this.telegraf, 'Could found "ymlr-telegram" or "token"')
    const opts: any = {
      parse_mode: this.type,
      disable_notification: !!this.notify,
      reply_to_message_id: this.replyMessageID,
      ...(this.opts || {})
    }
    const rs = await this.send(this.telegraf, opts)
    return rs
  }

  async autoPin(bot: Telegraf, chatID: string | number, messageID?: number) {
    if (this.pin && messageID !== undefined) {
      await bot.telegram.pinChatMessage(chatID, messageID, { disable_notification: true })
    }
  }
  abstract send(bot: Telegraf, opts: any): any

  dispose() { }
}
