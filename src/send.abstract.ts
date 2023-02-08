import assert from 'assert'
import { Telegraf } from 'telegraf'
import { ElementShadow } from 'ymlr/src/components/element-shadow'
import { Bot } from './bot'
import { SendProps } from './send.props'

export abstract class SendAbstract extends ElementShadow {
  private bot?: Telegraf

  token?: string
  chatIDs!: Array<string | number>
  notify?: boolean
  replyMessageID?: number
  opts?: any

  type?: 'Markdown' | 'HTML'

  constructor({ chatID, chatIDs = [], ...props }: SendProps) {
    super()
    this.$$ignoreEvalProps.push('bot')
    chatID && chatIDs.push(chatID)
    Object.assign(this, { chatIDs, ...props })
  }

  async exec() {
    assert(this.chatIDs.length > 0)
    let bot: Telegraf | undefined
    if (this.token) {
      bot = new Telegraf(this.token)
    } else {
      bot = this.getParentByClassName<Bot>(Bot)?.telegraf
    }
    assert(bot, 'Could found "ymlr-telegram" or "token"')
    const opts: any = {
      parse_mode: this.type,
      disable_notification: !!this.notify,
      reply_to_message_id: this.replyMessageID,
      ...(this.opts || {})
    }
    const rs = await this.send(bot, opts)
    return rs
  }

  abstract send(bot: Telegraf, opts: any): any

  async dispose() {
    this.bot?.stop()
    this.bot = undefined
  }
}
