import { JobStopProps } from 'ymlr/src/components/.job/job-stop.props'
import { GroupItemProps, GroupProps } from 'ymlr/src/components/group/group.props'
import { CommandProps } from './command.props'
import { HearsProps } from './hears.props'
import { OnProps } from './on.props'
import { SendDocumentProps } from './send-document.props'
import { SendPhotoProps } from './send-photo.props'
import { SendStickerProps } from './send-sticker.props'
import { SendProps } from './send.props'

export type BotProps = GroupProps & {
  token: string
  runs?: Array<GroupItemProps | {
    'ymlr-telegram\'stop': JobStopProps
  } | {
    'ymlr-telegram\'command': CommandProps
  } | {
    'ymlr-telegram\'hears': HearsProps
  } | {
    'ymlr-telegram\'on': OnProps
  } | {
    'ymlr-telegram\'send': SendProps
  } | {
    'ymlr-telegram\'sendPhoto': SendPhotoProps
  } | {
    'ymlr-telegram\'sendDocument': SendDocumentProps
  } | {
    'ymlr-telegram\'sendSticker': SendStickerProps
  }>
}
