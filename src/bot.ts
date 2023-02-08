import assert from 'assert'
import { ElementShadow } from 'ymlr/src/components/element-shadow'
import { Group } from 'ymlr/src/components/group/group'
import { GroupItemProps, GroupProps } from 'ymlr/src/components/group/group.props'
import { sleep } from 'ymlr/src/libs/time'
import { Telegraf } from 'telegraf'
import { BotProps } from './bot.props'

/** |**  ymlr-telegram
  Declare a global telegram bot which is reused in the others
  @example
  ```yaml
    - ymlr-telegram:
        token: ${BOT_TOKEN}
        runs:
          - ymlr-telegram'send:
              title: Send a hi message
              chatID: ${TELEGRAM_CHAT_ID}
              # chatIDs:
              #  - ${TELEGRAM_CHAT_ID_1}
              #  - ${TELEGRAM_CHAT_ID_2}
              text: Hi there

          - ymlr-telegram'command:
              title: Handle custom command
              name: custom           # /custom
              runs:
                - echo: ${this.parentState.botCtx.message.text}

          - ymlr-telegram'hears:
              title: Handle when user say hi
              text: Hi
              runs:
                - echo: ${this.parentState.botCtx.message.text}
  ```
*/
export class Bot extends Group<GroupProps, GroupItemProps> {
  private _telegraf?: Telegraf
  get telegraf() {
    return this._telegraf || (this._telegraf = new Telegraf(this.token))
  }

  token: string = ''

  constructor({ token, ...props }: BotProps) {
    super(props)
    Object.assign(this, { token })
    this.$$ignoreEvalProps.push('telegraf', '_telegraf')
  }

  async exec(input?: any) {
    assert(this.token, '"token" is required')
    const proms = []
    proms.push(super.exec(input))
    await sleep(200)
    proms.push(this.telegraf.launch())
    while (!this.telegraf.botInfo) {
      await sleep(100)
    }
    const [rs] = await Promise.all(proms)
    return rs as ElementShadow[]
  }

  async stop() {
    if (!this._telegraf) return
    this.telegraf.stop('SIGINT')
    this._telegraf = undefined
  }

  async dispose() {
    await this.stop()
    await super.dispose()
  }
}
