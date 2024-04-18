import { type SendProps } from './send.props'

export type SendPhotoProps = {
  file?: string
  caption?: string
  filename?: string
} & SendProps
