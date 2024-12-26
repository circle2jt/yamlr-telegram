import assert from 'assert'
import { type Bot } from './bot'
import { Handler } from './handler.abstract'
import { type OnProps } from './on.props'

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

        - stop:                         # Stop bot here
  ```
*/
export class On extends Handler {
  filter?: string | string[] | RegExp | RegExp[]

  constructor(props: OnProps) {
    super(props)
    Object.assign(this, props)
  }

  async handle(bot: Bot, parentState?: any) {
    assert(this.filter, '"filter" is required')
    bot.telegraf?.on(this.filter as any, async ctx => {
      this.logger.trace(`⇠┆${this.filter}┆⇠ \t%j`, ctx.message)
      await this.innerRunsProxy.exec({
        ...parentState,
        botCtx: ctx
      })
    })
    await this.bot?.exec()
  }
}
