# Changes logs

## History

- [1.2.6-alpha.2.md](#1731508666405)  -  _11/13/2024, 9:37:46 PM_
- [1.2.6-alpha.1.md](#1718788804520)  -  _6/19/2024, 4:20:04 PM_
- [1.2.6-alpha.0.md](#1718625351724)  -  _6/17/2024, 6:55:51 PM_
- [1.2.5.md](#1713441980865)  -  _4/18/2024, 7:06:20 PM_
- [1.2.4.md](#1713440597299)  -  _4/18/2024, 6:43:17 PM_
- [1.2.4-alpha.0.md](#1712289077137)  -  _4/5/2024, 10:51:17 AM_
- [1.2.3.md](#1712113111748)  -  _4/3/2024, 9:58:31 AM_
- [1.2.3-alpha.0.md](#1708244133476)  -  _2/18/2024, 3:15:33 PM_
- [1.2.2.md](#1705916741198)  -  _1/22/2024, 4:45:41 PM_
- [1.2.1.md](#1698744675112)  -  _10/31/2023, 4:31:15 PM_
- [1.1.4.md](#1691485942800)  -  _8/8/2023, 4:12:22 PM_
- [1.1.3.md](#1685119300328)  -  _5/26/2023, 11:41:40 PM_
- [1.1.2.md](#1680254562720)  -  _3/31/2023, 4:22:42 PM_
- [1.1.1.md](#1680247174205)  -  _3/31/2023, 2:19:34 PM_
- [1.1.0.md](#1676888737266)  -  _2/20/2023, 5:25:37 PM_
- [1.0.0.md](#1676439174807)  -  _2/15/2023, 12:32:54 PM_
- [1.0.0-alpha.1.md](#1676432367640)  -  _2/15/2023, 10:39:27 AM_
- [0.0.1.md](#1676278610141)  -  _2/13/2023, 3:56:50 PM_
- [0.0.1-alpha.2.md](#1676278281173)  -  _2/13/2023, 3:51:21 PM_

## Details

<a id="1731508666405"></a>
### 1.2.6-alpha.2

* fix: auto filter chatID is not valid before send (cbf2177)
  
<a id="1718788804520"></a>
### 1.2.6-alpha.1

* fix(bot): allow handle without lauch bot (4229ae6)
* fix: support to remove message in all sender (6070237)
* infra: update latest ymlr package (1b84541)
  
<a id="1718625351724"></a>
### 1.2.6-alpha.0

* fix: could not send a photo (8fa7403)
  
<a id="1713441980865"></a>
### 1.2.5

* fix(action,command,on,hears): bot handle not working (35d6c34)
  
<a id="1713440597299"></a>
### 1.2.4

* fix(sendPhoto,sendMediaGroup): add "filename" property (b4a77a9)
* fix(action,command,on,hears): bot is not working in some listeners (5412acc)
* chore: prerelease 1.2.4-alpha.0 (dab7917)
* feat: allow auto pin when send text, photo... (3973a24)
  
<a id="1712289077137"></a>
### 1.2.4-alpha.0

* feat: allow auto pin when send text, photo... (3973a24)
  
<a id="1712113111748"></a>
### 1.2.3

* fix: send photo, media with buffer and readable stream (5d54a37)
* chore: prerelease 1.2.3-alpha.0 (51e1798)
* feat: add pin/unpin tags (ffcceb7)
  
<a id="1708244133476"></a>
### 1.2.3-alpha.0

* feat: add pin/unpin tags (ffcceb7)
  
<a id="1705916741198"></a>
### 1.2.2

* feat(send-media-group): support send a file to telegram (dda2501)
  
<a id="1698744675112"></a>
### 1.2.1

* fix: support latest ymlr (9e79215)
  
<a id="1691485942800"></a>
### 1.1.4

* fix: could not send via chatIDs when use expression (3b6c4fe)
* dev: Replace pnpm to yarn (bf6acbb)
  
<a id="1685119300328"></a>
### 1.1.3

* ci: replace pnpm to yarn (7b4c096)
* feat: support send media group (f1c0d5e)
  
<a id="1680254562720"></a>
### 1.1.2

* fix: bot not close in sending method (aeb4d6b)
  
<a id="1680247174205"></a>
### 1.1.1

* feat: expose bot in sending method (fff188e)
* fix: Update input type in telegram listener (c5ab193)
* build: update dev env (73dbd38)
  
<a id="1676888737266"></a>
### 1.1.0

* refactor!: support ymlr^1.1.x (ccfb3c7)
  
<a id="1676439174807"></a>
### 1.0.0

* chore: prerelease 1.0.0-alpha.1 (67da7a0)
* refactor!: integrate with ymlr v1 (b356c70)
* chore: patch 0.0.1 (930855a)
* chore: prerelease 0.0.1-alpha.2 (2ee7ea9)
* ci: merge next/patch to one scene file (247f1d8)
* ci: auto create a new release (aee6fd0)
* ci: auto create a new tag (ee82078)
* ci: add script to update a new version (46486b9)
* Initial commit (0e64a42)
  
<a id="1676432367640"></a>
### 1.0.0-alpha.1

* refactor!: integrate with ymlr v1 (b356c70)
* chore: patch 0.0.1 (930855a)
  
<a id="1676278610141"></a>
### 0.0.1

* chore: prerelease 0.0.1-alpha.2 (2ee7ea9)
* ci: merge next/patch to one scene file (247f1d8)
* ci: auto create a new release (aee6fd0)
* ci: auto create a new tag (ee82078)
* ci: add script to update a new version (46486b9)
* Initial commit (0e64a42)
  
<a id="1676278281173"></a>
### 0.0.1-alpha.2

* ci: merge next/patch to one scene file (247f1d8)
* ci: auto create a new release (aee6fd0)
* ci: auto create a new tag (ee82078)
* ci: add script to update a new version (46486b9)
* Initial commit (0e64a42)

