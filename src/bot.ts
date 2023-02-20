import assert from 'assert'
import { Telegraf } from 'telegraf'
import { ElementProxy } from 'ymlr/src/components/element-proxy'
import { Element } from 'ymlr/src/components/element.interface'
import { Group } from 'ymlr/src/components/group/group'
import { GroupItemProps, GroupProps } from 'ymlr/src/components/group/group.props'
import { sleep } from 'ymlr/src/libs/time'
import { BotProps } from './bot.props'

/** |**  ymlr-telegram
  Declare a global telegram bot which is reused in the others
  @example
  ```yaml
    - ymlr-telegram:
        token: ${BOT_TOKEN}
        runs:
          - name: Send a hi message
            ymlr-telegram'send:
              chatID: ${TELEGRAM_CHAT_ID}
              # chatIDs:
              #  - ${TELEGRAM_CHAT_ID_1}
              #  - ${TELEGRAM_CHAT_ID_2}
              text: Hi there

          - name: Handle custom command
            ymlr-telegram'command:
              name: custom           # /custom
              runs:
                - echo: ${ $parentState.botCtx.message.text }

          - name: Handle when user say hi
            ymlr-telegram'hears:
              text: Hi
              runs:
                - echo: ${ $parentState.botCtx.message.text }
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
    this.ignoreEvalProps.push('telegraf', '_telegraf')
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
    return rs as Array<ElementProxy<Element>>
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
