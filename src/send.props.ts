import { ElementProps } from 'ymlr/src/components/element.props'

export type SendProps = {
  token?: string
  chatID?: string
  chatIDs?: string[]
  replyMessageID?: number
  notify?: boolean
  type?: 'Markdown' | 'HTML'
} & ElementProps
