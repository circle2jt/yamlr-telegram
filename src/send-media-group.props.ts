import { type SendProps } from './send.props'

export type SendMediaGroupProps = {
  data: Array<{
    media: string
    type: 'photo' | 'audio' | 'document' | 'video'
    caption?: string
    filename?: string
  }>
} & SendProps
