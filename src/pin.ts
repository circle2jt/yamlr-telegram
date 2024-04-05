import assert from 'assert'
import { type PinProps } from './pin.props'
import { UnPin } from './unpin'

/** |**  ymlr-telegram'send
  Send/Edit/Reply a message in telegram
  @example
  ```yaml
    - ymlr-telegram'pin:
        token: ${BOT_TOKEN}
        chatID: ${TELEGRAM_CHAT_ID}
        messageID: ${ $vars.messageID }
  ```
*/
export class Pin extends UnPin {
  opts?: any

  constructor(props: PinProps) {
    super(props)
    Object.assign(this, props)
  }

  async exec() {
    assert(this.messageID)
    const rs = await super.exec()
    return rs
  }

  protected override async handle() {
    if (!this.messageID) return
    this.logger.debug(`unpin ${this.chatID}/${this.messageID}`)
    const rs = await this.telegraf?.telegram.pinChatMessage(this.chatID, this.messageID, { disable_notification: true, ...(this.opts || {}) })
    return rs
  }
}
