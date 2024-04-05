export interface SendProps {
  token?: string
  chatID?: string
  chatIDs?: string[]
  replyMessageID?: number
  notify?: boolean
  type?: 'Markdown' | 'HTML'
  pin?: boolean
}
