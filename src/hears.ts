import assert from 'assert'
import { Job } from 'ymlr/src/components/.job/job'
import { Bot } from './bot'
import { HearsProps } from './hears.props'

/** |**  ymlr-telegram'hears
  It's trigged when text in the chat is matched in the "text" property
  @example
  ```yaml
    - ymlr-telegram'hears:
        token: ${BOT_TOKEN}
        title: User say hi
        text: Hi
        runs:
          # this.parentState.botCtx: is ref to telegraf in https://www.npmjs.com/package/telegraf
          - vars:
              message: ${this.parentState.botCtx.message.text}
          - echo: ${vars.message}
          - exec'js: |
              this.parentState.botCtx.reply('Hi there')
  ```
*/
export class Hears extends Job {
  text?: string
  token?: string

  bot?: Bot

  constructor({ text, token, ...props }: HearsProps) {
    super(props as any)
    Object.assign(this, { text, token })
    this.$$ignoreEvalProps.push('bot')
  }

  async execJob() {
    assert(this.text, '"text" is required')
    let bot: Bot | undefined
    if (this.token) {
      bot = this.bot = new Bot({
        token: this.token
      })
    } else {
      bot = this.getParentByClassName<Bot>(Bot)
    }
    assert(bot)
    bot.telegraf.hears(this.text, async ctx => {
      this.logger.debug(`⇠┆${this.text}┆⇠ \t%j`, ctx.message)
      await this.addJobData({ botCtx: ctx })
    })
    await this.bot?.exec()
  }

  async stop() {
    this.bot?.telegraf.stop()
    await super.stop()
  }
}
