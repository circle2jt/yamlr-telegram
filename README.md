# ymlr-telegram
Support telegram API via `telegraf` librarry

## Features:
1. Send a text message via telegram bot  
2. Send a photo via telegram bot  
3. Send a document via telegram bot  
3. Send a sticker via telegram bot  
4. Handle a telegram command (/start, /help ...)  
5. Handle a text in the chat  
6. Handle events in the telegram  
<br/>

# Tag details

| Tags | Description |
|---|---|
| [ymlr-telegram](#ymlr-telegram) | Declare a global telegram bot which is reused in the others |
| [ymlr-telegram'action](#ymlr-telegram'action) | Handle callback in inline keyboard |
| [ymlr-telegram'command](#ymlr-telegram'command) | Handle command in chat. Example: "/start", "/custom" ... |
| [ymlr-telegram'hears](#ymlr-telegram'hears) | It's trigged when text in the chat is matched in the "text" property |
| [ymlr-telegram'on](#ymlr-telegram'on) | Listen events directly from telegram. Example: "sticker", "text"... |
| [ymlr-telegram'send](#ymlr-telegram'send) | Send/Edit/Reply a message in telegram |
| [ymlr-telegram'send](#ymlr-telegram'send) | Send/Edit/Reply a message in telegram |
| [ymlr-telegram'send](#ymlr-telegram'send) | Send/Edit/Reply a message in telegram |
| [ymlr-telegram'sendDocument](#ymlr-telegram'sendDocument) | Send a document file in telegram |
| [ymlr-telegram'sendMediaGroup](#ymlr-telegram'sendMediaGroup) | Send a photo in telegram |
| [ymlr-telegram'sendPhoto](#ymlr-telegram'sendPhoto) | Send a photo in telegram |
| [ymlr-telegram'sendSticker](#ymlr-telegram'sendSticker) | Send a photo in telegram |



## <a id="ymlr-telegram"></a>ymlr-telegram  
  
Declare a global telegram bot which is reused in the others  

Example:  

```yaml
  - ymlr-telegram:
      token: ${BOT_TOKEN}
    runs:
      - name: Send a hi message
        ymlr-telegram'send:
          chatID: ${TELEGRAM_CHAT_ID}
          # chatIDs:
          #  - ${TELEGRAM_CHAT_ID_1}
          #  - ${TELEGRAM_CHAT_ID_2}
          text: Hi there

      - name: Handle custom command
        ymlr-telegram'command:
          name: custom           # /custom
        runs:
          - echo: ${ $parentState.botCtx.message.text }

      - name: Handle when user say hi
        ymlr-telegram'hears:
          text: Hi
        runs:
          - echo: ${ $parentState.botCtx.message.text }
```  


## <a id="ymlr-telegram'action"></a>ymlr-telegram'action  
  
Handle callback in inline keyboard  

Example:  

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


## <a id="ymlr-telegram'command"></a>ymlr-telegram'command  
  
Handle command in chat. Example: "/start", "/custom" ...  

Example:  

```yaml
  - name: Handle custom command
    ymlr-telegram'command:
      token: ${BOT_TOKEN}
      name: custom           # /custom
    runs:
      # $parentState.botCtx: is ref to telegraf in https://www.npmjs.com/package/telegraf
      - vars:
          message: ${ $parentState.botCtx.message.text }
      - echo: ${ $vars.message }
      - exec'js: |
          $parentState.botCtx.reply('This is custom command')

      - stop:                         # Stop bot here
```  


## <a id="ymlr-telegram'hears"></a>ymlr-telegram'hears  
  
It's trigged when text in the chat is matched in the "text" property  

Example:  

```yaml
  - name: User say hi
    ymlr-telegram'hears:
      token: ${BOT_TOKEN}
      text: Hi
    runs:
      # $parentState.botCtx: is ref to telegraf in https://www.npmjs.com/package/telegraf
      - vars:
          message: ${$parentState.botCtx.message.text}
      - echo: ${ $vars.message }
      - exec'js: |
          $parentState.botCtx.reply('Hi there')

      - stop:                         # Stop bot here
```  


## <a id="ymlr-telegram'on"></a>ymlr-telegram'on  
  
Listen events directly from telegram. Example: "sticker", "text"...  

Example:  

```yaml
  - name: Handle text in the chat
    ymlr-telegram'on:
      token: ${BOT_TOKEN}
      filter: text
    runs:
      # $parentState.botCtx: is ref to telegraf in https://www.npmjs.com/package/telegraf
      - vars:
          message: ${$parentState.botCtx.message.text}
      - echo: ${ $vars.message }
      - exec'js: |
          $parentState.botCtx.reply('Hi there')

      - stop:                         # Stop bot here
```  


## <a id="ymlr-telegram'send"></a>ymlr-telegram'send  
  
Send/Edit/Reply a message in telegram  

Example:  

```yaml
  - ymlr-telegram'pin:
      token: ${BOT_TOKEN}
      chatID: ${TELEGRAM_CHAT_ID}
      messageID: ${ $vars.messageID }
```  


## <a id="ymlr-telegram'send"></a>ymlr-telegram'send  
  
Send/Edit/Reply a message in telegram  

Example:  

```yaml
  - ymlr-telegram'send:
      token: ${BOT_TOKEN}
      chatID: ${TELEGRAM_CHAT_ID}
      # chatIDs:
      #  - ${TELEGRAM_CHAT_ID_1}
      #  - ${TELEGRAM_CHAT_ID_2}
      text: Hi there
      opts:
        parse_mode: MarkdownV2  # Send text with markdown format
        reply_markup:
          inline_keyboard:
            - - text: Button 1
                callback_data: ACTION_1
              - text: Button 2
                callback_data: ACTION_2
```

Reuse bot in the ymlr-telegram
```yaml
  - ymlr-telegram:
      token: ${BOT_TOKEN}
    runs:
      - ymlr-telegram'send:
          chatID: ${TELEGRAM_CHAT_ID}
          text: Hi there
          vars:
            messageID: ${this.result.message_id}
```

Edit a message
```yaml
  - ymlr-telegram'send:
      token: ${BOT_TOKEN}
      editMessageID: ${ $vars.messageID }        # Message ID to edit
      chatID: ${TELEGRAM_CHAT_ID}
      text: Hi again
```

Remove a message
```yaml
  - ymlr-telegram'send:
      token: ${BOT_TOKEN}
      removeMessageID: ${ $vars.messageID }      # Message ID to remove
      chatID: ${TELEGRAM_CHAT_ID}
```

Reply a message
```yaml
  - ymlr-telegram'send:
      token: ${BOT_TOKEN}
      replyMessageID: ${ $vars.messageID }       # Message ID to reply
      chatID: ${TELEGRAM_CHAT_ID}
      text: Hi again
```  


## <a id="ymlr-telegram'send"></a>ymlr-telegram'send  
  
Send/Edit/Reply a message in telegram  

Example:  

```yaml
  - ymlr-telegram'unpin:
      token: ${BOT_TOKEN}
      chatID: ${TELEGRAM_CHAT_ID}
      messageID: ${ $vars.messageID } # message is not specific then unpin all message in the chat
```  


## <a id="ymlr-telegram'sendDocument"></a>ymlr-telegram'sendDocument  
  
Send a document file in telegram  

Example:  

```yaml
  - ymlr-telegram'sendDocument:
      token: ${BOT_TOKEN}
      chatID: ${TELEGRAM_CHAT_ID}
      # chatIDs:
      #  - ${TELEGRAM_CHAT_ID_1}
      #  - ${TELEGRAM_CHAT_ID_2}
      file: http://.../README.md                # "file" is a path of local file or a URL
      caption: This is a image caption          # File caption
```

Reuse bot in the ymlr-telegram
```yaml
  - ymlr-telegram:
      token: ${BOT_TOKEN}
    runs:
      - ymlr-telegram'sendDocument:
          chatID: ${TELEGRAM_CHAT_ID}
          file: http://.../README.md          # "file" is a path of local file or a URL
          caption: This is a image caption    # File caption
```  


## <a id="ymlr-telegram'sendMediaGroup"></a>ymlr-telegram'sendMediaGroup  
  
Send a photo in telegram  

Example:  

```yaml
  - ymlr-telegram'sendMediaGroup:
      token: ${BOT_TOKEN}
      chatID: ${TELEGRAM_CHAT_ID}
      # chatIDs:
      #  - ${TELEGRAM_CHAT_ID_1}
      #  - ${TELEGRAM_CHAT_ID_2}
      data:
        - media: http://.../image1.jpg               # "file" is a path of local file or a URL
          caption: This is a image caption           # File caption
          type: photo                                # File type must in [ photo, document, audio, video ]
          filename: image.jpg                        # File name
        - media: http://.../image2.jpg
          caption: This is a image caption
          type: photo
```

Reuse bot in the ymlr-telegram
```yaml
  - ymlr-telegram:
      token: ${BOT_TOKEN}
    runs:
      - ymlr-telegram'sendMediaGroup:
          chatID: ${TELEGRAM_CHAT_ID}
          data:
            - media: http://.../image.jpg                # "file" is a path of local file or a URL
              caption: This is a image caption           # File caption
              type: photo                                # File type must in [ photo, document, audio, video ]
              filename: image.jpg                        # File name
```  


## <a id="ymlr-telegram'sendPhoto"></a>ymlr-telegram'sendPhoto  
  
Send a photo in telegram  

Example:  

```yaml
  - ymlr-telegram'sendPhoto:
      token: ${BOT_TOKEN}
      chatID: ${TELEGRAM_CHAT_ID}
      # chatIDs:
      #  - ${TELEGRAM_CHAT_ID_1}
      #  - ${TELEGRAM_CHAT_ID_2}
      file: http://.../image.jpg                # "file" is a path of local file or a URL
      caption: This is a image caption          # File caption
      filename: image.jpg                       # File name
```

Reuse bot in the ymlr-telegram
```yaml
  - ymlr-telegram:
      token: ${BOT_TOKEN}
    runs:
      - ymlr-telegram'sendPhoto:
          chatID: ${TELEGRAM_CHAT_ID}
          file: /tmp/image.jpg                # "file" is a path of local file or a URL
          caption: This is a image caption    # File caption
          filename: image.jpg                 # File name
```  


## <a id="ymlr-telegram'sendSticker"></a>ymlr-telegram'sendSticker  
  
Send a photo in telegram  

Example:  

```yaml
  - ymlr-telegram'sendSticker:
      token: ${BOT_TOKEN}
      chatID: ${TELEGRAM_CHAT_ID}
      # chatIDs:
      #  - ${TELEGRAM_CHAT_ID_1}
      #  - ${TELEGRAM_CHAT_ID_2}
      sticker: http://.../image.jpg             # "file" is a character, path of local file or a URL
      caption: This is a image caption          # File caption
```

Reuse bot in the ymlr-telegram
```yaml
  - ymlr-telegram:
      token: ${BOT_TOKEN}
    runs:
      - ymlr-telegram'sendSticker:
          chatID: ${TELEGRAM_CHAT_ID}
          sticker: /tmp/image.jpg             # "file" is a character, path of local file or a URL
          caption: This is a image caption    # File caption
```  


<br/>

### Have fun :)