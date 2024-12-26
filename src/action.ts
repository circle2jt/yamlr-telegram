import assert from 'assert'
import { type ActionProps } from './action.props'
import { type Bot } from './bot'
import { Handler } from './handler.abstract'

/** |**  ymlr-telegram'action
  Handle callback in inline keyboard
  @example
  ```yaml
    - name: Handle inline keyboard when user pick one
      ymlr-telegram'action:
        token: ${BOT_TOKEN}
        name: callback
      runs:
        # $parentState.botCtx: is ref to telegraf in https://www.npmjs.com/package/telegraf
        - vars:
            callbackData: ${$parentState.botCtx.update.callback_query.data}   # => VN/US
        - echo: ${ $vars.callbackData }
        - exec'js: |
            $parentState.botCtx.reply('Picked ' + $vars.callbackData)

        - stop:                         # Stop bot here

    - ymlr-telegram'send:
        token: ${BOT_TOKEN}
        chatID: ${CHAT_ID}
        text: Send a message to help users to choose a language
        opts:
          reply_markup:
            one_time_keyboard: true
            inline_keyboard:
              -
                - text: VietNam
                  callback_data: VN
                - text: US
                  callback_data: US
  ```
*/
export class Action extends Handler {
  name?: string | string[] | RegExp | RegExp[]

  constructor(props: ActionProps) {
    super(props)
    Object.assign(this, props)
  }

  async handle(bot: Bot, parentState?: any) {
    assert(this.name, '"name" is required')
    bot.telegraf?.action(this.name, async ctx => {
      this.logger.debug(`⇠┆${this.name}┆⇠ \t%j`, ctx.message)
      await this.innerRunsProxy.exec({
        ...parentState,
        botCtx: ctx
      })
    })
  }
}
