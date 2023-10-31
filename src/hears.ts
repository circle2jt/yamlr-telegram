import assert from 'assert'
import { type Bot } from './bot'
import { Handler } from './handler.abstract'
import { type HearsProps } from './hears.props'

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

          - stop:                         # Stop bot here
  ```
*/
export class Hears extends Handler {
  text?: string | string[] | RegExp | RegExp[]

  constructor(props: HearsProps) {
    super(props)
    Object.assign(this, props)
  }

  async handle(bot: Bot, parentState?: any) {
    assert(this.text, '"text" is required')
    bot.telegraf?.hears(this.text, async ctx => {
      this.logger.debug(`⇠┆${this.text}┆⇠ \t%j`, ctx.message)
      await this.innerRunsProxy.exec({
        ...parentState,
        botCtx: ctx
      })
    })
    await this.bot?.exec()
  }
}
