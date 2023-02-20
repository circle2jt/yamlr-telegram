import assert from 'assert'
import { Job } from 'ymlr/src/components/.job/job'
import { Bot } from './bot'
import { OnProps } from './on.props'

/** |**  ymlr-telegram'on
  Listen events directly from telegram. Example: "sticker", "text"...
  @example
  ```yaml
    - name: Handle text in the chat
      ymlr-telegram'on:
        token: ${BOT_TOKEN}
        filter: text
        runs:
          # $parentState.botCtx: is ref to telegraf in https://www.npmjs.com/package/telegraf
          - vars:
              message: ${$parentState.botCtx.message.text}
          - echo: ${ $vars.message }
          - exec'js: |
              $parentState.botCtx.reply('Hi there')
  ```
*/
export class On extends Job {
  filter?: string
  token?: string

  bot?: Bot

  constructor({ filter, token, ...props }: OnProps) {
    super(props as any)
    Object.assign(this, { filter, token })
    this.ignoreEvalProps.push('bot')
  }

  async execJob() {
    assert(this.filter, '"filter" is required')
    let bot: Bot | undefined
    if (this.token) {
      bot = this.bot = new Bot({
        token: this.token
      })
    } else {
      bot = this.proxy.getParentByClassName<Bot>(Bot)?.element
    }
    assert(bot)
    bot.telegraf.on(this.filter as any, async ctx => {
      this.logger.trace(`⇠┆${this.filter}┆⇠ \t%j`, ctx.message)
      await this.addJobData({ botCtx: ctx })
    })
    await this.bot?.exec()
  }

  async stop() {
    this.bot?.telegraf.stop()
    await super.stop()
  }
}
