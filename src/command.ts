import assert from 'assert'
import { Job } from 'ymlr/src/components/.job/job'
import { Bot } from './bot'
import { CommandProps } from './command.props'

/** |**  ymlr-telegram'command
  Handle command in chat. Example: "/start", "/custom" ...
  @example
  ```yaml
    - ymlr-telegram'command:
        token: ${BOT_TOKEN}
        title: Handle custom command
        name: custom           # /custom
        runs:
          # this.parentState.botCtx: is ref to telegraf in https://www.npmjs.com/package/telegraf
          - vars:
              message: ${this.parentState.botCtx.message.text}
          - echo: ${vars.message}
          - exec'js: |
              this.parentState.botCtx.reply('This is custom command')
  ```
*/
export class Command extends Job {
  name?: string
  token?: string

  bot?: Bot

  constructor({ name, token, ...props }: CommandProps) {
    super(props as any)
    Object.assign(this, { name, token })
    this.$$ignoreEvalProps.push('bot')
  }

  async execJob() {
    assert(this.name, '"name" is required')
    let bot: Bot | undefined
    if (this.token) {
      bot = this.bot = new Bot({
        token: this.token
      })
    } else {
      bot = this.getParentByClassName<Bot>(Bot)
    }
    assert(bot)
    bot.telegraf.command(this.name, async ctx => {
      this.logger.debug(`⇠┆${this.name}┆⇠ \t%j`, ctx.message)
      await this.addJobData({ botCtx: ctx })
    })
    await this.bot?.exec()
  }

  async stop() {
    this.bot?.telegraf.stop()
    await super.stop()
  }
}
