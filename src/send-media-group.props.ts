import { SendProps } from './send.props'

export type SendMediaGroupProps = {
  data: Array<{
    media: string
    type: 'photo' | 'audio' | 'document' | 'video'
    caption?: string
  }>
} & SendProps
