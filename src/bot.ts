import assert from 'assert'
import { Telegraf } from 'telegraf'
import { type ElementProxy } from 'ymlr/src/components/element-proxy'
import { type Element } from 'ymlr/src/components/element.interface'
import { type Group } from 'ymlr/src/components/group/group'
import { type GroupItemProps, type GroupProps } from 'ymlr/src/components/group/group.props'
import { sleep } from 'ymlr/src/libs/time'
import { type BotProps } from './bot.props'

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
export class Bot implements Element {
  readonly proxy!: ElementProxy<this>
  readonly innerRunsProxy!: ElementProxy<Group<GroupProps, GroupItemProps>>
  readonly ignoreEvalProps = ['telegraf']
  token: string = ''

  telegraf?: Telegraf

  get logger() {
    return this.proxy.logger
  }

  constructor(props: BotProps) {
    Object.assign(this, props)
  }

  injectHandle?: (parentState?: any) => any

  async exec(parentState?: any) {
    assert(this.token, '"token" is required')
    this.telegraf = new Telegraf(this.token)

    await this.injectHandle?.(parentState)

    const proms = []
    proms.push(this.innerRunsProxy?.exec(parentState))
    await sleep(200)
    proms.push(this.telegraf.launch())
    while (!this.telegraf.botInfo) {
      await sleep(100)
    }
    const [rs] = await Promise.all(proms)
    return rs as Array<ElementProxy<Element>>
  }

  stop() {
    this.telegraf?.stop('SIGINT')
    this.telegraf = undefined
  }

  dispose() {
    this.stop()
  }
}
