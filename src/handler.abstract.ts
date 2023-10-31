import assert from 'assert'
import { type ElementProxy } from 'ymlr/src/components/element-proxy'
import { type Element } from 'ymlr/src/components/element.interface'
import type Group from 'ymlr/src/components/group'
import { type GroupItemProps, type GroupProps } from 'ymlr/src/components/group/group.props'
import { Bot } from './bot'

export abstract class Handler implements Element {
  readonly proxy!: ElementProxy<this>
  readonly innerRunsProxy!: ElementProxy<Group<GroupProps, GroupItemProps>>
  readonly ignoreEvalProps = ['bot']

  token?: string
  bot?: Bot

  protected get logger() {
    return this.proxy.logger
  }

  constructor(props: any) {
    Object.assign(this, props)
  }

  async exec(parentState?: any) {
    let bot: Bot | undefined
    if (this.token) {
      this.bot = bot = new Bot({
        token: this.token
      })
    } else {
      bot = this.proxy.getParentByClassName<Bot>(Bot)?.element
    }
    assert(bot, '"token" or "bot" is requried')
    await this.handle(bot, parentState)
    await bot?.exec()
  }

  abstract handle(bot: Bot, parentState: any): void | Promise<void>

  stop() {
    this.bot?.stop()
  }

  dispose() {
    this.stop()
  }
}
