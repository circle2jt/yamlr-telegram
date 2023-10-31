import assert from 'assert'
import { type Bot } from './bot'
import { type CommandProps } from './command.props'
import { Handler } from './handler.abstract'

/** |**  ymlr-telegram'command
  Handle command in chat. Example: "/start", "/custom" ...
  @example
  ```yaml
    - name: Handle custom command
      ymlr-telegram'command:
        token: ${BOT_TOKEN}
        name: custom           # /custom
        runs:
          # $parentState.botCtx: is ref to telegraf in https://www.npmjs.com/package/telegraf
          - vars:
              message: ${ $parentState.botCtx.message.text }
          - echo: ${ $vars.message }
          - exec'js: |
              $parentState.botCtx.reply('This is custom command')

          - stop:                         # Stop bot here
  ```
*/
export class Command extends Handler {
  name?: string | string[]

  constructor(props: CommandProps) {
    super(props)
    Object.assign(this, props)
  }

  async handle(bot: Bot, parentState?: any) {
    assert(this.name, '"name" is required')
    bot.telegraf?.command(this.name, async ctx => {
      this.logger.debug(`⇠┆${this.name}┆⇠ \t%j`, ctx.message)
      await this.innerRunsProxy.exec({
        ...parentState,
        botCtx: ctx
      })
    })
  }
}
