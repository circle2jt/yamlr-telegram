import { type SendProps } from './send.props'

export type SendTextProps = {
  text?: string
  editMessageID?: number
  removeMessageID?: number
} & SendProps
