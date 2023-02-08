import { JobStop } from 'ymlr/src/components/.job/job-stop'
import { Command } from './command'
import { Hears } from './hears'
import { On } from './on'

/** |**  ymlr-telegram'stop
  Stop telegram bot
  @example
  ```yaml
    - ymlr-telegram:
        token: ${BOT_TOKEN}
        runs:
          - ymlr-telegram'send:
              title: Send a hi message
              chatID: ${TELEGRAM_CHAT_ID}
              text: Hi there

          - ymlr-telegram'stop:            # Stop bot here
    - echo: Keep doing something after the bot is stoped here
  ```
*/
export class Stop extends JobStop {
  type = [Hears, On, Command]
}
