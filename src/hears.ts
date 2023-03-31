import assert from 'assert'
import { Job } from 'ymlr/src/components/.job/job'
import { Bot } from './bot'
import { HearsProps } from './hears.props'

/** |**  ymlr-telegram'hears
  It's trigged when text in the chat is matched in the "text" property
  @example
  ```yaml
    - name: User say hi
      ymlr-telegram'hears:
        token: ${BOT_TOKEN}
        text: Hi
        runs:
          # $parentState.botCtx: is ref to telegraf in https://www.npmjs.com/package/telegraf
          - vars:
              message: ${$parentState.botCtx.message.text}
          - echo: ${ $vars.message }
          - exec'js: |
              $parentState.botCtx.reply('Hi there')
  ```
*/
export class Hears extends Job {
  text?: string | string[] | RegExp | RegExp[]
  token?: string

  bot?: Bot

  constructor({ text, token, ...props }: HearsProps) {
    super(props as any)
    Object.assign(this, { text, token })
    this.ignoreEvalProps.push('bot')
  }

  async execJob() {
    assert(this.text, '"text" is required')
    let bot: Bot | undefined
    if (this.token) {
      bot = this.bot = new Bot({
        token: this.token
      })
    } else {
      bot = this.proxy.getParentByClassName<Bot>(Bot)?.element
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
